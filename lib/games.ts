import { Game } from './types';

export const GAMES: Game[] = [
  // 25 Micro-games
  {
    id: '1',
    slug: 'emoji-charades',
    name: 'Emoji Charades',
    flag: 'EMOJI_CHARADES',
    status: 'active',
    category: 'puzzle',
    difficulty: 'easy',
    description: 'Guess the phrase from emoji clues!',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '2',
    slug: 'fast-math',
    name: 'Fast Math',
    flag: 'FAST_MATH',
    status: 'active',
    category: 'brain',
    difficulty: 'medium',
    description: 'Quick mental math challenges',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '3',
    slug: 'word-snap',
    name: 'Word Snap',
    flag: 'WORD_SNAP',
    status: 'active',
    category: 'word',
    difficulty: 'easy',
    description: 'Find words as fast as you can!',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '4',
    slug: 'color-match',
    name: 'Color Match',
    flag: 'COLOR_MATCH',
    status: 'active',
    category: 'visual',
    difficulty: 'easy',
    description: 'Match colors before time runs out',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '5',
    slug: 'memory-flip',
    name: 'Memory Flip',
    flag: 'MEMORY_FLIP',
    status: 'active',
    category: 'memory',
    difficulty: 'medium',
    description: 'Classic memory card matching game',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '6',
    slug: 'pixel-zoom',
    name: 'Pixel Zoom',
    flag: 'PIXEL_ZOOM',
    status: 'active',
    category: 'visual',
    difficulty: 'hard',
    description: 'Guess the image from zoomed pixels',
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '7',
    slug: 'geo-quick',
    name: 'Geo Quick',
    flag: 'GEO_QUICK',
    status: 'active',
    category: 'knowledge',
    difficulty: 'medium',
    description: 'Quick geography challenges',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '8',
    slug: 'reaction-test',
    name: 'Reaction Test',
    flag: 'REACTION_TEST',
    status: 'active',
    category: 'reflex',
    difficulty: 'easy',
    description: 'Test your reaction speed',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '9',
    slug: 'sound-bite',
    name: 'Sound Bite Guess',
    flag: 'SOUND_BITE_GUESS',
    status: 'active',
    category: 'audio',
    difficulty: 'medium',
    description: 'Identify sounds and music clips',
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '10',
    slug: 'finish-quote',
    name: 'Finish the Quote',
    flag: 'FINISH_QUOTE',
    status: 'active',
    category: 'knowledge',
    difficulty: 'medium',
    description: 'Complete famous quotes',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '11',
    slug: 'tap-race',
    name: 'Tap Race',
    flag: 'TAP_RACE',
    status: 'active',
    category: 'reflex',
    difficulty: 'easy',
    description: 'Tap as fast as you can!',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '12',
    slug: 'emoji-bingo',
    name: 'Emoji Bingo',
    flag: 'EMOJI_BINGO',
    status: 'active',
    category: 'puzzle',
    difficulty: 'easy',
    description: 'Bingo with emoji patterns',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '13',
    slug: 'riddle',
    name: 'Daily Riddle',
    flag: 'DAILY_RIDDLE',
    status: 'active',
    category: 'puzzle',
    difficulty: 'hard',
    description: 'Solve challenging riddles',
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '14',
    slug: 'micro-crossword',
    name: 'Micro Crossword',
    flag: 'MICRO_CROSSWORD',
    status: 'active',
    category: 'word',
    difficulty: 'medium',
    description: 'Mini crossword puzzles',
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '15',
    slug: 'scramble-caption',
    name: 'Scramble Caption',
    flag: 'SCRAMBLE_CAPTION',
    status: 'active',
    category: 'word',
    difficulty: 'medium',
    description: 'Unscramble image captions',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '16',
    slug: 'sticker-toss',
    name: 'Sticker Toss',
    flag: 'STICKER_TOSS',
    status: 'active',
    category: 'arcade',
    difficulty: 'easy',
    description: 'Toss stickers to hit targets',
    isPremium: false,
    createdAt: new Date()
  },
  // Existing carryover games
  {
    id: '17',
    slug: 'one-click-tag',
    name: 'One Click Tag',
    flag: 'ONE_CLICK_TAG',
    status: 'active',
    category: 'social',
    difficulty: 'easy',
    description: 'Tag friends with one click',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '18',
    slug: 'post-a-pic',
    name: 'Post a Pic',
    flag: 'POST_A_PIC',
    status: 'active',
    category: 'social',
    difficulty: 'easy',
    description: 'Share and rate pictures',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '19',
    slug: 'caption-this',
    name: 'Caption This',
    flag: 'CAPTION_THIS',
    status: 'active',
    category: 'creative',
    difficulty: 'easy',
    description: 'Write funny captions',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '20',
    slug: 'quick-poll-duel',
    name: 'Quick Poll Duel',
    flag: 'QUICK_POLL_DUEL',
    status: 'active',
    category: 'social',
    difficulty: 'easy',
    description: 'Battle with quick polls',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '21',
    slug: 'two-truths',
    name: 'Two Truths',
    flag: 'TWO_TRUTHS',
    status: 'active',
    category: 'social',
    difficulty: 'medium',
    description: 'Two truths and a lie game',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '22',
    slug: 'trivia-blitz',
    name: 'Trivia Blitz',
    flag: 'TRIVIA_BLITZ',
    status: 'active',
    category: 'knowledge',
    difficulty: 'medium',
    description: 'Fast-paced trivia questions',
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '23',
    slug: 'would-you-rather',
    name: 'Would You Rather',
    flag: 'WOULD_YOU_RATHER',
    status: 'active',
    category: 'social',
    difficulty: 'easy',
    description: 'Choose between tough options',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '24',
    slug: 'rps',
    name: 'Rock Paper Scissors',
    flag: 'RPS',
    status: 'active',
    category: 'classic',
    difficulty: 'easy',
    description: 'Classic rock paper scissors',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '25',
    slug: 'reaction-streaks',
    name: 'Reaction Streaks',
    flag: 'REACTION_STREAKS',
    status: 'active',
    category: 'reflex',
    difficulty: 'hard',
    description: 'Build reaction streaks',
    isPremium: true,
    createdAt: new Date()
  }
];

export const EXTREME_GAME: Game = {
  id: 'extreme-1',
  slug: 'ascension',
  name: 'Ascension',
  flag: 'EXTREME_ASCENSION',
  status: 'active',
  category: 'extreme',
  difficulty: 'hard',
  description: 'Season-based extreme challenge game',
  isPremium: true,
  createdAt: new Date()
};

export function getGameBySlug(slug: string): Game | undefined {
  return [...GAMES, EXTREME_GAME].find(game => game.slug === slug);
}

export function getGamesByCategory(category: string): Game[] {
  return GAMES.filter(game => game.category === category);
}

export function getFreeGames(): Game[] {
  return GAMES.filter(game => !game.isPremium);
}

export function getPremiumGames(): Game[] {
  return GAMES.filter(game => game.isPremium);
}