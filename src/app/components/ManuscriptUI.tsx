import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Visibility } from '../types/inheritance';
import { analyzeEmotion } from '../utils/analyzeEmotion';

interface ManuscriptUIProps {
  onRelease: (data: {
    message: string;
    name?: string;
    anonymous: boolean;
    visibility: Visibility;
    theme: ReturnType<typeof analyzeEmotion>;
  }) => void;
  onEntrustStart?: () => void;
  onClose: () => void;
}

type SendPhase = 'idle' | 'rolling' | 'suspended' | 'rising' | 'shooting';

/* ── Stone toggle ── */
function StoneToggle({ value, onChange, labelA, labelB }: {
  value: boolean; onChange: (v: boolean) => void; labelA: string; labelB: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(false)} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontFamily: "'Cormorant Garamond', serif", fontSize: 12,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#3B2A18', opacity: !value ? 0.8 : 0.25, transition: 'opacity 0.4s',
      }}>{labelA}</button>
      <div onClick={() => onChange(!value)} style={{
        width: 30, height: 15, borderRadius: 8,
        border: '1px solid rgba(139,111,78,0.3)',
        background: value ? 'rgba(232,130,26,0.15)' : 'transparent',
        position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', width: 9, height: 9, borderRadius: '50%',
          background: value ? '#E8821A' : 'rgba(139,111,78,0.45)',
          top: 2, left: value ? 18 : 2, transition: 'all 0.3s',
        }} />
      </div>
      <button onClick={() => onChange(true)} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontFamily: "'Cormorant Garamond', serif", fontSize: 12,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#3B2A18', opacity: value ? 0.8 : 0.25, transition: 'opacity 0.4s',
      }}>{labelB}</button>
    </div>
  );
}

/* ── Main ── */
export default function ManuscriptUI({ onRelease, onEntrustStart, onClose }: ManuscriptUIProps) {
  const [message,   setMessage]   = useState('');
  const [name,      setName]      = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [sendPhase, setSendPhase] = useState<SendPhase>('idle');

  const handleRelease = () => {
    if (!message.trim() || sendPhase !== 'idle') return;

    // The universe quietly interprets the thought — user never sees this
    const theme = analyzeEmotion(message);

    onEntrustStart?.();
    setSendPhase('rolling');
    setTimeout(() => setSendPhase('suspended'), 300);
    setTimeout(() => setSendPhase('rising'),    1300);
    setTimeout(() => setSendPhase('shooting'),  1800);
    setTimeout(() => {
      onRelease({
        message: message.trim(),
        name: anonymous ? undefined : (name.trim() || undefined),
        anonymous,
        visibility: isPrivate ? 'private' : 'public',
        theme,
      });
    }, 2500);
  };

  const leafVariants = {
    idle:      { scaleY: 1,    y: 0,    opacity: 1, transition: { duration: 0 } },
    rolling:   { scaleY: 0.07, y: 0,    opacity: 1, transition: { duration: 0.3,  ease: [0.4,0,0.2,1] } },
    suspended: { scaleY: 0.07, y: 0,    opacity: 1, transition: { duration: 0 } },
    rising:    { scaleY: 0.07, y: -140, opacity: 1, transition: { duration: 0.5,  ease: [0.1,0,0.3,1] } },
    shooting:  { scaleY: 0.04, y: -1600,opacity: 0, transition: { duration: 0.7,  ease: [0.3,0,0.8,1] } },
  };

  const isSending = sendPhase !== 'idle';

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ zIndex: 40 }}
    >
      {!isSending && (
        <button onClick={onClose} className="absolute top-8 right-10" style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#F5EDD6',
          background: 'none', border: 'none', cursor: 'pointer', opacity: 0.2,
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.5'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.2'; }}>
          ×
        </button>
      )}

      {/* Amber glow during the suspended 1-second gathering */}
      <motion.div
        animate={sendPhase} variants={leafVariants} initial="idle"
        style={{
          transformOrigin: 'center bottom',
          width: 580, maxWidth: '92vw',
          filter: sendPhase === 'suspended'
            ? 'drop-shadow(0 0 32px rgba(232,130,26,0.5)) drop-shadow(0 0 10px rgba(245,237,214,0.25))'
            : 'none',
          transition: 'filter 0.5s ease',
        }}
      >
        {/* ── Palm leaf surface ── */}
        <div style={{
          background: 'linear-gradient(162deg, #F9F2DC 0%, #F5EDD6 40%, #EFE3C0 100%)',
          borderRadius: '5px 3px 3px 5px',
          padding: '40px 52px 36px',
          position: 'relative',
          boxShadow: '0 12px 80px rgba(8,10,20,0.75), inset 0 0 0 1px rgba(139,111,78,0.12)',
          overflow: 'hidden',
        }}>
          {/* Leaf grain lines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(139,111,78,0.06) 22px, rgba(139,111,78,0.06) 23px),
              linear-gradient(90deg, rgba(139,111,78,0.04) 0%, transparent 12%, transparent 88%, rgba(139,111,78,0.04) 100%)
            `,
          }} />

          {/* Identity + visibility row */}
          <div className="flex items-center justify-between mb-5" style={{ position: 'relative', zIndex: 1 }}>
            <StoneToggle value={anonymous} onChange={setAnonymous} labelA="Named" labelB="Anonymous" />
            <StoneToggle value={isPrivate} onChange={setIsPrivate} labelA="Shared" labelB="Private" />
          </div>

          {/* Name input */}
          <AnimatePresence>
            {!anonymous && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden', marginBottom: 12, position: 'relative', zIndex: 1 }}>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name, if you wish to leave it"
                  maxLength={60}
                  style={{
                    width: '100%', background: 'none', border: 'none', outline: 'none',
                    borderBottom: '1px solid rgba(139,111,78,0.18)',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 14,
                    color: '#3B2A18', letterSpacing: '0.06em', padding: '2px 0',
                    opacity: 0.65,
                  }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message — the only thing that matters */}
          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            disabled={isSending}
            placeholder="Let your thought find its place among the stars…"
            rows={9}
            style={{
              width: '100%', background: 'none', border: 'none', outline: 'none',
              resize: 'none', position: 'relative', zIndex: 1,
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 18, lineHeight: 1.9, color: '#2E200E', letterSpacing: '0.02em',
            }}
          />

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(139,111,78,0.15)', margin: '16px 0', position: 'relative', zIndex: 1 }} />

          {/* Private notice */}
          <AnimatePresence>
            {isPrivate && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 11,
                  color: '#3B2A18', letterSpacing: '0.1em', textAlign: 'center',
                  marginBottom: 12, position: 'relative', zIndex: 1,
                }}>
                This thought will exist in the universe, but only for you.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Release — appears once something is written */}
          <AnimatePresence>
            {message.trim() && !isSending && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="flex justify-center"
                style={{ position: 'relative', zIndex: 1 }}>
                <button
                  onClick={handleRelease}
                  style={{
                    background: 'none', border: '1px solid rgba(232,130,26,0.4)',
                    borderRadius: 20, padding: '10px 40px', cursor: 'pointer',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 11,
                    letterSpacing: '0.36em', color: '#E8821A', textTransform: 'uppercase',
                    transition: 'all 0.5s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,130,26,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 22px rgba(232,130,26,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'none';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}>
                  Release
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
