import { useAuthStore } from '../../../src/stores/auth.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: Auth Store (Zustand State Management)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  test('RED-FE-04: useAuthStore should initialize in unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  test('RED-FE-05: useAuthStore.login should call API, update user state, and set isAuthenticated true', async () => {
    const mockUserData = {
      user: { id: 'user-01', email: 'traveler@nomadix.vn', fullName: 'Nguyen Van Duc' },
      tokens: { accessToken: 'token-abc-123', refreshToken: 'refresh-xyz-456' },
    };

    apiClient.post.mockResolvedValueOnce(mockUserData);

    await useAuthStore.getState().login('traveler@nomadix.vn', 'CorrectPassword2026!');

    const state = useAuthStore.getState();
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'traveler@nomadix.vn',
      password: 'CorrectPassword2026!',
    });
    expect(state.user).toEqual(mockUserData.user);
    expect(state.accessToken).toBe('token-abc-123');
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  test('RED-FE-06: useAuthStore.logout should clear user credentials and reset state to initial', () => {
    useAuthStore.setState({
      user: { id: 'user-01', email: 'traveler@nomadix.vn' },
      accessToken: 'token-abc-123',
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('should register user and set tokens on success', async () => {
    const mockUserData = {
      user: { id: 'user-02', email: 'new@nomadix.vn', fullName: 'Nguyen Van Duc' },
      tokens: { accessToken: 'token-reg-123', refreshToken: 'refresh-reg-456' },
    };

    apiClient.post.mockResolvedValueOnce(mockUserData);

    await useAuthStore.getState().register({
      fullName: 'Nguyen Van Duc',
      email: 'new@nomadix.vn',
      password: 'CorrectPassword2026!',
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUserData.user);
    expect(state.accessToken).toBe('token-reg-123');
    expect(state.isAuthenticated).toBe(true);
  });

  test('should handle login error and update error state', async () => {
    apiClient.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    await expect(
      useAuthStore.getState().login('wrong@nomadix.vn', 'wrongpass')
    ).rejects.toThrow('Invalid credentials');

    const state = useAuthStore.getState();
    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  test('should handle register error and update error state', async () => {
    apiClient.post.mockRejectedValueOnce(new Error('Email already taken'));

    await expect(
      useAuthStore.getState().register({
        fullName: 'Test User',
        email: 'taken@nomadix.vn',
        password: 'Password123!',
      })
    ).rejects.toThrow('Email already taken');

    const state = useAuthStore.getState();
    expect(state.error).toBe('Email already taken');
    expect(state.isLoading).toBe(false);
  });
});
