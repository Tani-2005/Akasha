export type EmotionalTheme =
  // ☀ Warm Constellation
  | 'hope' | 'love' | 'gratitude' | 'joy'
  // 🌙 Moon Constellation
  | 'peace' | 'acceptance' | 'wisdom' | 'forgiveness'
  // ✨ Cosmic Constellation
  | 'wonder' | 'dreams' | 'creativity' | 'curiosity'
  // 🌌 Twilight Constellation
  | 'nostalgia' | 'longing' | 'melancholy'
  // 🌑 Deep Space Constellation
  | 'grief' | 'fear' | 'regret' | 'courage' | 'faith';

export type Visibility = 'public' | 'private';
export type ConstellationGroup = 'warm' | 'moon' | 'cosmic' | 'twilight' | 'deep-space';

export interface Thought {
  id: string;
  message: string;
  name?: string;
  anonymous: boolean;
  visibility: Visibility;
  createdAt: string;
  theme: EmotionalTheme;
  deliverAt?: string; // legacy
}
export type Inheritance = Thought;

// ── Colors ──────────────────────────────────────────────────────
export const THEME_COLORS: Record<EmotionalTheme, string> = {
  hope:        '#F6C65B',
  love:        '#F4A261',
  gratitude:   '#F8E6B5',
  joy:         '#F7DFA8',
  peace:       '#D9DEE8',
  acceptance:  '#E7E3D8',
  wisdom:      '#A89CC8',
  forgiveness: '#BFD7EA',
  wonder:      '#F5F4F2',
  dreams:      '#8F7CC3',
  creativity:  '#C084D4',
  curiosity:   '#A9D6D5',
  nostalgia:   '#C98E8A',
  longing:     '#9A7B91',
  melancholy:  '#4F5D95',
  grief:       '#28334F',
  fear:        '#6E737F',
  regret:      '#8A5A44',
  courage:     '#C77D4D',
  faith:       '#7FA8D8',
};

export const THEME_DESCRIPTIONS: Record<EmotionalTheme, string> = {
  hope:        'The first light before dawn.',
  love:        'Warmth, belonging and connection.',
  gratitude:   'Quiet appreciation.',
  joy:         'Gentle happiness.',
  peace:       'Stillness and calm.',
  acceptance:  'Letting the heart rest.',
  wisdom:      'Reflection and understanding.',
  forgiveness: 'Choosing release.',
  wonder:      'Curiosity without limits.',
  dreams:      'Possibility and imagination.',
  creativity:  'Ideas becoming light.',
  curiosity:   'The desire to explore.',
  nostalgia:   'Beautiful memories.',
  longing:     'Distance and hope.',
  melancholy:  'Quiet sadness.',
  grief:       'Love with nowhere to go.',
  fear:        'Uncertainty.',
  regret:      'Lessons carried forward.',
  courage:     'Moving forward despite fear.',
  faith:       'Trust in the unknown.',
};

// ── Constellations ───────────────────────────────────────────────
export const CONSTELLATIONS: {
  group: ConstellationGroup; label: string; emotions: EmotionalTheme[];
}[] = [
  { group: 'warm',       label: '☀  Warm',       emotions: ['hope','love','gratitude','joy'] },
  { group: 'moon',       label: '🌙  Moon',       emotions: ['peace','acceptance','wisdom','forgiveness'] },
  { group: 'cosmic',     label: '✦  Cosmic',     emotions: ['wonder','dreams','creativity','curiosity'] },
  { group: 'twilight',   label: '🌌  Twilight',   emotions: ['nostalgia','longing','melancholy'] },
  { group: 'deep-space', label: '◉  Deep Space', emotions: ['grief','fear','regret','courage','faith'] },
];

export const CONSTELLATION_OF: Record<EmotionalTheme, ConstellationGroup> =
  {} as Record<EmotionalTheme, ConstellationGroup>;
CONSTELLATIONS.forEach(c => c.emotions.forEach(e => { CONSTELLATION_OF[e] = c.group; }));

// Sky regions where each constellation clusters (% of viewport)
const REGIONS: Record<ConstellationGroup, { cx: number; cy: number; rx: number; ry: number }> = {
  'warm':       { cx: 58, cy: 20, rx: 22, ry: 13 },
  'moon':       { cx: 25, cy: 38, rx: 17, ry: 20 },
  'cosmic':     { cx: 74, cy: 33, rx: 17, ry: 17 },
  'twilight':   { cx: 38, cy: 63, rx: 18, ry: 13 },
  'deep-space': { cx: 68, cy: 70, rx: 14, ry: 11 },
};

/** Deterministic position within the correct constellation region. */
export function starPosition(id: string, theme: EmotionalTheme): { cx: number; cy: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  h = Math.abs(h);
  const reg   = REGIONS[CONSTELLATION_OF[theme]];
  const angle = ((h % 36000) / 100) * (Math.PI / 180);
  const r     = Math.sqrt((h % 10000) / 10000); // sqrt → uniform circle distribution
  return {
    cx: Math.max(3, Math.min(97, reg.cx + r * reg.rx * Math.cos(angle))),
    cy: Math.max(3, Math.min(90, reg.cy + r * reg.ry * Math.sin(angle))),
  };
}

const ALL_THEMES = Object.keys(THEME_COLORS) as EmotionalTheme[];
export const randomTheme = (): EmotionalTheme =>
  ALL_THEMES[Math.floor(Math.random() * ALL_THEMES.length)];
