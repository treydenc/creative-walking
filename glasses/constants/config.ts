import { HatType } from '../types';

// Define the Six Thinking Hats
export const SIX_HATS: HatType[] = [
  {
    name: "White Hat",
    color: "white",
    description: "Facts & Information"
  },
  {
    name: "Red Hat",
    color: "red",
    description: "Feelings & Emotions"
  },
  {
    name: "Black Hat",
    color: "black", 
    description: "Caution & Critique"
  },
  {
    name: "Yellow Hat",
    color: "yellow",
    description: "Benefits & Optimism"
  },
  {
    name: "Green Hat",
    color: "green",
    description: "Creativity & Possibilities"
  },
  {
    name: "Blue Hat",
    color: "blue",
    description: "Process & Reflection"
  }
];

// App configuration
export const APP_CONFIG = {
  packageName: 'com.medialab.walking',
  apiKey: process.env.AUGMENTOS_API_KEY!,
  port: 3000,
  apiPort: 3001
};

// Default prompt frequency in seconds
export const DEFAULT_PROMPT_FREQUENCY = 30;

// Default walk duration in minutes
export const DEFAULT_WALK_DURATION = 30;