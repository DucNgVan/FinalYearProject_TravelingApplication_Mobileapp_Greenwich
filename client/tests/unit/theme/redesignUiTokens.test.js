import React from 'react';
import { render } from '@testing-library/react-native';
import { REDESIGN_THEME } from '../../../src/theme/designTokens';
import {
  FlightIcon,
  HotelIcon,
  PlanIcon,
  HomeIcon,
  ProfileIcon,
  SquadIcon,
  CardIcon,
  TicketIcon,
  BedIcon,
  SupportIcon,
  SwapIcon,
  CalendarIcon,
  SearchArrowIcon,
  StarIcon,
  ClockIcon,
  BellIcon,
  SparkleIcon,
  CloseIcon,
  CheckIcon,
  PlusIcon,
  DownloadIcon,
  ShareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '../../../src/components/common/NomadixIcons';

describe('TDD RED Phase: Redesign UI Tokens & 24 Native SVG Icons', () => {
  test('RED-TOKENS-01: REDESIGN_THEME defines the exact HTML redesign color palette', () => {
    expect(REDESIGN_THEME).toBeDefined();
    expect(REDESIGN_THEME.canvas).toBe('#F5F6F2');
    expect(REDESIGN_THEME.dark).toBe('#0E1B2C');
    expect(REDESIGN_THEME.textMuted).toBe('#5B6776');
    expect(REDESIGN_THEME.teal).toBe('#0B7A75');
    expect(REDESIGN_THEME.tealDark).toBe('#0B6B67');
    expect(REDESIGN_THEME.tealSoft).toBe('#E3F2F0');
    expect(REDESIGN_THEME.coralSoft).toBe('#FDECE7');
    expect(REDESIGN_THEME.indigoSoft).toBe('#E8EAF8');
    expect(REDESIGN_THEME.amberSoft).toBe('#FBF1D6');
    expect(REDESIGN_THEME.border).toBe('#E3E6E0');
    expect(REDESIGN_THEME.radius.card).toBe(24);
    expect(REDESIGN_THEME.radius.hero).toBe(28);
    expect(REDESIGN_THEME.radius.pill).toBe(20);
  });

  test('RED-ICONS-02: exports all 24 native SVG icons from Nomadix redesign', () => {
    const icons = [
      FlightIcon,
      HotelIcon,
      PlanIcon,
      HomeIcon,
      ProfileIcon,
      SquadIcon,
      CardIcon,
      TicketIcon,
      BedIcon,
      SupportIcon,
      SwapIcon,
      CalendarIcon,
      SearchArrowIcon,
      StarIcon,
      ClockIcon,
      BellIcon,
      SparkleIcon,
      CloseIcon,
      CheckIcon,
      PlusIcon,
      DownloadIcon,
      ShareIcon,
      ChevronRightIcon,
      ChevronLeftIcon,
    ];

    expect(icons.length).toBe(24);
    icons.forEach(IconComponent => {
      expect(typeof IconComponent).toBe('function');
      const { UNSAFE_root } = render(<IconComponent size={22} color="#0B7A75" />);
      expect(UNSAFE_root).toBeDefined();
    });
  });
});
