const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/services/token.service');
const itineraryRepository = require('../../src/repositories/itinerary.repository');

describe('Integration Test: Group Expense CRUD Endpoints', () => {
  const tripOwner = {
    userId: 'user-duc-01',
    email: 'duc@nomadix.vn',
    role: 'traveler',
  };
  const tripOwnerToken = generateAccessToken(tripOwner);

  const companion = {
    userId: 'user-nam-02',
    email: 'nam@nomadix.vn',
    role: 'traveler',
  };
  const companionToken = generateAccessToken(companion);

  const stranger = {
    userId: 'stranger-99',
    email: 'stranger@nomadix.vn',
    role: 'traveler',
  };
  const strangerToken = generateAccessToken(stranger);

  const testTripId = 'trip-danang-101';
  let createdExpenseId;

  beforeAll(async () => {
    // Seed test itinerary with owner and collaborator in repository
    await itineraryRepository.create({
      id: testTripId,
      title: 'Đà Nẵng Squad Trip',
      destinationCity: 'DaNang',
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-11-23'),
      creatorId: tripOwner.userId,
      collaborators: [
        { userId: tripOwner.userId, role: 'OWNER', status: 'ACCEPTED' },
        { userId: companion.userId, role: 'EDITOR', status: 'ACCEPTED' },
      ],
    });
  });

  test('RED-EXP-09: POST /api/v1/trips/:tripId/expenses should create an expense with equal splits and return 201 Created', async () => {
    const expensePayload = {
      title: 'Hải sản Bé Mặn tối N1',
      amount: 1200000,
      currency: 'VND',
      category: 'food',
      splitStrategy: 'equal',
      participants: [tripOwner.userId, companion.userId],
      notes: 'Bữa tối hải sản tươi sống cạnh bãi biển Mỹ Khê',
    };

    const res = await request(app)
      .post(`/api/v1/trips/${testTripId}/expenses`)
      .set('Authorization', `Bearer ${tripOwnerToken}`)
      .send(expensePayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.expense).toBeDefined();

    const exp = res.body.data.expense;
    createdExpenseId = exp.id;
    expect(exp.title).toBe(expensePayload.title);
    expect(Number(exp.amount)).toBe(1200000);
    expect(exp.payerId).toBe(tripOwner.userId);
    expect(exp.splits).toHaveLength(2);
    expect(Number(exp.splits[0].splitAmount)).toBe(600000);
    expect(Number(exp.splits[1].splitAmount)).toBe(600000);
  });

  test('RED-EXP-10: POST /api/v1/trips/:tripId/expenses should return 422 Unprocessable Entity when custom splits sum does not match total amount', async () => {
    const invalidPayload = {
      title: 'Thuê xe máy 2 ngày',
      amount: 500000,
      currency: 'VND',
      category: 'transport',
      splitStrategy: 'exact',
      customSplits: [
        { userId: tripOwner.userId, splitAmount: 200000 },
        { userId: companion.userId, splitAmount: 200000 }, // Total = 400,000 != 500,000
      ],
    };

    const res = await request(app)
      .post(`/api/v1/trips/${testTripId}/expenses`)
      .set('Authorization', `Bearer ${companionToken}`)
      .send(invalidPayload);

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EXPENSE_SPLIT_MISMATCH');
  });

  test('RED-EXP-11: GET /api/v1/trips/:tripId/expenses should return list of expenses with splits', async () => {
    const res = await request(app)
      .get(`/api/v1/trips/${testTripId}/expenses`)
      .set('Authorization', `Bearer ${companionToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.expenses)).toBe(true);
    expect(res.body.data.expenses.length).toBeGreaterThanOrEqual(1);

    const targetExpense = res.body.data.expenses.find((e) => e.id === createdExpenseId);
    expect(targetExpense).toBeDefined();
    expect(targetExpense.splits).toHaveLength(2);
  });

  test('RED-EXP-12: POST /api/v1/trips/:tripId/expenses/receipt should upload receipt and return URL', async () => {
    const sampleReceiptPayload = {
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
      fileName: 'receipt_beman.jpg',
    };

    const res = await request(app)
      .post(`/api/v1/trips/${testTripId}/expenses/receipt`)
      .set('Authorization', `Bearer ${tripOwnerToken}`)
      .send(sampleReceiptPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.receiptUrl).toBeDefined();
    expect(typeof res.body.data.receiptUrl).toBe('string');
  });

  test('RED-EXP-13: GET /api/v1/trips/:tripId/debts should return aggregated debts and simplified settlements', async () => {
    const res = await request(app)
      .get(`/api/v1/trips/${testTripId}/debts`)
      .set('Authorization', `Bearer ${tripOwnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalExpense');
    expect(res.body.data).toHaveProperty('memberBalances');
    expect(res.body.data).toHaveProperty('simplifiedSettlements');
    expect(Array.isArray(res.body.data.memberBalances)).toBe(true);
    expect(Array.isArray(res.body.data.simplifiedSettlements)).toBe(true);
  });
});
