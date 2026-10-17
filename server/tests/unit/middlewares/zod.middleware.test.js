// RED state test: zod.middleware and schemas are not yet created
const { validateZod, validateZodQuery } = require('../../../src/middlewares/zod.middleware');
const { registerSchema, loginSchema } = require('../../../src/schemas/auth.zod');
const { createExpenseSchema } = require('../../../src/schemas/expense.zod');

describe('Unit Test: Zod Middleware & Type-Safe Schemas (TDD Phase 2)', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  test('RED-ZOD-01: validateZod should reject invalid auth payload with HTTP 400 and standard error envelope', async () => {
    mockReq.body = {
      email: 'not-an-email',
      password: '123', // Too short (min 6)
      fullName: '',
    };

    const middleware = validateZod(registerSchema);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: expect.any(String),
          details: expect.any(Array),
        }),
      })
    );
  });

  test('RED-ZOD-02: validateZod should sanitize and assign validated payload to req.validatedBody and call next()', async () => {
    mockReq.body = {
      email: '  Traveler@Nomadix.VN  ',
      password: 'StrongPassword123!',
      fullName: '  Nguyễn Văn Đức  ',
    };

    const middleware = validateZod(registerSchema);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockReq.validatedBody).toBeDefined();
    expect(mockReq.validatedBody.email).toBe('traveler@nomadix.vn');
    expect(mockReq.validatedBody.fullName).toBe('Nguyễn Văn Đức');
  });

  test('RED-ZOD-03: validateZodQuery should reject invalid query parameters', async () => {
    const { z } = require('zod');
    const querySchema = z.object({
      tripId: z.string().min(1, 'Trip ID is required'),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    });

    mockReq.query = { tripId: '', limit: '150' }; // Invalid: empty tripId, limit > 100

    const middleware = validateZodQuery(querySchema);
    await middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('RED-ZOD-04: createExpenseSchema should strictly validate split types and numeric amounts', () => {
    // Valid equal split
    const validExpense = {
      tripId: 'trip_123',
      payerId: 'user_456',
      title: 'Bữa tối hải sản Mỹ Khê',
      amount: 1500000,
      splitType: 'equal',
      splits: [
        { userId: 'user_456', splitValue: 1 },
        { userId: 'user_789', splitValue: 1 },
      ],
    };

    const parsed = createExpenseSchema.safeParse(validExpense);
    expect(parsed.success).toBe(true);

    // Invalid negative amount
    const invalidExpense = {
      ...validExpense,
      amount: -500,
    };
    const invalidParsed = createExpenseSchema.safeParse(invalidExpense);
    expect(invalidParsed.success).toBe(false);
  });
});
