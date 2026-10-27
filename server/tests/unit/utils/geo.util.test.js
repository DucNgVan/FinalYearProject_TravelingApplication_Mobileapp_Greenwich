const {
  calculateHaversineDistance,
  estimateTransitTime,
} = require('../../../src/utils/geo.util');

describe('Unit Test: Geo & Haversine Distance Utility', () => {
  test('RED-IT-01: calculateHaversineDistance should calculate accurate distance in km between two GPS coordinates', () => {
    // Hanoi: 21.0285° N, 105.8542° E
    const hanoi = { lat: 21.0285, lng: 105.8542 };
    // Da Nang: 16.0544° N, 108.2022° E
    const danang = { lat: 16.0544, lng: 108.2022 };

    const distanceKm = calculateHaversineDistance(hanoi, danang);

    // Great circle distance between Hanoi and Da Nang is approximately 606 km
    expect(typeof distanceKm).toBe('number');
    expect(distanceKm).toBeGreaterThan(600);
    expect(distanceKm).toBeLessThan(615);
  });

  test('RED-IT-02: estimateTransitTime should calculate duration in minutes based on transit mode', () => {
    // 15 km driving in urban traffic (~30 km/h) => 30 minutes
    const driveTime = estimateTransitTime(15, 'DRIVING');
    expect(driveTime).toBe(30);

    // 3 km walking (~4.5 km/h) => 40 minutes
    const walkTime = estimateTransitTime(3, 'WALKING');
    expect(walkTime).toBe(40);

    // Default mode should be DRIVING
    const defaultDrive = estimateTransitTime(15);
    expect(defaultDrive).toBe(30);
  });
});
