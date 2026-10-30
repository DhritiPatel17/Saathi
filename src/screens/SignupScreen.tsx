import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';
import { Shield, Phone, User as UserIcon, Calendar, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GirlWriting } from '../components/illustrations/GirlWriting';

interface SignupScreenProps {
  mode: 'signup' | 'login';
  onComplete: (user: User) => void;
  onSwitchMode: (mode: 'signup' | 'login') => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ mode, onComplete, onSwitchMode }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(22);
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!age || Number(age) < 12 || Number(age) > 100) {
        setError('Please enter a valid age between 12 and 100.');
        return;
      }
      if (!occupation.trim() || occupation.trim().length < 2) {
        setError('Please enter what you do (min 2 characters).');
        return;
      }
    } else {
      const existing = storage.getUser();
      if (!existing || existing.phone.slice(-10) !== cleanPhone) {
        setError('No account found with this phone number. Please sign up first.');
        return;
      }
    }

    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 4) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }

    const cleanPhone = `+91${phone.replace(/\D/g, '')}`;

    if (mode === 'signup') {
      const newUser: User = {
        name: name.trim(),
        phone: cleanPhone,
        age: Number(age),
        occupation: occupation.trim(),
        city: city.trim(),
        helperOptIn: true,
        quickTapMode: false,
        safePin: '1234',
        createdAt: new Date().toISOString(),
      };
      storage.saveUser(newUser);
      onComplete(newUser);
    } else {
      const existing = storage.getUser();
      if (existing) {
        onComplete(existing);
      } else {
        setError('User data not found.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative">
      <div className="absolute -top-8 right-0 z-10 hidden sm:block">
        <GirlWriting className="w-36 h-40" />
      </div>

      <div className="poster-glass p-6 md:p-8 relative z-20 shadow-[8px_8px_0_var(--ink)] border-2 border-[var(--ink)] bg-[var(--cream)]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--pink-deep)] border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] flex items-center justify-center text-white mx-auto mb-3">
            <Shield className="w-7 h-7 fill-current" />
          </div>
          <h2 className="font-display text-4xl font-normal text-[var(--ink)]">
            {mode === 'signup' ? 'Join S<span class="text-[var(--pink-deep)]">a</span>athi' : 'Welcome <span class="italic text-[var(--pink-deep)]">Back</span>'}
          </h2>
          <p className="font-display italic text-2xl text-[var(--pink-deep)] mt-1">
            {mode === 'signup' ? 'Create your safety profile' : 'Sign in with phone & OTP'}
          </p>
        </div>

        {error && hasInteracted && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-red-400 text-red-800 text-xs font-bold font-body">
            {error}
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 font-body">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--pink-deep)]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-sm text-[var(--ink)] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1 uppercase tracking-wider">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--pink-deep)]" />
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Age"
                        min="12"
                        max="100"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-sm text-[var(--ink)] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1 uppercase tracking-wider">
                      City (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--pink-deep)]" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-sm text-[var(--ink)] font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1 uppercase tracking-wider">
                    What do you do?
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="student, designer, nurse, anything..."
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-base text-[var(--ink)] font-normal font-hand"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-[var(--pink-deep)]">+91</span>
                <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-[var(--pink-deep)]" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-sm text-[var(--ink)] font-medium tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[var(--ink)] text-[var(--cream)] font-body font-bold text-sm shadow-[4px_4px_0_var(--pink-deep)] hover:translate-y-[-1px] transition flex items-center justify-center gap-2 mt-4 border-2 border-[var(--ink)]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center font-body">
            <div className="p-3 rounded-xl bg-[var(--sage)]/20 border-2 border-[var(--ink)] text-[var(--ink)] text-xs font-bold mb-2 flex items-center justify-center gap-1.5 shadow-[2px_2px_0_var(--ink)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--sage)]" />
              <span>Demo OTP sent to +91 {phone}</span>
            </div>

            <div className="my-4">
              <label className="block text-xs font-bold text-[var(--ink)] mb-2 uppercase tracking-wider">
                Enter 4-Digit OTP
              </label>
              <p className="font-hand text-2xl text-[var(--pink-deep)] mb-3">
                Hint: Use code <strong className="underline">1234</strong>
              </p>

              <div className="flex justify-center gap-3 mb-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white border-2 border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--pink-deep)] text-[var(--ink)]"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[var(--pink-deep)] text-white font-body font-bold text-sm shadow-[4px_4px_0_var(--ink)] hover:opacity-95 transition border-2 border-[var(--ink)]"
            >
              Verify &amp; Enter Saathi
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="font-hand text-xl text-[var(--ink)] hover:underline mt-2 block mx-auto"
            >
              ← Change mobile number
            </button>
          </form>
        )}

        <div className="mt-6 text-center border-t-2 border-[var(--ink)]/20 pt-4 font-body">
          {mode === 'signup' ? (
            <p className="text-xs text-[var(--ink)] font-medium">
              Already have an account?{' '}
              <button
                onClick={() => onSwitchMode('login')}
                className="font-bold text-[var(--pink-deep)] hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-xs text-[var(--ink)] font-medium">
              New to Saathi?{' '}
              <button
                onClick={() => onSwitchMode('signup')}
                className="font-bold text-[var(--pink-deep)] hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
