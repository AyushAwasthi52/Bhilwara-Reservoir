import { X, MapPin, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaterBody } from '@/data/coordinates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WaterBodyPanelProps {
  waterBody: WaterBody | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WaterBodyPanel = ({ waterBody, isOpen, onClose }: WaterBodyPanelProps) => {
  if (!waterBody) return null;

  const typeColors = {
    dam: 'bg-blue-500 text-white',
    lake: 'bg-green-500 text-white',
    pond: 'bg-emerald-500 text-white',
    river: 'bg-cyan-500 text-white',
  };

  const typeLabel = waterBody.type.charAt(0).toUpperCase() + waterBody.type.slice(1);
  const typeColor = typeColors[waterBody.type] || typeColors.lake;

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
                    <Badge className={typeColor} variant="default">
                      {typeLabel}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold">{waterBody.name}</h2>
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
              {/* ID */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-muted/50 rounded-xl p-4 space-y-1"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs uppercase tracking-wide">ID</span>
                </div>
                <p className="text-lg font-bold font-mono">{waterBody.id}</p>
              </motion.div>

              {/* Coordinates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/50 rounded-xl p-4 space-y-1"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Coordinates</span>
                </div>
                <p className="text-lg font-bold font-mono">
                  {waterBody.latitude.toFixed(4)}°N, {waterBody.longitude.toFixed(4)}°E
                </p>
              </motion.div>

              {/* Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted/50 rounded-xl p-4 space-y-1"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs uppercase tracking-wide">Type</span>
                </div>
                <p className="text-xl font-bold capitalize">{waterBody.type}</p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-accent/30 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-foreground">
                  <Info className="w-4 h-4" />
                  <span className="font-semibold">Description</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {waterBody.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

