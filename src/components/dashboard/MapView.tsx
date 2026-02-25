import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import { motion } from "framer-motion";
import { WaterBody, WaterBodyType, getWaterBodiesByType, loadWaterBodies } from "@/data/coordinates";
import { Satellite, Map as MapIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

// Custom marker icons based on type
const createCustomIcon = (type: WaterBodyType) => {
  const typeColors = {
    dam: "#3b82f6",
    lake: "#22c55e",
    pond: "#10b981",
    river: "#06b6d4",
  };

  const typeEmojis = {
    dam: "🏗️",
    lake: "💧",
    pond: "🔲",
    river: "🌊",
  };

  const color = typeColors[type] || typeColors.lake;

  return L.divIcon({
    className: "custom-marker-container",
    html: `
       <div style="
         width: 36px;
         height: 36px;
         background: ${color};
         border: 3px solid white;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 0 2px 10px rgba(0,0,0,0.3);
         cursor: pointer;
         transition: transform 0.2s ease, box-shadow 0.2s ease;
         font-size: 14px;
       " class="marker-inner" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
         ${typeEmojis[type]}
       </div>
     `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const createPopupContent = (waterBody: WaterBody) => {
  const typeColors = {
    dam: "#3b82f6",
    lake: "#22c55e",
    pond: "#10b981",
    river: "#06b6d4",
  };

  const color = typeColors[waterBody.type] || typeColors.lake;
  const typeLabel = waterBody.type.charAt(0).toUpperCase() + waterBody.type.slice(1);

  return `
    <div style="padding: 12px; min-width: 250px; max-width: 300px; font-family: Inter, system-ui, sans-serif;">
      <h3 style="font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #1f2937;">${waterBody.name}</h3>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          background: ${color};
          text-transform: capitalize;
        ">${typeLabel}</span>
      </div>
      <div style="font-size: 13px; color: #4b5563; margin-bottom: 12px; line-height: 1.6;">
        <p style="margin: 4px 0;"><strong>ID:</strong> ${waterBody.id}</p>
        <p style="margin: 4px 0;"><strong>Coordinates:</strong> ${waterBody.latitude.toFixed(4)}°N, ${waterBody.longitude.toFixed(4)}°E</p>
      </div>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px;">
        <p style="font-size: 12px; color: #6b7280; line-height: 1.6; margin: 0;">${waterBody.description}</p>
      </div>
    </div>
  `;
};

interface MapViewProps {
  activeFilter: WaterBodyType | "All";
  onWaterBodyClick: (waterBody: WaterBody) => void;
}

export const MapView = ({ activeFilter, onWaterBodyClick }: MapViewProps) => {
  const [mapStyle, setMapStyle] = useState<"street" | "satellite">("street");
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>([]);
  const [dataVersion, setDataVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const tileLayers = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri",
    },
  };

  // Bhilwara district center
  const center: [number, number] = [25.4449, 74.6351];

  // Manual refresh function
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadWaterBodies(true);
      if (data.length > 0) {
        setWaterBodies(data);
        setDataVersion(prev => prev + 1);
        console.log('🔄 Manually refreshed water bodies:', data.length);
      }
    } catch (error) {
      console.error('Error refreshing water bodies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load water bodies data dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always force reload to bypass cache
        const data = await loadWaterBodies(true);
        if (data.length > 0) {
          setWaterBodies(data);
          console.log('🔄 Updated water bodies:', data.length);
        }
      } catch (error) {
        console.error('Error loading water bodies:', error);
      }
    };

    // Initial load
    fetchData();

    // Poll for changes every 1 second to detect file changes
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, [dataVersion]);

  // Automatically re-render when waterBodies data or filter changes
  const filteredWaterBodies = useMemo(
    () => getWaterBodiesByType(activeFilter, waterBodies),
    [activeFilter, waterBodies],
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 10,
      zoomControl: false,
    });

    tileLayerRef.current = L.tileLayer(tileLayers.street.url, {
      attribution: tileLayers.street.attribution,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update tile layer when style changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.setUrl(tileLayers[mapStyle].url);
  }, [mapStyle]);

  // Update markers when filter or data changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    // Dynamically generate markers from coordinate.json data
    // Ensure coordinates are parsed as numbers and in correct [lat, lng] order
    filteredWaterBodies.forEach((waterBody) => {
      // Parse coordinates as numbers (handle string inputs)
      const lat = typeof waterBody.latitude === 'number' 
        ? waterBody.latitude 
        : parseFloat(String(waterBody.latitude));
      const lng = typeof waterBody.longitude === 'number' 
        ? waterBody.longitude 
        : parseFloat(String(waterBody.longitude));

      // Validate coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for ${waterBody.name}: lat=${waterBody.latitude}, lng=${waterBody.longitude}`);
        return;
      }

      // Leaflet uses [latitude, longitude] order
      const coords: [number, number] = [lat, lng];

      const marker = L.marker(coords, {
        icon: createCustomIcon(waterBody.type),
      });

      marker.bindPopup(createPopupContent(waterBody), {
        className: "custom-popup",
        maxWidth: 300,
      });

      marker.on("click", () => {
        onWaterBodyClick(waterBody);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [filteredWaterBodies, onWaterBodyClick]);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Style Toggle */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-30 flex flex-col gap-2"
      >
        <div className="glass-panel rounded-xl shadow-lg border border-border/50 p-1 flex flex-col gap-1">
          <Button
            variant={mapStyle === "street" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMapStyle("street")}
            className="justify-start"
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Street
          </Button>
          <Button
            variant={mapStyle === "satellite" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMapStyle("satellite")}
            className="justify-start"
          >
            <Satellite className="w-4 h-4 mr-2" />
            Satellite
          </Button>
        </div>
      </motion.div>

      {/* Legend */}

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="absolute top-28 right-4 z-30"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isLoading}
          className="glass-panel rounded-xl shadow-lg border border-border/50"
          title="Refresh data from coordinate.json"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-40 right-4 z-30 glass-panel rounded-xl shadow-lg border border-border/50 overflow-hidden"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="rounded-none border-b border-border/50"
        >
          +
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="rounded-none"
        >
          -
        </Button>
      </motion.div>
    </div>
  );
};
