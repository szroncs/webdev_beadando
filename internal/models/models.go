package models

// Service represents a service offered by the company
type Service struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	Status      string  `json:"status"`
}

// Services is a collection of Service
type Services []Service

// Logo represents a client logo and testimonial
type Logo struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	Category        string `json:"category"`
	LogoURL         string `json:"logo_url"`
	TestimonialText string `json:"testimonial_text"`
	ShowcaseURL     string `json:"shocase_url"` // Kept as per plan, though typo noted
	ShowcaseImage   string `json:"shocase_image"`
	Date            string `json:"date"`
	Status          string `json:"status"`
}

// Logos is a collection of Logo
type Logos []Logo

// ContactRequest represents a persisted contact request
type ContactRequest struct {
	ID          int     `json:"id"`
	Timestamp   string  `json:"timestamp"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	PhoneNumber *string `json:"phone_number"`
	Email       string  `json:"email"`
	Message     string  `json:"message"`
	Status      string  `json:"status"`
}

// ContactRequests is a collection of ContactRequest
type ContactRequests []ContactRequest

// ContactFormRequest represents the form submission data
type ContactFormRequest struct {
	FirstName   string `json:"first_name" form:"first_name"`
	LastName    string `json:"last_name" form:"last_name"`
	PhoneNumber string `json:"phone_number" form:"phone_number"`
	Email       string `json:"email" form:"email"`
	Message     string `json:"message" form:"message"`
}
