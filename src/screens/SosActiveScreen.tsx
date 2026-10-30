import React, { useState, useEffect } from 'react';
import { User, EmergencyContact, SosSession, PoliceStation, NearbyHelper } from '../types';
import { storage } from '../services/storage';
import { crossTab } from '../services/crossTab';
import { fetchNearbyPoliceStations, sendEmergencySMS } from '../services/policeApi';
import { AlertCircle, Phone, MapPin, Users, CheckCircle2, Navigation, Send, X, Lock, Copy } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface SosActiveScreenProps {
  user: User;
  contacts: EmergencyContact[];
  session: SosSession;
  onSafe: () => void;
  onNavigate: (screen: any) => void;
}

export const SosActiveScreen: React.FC<SosActiveScreenProps> = ({ user, contacts, session, onSafe, onNavigate }) => {
  const [currentSession, setCurrentSession] = useState<SosSession>(session);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [helpers, setHelpers] = useState<NearbyHelper[]>(storage.getSimulatedHelpers());
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const liveTrackUrl = `${window.location.origin}/#/track/${currentSession.id}`;

  useEffect(() => {
    sendEmergencySMS(contacts, user.name, liveTrackUrl);

    fetchNearbyPoliceStations(currentSession.lat, currentSession.lng).then((stations) => {
      setPoliceStations(stations);
      if (stations.length > 0) {
        const updated = { ...currentSession, policeStation: stations[0] };
        setCurrentSession(updated);
        storage.saveActiveSos(updated);
      }
    });

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 SAATHI SOS Activated', {
        body: 'Your emergency contacts and nearby helpers have been alerted.',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const unsubscribe = crossTab.subscribe((msg) => {
      if (msg.type === 'helper_coming') {
        setHelpers((prev) =>
          prev.map((h) => (h.id === msg.payload.helperId ? { ...h, status: 'coming' } : h))
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSimulateHelperComing = (helperId: string) => {
    const updated = helpers.map((h) => (h.id === helperId ? { ...h, status: 'coming' as const } : h));
    setHelpers(updated);
    storage.saveSimulatedHelpers(updated);
    crossTab.broadcast('helper_coming', { helperId });
  };

  const handleConfirmSafe = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput !== user.safePin) {
      setPinError('Incorrect Safe PIN. Default is 1234.');
      return;
    }
    storage.saveActiveSos(null);
    onSafe();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveTrackUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeHelpersCount = helpers.filter((h) => h.status === 'coming').length;

  return (
    <div className="min-h-[calc(100vh-65px)] px-4 py-6 max-w-2xl mx-auto pb-24 space-y-5 font-body">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-[var(--ink)] text-[var(--cream)] border-2 border-[var(--pink-deep)] shadow-[6px_6px_0_var(--pink-deep)] flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--pink-deep)] flex items-center justify-center border border-[var(--cream)]">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">🚨 SOS ACTIVE — <span className="italic text-[var(--pink)]">Help is on the way</span></h2>
            <p className="font-display italic text-xl text-[var(--cream)]/90">Stay calm. Live tracking active.</p>
          </div>
        </div>
      </div>

      {/* Live Map & Police Station */}
      <div className="poster-glass p-4 space-y-3 bg-[var(--cream)] border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--pink-deep)]" />
            <span>Live Location &amp; Police Station</span>
          </span>
          <button
            onClick={handleCopyLink}
            className="text-xs font-bold text-[var(--cream)] bg-[var(--ink)] px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0_var(--pink-deep)] hover:opacity-95 transition flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied! ✅' : 'Copy Tracking Link'}</span>
          </button>
        </div>

        <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-[var(--ink)] relative shadow-inner">
          <MapContainer
            center={[currentSession.lat, currentSession.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[currentSession.lat, currentSession.lng]}>
              <Popup>
                <div className="text-xs font-bold">🚨 {user.name} (SOS Active)</div>
              </Popup>
            </Marker>

            {policeStations[0] && (
              <Marker position={[policeStations[0].lat, policeStations[0].lng]}>
                <Popup>
                  <div className="text-xs">
                    <strong>👮 {policeStations[0].name}</strong>
                    <br />
                    Distance: {policeStations[0].distanceMeters}m ({policeStations[0].walkingMinutes} min walk)
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {policeStations[0] && (
          <div className="p-3.5 rounded-xl bg-[var(--sage)]/25 border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-wider">Nearest Police Station</span>
              <h4 className="font-display text-2xl font-bold text-[var(--ink)]">{policeStations[0].name}</h4>
              <p className="font-display italic text-xl text-[var(--ink)]">
                {policeStations[0].distanceMeters}m away • ~{policeStations[0].walkingMinutes} min walk
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${policeStations[0].lat},${policeStations[0].lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[var(--sage)] text-[var(--ink)] text-xs font-bold shadow-[2px_2px_0_var(--ink)] hover:opacity-95 transition flex items-center gap-1 border-2 border-[var(--ink)]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
              {policeStations[0].phone && (
                <a
                  href={`tel:${policeStations[0].phone}`}
                  className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-xs font-bold shadow-[2px_2px_0_var(--pink-deep)] hover:opacity-95 transition flex items-center gap-1 border-2 border-[var(--ink)]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contacts Alert Status */}
      <div className="poster-glass p-4 space-y-3 bg-[var(--cream)] border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)]">
        <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
          <Send className="w-4 h-4 text-[var(--pink-deep)]" />
          <span>Guardians Alert Status</span>
        </span>

        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-between">
              <div>
                <h4 className="font-display text-xl font-bold text-[var(--ink)]">
                  {c.name} <span className="font-display italic text-lg text-[var(--pink-deep)] font-normal">({c.relationship})</span>
                </h4>
                <p className="font-hand text-xl text-[var(--ink)]/80">{c.phone}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--sage)]/30 text-[var(--ink)] text-xs font-bold border border-[var(--ink)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--sage)]" />
                  <span>Sent</span>
                </div>
                <a
                  href={`sms:${c.phone}?body=${encodeURIComponent(`EMERGENCY: I need help! Track me: ${liveTrackUrl}`)}`}
                  className="px-2.5 py-1 rounded-xl bg-white border-2 border-[var(--ink)] text-[var(--pink-deep)] text-xs font-bold shadow-[2px_2px_0_var(--ink)] hover:bg-[var(--pink-pale)]"
                >
                  SMS
                </a>
                <a
                  href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`🚨 EMERGENCY: I need help! Track my live location: ${liveTrackUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-xl bg-emerald-100 border-2 border-[var(--ink)] text-emerald-800 text-xs font-bold shadow-[2px_2px_0_var(--ink)] hover:bg-emerald-200"
                >
                  WA
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Saathi Women Network */}
      <div className="poster-glass p-4 space-y-3 bg-[var(--cream)] border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[var(--pink-deep)]" />
            <span>Nearby Saathi Women ({activeHelpersCount} Coming)</span>
          </span>
          <button
            onClick={() => handleSimulateHelperComing(helpers[0].id)}
            className="text-xs font-bold text-[var(--ink)] bg-white px-3 py-1 rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--pink-deep)] hover:bg-[var(--pink-pale)] transition"
          >
            + Simulate Helper
          </button>
        </div>

        <div className="space-y-2">
          {helpers.map((h) => (
            <div key={h.id} className="p-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-between">
              <div>
                <h4 className="font-display text-xl font-bold text-[var(--ink)]">{h.name}</h4>
                <p className="font-hand text-xl text-[var(--ink)]/80">{h.distanceMeters}m away (Approximate)</p>
              </div>

              <div>
                {h.status === 'coming' ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-[var(--sage)] text-[var(--ink)] text-xs font-bold border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                    Coming to Help! 🏃‍♀️
                  </span>
                ) : (
                  <button
                    onClick={() => handleSimulateHelperComing(h.id)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-xs font-bold shadow-[2px_2px_0_var(--pink-deep)] hover:opacity-95 transition border-2 border-[var(--ink)]"
                  >
                    Simulate Coming
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Actions: Call 112 & I'm Safe */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <a
          href="tel:112"
          className="py-4 rounded-2xl bg-[var(--ink)] text-[var(--cream)] font-bold text-sm shadow-[6px_6px_0_var(--pink-deep)] hover:opacity-95 transition flex items-center justify-center gap-2 border-2 border-[var(--ink)]"
        >
          <Phone className="w-4 h-4 text-[var(--pink)]" />
          <span>Call 112 (Police)</span>
        </a>

        <button
          onClick={() => setShowPinModal(true)}
          className="py-4 rounded-2xl bg-[var(--sage)] text-[var(--ink)] font-bold text-sm shadow-[6px_6px_0_var(--ink)] hover:opacity-95 transition flex items-center justify-center gap-2 border-2 border-[var(--ink)]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I&apos;m Safe Now</span>
        </button>
      </div>

      {/* Safe PIN Confirmation Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="poster-glass w-full max-w-sm p-6 bg-[var(--cream)] shadow-[10px_10px_0_var(--ink)] border-4 border-[var(--ink)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-3xl font-bold text-[var(--ink)] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--pink-deep)]" />
                <span>Enter Safe <span className="italic text-[var(--pink-deep)]">PIN</span></span>
              </h3>
              <button onClick={() => setShowPinModal(false)} className="text-[var(--ink)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-display italic text-2xl text-[var(--ink)] mb-4">
              Enter your 4-digit Safe PIN (default: 1234) to confirm safety and cancel SOS.
            </p>

            {pinError && (
              <div className="mb-3 p-2 rounded-xl bg-red-100 border-2 border-red-400 text-red-800 text-xs font-bold">
                {pinError}
              </div>
            )}

            <form onSubmit={handleConfirmSafe} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full text-center tracking-[1em] text-2xl font-bold py-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-[var(--ink)]"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[var(--sage)] text-[var(--ink)] font-bold text-sm shadow-[4px_4px_0_var(--ink)] hover:opacity-95 transition border-2 border-[var(--ink)]"
              >
                Confirm I&apos;m Safe
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
