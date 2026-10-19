/**
 * Duffel Travel API Provider (Flights & Stays)
 * Next-Gen Travel Tech API Integration
 */
class DuffelProvider {
  constructor(apiToken = process.env.DUFFEL_API_TOKEN) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.duffel.com';
  }

  /**
   * Search flights via Duffel Offer Requests v2
   */
  async searchFlights({ origin, destination, departureDate, passengers = 1, cabinClass = 'economy' }) {
    if (!this.apiToken) {
      throw new Error('DUFFEL_API_TOKEN is not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const passengerList = Array.from({ length: passengers }, () => ({ type: 'adult' }));
      const response = await fetch(`${this.baseUrl}/air/offer_requests?return_offers=true`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Duffel-Version': 'v2',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Connection: 'close',
        },
        body: JSON.stringify({
          data: {
            slices: [
              {
                origin: origin.toUpperCase(),
                destination: destination.toUpperCase(),
                departure_date: departureDate,
              },
            ],
            passengers: passengerList,
            cabin_class: cabinClass.toLowerCase(),
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Duffel Flight API returned ${response.status}: ${errorBody}`);
      }

      const json = await response.json();
      const rawOffers = json.data?.offers || [];
      return this._mapDuffelOffers(rawOffers, origin, destination);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * Internal mapper from Duffel raw offer to internal schema
   */
  _mapDuffelOffers(offers, origin, destination) {
    return offers.map((offer) => {
      const slice = offer.slices[0];
      const segment = slice.segments[0];
      const owner = offer.owner;

      let amount = parseFloat(offer.total_amount);
      if (offer.total_currency === 'USD') {
        amount = Math.round(amount * 25000);
      } else if (offer.total_currency === 'EUR') {
        amount = Math.round(amount * 27000);
      }

      const carrierCode = segment.operating_carrier.iata_code || owner.iata_code;
      const flightNum = `${carrierCode}-${segment.operating_carrier_flight_number || '100'}`;

      // Baggage summary computation
      const passenger = segment.passengers?.[0];
      const baggages = passenger?.baggages || [];
      const checkedBags = baggages.filter((b) => b.type === 'checked');
      const carryOnBags = baggages.filter((b) => b.type === 'carry_on');
      const baggageSummary = checkedBags.length > 0
        ? `${checkedBags.length} kiện ký gửi (${checkedBags.length * 20}kg) • ${carryOnBags.length || 1} kiện xách tay (7kg)`
        : '1 kiện xách tay (7kg)';

      return {
        id: offer.id,
        provider: 'DUFFEL',
        airlineCode: owner.iata_code,
        airlineName: owner.name,
        airlineLogo: `https://images.kiwi.com/airlines/64x64/${owner.iata_code}.png`,
        airlineLogoSvg: owner.logo_symbol_url || `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${owner.iata_code}.svg`,
        airlineLogoLockup: owner.logo_lockup_url || null,
        conditionsUrl: owner.conditions_of_carriage_url || null,
        aircraft: segment.aircraft?.name || 'Airbus A321',
        originAirportName: slice.origin?.name || origin.toUpperCase(),
        destinationAirportName: slice.destination?.name || destination.toUpperCase(),
        originCity: slice.origin?.city_name || origin.toUpperCase(),
        destinationCity: slice.destination?.city_name || destination.toUpperCase(),
        flightNumber: flightNum,
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: segment.departing_at,
        arrivalTime: segment.arriving_at,
        durationMinutes: this._parseDuration(slice.duration),
        stops: slice.segments.length - 1,
        baggageTransfer: slice.segments.length > 1
          ? (offer.is_self_transfer ? 'Tự chuyển hành lý (Thủ công)' : 'Chuyển hành lý tự động')
          : null,
        baggageTransferType: slice.segments.length > 1
          ? (offer.is_self_transfer ? 'manual' : 'automatic')
          : null,
        cabinClass: offer.cabin_class,
        cabinMarketingName: passenger?.cabin_class_marketing_name || 'Economy Standard',
        baggages,
        baggageSummary,
        emissionsKg: offer.total_emissions_kg || null,
        price: {
          currency: 'VND',
          amount,
        },
      };
    });
  }

  _parseDuration(isoDuration) {
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minsMatch = isoDuration.match(/(\d+)M/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    return hours * 60 + mins;
  }
}

module.exports = new DuffelProvider();
