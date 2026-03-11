package pip

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os/exec"
	"regexp"
	"strings"
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

// httpClient is a shared HTTP client with a timeout for all requests to PyPI.
var httpClient = &http.Client{Timeout: 10 * time.Second}

// SearchPackages queries the PyPI JSON API for the given package name.
// It returns metadata for the exact match and up to 5 close matches via a
// simple search against pypi.org/search (JSON Simple API).
func SearchPackages(query string) ([]SearchResult, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, fmt.Errorf("query is empty")
	}

	// First try exact match via /pypi/<name>/json
	results, _ := fetchExactMatch(query)

	// Also query the PyPI simple search endpoint to get additional matches.
	// PyPI's /search?q=<query>&format=columns returns HTML, so we use the
	// XML/JSON warehouse search API instead.
	extra, _ := fetchSearchResults(query)

	// Merge: exact first, then extras that aren't already included.
	seen := make(map[string]bool)
	for _, r := range results {
		seen[strings.ToLower(r.Name)] = true
	}
	for _, r := range extra {
		if !seen[strings.ToLower(r.Name)] {
			results = append(results, r)
			seen[strings.ToLower(r.Name)] = true
		}
	}

	return results, nil
}

// fetchExactMatch fetches metadata for an exact package name from PyPI.
func fetchExactMatch(name string) ([]SearchResult, error) {
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

var (
	snippetRe = regexp.MustCompile(`(?s)<a[^>]+class="package-snippet"[^>]*>(.+?)</a>`)
	nameRe    = regexp.MustCompile(`class="package-snippet__name"[^>]*>([^<]+)<`)
	versionRe = regexp.MustCompile(`class="package-snippet__version"[^>]*>([^<]+)<`)
	descRe    = regexp.MustCompile(`class="package-snippet__description"[^>]*>([^<]+)<`)
)

// fetchSearchResults scrapes pypi.org/search to get up to 20 results for query.
func fetchSearchResults(query string) ([]SearchResult, error) {
	searchURL := "https://pypi.org/search/?q=" + url.QueryEscape(query)
	resp, err := httpClient.Get(searchURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("pypi search status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var results []SearchResult
	for _, snippet := range snippetRe.FindAllString(string(body), 20) {
		name := strings.TrimSpace(reFirst(nameRe, snippet))
		if name == "" {
			continue
		}
		results = append(results, SearchResult{
			Name:        name,
			Version:     strings.TrimSpace(reFirst(versionRe, snippet)),
			Description: strings.TrimSpace(reFirst(descRe, snippet)),
		})
	}
	return results, nil
}

func reFirst(re *regexp.Regexp, s string) string {
	m := re.FindStringSubmatch(s)
	if len(m) < 2 {
		return ""
	}
	return m[1]
}

// GetPythonInfo returns the active Python and pip versions.
func GetPythonInfo() (PythonInfo, error) {
	var info PythonInfo

	pyOut, err := exec.Command("python", "--version").Output()
	if err != nil {
		// try stderr — Python 2 printed to stderr
		combined, err2 := exec.Command("python", "--version").CombinedOutput()
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
