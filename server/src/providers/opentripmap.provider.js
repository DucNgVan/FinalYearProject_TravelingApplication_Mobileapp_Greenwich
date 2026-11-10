/**
 * OpenTripMap Provider
 * Connects to OpenTripMap REST API (Geoname, Radius, and Place Detail endpoints)
 * and maps responses into the standard UnifiedPlace schema.
 */
class OpenTripMapProvider {
  constructor({ apiKey } = {}) {
    this.apiKey = apiKey || process.env.OPENTRIPMAP_API_KEY || '5ae2e3f221c38a28845f05b6f24ffb45029bc3e75018d74e96a32315';
    this.baseUrl = 'https://api.opentripmap.com/0.1/en/places';
    this.fetchClient = this._defaultFetchClient.bind(this);
  }

  async _defaultFetchClient(url) {
    if (typeof fetch === 'function') {
      return fetch(url);
    }
    // Fallback if global fetch is not available in Node < 18
    const https = require('https');
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => JSON.parse(body),
          });
        });
      }).on('error', reject);
    });
  }

  /**
   * Search places by city name
   * 1. Resolves city GPS coordinates via Geoname API
   * 2. Queries Radius API for tourist attractions
   * @param {string} cityName
   * @param {Object} options { radius: 5000, limit: 20 }
   * @returns {Promise<Array<UnifiedPlace>>}
   */
  async searchPlacesByCity(cityName = 'Danang', options = {}) {
    const radius = options.radius || 15000;
    const limit = options.limit || 30;

    try {
      // 1. Resolve coordinates
      const geonameUrl = `${this.baseUrl}/geoname?name=${encodeURIComponent(cityName)}&apikey=${this.apiKey}`;
      const geoRes = await this.fetchClient(geonameUrl);
      if (!geoRes.ok) {
        throw new Error(`OpenTripMap Geoname API error: status ${geoRes.status}`);
      }
      const geoData = await geoRes.json();

      if (!geoData || !geoData.lat || !geoData.lon) {
        throw new Error(`OpenTripMap: coordinates not found for city "${cityName}"`);
      }

      const { lat, lon } = geoData;

      // 2. Query radius places with rich categories
      const kinds = 'cultural,historic,natural,museums,architecture,amusements,religion';
      const radiusUrl = `${this.baseUrl}/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&kinds=${kinds}&apikey=${this.apiKey}`;
      const radiusRes = await this.fetchClient(radiusUrl);
      if (!radiusRes.ok) {
        throw new Error(`OpenTripMap Radius API error: status ${radiusRes.status}`);
      }
      const radiusData = await radiusRes.json();

      const rawFeatures = radiusData.features || [];
      // Filter out unnamed objects
      const features = rawFeatures.filter(
        (feat) => feat.properties && feat.properties.name && feat.properties.name.trim() !== ''
      );

      if (features.length === 0) {
        return this._getCuratedCatalog(cityName);
      }

      return features.map((feat) => this.normalizePlace(feat, cityName));
    } catch (err) {
      // Graceful fallback to curated catalog on error / rate limit
      return this._getCuratedCatalog(cityName);
    }
  }

  /**
   * Normalize an OpenTripMap feature and optional detail into standard UnifiedPlace schema
   * @param {Object} feature GeoJSON Feature
   * @param {string} cityName
   * @param {Object} details Optional xid detail payload
   * @returns {Object} UnifiedPlace
   */
  normalizePlace(feature, cityName = 'Danang', details = {}) {
    const props = feature.properties || {};
    const geom = feature.geometry || {};
    const coords = geom.coordinates || [0, 0];
    const lng = coords[0];
    const lat = coords[1];

    const rawKinds = props.kinds || '';
    let category = 'landmark';
    if (rawKinds.includes('religion') || rawKinds.includes('temple') || rawKinds.includes('cathedral')) {
      category = 'religion';
    } else if (rawKinds.includes('cultural') || rawKinds.includes('theatre') || rawKinds.includes('museum')) {
      category = 'cultural';
    } else if (rawKinds.includes('beach') || rawKinds.includes('water')) {
      category = 'beach';
    } else if (rawKinds.includes('foods') || rawKinds.includes('restaurant') || rawKinds.includes('cafe')) {
      category = 'food';
    }

    // Map rate (1 to 3) to 5-star rating scale
    const rateVal = Number(props.rate) || 1;
    const rating = Math.min(5, Math.max(3.5, 3.5 + (rateVal - 1) * 0.5));

    // Address formatting
    let address = `${props.name || 'Attraction'}, ${cityName}`;
    if (details.address) {
      const parts = [
        details.address.house_number,
        details.address.road,
        details.address.town || details.address.county,
        details.address.state || details.address.city,
      ].filter(Boolean);
      if (parts.length > 0) address = parts.join(', ');
    }

    // Image
    const image =
      details.preview?.source ||
      details.image ||
      this._resolveAuthenticLandmarkImage(props.name, category, cityName);

    const description =
      details.wikipedia_extracts?.text ||
      props.name ||
      `Popular ${category} in ${cityName}`;

    return {
      id: `otm-${props.xid || feature.id || Math.random().toString(36).slice(2, 8)}`,
      name: props.name || 'Attraction',
      city: cityName,
      lat,
      lng,
      category,
      rating,
      image,
      address,
      description,
      suggestedDuration: 2,
    };
  }

  _resolveAuthenticLandmarkImage(name = '', category = '', cityName = '') {
    const n = (name || '').toLowerCase();

    // Da Nang & Central Vietnam landmarks
    if (n.includes('rồng') || n.includes('dragon bridge') || n.includes('dragon')) {
      return 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/C%E1%BA%A7u_R%E1%BB%93ng.jpg/640px-C%E1%BA%A7u_R%E1%BB%93ng.jpg?landmark=dragon-bridge';
    }
    if (n.includes('bà nà') || n.includes('ba na') || n.includes('cầu vàng') || n.includes('golden bridge')) {
      return 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Linh_Ung_Pagoda.jpg/640px-Linh_Ung_Pagoda.jpg?landmark=bana-hills-golden-bridge';
    }
    if (n.includes('linh ứng') || n.includes('linh ung') || n.includes('sơn trà') || n.includes('son tra')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Chua_Linh_Ung_Da_Nang.jpg/640px-Chua_Linh_Ung_Da_Nang.jpg';
    }
    if (n.includes('ngũ hành sơn') || n.includes('ngu hanh son') || n.includes('marble mountains')) {
      return 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Ngu_hanh_son_toan_canh.jpg/640px-Ngu_hanh_son_toan_canh.jpg';
    }
    if (n.includes('thuận phước') || n.includes('thuan phuoc')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thuan_Phuoc_Bridge.jpg/640px-Thuan_Phuoc_Bridge.jpg';
    }
    if (n.includes('sông hàn') || n.includes('song han') || n.includes('cầu quay')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Song_Han_bridge_at_night.jpg/640px-Song_Han_bridge_at_night.jpg';
    }
    if (n.includes('chăm') || n.includes('cham sculpture') || n.includes('điêu khắc')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Da_Nang_Museum_of_Cham_Sculpture.JPG/640px-Da_Nang_Museum_of_Cham_Sculpture.JPG';
    }
    if (n.includes('con gà') || n.includes('cathedral') || n.includes('giáo xứ')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Nha_Tho_Con_Ga_Da_Nang.JPG/640px-Nha_Tho_Con_Ga_Da_Nang.JPG';
    }
    if (n.includes('mỹ khê') || n.includes('my khe')) {
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80';
    }
    if (n.includes('non nước') || n.includes('non nuoc')) {
      return 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80';
    }
    if (n.includes('chợ cồn') || n.includes('cho con')) {
      return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80';
    }
    if (n.includes('bà dưỡng') || n.includes('ba duong') || n.includes('bánh xèo')) {
      return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80';
    }
    if (n.includes('chợ đêm') || n.includes('night market')) {
      return 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&q=80';
    }
    if (n.includes('chợ hàn') || n.includes('cho han')) {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80';
    }

    // Hanoi Landmarks
    if (n.includes('văn miếu') || n.includes('temple of literature') || n.includes('khuê văn các')) {
      return 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Hanoi_Temple_of_Literature_%28cropped%29.jpg/640px-Hanoi_Temple_of_Literature_%28cropped%29.jpg';
    }
    if (n.includes('hỏa lò') || n.includes('hoa lo')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Hoa_Lo_prison_gate.jpg/640px-Hoa_Lo_prison_gate.jpg';
    }
    if (n.includes('tháp rùa') || n.includes('hồ gươm') || n.includes('hoan kiem')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Turtle_Tower_in_Hoan_Kiem_Lake.jpg/640px-Turtle_Tower_in_Hoan_Kiem_Lake.jpg';
    }
    if (n.includes('thăng long') || n.includes('imperial citadel')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Hoang_thanh_Thang_Long.jpg/640px-Hoang_thanh_Thang_Long.jpg';
    }
    if (n.includes('trấn quốc') || n.includes('tran quoc')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chua_Tran_Quoc.jpg/640px-Chua_Tran_Quoc.jpg';
    }

    // Tokyo Landmarks
    if (n.includes('senso-ji') || n.includes('sensoji') || n.includes('asakusa')) {
      return 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Sensoji_2023.jpg/640px-Sensoji_2023.jpg';
    }
    if (n.includes('tokyo tower')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tokyo_Tower_2023.jpg/640px-Tokyo_Tower_2023.jpg';
    }
    if (n.includes('fushimi inari') || n.includes('torii')) {
      return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80';
    }
    if (n.includes('shibuya')) {
      return 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80';
    }

    // Paris Landmarks
    if (n.includes('eiffel')) {
      return 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80';
    }
    if (n.includes('louvre')) {
      return 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80';
    }

    // Rome Landmarks
    if (n.includes('colosseum') || n.includes('colosseo')) {
      return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80';
    }
    if (n.includes('trevi')) {
      return 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&q=80';
    }

    return this._getDefaultImageForCategory(category, cityName);
  }

  _getDefaultImageForCategory(category, city) {
    const images = {
      religion: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
      cultural: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    };
    return images[category] || images.default;
  }

  _getCuratedCatalog(cityName = 'Danang') {
    return [
      {
        id: 'otm-danang-1',
        name: 'Nhà hát Trưng Vương',
        city: cityName,
        lat: 16.0688438,
        lng: 108.2207413,
        category: 'cultural',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
        address: '35A Phan Châu Trinh, Hải Châu, Đà Nẵng',
        description: 'Nhà hát trung tâm và trung tâm biểu diễn nghệ thuật lớn của Đà Nẵng',
        suggestedDuration: 2,
      },
      {
        id: 'otm-danang-2',
        name: 'Da Nang Cathedral (Nhà thờ Con Gà)',
        city: cityName,
        lat: 16.0666752,
        lng: 108.2232971,
        category: 'religion',
        rating: 4.8,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Nha_Tho_Con_Ga_Da_Nang.JPG/300px-Nha_Tho_Con_Ga_Da_Nang.JPG',
        address: '156 Trần Phú, Hải Châu, Đà Nẵng',
        description: 'Nhà thờ giáo xứ màu hồng mang phong cách Gothic cổ kính thời Pháp',
        suggestedDuration: 1.5,
      },
    ];
  }
}

module.exports = OpenTripMapProvider;
