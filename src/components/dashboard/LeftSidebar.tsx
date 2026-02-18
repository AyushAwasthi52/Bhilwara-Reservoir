import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Waves, Droplets, Database, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { StatCard } from './StatCard';
import { WaterBody, WaterBodyType, loadWaterBodies } from '@/data/coordinates';

interface LeftSidebarProps {
  activeFilter: WaterBodyType | 'All';
  onFilterChange: (filter: WaterBodyType | 'All') => void;
}
 
export const LeftSidebar = ({ activeFilter, onFilterChange }: LeftSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>([]);

  // Load water bodies data dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always force reload to bypass cache
        const data = await loadWaterBodies(true);
        if (data.length > 0) {
          setWaterBodies(data);
        }
      } catch (error) {
        console.error('Error loading water bodies:', error);
      }
    };

    fetchData();

    // Poll for changes every 1 second
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const totalWaterBodies = waterBodies.length;
  const damsCount = waterBodies.filter(wb => wb.type === 'dam').length;
  const lakesCount = waterBodies.filter(wb => wb.type === 'lake').length;
  const pondsCount = waterBodies.filter(wb => wb.type === 'pond').length;
  const riversCount = waterBodies.filter(wb => wb.type === 'river').length;

  const filters: { label: string; value: WaterBodyType | 'All'; icon: typeof Waves }[] = [
    { label: 'All Water Bodies', value: 'All', icon: Database },
    { label: 'Dams', value: 'dam', icon: Waves },
    { label: 'Lakes', value: 'lake', icon: Droplets },
    { label: 'Ponds', value: 'pond', icon: Filter },
    { label: 'Rivers', value: 'river', icon: Droplets },
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
                    title="Total Water Bodies"
                    value={totalWaterBodies}
                    icon={Database}
                  />
                  <StatCard
                    title="Dams"
                    value={damsCount}
                    icon={Waves}
                  />
                  <StatCard
                    title="Lakes"
                    value={lakesCount}
                    icon={Droplets}
                    variant="success"
                  />
                  <StatCard
                    title="Ponds & Rivers"
                    value={pondsCount + riversCount}
                    subtitle={`${pondsCount} ponds, ${riversCount} rivers`}
                    icon={Filter}
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