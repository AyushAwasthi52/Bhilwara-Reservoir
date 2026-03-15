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
    <header className="min-h-16 bg-primary text-primary-foreground flex items-center justify-between px-3 sm:px-6 shadow-lg z-50 relative">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-water flex items-center justify-center shadow-lg shrink-0">
          <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
         </div>
        <div className="flex min-w-0 flex-col">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight leading-tight truncate">
            Bhilwara Water Resource GIS Dashboard
          </h1>
          <span className="hidden sm:block text-xs text-primary-foreground/70 truncate">
             Rajasthan Water Resources Department
           </span>
         </div>
       </div>
 
      <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
         <Button 
           variant="ghost" 
           size="sm" 
          className="px-2 sm:px-3 text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
          <Map className="w-4 h-4 sm:mr-2" />
           <span className="hidden sm:inline">Map</span>
         </Button>
         <Button 
           variant="ghost" 
           size="sm" 
          className="hidden sm:inline-flex px-2 sm:px-3 text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
          <BarChart3 className="w-4 h-4 sm:mr-2" />
           <span className="hidden sm:inline">Analytics</span>
         </Button>
         <Button 
           variant="ghost" 
           size="sm" 
          className="hidden sm:inline-flex px-2 sm:px-3 text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
         >
          <Settings className="w-4 h-4 sm:mr-2" />
           <span className="hidden sm:inline">Settings</span>
         </Button>
        <div className="w-px h-6 bg-white/20 mx-1 sm:mx-2" />
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