import { colors } from '../../../src/theme/colors';
import { lightColors, darkColors, useThemeStore } from '../../../src/stores/theme.store';

describe('Unit Test: TREK Theme Tokens (Palette & Aesthetics)', () => {
  test('RED-FE-TREK-TH-01: colors token object should export TREK aesthetic tokens', () => {
    expect(colors.pineGreen).toBe('#2E7D5B');
    expect(colors.pillBlack).toBe('#111827');
    expect(colors.trekBg).toBe('#F5F6F8');
    expect(colors.borderSubtle).toBe('#E5E7EB');
  });

  test('RED-FE-TREK-TH-02: lightColors and darkColors should provide theme-adaptive TREK tokens', () => {
    expect(lightColors.pineGreen).toBe('#2E7D5B');
    expect(lightColors.pillBlack).toBe('#111827');
    expect(lightColors.trekBg).toBe('#F5F6F8');
    expect(lightColors.cardSurface).toBe('#FFFFFF');
    expect(lightColors.borderSubtle).toBe('#E5E7EB');

    expect(darkColors.pineGreen).toBe('#2E7D5B');
    expect(darkColors.pillBlack).toBe('#FFFFFF');
    expect(darkColors.trekBg).toBe('#121316');
    expect(darkColors.cardSurface).toBe('#1C1D21');
    expect(darkColors.borderSubtle).toBe('#2A2D35');
  });
});
