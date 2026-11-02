const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/services/token.service');
const itineraryRepository = require('../../src/repositories/itinerary.repository');

describe('Integration Test: Group Expense Net Balance Sheet & Debt Settlement API', () => {
  const ducUser = { userId: 'user-duc-01', email: 'duc@nomadix.vn', role: 'traveler' };
  const namUser = { userId: 'user-nam-02', email: 'nam@nomadix.vn', role: 'traveler' };
  const hoaUser = { userId: 'user-hoa-03', email: 'hoa@nomadix.vn', role: 'traveler' };

  const ducToken = generateAccessToken(ducUser);
  const namToken = generateAccessToken(namUser);
  const hoaToken = generateAccessToken(hoaUser);

  const tripId = 'trip-settlement-999';

  beforeAll(async () => {
    // Seed multi-member squad itinerary
    await itineraryRepository.create({
      id: tripId,
      title: 'Chuyến Đi Thực Tế Đà Nẵng',
      destinationCity: 'DaNang',
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-05'),
      creatorId: ducUser.userId,
      collaborators: [
        { userId: ducUser.userId, role: 'OWNER', status: 'ACCEPTED' },
        { userId: namUser.userId, role: 'EDITOR', status: 'ACCEPTED' },
        { userId: hoaUser.userId, role: 'EDITOR', status: 'ACCEPTED' },
      ],
    });

    const squad = [ducUser.userId, namUser.userId, hoaUser.userId];

    // Expense 1: Đức pays 1,200,000 VND (equal split among 3 -> 400k each)
    await request(app)
      .post(`/api/v1/trips/${tripId}/expenses`)
      .set('Authorization', `Bearer ${ducToken}`)
      .send({
        title: 'Bữa ăn hải sản',
        amount: 1200000,
        currency: 'VND',
        category: 'food',
        splitStrategy: 'equal',
        participants: squad,
      });

    // Expense 2: Nam pays 600,000 VND (equal split among 3 -> 200k each)
    await request(app)
      .post(`/api/v1/trips/${tripId}/expenses`)
      .set('Authorization', `Bearer ${namToken}`)
      .send({
        title: 'Vé cáp treo Bà Nà Hills',
        amount: 600000,
        currency: 'VND',
        category: 'sightseeing',
        splitStrategy: 'equal',
        participants: squad,
      });

    // Expense 3: Hoa pays 300,000 VND (equal split among 3 -> 100k each)
    await request(app)
      .post(`/api/v1/trips/${tripId}/expenses`)
      .set('Authorization', `Bearer ${hoaToken}`)
      .send({
        title: 'Cà phê tráng miệng',
        amount: 300000,
        currency: 'VND',
        category: 'food',
        splitStrategy: 'equal',
        participants: squad,
      });
  });

  test('RED-EXP-13: GET /api/v1/trips/:tripId/expenses/summary should compute accurate net balances for all members', async () => {
    const res = await request(app)
      .get(`/api/v1/trips/${tripId}/expenses/summary`)
      .set('Authorization', `Bearer ${ducToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const summary = res.body.data;
    expect(Number(summary.totalTripExpense)).toBe(2100000);
    expect(summary.memberBalances).toBeDefined();

    const ducBal = summary.memberBalances.find((b) => b.userId === ducUser.userId);
    const namBal = summary.memberBalances.find((b) => b.userId === namUser.userId);
    const hoaBal = summary.memberBalances.find((b) => b.userId === hoaUser.userId);

    // Đức: Paid 1.2M - Owed 700k = +500k
    expect(Number(ducBal.totalPaid)).toBe(1200000);
    expect(Number(ducBal.totalOwed)).toBe(700000);
    expect(Number(ducBal.netBalance)).toBe(500000);

    // Nam: Paid 600k - Owed 700k = -100k
    expect(Number(namBal.totalPaid)).toBe(600000);
    expect(Number(namBal.totalOwed)).toBe(700000);
    expect(Number(namBal.netBalance)).toBe(-100000);

    // Hoa: Paid 300k - Owed 700k = -400k
    expect(Number(hoaBal.totalPaid)).toBe(300000);
    expect(Number(hoaBal.totalOwed)).toBe(700000);
    expect(Number(hoaBal.netBalance)).toBe(-400000);

    // Mathematical zero-sum balance invariant
    const totalNet = Number(ducBal.netBalance) + Number(namBal.netBalance) + Number(hoaBal.netBalance);
    expect(totalNet).toBe(0);
  });

  test('RED-EXP-14: GET /api/v1/trips/:tripId/debts/settlement-plan should return the optimized minimal payment list', async () => {
    const res = await request(app)
      .get(`/api/v1/trips/${tripId}/debts/settlement-plan`)
      .set('Authorization', `Bearer ${namToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const plan = res.body.data.settlementPlan;
    expect(plan).toHaveLength(2);

    expect(plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fromUserId: hoaUser.userId,
          toUserId: ducUser.userId,
          amount: 400000,
        }),
        expect.objectContaining({
          fromUserId: namUser.userId,
          toUserId: ducUser.userId,
          amount: 100000,
        }),
      ])
    );
  });

  let createdSettlementId;

  test('RED-EXP-15: POST /api/v1/trips/:tripId/debts/settle and PATCH /:settlementId should record and confirm settlement', async () => {
    // 1. Hoa initiates settlement payment of 400,000 VND to Đức
    const settleRes = await request(app)
      .post(`/api/v1/trips/${tripId}/debts/settle`)
      .set('Authorization', `Bearer ${hoaToken}`)
      .send({
        debtorId: hoaUser.userId,
        creditorId: ducUser.userId,
        amount: 400000,
        currency: 'VND',
        proofImageUrl: 'https://res.cloudinary.com/nomadix/proofs/transfer_hoa.jpg',
      });

    expect(settleRes.status).toBe(201);
    expect(settleRes.body.success).toBe(true);
    expect(settleRes.body.data.settlement).toBeDefined();

    const settlement = settleRes.body.data.settlement;
    createdSettlementId = settlement.id;
    expect(settlement.status).toBe('pending');
    expect(Number(settlement.amount)).toBe(400000);

    // 2. Đức (Creditor) confirms receipt of money
    const confirmRes = await request(app)
      .patch(`/api/v1/trips/${tripId}/debts/settlements/${createdSettlementId}`)
      .set('Authorization', `Bearer ${ducToken}`)
      .send({ status: 'confirmed' });

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.success).toBe(true);
    expect(confirmRes.body.data.settlement.status).toBe('confirmed');

    // 3. Verify that Hoa's debt is settled and Đức's remaining balance is reduced
    const updatedSummaryRes = await request(app)
      .get(`/api/v1/trips/${tripId}/expenses/summary`)
      .set('Authorization', `Bearer ${hoaToken}`);

    expect(updatedSummaryRes.status).toBe(200);
    const updatedBalances = updatedSummaryRes.body.data.memberBalances;

    const updatedHoa = updatedBalances.find((b) => b.userId === hoaUser.userId);
    const updatedDuc = updatedBalances.find((b) => b.userId === ducUser.userId);

    // Hoa's net balance after confirmed settlement is 0
    expect(Number(updatedHoa.netBalance)).toBe(0);
    // Đức's remaining receivable is now +100,000 VND
    expect(Number(updatedDuc.netBalance)).toBe(100000);
  });
});
