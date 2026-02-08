 import { motion } from 'framer-motion';
 import { WaterStatus } from '@/data/reservoirs';
 
 interface WaterLevelChartProps {
   percentage: number;
   status: WaterStatus;
   size?: 'sm' | 'md' | 'lg';
 }
 
 export const WaterLevelChart = ({ percentage, status, size = 'md' }: WaterLevelChartProps) => {
   const sizes = {
     sm: { width: 80, height: 80, stroke: 6 },
     md: { width: 120, height: 120, stroke: 8 },
     lg: { width: 160, height: 160, stroke: 10 },
   };
 
   const { width, height, stroke } = sizes[size];
   const radius = (width - stroke) / 2;
   const circumference = 2 * Math.PI * radius;
   const offset = circumference - (percentage / 100) * circumference;
 
   const statusColors = {
     Normal: 'stroke-success',
     Low: 'stroke-warning',
     Critical: 'stroke-destructive',
   };
 
   const statusBg = {
     Normal: 'from-success/20 to-success/5',
     Low: 'from-warning/20 to-warning/5',
     Critical: 'from-destructive/20 to-destructive/5',
   };
 
   return (
     <div 
       className={`relative inline-flex items-center justify-center bg-gradient-to-br ${statusBg[status]} rounded-full p-2`}
       style={{ width: width + 16, height: height + 16 }}
     >
       <svg width={width} height={height} className="-rotate-90">
         {/* Background circle */}
         <circle
           cx={width / 2}
           cy={height / 2}
           r={radius}
           fill="none"
           stroke="currentColor"
           strokeWidth={stroke}
           className="text-muted/30"
         />
         {/* Progress circle */}
         <motion.circle
           cx={width / 2}
           cy={height / 2}
           r={radius}
           fill="none"
           strokeWidth={stroke}
           strokeLinecap="round"
           className={statusColors[status]}
           initial={{ strokeDashoffset: circumference }}
           animate={{ strokeDashoffset: offset }}
           transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
           style={{
             strokeDasharray: circumference,
           }}
         />
       </svg>
       <div className="absolute inset-0 flex flex-col items-center justify-center">
         <motion.span 
           className="text-2xl font-bold text-foreground"
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.5 }}
         >
           {percentage}%
         </motion.span>
         <span className="text-xs text-muted-foreground">Water Level</span>
       </div>
     </div>
   );
 };