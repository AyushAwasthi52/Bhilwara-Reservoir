 import { motion } from 'framer-motion';
 import { Info } from 'lucide-react';
 
 export const MapLegend = () => {
   const legendItems = [
     { color: 'bg-success', label: 'Normal (>60%)', pulse: false },
     { color: 'bg-warning', label: 'Low (30-60%)', pulse: false },
     { color: 'bg-destructive', label: 'Critical (<30%)', pulse: true },
   ];
 
   const typeItems = [
     { icon: '🏗️', label: 'Dam' },
     { icon: '💧', label: 'Lake' },
     { icon: '🔲', label: 'Check Dam' },
   ];
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.5 }}
       className="absolute bottom-6 left-6 z-30 glass-panel rounded-xl shadow-lg border border-border/50 p-4 max-w-xs"
     >
       <div className="flex items-center gap-2 mb-3 text-foreground">
         <Info className="w-4 h-4" />
         <span className="text-sm font-semibold">Map Legend</span>
       </div>
       
       <div className="space-y-3">
         <div>
           <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Water Status</p>
           <div className="space-y-1.5">
             {legendItems.map(({ color, label, pulse }) => (
               <div key={label} className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`} />
                 <span className="text-xs text-foreground">{label}</span>
               </div>
             ))}
           </div>
         </div>
 
         <div className="border-t border-border pt-3">
           <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Reservoir Types</p>
           <div className="flex gap-3">
             {typeItems.map(({ icon, label }) => (
               <div key={label} className="flex items-center gap-1">
                 <span className="text-sm">{icon}</span>
                 <span className="text-xs text-foreground">{label}</span>
               </div>
             ))}
           </div>
         </div>
       </div>
     </motion.div>
   );
 };