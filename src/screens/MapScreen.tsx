import React, { useState, useEffect } from 'react';
import { User, PoliceStation } from '../types';
import { fetchNearbyPoliceStations } from '../services/policeApi';
import { Navigation, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface MapScreenProps {
  user: User;
}

export const MapScreen: React.FC<MapScreenProps> = ({ user }) => {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 19.076, lng: 72.8777 });
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [filter, setFilter] = useState<'all' | 'police'>('all');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(coords);
          fetchNearbyPoliceStations(coords.lat, coords.lng).then(setPoliceStations);
        },
        () => {
          fetchNearbyPoliceStations(center.lat, center.lng).then(setPoliceStations);
        }
      );
    } else {
      fetchNearbyPoliceStations(center.lat, center.lng).then(setPoliceStations);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col px-4 py-6 max-w-4xl mx-auto pb-24 space-y-4 font-body">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-4xl text-[var(--ink)]">Safety Map &amp; <span className="italic text-[var(--pink-deep)]">Services</span></h2>
          <p className="font-display italic text-2xl text-[var(--pink-deep)]">Find nearby police stations and safe havens.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 poster-glass bg-white/70 rounded-2xl border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition border border-transparent ${
              filter === 'all' ? 'bg-[var(--ink)] text-[var(--cream)] shadow-[2px_2px_0_var(--pink-deep)]' : 'text-[var(--ink)] hover:bg-white'
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setFilter('police')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition border border-transparent ${
              filter === 'police' ? 'bg-[var(--ink)] text-[var(--cream)] shadow-[2px_2px_0_var(--pink-deep)]' : 'text-[var(--ink)] hover:bg-white'
            }`}
          >
            Police Stations
          </button>
        </div>
      </div>

      <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden poster-glass shadow-[8px_8px_0_var(--ink)] border-2 border-[var(--ink)] relative">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[center.lat, center.lng]}>
            <Popup>
              <div className="text-xs font-bold">📍 You are here ({user.name})</div>
            </Popup>
          </Marker>

          {policeStations.map((st) => (
            <Marker key={st.id} position={[st.lat, st.lng]}>
              <Popup>
                <div className="text-xs space-y-1">
                  <strong>👮 {st.name}</strong>
                  <br />
                  <span>Distance: {st.distanceMeters}m ({st.walkingMinutes} min walk)</span>
                  {st.phone && <br />}
                  {st.phone && <a href={`tel:${st.phone}`} className="text-[var(--pink-deep)] font-bold">Call: {st.phone}</a>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-xs text-[var(--ink)] uppercase tracking-wider">
          Nearby Emergency Stations ({policeStations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {policeStations.map((st) => (
            <div key={st.id} className="poster-glass p-4 bg-white/70 border-2 border-[var(--ink)] shadow-[5px_5px_0_var(--ink)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--sage)] uppercase tracking-wider">Police Station</span>
                <h4 className="font-display text-2xl font-bold text-[var(--ink)]">{st.name}</h4>
                <p className="font-display italic text-xl text-[var(--ink)]">
                  {st.distanceMeters}m away • ~{st.walkingMinutes} min walk
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[var(--sage)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:opacity-95 transition"
                  title="Navigate"
                >
                  <Navigation className="w-4 h-4" />
                </a>
                {st.phone && (
                  <a
                    href={`tel:${st.phone}`}
                    className="p-2.5 rounded-xl bg-[var(--ink)] text-[var(--cream)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--pink-deep)] hover:opacity-95 transition"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
