import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ItineraryMapbox, {
  formatDistance,
  formatDuration,
  DA_NANG_COORDINATES,
  DEFAULT_ZOOM,
  DEFAULT_STYLE,
} from '../../src/components/map/ItineraryMapbox';

// Mock mapbox-gl
const mockFlyTo = jest.fn();
const mockAddSource = jest.fn();
const mockGetSource = jest.fn();
const mockAddLayer = jest.fn();
const mockRemoveLayer = jest.fn();
const mockRemoveSource = jest.fn();
const mockFitBounds = jest.fn();
const mockRemove = jest.fn();
const mockResize = jest.fn();
const mockAddControl = jest.fn();
const mockSetLngLat = jest.fn().mockReturnThis();
const mockAddTo = jest.fn().mockReturnThis();
const mockMarkerRemove = jest.fn();
const mockExtend = jest.fn().mockReturnThis();

let mapEventHandlers = {};

const mockMapInstance = {
  on: jest.fn((event, callback) => {
    mapEventHandlers[event] = callback;
    if (event === 'load') callback();
  }),
  flyTo: mockFlyTo,
  addSource: mockAddSource,
  getSource: mockGetSource,
  addLayer: mockAddLayer,
  removeLayer: mockRemoveLayer,
  removeSource: mockRemoveSource,
  fitBounds: mockFitBounds,
  remove: mockRemove,
  resize: mockResize,
  addControl: mockAddControl,
};

const mockMapboxConstructor = jest.fn(() => mockMapInstance);
const mockMarkerConstructor = jest.fn(() => ({
  setLngLat: mockSetLngLat,
  addTo: mockAddTo,
  remove: mockMarkerRemove,
}));
const mockBoundsConstructor = jest.fn(() => ({
  extend: mockExtend,
}));
const mockNavigationControlConstructor = jest.fn();

jest.mock(
  'mapbox-gl',
  () => ({
    Map: mockMapboxConstructor,
    Marker: mockMarkerConstructor,
    LngLatBounds: mockBoundsConstructor,
    NavigationControl: mockNavigationControlConstructor,
    accessToken: '',
  }),
  { virtual: true }
);

describe('ItineraryMapbox Component (React / Next.js)', () => {
  const originalEnv = process.env;
  const mockToken = 'pk.test_mapbox_token_12345';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mapEventHandlers = {};
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_MAPBOX_TOKEN: mockToken,
    };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env = originalEnv;
  });

  describe('Unit Helpers: Formatting & Constants', () => {
    test('DA_NANG_COORDINATES should be [108.2022, 16.0544]', () => {
      expect(DA_NANG_COORDINATES).toEqual([108.2022, 16.0544]);
      expect(DEFAULT_ZOOM).toBe(12);
      expect(DEFAULT_STYLE).toBe('mapbox://styles/mapbox/streets-v12');
    });

    test('formatDistance accurately formats meters to km', () => {
      expect(formatDistance(0)).toBe('0 km');
      expect(formatDistance(1200)).toBe('1.2 km');
      expect(formatDistance(9800)).toBe('9.8 km');
      expect(formatDistance(15400)).toBe('15 km');
    });

    test('formatDuration accurately formats seconds to min/hr', () => {
      expect(formatDuration(0)).toBe('0 min');
      expect(formatDuration(120)).toBe('2 min');
      expect(formatDuration(3600)).toBe('1 hr');
      expect(formatDuration(4500)).toBe('1 hr 15 min');
    });
  });

  describe('Base Map Setup', () => {
    test('TDD-MAPBOX-01: Initializes Mapbox map with Da Nang coordinates, zoom 12, and default style', () => {
      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox />);
      });

      const mapboxgl = require('mapbox-gl');
      expect(mapboxgl.accessToken).toBe(mockToken);
      expect(mockMapboxConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          center: [108.2022, 16.0544],
          zoom: 12,
          style: 'mapbox://styles/mapbox/streets-v12',
        })
      );

      // Verify unmount cleanup
      act(() => {
        component.unmount();
      });
      expect(mockRemove).toHaveBeenCalled();
    });

    test('TDD-MAPBOX-02: Reads access token from props if provided as fallback', () => {
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN = '';
      const customToken = 'pk.custom_token_abcdef';

      act(() => {
        renderer.create(<ItineraryMapbox accessToken={customToken} />);
      });

      const mapboxgl = require('mapbox-gl');
      expect(mapboxgl.accessToken).toBe(customToken);
    });

    test('TDD-MAPBOX-03: Renders error banner if access token is completely missing', () => {
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN = '';
      delete process.env.REACT_APP_MAPBOX_TOKEN;

      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox accessToken="" />);
      });

      const json = JSON.stringify(component.toJSON());
      expect(json).toContain('Mapbox Access Token is missing');
    });
  });

  describe('Search & Markers (Geocoding)', () => {
    test('TDD-MAPBOX-04: Searches places on input change and renders autocomplete results', async () => {
      const mockGeocodingResponse = {
        features: [
          {
            id: 'place.1',
            text: 'Dragon Bridge',
            place_name: 'Dragon Bridge, Da Nang, Vietnam',
            center: [108.2272, 16.061],
          },
          {
            id: 'place.2',
            text: 'My Khe Beach',
            place_name: 'My Khe Beach, Da Nang, Vietnam',
            center: [108.2435, 16.0583],
          },
        ],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockGeocodingResponse,
      });

      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox />);
      });

      const root = component.root;
      const searchInput = root.findByProps({
        placeholder: 'Search places or hotels in Vietnam...',
      });

      // Type search query
      act(() => {
        searchInput.props.onChange({ target: { value: 'Dragon Bridge' } });
      });

      // Fast-forward debounce timer and flush microtasks
      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
      });
      await act(async () => {
        await Promise.resolve();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('geocoding/v5/mapbox.places/Dragon%20Bridge.json')
      );

      // Verify suggestions dropdown items are displayed
      const json = JSON.stringify(component.toJSON());
      expect(json).toContain('Dragon Bridge');
    });

    test('TDD-MAPBOX-05: Selecting a place drops a marker and flies map to coordinates', async () => {
      const mockGeocodingResponse = {
        features: [
          {
            id: 'place.1',
            text: 'Dragon Bridge',
            place_name: 'Dragon Bridge, Da Nang, Vietnam',
            center: [108.2272, 16.061],
          },
        ],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockGeocodingResponse,
      });

      let component;
      const onLocationsChange = jest.fn();
      act(() => {
        component = renderer.create(<ItineraryMapbox onLocationsChange={onLocationsChange} />);
      });

      const root = component.root;
      const searchInput = root.findByProps({
        placeholder: 'Search places or hotels in Vietnam...',
      });

      act(() => {
        searchInput.props.onChange({ target: { value: 'Dragon Bridge' } });
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });

      // Select place
      const listItems = root.findAllByType('li');
      expect(listItems.length).toBeGreaterThan(0);

      act(() => {
        listItems[0].props.onClick();
      });

      expect(mockFlyTo).toHaveBeenCalledWith({
        center: [108.2272, 16.061],
        zoom: 14,
        essential: true,
      });
      expect(mockMarkerConstructor).toHaveBeenCalled();
      expect(mockSetLngLat).toHaveBeenCalledWith([108.2272, 16.061]);
      expect(mockAddTo).toHaveBeenCalled();
      expect(onLocationsChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Dragon Bridge',
            coordinates: [108.2272, 16.061],
          }),
        ])
      );
    });
  });

  describe('Multi-Point Routing (Directions API)', () => {
    test('TDD-MAPBOX-06: Automatically calls Directions API when 2+ locations are selected', async () => {
      // Setup mock geocoding for two queries
      const place1 = {
        id: 'place.1',
        text: 'Da Nang Airport',
        place_name: 'Da Nang International Airport',
        center: [108.1995, 16.0439],
      };
      const place2 = {
        id: 'place.2',
        text: 'My Khe Beach',
        place_name: 'My Khe Beach, Da Nang',
        center: [108.2435, 16.0583],
      };

      const mockRouteResponse = {
        code: 'Ok',
        routes: [
          {
            geometry: {
              type: 'LineString',
              coordinates: [
                [108.1995, 16.0439],
                [108.2435, 16.0583],
              ],
            },
            distance: 6500, // 6.5 km
            duration: 900, // 15 min
          },
        ],
      };

      global.fetch
        .mockResolvedValueOnce({ json: async () => ({ features: [place1] }) })
        .mockResolvedValueOnce({ json: async () => ({ features: [place2] }) })
        .mockResolvedValueOnce({ json: async () => mockRouteResponse });

      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox />);
      });

      const root = component.root;
      const searchInput = root.findByProps({
        placeholder: 'Search places or hotels in Vietnam...',
      });

      // Add Place 1
      act(() => {
        searchInput.props.onChange({ target: { value: 'Da Nang Airport' } });
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      const items1 = root.findAllByType('li');
      expect(items1.length).toBeGreaterThan(0);
      await act(async () => {
        items1[0].props.onClick();
        await Promise.resolve();
      });

      // Add Place 2
      act(() => {
        searchInput.props.onChange({ target: { value: 'My Khe Beach' } });
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      const items2 = root.findAllByType('li');
      expect(items2.length).toBeGreaterThan(0);
      await act(async () => {
        items2[0].props.onClick();
        await Promise.resolve();
        await Promise.resolve();
      });

      // Verify Directions API call was dispatched
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('directions/v5/mapbox/driving/108.1995,16.0439;108.2435,16.0583')
      );

      // Verify GeoJSON source & layer creation
      expect(mockAddSource).toHaveBeenCalledWith(
        'itinerary-route',
        expect.objectContaining({
          type: 'geojson',
        })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'itinerary-route-line',
          type: 'line',
          paint: {
            'line-color': '#2563EB',
            'line-width': 4,
          },
        })
      );

      // Verify route summary metrics rendered in HUD
      const json = JSON.stringify(component.toJSON());
      expect(json).toContain('6.5 km');
      expect(json).toContain('15 min');

      // Verify Reset/Clear button removes route
      const resetButton = root.findByProps({
        children: 'Reset',
      });
      act(() => {
        resetButton.props.onClick();
      });

      expect(mockFlyTo).toHaveBeenCalledWith(
        expect.objectContaining({
          center: DA_NANG_COORDINATES,
          zoom: DEFAULT_ZOOM,
        })
      );
    });

    test('TDD-MAPBOX-07: Removing a waypoint updates locations and clears route when below 2 locations', async () => {
      const place1 = {
        id: 'place.1',
        text: 'Da Nang Airport',
        place_name: 'Da Nang International Airport',
        center: [108.1995, 16.0439],
      };
      const place2 = {
        id: 'place.2',
        text: 'My Khe Beach',
        place_name: 'My Khe Beach, Da Nang',
        center: [108.2435, 16.0583],
      };

      const mockRouteResponse = {
        code: 'Ok',
        routes: [
          {
            geometry: {
              type: 'LineString',
              coordinates: [
                [108.1995, 16.0439],
                [108.2435, 16.0583],
              ],
            },
            distance: 6500,
            duration: 900,
          },
        ],
      };

      global.fetch
        .mockResolvedValueOnce({ json: async () => ({ features: [place1] }) })
        .mockResolvedValueOnce({ json: async () => ({ features: [place2] }) })
        .mockResolvedValueOnce({ json: async () => mockRouteResponse });

      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox />);
      });

      const root = component.root;
      const searchInput = root.findByProps({
        placeholder: 'Search places or hotels in Vietnam...',
      });

      // Add Place 1
      act(() => {
        searchInput.props.onChange({ target: { value: 'Da Nang Airport' } });
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      const items1 = root.findAllByType('li');
      await act(async () => {
        items1[0].props.onClick();
        await Promise.resolve();
      });

      // Add Place 2
      act(() => {
        searchInput.props.onChange({ target: { value: 'My Khe Beach' } });
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      const items2 = root.findAllByType('li');
      await act(async () => {
        items2[0].props.onClick();
        await Promise.resolve();
        await Promise.resolve();
      });

      // Find remove buttons for waypoints
      const removeButtons = root.findAllByProps({
        title: 'Remove location',
      });
      expect(removeButtons.length).toBe(2);

      // Remove the second location
      await act(async () => {
        removeButtons[1].props.onClick();
        await Promise.resolve();
      });

      // Check that remaining locations count is 1 and My Khe Beach was removed
      const json = JSON.stringify(component.toJSON());
      expect(json).toContain('Da Nang Airport');
      expect(json).not.toContain('My Khe Beach');
      expect(json).toContain('Add 2+ places to calculate driving route');
    });
  });

  describe('Interactive On-Map Search & Large Viewport Controls', () => {
    test('TDD-MAPBOX-08: Clicking on map invokes reverse geocoding and adds location waypoint with marker', async () => {
      const mockReverseGeocode = {
        features: [
          {
            id: 'place.son-tra',
            text: 'Son Tra Peninsula',
            place_name: 'Son Tra Peninsula, Da Nang, Vietnam',
            center: [108.2612, 16.1158],
          },
        ],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockReverseGeocode,
      });

      let component;
      const onLocationsChange = jest.fn();
      act(() => {
        component = renderer.create(<ItineraryMapbox onLocationsChange={onLocationsChange} />);
      });

      // Verify click listener was registered on the map
      expect(mapEventHandlers['click']).toBeDefined();

      // Simulate user clicking on the map at coordinates [108.2612, 16.1158]
      await act(async () => {
        await mapEventHandlers['click']({
          lngLat: { lng: 108.2612, lat: 16.1158 },
        });
        await Promise.resolve();
        await Promise.resolve();
      });

      // Verify reverse geocoding was requested with clicked coordinates
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('geocoding/v5/mapbox.places/108.2612,16.1158.json')
      );

      // Verify marker was placed
      expect(mockMarkerConstructor).toHaveBeenCalled();
      expect(mockSetLngLat).toHaveBeenCalledWith([108.2612, 16.1158]);
      expect(mockAddTo).toHaveBeenCalled();

      // Verify waypoint was added to itinerary
      const json = JSON.stringify(component.toJSON());
      expect(json).toContain('Son Tra Peninsula');
      expect(onLocationsChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Son Tra Peninsula',
            coordinates: [108.2612, 16.1158],
          }),
        ])
      );
    });

    test('TDD-MAPBOX-09: Toggling fullscreen button expands container to 100vw/100vh and triggers map.resize()', () => {
      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox />);
      });

      const root = component.root;
      const fullscreenBtn = root.findByProps({
        'aria-label': 'toggle-fullscreen',
      });
      expect(fullscreenBtn).toBeTruthy();

      // Toggle to Fullscreen
      act(() => {
        fullscreenBtn.props.onClick();
      });

      // Container should now have fixed fullscreen position styles
      const rootDiv = component.toJSON();
      expect(rootDiv.props.style).toEqual(
        expect.objectContaining({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
        })
      );
      expect(mockResize).toHaveBeenCalled();

      // Toggle back from Fullscreen
      act(() => {
        fullscreenBtn.props.onClick();
      });
      const restoredDiv = component.toJSON();
      expect(restoredDiv.props.style.position).toBe('relative');
      expect(mockResize).toHaveBeenCalledTimes(2);
    });

    test('TDD-MAPBOX-10: Collapsing HUD minimizes itinerary card to maximize map view', async () => {
      let component;
      act(() => {
        component = renderer.create(<ItineraryMapbox />);
      });

      const root = component.root;
      const searchInput = root.findByProps({
        placeholder: 'Search places or hotels in Vietnam...',
      });

      // Add one place so the HUD becomes visible
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          features: [
            {
              id: 'p1',
              text: 'Marble Mountains',
              place_name: 'Marble Mountains, Da Nang',
              center: [108.2635, 16.0028],
            },
          ],
        }),
      });

      act(() => {
        searchInput.props.onChange({ target: { value: 'Marble Mountains' } });
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      const items = root.findAllByType('li');
      await act(async () => {
        items[0].props.onClick();
        await Promise.resolve();
      });

      // Find collapse/minimize button
      const collapseBtn = root.findByProps({
        'aria-label': 'toggle-hud-collapse',
      });
      expect(collapseBtn).toBeTruthy();

      // Initially waypoints list is visible
      let json = JSON.stringify(component.toJSON());
      expect(json).toContain('Marble Mountains');

      // Collapse HUD
      act(() => {
        collapseBtn.props.onClick();
      });

      // Waypoints list should now be hidden/collapsed
      json = JSON.stringify(component.toJSON());
      expect(json).not.toContain('Marble Mountains');

      // Expand HUD again
      act(() => {
        collapseBtn.props.onClick();
      });
      json = JSON.stringify(component.toJSON());
      expect(json).toContain('Marble Mountains');
    });
  });
});
