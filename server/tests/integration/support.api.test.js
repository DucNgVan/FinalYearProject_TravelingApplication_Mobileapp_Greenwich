const request = require('supertest');
const app = require('../../src/app');
const tokenService = require('../../src/services/token.service');

describe('Integration Test: /api/v1/support Endpoints (Admin & Customer Live Support)', () => {
  let userToken;
  let adminToken;
  let testTicketId;

  const testUser = {
    id: 'user-sup-test-1',
    email: 'user@nomadix.app',
    fullName: 'Duc Nguyen',
    role: 'USER',
  };

  const testAdmin = {
    id: 'admin-sup-test-1',
    email: 'support.admin@nomadix.app',
    fullName: 'Support Admin',
    role: 'ADMIN',
  };

  beforeAll(() => {
    userToken = tokenService.generateAccessToken(testUser);
    adminToken = tokenService.generateAccessToken(testAdmin);
  });

  describe('Customer Support Endpoints', () => {
    it('RED-SUP-API-01: POST /api/v1/support/tickets creates a new ticket', async () => {
      const res = await request(app)
        .post('/api/v1/support/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          subject: 'Hotel Booking Date Change Issue',
          category: 'HOTEL_BOOKING',
          priority: 'MEDIUM',
          message: 'I cannot modify my check-in date for Novotel Da Nang.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('ticketNumber');
      expect(res.body.data.status).toBe('OPEN');
      testTicketId = res.body.data.id;
    });

    it('RED-SUP-API-02: GET /api/v1/support/tickets/my returns customer tickets', async () => {
      const res = await request(app)
        .get('/api/v1/support/tickets/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('RED-SUP-API-03: POST /api/v1/support/tickets/:id/messages sends user message', async () => {
      const res = await request(app)
        .post(`/api/v1/support/tickets/${testTicketId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          message: 'Can I change from 20th to 22nd of next month?',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.senderRole).toBe('USER');
    });
  });

  describe('Admin Support Endpoints', () => {
    it('RED-SUP-API-04: GET /api/v1/support/admin/tickets returns all tickets with stats', async () => {
      const res = await request(app)
        .get('/api/v1/support/admin/tickets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('RED-SUP-API-05: PATCH /api/v1/support/admin/tickets/:id/status updates ticket to RESOLVED', async () => {
      const res = await request(app)
        .patch(`/api/v1/support/admin/tickets/${testTicketId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'RESOLVED',
          resolutionNotes: 'Booking date successfully adjusted with hotel manager.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('RESOLVED');
    });

    it('RED-SUP-API-06: GET /api/v1/support/admin/stats returns aggregate metrics', async () => {
      const res = await request(app)
        .get('/api/v1/support/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalTickets');
      expect(res.body.data).toHaveProperty('resolvedTickets');
    });
  });
});
