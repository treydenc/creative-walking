import { SIX_HATS } from '../constants/config';
import { HatType } from '../types';

/**
 * Gets the current hat and remaining time based on elapsed time
 * @param elapsedMinutes Minutes elapsed in the walk
 * @param totalMinutes Total minutes for the walk
 * @returns The current hat and remaining minutes in the current segment
 */
export function getCurrentHat(
  elapsedMinutes: number, 
  totalMinutes: number
): { hat: HatType, remainingMinutes: number } {
  if (!totalMinutes) {
    return { hat: SIX_HATS[0], remainingMinutes: 0 };
  }
  
  const segmentLength = totalMinutes / SIX_HATS.length;
  const currentSegment = Math.min(Math.floor(elapsedMinutes / segmentLength), SIX_HATS.length - 1);
  const remainingInSegment = segmentLength - (elapsedMinutes % segmentLength);
  
  return { 
    hat: SIX_HATS[currentSegment],
    remainingMinutes: remainingInSegment
  };
}