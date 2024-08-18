package leaderboard

import (
	"sync"
	"time"
)

type RegionCache struct {
	mu                    sync.RWMutex
	leaders               []Leader
	lastFetch             time.Time
	nextScheduledPostTime time.Time
}

type Cache struct {
	regions map[string]*RegionCache
}

func NewCache() *Cache {
	cache := &Cache{
		regions: make(map[string]*RegionCache),
	}
	regions := []string{"americas", "europe", "se_asia", "china"}
	for _, region := range regions {
		cache.regions[region] = &RegionCache{}
	}
	return cache
}

func (c *Cache) GetRegion(region string) (*RegionCache, bool) {
	regionCache, ok := c.regions[region]
	return regionCache, ok
}

func (rc *RegionCache) Get() ([]Leader, time.Time, time.Time, bool) {
	rc.mu.RLock()
	defer rc.mu.RUnlock()
	return rc.leaders, rc.nextScheduledPostTime, rc.lastFetch, !rc.lastFetch.IsZero()
}

func (rc *RegionCache) Set(leaders []Leader, nextScheduledPostTime time.Time) {
	rc.mu.Lock()
	defer rc.mu.Unlock()
	rc.leaders = leaders
	rc.lastFetch = time.Now()
	rc.nextScheduledPostTime = nextScheduledPostTime
}
