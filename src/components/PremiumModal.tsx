import { X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stripePublicKey: string;
  stripePriceId: string;
}

export function PremiumModal({ isOpen, onClose, stripePublicKey, stripePriceId }: Props) {
  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!stripePublicKey || !stripePriceId) {
      alert('Configura las claves de Stripe en Ajustes');
      return;
    }
    const stripe = await loadStripe(stripePublicKey);
    if (!stripe) {
      alert('Error al cargar Stripe');
      return;
    }
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: stripePriceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: window.location.origin + '?premium=true',
      cancelUrl: window.location.origin,
    });
    if (error) alert(error.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Desbloquea Premium</h2>
        <ul className="space-y-2 text-slate-300 text-sm mb-6">
          <li>✅ Descargas PDF ilimitadas</li>
          <li>✅ Mapas interactivos</li>
          <li>✅ Sin límite de generación</li>
          <li>✅ Prioridad en procesamiento</li>
        </ul>
        <button
          onClick={handleUpgrade}
          className="w-full py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-400 transition-all shadow-lg"
        >
          Obtener Premium – $9.99/mes
        </button>
      </div>
    </div>
  );
}
