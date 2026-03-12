const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./src/routes/apiRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory only
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", apiRoutes);

// Admin Page Route
app.get("/secureadminpage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
