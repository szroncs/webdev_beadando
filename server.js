const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./src/routes/apiRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Set Pug as view engine
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "pug");

// Middleware
// CORS - cross origin resource sharing: a FE és a BE nem kell hogy ugyanazon a porton fusson, 
// express.json() - a request body-t json-ként fogadja a szerver, beépített parser 
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Redirect .html requests to clean routes (fixes browser caching old links)
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const cleanPath = req.path.slice(0, -5);
    const qs = req.url.slice(req.path.length); // Preserves ?query=...
    res.redirect(301, (cleanPath || '/') + qs);
  } else {
    next();
  }
});

// Page Routes
app.get("/", (req, res) => res.render("index"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/logo", (req, res) => res.render("logo"));

// API Routes
app.use("/api", apiRoutes);

// Admin
app.get("/secureadminpage", (req, res) => {
  res.render("admin");
});

// ez olyan mint a Go ListenAndServe
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
