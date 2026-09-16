import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { 
  WalkType,
  ApiServerConfig,
  ApiServerState,
} from '../types'; // <-- Use your shared ApiServerState interface here
import { SIX_HATS } from '../constants/config';
import { formatDuration } from '../services/timer-utils';
import { 
  generateSixHatPrompts, 
  generateInspirationPrompts 
} from '../services/prompt-generator';

/**
 * Sets up and starts the Express API server
 * @param config Configuration options for the API server
 * @param state  The shared state object for the API server (and TPA session)
 * @returns The Express server instance
 */
export function setupApiServer(
  config: ApiServerConfig, 
  state: ApiServerState
): express.Express {
  const apiServer = express();
  
  // Add logging middleware
  apiServer.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    next();
  });
  
  // Enable CORS for all routes
  apiServer.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
  // Make sure body parsing middleware is before your routes
  apiServer.use(bodyParser.json());
  
  // API endpoint to get the current walk settings and prompts
  apiServer.get('/api/walk-settings', (req, res) => {
    console.log(`GET request for walk settings`);
    res.json({ 
      settings: state.walkSettings,
      hats: SIX_HATS,
      hasPrompts: state.hasGeneratedPrompts
    });
  });
  
  // API endpoint to submit a problem and generate prompts
  apiServer.post('/api/walk-settings', async (req, res) => {
    console.log('POST request to /api/walk-settings with body:', req.body);
    const { problem, durationMinutes, promptFrequencySeconds } = req.body;
    
    if (!problem) {
      console.log('Missing problem in request');
      return res.status(400).json({ success: false, error: 'Missing problem' });
    }
    
    // Store walk settings
    state.walkSettings = {
      problem,
      durationMinutes: durationMinutes || 30,
      promptFrequencySeconds: promptFrequencySeconds || 30, // Default to 30 seconds
    };
    
    try {
      console.log('Generating six hat prompts...');
      const generatedPrompts = await generateSixHatPrompts(problem);
      state.hatPrompts = generatedPrompts;
      state.hasGeneratedPrompts = true;
      
      console.log('Prompts generated successfully for all hats');
      
      res.json({ 
        success: true, 
        hatPrompts: generatedPrompts,
        settings: state.walkSettings
      });
    } catch (error) {
      console.error('Error generating prompts:', error);
      res.status(500).json({ success: false, error: 'Failed to generate prompts' });
    }
  });
  
  // API endpoint to start a Six Hats walk
  apiServer.post('/api/start-walk', (req, res) => {
    if (!state.hasGeneratedPrompts) {
      return res.status(400).json({ success: false, error: 'No prompts generated yet' });
    }
    
    // Ensure the walk type is set to sixHat when starting this walk
    state.currentWalkType = 'sixHat';
    
    state.walkSettings.startTime = Date.now();
    console.log('Six Hats walk started at:', new Date(state.walkSettings.startTime).toISOString());
    console.log('Current walk type set to:', state.currentWalkType);
    
    res.json({ 
      success: true, 
      startTime: state.walkSettings.startTime
    });
  });
  
  // API endpoint to start an inspiration walk
  apiServer.post('/api/inspiration/start-walk', (req, res) => {
    if (!state.hasGeneratedInspirationPrompts) {
      return res.status(400).json({ success: false, error: 'No prompts generated yet' });
    }
    
    // Ensure the walk type is set to inspiration
    state.currentWalkType = 'inspiration';
    
    state.inspirationSettings.startTime = Date.now();
    console.log('Inspiration walk started at:', new Date(state.inspirationSettings.startTime).toISOString());
    console.log('Current walk type set to:', state.currentWalkType);
    
    res.json({ 
      success: true, 
      startTime: state.inspirationSettings.startTime
    });
  });

  // API endpoint to get the current inspiration walk settings and prompts
  apiServer.get('/api/inspiration/walk-settings', (req, res) => {
    console.log(`GET request for inspiration walk settings`);
    res.json({ 
      settings: state.inspirationSettings,
      hasPrompts: state.hasGeneratedInspirationPrompts,
      peoplePrompts: state.inspirationPrompts
    });
  });

  // API endpoint to submit a problem and generate inspiration prompts
  apiServer.post('/api/inspiration/walk-settings', async (req, res) => {
    console.log('POST request to /api/inspiration/walk-settings with body:', req.body);
    const { problem, durationMinutes, inspiredPeople, promptFrequencySeconds } = req.body;
    
    if (!problem) {
      console.log('Missing problem in request');
      return res.status(400).json({ success: false, error: 'Missing problem' });
    }
    
    if (!inspiredPeople || inspiredPeople.length !== 6) {
      console.log('Invalid inspiredPeople in request');
      return res.status(400).json({ success: false, error: 'Must provide exactly 6 inspirational people' });
    }
    
    // Store walk settings
    state.inspirationSettings = {
      problem,
      durationMinutes: durationMinutes || 30,
      inspiredPeople,
      promptFrequencySeconds: promptFrequencySeconds || 30,
    };
    
    try {
      console.log('Generating inspiration prompts...');
      const generatedPrompts = await generateInspirationPrompts(problem, inspiredPeople);
      state.inspirationPrompts = generatedPrompts;
      state.hasGeneratedInspirationPrompts = true;
      
      console.log('Prompts generated successfully for all people');
      
      res.json({ 
        success: true, 
        peoplePrompts: generatedPrompts,
        settings: state.inspirationSettings
      });
    } catch (error) {
      console.error('Error generating prompts:', error);
      res.status(500).json({ success: false, error: 'Failed to generate prompts' });
    }
  });

  // API endpoint to select walk type
  apiServer.post('/api/select-walk-type', (req: Request, res: Response) => {
    const { walkType } = req.body;
    console.log(`Before update: Current walk type is ${state.currentWalkType}`);
    state.currentWalkType = walkType;
    console.log(`After update: Current walk type is now ${state.currentWalkType}`);
    res.json({ success: true });
  });

  // Stop Six Thinking Hats walk
  apiServer.post('/api/stop-walk', (req, res) => {
    if (!state.walkSettings.startTime) {
      return res.status(400).json({ 
        success: false, 
        error: 'No Six Thinking Hats walk in progress' 
      });
    }
    
    const walkDuration = Date.now() - state.walkSettings.startTime;
    const formattedDuration = formatDuration(walkDuration);
    
    console.log(`Six Thinking Hats walk stopped after ${formattedDuration}`);
    
    // Reset walk
    state.walkSettings.startTime = undefined;
    if (state.currentWalkType === 'sixHat') {
      console.log('Resetting walk type from sixHat to null');
      state.currentWalkType = null;
    }
    
    res.json({ 
      success: true, 
      message: `Six Thinking Hats walk stopped after ${formattedDuration}`,
      duration: formattedDuration
    });
  });

  // Stop Inspiration walk
  apiServer.post('/api/inspiration/stop-walk', (req, res) => {
    console.log('Stop inspiration walk request received');
    
    if (!state.inspirationSettings.startTime) {
      console.log('No inspiration walk in progress');
      return res.status(400).json({ 
        success: false, 
        error: 'No Inspiration walk in progress' 
      });
    }
    
    const walkDuration = Date.now() - state.inspirationSettings.startTime;
    const formattedDuration = formatDuration(walkDuration);
    
    console.log(`Inspiration walk stopped after ${formattedDuration}`);
    
    // Reset walk
    state.inspirationSettings.startTime = undefined;
    if (state.currentWalkType === 'inspiration') {
      console.log('Resetting walk type from inspiration to null');
      state.currentWalkType = null;
    }
    
    res.json({ 
      success: true, 
      message: `Inspiration walk stopped after ${formattedDuration}`,
      duration: formattedDuration
    });
  });

  // Start listening
  apiServer.listen(config.port, () => {
    console.log(`API server running at http://localhost:${config.port}`);
    console.log(`CORS enabled for all origins during development`);
  });

  return apiServer;
}
