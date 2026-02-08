import { useState } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { MapView } from '@/components/dashboard/MapView';
import { ReservoirPanel } from '@/components/dashboard/ReservoirPanel';
import { Reservoir, ReservoirType } from '@/data/reservoirs';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<ReservoirType | 'All'>('All');
  const [selectedReservoir, setSelectedReservoir] = useState<Reservoir | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleReservoirClick = (reservoir: Reservoir) => {
    setSelectedReservoir(reservoir);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopNav />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <main className="flex-1 relative">
          <MapView 
            activeFilter={activeFilter} 
            onReservoirClick={handleReservoirClick} 
          />
        </main>
      </div>

      <ReservoirPanel
        reservoir={selectedReservoir}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default Index;
