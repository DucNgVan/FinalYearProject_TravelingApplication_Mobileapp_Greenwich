const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Customer ticket endpoints
router.post('/tickets', authenticate, (req, res, next) => {
  supportController.createTicket(req, res, next);
});

router.get('/tickets/my', authenticate, (req, res, next) => {
  supportController.getMyTickets(req, res, next);
});

router.get('/tickets/:id', authenticate, (req, res, next) => {
  supportController.getTicketDetails(req, res, next);
});

router.post('/tickets/:id/messages', authenticate, (req, res, next) => {
  supportController.addMessage(req, res, next);
});

// Admin ticket endpoints
router.get('/admin/tickets', authenticate, (req, res, next) => {
  supportController.getAdminTickets(req, res, next);
});

router.patch('/admin/tickets/:id/status', authenticate, (req, res, next) => {
  supportController.updateTicketStatus(req, res, next);
});

router.get('/admin/stats', authenticate, (req, res, next) => {
  supportController.getAdminStats(req, res, next);
});

module.exports = router;
