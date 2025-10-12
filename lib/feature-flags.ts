import { FeatureFlag } from './types';

// Feature flags for all games
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  EMOJI_CHARADES: { key: 'EMOJI_CHARADES', enabled: true, rollout: 100 },
  FAST_MATH: { key: 'FAST_MATH', enabled: true, rollout: 100 },
  WORD_SNAP: { key: 'WORD_SNAP', enabled: true, rollout: 100 },
  COLOR_MATCH: { key: 'COLOR_MATCH', enabled: true, rollout: 100 },
  MEMORY_FLIP: { key: 'MEMORY_FLIP', enabled: true, rollout: 100 },
  PIXEL_ZOOM: { key: 'PIXEL_ZOOM', enabled: true, rollout: 100 },
  GEO_QUICK: { key: 'GEO_QUICK', enabled: true, rollout: 100 },
  REACTION_TEST: { key: 'REACTION_TEST', enabled: true, rollout: 100 },
  SOUND_BITE_GUESS: { key: 'SOUND_BITE_GUESS', enabled: true, rollout: 100 },
  FINISH_QUOTE: { key: 'FINISH_QUOTE', enabled: true, rollout: 100 },
  TAP_RACE: { key: 'TAP_RACE', enabled: true, rollout: 100 },
  EMOJI_BINGO: { key: 'EMOJI_BINGO', enabled: true, rollout: 100 },
  DAILY_RIDDLE: { key: 'DAILY_RIDDLE', enabled: true, rollout: 100 },
  MICRO_CROSSWORD: { key: 'MICRO_CROSSWORD', enabled: true, rollout: 100 },
  SCRAMBLE_CAPTION: { key: 'SCRAMBLE_CAPTION', enabled: true, rollout: 100 },
  STICKER_TOSS: { key: 'STICKER_TOSS', enabled: true, rollout: 100 },
  ONE_CLICK_TAG: { key: 'ONE_CLICK_TAG', enabled: true, rollout: 100 },
  POST_A_PIC: { key: 'POST_A_PIC', enabled: true, rollout: 100 },
  CAPTION_THIS: { key: 'CAPTION_THIS', enabled: true, rollout: 100 },
  QUICK_POLL_DUEL: { key: 'QUICK_POLL_DUEL', enabled: true, rollout: 100 },
  TWO_TRUTHS: { key: 'TWO_TRUTHS', enabled: true, rollout: 100 },
  TRIVIA_BLITZ: { key: 'TRIVIA_BLITZ', enabled: true, rollout: 100 },
  WOULD_YOU_RATHER: { key: 'WOULD_YOU_RATHER', enabled: true, rollout: 100 },
  RPS: { key: 'RPS', enabled: true, rollout: 100 },
  REACTION_STREAKS: { key: 'REACTION_STREAKS', enabled: true, rollout: 100 },
  EXTREME_ASCENSION: { key: 'EXTREME_ASCENSION', enabled: true, rollout: 100 }
};

export function isFeatureEnabled(flagKey: string, userId?: string): boolean {
  const flag = FEATURE_FLAGS[flagKey];
  if (!flag || !flag.enabled) return false;
  
  if (flag.rollout >= 100) return true;
  
  // Simple rollout logic based on user ID hash
  if (!userId) return Math.random() * 100 < flag.rollout;
  
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return Math.abs(hash) % 100 < flag.rollout;
}

export function getEnabledFlags(userId?: string): string[] {
  return Object.keys(FEATURE_FLAGS).filter(key => 
    isFeatureEnabled(key, userId)
  );
}