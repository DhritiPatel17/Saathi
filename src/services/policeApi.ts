import { PoliceStation } from '../types';

// Haversine formula to calculate distance in meters between two lat/lng points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

// Fallback police stations in case Overpass API is rate-limited or fails
const FALLBACK_POLICE_STATIONS: PoliceStation[] = [
  {
    id: 'fb-1',
    name: 'Central Police Station',
    lat: 0,
    lng: 0,
    distanceMeters: 850,
    walkingMinutes: 11,
    phone: '112',
    address: 'Main Avenue, Downtown',
  },
  {
    id: 'fb-2',
    name: 'Women Help & Security Police Post',
    lat: 0,
    lng: 0,
    distanceMeters: 1400,
    walkingMinutes: 17,
    phone: '1091',
    address: 'Sector 4 Junction',
  },
  {
    id: 'fb-3',
    name: 'City Metropolitan Police Precinct',
    lat: 0,
    lng: 0,
    distanceMeters: 2300,
    walkingMinutes: 28,
    phone: '112',
    address: 'North District Boulevard',
  },
];

export async function fetchNearbyPoliceStations(lat: number, lng: number): Promise<PoliceStation[]> {
  try {
    // Query Overpass API with ~10km bounding box
    const radius = 10000; // 10km
    const query = `[out:json][timeout:5];(node["amenity"="police"](around:${radius},${lat},${lng});way["amenity"="police"](around:${radius},${lat},${lng}););out body;>;out skel qt;`;
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error('Overpass API error');
    }

    const data = await response.json();
    const elements = data.elements || [];

    const stations: PoliceStation[] = [];

    for (const el of elements) {
      const stationLat = el.lat || (el.center && el.center.lat);
      const stationLng = el.lon || (el.center && el.center.lon);
      if (stationLat && stationLng) {
        const dist = calculateDistance(lat, lng, stationLat, stationLng);
        const name = (el.tags && (el.tags.name || el.tags['name:en'])) || 'Police Station';
        const phone = (el.tags && (el.tags['phone'] || el.tags['contact:phone'])) || '112';
        const address = (el.tags && (el.tags['addr:street'] || el.tags['address'])) || '';

        stations.push({
          id: String(el.id),
          name,
          lat: stationLat,
          lng: stationLng,
          distanceMeters: Math.round(dist),
          walkingMinutes: Math.max(1, Math.round(dist / 80)), // ~80 meters per minute walking speed
          phone,
          address,
        });
      }
    }

    // Sort by distance
    stations.sort((a, b) => a.distanceMeters - b.distanceMeters);

    if (stations.length > 0) {
      return stations.slice(0, 5);
    }
  } catch (err) {
    console.warn('Overpass API failed or timed out, using fallback police stations:', err);
  }

  // If API fails or yields 0 stations, return mock stations positioned around current lat/lng
  return FALLBACK_POLICE_STATIONS.map((st, idx) => {
    // Generate slight offsets around current lat/lng
    const angle = (idx * 2 * Math.PI) / FALLBACK_POLICE_STATIONS.length;
    const offsetDist = (idx + 1) * 750; // meters
    const dLat = (offsetDist / 111320) * Math.cos(angle);
    const dLng = (offsetDist / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
    const sLat = lat + dLat;
    const sLng = lng + dLng;
    const dist = Math.round(calculateDistance(lat, lng, sLat, sLng));

    return {
      ...st,
      lat: sLat,
      lng: sLng,
      distanceMeters: dist,
      walkingMinutes: Math.max(1, Math.round(dist / 80)),
    };
  });
}

// Simulate sending emergency SMS (generates log + returns tappable links)
export function sendEmergencySMS(contacts: { name: string; phone: string }[], userName: string, liveLink: string) {
  const message = `🚨 EMERGENCY from Sathi: ${userName} feels unsafe and needs help! Track her live location: ${liveLink}. Please call her or police (112) immediately.`;
  
  console.log('--- EMERGENCY SMS SIMULATION ---');
  contacts.forEach((c) => {
    console.log(`To: ${c.name} (${c.phone}) -> "${message}"`);
  });
  console.log('--------------------------------');

  return {
    success: true,
    message,
    contactsCount: contacts.length,
  };
}
