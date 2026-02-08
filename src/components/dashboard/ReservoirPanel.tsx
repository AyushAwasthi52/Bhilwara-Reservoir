 import { X, MapPin, Ruler, Droplets, Waves, Calendar, Info } from 'lucide-react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Reservoir } from '@/data/reservoirs';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { WaterLevelChart } from './WaterLevelChart';
 
 interface ReservoirPanelProps {
   reservoir: Reservoir | null;
   isOpen: boolean;
   onClose: () => void;
 }
 
 export const ReservoirPanel = ({ reservoir, isOpen, onClose }: ReservoirPanelProps) => {
   if (!reservoir) return null;
 
   const statusVariants = {
     Normal: 'bg-success text-success-foreground',
     Low: 'bg-warning text-warning-foreground',
     Critical: 'bg-destructive text-destructive-foreground animate-pulse',
   };
 
   const typeIcons = {
     Dam: Waves,
     Lake: Droplets,
     'Check Dam': Ruler,
   };
 
   const TypeIcon = typeIcons[reservoir.type];
 
   return (
     <AnimatePresence>
       {isOpen && (
         <>
           {/* Backdrop */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
             onClick={onClose}
           />
 
           {/* Panel */}
           <motion.div
             initial={{ x: '100%', opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             exit={{ x: '100%', opacity: 0 }}
             transition={{ type: 'spring', damping: 25, stiffness: 200 }}
             className="fixed right-0 top-16 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
           >
             {/* Header */}
             <div className="panel-header-gradient text-white p-6">
               <div className="flex items-start justify-between">
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                     <Badge className={statusVariants[reservoir.status]}>
                       {reservoir.status}
                     </Badge>
                     <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                       {reservoir.type}
                     </Badge>
                   </div>
                   <h2 className="text-2xl font-bold">{reservoir.name}</h2>
                   <div className="flex items-center gap-1 mt-2 text-white/80 text-sm">
                     <MapPin className="w-4 h-4" />
                     <span>Bhilwara District, Rajasthan</span>
                   </div>
                 </div>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={onClose}
                   className="text-white/80 hover:text-white hover:bg-white/10 -mr-2 -mt-2"
                 >
                   <X className="w-5 h-5" />
                 </Button>
               </div>
             </div>
 
             {/* Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {/* Water Level Chart */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="flex justify-center"
               >
                 <WaterLevelChart 
                   percentage={reservoir.currentWaterLevel} 
                   status={reservoir.status}
                   size="lg"
                 />
               </motion.div>
 
               {/* Water Level Bar */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="space-y-2"
               >
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Current Water Level</span>
                   <span className="font-semibold">{reservoir.currentWaterLevel}%</span>
                 </div>
                 <div className="relative">
                   <Progress 
                     value={reservoir.currentWaterLevel} 
                     className="h-3"
                   />
                   {reservoir.status === 'Critical' && (
                     <div className="absolute inset-0 rounded-full animate-pulse bg-destructive/20" />
                   )}
                 </div>
                 <div className="flex justify-between text-xs text-muted-foreground">
                   <span>0%</span>
                   <span>50%</span>
                   <span>100%</span>
                 </div>
               </motion.div>
 
               {/* Stats Grid */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="grid grid-cols-2 gap-4"
               >
                 <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Ruler className="w-4 h-4" />
                     <span className="text-xs uppercase tracking-wide">Area</span>
                   </div>
                   <p className="text-xl font-bold">{reservoir.area} km²</p>
                 </div>
                 <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Waves className="w-4 h-4" />
                     <span className="text-xs uppercase tracking-wide">Capacity</span>
                   </div>
                   <p className="text-xl font-bold">{reservoir.storageCapacity} MCM</p>
                 </div>
                 <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Droplets className="w-4 h-4" />
                     <span className="text-xs uppercase tracking-wide">Avg Depth</span>
                   </div>
                   <p className="text-xl font-bold">{reservoir.averageDepth} m</p>
                 </div>
                 <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <TypeIcon className="w-4 h-4" />
                     <span className="text-xs uppercase tracking-wide">Type</span>
                   </div>
                   <p className="text-xl font-bold">{reservoir.type}</p>
                 </div>
               </motion.div>
 
               {/* Description */}
               {reservoir.description && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                   className="bg-accent/30 rounded-xl p-4 space-y-2"
                 >
                   <div className="flex items-center gap-2 text-foreground">
                     <Info className="w-4 h-4" />
                     <span className="font-semibold">About</span>
                   </div>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {reservoir.description}
                   </p>
                   {reservoir.yearBuilt && (
                     <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
                       <Calendar className="w-3 h-3" />
                       <span>Constructed in {reservoir.yearBuilt}</span>
                     </div>
                   )}
                 </motion.div>
               )}
 
               {/* Coordinates */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 font-mono"
               >
                 <MapPin className="w-3 h-3 inline mr-1" />
                 {Array.isArray(reservoir.coordinates) 
                   ? `${reservoir.coordinates[0].toFixed(4)}°N, ${reservoir.coordinates[1].toFixed(4)}°E`
                   : 'Coordinates available'
                 }
               </motion.div>
             </div>
           </motion.div>
         </>
       )}
     </AnimatePresence>
   );
 };