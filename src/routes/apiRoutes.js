const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/logos', apiController.getLogos);
router.get('/logos/:id', apiController.getLogoById);
router.get('/services', apiController.getServices);
router.get('/planner-components', apiController.getPlannerComponents);
router.post('/contact', apiController.postContact);
router.get('/contact-submissions', apiController.getContactSubmissions);

module.exports = router;
