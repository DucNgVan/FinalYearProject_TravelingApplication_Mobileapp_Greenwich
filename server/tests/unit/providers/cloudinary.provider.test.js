const cloudinaryProvider = require('../../../src/providers/cloudinary.provider');

describe('Unit Test: CloudinaryProvider (Real Multipart Upload & CDN Integration)', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = originalEnv;
  });

  it('RED-CLD-01: should upload image buffer/base64 to Cloudinary REST API and return secure_url', async () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'nomadix-cloud';
    process.env.CLOUDINARY_UPLOAD_PRESET = 'receipts_preset';

    const mockResponse = {
      secure_url: 'https://res.cloudinary.com/nomadix-cloud/image/upload/v12345/nomadix/receipts/trip-101/bill_sample.webp',
      public_id: 'nomadix/receipts/trip-101/bill_sample',
      bytes: 142050,
      format: 'webp',
    };

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await cloudinaryProvider.uploadReceipt({
      tripId: 'trip-101',
      fileData: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      fileName: 'bill_sample.jpg',
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.cloudinary.com/v1_1/nomadix-cloud/image/upload'),
      expect.objectContaining({
        method: 'POST',
      })
    );
    expect(result.receiptUrl).toBe(mockResponse.secure_url);
  });

  it('RED-CLD-02: should fall back safely to deterministic WebP URL when Cloudinary API credentials are not set', async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;

    const result = await cloudinaryProvider.uploadReceipt({
      tripId: 'trip-999',
      fileName: 'hotel_bill.png',
    });

    expect(result.receiptUrl).toContain('https://res.cloudinary.com/nomadix/image/upload/');
    expect(result.receiptUrl).toContain('hotel_bill.webp');
  });

  it('RED-CLD-03: should fallback gracefully to deterministic URL if external Cloudinary HTTP request fails', async () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'nomadix-cloud';

    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network timeout'));

    const result = await cloudinaryProvider.uploadReceipt({
      tripId: 'trip-500',
      fileData: 'base64_raw_data',
      fileName: 'dinner.jpg',
    });

    expect(result.receiptUrl).toContain('dinner.webp');
  });
});
