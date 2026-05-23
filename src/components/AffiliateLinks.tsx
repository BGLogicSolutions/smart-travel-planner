import { ExternalLink, Hotel, Plane } from 'lucide-react';

interface Props {
  destination: string;
  bookingId?: string;
  skyscannerId?: string;
}

export function AffiliateLinks({ destination, bookingId, skyscannerId }: Props) {
  const bookingUrl = bookingId
    ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&aid=${bookingId}`
    : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`;
  const skyscannerUrl = skyscannerId
    ? `https://www.skyscanner.net/transport/flights/${encodeURIComponent(destination)}?ad=${skyscannerId}`
    : `https://www.skyscanner.net/transport/flights/${encodeURIComponent(destination)}`;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
      <h3 className="text-sm font-semibold text-white">Reserva con los mejores</h3>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Hotel className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-200">Hoteles en {destination}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400" />
      </a>
      <a
        href={skyscannerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-slate-200">Vuelos</span>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400" />
      </a>
    </div>
  );
}
