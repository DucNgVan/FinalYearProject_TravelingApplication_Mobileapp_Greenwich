const express = require('express');
const hotelController = require('../controllers/hotel.controller');
const { validateQuery, hotelSearchSchema } = require('../middlewares/validate.middleware');

const router = express.Router();

router.get('/search', validateQuery(hotelSearchSchema), (req, res, next) => {
  hotelController.search(req, res, next);
});

module.exports = router;
