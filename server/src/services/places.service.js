const PlacesProvider = require('../providers/places.provider');
const cacheService = require('./cache.service');
const { calculateHaversineDistance } = require('../utils/geo.util');

class PlacesService {
  constructor(options = {}) {
    this.provider = options.provider || new PlacesProvider();
    this.cache = options.cache || cacheService;
    this.defaultTtl = 86400; // 24 hours
  }

  /**
   * Search places for a city with Cache-Aside pattern
   * @param {{ city: string, category?: string, query?: string }} params 
   * @returns {Promise<Array>} List of UnifiedPlace objects
   */
  async searchPlaces({ city = 'Da Nang', category = 'all', query = '' } = {}) {
    const c = city.toLowerCase().trim();
    const cat = (category || 'all').toLowerCase().trim();
    const cacheKey = `nomadix:places:${c}:${cat}`;

    // 1. Check Cache
    const cachedPlaces = await this.cache.get(cacheKey);
    if (cachedPlaces && Array.isArray(cachedPlaces)) {
      if (query && query.trim() !== '') {
        const q = query.toLowerCase().trim();
        return cachedPlaces.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.address && p.address.toLowerCase().includes(q))
        );
      }
      return cachedPlaces;
    }

    // 2. Cache Miss: Fetch from Provider
    const places = await this.provider.searchPlaces({
      city,
      category,
      query: '', // fetch complete category dataset for effective caching
    });

    // 3. Populate Cache
    await this.cache.set(cacheKey, places, this.defaultTtl);

    // 4. Filter by query if provided
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      return places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.address && p.address.toLowerCase().includes(q))
      );
    }

    return places;
  }

  /**
   * AI-driven geographic clustering to organize selected places into multi-day itinerary
   * Uses Hierarchical Agglomerative Clustering (HAC) with Haversine distance
   * and Nearest-Neighbor TSP to minimize transit time between stops.
   * 
   * @param {Array} places - Array of selected place objects with lat/lng
   * @param {number} durationDays - Number of days in the trip
   * @returns {{ days: Object }} Itinerary days map with clustered stops
   */
  clusterPlacesIntoDays(places = [], durationDays = 1) {
    const totalDays = Math.max(1, parseInt(durationDays, 10) || 1);
    const days = {};
    for (let d = 1; d <= totalDays; d++) {
      days[d] = [];
    }

    if (!places || places.length === 0) {
      return { days };
    }

    // Clone items
    const items = places.map((p, index) => ({
      ...p,
      originalIndex: index,
      lat: Number(p.lat) || 0,
      lng: Number(p.lng) || 0,
    }));

    // If places count <= durationDays, allocate 1 place per day
    if (items.length <= totalDays) {
      items.forEach((item, idx) => {
        days[idx + 1] = [
          {
            ...item,
            orderIndex: 1,
            transitKm: 0,
            timeSlot: '09:00 - 12:00',
          },
        ];
      });
      return { days };
    }

    // Hierarchical Agglomerative Clustering
    // Initialize each place as an individual cluster
    let clusters = items.map((item) => [item]);

    // Average-linkage distance between two clusters
    const computeClusterDistance = (c1, c2) => {
      let sum = 0;
      let count = 0;
      for (const p1 of c1) {
        for (const p2 of c2) {
          sum += calculateHaversineDistance(
            { lat: p1.lat, lng: p1.lng },
            { lat: p2.lat, lng: p2.lng }
          );
          count++;
        }
      }
      return count > 0 ? sum / count : Infinity;
    };

    while (clusters.length > totalDays) {
      let minDistance = Infinity;
      let bestI = -1;
      let bestJ = -1;

      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const dist = computeClusterDistance(clusters[i], clusters[j]);
          if (dist < minDistance) {
            minDistance = dist;
            bestI = i;
            bestJ = j;
          }
        }
      }

      if (bestI === -1 || bestJ === -1) break;

      const mergedCluster = [...clusters[bestI], ...clusters[bestJ]];
      clusters = clusters.filter((_, idx) => idx !== bestI && idx !== bestJ);
      clusters.push(mergedCluster);
    }

    // Sort clusters by the earliest original index to maintain natural user selection order
    clusters.sort((a, b) => {
      const minA = Math.min(...a.map((x) => x.originalIndex));
      const minB = Math.min(...b.map((x) => x.originalIndex));
      return minA - minB;
    });

    const timeSlots = [
      '08:30 - 11:30',
      '13:30 - 16:30',
      '17:30 - 20:00',
      '20:00 - 22:00',
    ];

    clusters.forEach((cluster, clusterIdx) => {
      const dayNumber = clusterIdx + 1;
      const ordered = this._orderStopsNearestNeighbor(cluster);

      days[dayNumber] = ordered.map((stop, idx) => {
        let transitKm = 0;
        if (idx > 0) {
          transitKm = calculateHaversineDistance(
            { lat: ordered[idx - 1].lat, lng: ordered[idx - 1].lng },
            { lat: stop.lat, lng: stop.lng }
          );
        }

        const cleanStop = { ...stop };
        delete cleanStop.originalIndex;

        return {
          ...cleanStop,
          orderIndex: idx + 1,
          transitKm,
          timeSlot: timeSlots[idx] || `${String(9 + idx * 2).padStart(2, '0')}:00 - ${String(11 + idx * 2).padStart(2, '0')}:00`,
        };
      });
    });

    return { days };
  }

  /**
   * Nearest-Neighbor TSP heuristic to sequence stops within each day
   * @private
   */
  _orderStopsNearestNeighbor(stops) {
    if (stops.length <= 1) return stops;
    const unvisited = [...stops];
    const ordered = [unvisited.shift()];

    while (unvisited.length > 0) {
      const current = ordered[ordered.length - 1];
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = calculateHaversineDistance(
          { lat: current.lat, lng: current.lng },
          { lat: unvisited[i].lat, lng: unvisited[i].lng }
        );
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      ordered.push(unvisited.splice(nearestIdx, 1)[0]);
    }

    return ordered;
  }
}

module.exports = PlacesService;
