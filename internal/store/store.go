package store

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"webdev_beadando/internal/models"
)

// Store handles data persistence
type Store struct {
	mu sync.RWMutex
}

// NewStore creates a new Store instance
func NewStore() *Store {
	return &Store{}
}

// LoadServices reads services from the JSON file
func (s *Store) LoadServices(path string) (models.Services, error) {
	// Read-only, but good practice to lock if we were caching
	file, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read services file: %w", err)
	}

	var services models.Services
	if err := json.Unmarshal(file, &services); err != nil {
		return nil, fmt.Errorf("failed to unmarshal services: %w", err)
	}

	return services, nil
}

// LoadLogos reads logos from the JSON file
func (s *Store) LoadLogos(path string) (models.Logos, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read logos file: %w", err)
	}

	var logos models.Logos
	if err := json.Unmarshal(file, &logos); err != nil {
		return nil, fmt.Errorf("failed to unmarshal logos: %w", err)
	}

	return logos, nil
}

// SaveContactRequest appends a new contact request to the JSON file safely
func (s *Store) SaveContactRequest(path string, req models.ContactRequest) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Read existing requests
	var requests models.ContactRequests
	file, err := os.ReadFile(path)
	if err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to read contact requests file: %w", err)
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &requests); err != nil {
			return fmt.Errorf("failed to unmarshal contact requests: %w", err)
		}
	}

	// Assign ID
	req.ID = len(requests) + 1
	requests = append(requests, req)

	// Write back to file
	data, err := json.MarshalIndent(requests, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal contact requests: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("failed to write contact requests file: %w", err)
	}

	return nil
}
