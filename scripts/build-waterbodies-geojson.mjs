import fs from "node:fs";
import path from "node:path";

/**
 * Converts the exported vertices CSV (lat/lon rows grouped by `fid`)
 * into a GeoJSON FeatureCollection (Polygon per fid).
 *
 * Input format (header):
 *   fid,DN,area_m2,distance,angle,Latitude,Longitude
 */

const repoRoot = path.resolve(process.cwd());
const inputPath = path.resolve(repoRoot, "Top22_WaterPoints(32643).csv.xls");
const outputPath = path.resolve(repoRoot, "public", "waterbodies.geojson");

if (!fs.existsSync(inputPath)) {
  console.error(`❌ Missing input file: ${inputPath}`);
  process.exit(1);
}

const text = fs.readFileSync(inputPath, "utf8");
const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
if (lines.length < 2) {
  console.error("❌ Input file is empty or missing data rows.");
  process.exit(1);
}

const header = lines[0].split(",").map((s) => s.trim());
const idx = {
  fid: header.indexOf("fid"),
  DN: header.indexOf("DN"),
  area_m2: header.indexOf("area_m2"),
  Latitude: header.indexOf("Latitude"),
  Longitude: header.indexOf("Longitude"),
};

for (const [k, v] of Object.entries(idx)) {
  if (v === -1) {
    console.error(`❌ Missing column in header: ${k}`);
    process.exit(1);
  }
}

/** @type {Map<string, { fid: string, DN: number|null, area_m2: number|null, coords: Array<[number, number]> }>} */
const byFid = new Map();

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(",");
  if (parts.length < header.length) continue;

  const fid = parts[idx.fid]?.trim();
  if (!fid) continue;

  const lat = Number.parseFloat(parts[idx.Latitude]);
  const lng = Number.parseFloat(parts[idx.Longitude]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

  const DN = Number.parseFloat(parts[idx.DN]);
  const area_m2 = Number.parseFloat(parts[idx.area_m2]);

  const rec =
    byFid.get(fid) ??
    {
      fid,
      DN: Number.isFinite(DN) ? DN : null,
      area_m2: Number.isFinite(area_m2) ? area_m2 : null,
      coords: [],
    };

  // GeoJSON uses [lng, lat]
  rec.coords.push([lng, lat]);
  byFid.set(fid, rec);
}

const centroidOfRing = (ring) => {
  let sumLng = 0;
  let sumLat = 0;
  const n = ring.length || 1;
  for (const pt of ring) {
    sumLng += pt[0];
    sumLat += pt[1];
  }
  return { lng: sumLng / n, lat: sumLat / n };
};

const features = [];
for (const rec of byFid.values()) {
  if (rec.coords.length < 3) continue;
  const ring = rec.coords.slice();
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng !== lastLng || firstLat !== lastLat) {
    ring.push([firstLng, firstLat]);
  }

  const centroid = centroidOfRing(ring);
  const id = `fid-${rec.fid}`;

  features.push({
    type: "Feature",
    properties: {
      fid: rec.fid,
      id,
      name: `Water Body ${rec.fid}`,
      DN: rec.DN,
      area_m2: rec.area_m2,
      vertex_count: rec.coords.length,
      centroid_lat: centroid.lat,
      centroid_lng: centroid.lng,
    },
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
  });
}

const geojson = {
  type: "FeatureCollection",
  name: "Top22_WaterBodies",
  features,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));

console.log(`✅ Wrote ${features.length} polygons to ${path.relative(repoRoot, outputPath)}`);
