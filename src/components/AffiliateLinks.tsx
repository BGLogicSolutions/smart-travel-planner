 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/AffiliateLinks.tsx b/src/components/AffiliateLinks.tsx
index da117e3856c0e7f8250556478a0d046c78533d0c..d0f2c2073015ff88e75df745d1973e460b21d098 100644
--- a/src/components/AffiliateLinks.tsx
+++ b/src/components/AffiliateLinks.tsx
@@ -1,46 +1,82 @@
+import { useMemo } from 'react';
 import { ExternalLink, Hotel, Plane } from 'lucide-react';
 
 interface Props {
   destination: string;
   bookingId?: string;
   skyscannerId?: string;
 }
 
+function toFlightSlug(destination: string) {
+  return destination
+    .trim()
+    .toLowerCase()
+    .normalize('NFD')
+    .replace(/[\u0300-\u036f]/g, '')
+    .replace(/[^a-z0-9]+/g, '-')
+    .replace(/^-+|-+$/g, '');
+}
+
 export function AffiliateLinks({ destination, bookingId, skyscannerId }: Props) {
-  const bookingUrl = bookingId
-    ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&aid=${bookingId}`
-    : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`;
-  const skyscannerUrl = skyscannerId
-    ? `https://www.skyscanner.net/transport/flights/${encodeURIComponent(destination)}?ad=${skyscannerId}`
-    : `https://www.skyscanner.net/transport/flights/${encodeURIComponent(destination)}`;
+  const cleanDestination = destination.trim();
+
+  const bookingUrl = useMemo(() => {
+    const url = new URL('https://www.booking.com/searchresults.html');
+    url.searchParams.set('ss', cleanDestination);
+    if (bookingId) url.searchParams.set('aid', bookingId);
+    url.searchParams.set('label', 'smart_travel_planner_widget');
+    url.searchParams.set('utm_source', 'smart-travel-planner');
+    url.searchParams.set('utm_medium', 'affiliate');
+    url.searchParams.set('utm_campaign', 'itinerary-results');
+    return url.toString();
+  }, [cleanDestination, bookingId]);
+
+  const skyscannerUrl = useMemo(() => {
+    const slug = toFlightSlug(cleanDestination);
+    const base = slug
+      ? `https://www.skyscanner.net/transport/flights/${slug}/`
+      : 'https://www.skyscanner.net/transport/flights/';
+    const url = new URL(base);
+    if (skyscannerId) url.searchParams.set('ad', skyscannerId);
+    url.searchParams.set('utm_source', 'smart-travel-planner');
+    url.searchParams.set('utm_medium', 'affiliate');
+    url.searchParams.set('utm_campaign', 'itinerary-results');
+    return url.toString();
+  }, [cleanDestination, skyscannerId]);
 
   return (
     <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
-      <h3 className="text-sm font-semibold text-white">Reserva con los mejores</h3>
+      <h3 className="text-sm font-semibold text-white">Ahorra tiempo y reserva al mejor precio</h3>
+      <p className="text-xs text-slate-300">Opciones filtradas para {cleanDestination} con partners verificados.</p>
+
       <a
         href={bookingUrl}
         target="_blank"
         rel="noopener noreferrer"
         className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
       >
         <div className="flex items-center gap-2">
           <Hotel className="w-4 h-4 text-blue-400" />
-          <span className="text-sm text-slate-200">Hoteles en {destination}</span>
+          <span className="text-sm text-slate-200">Hoteles en {cleanDestination}</span>
+        </div>
+        <div className="flex items-center gap-2">
+          <span className="text-[10px] text-emerald-300">Comisión activa</span>
+          <ExternalLink className="w-4 h-4 text-slate-400" />
         </div>
-        <ExternalLink className="w-4 h-4 text-slate-400" />
       </a>
+
       <a
         href={skyscannerUrl}
         target="_blank"
         rel="noopener noreferrer"
         className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
       >
         <div className="flex items-center gap-2">
           <Plane className="w-4 h-4 text-cyan-400" />
-          <span className="text-sm text-slate-200">Vuelos</span>
+          <span className="text-sm text-slate-200">Vuelos con tarifa inteligente</span>
         </div>
         <ExternalLink className="w-4 h-4 text-slate-400" />
       </a>
     </div>
   );
 }
 
EOF
)
