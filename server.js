const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory only
app.use(express.static(path.join(__dirname, 'public')));

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

// Get planner components
app.get('/api/planner-components', async (req, res) => {
    try {
        const components = await loadData('planner_components.json');
        res.json(components);
    } catch (err) {
        console.error('Error fetching planner components:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper to save data
async function saveData(filename, data) {
    const dataPath = path.join(__dirname, 'data', filename);
    await fs.writeFile(dataPath, JSON.stringify(data, null, 4), 'utf8');
}

// Receive contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const submission = req.body;
        
        // Add metadata
        submission.id = Date.now().toString();
        submission.timestamp = new Date().toISOString();

        // Load existing, append, save
        const submissions = await loadData('contact_submissions.json');
        submissions.push(submission);
        await saveData('contact_submissions.json', submissions);

        res.status(201).json({ success: true, message: 'Message received successfully' });
    } catch (err) {
        console.error('Error saving contact submission:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Admin Page Route
app.get('/secureadminpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Admin API to fetch submissions
app.get('/api/contact-submissions', async (req, res) => {
    try {
        const submissions = await loadData('contact_submissions.json');
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
