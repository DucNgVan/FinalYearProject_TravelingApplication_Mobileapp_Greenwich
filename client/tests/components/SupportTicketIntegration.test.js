import apiClient from '../../src/api/client';
import { useSupportStore } from '../../src/stores/support.store';

jest.mock('../../src/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ success: true, data: [] }),
    post: jest.fn().mockResolvedValue({ success: true, data: { id: 'test-created' } }),
    patch: jest.fn().mockResolvedValue({ success: true, data: {} }),
  },
}));

describe('Frontend Test: useSupportStore (Customer Live Support & Ticket Flow)', () => {
  beforeEach(() => {
    useSupportStore.getState().resetSupport();
  });

  it('RED-FE-SUP-01: creates a support ticket and stores in active tickets list', async () => {
    const store = useSupportStore.getState();
    const initialCount = store.tickets.length;

    await store.createTicket({
      subject: 'Flight VN128 Reschedule',
      category: 'FLIGHT_BOOKING',
      priority: 'HIGH',
      message: 'Need to move departure from 14:15 to 19:30.',
    });

    const updated = useSupportStore.getState();
    expect(updated.tickets.length).toBe(initialCount + 1);
    expect(updated.tickets[0].subject).toBe('Flight VN128 Reschedule');
    expect(updated.tickets[0].status).toBe('OPEN');
  });

  it('RED-FE-SUP-02: appends customer message to live ticket chat thread', async () => {
    const store = useSupportStore.getState();
    const ticketId = store.tickets[0].id;

    await store.sendMessage(ticketId, 'Is there any change fee for this flight?');

    const messages = useSupportStore.getState().messagesByTicket[ticketId] || [];
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[messages.length - 1].message).toBe('Is there any change fee for this flight?');
  });
});
