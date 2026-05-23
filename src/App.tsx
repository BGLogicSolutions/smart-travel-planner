/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PlaneTakeoff, RefreshCw, Download, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import { TravelForm } from './components/TravelForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { MapPlaceholder } from './components/MapPlaceholder';
import { AffiliateLinks } from './components/AffiliateLinks';
import { PremiumModal } from './components/PremiumModal';
import { SettingsModal } from './components/SettingsModal';
import { TravelRequest, ItineraryResponse } from './types';
import { useSettings } from './hooks/useSettings';
import html2pdf from 'html2pdf.js';

export default function App() {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [activeRequest, setActiveRequest] = useState<TravelRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    // Check if the user just returned from Stripe Checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('premium') === 'true') {
      setIsPremium(true);
      // Clean up URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGenerate = async (request: TravelRequest) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setActiveRequest(request);
    
    // Inject local Gemini API key from settings if present
    const requestWithSettings = {
      ...request,
      geminiApiKey: settings.geminiApiKey || undefined
    };

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestWithSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al generar tu itinerario.');
      }

      setItinerary(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlanner = () => {
    setItinerary(null);
    setActiveRequest(null);
    setError(null);
  };

  const handleDownloadPDF = () => {
    if (!isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }

    const element = document.getElementById('itinerary-content');
    if (element) {
      const opt = {
        margin:       0.5,
        filename:     `Itinerario-${activeRequest?.destination.replace(/\s+/g, '-')}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };
      
      // Temporarily add a white background for the PDF generation since the app is dark mode
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = '#0f172a'; // slate-950 to keep the dark mode look for the PDF, or make it white for printing. Let's stick to dark theme.
      
      html2pdf().set(opt).from(element).save().then(() => {
         element.style.backgroundColor = originalBg;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Navigation */}
      <header className="relative z-20 flex items-center justify-end px-6 py-4">
        <button 
          onClick={() => setIsSettingsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-slate-300 transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
          Configuración
        </button>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-[calc(100vh-80px)] overflow-y-auto pb-32">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-500 rounded-lg p-3 text-white shadow-lg shadow-indigo-500/20">
              <PlaneTakeoff className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Viaja <span className="text-indigo-400">Inteligente</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Descubre tu próxima aventura en segundos. Generamos itinerarios hiper-personalizados adaptados a tu destino, tiempo y presupuesto.
          </p>
        </div>

        {/* Dynamic Content */}
        <div className="transition-all duration-500">
          {!itinerary && !isLoading && (
            <div className="max-w-2xl mx-auto">
              <TravelForm onSubmit={handleGenerate} isLoading={isLoading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 text-red-400 rounded-xl text-center text-sm border border-red-500/20">
                  {error}
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                <PlaneTakeoff className="absolute inset-0 m-auto h-8 w-8 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Diseñando tu viaje ideal</h3>
              <p className="text-slate-400 max-w-md">Analizando las mejores rutas, gastronomía y experiencias según tu presupuesto...</p>
            </div>
          )}

          {itinerary && activeRequest && !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6 px-2">
                <button
                  onClick={resetPlanner}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Planear otro viaje
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Itinerary */}
                <div className="lg:col-span-2" id="itinerary-content">
                   <ItineraryDisplay itinerary={itinerary} />
                </div>

                {/* Right Column: Monetization, Map and PDF Export */}
                <div className="lg:col-span-1 space-y-6 mt-8 lg:mt-[3.25rem]">
                  
                  <MapPlaceholder destination={activeRequest.destination} />

                  <AffiliateLinks 
                    destination={activeRequest.destination} 
                    bookingId={settings.bookingAffiliateId} 
                    skyscannerId={settings.skyscannerAffiliateId} 
                  />

                  {/* Premium Upsell Container */}
                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 shadow-lg text-center backdrop-blur-xl">
                    <h3 className="text-lg font-display font-bold text-white mb-2">Lleva tu itinerario contigo</h3>
                    <p className="text-xs text-indigo-200 mb-6">Obtén la versión PDF offline, con mapas interactivos y confirmaciones de reserva.</p>
                    <button 
                      onClick={() => isPremium ? handleDownloadPDF() : setIsPremiumModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all text-sm"
                    >
                      <Download className="w-4 h-4" />
                      {isPremium ? "Descargar PDF (Premium)" : "Desbloquear PDF por $9.00"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        stripePublicKey={settings.stripePublicKey}
        stripePriceId={settings.stripePriceId}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </div>
  );
}
