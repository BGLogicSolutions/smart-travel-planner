import { MapPin } from 'lucide-react';

interface Props {
  destination: string;
}

export function MapPlaceholder({ destination }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg text-center">
      <div className="flex justify-center mb-2">
        <MapPin className="w-10 h-10 text-indigo-400" />
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{destination}</h4>
      <p className="text-xs text-slate-400">Mapa interactivo próximamente</p>
      <div className="mt-3 bg-white/5 rounded-xl p-4 text-xs text-slate-500">
        Integración Google Maps próximamente
      </div>
    </div>
  );
}
