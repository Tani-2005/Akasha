import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Inheritance } from '../types/inheritance';

interface ReturningManuscriptProps {
  inheritance: Inheritance;
  onDismiss: () => void;
}

export default function ReturningManuscript({ inheritance, onDismiss }: ReturningManuscriptProps) {
  const [dissolving, setDissolving] = useState(false);

  const handleReturn = () => {
    setDissolving(true);
    setTimeout(onDismiss, 2200);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ zIndex: 50 }}
    >
      <AnimatePresence mode="wait">
        {!dissolving ? (
          <motion.div
            key="manuscript"
            initial={{ scaleY: 0.05, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.04 }}
            transition={{
              scaleY: { duration: 1.6, ease: [0.2, 0, 0.4, 1] },
              opacity: { duration: 0.8 },
            }}
            style={{
              width: 560,
              maxWidth: '90vw',
              background: 'linear-gradient(158deg, #F8F1DC 0%, #F5EDD6 45%, #EDE0BC 100%)',
              borderRadius: '6px 4px 4px 6px',
              padding: '48px 52px 40px',
              position: 'relative',
              boxShadow: '0 8px 60px rgba(8,10,20,0.8), inset 0 0 0 1px rgba(139,111,78,0.15)',
              overflow: 'hidden',
              transformOrigin: 'center center',
            }}
          >
            {/* Leaf grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(139,111,78,0.07) 23px, rgba(139,111,78,0.07) 24px)',
              }}
            />

            {/* Header */}
            <div style={{ marginBottom: 28, position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 10,
                letterSpacing: '0.26em',
                color: '#8B6F4E',
                opacity: 0.5,
                marginBottom: 6,
                textTransform: 'uppercase',
              }}>
                An inheritance has returned
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13,
                color: '#3B2A18',
                opacity: 0.5,
                letterSpacing: '0.06em',
              }}>
                {inheritance.anonymous ? 'Anonymous' : (inheritance.name || 'Anonymous')}
                <span style={{ opacity: 0.5, margin: '0 10px' }}>·</span>
                {formatDate(inheritance.createdAt)}
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(139,111,78,0.2)', marginBottom: 28 }} />

            {/* Message — read only */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 19,
                lineHeight: 1.8,
                color: '#3B2A18',
                letterSpacing: '0.03em',
                position: 'relative',
                zIndex: 1,
                whiteSpace: 'pre-wrap',
                minHeight: 120,
              }}
            >
              {inheritance.message}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(139,111,78,0.2)', margin: '28px 0 20px' }} />

            {/* Return to Silence */}
            <div className="flex justify-center" style={{ position: 'relative', zIndex: 1 }}>
              <button
                onClick={handleReturn}
                style={{
                  background: 'none',
                  border: '1px solid rgba(139,111,78,0.35)',
                  borderRadius: 20,
                  padding: '9px 32px',
                  cursor: 'pointer',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 11,
                  letterSpacing: '0.28em',
                  color: '#8B6F4E',
                  textTransform: 'uppercase',
                  transition: 'all 0.5s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '0.6';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                }}
              >
                Return to Silence
              </button>
            </div>
          </motion.div>
        ) : (
          /* Dissolve into particles */
          <motion.div
            key="dissolve"
            className="relative"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeIn' }}
            style={{ width: 560, maxWidth: '90vw', height: 300 }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: '#F5EDD6',
                  opacity: 0.6,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: 0,
                  scale: Math.random() * 2 + 0.5,
                }}
                transition={{ duration: 1.8 + Math.random() * 0.6, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
