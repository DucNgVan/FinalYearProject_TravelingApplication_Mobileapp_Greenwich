const supportService = require('../../../src/services/support.service');

describe('Unit Test: SupportService (Admin Portal & Live Customer Support)', () => {
  let createdTicketId;

  describe('RED-SUP-01: Support Ticket Creation', () => {
    it('creates a new support ticket with auto-generated ticket number and initial message', async () => {
      const ticket = await supportService.createTicket({
        userId: 'user-sup-1',
        userName: 'Duc Nguyen',
        userEmail: 'duc@nomadix.app',
        subject: 'Flight Cancellation & Refund Request',
        category: 'REFUND_REQUEST',
        priority: 'HIGH',
        message: 'My flight VN128 was cancelled by the airline. Please refund 2,450,000 VND.',
      });

      expect(ticket).toHaveProperty('id');
      expect(ticket.ticketNumber).toMatch(/^TICK-\d+/);
      expect(ticket.status).toBe('OPEN');
      expect(ticket.priority).toBe('HIGH');
      expect(ticket.subject).toBe('Flight Cancellation & Refund Request');
      createdTicketId = ticket.id;
    });
  });

  describe('RED-SUP-02: Live Support Message Threading', () => {
    it('appends messages between user and support agent and preserves conversation order', async () => {
      // Support agent replies
      const agentMsg = await supportService.addMessage({
        ticketId: createdTicketId,
        senderRole: 'ADMIN',
        senderName: 'Support Agent Alex',
        message: 'Hello Duc, we received your request and contacted Vietnam Airlines for refund verification.',
      });

      expect(agentMsg).toHaveProperty('id');
      expect(agentMsg.senderRole).toBe('ADMIN');
      expect(agentMsg.ticketId).toBe(createdTicketId);

      const messages = await supportService.getTicketMessages(createdTicketId);
      expect(messages.length).toBeGreaterThanOrEqual(2);
      expect(messages[messages.length - 1].message).toContain('Vietnam Airlines');
    });
  });

  describe('RED-SUP-03: Ticket Status Lifecycle & Admin Actions', () => {
    it('transitions ticket from OPEN to IN_PROGRESS and RESOLVED', async () => {
      const inProgressTicket = await supportService.updateTicketStatus(createdTicketId, {
        status: 'IN_PROGRESS',
      });
      expect(inProgressTicket.status).toBe('IN_PROGRESS');

      const resolvedTicket = await supportService.updateTicketStatus(createdTicketId, {
        status: 'RESOLVED',
        resolutionNotes: 'Refund of 2,450,000 VND processed back to credit card.',
      });
      expect(resolvedTicket.status).toBe('RESOLVED');
      expect(resolvedTicket.resolutionNotes).toContain('Refund of 2,450,000 VND processed');
    });

    it('RED-SUP-04: calculates real-time admin support KPIs', async () => {
      const stats = await supportService.getAdminStats();
      expect(stats).toHaveProperty('totalTickets');
      expect(stats).toHaveProperty('openTickets');
      expect(stats).toHaveProperty('resolvedTickets');
      expect(stats.totalTickets).toBeGreaterThanOrEqual(1);
    });
  });
});
