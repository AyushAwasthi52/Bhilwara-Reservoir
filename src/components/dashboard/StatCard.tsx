 import { LucideIcon } from 'lucide-react';
 import { motion } from 'framer-motion';
 
 interface StatCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   icon: LucideIcon;
   variant?: 'default' | 'critical' | 'warning' | 'success';
 }
 
 export const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'default' }: StatCardProps) => {
   const variantStyles = {
     default: 'from-sidebar-primary/20 to-water/10 border-sidebar-primary/30',
     critical: 'from-destructive/20 to-destructive/5 border-destructive/30',
     warning: 'from-warning/20 to-warning/5 border-warning/30',
     success: 'from-success/20 to-success/5 border-success/30',
   };
 
   const iconStyles = {
     default: 'text-sidebar-primary',
     critical: 'text-destructive',
     warning: 'text-warning',
     success: 'text-success',
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       whileHover={{ scale: 1.02 }}
       className={`
         stat-card bg-gradient-to-br ${variantStyles[variant]}
         cursor-default
       `}
     >
       <div className="flex items-start justify-between">
         <div className="flex-1">
           <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-1">
             {title}
           </p>
           <p className="text-2xl font-bold text-sidebar-foreground">
             {value}
           </p>
           {subtitle && (
             <p className="text-xs text-sidebar-foreground/50 mt-1">
               {subtitle}
             </p>
           )}
         </div>
         <div className={`p-2 rounded-lg bg-sidebar-accent/50 ${iconStyles[variant]}`}>
           <Icon className="w-5 h-5" />
         </div>
       </div>
     </motion.div>
   );
 };