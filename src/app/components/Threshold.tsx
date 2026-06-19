import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gate1Video from '../../imports/Gate_1-_closed.mp4';
import gate2Video from '../../imports/Gate_2-_Opening.mp4';
import stoneDoorsAudio from '../../imports/Stone_doors.mp3';
import * as Audio from '../utils/audio';

interface ThresholdProps {
  onEnter: () => void;
}

export default function Threshold({ onEnter }: ThresholdProps) {
  const [phase, setPhase] = useState<'gate1' | 'gate2' | 'white'>('gate1');
  const gate1Ref = useRef<HTMLVideoElement>(null);
  const gate2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const g2 = gate2Ref.current;
    if (g2) g2.load(); // preload gate2

    // Pause both videos on unmount to avoid AbortError
    return () => {
      gate1Ref.current?.pause();
      gate2Ref.current?.pause();
    };
  }, []);

  const handleEnterClick = () => {
    const g2 = gate2Ref.current;
    if (!g2) return;
    g2.currentTime = 0;
    g2.play().catch(e => { if (e.name !== 'AbortError') console.error(e); });
    setPhase('gate2');
    
    // Stone doors sound plays over the transition
    Audio.play(stoneDoorsAudio, { loop: false, volume: 0.75 });
  };

  const handleGate2Ended = () => {
    // No white screen — call onEnter immediately so the hall (preloaded
    // behind the threshold) fades in as a continuous movement.
    onEnter();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080A14]">

      {/* Gate 1 — always mounted, fades out on click */}
      <video
        ref={gate1Ref}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: phase === 'gate1' ? 1 : 0, pointerEvents: 'none' }}
      >
        <source src={gate1Video} type="video/mp4" />
      </video>

      {/* Gate 2 — always mounted, invisible until triggered */}
      <video
        ref={gate2Ref}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: phase === 'gate2' ? 1 : 0, pointerEvents: 'none' }}
        onEnded={handleGate2Ended}
      >
        <source src={gate2Video} type="video/mp4" />
      </video>

      {/* White flash after gate2 ends */}
      <AnimatePresence>
        {phase === 'white' && (
          <motion.div
            key="white"
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: '#080A14', opacity: 0.25 }}
      />

      {/* Main text */}
      <AnimatePresence>
        {phase === 'gate1' && (
          <motion.div
            key="tagline"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 right-0 text-center pointer-events-none"
            style={{
              top: '72%',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '26px',
              color: '#F5EDD6',
              opacity: 0.7,
              letterSpacing: '0.1em',
            }}
          >
            Some words are meant to outlive us.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enter button */}
      <AnimatePresence>
        {phase === 'gate1' && (
          <motion.div
            key="enter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeIn', delay: 4 }}
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
            style={{ top: '82%' }}
            onClick={handleEnterClick}
          >
            <motion.div
              className="relative px-12 py-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '11px',
                color: '#F5EDD6',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                opacity: 0.4,
                border: '1px solid rgba(245, 237, 214, 0.4)',
                borderRadius: '24px',
              }}
              whileHover={{
                opacity: 0.75,
                borderColor: 'rgba(232, 130, 26, 0.6)',
                boxShadow: '0 0 20px rgba(232, 130, 26, 0.2)',
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              ENTER
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}