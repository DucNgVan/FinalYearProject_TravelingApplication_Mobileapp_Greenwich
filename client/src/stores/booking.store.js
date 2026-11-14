import { create } from 'zustand';
import apiClient from '../api/client';

export const useBookingStore = create((set, get) => ({
  flights: [],
  hotels: [],
  selectedFlight: null,
  selectedHotel: null,
  isLoadingFlights: false,
  isLoadingHotels: false,
  flightError: null,
  hotelError: null,
  bookedTickets: [],
  bookedHotels: [],
  flightFilters: {
    directOnly: false,
    maxPrice: null,
    sortBy: 'price:asc',
  },
  hotelFilters: {
    minRating: 0,
    maxPrice: null,
    sortBy: 'price:asc',
  },

  bookFlightSandbox: (flight, passengerDetails = {}, seat = null, ancillaries = [], customTotal = null, fareTier = 'Classic') => {
    const carrier = flight.airlineCode || 'VN';
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const pnr = `${carrier}-${randomChars}`;
    const random10 = Math.floor(1000000000 + Math.random() * 9000000000);
    const ticketNumber = `738-${random10}`;

    const ancillariesTotal = Array.isArray(ancillaries)
      ? ancillaries.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;
    const seatSurcharge = seat?.surcharge || 0;
    const calculatedTotal = customTotal !== null
      ? customTotal
      : (flight.price?.amount || 0) + ancillariesTotal + seatSurcharge;

    const newTicket = {
      id: `tkt-${Date.now()}-${randomChars}`,
      pnr,
      ticketNumber,
      flightId: flight.id,
      airlineCode: flight.airlineCode,
      airlineName: flight.airlineName,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      durationMinutes: flight.durationMinutes,
      stops: flight.stops,
      aircraft: flight.aircraft || (flight.flightNumber?.includes('VN-0240') ? 'Airbus A350-900' : 'Airbus A321'),
      cabinClass: flight.cabinClass || 'ECONOMY',
      fareTier: fareTier || 'Classic',
      totalPrice: calculatedTotal,
      currency: flight.price?.currency || 'VND',
      seat: seat || { code: '12A', type: 'Standard' },
      ancillaries: ancillaries || [],
      passenger: {
        fullName: passengerDetails.fullName || 'John Doe',
        documentId: passengerDetails.documentId || 'C01928491',
        email: passengerDetails.email || 'traveler@example.com',
        phone: passengerDetails.phone || '+84 901 234 567',
        title: passengerDetails.title || 'Mr',
        dob: passengerDetails.dob || '15/10/2002',
      },
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
    };

    set((state) => ({
      bookedTickets: [newTicket, ...(state.bookedTickets || [])],
    }));

    return {
      success: true,
      pnr,
      ticketNumber,
      ticket: newTicket,
    };
  },

  bookHotelSandbox: (hotel, guestDetails = {}, checkIn = '2026-11-14', checkOut = '2026-11-17', rooms = 1) => {
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const voucherNumber = `HTL-${randomChars}`;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
    const totalPrice = (hotel.pricePerNight || 1500000) * nights * rooms;

    const newStay = {
      id: `stay-${Date.now()}-${randomChars}`,
      voucherNumber,
      hotelId: hotel.id,
      hotelName: hotel.name,
      city: hotel.city,
      address: hotel.address,
      starRating: hotel.starRating || 4,
      reviewScore: hotel.reviewScore || 9.0,
      checkIn,
      checkOut,
      nights,
      rooms,
      totalPrice,
      currency: hotel.currency || 'VND',
      thumbnailUrl: hotel.thumbnailUrl,
      provider: hotel.provider || 'DUFFEL_STAYS',
      guest: {
        fullName: guestDetails.fullName || 'Alex Rivers',
        email: guestDetails.email || 'traveler@example.com',
        phone: guestDetails.phone || '+84 901 234 567',
      },
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
    };

    set((state) => ({
      bookedHotels: [newStay, ...(state.bookedHotels || [])],
    }));

    return {
      success: true,
      voucherNumber,
      stay: newStay,
    };
  },

  refundTicket: (idOrPnr, refundAmount = 0, reason = 'Traveler requested cancellation via Duffel API') => {
    set((state) => ({
      bookedTickets: (state.bookedTickets || []).map((t) => {
        if (t.id === idOrPnr || t.pnr === idOrPnr) {
          return {
            ...t,
            status: 'REFUNDED',
            refundAmount,
            refundReason: reason,
            refundedAt: new Date().toISOString(),
          };
        }
        return t;
      }),
    }));
  },

  changeTicketFlight: (idOrPnr, updatedDetails = {}) => {
    set((state) => ({
      bookedTickets: (state.bookedTickets || []).map((t) => {
        if (t.id === idOrPnr || t.pnr === idOrPnr) {
          return {
            ...t,
            ...updatedDetails,
            status: 'CONFIRMED',
            modifiedAt: new Date().toISOString(),
          };
        }
        return t;
      }),
    }));
  },

  cancelBookedTicket: (idOrPnr) => {
    set((state) => ({
      bookedTickets: (state.bookedTickets || []).filter(
        (t) => t.id !== idOrPnr && t.pnr !== idOrPnr
      ),
    }));
  },

  searchFlights: async (params) => {
    set({ isLoadingFlights: true, flightError: null });
    try {
      const response = await apiClient.get('/flights/search', { params });
      const flightsList = Array.isArray(response)
        ? response
        : (response?.flights || []);
      set({ flights: flightsList, isLoadingFlights: false });
      return response;
    } catch (error) {
      const message = error.message || 'Failed to search flights';
      set({ flightError: message, isLoadingFlights: false, flights: [] });
      throw error;
    }
  },

  searchHotels: async (params) => {
    set({ isLoadingHotels: true, hotelError: null });
    try {
      const cleanParams = { ...params };
      if (cleanParams.city && cleanParams.destination) {
        delete cleanParams.destination;
      }
      const response = await apiClient.get('/hotels/search', { params: cleanParams });
      const hotelsList = Array.isArray(response)
        ? response
        : (response?.hotels || []);
      set({ hotels: hotelsList, isLoadingHotels: false });
      return response;
    } catch (error) {
      const message = error.message || 'Failed to search hotels';
      set({ hotelError: message, isLoadingHotels: false, hotels: [] });
      throw error;
    }
  },

  setFlightFilters: (filters) => {
    set((state) => ({
      flightFilters: { ...state.flightFilters, ...filters },
    }));
  },

  setHotelFilters: (filters) => {
    set((state) => ({
      hotelFilters: { ...state.hotelFilters, ...filters },
    }));
  },

  selectFlight: (flight) => {
    set({ selectedFlight: flight });
  },

  selectHotel: (hotel) => {
    set({ selectedHotel: hotel });
  },

  clearBookingSelection: () => {
    set({ selectedFlight: null, selectedHotel: null });
  },
}));
