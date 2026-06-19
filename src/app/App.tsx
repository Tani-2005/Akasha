import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Threshold from './components/Threshold';
import Hall from './components/Hall';

export default function App() {
  const [scene,       setScene]       = useState<'threshold' | 'hall'>('threshold');
  const [hallEntered, setHallEntered] = useState(false);

  const handleEnter = () => {
    setScene('hall');
    // Threshold exit takes 1.2s → add 0.8s settle → icons appear at 2.0s
    setTimeout(() => setHallEntered(true), 2000);
  };

  return (
    <div className="size-full relative">
      {/* Hall always mounted — panorama texture loads while gates play */}
      <div className="absolute inset-0">
        <Hall entered={hallEntered} />
      </div>

      {/* Threshold overlays on top; fades out when Gate 2 ends */}
      <AnimatePresence>
        {scene === 'threshold' && (
          <motion.div
            key="threshold"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <Threshold onEnter={handleEnter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
