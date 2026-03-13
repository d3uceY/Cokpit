package pip

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"
	"sync"
	"time"
)

// SearchResult represents a package found on PyPI.
type SearchResult struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	Description string `json:"description"`
	Author      string `json:"author"`
	HomePage    string `json:"homePage"`
}

// PythonInfo holds the active Python and pip versions.
type PythonInfo struct {
	PythonVersion string `json:"pythonVersion"`
	PipVersion    string `json:"pipVersion"`
}

var httpClient = &http.Client{Timeout: 30 * time.Second}

// — Simple index cache —

var (
	simpleIndexMu    sync.RWMutex
	simpleIndexNames []string // normalised (lowercase, hyphen-normalised)
	simpleIndexRaw   []string // original casing from PyPI
	simpleIndexReady bool
)

type simpleIndexResponse struct {
	Projects []struct {
		Name string `json:"name"`
	} `json:"projects"`
}

// loadSimpleIndex fetches the full package name list from the PyPI Simple JSON
// API and caches it for the lifetime of the process. Errors are not cached,
// so the next search will retry if a previous attempt failed.
func loadSimpleIndex() ([]string, []string, error) {
	// Fast path: already loaded.
	simpleIndexMu.RLock()
	if simpleIndexReady {
		raw, norm := simpleIndexRaw, simpleIndexNames
		simpleIndexMu.RUnlock()
		return raw, norm, nil
	}
	simpleIndexMu.RUnlock()

	// Slow path: fetch the index.
	simpleIndexMu.Lock()
	defer simpleIndexMu.Unlock()
	// Double-check after acquiring write lock.
	if simpleIndexReady {
		return simpleIndexRaw, simpleIndexNames, nil
	}

	req, err := http.NewRequest("GET", "https://pypi.org/simple/", nil)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Accept", "application/vnd.pypi.simple.v1+json")

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, nil, fmt.Errorf("simple index returned status %d", resp.StatusCode)
	}

	var index simpleIndexResponse
	if err := json.NewDecoder(resp.Body).Decode(&index); err != nil {
		return nil, nil, err
	}

	raw := make([]string, len(index.Projects))
	norm := make([]string, len(index.Projects))
	for i, p := range index.Projects {
		raw[i] = p.Name
		norm[i] = normalise(p.Name)
	}

	simpleIndexRaw = raw
	simpleIndexNames = norm
	simpleIndexReady = true
	return raw, norm, nil
}

// normalise lowercases and replaces underscores/dots with hyphens (PEP 503).
func normalise(s string) string {
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, "_", "-")
	s = strings.ReplaceAll(s, ".", "-")
	return s
}

// WarmSimpleIndex pre-fetches the PyPI Simple index in the background.
// Call this once at startup so the first search is instant.
func WarmSimpleIndex() {
	loadSimpleIndex() //nolint:errcheck
}

// SearchPackages searches the PyPI Simple index for packages matching query,
// then fetches metadata for the top results in parallel.
func SearchPackages(query string) ([]SearchResult, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, fmt.Errorf("query is empty")
	}

	raw, norm, err := loadSimpleIndex()
	if err != nil {
		// fallback: single exact-match lookup
		return fetchPackageMetadata(query)
	}

	normQuery := normalise(query)

	// Score each name: exact > prefix > contains.
	type scored struct {
		name  string
		score int
	}
	var matches []scored
	for i, n := range norm {
		var sc int
		if n == normQuery {
			sc = 3
		} else if strings.HasPrefix(n, normQuery) {
			sc = 2
		} else if strings.Contains(n, normQuery) {
			sc = 1
		} else {
			continue
		}
		matches = append(matches, scored{raw[i], sc})
	}

	sort.SliceStable(matches, func(i, j int) bool {
		if matches[i].score != matches[j].score {
			return matches[i].score > matches[j].score
		}
		return len(matches[i].name) < len(matches[j].name)
	})

	const maxResults = 20
	if len(matches) > maxResults {
		matches = matches[:maxResults]
	}

	// Fetch metadata in parallel.
	type result struct {
		idx int
		res SearchResult
		err error
	}
	ch := make(chan result, len(matches))
	for i, m := range matches {
		go func(idx int, name string) {
			results, err := fetchPackageMetadata(name)
			if err != nil || len(results) == 0 {
				ch <- result{idx: idx, err: err}
				return
			}
			ch <- result{idx: idx, res: results[0]}
		}(i, m.name)
	}

	out := make([]SearchResult, len(matches))
	for range matches {
		r := <-ch
		if r.err == nil {
			out[r.idx] = r.res
		}
	}

	// Remove empty slots (failed fetches).
	filtered := out[:0]
	for _, r := range out {
		if r.Name != "" {
			filtered = append(filtered, r)
		}
	}
	return filtered, nil
}

// fetchPackageMetadata fetches metadata for a single package from the PyPI JSON API.
func fetchPackageMetadata(name string) ([]SearchResult, error) {
	url := fmt.Sprintf("https://pypi.org/pypi/%s/json", name)
	resp, err := httpClient.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("status %d", resp.StatusCode)
	}

	var payload struct {
		Info struct {
			Name        string            `json:"name"`
			Version     string            `json:"version"`
			Summary     string            `json:"summary"`
			Author      string            `json:"author"`
			HomePage    string            `json:"home_page"`
			ProjectURLs map[string]string `json:"project_urls"`
		} `json:"info"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return nil, err
	}
	homePage := payload.Info.HomePage
	if homePage == "" {
		if u, ok := payload.Info.ProjectURLs["Homepage"]; ok {
			homePage = u
		}
	}
	return []SearchResult{{
		Name:        payload.Info.Name,
		Version:     payload.Info.Version,
		Description: payload.Info.Summary,
		Author:      payload.Info.Author,
		HomePage:    homePage,
	}}, nil
}

// GetPythonInfo returns the active Python and pip versions.
func GetPythonInfo() (PythonInfo, error) {
	var info PythonInfo

	pyOut, err := python("--version").Output()
	if err != nil {
		// try stderr — Python 2 printed to stderr
		combined, err2 := python("--version").CombinedOutput()
		if err2 != nil {
			info.PythonVersion = "unknown"
		} else {
			info.PythonVersion = strings.TrimSpace(strings.TrimPrefix(string(combined), "Python "))
		}
	} else {
		info.PythonVersion = strings.TrimSpace(strings.TrimPrefix(string(pyOut), "Python "))
	}

	pipOut, err := pip("--version").Output()
	if err != nil {
		info.PipVersion = "unknown"
	} else {
		// "pip 25.3 from ... (python 3.14)" → "25.3"
		parts := strings.Fields(string(pipOut))
		if len(parts) >= 2 {
			info.PipVersion = parts[1]
		}
	}

	return info, nil
}
