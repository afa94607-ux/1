import React from 'react';
import { AnimalArtwork } from './AnimalIllustrations';
import { DrawResult, ANIMALS_DATA } from '../types';
import { CountdownSyncSegment } from '../utils/countdownAudioSync';
import { BowlDrawArea } from './BowlDrawArea';

export interface Side2BowlArenaProps {
  countdown: number;
  isRevealing: boolean;
  revealStep: number;
  latestResult: DrawResult | null;
  drawMix?: number[];
  currentRoundId?: string;
  onBowlClick?: (index: number) => void;
  onTriggerDraw?: () => void;
  audioSyncSegment?: CountdownSyncSegment | null;
  isBettingClosed?: boolean;
  onTrigger10sCountdown?: () => void;
  onBlockedAttempt?: () => void;
}

/**
 * Calculates deterministic or authoritative reveal sequence numbers based on
 * currentRoundId and Firestore authoritative drawMix / result data.
 */
export function calculateRevealSequence(roundId: string, forcedNum?: number | null, drawMix?: number[]): number[] {
  if (drawMix && drawMix.length >= 12) {
    return drawMix;
  }
  // Deterministic seed based on round ID
  let seed = 0;
  for (let i = 0; i < roundId.length; i++) {
    seed = (seed * 31 + roundId.charCodeAt(i)) & 0xffffffff;
  }
  const pool = Array.from({ length: 12 }, (_, i) => i + 1);
  const mix: number[] = [];
  while (pool.length > 0) {
    seed = (seed * 9301 + 49297) % 233280;
    const index = Math.abs(seed) % pool.length;
    mix.push(pool.splice(index, 1)[0]);
  }
  if (forcedNum && forcedNum >= 1 && forcedNum <= 12) {
    mix[11] = forcedNum;
  }
  return mix;
}

export const Side2BowlArena: React.FC<Side2BowlArenaProps> = (props) => {
  return <BowlDrawArea {...props} />;
};

export default Side2BowlArena;
