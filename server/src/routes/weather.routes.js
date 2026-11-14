const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

router.get('/forecast', (req, res, next) => weatherController.getForecast(req, res, next));

module.exports = router;
