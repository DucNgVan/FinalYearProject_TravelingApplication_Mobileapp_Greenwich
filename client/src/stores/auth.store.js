import { create } from 'zustand';
import apiClient, { setAuthToken, clearAuthToken } from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isGuest: false,

  continueAsGuest: () => {
    set({
      user: {
        id: 'guest-' + Date.now(),
        fullName: 'Guest Traveler',
        email: 'guest@nomadix.app',
        role: 'Viewer',
      },
      isAuthenticated: true,
      isGuest: true,
      isLoading: false,
      error: null,
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      const accessToken = data.accessToken || data.tokens?.accessToken || null;
      const refreshToken = data.refreshToken || data.tokens?.refreshToken || null;

      if (accessToken) {
        setAuthToken(accessToken);
      }

      const rawUser = data.user || null;
      const phoneVal = rawUser ? (rawUser.phoneNumber || rawUser.phone) : null;
      const dobVal = rawUser ? (rawUser.dateOfBirth || rawUser.date_of_birth) : null;
      const mergedUser = rawUser ? {
        ...rawUser,
        ...(phoneVal ? { phone: phoneVal, phoneNumber: phoneVal } : {}),
        ...(dobVal ? { dateOfBirth: dobVal } : {}),
      } : null;

      set({
        user: mergedUser,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (err) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  loginWithGoogle: async ({ idToken, profile = null }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/google', { idToken, profile });
      const accessToken = data.accessToken || data.tokens?.accessToken || null;
      const refreshToken = data.refreshToken || data.tokens?.refreshToken || null;

      if (accessToken) {
        setAuthToken(accessToken);
      }

      set({
        user: data.user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
      });

      return data;
    } catch (err) {
      set({ error: err.message || 'Google login failed', isLoading: false });
      throw err;
    }
  },

  sendOtp: async (identifier, type = 'email') => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/send-otp', { identifier, type });
      set({ isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message || 'Gửi mã OTP thất bại', isLoading: false });
      throw err;
    }
  },

  verifyOtp: async (identifier, otp) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/verify-otp', { identifier, otp });
      set({ isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message || 'Mã OTP không hợp lệ', isLoading: false });
      throw err;
    }
  },

  register: async ({ fullName, dateOfBirth, phoneNumber, email, password, otp }) => {
    set({ isLoading: true, error: null });
    try {
      const payload = { fullName, email, password };
      if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
      if (phoneNumber) payload.phoneNumber = phoneNumber;
      if (otp) payload.otp = otp;
      const data = await apiClient.post('/auth/register', payload);
      const accessToken = data.accessToken || data.tokens?.accessToken || null;
      const refreshToken = data.refreshToken || data.tokens?.refreshToken || null;

      if (accessToken) {
        setAuthToken(accessToken);
      }

      const rawUser = data.user || null;
      const phoneVal = rawUser ? (rawUser.phoneNumber || rawUser.phone || phoneNumber) : phoneNumber;
      const dobVal = rawUser ? (rawUser.dateOfBirth || rawUser.date_of_birth || dateOfBirth) : dateOfBirth;
      const mergedUser = rawUser ? {
        ...rawUser,
        ...(phoneVal ? { phone: phoneVal, phoneNumber: phoneVal } : {}),
        ...(dobVal ? { dateOfBirth: dobVal } : {}),
      } : null;

      set({
        user: mergedUser,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (err) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : updates,
    }));
  },

  changePassword: async (currentPassword, newPassword) => {
    return true;
  },

  logout: () => {
    clearAuthToken();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      error: null,
    });
  },
}));
