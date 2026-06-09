/**
 * Deterministic hash function for string input
 */
export function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function pickBySeed(items, seed, shift = 0) {
  return items[(seed >>> shift) % items.length];
}

const OPENERS = [
  "You carry a radiant, magnetic presence that",
  "To those around you, you are a grounding anchor who",
  "Your energy is like a warm cup of matcha on a rainy day, which",
  "You have a vibrant, electric aura that",
  "You possess a gentle, quiet strength that",
  "Your presence is a breath of fresh air that",
  "You are a spark of joy and spontaneous inspiration, who",
  "You have a soothing, harmonious frequency that",
  "Like a cozy fireplace in mid-winter, your essence",
  "You shine with a bright, sun-dappled optimism that",
  "You carry a deep, thoughtful mindfulness that",
  "Your vibe is a playful, creative dance that",
  "You are a natural catalyst of good energy who",
  "You have a sweet, serene calmness that",
  "Your spirit feels like a golden, peaceful sunset, which",
  "You possess an intuitive, guiding compass that",
  "You bring a cheerful, lighthearted sparkle that",
  "Your aura is a tapestry of cozy wisdom that",
  "You carry an infectious, spirited drive that",
  "You have a soft, healing kindness that"
];

const TRAITS = [
  "blends effortless empathy with a brilliant creative spark",
  "pairs deep wisdom with a lighthearted sense of play",
  "unites a comforting warmth with a fierce, quiet loyalty",
  "mixes bubbly enthusiasm with a genuine, caring heart",
  "combines a sharp, curious intellect with gentle patience",
  "radiates absolute authenticity and a love for simple joys",
  "brings a serene, mindful focus to every single interaction",
  "champions others with boundless support and positive vibes",
  "finds beauty in the details and spreads harmony wherever you go",
  "holds a magical ability to see the silver lining in everything",
  "bridges people together with understanding and sweet laughter",
  "approaches the world with open-minded wonder and steady courage",
  "weaves cozy comfort together with a brilliant, adventurous mind",
  "stands out through a graceful poise and a heart of pure gold",
  "channels pure flow and artistic inspiration into daily life"
];

const EFFECTS = [
  "leaving everyone you meet feeling instantly understood and valued.",
  "sparking laughter and turning ordinary moments into lasting memories.",
  "creating a safe, peaceful space where people can truly be themselves.",
  "inspiring those around you to dream a little bigger and smile a little wider.",
  "quietly calming the chaos and bringing a sense of order and peace.",
  "energizing the room and motivating others to follow their passions.",
  "making friends feel like family and strangers feel like old friends.",
  "shining a light on other people's strengths, helping them glow.",
  "bringing a beautiful, grounding clarity to complex situations.",
  "leaving a trail of inspiration, kindness, and cozy vibes behind you.",
  "helping others slow down, breathe, and appreciate the present moment.",
  "filling your surroundings with a warm, comforting sense of belonging.",
  "encouraging everyone to share their stories and express themselves.",
  "dissolving tension and replacing it with pure, lighthearted harmony.",
  "guiding friends toward their own inner light and joyful path."
];

const ARCHETYPES = [
  { title: "The Radiant Catalyst", emoji: "✨" },
  { title: "The Cozy Visionary", emoji: "🍵" },
  { title: "The Serene Spark", emoji: "🕯️" },
  { title: "The Zen Explorer", emoji: "🌊" },
  { title: "The Cosmic Anchor", emoji: "🌌" },
  { title: "The Joyful Alchemist", emoji: "🎨" },
  { title: "The Harmony Weaver", emoji: "🌸" },
  { title: "The Golden Optimist", emoji: "☀️" },
  { title: "The Gentle Pioneer", emoji: "🍃" },
  { title: "The Soulful Sage", emoji: "🪐" },
  { title: "The Dream Whisperer", emoji: "☁️" },
  { title: "The Bright Catalyst", emoji: "⚡" },
  { title: "The Mystic Guide", emoji: "🔮" },
  { title: "The Playful Muse", emoji: "🎈" },
  { title: "The Warm Haven", emoji: "🏡" }
];

const THEMES = [
  { id: "theme-violet-glow", name: "Violet Glow" },
  { id: "theme-cosmic-sage", name: "Cosmic Sage" },
  { id: "theme-sunset-aura", name: "Sunset Aura" },
  { id: "theme-sapphire-oasis", name: "Sapphire Oasis" },
  { id: "theme-emerald-harmony", name: "Emerald Harmony" },
  { id: "theme-amber-light", name: "Amber Light" }
];

const MASCOTS = [
  { text: "A glowing firefly", emoji: "🪰" },
  { text: "A freshly brewed matcha latte", emoji: "🍵" },
  { text: "A pocket-sized notebook full of dreams", emoji: "📔" },
  { text: "A vintage vinyl record spinning smoothly", emoji: "📻" },
  { text: "A sun-dappled leaf swaying in the breeze", emoji: "🍃" },
  { text: "A warm mug of spiced hot chocolate", emoji: "☕" },
  { text: "A shooting star in a clear night sky", emoji: "🌠" },
  { text: "A perfectly smooth river stone", emoji: "🪨" },
  { text: "A blooming sunflower turning to light", emoji: "🌻" },
  { text: "A soft, woolen blanket on a cold night", emoji: "🧶" },
  { text: "A tiny, thriving succulent on a desk", emoji: "🪴" },
  { text: "A warm, comforting candle flame", emoji: "🕯️" },
  { text: "A seashell holding the sound of the ocean", emoji: "🐚" },
  { text: "A kite flying high in a clear blue sky", emoji: "🪁" },
  { text: "A golden key unlocking creativity", emoji: "🔑" }
];

/**
 * Generates a full deterministic vibe configuration for a name.
 */
export function generateVibe(name) {
  if (!name || typeof name !== 'string') {
    return null;
  }
  
  const cleanName = name.trim();
  const lowerName = cleanName.toLowerCase();
  const seed = hashCode(lowerName);
  
  const opener = pickBySeed(OPENERS, seed);
  const trait = pickBySeed(TRAITS, seed, 2);
  const effect = pickBySeed(EFFECTS, seed, 4);
  const archetype = pickBySeed(ARCHETYPES, seed, 6);
  const theme = pickBySeed(THEMES, seed, 8);
  const mascot = pickBySeed(MASCOTS, seed, 10);
  
  // Deterministic stats between 82% and 99% for fun, glowing feedback
  const auraGlow = 82 + (seed % 18);
  const cozyFactor = 82 + ((seed >>> 1) % 18);
  const chillQuotient = 82 + ((seed >>> 2) % 18);
  const creativeSpark = 82 + ((seed >>> 3) % 18);
  
  return {
    name: cleanName,
    archetypeTitle: archetype.title,
    emoji: archetype.emoji,
    description: `${opener} ${trait}, ${effect}`,
    themeClass: theme.id,
    themeName: theme.name,
    mascotText: mascot.text,
    mascotEmoji: mascot.emoji,
    stats: {
      "Aura Glow": auraGlow,
      "Cozy Factor": cozyFactor,
      "Chill Quotient": chillQuotient,
      "Creative Spark": creativeSpark
    }
  };
}
