package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"webdev_beadando/internal/handlers"
	"webdev_beadando/internal/store"
)

func main() {
	// Initialize store
	s := store.NewStore()
	h := handlers.NewHandler(s)

	// Setup routing
	mux := http.NewServeMux()

	// Static files
	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// Application routes

	// Handle logo routes dynamically in the handler or register specific ones if needed.
	// Since we have /logo-{id}, we can use a pattern or handle in root.
	// However, standard mux doesn't support regex patterns easily until Go 1.22.
	// We will handle it by checking the prefix in the Home handler or a specific catch-all.
	// Actually, let's register a specific handler for /logo- prefix if possible,
	// but standard mux matches exact or prefix.
	// A cleaner way for standard lib < 1.22 is to handle in "/" and check path,
	// OR register "/logo-" if we want to catch all logo requests? No, "/logo-1" is distinct.
	// The simplest way with standard lib is to handle it in the root handler or use a wrapper.
	// BUT, I implemented `h.Logo` which expects to be called.
	// Let's register a pattern that matches.
	// Since we can't do regex, let's route everything through a middleware or just handle it.
	// Wait, I can register "/" and dispatch based on path.
	// Let's modify the routing slightly to be robust.

	// We'll wrap the main handler to dispatch
	mainHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			h.Home(w, r)
			return
		}
		if r.URL.Path == "/contact" {
			h.Contact(w, r)
			return
		}
		if len(r.URL.Path) > 6 && r.URL.Path[:6] == "/logo-" {
			h.Logo(w, r)
			return
		}
		// Serve static files if not caught above?
		// No, static is handled by a separate handler if we register it.
		// But "/" matches everything.
		// So we should register "/static/" explicitly (done above).
		// And "/" for everything else.

		// If it's none of the above, 404.
		// The Home handler currently checks for "/" and returns 404 otherwise.
		// So we can just register "/" to a dispatcher.

		if r.URL.Path == "/" {
			h.Home(w, r)
		} else if len(r.URL.Path) > 6 && r.URL.Path[:6] == "/logo-" {
			h.Logo(w, r)
		} else {
			http.NotFound(w, r)
		}
	})

	mux.Handle("/", mainHandler)

	// Server configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	// Graceful shutdown
	go func() {
		log.Printf("Server starting on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe(): %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}
