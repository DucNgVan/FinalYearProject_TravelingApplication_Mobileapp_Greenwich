const supportService = require('../services/support.service');

class SupportController {
  async createTicket(req, res, next) {
    try {
      const userId = req.user?.id || req.body.userId || 'anonymous-user';
      const userName = req.user?.fullName || req.body.userName;
      const userEmail = req.user?.email || req.body.userEmail;

      const ticket = await supportService.createTicket({
        userId,
        userName,
        userEmail,
        subject: req.body.subject,
        category: req.body.category,
        priority: req.body.priority,
        message: req.body.message,
      });

      return res.status(201).json({
        success: true,
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyTickets(req, res, next) {
    try {
      const userId = req.user?.id;
      const tickets = await supportService.getMyTickets(userId);
      return res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTicketDetails(req, res, next) {
    try {
      const ticket = await supportService.getTicketDetails(req.params.id);
      return res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  }

  async addMessage(req, res, next) {
    try {
      const senderRole = req.user?.role === 'ADMIN' ? 'ADMIN' : 'USER';
      const senderName = req.user?.fullName || (senderRole === 'ADMIN' ? 'Support Agent' : 'User');

      const message = await supportService.addMessage({
        ticketId: req.params.id,
        senderRole,
        senderName,
        message: req.body.message,
      });

      return res.status(201).json({
        success: true,
        data: message,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAdminTickets(req, res, next) {
    try {
      const { status, priority, search } = req.query;
      const tickets = await supportService.getAdminTickets({ status, priority, search });
      return res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      const { status, priority, resolutionNotes } = req.body;
      const ticket = await supportService.updateTicketStatus(req.params.id, {
        status,
        priority,
        resolutionNotes,
      });
      return res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAdminStats(req, res, next) {
    try {
      const stats = await supportService.getAdminStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SupportController();
