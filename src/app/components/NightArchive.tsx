import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Thought, ConstellationGroup } from '../types/inheritance';
import {
  THEME_COLORS, THEME_DESCRIPTIONS,
  CONSTELLATION_OF, starPosition,
} from '../types/inheritance';

interface Props { thoughts: Thought[]; onClose: () => void }

/* ── Deterministic background stars ── */
interface BgStar { x: number; y: number; r: number; op: number; twinkleDur: number; twinkleDelay: number }
function useBgStars(): BgStar[] {
  return useMemo(() => Array.from({ length: 380 }, (_, i) => {
    const h = Math.abs((i * 2654435761) | 0);
    return {
      x:           (h % 10000) / 100,
      y:           ((h >> 4) % 10000) / 100,
      r:           0.15 + (h % 14) / 12,
      op:          0.08 + (h % 38) / 120,
      twinkleDur:  2.5 + (h % 40) / 10,
      twinkleDelay:(h % 30) / 10,
    };
  }), []);
}

/* ── Thought star with layered glow ── */
function ThoughtStar({ thought, onClick, onHoverChange }: {
  thought: Thought & { cx: number; cy: number };
  onClick: () => void;
  onHoverChange: (e: React.MouseEvent | null, t: Thought | null) => void;
}) {
  const color  = THEME_COLORS[thought.theme];
  let h = 0;
  for (let i = 0; i < thought.id.length; i++) h = (h * 31 + thought.id.charCodeAt(i)) | 0;
  h = Math.abs(h);
  const twinkleDur   = 1.8 + (h % 30) / 10;
  const twinkleDelay = (h % 20) / 10;
  const starSize     = 5 + (h % 4);
  const glowSize1    = starSize * 5;
  const glowSize2    = starSize * 12;
  const isPublic     = thought.visibility === 'public';

  return (
    <motion.div
      className="absolute"
      style={{ left: `${thought.cx}%`, top: `${thought.cy}%`, transform: 'translate(-50%,-50%)', zIndex: 10, cursor: isPublic ? 'pointer' : 'default' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2.5, ease: 'easeOut', delay: (h % 12) / 10 }}
      onMouseEnter={e => onHoverChange(e, thought)}
      onMouseLeave={() => onHoverChange(null, null)}
      onClick={onClick}
    >
      <motion.div className="absolute rounded-full" style={{
        width: glowSize2, height: glowSize2, top: -glowSize2 / 2, left: -glowSize2 / 2,
        background: `radial-gradient(circle, ${color}18 0%, transparent 65%)`,
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: twinkleDur * 1.4, repeat: Infinity, ease: 'easeInOut', delay: twinkleDelay }} />

      <motion.div className="absolute rounded-full" style={{
        width: glowSize1, height: glowSize1, top: -glowSize1 / 2, left: -glowSize1 / 2,
        background: `radial-gradient(circle, ${color}45 0%, transparent 60%)`,
      }}
      animate={{ scale: [1, 1.25, 0.9, 1.1, 1], opacity: [0.7, 1, 0.5, 0.9, 0.7] }}
      transition={{ duration: twinkleDur, repeat: Infinity, ease: 'easeInOut', delay: twinkleDelay }} />

      <motion.div className="rounded-full" style={{
        width: starSize, height: starSize,
        background: `radial-gradient(circle at 35% 35%, #ffffff, ${color})`,
        boxShadow: `0 0 ${starSize * 1.5}px ${color}, 0 0 ${starSize * 3}px ${color}66`,
      }}
      animate={{ scale: [1, 1.3, 0.85, 1.15, 1], opacity: [0.8, 1, 0.65, 0.95, 0.8] }}
      transition={{ duration: twinkleDur, repeat: Infinity, ease: 'easeInOut', delay: twinkleDelay }} />
    </motion.div>
  );
}

/* ── Tooltip / reading state ── */
interface TooltipState { x: number; y: number; thought: Thought }
type Reading = { kind: 'none' } | { kind: 'public'; thought: Thought } | { kind: 'private' };

export default function NightArchive({ thoughts, onClose }: Props) {
  const bgStars = useBgStars();
  const [tooltip,    setTooltip]    = useState<TooltipState | null>(null);
  const [reading,    setReading]    = useState<Reading>({ kind: 'none' });
  const [dissolving, setDissolving] = useState(false);

  const stars = useMemo(() =>
    thoughts.map(t => ({ ...t, ...starPosition(t.id, t.theme) })),
    [thoughts],
  );

  const groupedStars = useMemo(() => {
    const groups: Partial<Record<ConstellationGroup, typeof stars>> = {};
    stars.forEach(s => {
      const g = CONSTELLATION_OF[s.theme];
      if (!groups[g]) groups[g] = [];
      groups[g]!.push(s);
    });
    return groups;
  }, [stars]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleStarClick = (t: Thought) => {
    setTooltip(null);
    if (t.visibility === 'private') setReading({ kind: 'private' });
    else setReading({ kind: 'public', thought: t });
  };

  const handleHoverChange = (e: React.MouseEvent | null, t: Thought | null) => {
    if (!e || !t) { setTooltip(null); return; }
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ x: r.left + r.width / 2, y: r.top - 8, thought: t });
  };

  const handleReturn = () => {
    setDissolving(true);
    setTimeout(() => { setReading({ kind: 'none' }); setDissolving(false); }, 1800);
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 2.2 }}
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0A0818 0%, #03030A 60%)', zIndex: 50 }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 180% 35% at 58% 38%, rgba(107,95,166,0.09) 0%, transparent 70%),
          radial-gradient(ellipse 90%  20% at 42% 42%, rgba(200,190,230,0.05) 0%, transparent 55%)
        `,
      }} />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        {Object.entries(groupedStars).map(([, gStars]) =>
          gStars && gStars.length >= 2 ? gStars.slice(0, -1).map((s, i) => {
            const next = gStars[i + 1];
            return (
              <line key={`${s.id}-line`}
                x1={`${s.cx}%`} y1={`${s.cy}%`}
                x2={`${next.cx}%`} y2={`${next.cy}%`}
                stroke={THEME_COLORS[s.theme]} strokeOpacity="0.06" strokeWidth="0.5" />
            );
          }) : null
        )}
        {bgStars.map((s, i) => (
          <g key={i}>
            <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r * 1.8} fill="white" opacity={s.op * 0.4}>
              <animate attributeName="opacity"
                values={`${s.op * 0.4};${s.op * 0.1};${s.op * 0.4}`}
                dur={`${s.twinkleDur * 2}s`} begin={`${s.twinkleDelay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
              <animate attributeName="opacity"
                values={`${s.op};${s.op * 0.25};${s.op}`}
                dur={`${s.twinkleDur}s`} begin={`${s.twinkleDelay}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      {thoughts.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center" style={{ padding: '0 48px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, color: '#F5EDD6', opacity: 0.3, letterSpacing: '0.06em', lineHeight: 1.7 }}>
            The universe is waiting<br />for its first thought.
          </p>
        </div>
      )}

      {stars.map(s => (
        <ThoughtStar key={s.id} thought={s} onClick={() => handleStarClick(s)} onHoverChange={handleHoverChange} />
      ))}

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed pointer-events-none"
            style={{
              left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)',
              background: 'rgba(6,4,18,0.95)',
              border: `1px solid ${THEME_COLORS[tooltip.thought.theme]}22`,
              borderRadius: 4, padding: '10px 16px', zIndex: 60,
              boxShadow: `0 0 20px ${THEME_COLORS[tooltip.thought.theme]}15`,
            }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", textAlign: 'center' }}>
              <div style={{ width: 24, height: 1, background: THEME_COLORS[tooltip.thought.theme], margin: '0 auto 8px', opacity: 0.7 }} />
              <div style={{ fontSize: 13, color: '#F5EDD6', letterSpacing: '0.08em', marginBottom: 4 }}>
                {tooltip.thought.anonymous ? 'Anonymous' : (tooltip.thought.name || 'Anonymous')}
              </div>
              <div style={{ fontSize: 11, color: '#F5EDD6', opacity: 0.4, letterSpacing: '0.12em', marginBottom: 3 }}>
                {fmt(tooltip.thought.createdAt)}
              </div>
              <div style={{ fontSize: 10, color: '#F5EDD6', opacity: 0.3, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 5 }}>
                {tooltip.thought.visibility === 'public' ? 'Shared with the Stars' : 'Private'}
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', color: THEME_COLORS[tooltip.thought.theme], opacity: 0.85 }}>
                {tooltip.thought.theme.charAt(0).toUpperCase() + tooltip.thought.theme.slice(1)}
              </div>
              <div style={{ width: 24, height: 1, background: THEME_COLORS[tooltip.thought.theme], margin: '8px auto 0', opacity: 0.7 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={onClose} style={{
        position: 'absolute', top: 32, right: 40, background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
        color: '#F5EDD6', opacity: 0.2, transition: 'opacity 0.4s', zIndex: 60,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.55'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.2'; }}>×</button>

      <AnimatePresence>
        {reading.kind === 'public' && reading.thought && (
          <motion.div key="read-public"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} style={{ zIndex: 70, background: 'rgba(3,3,10,0.85)' }}>
            <AnimatePresence mode="wait">
              {!dissolving ? (
                <motion.div key="leaf"
                  initial={{ scaleY: 0.05, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ scaleY: { duration: 1.4, ease: [0.2,0,0.4,1] }, opacity: { duration: 0.8 } }}
                  style={{
                    width: 540, maxWidth: '90vw',
                    background: 'linear-gradient(162deg, #F9F2DC 0%, #F5EDD6 40%, #EFE3C0 100%)',
                    borderRadius: '5px 3px 3px 5px', padding: '40px 48px 32px',
                    boxShadow: '0 12px 80px rgba(8,10,20,0.9), inset 0 0 0 1px rgba(139,111,78,0.12)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(139,111,78,0.06) 22px, rgba(139,111,78,0.06) 23px)',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: THEME_COLORS[reading.thought.theme], boxShadow: `0 0 6px ${THEME_COLORS[reading.thought.theme]}` }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.22em', color: THEME_COLORS[reading.thought.theme], textTransform: 'uppercase', opacity: 0.9 }}>
                      {reading.thought.theme}
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 11, color: '#8B6F4E', opacity: 0.45, marginLeft: 'auto' }}>
                      {reading.thought.anonymous ? 'Anonymous' : (reading.thought.name || 'Anonymous')} · {fmt(reading.thought.createdAt)}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(139,111,78,0.18)', marginBottom: 24, position: 'relative', zIndex: 1 }} />
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                    fontSize: 19, lineHeight: 1.85, color: '#2E200E', letterSpacing: '0.02em',
                    position: 'relative', zIndex: 1, whiteSpace: 'pre-wrap', minHeight: 80,
                  }}>{reading.thought.message}</div>
                  <div style={{ borderTop: '1px solid rgba(139,111,78,0.18)', margin: '24px 0 16px', position: 'relative', zIndex: 1 }} />
                  <div className="flex justify-center" style={{ position: 'relative', zIndex: 1 }}>
                    <button onClick={handleReturn} style={{
                      background: 'none', border: '1px solid rgba(139,111,78,0.3)', borderRadius: 20,
                      padding: '8px 28px', cursor: 'pointer',
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 11,
                      letterSpacing: '0.26em', color: '#8B6F4E', textTransform: 'uppercase', transition: 'opacity 0.4s',
                    }}>Return</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="dissolve" className="relative" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.8 }}
                  style={{ width: 540, maxWidth: '90vw', height: 260 }}>
                  {Array.from({ length: 32 }).map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full"
                      style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: '#F5EDD6', opacity: 0.5 }}
                      animate={{ x: (Math.random()-.5)*180, y: (Math.random()-.5)*180, opacity: 0, scale: Math.random()*2+.5 }}
                      transition={{ duration: 1.5 + Math.random()*.5, ease: 'easeOut' }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reading.kind === 'private' && (
          <motion.div key="read-private"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ zIndex: 70, background: 'rgba(3,3,10,0.7)' }}
            onClick={() => setReading({ kind: 'none' })}>
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 0.5, y: 0 }} transition={{ duration: 1.5 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#F5EDD6', letterSpacing: '0.08em', textAlign: 'center', maxWidth: 400, padding: '0 32px' }}>
              This thought was entrusted only to the universe.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none" style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 11,
        letterSpacing: '0.16em', color: '#F5EDD6', opacity: 0.15,
      }}>
        {thoughts.length} {thoughts.length === 1 ? 'thought' : 'thoughts'} released into the universe
      </div>
    </motion.div>
  );
}
