# WebDev Solutions

A full-stack, dynamic web agency portfolio and project planner application built with vanilla web technologies and an Express.js backend. This project emphasizes modern, glassmorphic design, modular frontend architecture, and secure backend data handling.

## Features

### Core Site
*   **Dynamic Services Listing**: Services are fetched asynchronously from a backend JSON store and rendered responsively.
*   **Logo Cloud & Case Studies**: Interactive partner logos that link to detailed, dynamically generated case study pages.
*   **Modern Aesthetic**: Built with Tailwind CSS (via CDN) utilizing a curated dark mode palette (`#0A0506`), glassmorphism effects (`backdrop-blur`), and smooth CSS transitions.

### Project Planner
*   **Interactive Quote Generator**: A dynamic planner allowing users to add/remove components (e.g., Main Page, User Auth, E-commerce).
*   **Real-time Calculation**: Automatically calculates the estimated total price and a complexity score (capped at 10) based on the selected components.
*   **Seamless Integration**: Submitting a plan automatically redirects the user to the Contact page, pre-filling the message body with their specific project configuration and estimated quote details.

### Contact & Admin System
*   **Secure Contact Form**: Features robust, real-time JavaScript validation for names, emails, and phone numbers (optional fields supported).
*   **Backend Logging**: Submissions are not just sent via email; they are securely saved to a backend JSON database (`data/contact_submissions.json`).
*   **Secure Admin Dashboard**: A protected route (`/secureadminpage`) accessible only via the server, featuring a dynamically sorted table of all tracked contact submissions.

## Architecture & Security

The project recently underwent a major structural reorganization to enforce strict security boundaries:

*   **`public/` Directory**: All frontend-facing code (HTML, CSS, split modular JavaScript, Images, and HTML Partials) is safely isolated here. 
*   **Backend Protection**: The Express server strictly serves static files *only* from the `public/` directory. Direct browser access to backend code (`server.js`) or the database (`data/` folder) is strictly blocked (Returns 404).
*   **Modular JavaScript**: The frontend logic is broken down into page-specific modules (`home.js`, `planner.js`, `contact.js`, `logo-detail.js`) ensuring pages execute only the code they require, reducing bloat.

## Tech Stack

*   **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3 + Tailwind CSS (via CDN)
*   **Backend**: Node.js, Express.js, CORS
*   **Database**: Flat JSON files (`data/logos.json`, `data/services.json`, `data/planner_components.json`)

## Getting Started

To run this project locally, you will need [Node.js](https://nodejs.org/) installed on your machine.

1.  **Clone the repository** (if applicable):
    ```bash
    git clone https://github.com/szroncs/webdev_beadando.git
    cd webdev_beadando
    ```

2.  **Install Dependencies**:
    The project relies on Express and CORS for the backend logic.
    ```bash
    npm install
    ```

3.  **Start the Server**:
    ```bash
    node server.js
    ```
    *Note: The server runs on port 3000 by default. Do not use an IDE "Live Server" extension (like VSCode's port 5500), as the frontend relies on the Express API routes to function.*

4.  **View the Application**:
    Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Project Structure

```text
webdev_beadando/
├── data/                       # Secure JSON database files
│   ├── contact_submissions.json
│   ├── logos.json
│   ├── planner_components.json
│   └── services.json
├── public/                     # Publicly served frontend assets
│   ├── index.html
│   ├── contact.html
│   ├── logo.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   ├── images/
│   ├── js/                     # Modular frontend logic
│   │   ├── admin.js
│   │   ├── contact.js
│   │   ├── home.js
│   │   ├── logo-detail.js
│   │   ├── main.js
│   │   └── planner.js
│   └── partials/               # Reusable HTML components
│       └── navbar.html
├── package.json
└── server.js                   # Express application entry point
```

