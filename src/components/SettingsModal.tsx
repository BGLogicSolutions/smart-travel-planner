import { X } from 'lucide-react';
import { AppSettings } from '../hooks/useSettings';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: Partial<AppSettings>) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: Props) {
  const [form, setForm] = useState({ ...settings });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Configuración</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Gemini API Key (opcional)</label>
            <input
              type="password"
              value={form.geminiApiKey}
              onChange={(e) => setForm({...form, geminiApiKey: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
              placeholder="AIza..."
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Stripe Public Key</label>
            <input
              type="text"
              value={form.stripePublicKey}
              onChange={(e) => setForm({...form, stripePublicKey: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
              placeholder="pk_live_..."
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Stripe Price ID</label>
            <input
              type="text"
              value={form.stripePriceId}
              onChange={(e) => setForm({...form, stripePriceId: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
              placeholder="price_xxx"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Booking Affiliate ID</label>
            <input
              type="text"
              value={form.bookingAffiliateId}
              onChange={(e) => setForm({...form, bookingAffiliateId: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Skyscanner Affiliate ID</label>
            <input
              type="text"
              value={form.skyscannerAffiliateId}
              onChange={(e) => setForm({...form, skyscannerAffiliateId: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
