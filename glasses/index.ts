// src/index.ts
import dotenv from 'dotenv';
import { SixHatWalkingApp } from './server/SixHatWalkingApp';
import { APP_CONFIG } from './constants/config';
import { ApiServerState, WalkType } from './types';

// Load environment variables
dotenv.config();

// 1) Create a single shared state object:
const sharedState: ApiServerState = {
  currentWalkType: null as WalkType,
  walkSettings: {
    problem: '',
    durationMinutes: 30,
    promptFrequencySeconds: 30,
    startTime: undefined,
  },
  inspirationSettings: {
    problem: '',
    durationMinutes: 30,
    promptFrequencySeconds: 30,
    inspiredPeople: ['', '', '', '', '', ''],
    startTime: undefined,
  },
  hatPrompts: {},
  inspirationPrompts: {},
  hasGeneratedPrompts: false,
  hasGeneratedInspirationPrompts: false,
};

// 2) Pass that shared object into your TPA server
const app = new SixHatWalkingApp({
  packageName: APP_CONFIG.packageName,
  apiKey: APP_CONFIG.apiKey,
  port: APP_CONFIG.port
}, sharedState);

app.start()
  .then(() => {
    console.log(`TPA server started on port ${APP_CONFIG.port}`);
  })
  .catch(error => {
    console.error('Failed to start TPA server:', error);
    process.exit(1);
  });
