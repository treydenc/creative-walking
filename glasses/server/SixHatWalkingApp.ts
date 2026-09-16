import { TpaServer, TpaSession } from '@augmentos/sdk';
import { setupApiServer } from './api-server';
import { handleSession } from './session-handler';
import { ApiServerState } from '../types';
import { APP_CONFIG } from '../constants/config';

/**
 * Main application class for Six Hat Walking App
 */
export class SixHatWalkingApp extends TpaServer {
  /**
   * Construct the TPA server with a shared state object
   * @param config  TPA server config (port, etc.)
   * @param sharedState  A single shared ApiServerState that includes
   *                     currentWalkType, walkSettings, prompts, etc.
   */
  constructor(config: any, private sharedState: ApiServerState) {
    super(config);
    // Set up the Express API with the same shared state
    this.setupApiServer();
  }
  
  /**
   * Set up the API server with the shared state
   */
  private setupApiServer() {
    setupApiServer(
      { port: APP_CONFIG.apiPort },
      this.sharedState
    );
  }
  
  /**
   * Handle new TPA sessions
   */
  protected async onSession(
    session: TpaSession,
    sessionId: string,
    userId: string
  ): Promise<void> {
    // Pass the same sharedState object to the session handler
    const cleanupHandlers = await handleSession({
      session,
      sessionId,
      userId,
      state: this.sharedState,
    });
    
    // Register any cleanup handlers with the TPA framework
    cleanupHandlers.forEach(handler => this.addCleanupHandler(handler));
  }
}
