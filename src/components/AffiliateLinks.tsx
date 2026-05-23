import { Plane, Building, ExternalLink } from 'lucide-react';

interface AffiliateLinksProps {
  destination: string;
  bookingId: string;
  skyscannerId: string;
}

export function AffiliateLinks({ destination, bookingId, skyscannerId }: AffiliateLinksProps) {
  const encodedDest = encodeURIComponent(destination);
  
  const finalBookingId = bookingId || "TU_ID_AQUI";
  const finalSkyscannerId = skyscannerId || "TU_ID_AQUI";

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
      <h3 className="text-lg font-display font-bold text-white mb-4">Servicios Recomendados</h3>
      <p className="text-sm text-slate-400 mb-6">Completa tu reserva con nuestros socios de confianza.</p>

      <div className="space-y-4">
        {/* Hotel Affiliate Link */}
        <a 
          href={`https://www.booking.com/searchresults.es.html?ss=${encodedDest}&aid=${finalBookingId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl p-4 transition-all group"
        >
          <div className="bg-indigo-500 rounded-xl p-2.5 text-white shadow-lg shadow-indigo-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm group-hover:text-indigo-400 transition-colors">Hoteles en {destination}</h4>
            <p className="text-xs text-slate-400">Encuentra los mejores alojamientos (Booking) ↗</p>
          </div>
        </a>

        {/* Flight Affiliate Link */}
        <a 
          href={`https://www.skyscanner.net/transport/flights/es/es?destinationName=${encodedDest}&associateid=${finalSkyscannerId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-2xl p-4 transition-all group"
        >
          <div className="bg-cyan-500 rounded-xl p-2.5 text-white shadow-lg shadow-cyan-500/20">
            <Plane className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">Vuelos Baratos</h4>
            <p className="text-xs text-slate-400">Compara precios aéreos (Skyscanner) ↗</p>
          </div>
        </a>
      </div>
    </div>
  );
}
