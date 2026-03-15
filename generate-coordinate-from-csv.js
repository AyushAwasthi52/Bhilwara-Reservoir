const fs = require('fs');
const path = require('path');

// Simple CSV → JSON generator for coordinate.json
// Usage (from project root):
//   node generate-coordinate-from-csv.js "d:\\HS202\\water_data.csv"

const csvPath = process.argv[2];

if (!csvPath) {
  console.error('❌ Please provide path to water_data.csv');
  console.error('   Example: node generate-coordinate-from-csv.js "d:\\\\HS202\\\\water_data.csv"');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error('❌ CSV file not found at:', csvPath);
  process.exit(1);
}

console.log('📄 Reading CSV from:', csvPath);
const text = fs.readFileSync(csvPath, 'utf8').trim();
const lines = text.split(/\r?\n/);

if (lines.length < 2) {
  console.error('❌ CSV seems empty or has no data rows.');
  process.exit(1);
}

const header = lines[0].split(',');
const rows = lines.slice(1);

// Expected headers:
// DN,area,perimeter,circular,rectangle,centroid_x,centroid_y,water_type
const idx = (name) => header.indexOf(name);
const dnIdx = idx('DN');
const areaIdx = idx('area');
const perIdx = idx('perimeter');
const circIdx = idx('circular');
const rectIdx = idx('rectangle');
const xIdx = idx('centroid_x');
const yIdx = idx('centroid_y');
const typeIdx = idx('water_type');

if ([dnIdx, areaIdx, perIdx, circIdx, rectIdx, xIdx, yIdx, typeIdx].some((i) => i === -1)) {
  console.error('❌ CSV does not have expected headers:');
  console.error('   DN, area, perimeter, circular, rectangle, centroid_x, centroid_y, water_type');
  console.error('   Found headers:', header.join(', '));
  process.exit(1);
}

// Parse numeric centroid ranges for normalisation
const numericRows = [];
for (const line of rows) {
  const cols = line.split(',');
  if (cols.length !== header.length) continue;
  const cx = Number(cols[xIdx]);
  const cy = Number(cols[yIdx]);
  if (Number.isNaN(cx) || Number.isNaN(cy)) continue;
  numericRows.push({ cols, cx, cy });
}

if (numericRows.length === 0) {
  console.error('❌ No valid centroid_x / centroid_y values found.');
  process.exit(1);
}

const minX = Math.min(...numericRows.map((r) => r.cx));
const maxX = Math.max(...numericRows.map((r) => r.cx));
const minY = Math.min(...numericRows.map((r) => r.cy));
const maxY = Math.max(...numericRows.map((r) => r.cy));

// Target Bhilwara-ish box (roughly)
const baseLat = 25.0;
const baseLng = 74.0;
const latSpan = 0.8;
const lngSpan = 0.8;

const norm = (value, min, max, base, span) => {
  if (max === min) return base + span / 2;
  return base + ((value - min) / (max - min)) * span;
};

const mapType = (raw) => {
  const t = String(raw || '').toLowerCase();
  if (t.includes('pond')) return 'pond';
  if (t.includes('canal') || t.includes('river')) return 'river';
  if (t.includes('dam')) return 'dam';
  return 'lake';
};

const result = numericRows.map((row, index) => {
  const { cols, cx, cy } = row;
  const dn = cols[dnIdx];
  const area = Number(cols[areaIdx]);
  const per = Number(cols[perIdx]);
  const circ = Number(cols[circIdx]);
  const rect = Number(cols[rectIdx]);
  const rawType = cols[typeIdx];

  const latitude = norm(cy, minY, maxY, baseLat, latSpan);
  const longitude = norm(cx, minX, maxX, baseLng, lngSpan);

  const type = mapType(rawType);

  return {
    id: `wb-${index + 1}`,
    name: `Water Body ${index + 1}`,
    type,
    latitude,
    longitude,
    description: `DN=${dn}, type=${rawType}, area=${area.toFixed(2)}, perimeter=${per.toFixed(
      2,
    )}, circularity=${circ.toFixed(4)}, rectangularity=${rect.toFixed(4)}.`,
  };
});

console.log('✅ Generated water bodies:', result.length);

const outRoot = path.resolve(__dirname, 'coordinate.json');
const outPublic = path.resolve(__dirname, 'public', 'coordinate.json');
const outSrc = path.resolve(__dirname, 'src', 'data', 'coordinate.json');

const jsonText = JSON.stringify(result, null, 2);

fs.writeFileSync(outRoot, jsonText, 'utf8');
console.log('💾 Wrote', outRoot);

if (fs.existsSync(path.dirname(outPublic))) {
  fs.writeFileSync(outPublic, jsonText, 'utf8');
  console.log('💾 Wrote', outPublic);
}

if (fs.existsSync(path.dirname(outSrc))) {
  fs.writeFileSync(outSrc, jsonText, 'utf8');
  console.log('💾 Wrote', outSrc);
}

console.log('🎉 Done. Restart dev server if needed and reload the app.');

