/**
 * Deterministic hash function for string input.
 */
export function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const AGE_FLAVORS = ['playful', 'confident', 'grounded'];
const TIME_SHIFTS = ['fresh', 'social', 'deep'];

function pickBySeed(items, seed, shift = 0) {
  return items[(seed >>> shift) % items.length];
}

function hasEmoji(value) {
  return /[\u{1f300}-\u{1faff}\u{2600}-\u{27bf}]/u.test(value);
}

function getTimeShift(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'fresh';
  if (hour >= 12 && hour < 18) return 'social';
  return 'deep';
}

function inferAgeFlavor(name, signals = {}, seed = 0) {
  const clean = name.trim();
  const compact = clean.replace(/\s+/g, '');
  const lower = clean.toLowerCase();
  let playful = 0;
  let confident = 1;
  let grounded = 0;

  if (signals.hadEmoji || hasEmoji(clean)) playful += 2;
  if (signals.interactionMs && signals.interactionMs < 1800) playful += 1;
  if (signals.isMobile) playful += 1;
  if (compact.length <= 5) playful += 1;
  if (/(.)\1{2,}/.test(lower)) playful += 1;
  if (/ie$|y$|i$/.test(lower)) playful += 1;

  if (compact.length >= 9) grounded += 1;
  if (clean.includes(' ')) grounded += 1;
  if (/^(mary|john|michael|sarah|david|anna|maria|paul|elizabeth|james|robert|patricia)$/i.test(clean)) {
    grounded += 1;
  }

  confident += (seed >>> 5) % 2;

  const scores = [
    ['playful', playful],
    ['confident', confident],
    ['grounded', grounded]
  ].sort((a, b) => b[1] - a[1]);

  return scores[0][1] === scores[1]?.[1]
    ? AGE_FLAVORS[(seed >>> 9) % AGE_FLAVORS.length]
    : scores[0][0];
}

export function encodeVibeContext(context = {}) {
  const ageIndex = Math.max(0, AGE_FLAVORS.indexOf(context.ageFlavor));
  const timeIndex = Math.max(0, TIME_SHIFTS.indexOf(context.timeShift));
  return `${ageIndex}${timeIndex}`;
}

export function decodeVibeContext(token) {
  if (!token || token.length < 2) return {};

  const ageIndex = Number(token[0]);
  const timeIndex = Number(token[1]);

  return {
    ageFlavor: AGE_FLAVORS[ageIndex],
    timeShift: TIME_SHIFTS[timeIndex]
  };
}

export function createVibeContext(name, signals = {}) {
  const seed = hashCode(name.trim().toLowerCase());
  return {
    ageFlavor: inferAgeFlavor(name, signals, seed),
    timeShift: getTimeShift()
  };
}

const ARCHETYPES = [
  { title: 'The Radiant Spark', emoji: '✨' },
  { title: 'The Calm Magnet', emoji: '💜' },
  { title: 'The Bright Connector', emoji: '🌟' },
  { title: 'The Soft Power', emoji: '💫' },
  { title: 'The Joyful Signal', emoji: '😄' },
  { title: 'The Clear Mind', emoji: '🔮' },
  { title: 'The Warm Glow', emoji: '✨' },
  { title: 'The Steady Light', emoji: '🌟' },
  { title: 'The Creative Pulse', emoji: '💜' },
  { title: 'The Easy Energy', emoji: '😄' },
  { title: 'The Kind Force', emoji: '💫' },
  { title: 'The Honest Spark', emoji: '✨' }
];

const CORE_TRAITS = [
  'warmth with quiet confidence',
  'honesty with a bright creative edge',
  'calm presence with natural charm',
  'kindness with steady focus',
  'easy joy with emotional depth',
  'clear thinking with a generous heart',
  'playful energy with real intention',
  'soft confidence with strong intuition',
  'social ease with thoughtful awareness',
  'fresh perspective with grounded care'
];

const EMOTIONAL_ENERGIES = [
  'people feel comfortable opening up around you',
  'you make simple moments feel lighter',
  'others feel seen without needing to explain much',
  'your presence brings calm into busy moments',
  'people trust your energy faster than they expect',
  'you help the room feel more open and relaxed',
  'your vibe makes people feel included',
  'you turn quiet moments into something meaningful',
  'others feel encouraged by the way you show up',
  'your energy feels easy to remember'
];

const AGE_TONE = {
  playful: [
    'bright, expressive, and instantly easy to like',
    'fun without trying too hard',
    'light, bold, and full of good energy',
    'quick to lift the mood around you'
  ],
  confident: [
    'focused, warm, and naturally magnetic',
    'confident in a way that feels welcoming',
    'driven, balanced, and easy to respect',
    'clear about your energy without needing attention'
  ],
  grounded: [
    'steady, thoughtful, and quietly powerful',
    'calm in a way people remember',
    'reflective, warm, and emotionally clear',
    'grounded without losing your spark'
  ]
};

const TIME_TONE = {
  fresh: [
    'fresh and optimistic',
    'clear, uplifting, and ready for what is next',
    'focused with a gentle spark'
  ],
  social: [
    'balanced, confident, and social',
    'warmly present and easy to connect with',
    'active, open, and quietly magnetic'
  ],
  deep: [
    'soft, deep, and emotionally aware',
    'calm with a thoughtful kind of glow',
    'introspective, warm, and easy to trust'
  ]
};

const THEMES = [
  { id: 'theme-violet-glow', name: 'Violet Glow' },
  { id: 'theme-cosmic-sage', name: 'Cosmic Sage' },
  { id: 'theme-sunset-aura', name: 'Sunset Aura' },
  { id: 'theme-sapphire-oasis', name: 'Sapphire Oasis' },
  { id: 'theme-emerald-harmony', name: 'Emerald Harmony' },
  { id: 'theme-amber-light', name: 'Amber Light' }
];

const MASCOTS = [
  { text: 'A tiny glowing spark', emoji: '✨' },
  { text: 'A smooth purple charm', emoji: '💜' },
  { text: 'A bright little signal', emoji: '🌟' },
  { text: 'A soft golden glow', emoji: '💫' },
  { text: 'A calm lucky token', emoji: '🔮' },
  { text: 'A warm pocket of joy', emoji: '😄' },
  { text: 'A clear little light', emoji: '✨' },
  { text: 'A steady energy gem', emoji: '💜' }
];

const SHARE_HOOKS = [
  'I just got my VibeCheck 😄',
  'This VibeCheck result felt a little too accurate 👀',
  'My vibe result just dropped ✨',
  'I tried VibeCheck and this is what I got 😄'
];

function composeDescription(seed, ageFlavor, timeShift) {
  const coreTrait = pickBySeed(CORE_TRAITS, seed, 2);
  const emotionalEnergy = pickBySeed(EMOTIONAL_ENERGIES, seed, 4);
  const ageTone = pickBySeed(AGE_TONE[ageFlavor], seed, 6);
  const timeTone = pickBySeed(TIME_TONE[timeShift], seed, 8);

  return `You give off ${timeTone} energy that blends ${coreTrait}. You feel ${ageTone}, and ${emotionalEnergy}.`;
}

function buildShareText(vibe) {
  const hook = pickBySeed(SHARE_HOOKS, hashCode(vibe.name.toLowerCase()), 3);
  return `${hook}

${vibe.emoji} ${vibe.archetypeTitle}
"${vibe.description}"

What vibe do you get? 👀`;
}

/**
 * Generates a full deterministic vibe configuration for a name.
 */
export function generateVibe(name, options = {}) {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const cleanName = name.trim();
  if (!cleanName) return null;

  const lowerName = cleanName.toLowerCase();
  const seed = hashCode(lowerName);
  const decoded = decodeVibeContext(options.variant);
  const ageFlavor = options.ageFlavor || decoded.ageFlavor || inferAgeFlavor(cleanName, options.signals, seed);
  const timeShift = options.timeShift || decoded.timeShift || getTimeShift();

  const archetype = pickBySeed(ARCHETYPES, seed, 6);
  const theme = pickBySeed(THEMES, seed, 8);
  const mascot = pickBySeed(MASCOTS, seed, 10);

  const auraGlow = 82 + (seed % 18);
  const socialSpark = 82 + ((seed >>> 1) % 18);
  const calmEnergy = 82 + ((seed >>> 2) % 18);
  const creativeFlow = 82 + ((seed >>> 3) % 18);

  const vibe = {
    name: cleanName,
    archetypeTitle: archetype.title,
    emoji: archetype.emoji,
    description: composeDescription(seed, ageFlavor, timeShift),
    themeClass: theme.id,
    themeName: theme.name,
    mascotText: mascot.text,
    mascotEmoji: mascot.emoji,
    shareVariant: encodeVibeContext({ ageFlavor, timeShift }),
    stats: {
      'Aura Glow': auraGlow,
      'Social Spark': socialSpark,
      'Calm Energy': calmEnergy,
      'Creative Flow': creativeFlow
    }
  };

  return {
    ...vibe,
    shareText: buildShareText(vibe)
  };
}
