package main

import (
	"context"
	"errors"
	"github.com/rizesky/dota-info/internal/api"
	"github.com/rizesky/dota-info/internal/leaderboard"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	//ctx, cancel := context.WithCancel(context.Background())
	//defer cancel()

	cache := leaderboard.NewCache()
	//var wg sync.WaitGroup

	//We disable the worker for now, fly.io keep saying this is excess capacity
	//regions := []string{"americas", "europe", "se_asia", "china"}
	//for _, region := range regions {
	//	wg.Add(1)
	//	go worker.Run(ctx, region, cache, &wg)
	//}

	mux := http.NewServeMux()

	//Api handlers
	mux.HandleFunc("/api/leaderboard", api.CorsMiddleware(api.GetLeaderboardHandler(cache)))

	//Web static files
	fs := http.FileServer(http.Dir("./web-ui/build"))
	mux.Handle("/", http.StripPrefix("/", fs))

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	go func() {
		log.Println("Starting server on :8080")
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	<-stop

	log.Println("Shutting down gracefully...")

	shutdownCtx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("Error shutting down server: %v", err)
	}

	//cancel()
	//wg.Wait()

	log.Println("Graceful shutdown complete")
}
