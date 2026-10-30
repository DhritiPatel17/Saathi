import React, { useState } from 'react';
import { EmergencyContact, User } from '../types';
import { storage } from '../services/storage';
import { Users, Plus, Trash2, ArrowRight, Phone, User as UserIcon } from 'lucide-react';
import { TapeStrip } from '../components/illustrations/Scribbles';

interface ContactsSetupScreenProps {
  user: User;
  onComplete: () => void;
}

export const ContactsSetupScreen: React.FC<ContactsSetupScreenProps> = ({ user, onComplete }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(storage.getContacts());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Mom');
  const [error, setError] = useState('');

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
      setError('This phone number is already added.');
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
    setRelationship('Friend');
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    storage.saveContacts(updated);
  };

  const handleFinish = () => {
    if (contacts.length === 0) {
      setError('Please add at least 1 emergency contact to continue.');
      return;
    }
    onComplete();
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between px-4 py-8 max-w-lg mx-auto">
      <div>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--sage)]/40 border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-center text-[var(--ink)] mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="font-display text-4xl font-normal text-[var(--ink)]">
            Add the people you <span className="italic text-[var(--pink-deep)]">trust</span>
          </h2>
          <p className="font-display italic text-2xl text-[var(--pink-deep)] mt-1">
            Up to 3 guardians who will receive your SOS alert.
          </p>
          <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-white border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] font-hand text-2xl font-bold text-[var(--ink)]">
            {contacts.length} of 3 added {contacts.length > 0 && '✨'}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-red-400 text-red-800 text-xs font-bold font-body">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {contacts.map((c, index) => (
            <div key={c.id} className="poster-glass p-4 relative rotate-[-1deg] bg-white border-2 border-[var(--ink)] shadow-[5px_5px_0_var(--ink)]">
              <TapeStrip className="absolute -top-3 left-8" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--pink)] text-white border-2 border-[var(--ink)] flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-display text-2xl font-bold text-[var(--ink)]">{c.name}</h4>
                    <p className="font-hand text-2xl text-[var(--ink)]/80">
                      {c.relationship} • {c.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteContact(c.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-300"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--ink)] text-center font-hand text-2xl text-[var(--ink)]/70 bg-white/40">
              No contacts added yet. Add at least 1 guardian below.
            </div>
          )}
        </div>

        {contacts.length < 3 && (
          <form onSubmit={handleAddContact} className="poster-glass p-5 space-y-3 bg-white/60 border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--ink)] font-body">
            <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
              Add Guardian #{contacts.length + 1}
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
                placeholder="Or type custom relationship..."
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[var(--ink)] text-xs text-[var(--ink)] font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--ink)] text-[var(--cream)] text-xs font-bold shadow-[3px_3px_0_var(--pink-deep)] hover:bg-[var(--ink)]/90 transition flex items-center justify-center gap-2 mt-2 border-2 border-[var(--ink)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guardian</span>
            </button>
          </form>
        )}
      </div>

      <div className="pt-6">
        <button
          onClick={handleFinish}
          disabled={contacts.length === 0}
          className={`w-full py-4 rounded-2xl font-body font-bold text-base shadow-[6px_6px_0_var(--ink)] transition flex items-center justify-center gap-2 border-2 border-[var(--ink)] ${
            contacts.length > 0
              ? 'bg-[var(--pink-deep)] text-white hover:opacity-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Finish Setup &amp; Enter Saathi</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
