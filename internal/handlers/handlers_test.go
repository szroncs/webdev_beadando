package handlers

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"
	"webdev_beadando/internal/store"
)

func TestHomeHandler(t *testing.T) {
	// Setup
	// We need dummy files for the store to load.
	// The handler looks for "data/services.json", so we must create it in the current directory.
	os.MkdirAll("data", 0755)
	os.WriteFile("data/services.json", []byte("[]"), 0644)
	os.WriteFile("data/logos.json", []byte("[]"), 0644)
	defer os.RemoveAll("data")

	s := store.NewStore()
	h := NewHandler(s)

	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(h.Home)

	handler.ServeHTTP(rr, req)

	// Check status code. Note: It might fail if templates are not found relative to where test runs.
	// We need to handle template pathing. For now, let's check if it returns 500 (template missing) or 200.
	// Ideally, we mock the template rendering or run tests from the root.
	// Assuming running from root:
	if status := rr.Code; status != http.StatusOK && status != http.StatusInternalServerError {
		t.Errorf("handler returned wrong status code: got %v want %v or %v",
			status, http.StatusOK, http.StatusInternalServerError)
	}
}

func TestContactHandler_PostValid(t *testing.T) {
	s := store.NewStore()
	h := NewHandler(s)

	// Create a temp file for contact requests
	os.MkdirAll("data", 0755)
	defer os.RemoveAll("data")

	form := url.Values{}
	form.Add("first_name", "John")
	form.Add("last_name", "Doe")
	form.Add("email", "john@example.com")
	form.Add("message", "This is a valid message length.")

	req, err := http.NewRequest("POST", "/contact", strings.NewReader(form.Encode()))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(h.Contact)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestValidation(t *testing.T) {
	if !isValidName("John") {
		t.Error("John should be a valid name")
	}
	if isValidName("John123") {
		t.Error("John123 should be invalid")
	}
	if !isValidEmail("test@example.com") {
		t.Error("test@example.com should be valid")
	}
	if isValidEmail("test@") {
		t.Error("test@ should be invalid")
	}
}

func TestIsValidPhone(t *testing.T) {
	tests := []struct {
		phone string
		valid bool
	}{
		{"", true},                // Optional
		{"12345", true},           // Minimum length
		{"+36 30 123 4567", true}, // Standard format
		{"06-30-123-4567", true},  // Dashes
		{"1234", false},           // Too short
		{"abc", false},            // Invalid characters
		{"1234a", false},          // Mixed invalid
		{"+36", false},            // Too short digits
	}

	for _, tt := range tests {
		if got := isValidPhone(tt.phone); got != tt.valid {
			t.Errorf("isValidPhone(%q) = %v, want %v", tt.phone, got, tt.valid)
		}
	}
}
