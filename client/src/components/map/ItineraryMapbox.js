import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Helper to safely import mapbox-gl in both client-side Next.js, standard React, and test environments.
 */
const getMapboxGL = () => {
  if (typeof window !== 'undefined' && window.mapboxgl) {
    return window.mapboxgl;
  }
  try {
    return require('mapbox-gl');
  } catch (err) {
    return null;
  }
};

/**
 * Format meters into kilometers string (e.g. "12.4 km")
 */
export const formatDistance = (meters) => {
  if (!meters || meters < 0) return '0 km';
  const km = meters / 1000;
  return km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
};

/**
 * Format seconds into human readable duration (e.g. "1 hr 25 min" or "18 min")
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0 min';
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours} hr ${remainingMins} min` : `${hours} hr`;
};

/**
 * Default center coordinates for Da Nang, Vietnam
 */
export const DA_NANG_COORDINATES = [108.2022, 16.0544];
export const DEFAULT_ZOOM = 12;
export const DEFAULT_STYLE = 'mapbox://styles/mapbox/streets-v12';

/**
 * ItineraryMapbox Component
 * 
 * High-performance, full-featured Mapbox itinerary planner component for Next.js / React.
 * Includes base map setup, geocoding place search, custom markers, and multi-point driving route calculation.
 */
export default function ItineraryMapbox({
  accessToken: propToken,
  initialCenter = DA_NANG_COORDINATES,
  initialZoom = DEFAULT_ZOOM,
  mapStyle = DEFAULT_STYLE,
  onLocationsChange,
  className = '',
  style = {},
}) {
  // Read token from props or environment variables securely
  const token =
    propToken !== undefined
      ? propToken
      : (typeof process !== 'undefined' &&
          process.env &&
          (process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.REACT_APP_MAPBOX_TOKEN)) ||
        '';

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // States
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [routeSummary, setRouteSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  // Resize map when fullscreen is toggled
  useEffect(() => {
    if (mapRef.current && mapRef.current.resize) {
      mapRef.current.resize();
    }
  }, [isFullScreen]);

  // Invalidate error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Notify parent callback when locations change
  useEffect(() => {
    if (onLocationsChange) {
      onLocationsChange(selectedLocations);
    }
  }, [selectedLocations, onLocationsChange]);

  // Load Mapbox CSS dynamically if not already present in browser
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingLink = document.getElementById('mapbox-gl-css');
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'mapbox-gl-css';
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  // 1. Base Map Setup
  useEffect(() => {
    const mapboxgl = getMapboxGL();
    if (!mapboxgl) {
      setErrorMessage('Mapbox GL library could not be loaded.');
      return;
    }

    if (!token) {
      setErrorMessage(
        'Mapbox Access Token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN.'
      );
      return;
    }

    mapboxgl.accessToken = token;

    const container = mapContainerRef.current || 'itinerary-map-container';

    // Initialize Map
    const map = new mapboxgl.Map({
      container,
      style: mapStyle,
      center: initialCenter,
      zoom: initialZoom,
    });

    // Add NavigationControl (Zoom, Compass, Pitch)
    if (mapboxgl.NavigationControl && map.addControl) {
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    }

    // Interactive On-Map Click: Reverse Geocoding to identify and add waypoint
    const handleMapClick = async (e) => {
      if (!e || !e.lngLat) return;
      const { lng, lat } = e.lngLat;
      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        const feature = data && data.features && data.features.length > 0 ? data.features[0] : null;

        const placeName = feature
          ? feature.text || feature.place_name
          : `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        const fullAddress = feature ? feature.place_name : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        const newLocation = {
          id: feature ? feature.id : `poi-${Date.now()}`,
          name: placeName,
          address: fullAddress,
          coordinates: [lng, lat],
        };

        setSelectedLocations((prev) => [...prev, newLocation]);
        if (mapRef.current && mapRef.current.flyTo) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            essential: true,
          });
        }
      } catch (err) {
        setErrorMessage('Failed to identify clicked location.');
      }
    };

    map.on('click', handleMapClick);

    map.on('load', () => {
      setIsMapReady(true);
    });

    mapRef.current = map;

    return () => {
      // Cleanup all markers
      markersRef.current.forEach((m) => m && m.remove && m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [token, mapStyle, initialCenter, initialZoom]);

  // Helper to create custom marker DOM element
  const createMarkerElement = (index) => {
    if (typeof document === 'undefined') return null;
    const el = document.createElement('div');
    el.className = 'custom-itinerary-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#2563EB';
    el.style.color = '#FFFFFF';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontWeight = 'bold';
    el.style.fontSize = '13px';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    el.style.border = '2px solid #FFFFFF';
    el.style.cursor = 'pointer';
    el.innerText = `${index + 1}`;
    return el;
  };

  // 2. Synchronize Markers with selectedLocations
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = getMapboxGL();
    if (!map || !mapboxgl) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker && marker.remove && marker.remove());
    markersRef.current = [];

    // Add new markers
    selectedLocations.forEach((loc, idx) => {
      const el = createMarkerElement(idx);
      const marker = new mapboxgl.Marker(el ? { element: el } : undefined)
        .setLngLat(loc.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [selectedLocations]);

  // 3. Multi-Point Routing (Directions API)
  const calculateRoute = useCallback(
    async (locations) => {
      const map = mapRef.current;
      if (!map || !token) return;

      if (locations.length < 2) {
        // Clear existing route if locations dropped below 2
        setRouteSummary(null);
        if (map.getSource && map.getSource('itinerary-route')) {
          map.getSource('itinerary-route').setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
        return;
      }

      setIsRouting(true);
      try {
        const coordsString = locations
          .map((loc) => `${loc.coordinates[0]},${loc.coordinates[1]}`)
          .join(';');

        const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${token}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error(data.message || 'Could not find a valid driving route');
        }

        const bestRoute = data.routes[0];
        setRouteSummary({
          distanceMeters: bestRoute.distance,
          durationSeconds: bestRoute.duration,
          distanceFormatted: formatDistance(bestRoute.distance),
          durationFormatted: formatDuration(bestRoute.duration),
        });

        // Add or update route GeoJSON source and layer
        const routeGeoJSON = {
          type: 'Feature',
          properties: {},
          geometry: bestRoute.geometry,
        };

        if (map.getSource && map.getSource('itinerary-route')) {
          map.getSource('itinerary-route').setData(routeGeoJSON);
        } else if (map.addSource && map.addLayer) {
          map.addSource('itinerary-route', {
            type: 'geojson',
            data: routeGeoJSON,
          });

          map.addLayer({
            id: 'itinerary-route-line',
            type: 'line',
            source: 'itinerary-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#2563EB',
              'line-width': 4,
            },
          });
        }

        // Fit map bounds to encompass all waypoints
        const mapboxgl = getMapboxGL();
        if (mapboxgl && mapboxgl.LngLatBounds && map.fitBounds) {
          const bounds = new mapboxgl.LngLatBounds();
          locations.forEach((loc) => bounds.extend(loc.coordinates));
          map.fitBounds(bounds, {
            padding: 80,
            maxZoom: 15,
            duration: 1000,
          });
        }
      } catch (err) {
        setErrorMessage(`Routing error: ${err.message}`);
        setRouteSummary(null);
      } finally {
        setIsRouting(false);
      }
    },
    [token]
  );

  useEffect(() => {
    calculateRoute(selectedLocations);
  }, [selectedLocations, calculateRoute]);

  // Geocoding place search handler with debouncing
  useEffect(() => {
    if (!searchQuery.trim() || !token) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${token}&country=VN&proximity=108.2022,16.0544&autocomplete=true`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.features) {
          setSuggestions(
            data.features.map((feat) => ({
              id: feat.id,
              name: feat.text || feat.place_name,
              fullName: feat.place_name,
              coordinates: feat.center, // [lng, lat]
            }))
          );
        }
      } catch (err) {
        setErrorMessage('Failed to search locations.');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, token]);

  // Select place from autocomplete
  const handleSelectPlace = (place) => {
    const newLocation = {
      id: place.id,
      name: place.name,
      address: place.fullName,
      coordinates: place.coordinates,
    };

    setSelectedLocations((prev) => [...prev, newLocation]);
    setSearchQuery('');
    setSuggestions([]);

    // Fly map to selected place
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo({
        center: place.coordinates,
        zoom: 14,
        essential: true,
      });
    }
  };

  // Remove a location by index
  const handleRemoveLocation = (indexToRemove) => {
    setSelectedLocations((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Clear all itinerary locations
  const handleClearAll = () => {
    setSelectedLocations([]);
    setRouteSummary(null);
    if (mapRef.current) {
      if (mapRef.current.getSource && mapRef.current.getSource('itinerary-route')) {
        mapRef.current.getSource('itinerary-route').setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
      if (mapRef.current.flyTo) {
        mapRef.current.flyTo({
          center: initialCenter,
          zoom: initialZoom,
          essential: true,
        });
      }
    }
  };

  const containerStyle = isFullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#0F172A',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      }
    : {
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '650px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* Map Container */}
      <div
        id="itinerary-map-container"
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Top Controls: Fullscreen Expand/Minimize Button */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 54,
          zIndex: 25,
        }}
      >
        <button
          aria-label="toggle-fullscreen"
          onClick={() => setIsFullScreen((prev) => !prev)}
          title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          style={{
            backgroundColor: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#1E293B',
            fontWeight: 'bold',
          }}
        >
          {isFullScreen ? '✕' : '⛶'}
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#B91C1C',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 30,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>⚠️ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#B91C1C',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Top Control: Search Bar & Autocomplete */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          width: '360px',
          maxWidth: 'calc(100% - 32px)',
          zIndex: 20,
        }}
      >
        <div
          style={{
            position: 'relative',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 12px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px', opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            placeholder="Search places or hotels in Vietnam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 0',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: 'transparent',
            }}
          />
          {isSearching && (
            <span style={{ fontSize: '12px', color: '#6B7280', marginRight: '4px' }}>
              Searching...
            </span>
          )}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#9CA3AF',
                fontSize: '14px',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul
            style={{
              marginTop: '6px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              listStyle: 'none',
              margin: '6px 0 0 0',
              padding: '6px 0',
              maxHeight: '260px',
              overflowY: 'auto',
            }}
          >
            {suggestions.map((place) => (
              <li
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F3F4F6',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937' }}>
                  {place.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {place.fullName}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating Bottom/Side HUD: Itinerary & Route Metrics */}
      {selectedLocations.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 16,
            width: '360px',
            maxWidth: 'calc(100% - 32px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          {/* Header & Metrics */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: isHudCollapsed ? 'none' : '1px solid #E5E7EB',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
                Trip Itinerary ({selectedLocations.length} {selectedLocations.length === 1 ? 'stop' : 'stops'})
              </h3>
              {isRouting ? (
                <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: '500' }}>
                  Calculating route...
                </span>
              ) : routeSummary ? (
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600', marginTop: '2px' }}>
                  🏁 {routeSummary.distanceFormatted} • ⏱️ {routeSummary.durationFormatted}
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Add 2+ places to calculate driving route
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                aria-label="toggle-hud-collapse"
                onClick={() => setIsHudCollapsed((prev) => !prev)}
                title={isHudCollapsed ? 'Expand Waypoints' : 'Minimize Waypoints'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                {isHudCollapsed ? '▲' : '▼'}
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Locations Waypoints List */}
          {!isHudCollapsed && (
            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                padding: '8px 12px',
              }}
            >
              {selectedLocations.map((loc, idx) => (
                <div
                  key={`${loc.id}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 4px',
                    borderBottom:
                      idx !== selectedLocations.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1E293B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {loc.name}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveLocation(idx)}
                    title="Remove location"
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '2px 6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
