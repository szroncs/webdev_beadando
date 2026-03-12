const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home - WebDev Solutions' });
});

router.get('/contact.html', (req, res) => {
    res.render('contact', { title: 'Contact Us - WebDev Solutions' });
});

router.get('/logo.html', (req, res) => {
    res.render('logo', { title: 'Case Study - WebDev Solutions' });
});

router.get('/secureadminpage', (req, res) => {
    res.render('admin', { title: 'Admin - Contact Submissions' });
});

module.exports = router;
