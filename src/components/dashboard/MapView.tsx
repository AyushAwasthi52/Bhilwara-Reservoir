import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import { motion } from "framer-motion";
import { Reservoir, reservoirs, ReservoirType } from "@/data/reservoirs";
import { Satellite, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

// Custom marker icons based on status
const createCustomIcon = (status: string, type: ReservoirType) => {
  const colors = {
    Normal: "#22c55e",
    Low: "#f97316",
    Critical: "#ef4444",
  };

  const typeEmojis = {
    Dam: "🏗️",
    Lake: "💧",
    "Check Dam": "🔲",
  };

  const color = colors[status as keyof typeof colors] || colors.Normal;

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

const createPopupContent = (reservoir: Reservoir) => {
  const statusColors = {
    Normal: "#22c55e",
    Low: "#f97316",
    Critical: "#ef4444",
  };

  return `
    <div style="padding: 8px; min-width: 180px; font-family: Inter, system-ui, sans-serif;">
      <h3 style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${reservoir.name}</h3>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 500;
          color: white;
          background: ${statusColors[reservoir.status]};
        ">${reservoir.status}</span>
        <span style="font-size: 11px; color: #6b7280;">${reservoir.type}</span>
      </div>
      <div style="font-size: 12px; color: #6b7280;">
        <p style="margin: 2px 0;">Water Level: <span style="font-weight: 600; color: #1f2937;">${reservoir.currentWaterLevel}%</span></p>
        <p style="margin: 2px 0;">Capacity: <span style="font-weight: 600; color: #1f2937;">${reservoir.storageCapacity} MCM</span></p>
      </div>
    </div>
  `;
};

interface MapViewProps {
  activeFilter: ReservoirType | "All";
  onReservoirClick: (reservoir: Reservoir) => void;
}

export const MapView = ({ activeFilter, onReservoirClick }: MapViewProps) => {
  const [mapStyle, setMapStyle] = useState<"street" | "satellite">("street");
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

  const filteredReservoirs = useMemo(
    () =>
      reservoirs.filter(
        (r) => activeFilter === "All" || r.type === activeFilter,
      ),
    [activeFilter],
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

  // Update markers when filter changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredReservoirs.forEach((reservoir) => {
      const coords = reservoir.coordinates as [number, number];
      const marker = L.marker(coords, {
        icon: createCustomIcon(reservoir.status, reservoir.type),
      });

      marker.bindPopup(createPopupContent(reservoir), {
        className: "custom-popup",
      });

      marker.on("click", () => {
        onReservoirClick(reservoir);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [filteredReservoirs, onReservoirClick]);

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

      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-28 right-4 z-30 glass-panel rounded-xl shadow-lg border border-border/50 overflow-hidden"
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
