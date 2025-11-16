# Planning out the web application

## Routing

We need a home route `/`. Everything not handled by the other routes, should fall back to the home route. 

Dedicated pages:
- A logo page route `/logo-1`, `/logo-2` ... `/logo-n`
- A contact us route `/contact` for the form


## Handlers

We will use HTTP verb specific handlers.
- For HOME -> GET
- For LOGO{id} -> GET
- For CONTACT -> GET, POST


# Pages

## HOME



### Hero section
Location: it's part of the root url `/` and have the in page anchor of #hero.

- CTA1 - Services button pointing to the [services section](#services-section)
- CTA2 - Conact us button pointing to the [about us section](#about-us-section)


### About us section   
Location: it's part of the root url `/` and have the in page anchor of #about-us.

From here the user can navigate to the [Contact us form](#contact-us-form), and submit a contact request. 

### Services section
Location: it's part of the root url `/` and have the in page anchor of #services.

Services are loaded from the [`services.json`](./services.json) file. Each service and the related information is renderd to a dedicated card on a carousel.

Example json structure:
```json
[
  {
    "id": 101,
    "name": "Full Stack Web Development",
    "description": "Complete end-to-end development of dynamic web applications using modern frameworks (e.g., React, Node.js, Python/Django). Includes database design and deployment.",
    "category": "Software Development",
    "price": 8500.00,
    "status": "Available"
  },
  {
    "id": 102,
    "name": "Cloud Infrastructure Setup",
    "description": "Design and deployment of scalable cloud environments (AWS, Azure, or GCP). Focus on security, cost-optimization, and high availability (HA).",
    "category": "DevOps & IT",
    "price": 4200.00,
    "status": "Available"
  }
]
```

Go struct:
```go
type Service struct {
    ID          int      `json:"id"`
    Name        string   `json:"name"`
    Description string   `json:"description"`
    Category    string   `json:"category"`
    Price       float64  `json:"price"` // Use float64 for currency
    Status      string   `json:"status"`
}

// Top-level structure for the file
type Services []Service
```


## Contact us form
Location: it has it's dedicated url `/contact`.

This is a form with the following fields:
- First Name
    - Input validation: must only contain letters and spaces. Numbers and special characters are not allowed.
- Last Name
    - Input validation: must only contain letters and spaces. Numbers and special characters are not allowed.
- Phone number (optional)
    - Input validation: Only numbers, space, '-' and '+' characters are allowed. Must conatain at least 5 numbers.
- Email
    - Input validation: Must be a valid email address.
- Message
    - Input validation: Must be at least 10 characters long.
- CTA_1 - Submit button
    - By submitting the form, it sends a POST request to the Contract end-point.
    - After receiving http 200 the "Thank you for your message!" will apear on the form.
- CTA_2 - Cancle button
    - Navigates back to the main page #services section.

Submitted contact requests are persisted into a [`contact_request.json`](./contact_request.json) file. If the file already exists, it is appended by the new record.

Example json structure:
```json
[
  {
    "id": 1,
    "timestamp": "2025-11-16T19:45:00Z",
    "first_name": "Alice",
    "last_name": "Johnson",
    "phone_number": "555-123-4567",
    "email": "alice.j@example.com",
    "message": "We are interested in your cloud infrastructure setup service. Could we schedule a consultation next week?",
    "status": "New"
  },
  {
    "id": 2,
    "timestamp": "2025-11-15T10:22:30Z",
    "first_name": "Bob",
    "last_name": "Smith",
    "phone_number": null,
    "email": "bob.s@anotherco.org",
    "message": "I need pricing details for the Data Analytics Reporting service. Please send a detailed quote.",
    "status": "In Progress"
  }
]
```

Go struct Persisted Data Structure:
```go
type ContactRequest struct {
    ID          int    `json:"id"`
    Timestamp   string `json:"timestamp"`
    FirstName   string `json:"first_name"`
    LastName    string `json:"last_name"`
    PhoneNumber *string `json:"phone_number"` // Pointer allows it to be null/omitted
    Email       string `json:"email"`
    Message     string `json:"message"`
    Status      string `json:"status"`
}

// Top-level structure for the file
type ContactRequests []ContactRequest
```
Go struct Form Data Structure:
```go
type ContactFormRequest struct {
    FirstName string `json:"first_name" form:"first_name"`
    LastName  string `json:"last_name" form:"last_name"`
    Phone     string `json:"phone_number" form:"phone_number"` // May need to handle optionality
    Email     string `json:"email" form:"email"`
    Message   string `json:"message" form:"message"`
}
```


## Logo cloud
Location: it's part of the root url `/` and have the in page anchor of #logo-cloud.

Logos are on a carusel. By clicking any of them the corresponding page will be loaded. Logo cloud is defined by the [`logos.json`](./logos.json) file.

Example json structure:
```json
[
    {
        "id": 1,
        "name": "Innovatech Solutions",
        "category": "Technology",
        "logo_url": "static/images/logos/innovatech_logo.png",
        "testimonial_text": "Working with Innovatech was a transformative experience; their commitment to quality and deadlines is unmatched in the industry.",
        "shocase_url": "https://innovatechsolutions.com",
        "shocase_image": "static/images/logos/innovatech_website.jpg",
        "date": "2024-03-15",
        "status": "Active"
    },
    {
        "id": 2,
        "name": "GreenLeaf Farms",
        "category": "Agriculture",
        "logo_url": "static/images/logos/greenleaf_logo.jpg",
        "testimonial_text": "The team at GreenLeaf Farms provided us with sustainable sourcing options that significantly improved our environmental footprint.",
        "shocase_url": "https://greenleaffarms.com",
        "shocase_image": "static/images/logos/greenleaf_website.jpg",
        "date": "2023-11-20",
        "status": "Archived"
    },
]
```
I need to parse the json file and map the content to a struct.

Go struct:
```go
type Logo struct {
    ID              int    `json:"id"`
    Name            string `json:"name"`
    Category        string `json:"category"`
    LogoURL         string `json:"logo_url"`
    TestimonialText string `json:"testimonial_text"`
    ShowcaseURL     string `json:"shocase_url"` // Note: Check spelling, it's 'shocase_url' in your example
    ShowcaseImage   string `json:"shocase_image"`
    Date            string `json:"date"`
    Status          string `json:"status"`
}

// Top-level structure for the file
type Logos []Logo
```

## Logo page
Location: it has it's dedicated url `/logo-{id}`.

- Containing the Name of the company, the date of the webpage delivery project.   
- Company's logo from the `static/images/logos` folder. 
- Testimonial text.
- The showcase URL
- The showcase image.
- The date of delivery.


# Partials
These are reuseable components. Thet can be added to every page.

## Navbar
Navbar is always on the top of the page, and present on each page.

## Footer
Footer is always on the buttom of the page, and present on each page.

# Tech stack

## Back-end
- Golang for back-end with a built in webserver with [sdt - func ListenAndServe](https://pkg.go.dev/net/http@go1.25.4#example-ListenAndServe)
- Routing: [std - func HandleFunc](https://pkg.go.dev/net/http@go1.25.4#example-HandleFunc)
- Templating: [std - template](https://pkg.go.dev/html/template@go1.25.4) 
- File server for galery and other static files: [std - func FileServer](https://pkg.go.dev/net/http@go1.25.4#example-FileServer)
- Database: this solution is not using any database, only the specified JSON files and the static files.

## JS
- Using just JavaScript code without any framework.

### fetch
Use `fetch` to submit the [contact us form](#contact-us-form).

### Carousel
Use carousel to display the logos.

### Form input validation
Validate the input data when the user fills out the form.

## CSS
- For the whole project I use [Tailwind.css](https://tailwindcss.com/) added by the [CDN option](https://tailwindcss.com/docs/installation/play-cdn) and for the contact us form I'll write my own css file. 

### Color palette
- #0A0506 -- Dark
- #9FB2B2 -- Light
- #5AACA5 -- Primary
- #EE9198 -- Secondary

# NFR - Non-functional requirements

## Mobile ready
The application must be responsive.    
Source: [statcounter / europe](https://gs.statcounter.com/screen-resolution-stats/all/europe)    

Breakpoints:
- Desktop 1920*1080
- Tablet 768*1024
- Mobile 390*844


## Logging
- Structured logging
    - Request logging
    - Error logging

## Error handling
- Centralized error handling 

## Security
At this point I'm not gonna do any of the following.
- Self-sigend TLS
- Connection timeout
- Rate limiters

## Testing
- Unit tests only