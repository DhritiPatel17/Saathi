import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storage } from '../services/storage';
import { Shield, AlertCircle, Phone, Navigation, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export const TrackingScreen: React.FC = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<any>(storage.getActiveSos());
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const active = storage.getActiveSos();
      if (active) {
        setSession(active);
        setLastUpdated(Date.now());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="w-16 h-16 rounded-2xl bg-[var(--sage)]/40 border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] text-[var(--ink)] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-[var(--sage)]" />
        </div>
        <h2 className="font-display text-4xl text-[var(--ink)] mb-2">SOS Session <span className="italic text-[var(--pink-deep)]">Ended</span></h2>
        <p className="font-display italic text-2xl text-[var(--ink)]/80 max-w-sm mb-6">
          This emergency tracking session has been marked as safe or is no longer active.
        </p>
        <a
          href="/"
          className="px-6 py-3.5 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-sm font-bold shadow-[4px_4px_0_var(--pink-deep)] border-2 border-[var(--ink)]"
        >
          Return to Saathi Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 max-w-xl mx-auto space-y-4 font-body">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-[var(--ink)] text-[var(--cream)] border-2 border-[var(--pink-deep)] shadow-[6px_6px_0_var(--pink-deep)] flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--pink-deep)] flex items-center justify-center border border-white">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">🚨 EMERGENCY <span className="italic text-[var(--pink)]">LIVE TRACKING</span></h2>
            <p className="font-display italic text-xl text-[var(--cream)]/90">
              Tracking: <strong>{session.userName}</strong> • Updated {Math.round((Date.now() - lastUpdated) / 1000)}s ago
            </p>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="w-full h-80 rounded-3xl overflow-hidden poster-glass shadow-[8px_8px_0_var(--ink)] border-2 border-[var(--ink)] relative">
        <MapContainer
          center={[session.lat, session.lng]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[session.lat, session.lng]}>
            <Popup>
              <div className="text-xs font-bold">🚨 {session.userName} is here</div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Police Station Info if available */}
      {session.policeStation && (
        <div className="p-3.5 rounded-2xl bg-[var(--sage)]/25 border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-wider">Nearest Police Station</span>
            <h4 className="font-display text-2xl font-bold text-[var(--ink)]">{session.policeStation.name}</h4>
            <p className="font-display italic text-xl text-[var(--ink)]">
              {session.policeStation.distanceMeters}m away (~{session.policeStation.walkingMinutes} min walk)
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${session.policeStation.lat},${session.policeStation.lng}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[var(--sage)] text-[var(--ink)] text-xs font-bold shadow-[2px_2px_0_var(--ink)] flex items-center gap-1 border-2 border-[var(--ink)]"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <a
          href="tel:112"
          className="py-4 rounded-2xl bg-[var(--pink-deep)] text-white font-bold text-sm shadow-[6px_6px_0_var(--ink)] hover:opacity-95 transition flex items-center justify-center gap-2 border-2 border-[var(--ink)]"
        >
          <Phone className="w-4 h-4" />
          <span>Call Police (112)</span>
        </a>

        <a
          href="/"
          className="py-4 rounded-2xl bg-[var(--ink)] text-[var(--cream)] font-bold text-sm shadow-[6px_6px_0_var(--pink-deep)] hover:opacity-95 transition flex items-center justify-center gap-2 border-2 border-[var(--ink)]"
        >
          <Shield className="w-4 h-4 text-[var(--pink)]" />
          <span>Open Saathi</span>
        </a>
      </div>
    </div>
  );
};
