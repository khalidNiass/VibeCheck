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
const GENDER_FLAVORS = ['neutral', 'masculine', 'feminine'];

const NAME_PATTERN = /^[\p{L}][\p{L}\s'\u2019-]{0,18}[\p{L}]$/u;
const EMOJI_PATTERN = /[\u{1f300}-\u{1faff}\u{2600}-\u{27bf}]/u;

export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, value: '', message: 'Please enter your name first!' };
  }

  const cleanName = name.trim().replace(/\s+/g, ' ');
  const compact = cleanName.replace(/[\s'\u2019-]/g, '');

  if (!cleanName) {
    return { isValid: false, value: '', message: 'Please enter your name first!' };
  }

  if (cleanName.length < 2 || cleanName.length > 20) {
    return {
      isValid: false,
      value: cleanName,
      message: 'Use a real name between 2 and 20 characters.'
    };
  }

  if (!compact || !/\p{L}/u.test(compact) || EMOJI_PATTERN.test(cleanName)) {
    return {
      isValid: false,
      value: cleanName,
      message: 'Use letters only, with spaces, hyphens, or apostrophes if needed.'
    };
  }

  if (!NAME_PATTERN.test(cleanName)) {
    return {
      isValid: false,
      value: cleanName,
      message: 'Use letters only, with spaces, hyphens, or apostrophes if needed.'
    };
  }

  if (/([^\p{L}\s])\1{1,}/u.test(cleanName) || /(.)\1{4,}/u.test(compact.toLowerCase())) {
    return {
      isValid: false,
      value: cleanName,
      message: 'That name looks a little too spammy for a vibe check.'
    };
  }

  return { isValid: true, value: cleanName, message: '' };
}

function pickBySeed(items, seed, shift = 0) {
  return items[(seed >>> shift) % items.length];
}

function hasEmoji(value) {
  return EMOJI_PATTERN.test(value);
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
  const genderIndex = Math.max(0, GENDER_FLAVORS.indexOf(context.genderFlavor));
  return `${ageIndex}${timeIndex}${genderIndex}`;
}

export function decodeVibeContext(token) {
  if (!token || token.length < 2) return {};

  const ageIndex = Number(token[0]);
  const timeIndex = Number(token[1]);
  const genderIndex = Number(token[2]);

  return {
    ageFlavor: AGE_FLAVORS[ageIndex],
    timeShift: TIME_SHIFTS[timeIndex],
    genderFlavor: GENDER_FLAVORS[genderIndex]
  };
}

function inferGenderFlavor(name, seed = 0) {
  const clean = name.trim().toLowerCase();
  const firstName = clean.split(/\s+/)[0].replace(/[^a-z]/g, '');
  let masculine = 0;
  let feminine = 0;

  if (/^(alex|sam|taylor|jordan|casey|jamie|morgan|riley|avery|quinn|skyler|charlie|sage|river)$/.test(firstName)) {
    return 'neutral';
  }

  if (/^(john|michael|david|james|robert|paul|daniel|mark|peter|thomas|william|joseph|kevin|brian|george|henry|leo|liam|noah|lucas|mason|logan|ethan|oliver)$/.test(firstName)) {
    masculine += 3;
  }

  if (/^(mary|sarah|anna|maria|elizabeth|patricia|linda|jennifer|emily|emma|olivia|sophia|isabella|mia|amelia|ava|ella|grace|chloe|lily|zoe|nora)$/.test(firstName)) {
    feminine += 3;
  }

  if (/(a|ia|na|elle|ette|ine|lyn|ley|ie|y)$/.test(firstName)) feminine += 1;
  if (/(o|us|er|an|on|ck|rd|m)$/.test(firstName)) masculine += 1;

  if (Math.abs(feminine - masculine) < 2) {
    return (seed >>> 13) % 5 === 0 ? pickBySeed(['masculine', 'feminine'], seed, 15) : 'neutral';
  }

  return feminine > masculine ? 'feminine' : 'masculine';
}

export function createVibeContext(name, signals = {}) {
  const seed = hashCode(name.trim().toLowerCase());
  return {
    ageFlavor: inferAgeFlavor(name, signals, seed),
    timeShift: getTimeShift(),
    genderFlavor: inferGenderFlavor(name, seed)
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

const GENDER_TONE = {
  masculine: [
    'with a steady, direct kind of charm',
    'with grounded confidence that feels easy to trust',
    'with clear, upbeat energy that holds the room'
  ],
  feminine: [
    'with expressive warmth that makes people feel welcome',
    'with bright intuition and an easy social spark',
    'with graceful confidence that feels memorable'
  ],
  neutral: [
    'with balanced energy that adapts beautifully',
    'with open, easygoing charm that feels natural',
    'with a flexible spark that fits any room'
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
  'My VibeCheck result just dropped ✨',
  'I tried VibeCheck and this is what I got 😄'
];

function composeDescription(seed, ageFlavor, timeShift, genderFlavor) {
  const coreTrait = pickBySeed(CORE_TRAITS, seed, 2);
  const emotionalEnergy = pickBySeed(EMOTIONAL_ENERGIES, seed, 4);
  const ageTone = pickBySeed(AGE_TONE[ageFlavor], seed, 6);
  const timeTone = pickBySeed(TIME_TONE[timeShift], seed, 8);
  const genderTone = pickBySeed(GENDER_TONE[genderFlavor], seed, 10);

  return `You give off ${timeTone} energy that blends ${coreTrait}, ${genderTone}. You feel ${ageTone}, and ${emotionalEnergy}.`;
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

  const validation = validateName(name);
  if (!validation.isValid) return null;

  const cleanName = validation.value;
  const lowerName = cleanName.toLowerCase();
  const seed = hashCode(lowerName);
  const decoded = decodeVibeContext(options.variant);
  const ageFlavor = options.ageFlavor || decoded.ageFlavor || inferAgeFlavor(cleanName, options.signals, seed);
  const timeShift = options.timeShift || decoded.timeShift || getTimeShift();
  const genderFlavor = options.genderFlavor || decoded.genderFlavor || inferGenderFlavor(cleanName, seed);

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
    description: composeDescription(seed, ageFlavor, timeShift, genderFlavor),
    genderFlavor,
    themeClass: theme.id,
    themeName: theme.name,
    mascotText: mascot.text,
    mascotEmoji: mascot.emoji,
    shareVariant: encodeVibeContext({ ageFlavor, timeShift, genderFlavor }),
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
