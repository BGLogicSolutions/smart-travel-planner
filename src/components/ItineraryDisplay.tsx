import { useState } from 'react';
import { ChevronDown, ChevronUp, Sun, Utensils, Sunset, Moon, Map, ShieldAlert, Train } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ItineraryResponse, DailyPlan } from '../types';

interface ItineraryDisplayProps {
  itinerary: ItineraryResponse;
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Default open first day

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  return (
    <div className="w-full space-y-8">
      {/* Itinerary Days Header */}
      <h2 className="text-2xl font-display font-bold text-white px-2">
        Tu Itinerario Personalizado
      </h2>

      {/* Days List */}
      <div className="space-y-4">
        {itinerary.days.map((day: DailyPlan) => (
          <div 
            key={day.dayNumber} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggleDay(day.dayNumber)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                  {day.dayNumber}
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Día {day.dayNumber}
                </h3>
              </div>
              <div className="text-slate-400">
                {expandedDay === day.dayNumber ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedDay === day.dayNumber && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { height: 0, opacity: 0 },
                    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }
                  }}
                  className="px-5 pb-5 pt-2"
                >
                  <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Morning */}
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/5 mt-4 sm:mt-0">
                      <div className="absolute -left-10 top-4 text-white/50">
                        <Sun className="w-5 h-5" />
                      </div>
                      <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Mañana</h4>
                      <p className="text-sm text-slate-200 leading-relaxed">{day.morning}</p>
                    </div>

                    {/* Lunch */}
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="absolute -left-10 top-4 text-white/50 sm:hidden">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Almuerzo</h4>
                      <p className="text-sm text-slate-200 leading-relaxed">{day.lunch}</p>
                    </div>

                    {/* Afternoon */}
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="absolute -left-10 top-4 text-white/50">
                        <Sunset className="w-5 h-5" />
                      </div>
                      <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Tarde</h4>
                      <p className="text-sm text-slate-200 leading-relaxed">{day.afternoon}</p>
                    </div>

                    {/* Night */}
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="absolute -left-10 top-4 text-white/50 sm:hidden">
                        <Moon className="w-5 h-5" />
                      </div>
                      <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Noche</h4>
                      <p className="text-sm text-slate-200 leading-relaxed">{day.night}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Practical Tips Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mt-8">
        <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <Map className="w-6 h-6 text-indigo-400" /> Consejos Prácticos del Destino
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <Train className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider ml-1">Mejor Transporte</h4>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{itinerary.tips.transport}</p>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider ml-1">Zonas Seguras</h4>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{itinerary.tips.safeZones}</p>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider ml-1">Evita esta Estafa</h4>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{itinerary.tips.commonScam}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
