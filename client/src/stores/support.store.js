import { create } from 'zustand';
import apiClient from '../api/client';

const DEFAULT_TICKETS = [
  {
    id: 'ticket-1001',
    ticketNumber: 'TICK-1001',
    subject: 'Flight VN128 Reschedule Request',
    category: 'FLIGHT_BOOKING',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2h ago',
  },
  {
    id: 'ticket-1002',
    ticketNumber: 'TICK-1002',
    subject: 'Novotel Da Nang Early Check-in',
    category: 'HOTEL_BOOKING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '5h ago',
  },
];

const DEFAULT_MESSAGES_BY_TICKET = {
  'ticket-1001': [
    {
      id: 'm1',
      senderRole: 'USER',
      senderName: 'Duc Nguyen',
      message: 'Hello, I need to reschedule flight VN128 from 14:15 to 19:30.',
      createdAt: '2h ago',
    },
    {
      id: 'm2',
      senderRole: 'ADMIN',
      senderName: 'Support Agent Alex',
      message: 'Hi Duc, we are checking seat availability on the 19:30 flight with the carrier.',
      createdAt: '1h ago',
    },
  ],
  'ticket-1002': [
    {
      id: 'm3',
      senderRole: 'USER',
      senderName: 'Duc Nguyen',
      message: 'Can I check in early at 10 AM?',
      createdAt: '5h ago',
    },
    {
      id: 'm4',
      senderRole: 'ADMIN',
      senderName: 'Support Agent Sarah',
      message: 'Your early check-in is confirmed complimentary.',
      createdAt: '3h ago',
    },
  ],
};

export const useSupportStore = create((set, get) => ({
  tickets: DEFAULT_TICKETS,
  messagesByTicket: DEFAULT_MESSAGES_BY_TICKET,
  activeTicketId: null,
  isLoading: false,
  error: null,

  fetchMyTickets: async () => {
    try {
      set({ isLoading: true });
      const res = await apiClient.get('/support/tickets/my');
      if (res?.data) {
        set({ tickets: res.data });
      }
    } catch {
      // Offline fallback
    } finally {
      set({ isLoading: false });
    }
  },

  createTicket: async (ticketPayload) => {
    const newId = `ticket-${Date.now()}`;
    const newTicketNumber = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: newId,
      ticketNumber: newTicketNumber,
      subject: ticketPayload.subject,
      category: ticketPayload.category || 'GENERAL',
      priority: ticketPayload.priority || 'MEDIUM',
      status: 'OPEN',
      createdAt: 'Just now',
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets],
      messagesByTicket: {
        ...state.messagesByTicket,
        [newId]: ticketPayload.message
          ? [
              {
                id: `msg-${Date.now()}`,
                senderRole: 'USER',
                senderName: 'Me',
                message: ticketPayload.message,
                createdAt: 'Just now',
              },
            ]
          : [],
      },
    }));

    try {
      await apiClient.post('/support/tickets', ticketPayload);
    } catch {
      // Optimistic offline creation
    }

    return newTicket;
  },

  sendMessage: async (ticketId, messageText) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole: 'USER',
      senderName: 'Me',
      message: messageText,
      createdAt: 'Just now',
    };

    set((state) => {
      const currentList = state.messagesByTicket[ticketId] || [];
      return {
        messagesByTicket: {
          ...state.messagesByTicket,
          [ticketId]: [...currentList, newMsg],
        },
      };
    });

    try {
      await apiClient.post(`/support/tickets/${ticketId}/messages`, { message: messageText });
    } catch {
      // Optimistic offline
    }

    return newMsg;
  },

  resetSupport: () => {
    set({
      tickets: DEFAULT_TICKETS,
      messagesByTicket: DEFAULT_MESSAGES_BY_TICKET,
      activeTicketId: null,
      isLoading: false,
      error: null,
    });
  },
}));
