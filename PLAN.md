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

## Must have JS functions

`fetch` 


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


## Contact us form
Location: it has it's dedicated url `/contact`.



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

## BE
- Golang for back-end with a built in webserver with [sdt - func ListenAndServe](https://pkg.go.dev/net/http@go1.25.4#example-ListenAndServe)
- Routing: [std - func HandleFunc](https://pkg.go.dev/net/http@go1.25.4#example-HandleFunc)
- Templating: [std - template](https://pkg.go.dev/html/template@go1.25.4)
- File server for galery and other static files: [std - func FileServer](https://pkg.go.dev/net/http@go1.25.4#example-FileServer)

## JS
- [AlpineJS](https://alpinejs.dev/) with CDN import or creating my own JS.

## CSS
- For the whole project I use [Pure.css](https://pure-css.github.io/) added by the [CDN option](https://pure-css.github.io/start/#add-pure-to-your-page) and for the contact us form I'll write my own css file. 