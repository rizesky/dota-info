package leaderboard

import (
	"encoding/json"
	"fmt"
	"github.com/rizesky/dota-info/pkg/httputil"
	"io"
	"time"
)

func FetchLeaderboard(region string) ([]Leader, time.Time, error) {
	url := fmt.Sprintf("https://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=%s&leaderboard=0", region)

	resp, err := httputil.GetWithUserAgent(url)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("error making request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("error reading response body: %v", err)
	}

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
		leaders = append(leaders, Leader{
			Rank:    entry.Rank,
			Name:    entry.Name,
			TeamID:  entry.TeamID,
			TeamTag: entry.TeamTag,
			Country: entry.Country,
			Sponsor: entry.Sponsor,
		})
	}

	nextScheduledPostTime := time.Unix(leaderboardResp.NextScheduledPostTime, 0)

	return leaders, nextScheduledPostTime, nil
}
