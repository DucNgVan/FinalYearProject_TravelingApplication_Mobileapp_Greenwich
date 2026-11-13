import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * Base Icon Renderer ensuring 100% SVG path fidelity with HTML Redesign
 */
const createIcon = (pathD, defaultSize = 20) => {
  const Icon = ({ size = defaultSize, color = 'currentColor', strokeWidth = 1.8, style, testID }) => (
    <Svg
      testID={testID}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d={pathD} />
    </Svg>
  );
  Icon.displayName = 'NomadixIcon';
  return Icon;
};

// 1. Navigation & Services
export const FlightIcon = createIcon('M2 16l20-8-8 14-3-6z', 22);
export const HotelIcon = createIcon('M5 3h14v18H5zM9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4', 22);
export const HomeIcon = createIcon('M4 11l8-7 8 7v9H4z', 22);
export const PlanIcon = createIcon('M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14', 22);
export const ProfileIcon = createIcon('M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c1-4 4-6 8-6s7 2 8 6', 22);
export const SquadIcon = createIcon('M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a3 3 0 000-6M21 20c0-2-1-4-3-4.5', 20);

// 2. Profile Menu List
export const TicketIcon = createIcon('M3 7h18v4a2 2 0 000 4v4H3v-4a2 2 0 000-4zM14 7v12', 20);
export const BedIcon = createIcon('M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5', 20);
export const CardIcon = createIcon('M3 6h18v12H3zM3 10h18M7 15h4', 20);
export const SupportIcon = createIcon('M4 14v-2a8 8 0 1116 0v2M4 14h3v5H4zM20 14h-3v5h3z', 20);

// 3. UI Controls & Arrows
export const SwapIcon = createIcon('M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7', 20);
export const CalendarIcon = createIcon('M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', 20);
export const SearchArrowIcon = createIcon('M5 12h14M13 6l6 6-6 6', 20);
export const StarIcon = createIcon('M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.7l6.2-.9z', 14);
export const ClockIcon = createIcon('M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2', 14);
export const BellIcon = createIcon('M6 16v-5a6 6 0 1112 0v5l2 2H4zM10 21h4', 20);
export const SparkleIcon = createIcon('M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z', 20);
export const CloseIcon = createIcon('M6 6l12 12M18 6L6 18', 20);
export const CheckIcon = createIcon('M5 12l5 5 9-10', 16);
export const PlusIcon = createIcon('M12 5v14M5 12h14', 20);
export const DownloadIcon = createIcon('M12 4v11M7 11l5 5 5-5M5 20h14', 20);
export const ShareIcon = createIcon('M12 15V3M7 8l5-5 5 5M5 14v6h14v-6', 20);
export const ChevronRightIcon = createIcon('M9 5l7 7-7 7', 18);
export const ChevronLeftIcon = createIcon('M15 5l-7 7 7 7', 20);

// 4. Extended Settings, Help & Security
export const SettingsIcon = createIcon('M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z', 20);
export const HelpCircleIcon = createIcon('M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01', 20);
export const ShieldLockIcon = createIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4', 20);
