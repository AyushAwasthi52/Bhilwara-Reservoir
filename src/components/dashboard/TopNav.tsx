 import { Map, BarChart3, Settings, Droplets, Moon, Sun } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useState, useEffect } from 'react';
 
 export const TopNav = () => {
   const [isDark, setIsDark] = useState(false);
 
   useEffect(() => {
     const root = window.document.documentElement;
     if (isDark) {
       root.classList.add('dark');
     } else {
       root.classList.remove('dark');
     }
   }, [isDark]);
 
   return (
     <header className="h-16 bg-primary text-primary-foreground flex items-center justify-between px-6 shadow-lg z-50 relative">
       <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-xl bg-water flex items-center justify-center shadow-lg">
           <Droplets className="w-6 h-6 text-white" />
         </div>
         <div className="flex flex-col">
           <h1 className="text-lg font-bold tracking-tight">
             Bhilwara Water Resource GIS Dashboard
           </h1>
           <span className="text-xs text-primary-foreground/70">
             Rajasthan Water Resources Department
           </span>
         </div>
       </div>
 
       <nav className="flex items-center gap-2">
         <Button 
           variant="ghost" 
           size="sm" 
           className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
           <Map className="w-4 h-4 mr-2" />
           <span className="hidden sm:inline">Map</span>
         </Button>
         <Button 
           variant="ghost" 
           size="sm" 
           className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
           <BarChart3 className="w-4 h-4 mr-2" />
           <span className="hidden sm:inline">Analytics</span>
         </Button>
         <Button 
           variant="ghost" 
           size="sm" 
           className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
           <Settings className="w-4 h-4 mr-2" />
           <span className="hidden sm:inline">Settings</span>
         </Button>
         <div className="w-px h-6 bg-white/20 mx-2" />
         <Button
           variant="ghost"
           size="icon"
           onClick={() => setIsDark(!isDark)}
           className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
           {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
         </Button>
       </nav>
     </header>
   );
 };