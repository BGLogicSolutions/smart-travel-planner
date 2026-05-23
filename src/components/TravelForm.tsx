import { useState, FormEvent } from 'react';
import { MapPin, Calendar, Wallet, Sparkles, Compass } from 'lucide-react';
import { BudgetLevel, TravelRequest, TripType } from '../types';

interface TravelFormProps {
  onSubmit: (request: TravelRequest) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<BudgetLevel>('Medio');
  const [tripType, setTripType] = useState<TripType>('Aventura');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination: destination.trim(), days, budget, tripType });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/10 space-y-6 transition-colors duration-200">
      <div className="space-y-2">
        <label htmlFor="destination" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
          ¿A dónde quieres ir?
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <MapPin className="h-5 w-5" />
          </div>
          <input
            id="destination"
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ej. Tokio, París, Ciudad de México..."
            className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/10 rounded-xl leading-5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label htmlFor="days" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
            Días de Viaje
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Calendar className="h-5 w-5" />
            </div>
            <select
              id="days"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 appearance-none sm:text-sm"
            >
              {Array.from({ length: 14 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d} className="bg-slate-900">
                  {d} {d === 1 ? 'día' : 'días'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="budget" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
            Presupuesto
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Wallet className="h-5 w-5" />
            </div>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetLevel)}
              className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 appearance-none sm:text-sm"
            >
              <option value="Bajo" className="bg-slate-900">Bajo (Económico)</option>
              <option value="Medio" className="bg-slate-900">Medio (Estándar)</option>
              <option value="Alto" className="bg-slate-900">Alto (Lujo/Exclusivo)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label htmlFor="tripType" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
            Tipo de Viaje
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Compass className="h-5 w-5" />
            </div>
            <select
              id="tripType"
              value={tripType}
              onChange={(e) => setTripType(e.target.value as TripType)}
              className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 appearance-none sm:text-sm"
            >
              <option value="Aventura" className="bg-slate-900">Aventura</option>
              <option value="Familiar" className="bg-slate-900">Familiar</option>
              <option value="Relajación" className="bg-slate-900">Relajación</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !destination.trim()}
        className="w-full flex items-center justify-center py-4 px-4 text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-400 border border-transparent rounded-2xl shadow-lg shadow-indigo-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Planificando Viaje...
          </span>
        ) : (
          <span className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5" />
            Generar Itinerario
          </span>
        )}
      </button>
    </form>
  );
}
