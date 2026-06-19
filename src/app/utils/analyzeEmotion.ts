import type { EmotionalTheme } from '../types/inheritance';

/**
 * Quietly determines the dominant emotion in a piece of text.
 * The user never sees this process — the universe simply understands.
 */

// Each entry: [keyword/phrase, weight]
// Multi-word phrases score higher because they are more specific.
const SIGNALS: [string, EmotionalTheme, number][] = [
  // ── Hope ──────────────────────────────────────────────────────
  ['hope',          'hope', 2], ['hopeful',        'hope', 2],
  ['wish',          'hope', 1], ['better days',    'hope', 3],
  ['look forward',  'hope', 3], ['someday',        'hope', 2],
  ['brighter',      'hope', 2], ['believe in',     'hope', 3],
  ['new beginning', 'hope', 4], ['keep going',     'hope', 2],
  ['not give up',   'hope', 4], ['one day',        'hope', 2],
  ['it will be',    'hope', 2], ['things will',    'hope', 2],
  ['aspire',        'hope', 2], ['sunrise',        'hope', 1],
  ['change',        'hope', 1], ['possible',       'hope', 2],
  ['believe',       'hope', 1], ['potential',      'hope', 2],
  ['chance',        'hope', 1], ['beginning',      'hope', 2],

  // ── Love ──────────────────────────────────────────────────────
  ['love',          'love', 3], ['loved',          'love', 3],
  ['i love you',    'love', 5], ['my love',        'love', 4],
  ['heart',         'love', 2], ['cherish',        'love', 3],
  ['adore',         'love', 3], ['dear',           'love', 2],
  ['darling',       'love', 3], ['miss you',       'love', 3],
  ['together',      'love', 2], ['belong',         'love', 2],
  ['soulmate',      'love', 4], ['forever',        'love', 2],
  ['embrace',       'love', 2], ['warm',           'love', 1],
  ['care for',      'love', 3], ['devotion',       'love', 3],
  ['romance',       'love', 2], ['passion',        'love', 2],
  ['tender',        'love', 2], ['affection',      'love', 3],
  ['hold you',      'love', 4], ['need you',       'love', 3],

  // ── Gratitude ─────────────────────────────────────────────────
  ['grateful',      'gratitude', 3], ['gratitude',     'gratitude', 3],
  ['thank you',     'gratitude', 4], ['thankful',      'gratitude', 3],
  ['blessed',       'gratitude', 3], ['fortune',       'gratitude', 2],
  ['appreciate',    'gratitude', 3], ['gift',          'gratitude', 2],
  ['abundance',     'gratitude', 2], ['privilege',     'gratitude', 2],
  ['grace',         'gratitude', 2], ['generous',      'gratitude', 2],
  ['owe',           'gratitude', 1], ['thankfulness',  'gratitude', 3],
  ['bless',         'gratitude', 2], ['honor',         'gratitude', 1],
  ['so much',       'gratitude', 1],

  // ── Joy ───────────────────────────────────────────────────────
  ['joy',           'joy', 3], ['joyful',         'joy', 3],
  ['happy',         'joy', 3], ['happiness',      'joy', 3],
  ['laugh',         'joy', 2], ['smile',          'joy', 2],
  ['delight',       'joy', 2], ['celebrate',      'joy', 3],
  ['wonderful',     'joy', 2], ['amazing',        'joy', 1],
  ['bliss',         'joy', 3], ['gleeful',        'joy', 3],
  ['cheerful',      'joy', 3], ['merry',          'joy', 2],
  ['elated',        'joy', 3], ['thrilled',       'joy', 2],
  ['excited',       'joy', 2], ['glee',           'joy', 3],
  ['jubilant',      'joy', 3], ['ecstatic',       'joy', 3],
  ['overjoyed',     'joy', 4], ['playful',        'joy', 2],
  ['fun',           'joy', 1], ['fantastic',      'joy', 1],

  // ── Peace ─────────────────────────────────────────────────────
  ['peace',         'peace', 3], ['peaceful',       'peace', 3],
  ['calm',          'peace', 2], ['quiet',          'peace', 2],
  ['still',         'peace', 2], ['serene',         'peace', 3],
  ['tranquil',      'peace', 3], ['at rest',        'peace', 3],
  ['gentle',        'peace', 2], ['harmony',        'peace', 3],
  ['balance',       'peace', 2], ['silence',        'peace', 2],
  ['breathe',       'peace', 2], ['ease',           'peace', 2],
  ['let go',        'peace', 3], ['surrender',      'peace', 2],
  ['content',       'peace', 2], ['settled',        'peace', 2],
  ['at ease',       'peace', 3], ['unbothered',     'peace', 3],
  ['pure',          'peace', 1], ['clarity',        'peace', 1],

  // ── Acceptance ────────────────────────────────────────────────
  ['accept',        'acceptance', 3], ['acceptance',    'acceptance', 3],
  ['okay now',      'acceptance', 4], ['meant to be',   'acceptance', 4],
  ['move on',       'acceptance', 3], ['let it be',     'acceptance', 4],
  ['it is what it', 'acceptance', 4], ['at peace with', 'acceptance', 5],
  ['understand now','acceptance', 3], ['ready to',      'acceptance', 2],
  ['willing to',    'acceptance', 2], ['allowing',      'acceptance', 2],
  ['embrace',       'acceptance', 2], ['comes to pass', 'acceptance', 3],
  ['finally okay',  'acceptance', 4], ['making peace',  'acceptance', 4],
  ['no longer',     'acceptance', 2], ['enough',        'acceptance', 2],
  ['as it is',      'acceptance', 3],

  // ── Wisdom ────────────────────────────────────────────────────
  ['wisdom',        'wisdom', 3], ['wise',           'wisdom', 3],
  ['understand',    'wisdom', 2], ['truth',          'wisdom', 2],
  ['realize',       'wisdom', 2], ['discovered',     'wisdom', 2],
  ['insight',       'wisdom', 3], ['knowledge',      'wisdom', 2],
  ['reflect',       'wisdom', 2], ['lesson',         'wisdom', 3],
  ['experience',    'wisdom', 2], ['see now',        'wisdom', 3],
  ['clarity',       'wisdom', 2], ['perspective',    'wisdom', 3],
  ['meaning',       'wisdom', 2], ['depth',          'wisdom', 2],
  ['profound',      'wisdom', 3], ['contemplat',     'wisdom', 3],
  ['within',        'wisdom', 1], ['know now',       'wisdom', 3],

  // ── Wonder ────────────────────────────────────────────────────
  ['wonder',        'wonder', 3], ['awe',            'wonder', 3],
  ['infinite',      'wonder', 2], ['universe',       'wonder', 2],
  ['stars',         'wonder', 2], ['mystery',        'wonder', 2],
  ['vast',          'wonder', 2], ['cosmic',         'wonder', 2],
  ['breathtaking',  'wonder', 3], ['spectacular',    'wonder', 2],
  ['astonish',      'wonder', 3], ['overwhelm',      'wonder', 1],
  ['beyond',        'wonder', 2], ['how beautiful',  'wonder', 4],
  ['magnitude',     'wonder', 2], ['marvels',        'wonder', 3],
  ['extraordinary', 'wonder', 2], ['inexplicable',   'wonder', 3],
  ['cannot fathom', 'wonder', 4], ['words cannot',   'wonder', 3],
  ['humbled',       'wonder', 2],

  // ── Dreams ────────────────────────────────────────────────────
  ['dream',         'dreams', 3], ['dreaming',       'dreams', 3],
  ['imagine',       'dreams', 2], ['fantasy',        'dreams', 3],
  ['vision',        'dreams', 2], ['if i could',     'dreams', 3],
  ['aspire',        'dreams', 2], ['i picture',      'dreams', 3],
  ['what if',       'dreams', 2], ['one day i',      'dreams', 3],
  ['hope to',       'dreams', 2], ['wish i could',   'dreams', 4],
  ['manifest',      'dreams', 2], ['possible world', 'dreams', 3],
  ['ideal',         'dreams', 2], ['imagined',       'dreams', 2],
  ['build a',       'dreams', 2], ['create a world', 'dreams', 4],

  // ── Creativity ────────────────────────────────────────────────
  ['create',        'creativity', 2], ['art',           'creativity', 2],
  ['write',         'creativity', 2], ['paint',         'creativity', 2],
  ['music',         'creativity', 2], ['making',        'creativity', 2],
  ['design',        'creativity', 2], ['craft',         'creativity', 2],
  ['express',       'creativity', 2], ['inspire',       'creativity', 2],
  ['original',      'creativity', 2], ['unique',        'creativity', 2],
  ['imagination',   'creativity', 3], ['invent',        'creativity', 2],
  ['compose',       'creativity', 2], ['poetry',        'creativity', 3],
  ['poem',          'creativity', 3], ['story',         'creativity', 2],
  ['canvas',        'creativity', 3], ['sculpture',     'creativity', 3],
  ['artistic',      'creativity', 2], ['drawn',         'creativity', 2],

  // ── Curiosity ─────────────────────────────────────────────────
  ['curious',       'curiosity', 3], ['curiosity',     'curiosity', 3],
  ['question',      'curiosity', 2], ['explore',       'curiosity', 2],
  ['discover',      'curiosity', 2], ['seek',          'curiosity', 2],
  ['investigate',   'curiosity', 2], ['how does',      'curiosity', 3],
  ['why does',      'curiosity', 3], ['wonder how',    'curiosity', 3],
  ['want to know',  'curiosity', 3], ['find out',      'curiosity', 2],
  ['learning',      'curiosity', 2], ['fascinated',    'curiosity', 3],
  ['intriguing',    'curiosity', 3], ['study',         'curiosity', 2],
  ['obsessed with', 'curiosity', 3], ['cannot stop thinking', 'curiosity', 4],

  // ── Nostalgia ─────────────────────────────────────────────────
  ['remember',      'nostalgia', 2], ['memories',      'nostalgia', 3],
  ['miss those',    'nostalgia', 4], ['back then',     'nostalgia', 4],
  ['childhood',     'nostalgia', 3], ['long ago',      'nostalgia', 4],
  ['used to',       'nostalgia', 3], ['those days',    'nostalgia', 4],
  ['reminisce',     'nostalgia', 3], ['years ago',     'nostalgia', 3],
  ['when we were',  'nostalgia', 4], ['once upon',     'nostalgia', 3],
  ['time ago',      'nostalgia', 3], ['past',          'nostalgia', 2],
  ['simpler time',  'nostalgia', 4], ['i miss',        'nostalgia', 2],
  ['grown up',      'nostalgia', 2], ['like before',   'nostalgia', 3],
  ['faded',         'nostalgia', 2], ['what was',      'nostalgia', 2],

  // ── Longing ───────────────────────────────────────────────────
  ['long for',      'longing', 4], ['yearn',          'longing', 3],
  ['far away',      'longing', 3], ['distance',       'longing', 2],
  ['apart',         'longing', 2], ['without you',    'longing', 4],
  ['absence',       'longing', 3], ['ache for',       'longing', 4],
  ['waiting for',   'longing', 2], ['wish you were',  'longing', 5],
  ['want you back', 'longing', 5], ['cannot reach',   'longing', 3],
  ['so far',        'longing', 2], ['not here',       'longing', 3],
  ['if you were',   'longing', 4], ['separated',      'longing', 3],
  ['cannot be',     'longing', 2], ['unreachable',    'longing', 3],

  // ── Melancholy ────────────────────────────────────────────────
  ['melancholy',    'melancholy', 3], ['hollow',       'melancholy', 3],
  ['empty',         'melancholy', 2], ['numb',         'melancholy', 3],
  ['heavy',         'melancholy', 2], ['bittersweet',  'melancholy', 3],
  ['wistful',       'melancholy', 3], ['dull',         'melancholy', 2],
  ['grey',          'melancholy', 2], ['fading',       'melancholy', 2],
  ['drift',         'melancholy', 2], ['tired of',     'melancholy', 2],
  ['weary',         'melancholy', 3], ['downhearted',  'melancholy', 3],
  ['sad',           'melancholy', 2], ['sadness',      'melancholy', 2],
  ['gloomy',        'melancholy', 3], ['blue',         'melancholy', 1],
  ['sorrow',        'melancholy', 3], ['ache',         'melancholy', 2],

  // ── Grief ─────────────────────────────────────────────────────
  ['grief',         'grief', 4], ['grieve',          'grief', 4],
  ['loss',          'grief', 3], ['lost you',        'grief', 5],
  ['gone',          'grief', 2], ['never again',     'grief', 4],
  ['mourn',         'grief', 3], ['heartbreak',      'grief', 3],
  ['passed away',   'grief', 5], ['died',            'grief', 5],
  ['death',         'grief', 4], ['no longer here',  'grief', 5],
  ['broken inside', 'grief', 4], ['devastated',      'grief', 3],
  ['cannot breathe','grief', 4], ['shattered',       'grief', 3],
  ['losing',        'grief', 2], ['taken away',      'grief', 4],
  ['miss them',     'grief', 4],

  // ── Fear ──────────────────────────────────────────────────────
  ['afraid',        'fear', 3], ['fear',             'fear', 3],
  ['scared',        'fear', 3], ['terrified',        'fear', 4],
  ['anxious',       'fear', 3], ['anxiety',          'fear', 3],
  ['dread',         'fear', 3], ['uncertain',        'fear', 2],
  ['panic',         'fear', 3], ['nervous',          'fear', 2],
  ['overwhelmed',   'fear', 2], ['dark thoughts',   'fear', 4],
  ['what will',     'fear', 2], ['danger',           'fear', 3],
  ['threat',        'fear', 3], ['alone',            'fear', 2],
  ['paralyze',      'fear', 3], ['cannot face',     'fear', 3],
  ['too scared',    'fear', 4], ['terrifying',       'fear', 3],
  ['worry',         'fear', 2], ['trembling',        'fear', 3],

  // ── Regret ────────────────────────────────────────────────────
  ['regret',        'regret', 4], ['regretful',      'regret', 4],
  ['wish i had',    'regret', 5], ['should have',    'regret', 4],
  ['could have',    'regret', 4], ['mistake',        'regret', 3],
  ['if only',       'regret', 3], ['i was wrong',    'regret', 4],
  ['i didn\'t',     'regret', 3], ['missed chance',  'regret', 4],
  ['wasted',        'regret', 3], ['wish i could',   'regret', 3],
  ['took for granted','regret',4], ['never told',    'regret', 4],
  ['too late',      'regret', 4], ['i failed',       'regret', 3],
  ['disappointed in myself', 'regret', 4],

  // ── Courage ───────────────────────────────────────────────────
  ['courage',       'courage', 3], ['brave',          'courage', 3],
  ['despite',       'courage', 2], ['keep going',     'courage', 3],
  ['rise up',       'courage', 3], ['face my',        'courage', 3],
  ['stand up',      'courage', 3], ['persist',        'courage', 3],
  ['endure',        'courage', 2], ['overcome',       'courage', 3],
  ['stronger',      'courage', 2], ['fearless',       'courage', 3],
  ['daring',        'courage', 2], ['bold',           'courage', 2],
  ['even though',   'courage', 2], ['tried anyway',   'courage', 3],
  ['not give in',   'courage', 4], ['i can do',       'courage', 3],
  ['i will try',    'courage', 3], ['step forward',   'courage', 3],
  ['i did it',      'courage', 3], ['no matter what', 'courage', 3],

  // ── Faith ─────────────────────────────────────────────────────
  ['faith',         'faith', 3], ['trust',           'faith', 2],
  ['believe in',    'faith', 3], ['god',             'faith', 3],
  ['divine',        'faith', 3], ['meant to be',     'faith', 3],
  ['greater plan',  'faith', 4], ['guided',          'faith', 3],
  ['pray',          'pray', 3],  ['prayer',          'faith', 3],
  ['soul',          'faith', 2], ['spirit',          'faith', 2],
  ['sacred',        'faith', 3], ['purpose',         'faith', 2],
  ['destiny',       'faith', 3], ['universe will',   'faith', 3],
  ['higher power',  'faith', 4], ['surrendering to', 'faith', 3],
  ['trust the process', 'faith', 4], ['things happen for','faith', 3],
];

// Negation words that flip or dampen nearby emotion signals
const NEGATIONS = ['not ', 'no ', 'never ', 'without ', 'lack of ', 'isn\'t ', 'wasn\'t ', "don't ", "didn't ", "can't ", "won't "];

function isNegated(text: string, matchIndex: number): boolean {
  // Look back up to 20 characters for a negation
  const lookback = text.slice(Math.max(0, matchIndex - 22), matchIndex);
  return NEGATIONS.some(n => lookback.endsWith(n) || lookback.includes(n));
}

export function analyzeEmotion(text: string): EmotionalTheme {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [signal, emotion, weight] of SIGNALS) {
    const escaped = signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Word/phrase boundary matching
    const pattern = signal.includes(' ')
      ? escaped                      // phrase: exact match
      : `\\b${escaped}\\b`;          // word: boundary match
    const regex = new RegExp(pattern, 'g');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(lower)) !== null) {
      const boost = isNegated(lower, match.index) ? -weight * 0.5 : weight;
      scores[emotion] = (scores[emotion] ?? 0) + boost;
    }
  }

  // Remove zero or negative totals
  const candidates = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort(([, a], [, b]) => b - a);

  if (candidates.length === 0) {
    // Fallback: sense the general length & mood
    const words = lower.split(/\s+/).length;
    if (words < 10) return 'wonder';
    if (lower.includes('?')) return 'curiosity';
    return 'peace';
  }

  return candidates[0][0] as EmotionalTheme;
}
