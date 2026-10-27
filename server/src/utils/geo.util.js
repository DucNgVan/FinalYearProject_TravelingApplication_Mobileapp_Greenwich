/**
 * Geo & Haversine Distance Utility
 * Computes great-circle distances between GPS coordinates on WGS84 ellipsoid.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance in kilometers between two GPS coordinates using Haversine formula
 * @param {{ lat: number, lng: number }} coord1 
 * @param {{ lat: number, lng: number }} coord2 
 * @returns {number} Distance in kilometers
 */
function calculateHaversineDistance(coord1, coord2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const lat1 = toRad(coord1.lat);
  const lon1 = toRad(coord1.lng);
  const lat2 = toRad(coord2.lat);
  const lon2 = toRad(coord2.lng);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Estimate transit duration in minutes
 * @param {number} distanceKm 
 * @param {'DRIVING' | 'WALKING' | 'TRANSIT'} mode 
 * @returns {number} Duration in minutes
 */
function estimateTransitTime(distanceKm, mode = 'DRIVING') {
  if (mode === 'WALKING') {
    // Average walking speed ~4.5 km/h
    return Math.round((distanceKm / 4.5) * 60);
  }
  // Urban Vietnam driving/transit average ~30 km/h
  return Math.round((distanceKm / 30) * 60);
}

module.exports = {
  calculateHaversineDistance,
  estimateTransitTime,
};
