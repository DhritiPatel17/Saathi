import { User, EmergencyContact, SosSession } from '../types';

const USER_KEY = 'sathi_user';
const CONTACTS_KEY = 'sathi_contacts';
const SOS_KEY = 'sathi_active_sos';
const SIMULATED_HELPERS_KEY = 'sathi_simulated_helpers';

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(CONTACTS_KEY);
    localStorage.removeItem(SOS_KEY);
  },

  getContacts: (): EmergencyContact[] => {
    const data = localStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveContacts: (contacts: EmergencyContact[]): void => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  },

  getActiveSos: (): SosSession | null => {
    const data = localStorage.getItem(SOS_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveActiveSos: (session: SosSession | null): void => {
    if (session) {
      localStorage.setItem(SOS_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SOS_KEY);
    }
  },

  getSimulatedHelpers: () => {
    const data = localStorage.getItem(SIMULATED_HELPERS_KEY);
    if (data) return JSON.parse(data);
    // Default mock nearby women
    const defaults = [
      { id: 'h1', name: 'Priya M.', lat: 0, lng: 0, distanceMeters: 280, status: 'notified' as const },
      { id: 'h2', name: 'Ananya S.', lat: 0, lng: 0, distanceMeters: 450, status: 'notified' as const },
      { id: 'h3', name: 'Divya K.', lat: 0, lng: 0, distanceMeters: 720, status: 'notified' as const },
    ];
    localStorage.setItem(SIMULATED_HELPERS_KEY, JSON.stringify(defaults));
    return defaults;
  },

  saveSimulatedHelpers: (helpers: any[]) => {
    localStorage.setItem(SIMULATED_HELPERS_KEY, JSON.stringify(helpers));
  }
};
