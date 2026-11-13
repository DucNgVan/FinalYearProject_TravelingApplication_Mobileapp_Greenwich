/**
 * Nomadix Master Redesign Design Tokens
 * 100% Extracted from 'Nomadix – Thiết kế lại UI.html'
 */
export const REDESIGN_THEME = {
  // Core Palettes
  canvas: '#F5F6F2',      // Warm sage canvas background
  dark: '#0E1B2C',        // Deep midnight navy for primary texts & active tabs
  white: '#FFFFFF',       // Clean card background
  textPrimary: '#0E1B2C',
  textMuted: '#5B6776',   // Subtitle, secondary labels
  border: '#E3E6E0',      // Neutral divider / border
  borderLight: '#EEF0EB', // Subtle card item divider
  borderDashed: '#D5D9D2',// Dashed separators (Flight & Hotel cards)

  // Brand Accents
  teal: '#0B7A75',        // Primary interactive teal
  tealDark: '#0B6B67',    // Deep teal for buttons & active text
  tealSoft: '#E3F2F0',    // Soft teal background for Flight badges & edit buttons

  // Category Pastel Tints
  coralSoft: '#FDECE7',   // Hotels & Hot deals background
  coralText: '#A8341D',   // Hot deals & delete text
  indigoSoft: '#E8EAF8',  // Plan / Itinerary & Payment cards tint
  indigoText: '#3B3F9E',  // Payment cards text
  amberSoft: '#FBF1D6',   // Squad & Split / Support & Refunds tint
  amberText: '#7A4A06',   // Support text

  // Gradients
  gradients: {
    heroCard: ['#0E1B2C', '#14485A', '#0B7A75'], // 135deg Navy-Teal
    creditCardFront: ['#0E1B2C', '#14485A', '#0B7A75'],
    creditCardBack: ['#E58C6A', '#C8402A'],      // Coral gradient
    cardChip: ['#F3E2B8', '#D9A85B'],            // Gold chip gradient
    recentTrip: ['#6FA8B8', '#E9B98A', '#8B6B5A'],
  },

  // Typography Scale
  fontSize: {
    eyebrow: 11,
    sub: 12,
    body: 14,
    headline: 17,
    title: 22,
    bigAirport: 38,
  },

  // Border Radii
  radius: {
    hero: 28,
    card: 24,
    pill: 20,
    segment: 18,
    field: 16,
    badge: 99,
    navDock: 30,
  },

  // Shadows
  shadows: {
    card: {
      shadowColor: '#0E1B2C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 24,
      elevation: 4,
    },
    nav: {
      shadowColor: '#0E1B2C',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 30,
      elevation: 8,
    },
    homeFloating: {
      shadowColor: '#0E1B2C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
  },
};
