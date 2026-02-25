export type WaterBodyType = 'river' | 'lake' | 'pond' | 'dam';

export interface WaterBody {
  id: string;
  name: string;
  type: WaterBodyType;
  latitude: number;
  longitude: number;
  description: string;
}

// Parse and validate coordinates, ensuring they are numbers
export const parseWaterBodies = (data: any[]): WaterBody[] => {
  return data.map((item) => ({
    ...item,
    latitude: typeof item.latitude === 'number' ? item.latitude : parseFloat(String(item.latitude)),
    longitude: typeof item.longitude === 'number' ? item.longitude : parseFloat(String(item.longitude)),
  })).filter((item) => 
    !isNaN(item.latitude) && 
    !isNaN(item.longitude) &&
    item.latitude >= -90 && item.latitude <= 90 &&
    item.longitude >= -180 && item.longitude <= 180
  );
};

// Load coordinates dynamically to support hot reloading
export const loadWaterBodies = async (forceReload = false): Promise<WaterBody[]> => {
  const timestamp = Date.now();
  
  // PRIMARY: Fetch from public/coordinate.json (served directly by Vite)
  // This is the file you should edit: public/coordinate.json
  try {
    const response = await fetch(`/coordinate.json?t=${timestamp}&_=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Loaded from /coordinate.json (public folder):', data.length, 'items');
      console.log('📝 Sample data:', data[0]?.name || 'No data');
      return parseWaterBodies(Array.isArray(data) ? data : []);
    } else {
      console.warn('⚠️ Fetch failed with status:', response.status);
    }
  } catch (fetchError) {
    console.warn('⚠️ Fetch from /coordinate.json failed:', fetchError);
  }

  // FALLBACK: Try src/data/coordinate.json (if public fetch fails)
  try {
    const module = await import(`./coordinate.json?t=${timestamp}&_=${Date.now()}`);
    const data = module.default || module;
    console.log('✅ Loaded from src/data/coordinate.json (fallback):', Array.isArray(data) ? data.length : 0, 'items');
    return parseWaterBodies(Array.isArray(data) ? data : []);
  } catch (importError) {
    console.error('❌ All loading methods failed:', importError);
  }
  
  return [];
};

// No static import - always load dynamically to avoid caching
export const waterBodies: WaterBody[] = [];

export const getWaterBodiesByType = (type: WaterBodyType | 'All', bodies: WaterBody[] = waterBodies): WaterBody[] => {
  if (type === 'All') {
    return bodies;
  }
  return bodies.filter(wb => wb.type === type);
};

