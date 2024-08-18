package worker

import (
	"context"
	"github.com/rizesky/dota-info/internal/leaderboard"
	"log"
	"sync"
	"time"
)

func Run(ctx context.Context, region string, cache *leaderboard.Cache, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			log.Printf("Worker for region %s is shutting down", region)
			return
		default:
			leaders, nextScheduledPostTime, err := leaderboard.FetchLeaderboard(region)
			if err != nil {
				log.Printf("Error fetching leaderboard for %s: %v", region, err)
				time.Sleep(1 * time.Minute)
				continue
			}

			regionCache, _ := cache.GetRegion(region)
			regionCache.Set(leaders, nextScheduledPostTime)
			log.Printf("Updated cache for %s with %d leaders. Next update scheduled at %v", region, len(leaders), nextScheduledPostTime)

			sleepDuration := time.Until(nextScheduledPostTime)
			if sleepDuration < 0 {
				sleepDuration = 1 * time.Minute
			}

			timer := time.NewTimer(sleepDuration)
			select {
			case <-ctx.Done():
				if !timer.Stop() {
					<-timer.C
				}
				log.Printf("Worker for region %s is shutting down", region)
				return
			case <-timer.C:
				// Continue to the next iteration
			}
		}
	}
}
