const dataService = require('../services/dataService');

exports.getLogos = async (req, res) => {
    try {
        const logos = await dataService.loadData('logos.json');
        res.json(logos);
    } catch (err) {
        console.error('Error fetching logos:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getLogoById = async (req, res) => {
    try {
        const logos = await dataService.loadData('logos.json');
        const logo = logos.find(l => l.id == req.params.id);
        if (!logo) {
            return res.status(404).json({ error: 'Logo not found' });
        }
        res.json(logo);
    } catch (err) {
        console.error('Error fetching logo:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await dataService.loadData('services.json');
        res.json(services);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPlannerComponents = async (req, res) => {
    try {
        const components = await dataService.loadData('planner_components.json');
        res.json(components);
    } catch (err) {
        console.error('Error fetching planner components:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postContact = async (req, res) => {
    try {
        const submission = req.body;

        // Add metadata
        submission.id = Date.now().toString();
        submission.timestamp = new Date().toISOString();

        // Load existing, append, save
        const submissions = await dataService.loadData('contact_submissions.json');
        submissions.push(submission);
        await dataService.saveData('contact_submissions.json', submissions);

        res.status(201).json({ success: true, message: 'Message received successfully' });
    } catch (err) {
        console.error('Error saving contact submission:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getContactSubmissions = async (req, res) => {
    try {
        const submissions = await dataService.loadData('contact_submissions.json');
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
