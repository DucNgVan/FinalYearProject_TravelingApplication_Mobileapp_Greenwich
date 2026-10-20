const express = require('express');
const flightController = require('../controllers/flight.controller');
const { validateQuery, flightSearchSchema } = require('../middlewares/validate.middleware');

const router = express.Router();

router.get('/search', validateQuery(flightSearchSchema), (req, res, next) => {
  flightController.search(req, res, next);
});

module.exports = router;
