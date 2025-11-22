package handlers

import (
	"html/template"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
	"webdev_beadando/internal/models"
	"webdev_beadando/internal/store"
)

type Handler struct {
	Store *store.Store
}

func NewHandler(s *store.Store) *Handler {
	return &Handler{Store: s}
}

func (h *Handler) Home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	services, err := h.Store.LoadServices("data/services.json")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		log.Printf("Error loading services: %v", err)
		return
	}

	logos, err := h.Store.LoadLogos("data/logos.json")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		log.Printf("Error loading logos: %v", err)
		return
	}

	data := struct {
		Services models.Services
		Logos    models.Logos
	}{
		Services: services,
		Logos:    logos,
	}

	renderTemplate(w, "home.html", data)
}

func (h *Handler) Logo(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/logo-")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	logos, err := h.Store.LoadLogos("data/logos.json")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		log.Printf("Error loading logos: %v", err)
		return
	}

	var foundLogo *models.Logo
	for _, logo := range logos {
		if logo.ID == id {
			foundLogo = &logo
			break
		}
	}

	if foundLogo == nil {
		http.NotFound(w, r)
		return
	}

	renderTemplate(w, "logo.html", foundLogo)
}

func (h *Handler) Contact(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		renderTemplate(w, "contact.html", nil)
		return
	}

	if r.Method == http.MethodPost {
		if err := r.ParseForm(); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		req := models.ContactRequest{
			Timestamp: time.Now().Format(time.RFC3339),
			FirstName: strings.TrimSpace(r.FormValue("first_name")),
			LastName:  strings.TrimSpace(r.FormValue("last_name")),
			Email:     strings.TrimSpace(r.FormValue("email")),
			Message:   strings.TrimSpace(r.FormValue("message")),
			Status:    "New",
		}

		phone := strings.TrimSpace(r.FormValue("phone_number"))
		if phone != "" {
			req.PhoneNumber = &phone
		}

		// Validation
		if !isValidName(req.FirstName) || !isValidName(req.LastName) {
			http.Error(w, "Invalid name format", http.StatusBadRequest)
			return
		}
		if !isValidEmail(req.Email) {
			http.Error(w, "Invalid email format", http.StatusBadRequest)
			return
		}
		if len(req.Message) < 10 {
			http.Error(w, "Message too short", http.StatusBadRequest)
			return
		}
		if req.PhoneNumber != nil && !isValidPhone(*req.PhoneNumber) {
			http.Error(w, "Invalid phone number", http.StatusBadRequest)
			return
		}

		if err := h.Store.SaveContactRequest("data/contact_request.json", req); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Printf("Error saving contact request: %v", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Thank you for your message!"))
	}
}

func renderTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
	files := []string{
		"templates/layout.html",
		"templates/" + tmpl,
	}

	t, err := template.ParseFiles(files...)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		log.Printf("Error parsing templates: %v", err)
		return
	}

	if err := t.ExecuteTemplate(w, "layout", data); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		log.Printf("Error executing template: %v", err)
	}
}

// Validation helpers
func isValidName(name string) bool {
	matched, _ := regexp.MatchString(`^[\p{L}\s]+$`, name)
	return matched
}

func isValidEmail(email string) bool {
	matched, _ := regexp.MatchString(`^[^\s@]+@[^\s@]+\.[^\s@]+$`, email)
	return matched
}

func isValidPhone(phone string) bool {
	if phone == "" {
		return true
	}
	matched, _ := regexp.MatchString(`^[0-9\s\-+]+$`, phone)
	if !matched {
		return false
	}
	digitCount := 0
	for _, c := range phone {
		if c >= '0' && c <= '9' {
			digitCount++
		}
	}
	return digitCount >= 5
}
