// types/index.ts

import { TpaSession } from '@augmentos/sdk';

// Define the Six Thinking Hats
export interface HatType {
  name: string;
  color: string;
  description: string;
}

export interface WalkSettings {
  problem: string;
  durationMinutes: number;
  promptFrequencySeconds?: number;
  startTime?: number;
}

export interface InspirationSettings extends WalkSettings {
  inspiredPeople: string[];
}

export interface HatPrompts {
  [hatName: string]: string[];
}

export interface InspirationPrompts {
  [person: string]: string[];
}

export type WalkType = 'sixHat' | 'inspiration' | null;

export interface ApiServerConfig {
  port: number;
}

/**
 * A single "global" or "shared" state object that both
 * the Express API and the TPA session logic can read from / write to.
 */
export interface ApiServerState {
  currentWalkType: WalkType;
  walkSettings: WalkSettings;
  inspirationSettings: InspirationSettings;
  hatPrompts: HatPrompts;
  inspirationPrompts: InspirationPrompts;
  hasGeneratedPrompts: boolean;
  hasGeneratedInspirationPrompts: boolean;
}

/**
 * Session handler parameters:
 * We no longer need each field individually if we're passing the entire shared state.
 */
export interface SessionHandlerParams {
  session: TpaSession;
  sessionId: string;
  userId: string;
  state: ApiServerState; // <-- Now we just have one property that references the entire shared state
}
