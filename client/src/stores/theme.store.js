import { create } from 'zustand';

export const lightColors = {
  primary: '#0F172A',
  primaryDark: '#020617',
  primaryLight: '#F1F5F9',
  accentBlue: '#0A84FF',
  background: '#F8FAFC',
  card: '#FFFFFF',
  surface: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#2E7D5B',
  warning: '#F59E0B',

  // Official Nomadix Design System Tokens (Light)
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate50: '#F8FAFC',
  white: '#FFFFFF',

  // Semantic & Accent Colors
  sky500: '#0EA5E9',
  sky50: '#F0F9FF',
  orange500: '#F97316',
  orange50: '#FFF7ED',
  emerald500: '#2E7D5B',
  emerald50: '#ECFDF5',
  amber400: '#FBBF24',
  amber50: '#FFFBEB',
  planBadge: '#475569',
  planBadgeBg: '#F1F5F9',

  // TREK Aesthetic Palette (Light)
  pineGreen: '#2E7D5B',
  pillBlack: '#111827',
  trekBg: '#F5F6F8',
  cardSurface: '#FFFFFF',
  borderSubtle: '#E5E7EB',
};

export const darkColors = {
  primary: '#FFFFFF',
  primaryDark: '#E2E8F0',
  primaryLight: '#1C1D21',
  accentBlue: '#38BDF8',
  background: '#121316',
  card: '#1C1D21',
  surface: '#1C1D21',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  border: '#2A2D35',
  error: '#EF4444',
  success: '#2E7D5B',
  warning: '#F59E0B',

  // Official Nomadix Design System Tokens (Dark)
  slate900: '#121316',
  slate800: '#1C1D21',
  slate700: '#2A2D35',
  slate50: '#F8FAFC',
  white: '#FFFFFF',

  // Semantic & Accent Colors
  sky500: '#38BDF8',
  sky50: '#1C1D21',
  orange500: '#FB923C',
  orange50: '#1C1D21',
  emerald500: '#2E7D5B',
  emerald50: '#1C1D21',
  amber400: '#FBBF24',
  amber50: '#1C1D21',
  planBadge: '#9CA3AF',
  planBadgeBg: '#1C1D21',

  // TREK Aesthetic Palette (Dark)
  pineGreen: '#2E7D5B',
  pillBlack: '#FFFFFF',
  trekBg: '#121316',
  cardSurface: '#1C1D21',
  borderSubtle: '#2A2D35',
};

export const useThemeStore = create((set, get) => ({
  mode: 'light',
  colors: lightColors,

  setThemeMode: (mode) => {
    const activeColors = mode === 'dark' ? darkColors : lightColors;
    set({ mode, colors: activeColors });
  },

  toggleTheme: () => {
    const currentMode = get().mode;
    const nextMode = currentMode === 'light' ? 'dark' : 'light';
    get().setThemeMode(nextMode);
  },
}));
