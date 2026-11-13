const CurrencyService = require('../services/currency.service');

let redisClient = null;
try {
  const databaseManager = require('../db/connection');
  redisClient = databaseManager.getRedisClient ? databaseManager.getRedisClient() : null;
} catch (_) {}

const currencyService = new CurrencyService({ redis: redisClient });

class CurrencyController {
  async getLatest(req, res, next) {
    try {
      const base = req.query.base || 'USD';
      const ratesData = await currencyService.getLatestRates(base);
      return res.status(200).json({
        success: true,
        data: ratesData,
      });
    } catch (err) {
      next(err);
    }
  }

  async convert(req, res, next) {
    try {
      const { from, to, amount } = req.query;
      const conversion = await currencyService.convertCurrency({ from, to, amount });
      return res.status(200).json({
        success: true,
        data: conversion,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CurrencyController();
