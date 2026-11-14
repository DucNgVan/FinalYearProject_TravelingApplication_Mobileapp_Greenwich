const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/landmarks', (req, res, next) => {
  gamificationController.getLandmarks(req, res, next);
});

router.post('/checkin', authenticate, (req, res, next) => {
  gamificationController.checkIn(req, res, next);
});

router.get('/badges', (req, res, next) => {
  gamificationController.getBadges(req, res, next);
});

router.get('/profile', authenticate, (req, res, next) => {
  gamificationController.getProfile(req, res, next);
});

module.exports = router;
