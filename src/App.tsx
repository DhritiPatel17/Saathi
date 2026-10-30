/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { User, EmergencyContact, SosSession } from './types';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { SignupScreen } from './screens/SignupScreen';
import { ContactsSetupScreen } from './screens/ContactsSetupScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SosActiveScreen } from './screens/SosActiveScreen';
import { MapScreen } from './screens/MapScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TrackingScreen } from './screens/TrackingScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';

function AppContent() {
  const [user, setUser] = useState<User | null>(storage.getUser());
  const [contacts, setContacts] = useState<EmergencyContact[]>(storage.getContacts());
  const [activeSos, setActiveSos] = useState<SosSession | null>(storage.getActiveSos());

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname.replace('/', '') || 'home';

  const handleNavigate = (screen: string) => {
    navigate(`/${screen === 'home' && !user ? '' : screen}`);
  };

  const handleTriggerSos = () => {
    if (!user) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          createSosSession(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          createSosSession(19.076, 72.8777);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      createSosSession(19.076, 72.8777);
    }
  };

  const createSosSession = (lat: number, lng: number) => {
    const newSession: SosSession = {
      id: `sos_${Date.now()}`,
      userId: user!.phone,
      userName: user!.name,
      startTime: Date.now(),
      status: 'active',
      lat,
      lng,
      contactsAlerted: contacts.map((c) => ({
        contactId: c.id,
        name: c.name,
        phone: c.phone,
        status: 'sent',
      })),
      helpers: storage.getSimulatedHelpers(),
    };
    storage.saveActiveSos(newSession);
    setActiveSos(newSession);
    navigate('/sos-active');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)] selection:bg-[var(--pink-deep)] selection:text-white">
      <Navbar user={user} onNavigate={handleNavigate} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                contacts.length === 0 ? (
                  <ContactsSetupScreen user={user} onComplete={() => navigate('/home')} />
                ) : activeSos ? (
                  <SosActiveScreen
                    user={user}
                    contacts={contacts}
                    session={activeSos}
                    onSafe={() => setActiveSos(null)}
                    onNavigate={handleNavigate}
                  />
                ) : (
                  <HomeScreen
                    user={user}
                    contacts={contacts}
                    onTriggerSos={handleTriggerSos}
                    onNavigate={handleNavigate}
                  />
                )
              ) : (
                <WelcomeScreen onNavigate={(mode) => navigate(`/${mode}`)} />
              )
            }
          />

          <Route
            path="/signup"
            element={
              <SignupScreen
                mode="signup"
                onComplete={(u) => {
                  setUser(u);
                  navigate('/contacts-setup');
                }}
                onSwitchMode={() => navigate('/login')}
              />
            }
          />

          <Route
            path="/login"
            element={
              <SignupScreen
                mode="login"
                onComplete={(u) => {
                  setUser(u);
                  setContacts(storage.getContacts());
                  navigate('/home');
                }}
                onSwitchMode={() => navigate('/signup')}
              />
            }
          />

          <Route
            path="/contacts-setup"
            element={
              user ? (
                <ContactsSetupScreen
                  user={user}
                  onComplete={() => {
                    setContacts(storage.getContacts());
                    navigate('/home');
                  }}
                />
              ) : (
                <WelcomeScreen onNavigate={(m) => navigate(`/${m}`)} />
              )
            }
          />

          <Route
            path="/home"
            element={
              user ? (
                activeSos ? (
                  <SosActiveScreen
                    user={user}
                    contacts={contacts}
                    session={activeSos}
                    onSafe={() => setActiveSos(null)}
                    onNavigate={handleNavigate}
                  />
                ) : (
                  <HomeScreen
                    user={user}
                    contacts={contacts}
                    onTriggerSos={handleTriggerSos}
                    onNavigate={handleNavigate}
                  />
                )
              ) : (
                <WelcomeScreen onNavigate={(m) => navigate(`/${m}`)} />
              )
            }
          />

          <Route path="/map" element={user ? <MapScreen user={user} /> : <WelcomeScreen onNavigate={(m) => navigate(`/${m}`)} />} />

          <Route path="/contacts" element={user ? <ContactsScreen user={user} /> : <WelcomeScreen onNavigate={(m) => navigate(`/${m}`)} />} />

          <Route
            path="/profile"
            element={
              user ? (
                <ProfileScreen
                  user={user}
                  onUpdateUser={(u) => setUser({ ...u })}
                  onLogout={() => {
                    setUser(null);
                    setContacts([]);
                    setActiveSos(null);
                    navigate('/');
                  }}
                />
              ) : (
                <WelcomeScreen onNavigate={(m) => navigate(`/${m}`)} />
              )
            }
          />

          <Route
            path="/sos-active"
            element={
              user && activeSos ? (
                <SosActiveScreen
                  user={user}
                  contacts={contacts}
                  session={activeSos}
                  onSafe={() => setActiveSos(null)}
                  onNavigate={handleNavigate}
                />
              ) : (
                <HomeScreen
                  user={user!}
                  contacts={contacts}
                  onTriggerSos={handleTriggerSos}
                  onNavigate={handleNavigate}
                />
              )
            }
          />

          <Route path="/track/:sessionId" element={<TrackingScreen />} />

          <Route path="*" element={<NotFoundScreen onNavigate={handleNavigate} />} />
        </Routes>
      </main>

      {user && !activeSos && (
        <BottomNav currentScreen={path} onNavigate={handleNavigate} hasActiveSos={!!activeSos} />
      )}

      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
