package pip

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// xmlValue is a recursive XML-RPC value node.
type xmlValue struct {
	String  string     `xml:"string"`
	Int     string     `xml:"int"`
	Structs []xmlMember `xml:"struct>member"`
	Array   []xmlValue  `xml:"array>data>value"`
}

type xmlMember struct {
	Name  string   `xml:"name"`
	Value xmlValue `xml:"value"`
}

type xmlRPCResponse struct {
	Params []xmlValue `xml:"params>param>value>array>data>value"`
}

// parseXMLRPCSearchResponse parses the XMLRPC response from pypi.org/pypi search.
func parseXMLRPCSearchResponse(resp *http.Response) ([]SearchResult, error) {
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var rpc xmlRPCResponse
	if err := xml.Unmarshal(body, &rpc); err != nil {
		return nil, fmt.Errorf("xmlrpc parse error: %w", err)
	}

	var results []SearchResult
	for _, item := range rpc.Params {
		var name, version, summary string
		for _, m := range item.Structs {
			switch m.Name {
			case "name":
				name = strings.TrimSpace(m.Value.String)
			case "version":
				version = strings.TrimSpace(m.Value.String)
			case "summary":
				summary = strings.TrimSpace(m.Value.String)
			}
		}
		if name != "" {
			results = append(results, SearchResult{
				Name:        name,
				Version:     version,
				Description: summary,
			})
		}
		if len(results) >= 20 {
			break
		}
	}
	return results, nil
}
