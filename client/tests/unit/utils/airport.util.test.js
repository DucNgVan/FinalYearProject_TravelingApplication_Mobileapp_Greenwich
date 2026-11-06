import { resolveAirportCode, searchAirports, POPULAR_AIRPORTS } from '../../../src/utils/airport.util';

describe('Unit Test: Airport & City Name Resolver', () => {
  test('RED-FE-AIRPORT-01: should resolve Vietnamese city names to proper 3-letter IATA codes', () => {
    expect(resolveAirportCode('Hà Nội')).toBe('HAN');
    expect(resolveAirportCode('ha noi')).toBe('HAN');
    expect(resolveAirportCode('TP. Hồ Chí Minh')).toBe('SGN');
    expect(resolveAirportCode('Sài Gòn')).toBe('SGN');
    expect(resolveAirportCode('sai gon')).toBe('SGN');
    expect(resolveAirportCode('TP HCM')).toBe('SGN');
    expect(resolveAirportCode('Đà Nẵng')).toBe('DAD');
    expect(resolveAirportCode('da nang')).toBe('DAD');
    expect(resolveAirportCode('Phú Quốc')).toBe('PQC');
    expect(resolveAirportCode('Nha Trang')).toBe('CXR');
    expect(resolveAirportCode('Đà Lạt')).toBe('DLI');
  });

  test('RED-FE-AIRPORT-02: should preserve existing valid IATA codes', () => {
    expect(resolveAirportCode('HAN')).toBe('HAN');
    expect(resolveAirportCode('SGN')).toBe('SGN');
    expect(resolveAirportCode('dad')).toBe('DAD');
    expect(resolveAirportCode('PQC')).toBe('PQC');
  });

  test('RED-FE-AIRPORT-03: searchAirports should return matching airports by query', () => {
    const results = searchAirports('Đà');
    expect(results.length).toBeGreaterThanOrEqual(2); // Đà Nẵng, Đà Lạt
    expect(results.some((r) => r.code === 'DAD')).toBe(true);
    expect(results.some((r) => r.code === 'DLI')).toBe(true);

    const emptyResults = searchAirports('');
    expect(emptyResults.length).toBeGreaterThan(0);
  });

  test('RED-FE-AIRPORT-04: POPULAR_AIRPORTS should include major hub definitions', () => {
    expect(POPULAR_AIRPORTS.some((a) => a.code === 'SGN')).toBe(true);
    expect(POPULAR_AIRPORTS.some((a) => a.code === 'HAN')).toBe(true);
    expect(POPULAR_AIRPORTS.some((a) => a.code === 'DAD')).toBe(true);
  });

  test('should handle edge cases: empty input, unknown codes, aliases', () => {
    expect(resolveAirportCode('')).toBe('');
    expect(resolveAirportCode(null)).toBe('');
    expect(resolveAirportCode('XYZ')).toBe('XYZ');
    expect(resolveAirportCode('Unknown City')).toBe('UNKNOWN CITY');
  });
});
