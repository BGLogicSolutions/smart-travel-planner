import { X, Settings2, Key, CreditCard, Link as LinkIcon, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, FormEvent } from 'react';
import { AppSettings } from '../hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: Partial<AppSettings>) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-400" /> 
                Configuración de APIs
              </h3>
              <p className="text-sm text-slate-400">Tus claves se guardan localmente en tu navegador.</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8">
            
            {/* Gemini API */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-300 font-bold mb-2 text-sm uppercase tracking-wider border-b border-white/5 pb-2">
                <Key className="w-4 h-4" /> Inteligencia Artificial
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1">Gemini API Key</label>
                <input 
                  type="password" 
                  value={localSettings.geminiApiKey}
                  onChange={(e) => setLocalSettings(s => ({ ...s, geminiApiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
                <p className="text-[10px] text-slate-500 ml-1">Requerido para generar itinerarios reales si no existe en el entorno.</p>
              </div>
            </div>

            {/* Stripe API */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-300 font-bold mb-2 text-sm uppercase tracking-wider border-b border-white/5 pb-2">
                <CreditCard className="w-4 h-4" /> Pagos (Stripe)
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1">Clave Pública (pk_test_... o pk_live_...)</label>
                <input 
                  type="text" 
                  value={localSettings.stripePublicKey}
                  onChange={(e) => setLocalSettings(s => ({ ...s, stripePublicKey: e.target.value }))}
                  placeholder="pk_test_..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1">ID de Precio (price_...)</label>
                <input 
                  type="text" 
                  value={localSettings.stripePriceId}
                  onChange={(e) => setLocalSettings(s => ({ ...s, stripePriceId: e.target.value }))}
                  placeholder="price_..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Afiliados */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-indigo-300 font-bold mb-2 text-sm uppercase tracking-wider border-b border-white/5 pb-2">
                <LinkIcon className="w-4 h-4" /> Enlaces de Afiliados
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1">Booking Affiliate ID</label>
                <input 
                  type="text" 
                  value={localSettings.bookingAffiliateId}
                  onChange={(e) => setLocalSettings(s => ({ ...s, bookingAffiliateId: e.target.value }))}
                  placeholder="TU_ID_AQUI"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1">Skyscanner Associate ID</label>
                <input 
                  type="text" 
                  value={localSettings.skyscannerAffiliateId}
                  onChange={(e) => setLocalSettings(s => ({ ...s, skyscannerAffiliateId: e.target.value }))}
                  placeholder="TU_ID_AQUI"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 shrink-0 mb-2">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Save className="w-5 h-5" />
                Guardar Configuración
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
