package store

import (
	"os"
	"testing"
	"webdev_beadando/internal/models"
)

func TestLoadServices(t *testing.T) {
	// Create a temporary file
	content := `[{"id": 1, "name": "Test Service", "price": 100.0}]`
	tmpfile, err := os.CreateTemp("", "services.json")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(tmpfile.Name())

	if _, err := tmpfile.Write([]byte(content)); err != nil {
		t.Fatal(err)
	}
	if err := tmpfile.Close(); err != nil {
		t.Fatal(err)
	}

	store := NewStore()
	services, err := store.LoadServices(tmpfile.Name())
	if err != nil {
		t.Fatalf("LoadServices failed: %v", err)
	}

	if len(services) != 1 {
		t.Errorf("Expected 1 service, got %d", len(services))
	}
	if services[0].Name != "Test Service" {
		t.Errorf("Expected service name 'Test Service', got '%s'", services[0].Name)
	}
}

func TestSaveContactRequest(t *testing.T) {
	tmpfile, err := os.CreateTemp("", "contact_requests.json")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(tmpfile.Name())
	tmpfile.Close()

	store := NewStore()
	req := models.ContactRequest{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "john@example.com",
		Message:   "Hello",
	}

	if err := store.SaveContactRequest(tmpfile.Name(), req); err != nil {
		t.Fatalf("SaveContactRequest failed: %v", err)
	}

	// Verify content
	content, err := os.ReadFile(tmpfile.Name())
	if err != nil {
		t.Fatal(err)
	}

	if len(content) == 0 {
		t.Error("File is empty after save")
	}
}
