import apiClient, { setAuthToken, getAuthToken, clearAuthToken } from '../../../src/api/client';

describe('Unit Test: API Client & Axios Interceptors', () => {
  beforeEach(() => {
    clearAuthToken();
  });

  test('RED-FE-01: apiClient should attach Bearer token to request headers when token is set', async () => {
    setAuthToken('sample-jwt-token-xyz');
    expect(getAuthToken()).toBe('sample-jwt-token-xyz');

    // Test request interceptor configuration
    const config = { headers: {} };
    const interceptedConfig = apiClient.interceptors.request.handlers[0].fulfilled(config);
    expect(interceptedConfig.headers.Authorization).toBe('Bearer sample-jwt-token-xyz');
  });

  test('RED-FE-02: apiClient should unwrap backend { success: true, data } envelope and return data payload', () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          user: { id: 'user-01', email: 'traveler@nomadix.vn' },
        },
      },
    };

    const unwrapped = apiClient.interceptors.response.handlers[0].fulfilled(mockResponse);
    expect(unwrapped).toEqual({
      user: { id: 'user-01', email: 'traveler@nomadix.vn' },
    });
  });

  test('RED-FE-03: apiClient should format rejection with structured error code and message on HTTP failure', async () => {
    const mockError = {
      response: {
        status: 401,
        data: {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Incorrect email or password',
          },
        },
      },
    };

    await expect(
      apiClient.interceptors.response.handlers[0].rejected(mockError)
    ).rejects.toEqual(
      expect.objectContaining({
        status: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Incorrect email or password',
      })
    );
  });

  test('should return raw data if response does not follow standard success envelope', () => {
    const rawRes = { data: 'pong' };
    const unwrapped = apiClient.interceptors.response.handlers[0].fulfilled(rawRes);
    expect(unwrapped).toBe('pong');
  });

  test('should handle network error when response is missing', async () => {
    const networkErr = { message: 'Network Timeout' };
    await expect(
      apiClient.interceptors.response.handlers[0].rejected(networkErr)
    ).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        code: 'NETWORK_ERROR',
        message: 'Network Timeout',
      })
    );
  });

  test('should reject request interceptor errors', async () => {
    const reqErr = new Error('Client Config Error');
    await expect(
      apiClient.interceptors.request.handlers[0].rejected(reqErr)
    ).rejects.toThrow('Client Config Error');
  });
});
