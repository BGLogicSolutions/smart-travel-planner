import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  destination: string;
}

export function MapPlaceholder({ destination }: MapPlaceholderProps) {
  // Using an iframe with OpenStreetMap as a free, no-API-key alternative 
  // embedded search for visual realism, as requested "Simulado/Instrucciones de API".
  // In a real production app, you would replace this with the Google Maps Javascript API
  // and your API Key.
  
  const encodedDest = encodeURIComponent(destination);
  
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg h-64 md:h-80 relative">
      {/* 
        NOTA PARA EL DESARROLLADOR: 
        Para usar Google Maps, reemplaza este iframe con:
        <iframe
           width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen
           src={"https://www.google.com/maps/embed/v1/place?key=TU_API_KEY_AQUI&q=" + encodedDest}>
        </iframe>
      */}
      <iframe 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        src={`https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&marker=0,0`} // Very basic fallback. Better approach is generic search or just a stylized placeholder.
        className="absolute inset-0 z-0 opacity-50 grayscale mix-blend-overlay pointer-events-none"
      />
      
      {/* Stylized overlay that fits the "Frosted Glass" theme */}
      <div className="absolute inset-0 bg-indigo-900/40 z-10 flex flex-col items-center justify-center p-4 text-center">
         <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/50">
            <MapPin className="w-6 h-6 text-white" />
         </div>
         <h4 className="text-white font-bold text-lg mb-1">{destination}</h4>
         <p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold">Vista de Mapa (Simulada)</p>
         
         <div className="mt-4 px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg text-xs text-slate-300">
            Integración lista para Google Maps API
         </div>
      </div>
    </div>
  );
}
