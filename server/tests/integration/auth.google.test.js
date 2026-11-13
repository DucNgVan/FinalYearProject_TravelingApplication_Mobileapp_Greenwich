const request = require('supertest');
const app = require('../../src/app');

describe('Integration Test: Google OAuth 2.0 Auth Endpoint (POST /api/v1/auth/google)', () => {
  test('RED-GOOG-BE-01: should return 400 Bad Request when idToken is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/google')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('RED-GOOG-BE-02: should register new user via Google token/profile and return 200 with tokens and user profile', async () => {
    const testGoogleEmail = `google.user.${Date.now()}@gmail.com`;
    const res = await request(app)
      .post('/api/v1/auth/google')
      .send({
        idToken: 'mock-google-id-token-valid',
        profile: {
          email: testGoogleEmail,
          fullName: 'Google Traveler',
          photoUrl: 'https://lh3.googleusercontent.com/a/default-avatar',
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.user.email).toBe(testGoogleEmail);
    expect(res.body.data.user.fullName).toBe('Google Traveler');
    expect(res.body.data.user.avatarUrl).toBe('https://lh3.googleusercontent.com/a/default-avatar');
    expect(res.body.data.user.isEmailVerified).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  test('RED-GOOG-AVATAR-01: should return user.avatarUrl extracted from picture field', async () => {
    const avatarEmail = `avatar.user.${Date.now()}@gmail.com`;
    const avatarUrl = 'https://lh3.googleusercontent.com/a/ACg8ocK-real-google-photo';
    const res = await request(app)
      .post('/api/v1/auth/google')
      .send({
        idToken: 'mock-google-id-token-avatar',
        profile: {
          email: avatarEmail,
          name: 'Real Google Traveler',
          picture: avatarUrl,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(avatarEmail);
    expect(res.body.data.user.fullName).toBe('Real Google Traveler');
    expect(res.body.data.user.avatarUrl).toBe(avatarUrl);
  });

  test('RED-GOOG-UPDATE-02: should update avatarUrl and fullName for returning user if updated on Google', async () => {
    const updatingEmail = `update.user.${Date.now()}@gmail.com`;
    // Initial login
    await request(app)
      .post('/api/v1/auth/google')
      .send({
        idToken: 'token-initial',
        profile: {
          email: updatingEmail,
          fullName: 'Initial Name',
          photoUrl: 'https://lh3.googleusercontent.com/old-avatar',
        },
      });

    // Second login with updated name and photo
    const updatedRes = await request(app)
      .post('/api/v1/auth/google')
      .send({
        idToken: 'token-updated',
        profile: {
          email: updatingEmail,
          fullName: 'Updated Real Name',
          photoUrl: 'https://lh3.googleusercontent.com/new-avatar',
        },
      });

    expect(updatedRes.status).toBe(200);
    expect(updatedRes.body.data.user.fullName).toBe('Updated Real Name');
    expect(updatedRes.body.data.user.avatarUrl).toBe('https://lh3.googleusercontent.com/new-avatar');
  });

  test('RED-GOOG-BE-03: should login existing user without duplicate registration error', async () => {
    const fixedGoogleEmail = `fixed.google.${Date.now()}@gmail.com`;

    // 1st login (creates user)
    const firstRes = await request(app)
      .post('/api/v1/auth/google')
      .send({
        idToken: 'mock-google-id-token-1',
        profile: {
          email: fixedGoogleEmail,
          fullName: 'Returning Traveler',
        },
      });
    expect(firstRes.status).toBe(200);
    const userId = firstRes.body.data.user.id;

    // 2nd login with same Google email (should log in successfully)
    const secondRes = await request(app)
      .post('/api/v1/auth/google')
      .send({
        idToken: 'mock-google-id-token-2',
        profile: {
          email: fixedGoogleEmail,
          fullName: 'Returning Traveler',
        },
      });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.success).toBe(true);
    expect(secondRes.body.data.user.id).toBe(userId);
    expect(secondRes.body.data.user.email).toBe(fixedGoogleEmail);
    expect(secondRes.body.data.accessToken).toBeDefined();
  });
});
