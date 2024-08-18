package leaderboard

import (
	"encoding/json"
	"fmt"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"gopkg.in/yaml.v2"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// HTTPClient interface
type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

// Client Default HTTP client
var Client HTTPClient = &http.Client{}

// TeamInfo struct for holding data from the parsed team_info.yaml
type TeamInfo struct {
	Name                 string `yaml:"name"`
	PublicInformationUrl string `yaml:"public_information_url"`
}

var tagToTeamInfoMap = map[string]TeamInfo{}

func init() {
	log.Println("Loading team info from team_info.yaml")
	// Load the YAML file
	yamlFile, err := os.ReadFile("team_info.yaml")
	if err != nil {
		panic(fmt.Sprintf("Error reading YAML file: %v", err))
	}

	// Parse the YAML into our map
	err = yaml.Unmarshal(yamlFile, &tagToTeamInfoMap)
	if err != nil {
		panic(fmt.Sprintf("Error parsing YAML: %v", err))
	}
}

func getTeamInfo(teamTag string) TeamInfo {
	tagLower := strings.ToLower(teamTag)
	info, ok := tagToTeamInfoMap[tagLower]
	if !ok {
		info = TeamInfo{
			Name: cases.Title(language.English, cases.NoLower).String(tagLower),
		}
	}
	return info
}

func FetchLeaderboard(region string) ([]Leader, time.Time, error) {
	url := fmt.Sprintf("https://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=%s&leaderboard=0", region)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

	resp, err := Client.Do(req)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("error making request: %v", err)
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)

	var leaderboardResp DotaApiLeaderboardResponse
	err = json.Unmarshal(body, &leaderboardResp)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("error unmarshalling JSON: %v", err)
	}

	leaders := make([]Leader, 0, 10)
	for i, entry := range leaderboardResp.Leaderboard {
		if i >= 10 {
			break
		}
		teamDetails := getTeamInfo(entry.TeamTag)
		leaders = append(leaders, Leader{
			Rank:        entry.Rank,
			Name:        entry.Name,
			TeamID:      entry.TeamID,
			TeamTag:     entry.TeamTag,
			TeamName:    teamDetails.Name,
			TeamInfoUrl: teamDetails.PublicInformationUrl,
			Nationality: entry.Country,
			Sponsor:     entry.Sponsor,
		})
	}

	nextScheduledPostTime := time.Unix(leaderboardResp.NextScheduledPostTime, 0)

	return leaders, nextScheduledPostTime, nil
}
