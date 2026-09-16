import { HatType } from '../types';

/**
 * Gets the current inspiration person and remaining time based on elapsed time
 * @param elapsedMinutes Minutes elapsed in the walk
 * @param totalMinutes Total minutes for the walk
 * @param inspiredPeople Array of people for the inspiration walk
 * @returns The current person and remaining minutes in the current segment
 */
export function getCurrentPerson(
  elapsedMinutes: number, 
  totalMinutes: number,
  inspiredPeople: string[]
): { person: string, remainingMinutes: number } {
  if (!totalMinutes || inspiredPeople.length === 0) {
    return { person: inspiredPeople[0] || 'Person 1', remainingMinutes: 0 };
  }
  
  const segmentLength = totalMinutes / inspiredPeople.length;
  const currentSegment = Math.min(Math.floor(elapsedMinutes / segmentLength), inspiredPeople.length - 1);
  const remainingInSegment = segmentLength - (elapsedMinutes % segmentLength);
  
  return { 
    person: inspiredPeople[currentSegment],
    remainingMinutes: remainingInSegment
  };
}