const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./src/routes/apiRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware - ezt LLM ajánlotta, mivel Go-ban is használok middleware chaining-et ezért egész érthető
app.use(cors());
app.use(express.json());

// Serve static
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", apiRoutes);

// Admin
app.get("/secureadminpage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ez olyan mint a Go ListenAndServe
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
