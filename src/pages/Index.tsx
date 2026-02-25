import { useState } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { MapView } from '@/components/dashboard/MapView';
import { WaterBodyPanel } from '@/components/dashboard/WaterBodyPanel';
import { WaterBody, WaterBodyType } from '@/data/coordinates';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<WaterBodyType | 'All'>('All');
  const [selectedWaterBody, setSelectedWaterBody] = useState<WaterBody | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleWaterBodyClick = (waterBody: WaterBody) => {
    setSelectedWaterBody(waterBody);
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
            onWaterBodyClick={handleWaterBodyClick} 
          />
        </main>
      </div>

      <WaterBodyPanel
        waterBody={selectedWaterBody}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default Index;
