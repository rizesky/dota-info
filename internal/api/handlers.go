package api

import (
	"encoding/json"
	"github.com/rizesky/dota-info/internal/leaderboard"
	"net/http"
)

func GetLeaderboardHandler(cache *leaderboard.Cache) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		region := r.URL.Query().Get("region")
		if region == "" {
			http.Error(w, "Region parameter is required", http.StatusBadRequest)
			return
		}

		regionCache, ok := cache.GetRegion(region)
		if !ok {
			http.Error(w, "Invalid region", http.StatusBadRequest)
			return
		}

		leaders, nextScheduledPostTime, lastFetchTime, ok := regionCache.Get()
		// We comment this for now, since fly.io keep saying this excess capacity
		//if !ok {
		//	http.Error(w, "Data not available yet for this region", http.StatusServiceUnavailable)
		//	return
		//}

		if !ok {
			leaderboardData, nextFetchTime, err := leaderboard.FetchLeaderboard(region)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			regionCache.Set(leaderboardData, nextFetchTime)
			leaders, nextScheduledPostTime, lastFetchTime, _ = regionCache.Get()
		}

		response := leaderboard.APIResponse{
			Leaders:               leaders,
			NextScheduledPostTime: nextScheduledPostTime.Unix(),
			LastFetchTime:         lastFetchTime.Unix(),
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
