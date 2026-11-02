const express = require('express');
const placesController = require('../controllers/places.controller');
const {
  validate,
  validateQuery,
  placesSearchSchema,
  placesAiPlanSchema,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// GET /api/v1/places/search - Query cached & curated places
router.get('/search', validateQuery(placesSearchSchema), placesController.search);

// POST /api/v1/places/ai-plan - AI clustering of selected places into daily itinerary
router.post('/ai-plan', validate(placesAiPlanSchema), placesController.generateAiPlan);

module.exports = router;
