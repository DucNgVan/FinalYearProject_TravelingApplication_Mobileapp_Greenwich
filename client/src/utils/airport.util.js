export const POPULAR_AIRPORTS = [
  { code: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat International Airport', aliases: ['sài gòn', 'saigon', 'hồ chí minh', 'ho chi minh', 'tp hcm', 'tphcm', 'sgn'] },
  { code: 'HAN', city: 'Hanoi', name: 'Noi Bai International Airport', aliases: ['hà nội', 'ha noi', 'nội bài', 'noi bai', 'han'] },
  { code: 'DAD', city: 'Da Nang', name: 'Da Nang International Airport', aliases: ['đà nẵng', 'da nang', 'danang', 'dad'] },
  { code: 'PQC', city: 'Phu Quoc', name: 'Phu Quoc International Airport', aliases: ['phú quốc', 'phu quoc', 'pqc'] },
  { code: 'CXR', city: 'Nha Trang', name: 'Cam Ranh International Airport', aliases: ['nha trang', 'cam ranh', 'cxr'] },
  { code: 'DLI', city: 'Da Lat', name: 'Lien Khuong Airport', aliases: ['đà lạt', 'da lat', 'liên khương', 'lien khuong', 'dli'] },
  { code: 'HUI', city: 'Hue', name: 'Phu Bai International Airport', aliases: ['huế', 'hue', 'phú bài', 'phu bai', 'hui'] },
  { code: 'HPH', city: 'Hai Phong', name: 'Cat Bi International Airport', aliases: ['hải phòng', 'hai phong', 'cát bi', 'cat bi', 'hph'] },
  { code: 'UIH', city: 'Quy Nhon', name: 'Phu Cat Airport', aliases: ['quy nhơn', 'quy nhon', 'phù cát', 'phu cat', 'uih'] },
  { code: 'VII', city: 'Vinh', name: 'Vinh International Airport', aliases: ['vinh', 'nghệ an', 'nghe an', 'vii'] },
  { code: 'VCA', city: 'Can Tho', name: 'Can Tho International Airport', aliases: ['cần thơ', 'can tho', 'vca'] },
  { code: 'SIN', city: 'Singapore', name: 'Changi International Airport', aliases: ['singapore', 'changi', 'sin'] },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', aliases: ['bangkok', 'suvarnabhumi', 'bkk'] },
];

/**
 * Normalizes text to lowercase without diacritics for flexible fuzzy searching
 */
export function removeVietnameseTones(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Resolves a given city name, alias, or code to a standard 3-letter IATA code
 * E.g. "Hà Nội" -> "HAN", "Sài Gòn" -> "SGN", "dad" -> "DAD"
 */
export function resolveAirportCode(input = '') {
  if (!input) return '';
  const trimmed = input.trim();
  const normalized = removeVietnameseTones(trimmed);

  // Check direct 3-letter match
  if (trimmed.length === 3) {
    const directCode = trimmed.toUpperCase();
    const foundByCode = POPULAR_AIRPORTS.find((a) => a.code === directCode);
    if (foundByCode) return foundByCode.code;
  }

  // Check aliases
  for (const airport of POPULAR_AIRPORTS) {
    if (airport.code.toLowerCase() === normalized) {
      return airport.code;
    }
    const cityNorm = removeVietnameseTones(airport.city);
    if (cityNorm === normalized || normalized.includes(cityNorm) || cityNorm.includes(normalized)) {
      return airport.code;
    }
    for (const alias of airport.aliases) {
      const aliasNorm = removeVietnameseTones(alias);
      if (aliasNorm === normalized || normalized.includes(aliasNorm) || aliasNorm.includes(normalized)) {
        return airport.code;
      }
    }
  }

  // Fallback to uppercase input if 3 characters
  if (trimmed.length === 3) {
    return trimmed.toUpperCase();
  }

  return trimmed.toUpperCase();
}

/**
 * Searches airports matching query for autocomplete / quick suggestions
 */
export function searchAirports(query = '') {
  if (!query || !query.trim()) return POPULAR_AIRPORTS.slice(0, 6);
  const qNorm = removeVietnameseTones(query);

  return POPULAR_AIRPORTS.filter((airport) => {
    const codeMatch = airport.code.toLowerCase().includes(qNorm);
    const cityMatch = removeVietnameseTones(airport.city).includes(qNorm);
    const nameMatch = removeVietnameseTones(airport.name).includes(qNorm);
    const aliasMatch = airport.aliases.some((al) => removeVietnameseTones(al).includes(qNorm));
    return codeMatch || cityMatch || nameMatch || aliasMatch;
  });
}
