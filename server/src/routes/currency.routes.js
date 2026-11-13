const express = require('express');
const currencyController = require('../controllers/currency.controller');
const {
  validateQuery,
  currencyLatestSchema,
  currencyConvertSchema,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// GET /api/v1/currency/latest?base=USD
router.get('/latest', validateQuery(currencyLatestSchema), currencyController.getLatest);

// GET /api/v1/currency/convert?from=EUR&to=USD&amount=100
router.get('/convert', validateQuery(currencyConvertSchema), currencyController.convert);

module.exports = router;
