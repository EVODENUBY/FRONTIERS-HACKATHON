import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Project, UtilityLine } from '../types/inframind';
import { Search, MapPin, Navigation, Crosshair, Layers, Eye, EyeOff, Check } from 'lucide-react';

interface GisMapProps {
  project: Project;
  selectedUtility: UtilityLine | null;
  onSelectUtility: (u: UtilityLine | null) => void;
  satelliteOverlayActive: boolean;
  onToggleSatelliteOverlay: () => void;
  historicalOverlayActive: boolean;
  onToggleHistoricalOverlay: () => void;
  soilOverlayActive: boolean;
  onToggleSoilOverlay: () => void;
  onSearchPlace?: (query: string) => void;
  isSearchingPlace?: boolean;
}

export const GisMap: React.FC<GisMapProps> = ({
  project,
  selectedUtility,
  onSelectUtility,
  satelliteOverlayActive,
  onToggleSatelliteOverlay,
  historicalOverlayActive,
  onToggleHistoricalOverlay,
  soilOverlayActive,
  onToggleSoilOverlay,
  onSearchPlace,
  isSearchingPlace = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(project.siteCoordinates);
  const [addressDisplay, setAddressDisplay] = useState('KN 5 Road, Kigali');

  const [visibleTypes, setVisibleTypes] = useState<Record<string, boolean>>({
    power: true,
    water: true,
    fiber: true,
    gas: true,
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // 1. Check if user entered coordinates e.g., "-1.9441, 30.0619"
    if (query.includes(',')) {
      const parts = query.split(',').map((s) => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const newCoords = { lat: parts[0], lng: parts[1] };
        setMapCenter(newCoords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 17);
        }
        setAddressDisplay(`Coordinates: ${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`);
        if (onSearchPlace) onSearchPlace(query);
        return;
      }
    }

    // 2. Perform Geocoding via Nominatim API
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const newCoords = { lat, lng: lon };

          setMapCenter(newCoords);
          setAddressDisplay(data[0].display_name || query);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lon], 16);
          }

          if (onSearchPlace) onSearchPlace(query);
        } else {
          setAddressDisplay(`Location found: ${query}`);
        }
      }
    } catch (err) {
      console.warn('Geocoding search failed, using query text fallback:', err);
      setAddressDisplay(query);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCoordinates = () => {
    // Parse coordinates if user typed "lat, lng" in search bar
    if (searchQuery.includes(',')) {
      const parts = searchQuery.split(',').map((s) => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const newCoords = { lat: parts[0], lng: parts[1] };
        setMapCenter(newCoords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 17);
        }
        setAddressDisplay(`Coordinates: ${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`);
        return;
      }
    }
    // Default fallback trigger
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([project.siteCoordinates.lat, project.siteCoordinates.lng], 17);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter(coords);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 17);
          }
          setAddressDisplay(`Current Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        },
        () => {
          // Fallback to project center
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([project.siteCoordinates.lat, project.siteCoordinates.lng], 17);
          }
        }
      );
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [project.siteCoordinates.lat, project.siteCoordinates.lng],
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);

      map.on('move', () => {
        const c = map.getCenter();
        setMapCenter({ lat: c.lat, lng: c.lng });
      });
    } else {
      mapInstanceRef.current.setView([project.siteCoordinates.lat, project.siteCoordinates.lng], 17);
    }
  }, [project.id, project.siteCoordinates.lat, project.siteCoordinates.lng]);

  // Update Layers & Vectors
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Tile Basemap
    if (satelliteOverlayActive) {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(layerGroup);
    } else {
      // Clean Carto Positron Light Map
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19 }
      ).addTo(layerGroup);
    }

    // 2. Center Location Pin Marker
    const locationIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-600 animate-ping absolute"></div>
        <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `;

    const locationIcon = L.divIcon({
      html: locationIconHtml,
      className: 'custom-location-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([project.siteCoordinates.lat, project.siteCoordinates.lng], { icon: locationIcon }).addTo(layerGroup);

    // 3. Render Utility Lines
    project.utilities.forEach((u) => {
      if (!visibleTypes[u.type]) return;

      const isSelected = selectedUtility?.id === u.id;
      const isConflict = u.status === 'conflict';

      const colorMap: Record<string, string> = {
        power: '#DC2626', // Red
        water: '#2563EB', // Blue
        fiber: '#059669', // Emerald
        gas: '#D97706',   // Amber
      };

      const lineColor = colorMap[u.type] || '#4B5563';

      const polyline = L.polyline(
        u.coordinates.map((c) => [c.lat, c.lng]),
        {
          color: lineColor,
          weight: isSelected ? 5 : isConflict ? 4 : 3,
          opacity: isSelected ? 1 : 0.85,
          dashArray: u.status === 'abandoned' ? '6, 6' : undefined,
        }
      ).addTo(layerGroup);

      const popupContent = `
        <div className="p-2 text-xs font-sans">
          <div className="font-bold text-gray-900 border-b pb-1 mb-1 flex items-center justify-between">
            <span>${u.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              u.status === 'conflict' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }">${u.status.toUpperCase()}</span>
          </div>
          <div className="text-gray-600 space-y-0.5 font-mono text-[11px]">
            <div>Depth: <strong>${u.depthMeter}m</strong> (±${u.depthMarginMeter}m)</div>
            <div>Material: ${u.material}</div>
            ${u.voltageOrPressure ? `<div>Rating: ${u.voltageOrPressure}</div>` : ''}
          </div>
        </div>
      `;

      polyline.bindPopup(popupContent);
      polyline.on('click', () => onSelectUtility(u));
    });
  }, [project, visibleTypes, satelliteOverlayActive, selectedUtility]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col font-sans">
      {/* Location Section Title Header */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Select Project Location
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Identify the excavation site boundaries and inspect underground GIS infrastructure layers.
          </p>
        </div>

        {/* Minimal GIS Layer Controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <button
            onClick={onToggleSatelliteOverlay}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              satelliteOverlayActive
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Satellite Feed</span>
          </button>
        </div>
      </div>

      {/* Location Search Bar & Controls */}
      <div className="p-3 border-b border-gray-200 bg-white flex flex-col sm:flex-row items-center gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address or enter coordinates e.g. KN 5 Road, Kigali or -1.9441, 30.0619"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || isSearchingPlace}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 shadow-sm disabled:opacity-50"
          >
            {isSearching || isSearchingPlace ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleUseCoordinates}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1"
          >
            <Crosshair className="w-3.5 h-3.5 text-gray-500" />
            <span>Use Coordinates</span>
          </button>

          <button
            onClick={handleLocateMe}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1"
          >
            <Navigation className="w-3.5 h-3.5 text-gray-500" />
            <span>Locate</span>
          </button>
        </div>
      </div>

      {/* Embedded Map Area */}
      <div className="relative h-[360px] w-full bg-gray-100 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md border border-gray-200 p-2.5 rounded-lg shadow-md text-[11px] font-sans">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
            Utility Vector Legend
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="text-gray-700 font-medium">Power Grid (EUCL)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-gray-700 font-medium">Water Trunk (WASAC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-gray-700 font-medium">Fiber Ducting (Liquid)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span className="text-gray-700 font-medium">Methane / Gas Line</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Information Footer Bar */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-500">Address:</span>
          <span className="font-medium text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
            {addressDisplay || 'KN 5 Road, Kigali'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="font-semibold text-gray-500">Coordinates:</span>
          <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
            {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
};
