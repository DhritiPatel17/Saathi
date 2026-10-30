import React, { useState } from 'react';
import { EmergencyContact, User } from '../types';
import { storage } from '../services/storage';
import { Plus, Trash2, Send, CheckCircle2, Phone, User as UserIcon } from 'lucide-react';
import { sendEmergencySMS } from '../services/policeApi';
import { TapeStrip } from '../components/illustrations/Scribbles';

interface ContactsScreenProps {
  user: User;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({ user }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(storage.getContacts());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [error, setError] = useState('');
  const [testSent, setTestSent] = useState(false);

  const quickRelations = ['Mom', 'Dad', 'Friend', 'Sibling', 'Partner'];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (contacts.length >= 3) {
      setError('You can add up to 3 emergency contacts.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter contact name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (cleanPhone === user.phone.replace(/\D/g, '')) {
      setError("You cannot add your own phone number.");
      return;
    }

    if (contacts.some((c) => c.phone.replace(/\D/g, '') === cleanPhone)) {
      setError('This contact is already added.');
      return;
    }

    const newContact: EmergencyContact = {
      id: `contact_${Date.now()}`,
      name: name.trim(),
      phone: `+91${cleanPhone}`,
      relationship: relationship as any,
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    storage.saveContacts(updated);

    setName('');
    setPhone('');
  };

  const handleDelete = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    storage.saveContacts(updated);
  };

  const handleSendTestAlert = () => {
    if (contacts.length === 0) {
      setError('Please add at least 1 contact to send a test alert.');
      return;
    }
    sendEmergencySMS(contacts, user.name, `${window.location.origin}/#/test-link`);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col px-4 py-6 max-w-xl mx-auto pb-24 space-y-6 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-[var(--ink)]">Guardians &amp; <span className="italic text-[var(--pink-deep)]">Contacts</span></h2>
          <p className="font-display italic text-2xl text-[var(--pink-deep)]">Manage your trusted safety circle.</p>
        </div>

        <button
          onClick={handleSendTestAlert}
          disabled={contacts.length === 0}
          className="px-4 py-2.5 rounded-xl bg-[var(--pink-deep)] text-white text-xs font-bold shadow-[3px_3px_0_var(--ink)] hover:opacity-95 transition flex items-center gap-1.5 border-2 border-[var(--ink)] disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send TEST Alert</span>
        </button>
      </div>

      {testSent && (
        <div className="p-3 rounded-xl bg-[var(--sage)]/30 border-2 border-[var(--ink)] text-[var(--ink)] text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0_var(--ink)]">
          <CheckCircle2 className="w-4 h-4 text-[var(--sage)]" />
          <span>TEST alert dispatched successfully to all {contacts.length} guardians!</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-100 border-2 border-red-400 text-red-800 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((c, index) => (
          <div key={c.id} className="poster-glass p-4 relative bg-white border-2 border-[var(--ink)] shadow-[5px_5px_0_var(--ink)]">
            <TapeStrip className="absolute -top-3 left-6" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--pink-deep)] text-white border-2 border-[var(--ink)] flex items-center justify-center font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-[var(--ink)]">{c.name}</h4>
                  <p className="font-hand text-2xl text-[var(--ink)]/80">
                    {c.relationship} • {c.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${c.phone}`}
                  className="p-2 rounded-xl bg-white border-2 border-[var(--ink)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:bg-gray-50"
                  title="Call Contact"
                >
                  <Phone className="w-4 h-4 text-[var(--sage)]" />
                </a>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-xl bg-white border-2 border-[var(--ink)] text-red-600 shadow-[2px_2px_0_var(--ink)] hover:bg-red-50"
                  title="Delete Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--ink)] text-center font-hand text-2xl text-[var(--ink)]/70 bg-white/40">
            No emergency contacts added yet.
          </div>
        )}
      </div>

      {/* Add Form */}
      {contacts.length < 3 && (
        <form onSubmit={handleAddContact} className="poster-glass p-5 space-y-3 bg-white/70 border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] font-body">
          <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
            Add Guardian ({contacts.length}/3)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[var(--pink-deep)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Guardian name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border-2 border-[var(--ink)] text-xs text-[var(--ink)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">Phone</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[var(--pink-deep)]">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-white border-2 border-[var(--ink)] text-xs text-[var(--ink)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] tracking-wider"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">Relationship</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickRelations.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setRelationship(rel)}
                  className={`py-1 px-3 rounded-lg text-xs font-bold transition border-2 border-[var(--ink)] ${
                    relationship === rel
                      ? 'bg-[var(--ink)] text-[var(--cream)] shadow-[2px_2px_0_var(--pink-deep)]'
                      : 'bg-white text-[var(--ink)] hover:bg-[var(--pink-pale)]'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Or custom relationship..."
              className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[var(--ink)] text-xs text-[var(--ink)] font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--pink-deep)] text-white text-xs font-bold shadow-[3px_3px_0_var(--ink)] hover:opacity-95 transition flex items-center justify-center gap-2 mt-2 border-2 border-[var(--ink)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guardian</span>
          </button>
        </form>
      )}
    </div>
  );
};
