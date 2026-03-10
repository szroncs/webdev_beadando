const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the project root and specific directories
app.use(express.static(path.join(__dirname)));
app.use('/static', express.static(path.join(__dirname, 'static')));
// Serve data folder statically just in case some other JS relies on it temporarily
app.use('/data', express.static(path.join(__dirname, 'data')));


// API Endpoints

// Helper to load data
async function loadData(filename) {
    const dataPath = path.join(__dirname, 'data', filename);
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
}

// Get all logos
app.get('/api/logos', async (req, res) => {
    try {
        const logos = await loadData('logos.json');
        res.json(logos);
    } catch (err) {
        console.error('Error fetching logos:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get single logo by ID
app.get('/api/logos/:id', async (req, res) => {
    try {
        const logos = await loadData('logos.json');
        const logo = logos.find(l => l.id == req.params.id);
        if (!logo) {
            return res.status(404).json({ error: 'Logo not found' });
        }
        res.json(logo);
    } catch (err) {
        console.error('Error fetching logo:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all services
app.get('/api/services', async (req, res) => {
    try {
        const services = await loadData('services.json');
        res.json(services);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
