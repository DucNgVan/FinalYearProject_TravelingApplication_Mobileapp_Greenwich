import React from 'react';
import { render } from '@testing-library/react-native';
import FlightCard from '../../../src/components/booking/FlightCard';
import HotelCard from '../../../src/components/booking/HotelCard';
import BoardingPassModal from '../../../src/components/booking/BoardingPassModal';
import fs from 'fs';
import path from 'path';

describe('Rules of Hooks Safety & Static Flag Consistency', () => {
  const sampleFlight = {
    id: 'flt-1',
    airline: 'Vietnam Airlines',
    airlineCode: 'VN',
    flightNumber: 'VN-123',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-11-01T08:00:00Z',
    arrivalTime: '2026-11-01T10:00:00Z',
    price: { amount: 1500000, currency: 'VND' },
    stops: 0,
  };

  const sampleHotel = {
    id: 'htl-1',
    name: 'Novotel Danang',
    address: 'Bach Dang, Danang',
    starRating: 5,
    pricePerNight: 2000000,
  };

  const sampleTicket = {
    id: 'tkt-1',
    airlineCode: 'VN',
    flightNumber: 'VN-123',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-11-01T08:00:00Z',
    arrivalTime: '2026-11-01T10:00:00Z',
  };

  test('RED-HOOK-01: FlightCard should declare all hooks before early return if (!flight)', () => {
    const filePath = path.resolve(__dirname, '../../../src/components/booking/FlightCard.js');
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract function body start up to first return
    const funcIndex = content.indexOf('export default function FlightCard');
    const funcSlice = content.slice(funcIndex, funcIndex + 400);

    const earlyReturnIndex = funcSlice.indexOf('if (!flight) return null;');
    const hookThemeIndex = funcSlice.indexOf('useThemeStore(');
    const hookStateIndex = funcSlice.indexOf('useState(');

    expect(hookThemeIndex).toBeGreaterThan(0);
    expect(hookStateIndex).toBeGreaterThan(0);
    expect(earlyReturnIndex).toBeGreaterThan(hookThemeIndex);
    expect(earlyReturnIndex).toBeGreaterThan(hookStateIndex);
  });

  test('RED-HOOK-02: HotelCard should declare all hooks before early return if (!hotel)', () => {
    const filePath = path.resolve(__dirname, '../../../src/components/booking/HotelCard.js');
    const content = fs.readFileSync(filePath, 'utf8');

    const funcIndex = content.indexOf('export default function HotelCard');
    const funcSlice = content.slice(funcIndex, funcIndex + 400);

    const earlyReturnIndex = funcSlice.indexOf('if (!hotel) return null;');
    const hookThemeIndex = funcSlice.indexOf('useThemeStore(');

    expect(hookThemeIndex).toBeGreaterThan(0);
    expect(earlyReturnIndex).toBeGreaterThan(hookThemeIndex);
  });

  test('RED-HOOK-03: BoardingPassModal should declare all hooks before early return if (!ticket)', () => {
    const filePath = path.resolve(__dirname, '../../../src/components/booking/BoardingPassModal.js');
    const content = fs.readFileSync(filePath, 'utf8');

    const funcIndex = content.indexOf('const BoardingPassModal =');
    const funcSlice = content.slice(funcIndex, funcIndex + 400);

    const earlyReturnIndex = funcSlice.indexOf('if (!ticket) return null;');
    const hookThemeIndex = funcSlice.indexOf('useThemeStore(');
    const hookMemoIndex = funcSlice.indexOf('useMemo(');

    expect(hookThemeIndex).toBeGreaterThan(0);
    expect(hookMemoIndex).toBeGreaterThan(0);
    expect(earlyReturnIndex).toBeGreaterThan(hookThemeIndex);
    expect(earlyReturnIndex).toBeGreaterThan(hookMemoIndex);
  });

  test('RED-HOOK-04: Dynamic re-rendering from null to populated props does not throw', () => {
    // FlightCard
    const { rerender: rerenderFlight } = render(<FlightCard flight={null} />);
    expect(() => rerenderFlight(<FlightCard flight={sampleFlight} />)).not.toThrow();

    // HotelCard
    const { rerender: rerenderHotel } = render(<HotelCard hotel={null} />);
    expect(() => rerenderHotel(<HotelCard hotel={sampleHotel} />)).not.toThrow();

    // BoardingPassModal
    const { rerender: rerenderModal } = render(<BoardingPassModal visible={false} ticket={null} />);
    expect(() => rerenderModal(<BoardingPassModal visible={true} ticket={sampleTicket} />)).not.toThrow();
  });
});
