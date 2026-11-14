const DEFAULT_TICKETS = [
  {
    id: 'ticket-1001',
    ticketNumber: 'TICK-1001',
    userId: 'user-demo-1',
    userName: 'Duc Nguyen',
    userEmail: 'duc@nomadix.app',
    subject: 'Flight VN128 Reschedule Request',
    category: 'FLIGHT_BOOKING',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ticket-1002',
    ticketNumber: 'TICK-1002',
    userId: 'user-demo-2',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah@nomadix.app',
    subject: 'Novotel Da Nang Check-in Date Adjustment',
    category: 'HOTEL_BOOKING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'ticket-1003',
    ticketNumber: 'TICK-1003',
    userId: 'user-demo-3',
    userName: 'Alex Wong',
    userEmail: 'alex@nomadix.app',
    subject: 'Seafood Bill Duplicate Split Refund',
    category: 'REFUND_REQUEST',
    priority: 'URGENT',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

const DEFAULT_MESSAGES = [
  {
    id: 'msg-1',
    ticketId: 'ticket-1001',
    senderRole: 'USER',
    senderName: 'Duc Nguyen',
    message: 'Hello, due to a schedule change I need to move flight VN128 departure to 19:30.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg-2',
    ticketId: 'ticket-1002',
    senderRole: 'USER',
    senderName: 'Sarah Jenkins',
    message: 'Can I check in at 11:00 AM instead of 14:00 PM?',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg-3',
    ticketId: 'ticket-1002',
    senderRole: 'ADMIN',
    senderName: 'Support Agent Alex',
    message: 'We contacted Novotel reception. Early check-in is confirmed complimentary.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'msg-4',
    ticketId: 'ticket-1003',
    senderRole: 'USER',
    senderName: 'Alex Wong',
    message: 'I was accidentally charged twice for the Bé Mặn Seafood dinner.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

class SupportRepository {
  constructor() {
    this.tickets = [...DEFAULT_TICKETS];
    this.messages = [...DEFAULT_MESSAGES];
    this.ticketCounter = 1004;
  }

  async createTicket(data) {
    const id = data.id || `ticket-${Date.now()}`;
    const ticketNumber = `TICK-${this.ticketCounter++}`;
    const newTicket = {
      id,
      ticketNumber,
      userId: data.userId,
      userName: data.userName || 'Valued Traveler',
      userEmail: data.userEmail || 'traveler@nomadix.app',
      subject: data.subject,
      category: data.category || 'GENERAL',
      priority: data.priority || 'MEDIUM',
      status: 'OPEN',
      resolutionNotes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tickets.unshift(newTicket);

    if (data.message) {
      await this.addMessage({
        ticketId: id,
        senderRole: 'USER',
        senderName: newTicket.userName,
        message: data.message,
      });
    }

    return newTicket;
  }

  async findTicketById(id) {
    return this.tickets.find((t) => t.id === id || t.ticketNumber === id);
  }

  async getTickets({ userId, status, priority, search } = {}) {
    let result = [...this.tickets];
    if (userId) {
      result = result.filter((t) => t.userId === userId);
    }
    if (status && status !== 'ALL') {
      result = result.filter((t) => t.status === status);
    }
    if (priority && priority !== 'ALL') {
      result = result.filter((t) => t.priority === priority);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async updateTicket(id, updates) {
    const ticket = await this.findTicketById(id);
    if (!ticket) return null;

    Object.assign(ticket, updates, { updatedAt: new Date().toISOString() });
    return ticket;
  }

  async addMessage({ ticketId, senderRole, senderName, message }) {
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticketId,
      senderRole: senderRole || 'USER',
      senderName: senderName || 'User',
      message,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMsg);

    // Update ticket's updatedAt timestamp
    await this.updateTicket(ticketId, { updatedAt: newMsg.createdAt });
    return newMsg;
  }

  async getMessagesByTicket(ticketId) {
    return this.messages.filter((m) => m.ticketId === ticketId);
  }

  async getStats() {
    const totalTickets = this.tickets.length;
    const openTickets = this.tickets.filter((t) => t.status === 'OPEN').length;
    const inProgressTickets = this.tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = this.tickets.filter((t) => t.status === 'RESOLVED').length;
    const pendingRefunds = this.tickets.filter(
      (t) => t.category === 'REFUND_REQUEST' && t.status !== 'RESOLVED'
    ).length;

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      pendingRefunds,
    };
  }
}

module.exports = new SupportRepository();
