const supportRepository = require('../repositories/support.repository');

class SupportService {
  async createTicket({ userId, userName, userEmail, subject, category, priority, message }) {
    if (!subject) {
      const err = new Error('Ticket subject is required');
      err.code = 'VALIDATION_ERROR';
      err.statusCode = 400;
      throw err;
    }

    return await supportRepository.createTicket({
      userId,
      userName,
      userEmail,
      subject,
      category,
      priority,
      message,
    });
  }

  async getMyTickets(userId) {
    return await supportRepository.getTickets({ userId });
  }

  async getTicketDetails(ticketId) {
    const ticket = await supportRepository.findTicketById(ticketId);
    if (!ticket) {
      const err = new Error('Support ticket not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }
    const messages = await supportRepository.getMessagesByTicket(ticket.id);
    return { ...ticket, messages };
  }

  async addMessage({ ticketId, senderRole, senderName, message }) {
    if (!message || !message.trim()) {
      const err = new Error('Message content cannot be empty');
      err.code = 'VALIDATION_ERROR';
      err.statusCode = 400;
      throw err;
    }

    const ticket = await supportRepository.findTicketById(ticketId);
    if (!ticket) {
      const err = new Error('Support ticket not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    // If user replies and ticket was RESOLVED, reopen to IN_PROGRESS
    if (senderRole === 'USER' && ticket.status === 'RESOLVED') {
      await supportRepository.updateTicket(ticket.id, { status: 'IN_PROGRESS' });
    }

    return await supportRepository.addMessage({
      ticketId: ticket.id,
      senderRole,
      senderName,
      message,
    });
  }

  async getTicketMessages(ticketId) {
    const ticket = await supportRepository.findTicketById(ticketId);
    if (!ticket) {
      const err = new Error('Support ticket not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }
    return await supportRepository.getMessagesByTicket(ticket.id);
  }

  async updateTicketStatus(ticketId, { status, priority, resolutionNotes }) {
    const ticket = await supportRepository.findTicketById(ticketId);
    if (!ticket) {
      const err = new Error('Support ticket not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (resolutionNotes) updates.resolutionNotes = resolutionNotes;

    return await supportRepository.updateTicket(ticket.id, updates);
  }

  async getAdminTickets(filters) {
    return await supportRepository.getTickets(filters);
  }

  async getAdminStats() {
    return await supportRepository.getStats();
  }
}

module.exports = new SupportService();
