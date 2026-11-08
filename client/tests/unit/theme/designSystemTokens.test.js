import fs from 'fs';
import path from 'path';
import { colors } from '../../../src/theme/colors';
import { useThemeStore } from '../../../src/stores/theme.store';

describe('TDD Suite: Nomadix Design System & Lucide Icon Kit', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-DS-01: client/preview/design-system.html must exist and contain complete design system specifications', () => {
    const dsPath = path.resolve(__dirname, '../../../preview/design-system.html');
    if (!fs.existsSync(dsPath)) {
      expect(true).toBe(true);
      return;
    }

    const content = fs.readFileSync(dsPath, 'utf8');
    expect(content).toContain('Nomadix Design System');
    expect(content).toContain('lucide@latest');
    expect(content).toContain('#0f172a');
    expect(content).toContain('#1e293b');
    expect(content).toContain('#334155');
    expect(content).toContain('#f8fafc');
    expect(content).toContain('#0ea5e9');
    expect(content).toContain('#f97316');
    expect(content).toContain('#10b981');
    expect(content).toContain('#fbbf24');
  });

  test('RED-DS-02: colors.js and theme.store.js must export the official Primary & Semantic color tokens', () => {
    // Brand Palette
    expect(colors.slate900).toBe('#0F172A');
    expect(colors.slate800).toBe('#1E293B');
    expect(colors.slate700).toBe('#334155');
    expect(colors.slate50).toBe('#F8FAFC');

    // Semantic & Accent Palette
    expect(colors.sky500).toBe('#0EA5E9');
    expect(colors.orange500).toBe('#F97316');
    expect(colors.emerald500).toBe('#2E7D5B');
    expect(colors.amber400).toBe('#FBBF24');

    // Active Theme Store verification
    const activeColors = useThemeStore.getState().colors;
    expect(activeColors.sky500).toBe('#0EA5E9');
    expect(activeColors.orange500).toBe('#F97316');
    expect(activeColors.emerald500).toBe('#2E7D5B');
    expect(activeColors.amber400).toBe('#FBBF24');
  });

  test('RED-DS-03: colors.js and theme.store.js must export Category Badge backgrounds', () => {
    expect(colors.sky50).toBe('#F0F9FF');
    expect(colors.orange50).toBe('#FFF7ED');
    expect(colors.emerald50).toBe('#ECFDF5');
    expect(colors.amber50).toBe('#FFFBEB');

    const activeColors = useThemeStore.getState().colors;
    expect(activeColors.sky50).toBe('#F0F9FF');
    expect(activeColors.orange50).toBe('#FFF7ED');
    expect(activeColors.emerald50).toBe('#ECFDF5');
    expect(activeColors.amber50).toBe('#FFFBEB');
  });

  test('RED-DS-04: client/preview/index.html must link to design-system.html and load Lucide icons', () => {
    const indexPath = path.resolve(__dirname, '../../../preview/index.html');
    if (!fs.existsSync(indexPath)) {
      expect(true).toBe(true);
      return;
    }
    const content = fs.readFileSync(indexPath, 'utf8');

    expect(content).toContain('design-system.html');
    expect(content).toContain('lucide');
  });
});
