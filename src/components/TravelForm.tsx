import { useState } from 'react';
import { TravelRequest } from '../types';
import { PlaneTakeoff, Calendar, DollarSign, Compass } from 'lucide-react';

interface TravelFormProps {
  onSubmit: (request: TravelRequest) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<'bajo' | 'medio' | 'alto'>('medio');
  const [tripType, setTripType] = useState<'Aventura' | 'Familiar' | 'Relajación'>('Aventura');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination: destination.trim(), days, budget, tripType });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 space-y-6">
      {/* Destination */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <PlaneTakeoff className="w-4 h-4" /> Destino
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ej: París, Tokio, Cusco..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Days */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Calendar className="w-4 h-4" /> Días
        </label>
        <input
          type="number"
          min={1}
          max={30}
          value={days}
          onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <DollarSign className="w-4 h-4" /> Presupuesto
        </label>
        <div className="flex gap-2">
          {(['bajo', 'medio', 'alto'] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                budget === b
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {b === 'bajo' ? 'Económico' : b === 'medio' ? 'Medio' : 'Lujo'}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Type */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Compass className="w-4 h-4" /> Tipo de viaje
        </label>
        <div className="flex gap-2">
          {(['Aventura', 'Familiar', 'Relajación'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTripType(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tripType === t
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
      >
        {isLoading ? 'Generando...' : 'Generar Itinerario'}
      </button>
    </form>
  );
}
