'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Briefcase } from 'lucide-react';

interface PersonalizationModalProps {
  onComplete: (data: { name: string; role: string }) => void;
}

export default function PersonalizationModal({ onComplete }: PersonalizationModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        role: role.trim() || 'Product Manager'
      });
    }
  };

  const commonRoles = [
    'Product Manager',
    'Senior PM',
    'Director of Product',
    'VP of Product',
    'CPO',
    'Founder',
    'CEO',
    'Engineering Manager',
    'Designer',
    'Product Designer'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-background/90 backdrop-blur-sm"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white border-2 border-brand-primary p-4 md:p-8 font-brand"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-primary" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-primary" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-primary" />

        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-brand-primary mb-1 md:mb-2">INITIATE SEQUENCE</h2>
          <p className="text-brand-text-secondary text-xs md:text-sm">
            Personalize your philosophy profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-xs text-brand-primary tracking-wider mb-2">
              YOUR NAME *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/60" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-brand-background border-2 border-brand-border text-brand-text-primary pl-10 pr-4 py-2 md:py-3
                         focus:border-brand-primary focus:outline-none transition-colors
                         placeholder:text-brand-text-secondary text-sm md:text-base"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Role Input */}
          <div>
            <label className="block text-xs text-brand-primary tracking-wider mb-2">
              YOUR ROLE
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/60" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Product Manager"
                className="w-full bg-brand-background border-2 border-brand-border text-brand-text-primary pl-10 pr-4 py-2 md:py-3
                         focus:border-brand-primary focus:outline-none transition-colors
                         placeholder:text-brand-text-secondary text-sm md:text-base"
                list="roles"
              />
              <datalist id="roles">
                {commonRoles.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Quick select roles */}
          <div>
            <div className="text-xs text-brand-text-secondary mb-2">QUICK SELECT:</div>
            <div className="flex flex-wrap gap-2">
              {commonRoles.slice(0, 4).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-1 text-xs border transition-all ${
                    role === r
                      ? 'border-brand-primary text-brand-primary bg-brand-primary/10'
                      : 'border-brand-border text-brand-text-secondary hover:border-brand-primary/50 hover:text-brand-primary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 md:py-4 bg-brand-primary text-void font-bold tracking-wider text-sm md:text-base
                     hover:bg-brand-primary-dark transition-all relative overflow-hidden group
                     disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!name.trim()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">BEGIN ASSESSMENT →</span>
          </motion.button>

          <p className="text-[10px] md:text-xs text-brand-text-muted text-center">
            Your name will appear on your final philosophy profile
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
