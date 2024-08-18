package leaderboard

import (
	"bytes"
	"io"
	"net/http"
	"os"
	"testing"
	"time"

	"gopkg.in/yaml.v2"
)

// MockClient is our mock HTTP client
type MockClient struct {
	DoFunc func(req *http.Request) (*http.Response, error)
}

func (m *MockClient) Do(req *http.Request) (*http.Response, error) {
	return m.DoFunc(req)
}

func TestFetchLeaderboard(t *testing.T) {
	// Mock YAML data
	mockYAML := `
og:
  name: OG
  public_information_url: https://liquipedia.net/dota2/OG
liquid:
  name: Team Liquid
  public_information_url: https://liquipedia.net/dota2/Team_Liquid
`
	// Write mock YAML to a temporary file
	tmpfile, err := os.CreateTemp("", "team_info.yaml")
	if err != nil {
		t.Fatalf("Error creating temporary file: %v", err)
	}
	defer os.Remove(tmpfile.Name())

	if _, err := tmpfile.Write([]byte(mockYAML)); err != nil {
		t.Fatalf("Error writing to temporary file: %v", err)
	}
	if err := tmpfile.Close(); err != nil {
		t.Fatalf("Error closing temporary file: %v", err)
	}

	// Set the temporary file as the YAML file to be read
	err = os.Setenv("TEAM_INFO_FILE", tmpfile.Name())
	if err != nil {
		t.Fatal(err)
	}

	// Reinitialize tagToTeamInfoMap with the mock data
	tagToTeamInfoMap = map[string]TeamInfo{}
	yamlFile, _ := os.ReadFile(tmpfile.Name())
	err = yaml.Unmarshal(yamlFile, &tagToTeamInfoMap)
	if err != nil {
		t.Fatal(err)
	}

	// Create a mock client
	mockClient := &MockClient{
		DoFunc: func(req *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: 200,
				Body: io.NopCloser(bytes.NewBufferString(`
				{
					"leaderboard": [
						{
							"rank": 1,
							"name": "Player1",
							"team_id": 1,
							"team_tag": "og",
							"country": "US",
							"sponsor": "Sponsor1"
						},
						{
							"rank": 2,
							"name": "Player2",
							"team_id": 2,
							"team_tag": "liquid",
							"country": "UK",
							"sponsor": "Sponsor2"
						},
						{
							"rank": 3,
							"name": "Player3",
							"team_id": 3,
							"team_tag": "newteam",
							"country": "CA",
							"sponsor": "Sponsor3"
						}
					],
					"next_scheduled_post_time": 1628097600
				}`)),
			}, nil
		},
	}

	// Replace the client with our mock
	originalClient := Client
	Client = mockClient
	defer func() { Client = originalClient }()

	// Test the FetchLeaderboard function
	leaders, nextScheduledPostTime, err := FetchLeaderboard("test_region")

	// Check for errors
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Check number of leaders
	if len(leaders) != 3 {
		t.Errorf("Expected 3 leaders, got %d", len(leaders))
	}

	// Check next scheduled post time
	expectedTime := time.Unix(1628097600, 0)
	if nextScheduledPostTime != expectedTime {
		t.Errorf("Expected next scheduled post time %v, got %v", expectedTime, nextScheduledPostTime)
	}

	// Check the first leader (known team)
	if leaders[0].Rank != 1 ||
		leaders[0].Name != "Player1" ||
		leaders[0].TeamID != 1 ||
		leaders[0].TeamTag != "og" ||
		leaders[0].TeamName != "OG" ||
		leaders[0].TeamInfoUrl != "https://liquipedia.net/dota2/OG" ||
		leaders[0].Nationality != "US" ||
		leaders[0].Sponsor != "Sponsor1" {
		t.Errorf("First leader data doesn't match expected values")
	}

	// Check the second leader (known team)
	if leaders[1].Rank != 2 ||
		leaders[1].Name != "Player2" ||
		leaders[1].TeamID != 2 ||
		leaders[1].TeamTag != "liquid" ||
		leaders[1].TeamName != "Team Liquid" ||
		leaders[1].TeamInfoUrl != "https://liquipedia.net/dota2/Team_Liquid" ||
		leaders[1].Nationality != "UK" ||
		leaders[1].Sponsor != "Sponsor2" {
		t.Errorf("Second leader data doesn't match expected values")
	}

	// Check the third leader (unknown team)
	if leaders[2].Rank != 3 ||
		leaders[2].Name != "Player3" ||
		leaders[2].TeamID != 3 ||
		leaders[2].TeamTag != "newteam" ||
		leaders[2].TeamName != "Newteam" || // Capitalized team tag
		leaders[2].TeamInfoUrl != "" ||
		leaders[2].Nationality != "CA" ||
		leaders[2].Sponsor != "Sponsor3" {
		t.Errorf("Third leader data doesn't match expected values")
	}
}
