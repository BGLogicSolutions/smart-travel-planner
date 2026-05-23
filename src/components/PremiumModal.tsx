import { useState, FormEvent } from 'react';
import { X, FileText, Lock, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  stripePublicKey?: string;
  stripePriceId?: string;
}

export function PremiumModal({ isOpen, onClose, stripePublicKey, stripePriceId }: PremiumModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const pubKey = stripePublicKey || "pk_test_REEMPLAZA_CON_TU_CLAVE";
      const priceId = stripePriceId || "price_REEMPLAZA_CON_TU_PRICE_ID";

      const stripe = await loadStripe(pubKey);
      
      if (!stripe) {
        throw new Error("No se pudo cargar Stripe");
      }

      // Redirigir a Stripe Checkout
      const { error } = await (stripe as any).redirectToCheckout({
        lineItems: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription', // O 'payment' si es pago único
        successUrl: window.location.origin + '?premium=true',
        cancelUrl: window.location.origin,
      });

      if (error) {
        console.error("Error redirecting to Stripe:", error);
        alert("Error de Stripe: Verifica tu clave pública/price ID y tu conexión.");
      }
    } catch (err) {
      console.error(err);
      alert("Debes configurar tus Claves de Stripe en la Configuración (ícono de engranaje) para probar esto en producción real.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> 
                Exportar en PDF
              </h3>
              <p className="text-sm text-slate-400">Suscripción Premium • $9.00 / mes</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-4">
              <h4 className="text-indigo-300 font-bold mb-2 text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4"/>
                Pago Seguro por Stripe
              </h4>
              <p className="text-xs text-slate-300">
                Al hacer clic, serás redirigido de forma segura a la pasarela de pago oficial de Stripe para completar tu compra.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Transacción encriptada y procesada por Stripe.</span>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirigiendo a Stripe...
                </span>
              ) : "Pagar $9.00 USD"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
