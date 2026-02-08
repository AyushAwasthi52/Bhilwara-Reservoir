 import { useState } from 'react';
 import { ChevronLeft, ChevronRight, Waves, Droplets, AlertTriangle, Database, Filter } from 'lucide-react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Button } from '@/components/ui/button';
 import { StatCard } from './StatCard';
 import { getStatistics, ReservoirType } from '@/data/reservoirs';
 
 interface LeftSidebarProps {
   activeFilter: ReservoirType | 'All';
   onFilterChange: (filter: ReservoirType | 'All') => void;
 }
 
 export const LeftSidebar = ({ activeFilter, onFilterChange }: LeftSidebarProps) => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const stats = getStatistics();
 
   const filters: { label: string; value: ReservoirType | 'All'; icon: typeof Waves }[] = [
     { label: 'All Reservoirs', value: 'All', icon: Database },
     { label: 'Dams', value: 'Dam', icon: Waves },
     { label: 'Lakes', value: 'Lake', icon: Droplets },
     { label: 'Check Dams', value: 'Check Dam', icon: Filter },
   ];
 
   return (
     <motion.aside
       initial={false}
       animate={{ width: isCollapsed ? 64 : 280 }}
       transition={{ duration: 0.3, ease: 'easeInOut' }}
       className="bg-sidebar border-r border-sidebar-border flex flex-col h-full relative z-40"
     >
       {/* Toggle Button */}
       <Button
         variant="ghost"
         size="icon"
         onClick={() => setIsCollapsed(!isCollapsed)}
         className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg hover:bg-sidebar-primary/90 z-50"
       >
         {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
       </Button>
 
       <div className="p-4 flex-1 overflow-hidden">
         <AnimatePresence mode="wait">
           {!isCollapsed && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="space-y-6"
             >
               {/* Filters Section */}
               <div>
                 <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-3 font-semibold">
                   Filter by Type
                 </h3>
                 <div className="space-y-2">
                   {filters.map(({ label, value, icon: Icon }) => (
                     <button
                       key={value}
                       onClick={() => onFilterChange(value)}
                       className={`
                         w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                         transition-all duration-200
                         ${activeFilter === value 
                           ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' 
                           : 'bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent/50'
                         }
                       `}
                     >
                       <Icon className="w-4 h-4" />
                       {label}
                     </button>
                   ))}
                 </div>
               </div>
 
               {/* Stats Section */}
               <div>
                 <h3 className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-3 font-semibold">
                   Quick Statistics
                 </h3>
                 <div className="space-y-3">
                   <StatCard
                     title="Total Reservoirs"
                     value={stats.totalReservoirs}
                     icon={Database}
                   />
                   <StatCard
                     title="Total Capacity"
                     value={`${stats.totalCapacity} MCM`}
                     subtitle="Million Cubic Meters"
                     icon={Waves}
                   />
                   <StatCard
                     title="Avg. Water Level"
                     value={`${stats.avgWaterLevel}%`}
                     icon={Droplets}
                     variant="success"
                   />
                   <StatCard
                     title="Critical Bodies"
                     value={stats.criticalCount}
                     subtitle={`${stats.lowCount} low, ${stats.normalCount} normal`}
                     icon={AlertTriangle}
                     variant={stats.criticalCount > 0 ? 'critical' : 'default'}
                   />
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
 
         {/* Collapsed State */}
         {isCollapsed && (
           <div className="flex flex-col items-center gap-4 pt-8">
             {filters.map(({ value, icon: Icon }) => (
               <button
                 key={value}
                 onClick={() => onFilterChange(value)}
                 className={`
                   p-2.5 rounded-lg transition-all duration-200
                   ${activeFilter === value 
                     ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                     : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                   }
                 `}
                 title={value}
               >
                 <Icon className="w-5 h-5" />
               </button>
             ))}
           </div>
         )}
       </div>
 
       {/* Footer */}
       <AnimatePresence>
         {!isCollapsed && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="p-4 border-t border-sidebar-border"
           >
             <p className="text-xs text-sidebar-foreground/40 text-center">
               Data updated: Feb 5, 2026
             </p>
           </motion.div>
         )}
       </AnimatePresence>
     </motion.aside>
   );
 };