package leaderboard

type DotaApiLeaderboardResponse struct {
	TimePosted            int64 `json:"time_posted"`
	NextScheduledPostTime int64 `json:"next_scheduled_post_time"`
	ServerTime            int64 `json:"server_time"`
	Leaderboard           []struct {
		Rank    int    `json:"rank"`
		Name    string `json:"name"`
		TeamID  int    `json:"team_id"`
		TeamTag string `json:"team_tag"`
		Country string `json:"country"`
		Sponsor string `json:"sponsor"`
	} `json:"leaderboard"`
}

type Leader struct {
	Rank    int    `json:"rank"`
	Name    string `json:"name"`
	TeamID  int    `json:"teamId"`
	TeamTag string `json:"teamTag"`
	Country string `json:"country"`
	Sponsor string `json:"sponsor"`
}

type APIResponse struct {
	Leaders               []Leader `json:"leaders"`
	NextScheduledPostTime int64    `json:"nextScheduledPostTime"`
	LastFetchTime         int64    `json:"lastFetchTime"`
}
