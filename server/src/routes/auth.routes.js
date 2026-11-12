const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  validate,
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
} = require('../middlewares/validate.middleware');

router.post('/send-otp', validate(sendOtpSchema), (req, res, next) => {
  authController.sendOtp(req, res, next);
});

router.post('/verify-otp', validate(verifyOtpSchema), (req, res, next) => {
  authController.verifyOtp(req, res, next);
});

router.post('/register', validate(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

router.post('/login', validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

module.exports = router;
