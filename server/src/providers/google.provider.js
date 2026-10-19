/**
 * Google Places API (New) Provider for Hotel Discovery
 * Integrates with Google Places SearchText v1 API
 */
class GooglePlacesProvider {
  constructor(apiKey = process.env.GOOGLE_PLACES_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://places.googleapis.com/v1/places:searchText';
  }

  /**
   * Search hotels via Google Places (New) Text Search
   * @param {Object} query
   * @param {string} query.city
   * @param {string} [query.checkIn]
   * @param {string} [query.checkOut]
   * @param {number} [query.guests]
   */
  async searchHotels({ city, checkIn, checkOut, guests = 2 }) {
    if (!this.apiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY is not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount',
        },
        body: JSON.stringify({
          textQuery: `khách sạn hotel ở ${city}`,
          languageCode: 'vi',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Google Places API returned ${response.status}: ${errorBody}`);
      }

      const json = await response.json();
      const rawPlaces = json.places || [];
      return this._mapGooglePlaces(rawPlaces, city);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  /**
   * Map Google Places payload to UnifiedHotel schema
   */
  _mapGooglePlaces(places, city) {
    return places.map((place, idx) => {
      const rating = place.rating || 4.2;
      const starRating = rating >= 4.5 ? 5 : rating >= 4.0 ? 4 : 3;
      const reviewScore = parseFloat((rating * 2).toFixed(1)); // Convert 5-star to 10-point scale
      const basePrice = starRating === 5 ? 2800000 : starRating === 4 ? 1450000 : 750000;

      return {
        id: place.id || `google-place-${idx}`,
        provider: 'GOOGLE_PLACES',
        name: place.displayName?.text || 'Khách sạn',
        city,
        address: place.formattedAddress || `${city}, Việt Nam`,
        starRating,
        reviewScore,
        pricePerNight: basePrice,
        currency: 'VND',
        userRatingCount: place.userRatingCount || 0,
      };
    });
  }
}

module.exports = new GooglePlacesProvider();
