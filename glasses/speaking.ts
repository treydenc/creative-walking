// src/index.ts
import { TpaServer, TpaSession, ViewType, StreamType } from '@augmentos/sdk';

class TranscriptionApp extends TpaServer {
  protected async onSession(session: TpaSession, sessionId: string, userId: string): Promise<void> {
    console.log(`New session started: ${sessionId} for user: ${userId}`);
    
    // Display a welcome message
    session.layouts.showTextWall("Transcription app started. Start speaking...", {
      durationMs: 3000, // Show for 3 seconds
    });
    
    // Variables to track state
    let transcriptionDisplayActive = false;
    let isLookingUp = false;
    
    // Function to display appropriate content
    const updateDisplay = () => {
      if (transcriptionDisplayActive) {
        // Don't override transcription display
        return;
      }
      
      // Show a default message or different content based on head position
      if (isLookingUp) {
        session.layouts.showReferenceCard(
          "Transcription App", 
          "Look down to see transcriptions", 
          { view: ViewType.DASHBOARD, durationMs: -1 }
        );
      } else {
        session.layouts.showTextWall("Waiting for speech...", { durationMs: -1 });
      }
    };
    
    // Initial display update
    updateDisplay();
    
    console.log("Setting up event handlers...");
    
    // Subscribe to transcription events
    session.subscribe(StreamType.TRANSCRIPTION);
    
    // Add event handlers
    const cleanup = [
      // Track head position
      session.events.onHeadPosition((data) => {
        console.log(`Head position event received: ${data.position}`);
        const wasLookingUp = isLookingUp;
        isLookingUp = data.position === 'up';
        
        // If head position changed and not showing transcription, update the display
        if (wasLookingUp !== isLookingUp && !transcriptionDisplayActive) {
          console.log(`Head position changed: ${isLookingUp ? "looking up" : "looking down"}`);
          updateDisplay();
        }
      }),
      
      // Transcription handler
      session.events.onTranscription((data) => {
        console.log(`Transcription received: "${data.text}" (isFinal: ${data.isFinal})`);
        
        // Only show substantive transcriptions (non-empty and either final or longer than 3 characters)
        if (data.text && (data.isFinal || data.text.length > 3)) {
          // Set flag to prevent other displays from showing
          transcriptionDisplayActive = true;
          
          // Show transcription in current view
          const view = isLookingUp ? ViewType.DASHBOARD : undefined;
          
          // Show transcription with different styling based on whether it's final
          session.layouts.showReferenceCard(
            data.isFinal ? "You said" : "Listening...", 
            data.text, 
            { view: view, durationMs: data.isFinal ? 5000 : -1 }
          );
          
          // For final transcriptions, set a timeout to return to normal display
          if (data.isFinal) {
            setTimeout(() => {
              transcriptionDisplayActive = false;
              updateDisplay();
            }, 5000);
          }
        }
      }),
      
      // Handle errors
      session.events.on('error', (error) => {
        console.error('Error:', error);
      })
    ];
    
    // Add cleanup handlers
    cleanup.forEach(handler => this.addCleanupHandler(handler));
    
    console.log("App setup complete. Waiting for events...");
  }
}

// Start the server
const app = new TranscriptionApp({
  packageName: 'com.medialab.walking',
  apiKey: process.env.AUGMENTOS_API_KEY!,
  port: 3000
  // Notice we're NOT setting augmentOSWebsocketUrl here - letting the SDK use its default
});

app.start().then(() => {
  console.log(`TranscriptionApp is running on port 3000`);
}).catch(console.error);