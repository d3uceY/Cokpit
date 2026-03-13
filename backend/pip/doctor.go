package pip

import (
	"fmt"
	"net/http"
	"strings"
	"time"
)

// DoctorCheck represents a single diagnostic check result.
type DoctorCheck struct {
	Name    string `json:"name"`
	Status  string `json:"status"`  // "ok" | "warn" | "fail"
	Detail  string `json:"detail"`  // version, path, or error message
	FixURL  string `json:"fixUrl"`  // link to fix page, if applicable
	FixHint string `json:"fixHint"` // short install instruction
}

// DoctorReport is the full result of RunDoctor.
type DoctorReport struct {
	Checks []DoctorCheck `json:"checks"`
	OK     bool          `json:"ok"` // true only if all checks are "ok" or "warn"
}

// RunDoctor runs all diagnostic checks and returns a report.
func RunDoctor() DoctorReport {
	checks := []DoctorCheck{
		checkPython(),
		checkPip(),
		checkPyPIReachability(),
	}

	allOK := true
	for _, c := range checks {
		if c.Status == "fail" {
			allOK = false
			break
		}
	}

	return DoctorReport{Checks: checks, OK: allOK}
}

func checkPython() DoctorCheck {
	out, err := python("--version").CombinedOutput()
	if err != nil {
		return DoctorCheck{
			Name:    "Python",
			Status:  "fail",
			Detail:  "python executable not found on PATH",
			FixURL:  "https://www.python.org/downloads/",
			FixHint: "Download and install Python from python.org, then make sure it is added to your PATH.",
		}
	}

	raw := strings.TrimSpace(string(out))
	version := strings.TrimPrefix(raw, "Python ")

	// Warn if Python 2
	if strings.HasPrefix(version, "2.") {
		return DoctorCheck{
			Name:    "Python",
			Status:  "warn",
			Detail:  fmt.Sprintf("Python %s (Python 2 is unsupported)", version),
			FixURL:  "https://www.python.org/downloads/",
			FixHint: "Upgrade to Python 3.8 or later for full pip support.",
		}
	}

	path, _ := python("-c", "import sys; print(sys.executable)").Output()
	detail := fmt.Sprintf("Python %s — %s", version, strings.TrimSpace(string(path)))

	return DoctorCheck{Name: "Python", Status: "ok", Detail: detail}
}

func checkPip() DoctorCheck {
	out, err := pip("--version").Output()
	if err != nil {
		return DoctorCheck{
			Name:    "pip",
			Status:  "fail",
			Detail:  "pip module not found",
			FixURL:  "https://pip.pypa.io/en/stable/installation/",
			FixHint: "Run: python -m ensurepip --upgrade",
		}
	}

	// "pip 25.0 from /path (python 3.x)"
	parts := strings.Fields(strings.TrimSpace(string(out)))
	version := "unknown"
	if len(parts) >= 2 {
		version = parts[1]
	}

	return DoctorCheck{
		Name:   "pip",
		Status: "ok",
		Detail: fmt.Sprintf("pip %s", version),
	}
}

func checkPyPIReachability() DoctorCheck {
	client := &http.Client{Timeout: 8 * time.Second}
	resp, err := client.Head("https://pypi.org/simple/")
	if err != nil {
		return DoctorCheck{
			Name:    "PyPI network",
			Status:  "fail",
			Detail:  "Cannot reach pypi.org: " + err.Error(),
			FixURL:  "https://status.python.org/",
			FixHint: "Check your internet connection or corporate proxy settings.",
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 500 {
		return DoctorCheck{
			Name:    "PyPI network",
			Status:  "warn",
			Detail:  fmt.Sprintf("PyPI returned HTTP %d", resp.StatusCode),
			FixURL:  "https://status.python.org/",
			FixHint: "PyPI may be experiencing issues. Check status.python.org.",
		}
	}

	return DoctorCheck{
		Name:   "PyPI network",
		Status: "ok",
		Detail: "pypi.org is reachable",
	}
}
