export interface User {
  name: string;
  phone: string;
  age: number;
  occupation: string;
  customOccupation?: string;
  city?: string;
  helperOptIn: boolean;
  quickTapMode: boolean;
  safePin: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: 'Mom' | 'Dad' | 'Friend' | 'Sibling' | 'Other';
}

export interface PoliceStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  walkingMinutes: number;
  phone?: string;
  address?: string;
}

export interface NearbyHelper {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  status: 'notified' | 'coming' | 'declined';
}

export interface SosSession {
  id: string;
  userId: string;
  userName: string;
  startTime: number;
  status: 'active' | 'safe';
  lat: number;
  lng: number;
  address?: string;
  contactsAlerted: {
    contactId: string;
    name: string;
    phone: string;
    status: 'sending' | 'sent' | 'failed';
  }[];
  policeStation?: PoliceStation;
  helpers: NearbyHelper[];
}

export type ScreenType =
  | 'welcome'
  | 'signup'
  | 'login'
  | 'contacts-setup'
  | 'home'
  | 'map'
  | 'contacts'
  | 'profile'
  | 'sos-active'
  | 'track';
