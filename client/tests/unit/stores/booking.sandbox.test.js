import { useBookingStore } from '../../../src/stores/booking.store';

describe('Unit Test: Booking Store - Sandbox Ticket Management', () => {
  const mockFlight = {
    id: 'off_vna_001',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T07:00:00Z',
    arrivalTime: '2026-10-15T09:10:00Z',
    durationMinutes: 130,
    stops: 0,
    aircraft: 'Airbus A350-900',
    cabinClass: 'ECONOMY',
    price: { currency: 'VND', amount: 2073060 },
  };

  const mockPassenger = {
    fullName: 'Nguyễn Văn Đức',
    documentId: 'C01928491',
    email: 'ducnva.wk@gmail.com',
  };

  beforeEach(() => {
    useBookingStore.setState({
      bookedTickets: [],
    });
  });

  test('RED-FE-SBX-01: useBookingStore should initialize with empty bookedTickets array and provide bookFlightSandbox action', () => {
    const state = useBookingStore.getState();
    expect(Array.isArray(state.bookedTickets)).toBe(true);
    expect(state.bookedTickets).toHaveLength(0);
    expect(typeof state.bookFlightSandbox).toBe('function');
  });

  test('RED-FE-SBX-02: bookFlightSandbox should generate authentic PNR, e-ticket number, set status CONFIRMED, and save to bookedTickets', () => {
    const result = useBookingStore.getState().bookFlightSandbox(mockFlight, mockPassenger);

    expect(result.success).toBe(true);
    expect(result.pnr).toMatch(/^[A-Z0-9]{2}-[A-Z0-9]{6}$/);
    expect(result.ticketNumber).toMatch(/^\d{3}-\d{10}$/);

    const state = useBookingStore.getState();
    expect(state.bookedTickets).toHaveLength(1);
    const saved = state.bookedTickets[0];
    expect(saved.flightNumber).toBe('VN-0240');
    expect(saved.airlineName).toBe('Vietnam Airlines');
    expect(saved.pnr).toBe(result.pnr);
    expect(saved.ticketNumber).toBe(result.ticketNumber);
    expect(saved.status).toBe('CONFIRMED');
    expect(saved.passenger.fullName).toBe('Nguyễn Văn Đức');
    expect(saved.totalPrice).toBe(2073060);
  });

  test('RED-FE-SBX-03: multiple sandbox bookings should prepend newest tickets first', () => {
    const secondFlight = {
      ...mockFlight,
      id: 'off_vj_002',
      airlineCode: 'VJ',
      airlineName: 'VietJet Air',
      flightNumber: 'VJ-0120',
      price: { currency: 'VND', amount: 1326780 },
    };

    useBookingStore.getState().bookFlightSandbox(mockFlight, mockPassenger);
    useBookingStore.getState().bookFlightSandbox(secondFlight, mockPassenger);

    const state = useBookingStore.getState();
    expect(state.bookedTickets).toHaveLength(2);
    expect(state.bookedTickets[0].flightNumber).toBe('VJ-0120');
    expect(state.bookedTickets[1].flightNumber).toBe('VN-0240');
  });
});
