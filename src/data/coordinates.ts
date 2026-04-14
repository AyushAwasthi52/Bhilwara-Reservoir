export type WaterBodyType = 'river' | 'lake' | 'pond' | 'dam';

export interface WaterBody {
  id: string;
  name: string;
  type: WaterBodyType;
  latitude: number;
  longitude: number;
  description: string;
  fid?: string;
  area_m2?: number;
  DN?: number;
}

type WaterBodyShapesGeoJSON = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties?: Record<string, unknown>;
    geometry:
      | { type: "Polygon"; coordinates: number[][][] }
      | { type: "MultiPolygon"; coordinates: number[][][][] };
  }>;
};

const toFiniteNumber = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : Number.parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
};

export const loadWaterBodies = async (): Promise<WaterBody[]> => {
  // Single source of truth: public/waterbodies.geojson
  try {
    const res = await fetch(`/waterbodies.geojson?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as WaterBodyShapesGeoJSON;

    return (Array.isArray(data.features) ? data.features : [])
      .map((f): WaterBody | null => {
        const p = (f.properties ?? {}) as Record<string, unknown>;

        const fid = p.fid != null ? String(p.fid) : undefined;
        const id = p.id != null ? String(p.id) : fid ? `fid-${fid}` : "";
        const name = p.name != null ? String(p.name) : fid ? `Water Body ${fid}` : "Water Body";

        const latitude = toFiniteNumber(p.centroid_lat);
        const longitude = toFiniteNumber(p.centroid_lng);
        if (!id || latitude == null || longitude == null) return null;

        const area_m2 = toFiniteNumber(p.area_m2) ?? undefined;
        const DN = toFiniteNumber(p.DN) ?? undefined;

        // We don't have a reliable type from the shapefile export; default to "lake"
        const type: WaterBodyType = "lake";

        const descriptionParts = [
          fid ? `fid=${fid}` : null,
          DN != null ? `DN=${DN}` : null,
          area_m2 != null ? `area_m2=${area_m2}` : null,
        ].filter(Boolean);

        return {
          id,
          name,
          type,
          latitude,
          longitude,
          description: descriptionParts.length ? descriptionParts.join(", ") + "." : "Water body polygon.",
          fid,
          area_m2,
          DN,
        };
      })
      .filter((x): x is WaterBody => x !== null);
  } catch (e) {
    console.warn("⚠️ Failed to load /waterbodies.geojson:", e);
    return [];
  }
};

// No static import - always load dynamically to avoid caching
export const waterBodies: WaterBody[] = [];

export const getWaterBodiesByType = (type: WaterBodyType | 'All', bodies: WaterBody[] = waterBodies): WaterBody[] => {
  if (type === 'All') {
    return bodies;
  }
  return bodies.filter(wb => wb.type === type);
};

