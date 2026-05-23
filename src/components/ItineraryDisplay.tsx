import { ItineraryResponse } from '../types';
import { Sun, Utensils, CloudSun, Moon, Lightbulb, Train, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  itinerary: ItineraryResponse;
}

export function ItineraryDisplay({ itinerary }: Props) {
  return (
    <div className="space-y-6">
      {itinerary.days.map((day) => (
        <div key={day.dayNumber} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Día {day.dayNumber}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sun className="w-3 h-3" /> Mañana
              </p>
              <p className="text-slate-200 text-sm">{day.morning}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Utensils className="w-3 h-3" /> Almuerzo
              </p>
              <p className="text-slate-200 text-sm">{day.lunch}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <CloudSun className="w-3 h-3" /> Tarde
              </p>
              <p className="text-slate-200 text-sm">{day.afternoon}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                <Moon className="w-3 h-3" /> Noche
              </p>
              <p className="text-slate-200 text-sm">{day.night}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Tips */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" /> Tips esenciales
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Train className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm">Transporte</p>
              <p className="text-slate-300 text-sm">{itinerary.tips.transport}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm">Zonas seguras</p>
              <p className="text-slate-300 text-sm">{itinerary.tips.safeZones}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm">Estafas comunes</p>
              <p className="text-slate-300 text-sm">{itinerary.tips.commonScam}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
