import { TpaSession, ViewType, StreamType } from '@augmentos/sdk';
import fs from 'fs';
import path from 'path';
import { SessionHandlerParams } from '../types';
import { formatDuration } from '../services/timer-utils';
import { getCurrentHat } from '../models/hat-model';
import { getCurrentPerson } from '../models/walk-model';
import { DEFAULT_PROMPT_FREQUENCY } from '../constants/config';

/**
 * Handles TPA sessions for the Six Hat Walking App
 * @param params Parameters for the session handler
 * @returns Cleanup handlers
 */
export async function handleSession(params: SessionHandlerParams): Promise<(() => void)[]> {
  const { session, sessionId, userId, state } = params;

  console.log(`Session started for userId: ${userId}`);
  console.log(`Current walk type: ${state.currentWalkType || 'not selected'}`);

  // Timer variables
  const startTime = Date.now();
  let walkDuration = 0;
  let isLookingUp = false;

  // Transcription variables
  let transcriptionDisplayActive = false;

  // Current prompt index and check counter
  let currentHatIndex = 0;
  let currentPersonIndex = 0;
  let currentPromptIndex = 0;
  let promptCheckCounter = 0;
  let walkStarted = false;
  let previousSixHatStartTime: number | undefined = undefined;
  let previousInspirationStartTime: number | undefined = undefined;
  let walkStartNotificationShown = false;
  let walkStopNotificationShown = false;
  let messageIntervalId: NodeJS.Timeout | null = null;
  let timerIntervalId: NodeJS.Timeout | null = null;

    // We'll store final transcripts here
    const transcriptLines: string[] = [];

    // Example: Subscribe to transcriptions but do *not* display them to the user
    // We only store them in memory to write out later.
    const unsubTranscription = session.events.onTranscription((data) => {
      // If you only want final lines, check data.isFinal:
      if (data.isFinal && data.text.trim()) {
        // Collect the final line in memory
        transcriptLines.push(data.text);
        console.log(`Captured final transcription: "${data.text}"`);
      }
    });
  
    // We'll push unsubTranscription onto a cleanup array so we can unsubscribe
    // when the session ends
    const cleanupHandlers: (() => void)[] = [unsubTranscription];

  /**
   * Displays either a current prompt, a blank screen, or instructions,
   * depending on the walk state and whether the user is looking up or down.
   */
  const displayCurrentMessage = () => {
    // If we're showing a transcription notification, don't override it
    if (transcriptionDisplayActive) {
      return;
    }

    // Shorthand for references to the state
    const { currentWalkType, walkSettings, inspirationSettings } = state;

    // Check which set of prompts we're dealing with
    const hasActivePrompts =
      currentWalkType === 'sixHat'
        ? state.hasGeneratedPrompts
        : state.hasGeneratedInspirationPrompts;

    // Are we actually in the middle of a walk yet?
    const settings =
      currentWalkType === 'sixHat' ? walkSettings : inspirationSettings;

    // Check if the walk is started
    if (!walkStarted && settings.startTime) {
      walkStarted = true;
    }

    if (isLookingUp) {
      // Display timer and current perspective when looking up (dashboard view)
      const elapsedMinutes = walkDuration / 60000; // Convert ms to minutes

      if (!settings.startTime) {
        // Show welcome message with walk type if selected
        const walkTypeInfo = currentWalkType
          ? `\nWalk Type: ${
              currentWalkType === 'sixHat' ? 'Six Thinking Hats' : 'Inspiration Walk'
            }`
          : '\nNo walk type selected yet';

        session.layouts.showReferenceCard(
          'Walking Timer',
          `Duration: ${formatDuration(walkDuration)}${walkTypeInfo}\nVisit the website to start your walk`,
          { view: ViewType.DASHBOARD, durationMs: 8000 }
        );
      } else if (currentWalkType === 'sixHat') {
        // Six Hats display
        const { hat, remainingMinutes } = getCurrentHat(elapsedMinutes, settings.durationMinutes);
        session.layouts.showReferenceCard(
          `Six Hats Walk - ${formatDuration(walkDuration)}`,
          `Current: ${hat.name}\n${hat.description}\n${Math.ceil(
            remainingMinutes
          )} min until next hat`,
          { view: ViewType.DASHBOARD, durationMs: 8000 }
        );
      } else if (currentWalkType === 'inspiration') {
        // Inspiration walk display
        const { person, remainingMinutes } = getCurrentPerson(
          elapsedMinutes,
          settings.durationMinutes,
          inspirationSettings.inspiredPeople
        );
        session.layouts.showReferenceCard(
          `Inspiration Walk - ${formatDuration(walkDuration)}`,
          `Current: ${person}\n${Math.ceil(remainingMinutes)} min until next perspective`,
          { view: ViewType.DASHBOARD, durationMs: 8000 }
        );
      }
    } else if (hasActivePrompts && walkStarted) {
      // Display prompts based on walk type
      if (currentWalkType === 'sixHat') {
        // Get current hat and prompts
        const elapsedMinutes = walkDuration / 60000;
        const { hat } = getCurrentHat(elapsedMinutes, settings.durationMinutes);
        const currentHatPrompts = state.hatPrompts[hat.name] || [];

        // Check if we have prompts for this hat
        if (currentHatPrompts.length > 0) {
          // Check if this is a blank cycle (every other message)
          if (currentPromptIndex % 2 === 1) {
            // Blank screen
            session.layouts.showTextWall('', { durationMs: 8000 });
            console.log('Displayed: [blank screen]');
          } else {
            // Display current prompt
            const promptIndex =
              Math.floor(currentPromptIndex / 2) % currentHatPrompts.length;
            const promptToShow = currentHatPrompts[promptIndex];

            // Show the hat name and the prompt
            session.layouts.showReferenceCard(hat.name, promptToShow, {
              durationMs: 8000,
            });
            console.log(`Displayed ${hat.name} prompt ${promptIndex}: ${promptToShow}`);
          }
        } else {
          // No prompts for this hat
          session.layouts.showTextWall(
            `${hat.name}: No prompts available for this perspective`,
            { durationMs: 8000 }
          );
        }
      } else if (currentWalkType === 'inspiration') {
        // Get current person and prompts
        const elapsedMinutes = walkDuration / 60000;
        const { person } = getCurrentPerson(
          elapsedMinutes,
          settings.durationMinutes,
          inspirationSettings.inspiredPeople
        );
        const currentPersonPrompts = state.inspirationPrompts[person] || [];

        // Check if we have prompts for this person
        if (currentPersonPrompts.length > 0) {
          // Check if this is a blank cycle (every other message)
          if (currentPromptIndex % 2 === 1) {
            // Blank screen
            session.layouts.showTextWall('', { durationMs: 8000 });
            console.log('Displayed: [blank screen]');
          } else {
            // Display current prompt
            const promptIndex =
              Math.floor(currentPromptIndex / 2) % currentPersonPrompts.length;
            const promptToShow = currentPersonPrompts[promptIndex];

            session.layouts.showReferenceCard(person, promptToShow, {
              durationMs: 8000,
            });
            console.log(`Displayed ${person} prompt ${promptIndex}: ${promptToShow}`);
          }
        } else {
          // No prompts for this person
          session.layouts.showTextWall(
            `${person}: No prompts available for this perspective`,
            { durationMs: 8000 }
          );
        }
      }
    } else if (hasActivePrompts) {
      // Prompts generated but walk not started
      const walkTypeName =
        currentWalkType === 'sixHat' ? 'Six Thinking Hats' : 'Inspiration';
      session.layouts.showTextWall(
        `Visit the website to start your ${walkTypeName} walk`,
        { durationMs: 8000 }
      );
    } else {
      // Show instruction if no prompts have been generated yet
      const walkTypeInfo = currentWalkType
        ? `your ${
            currentWalkType === 'sixHat' ? 'Six Thinking Hats' : 'Inspiration'
          } walk`
        : 'a walk';

      session.layouts.showTextWall(
        `Visit the website to set up ${walkTypeInfo}`,
        { durationMs: 8000 }
      );
    }
  };

  /** Returns whichever startTime is active, or null. */
  const getActiveWalkStartTime = () => {
    if (state.currentWalkType === 'sixHat' && state.walkSettings.startTime) {
      return state.walkSettings.startTime;
    } else if (
      state.currentWalkType === 'inspiration' &&
      state.inspirationSettings.startTime
    ) {
      return state.inspirationSettings.startTime;
    }
    return null;
  };

  /** Determine the frequency (ms) at which we cycle prompts. */
  const getPromptFrequency = () => {
    let promptFrequency = DEFAULT_PROMPT_FREQUENCY; // Default in seconds
    if (
      state.currentWalkType === 'sixHat' &&
      state.walkSettings.promptFrequencySeconds
    ) {
      promptFrequency = state.walkSettings.promptFrequencySeconds;
    } else if (
      state.currentWalkType === 'inspiration' &&
      state.inspirationSettings.promptFrequencySeconds
    ) {
      promptFrequency = state.inspirationSettings.promptFrequencySeconds;
    }
    return promptFrequency * 1000; // convert to ms
  };

  // Show a welcome message with the web URL
  const nextjsUrl = process.env.NEXTJS_URL || 'http://localhost:3000';
  session.layouts.showReferenceCard(
    'Creativity Walks',
    `Visit: ${nextjsUrl} to set up your walk`,
    { durationMs: 10000 }
  );

  // Then show the first message after a short delay
  setTimeout(() => {
    displayCurrentMessage();
  }, 10000);

  // Interval: updates the timer and checks walk state each second
  timerIntervalId = setInterval(() => {
    const activeWalkStartTime = getActiveWalkStartTime();
  
    // Check if walk started from the frontend
    if (activeWalkStartTime && !walkStarted && !walkStartNotificationShown) {
      walkStarted = true;
      walkStartNotificationShown = true;
  
      const walkTypeName =
        state.currentWalkType === 'sixHat' ? 'Six Thinking Hats' : 'Inspiration';
  
      if (!transcriptionDisplayActive) {
        // Show the "Walk Started" reference card for 5 seconds
        session.layouts.showReferenceCard(
          'Walk Started',
          `Your ${walkTypeName} walk has started!\nDuration: ${
            state.walkSettings.durationMinutes || state.inspirationSettings.durationMinutes
          } minutes`,
          { durationMs: 5000 }
        );
  
        // AFTER 5 seconds, show the first prompt AND start cycling.
        setTimeout(() => {
          if (!transcriptionDisplayActive) {
            // (Optional) Reset prompt index so the first cycle definitely shows text.
            currentPromptIndex = 0;
            
            // Immediately show the first prompt
            displayCurrentMessage();
  
            // Wait another 2 seconds so the user can see the first prompt
            setTimeout(() => {
                // Now start your repeating prompt interval
                messageIntervalId = setInterval(() => {
                if (!isLookingUp && !transcriptionDisplayActive && walkStarted) {
                    console.log(`Before increment: currentPromptIndex = ${currentPromptIndex}`);
                    currentPromptIndex++;
                    console.log(`After increment: currentPromptIndex = ${currentPromptIndex}`);

                    displayCurrentMessage();
                } else if (!isLookingUp && !transcriptionDisplayActive) {
                    console.log('Displaying instructions (walk not started)');
                    displayCurrentMessage();
                } else {
                    console.log(
                    `Not cycling messages: isLookingUp=${isLookingUp}, ` +
                    `transcriptionDisplayActive=${transcriptionDisplayActive}, walkStarted=${walkStarted}`
                    );
                }
                }, getPromptFrequency()); // end of setInterval

            }, 2000); // <-- 2-second delay before starting the interval
          }
        }, 5000); // <-- 5-second delay for "Walk Started" message
      }
    }

    // Check for Six Hats stop
    if (
      previousSixHatStartTime &&
      !state.walkSettings.startTime &&
      !walkStopNotificationShown &&
      state.currentWalkType === null
    ) {
      walkStarted = false;
      walkStopNotificationShown = true;

      if (!transcriptionDisplayActive) {
        session.layouts.showReferenceCard(
          'Walk Stopped',
          'Your Six Thinking Hats walk has been stopped from the web app.',
          { durationMs: 8000 }
        );

        setTimeout(() => {
          walkStartNotificationShown = false;
          walkStopNotificationShown = false;
        }, 10000);
      }
    }

    // Check for Inspiration stop
    if (
      previousInspirationStartTime &&
      !state.inspirationSettings.startTime &&
      !walkStopNotificationShown &&
      state.currentWalkType === null
    ) {
      walkStarted = false;
      walkStopNotificationShown = true;

      if (!transcriptionDisplayActive) {
        session.layouts.showReferenceCard(
          'Walk Stopped',
          'Your Inspiration walk has been stopped from the web app.',
          { durationMs: 8000 }
        );

        setTimeout(() => {
          walkStartNotificationShown = false;
          walkStopNotificationShown = false;
        }, 10000);
      }
    }

    // Update the “previous start times” for next iteration
    previousSixHatStartTime = state.walkSettings.startTime;
    previousInspirationStartTime = state.inspirationSettings.startTime;

    // Update walk duration based on whichever walk is active
    if (activeWalkStartTime) {
      walkDuration = Date.now() - activeWalkStartTime;
      walkStarted = true;

      // Handle perspective changes
      if (state.currentWalkType === 'sixHat') {
        const elapsedMinutes = walkDuration / 60000;
        const newHatIndex = Math.min(
          Math.floor(elapsedMinutes / (state.walkSettings.durationMinutes / 6)),
          5
        );
        if (newHatIndex !== currentHatIndex) {
          currentHatIndex = newHatIndex;
          currentPromptIndex = 0;

          const { hat } = getCurrentHat(elapsedMinutes, state.walkSettings.durationMinutes);
          console.log(`Changing to ${hat.name} at ${formatDuration(walkDuration)}`);

          if (!isLookingUp && !transcriptionDisplayActive) {
            session.layouts.showReferenceCard(
              'Changing Perspective',
              `Now thinking with ${hat.name}: ${hat.description}`,
              { durationMs: 5000 }
            );
            setTimeout(() => {
              if (!isLookingUp && !transcriptionDisplayActive) {
                displayCurrentMessage();
              }
            }, 5000);
          }
        }
      } else if (state.currentWalkType === 'inspiration') {
        const elapsedMinutes = walkDuration / 60000;
        const newPersonIndex = Math.min(
          Math.floor(
            elapsedMinutes /
              (state.inspirationSettings.durationMinutes /
                state.inspirationSettings.inspiredPeople.length)
          ),
          state.inspirationSettings.inspiredPeople.length - 1
        );

        if (newPersonIndex !== currentPersonIndex) {
          currentPersonIndex = newPersonIndex;
          currentPromptIndex = 0;

          const { person } = getCurrentPerson(
            elapsedMinutes,
            state.inspirationSettings.durationMinutes,
            state.inspirationSettings.inspiredPeople
          );
          console.log(`Changing to ${person} at ${formatDuration(walkDuration)}`);

          if (!isLookingUp && !transcriptionDisplayActive) {
            session.layouts.showReferenceCard(
              'Changing Perspective',
              `Now thinking from ${person}'s perspective`,
              { durationMs: 5000 }
            );
            setTimeout(() => {
              if (!isLookingUp && !transcriptionDisplayActive) {
                displayCurrentMessage();
              }
            }, 5000);
          }
        }
      }
    } else {
      // No active walk start time => not in a real walk
      walkDuration = Date.now() - startTime;
      walkStarted = false;
    }

    // If looking up and not transcribing, update the timer display
    if (isLookingUp && !transcriptionDisplayActive) {
      displayCurrentMessage();
    }

    // Periodically log status
    if (promptCheckCounter % 30 === 0) {
      console.log(`Status check (attempt ${promptCheckCounter})`);
      console.log(`Current walk type: ${state.currentWalkType || 'not selected'}`);
      console.log(`Walk started: ${walkStarted}`);

      if (state.currentWalkType === 'sixHat') {
        console.log(`Has generated prompts: ${state.hasGeneratedPrompts}`);
        if (walkStarted) {
          const logElapsedMinutes = walkDuration / 60000;
          const logHatInfo = getCurrentHat(logElapsedMinutes, state.walkSettings.durationMinutes);
          console.log(
            `Current hat: ${logHatInfo.hat.name}, Remaining minutes: ${logHatInfo.remainingMinutes.toFixed(
              2
            )}`
          );
        }
      } else if (state.currentWalkType === 'inspiration') {
        console.log(`Has generated prompts: ${state.hasGeneratedInspirationPrompts}`);
        if (walkStarted) {
          const logElapsedMinutes = walkDuration / 60000;
          const logPersonInfo = getCurrentPerson(
            logElapsedMinutes,
            state.inspirationSettings.durationMinutes,
            state.inspirationSettings.inspiredPeople
          );
          console.log(
            `Current person: ${logPersonInfo.person}, Remaining minutes: ${logPersonInfo.remainingMinutes.toFixed(
              2
            )}`
          );
        }
      }
    }
    promptCheckCounter++;

    // Check if the walk has ended
    const checkWalkEnd = () => {
      if (
        state.currentWalkType === 'sixHat' &&
        state.walkSettings.startTime &&
        state.walkSettings.durationMinutes
      ) {
        if (walkDuration >= state.walkSettings.durationMinutes * 60000) {
          const walkElapsed = walkDuration;
          console.log(`Six Hats walk ended after ${formatDuration(walkElapsed)}`);
          state.walkSettings.startTime = undefined;
          walkStarted = false;

          if (!transcriptionDisplayActive) {
            session.layouts.showReferenceCard(
              'Walk Complete',
              `You've completed your Six Thinking Hats walk!\nDuration: ${formatDuration(walkElapsed)}`,
              { durationMs: 10000 }
            );
          }
          return true;
        }
      } else if (
        state.currentWalkType === 'inspiration' &&
        state.inspirationSettings.startTime &&
        state.inspirationSettings.durationMinutes
      ) {
        if (walkDuration >= state.inspirationSettings.durationMinutes * 60000) {
          const walkElapsed = walkDuration;
          console.log(`Inspiration walk ended after ${formatDuration(walkElapsed)}`);
          state.inspirationSettings.startTime = undefined;
          walkStarted = false;

          if (!transcriptionDisplayActive) {
            session.layouts.showReferenceCard(
              'Walk Complete',
              `You've completed your Inspiration walk!\nDuration: ${formatDuration(walkElapsed)}`,
              { durationMs: 10000 }
            );
          }
          return true;
        }
      }
      return false;
    };

    checkWalkEnd();
  }, 1000);

  // Subscribe to transcription
  session.subscribe(StreamType.TRANSCRIPTION);

  // Event handlers
  const cleanup = [
    // Track head position
    session.events.onHeadPosition((data) => {
      const wasLookingUp = isLookingUp;
      isLookingUp = data.position === 'up';

      // If head position changed and not showing transcription, update
      if (wasLookingUp !== isLookingUp && !transcriptionDisplayActive) {
        console.log(`Head position changed: ${isLookingUp ? 'looking up' : 'looking down'}`);
        displayCurrentMessage();
      }
    }),

    // Transcription handler
    session.events.onTranscription((data) => {
      console.log(`Transcription received: "${data.text}" (isFinal: ${data.isFinal})`);

      // Only show substantive transcriptions
      if (data.text && (data.isFinal || data.text.length > 3)) {
        transcriptionDisplayActive = true;
        const view = isLookingUp ? ViewType.DASHBOARD : undefined;

        session.layouts.showReferenceCard(
          data.isFinal ? 'You said' : 'Listening...',
          data.text,
          { view: view, durationMs: data.isFinal ? 5000 : 8000 }
        );

        if (data.isFinal) {
          setTimeout(() => {
            transcriptionDisplayActive = false;
            displayCurrentMessage();
          }, 5000);
        }
      }
    }),

    // Handle errors
    session.events.onError((error) => {
      console.error('Error:', error);
    }),
  ];

  // Interval cleanup
  const cleanupIntervals = () => {
    if (messageIntervalId) clearInterval(messageIntervalId);
    if (timerIntervalId) clearInterval(timerIntervalId);
    // 2) Write the transcript to a local file
    if (transcriptLines.length > 0) {
        const outPath = path.resolve(__dirname, `../transcript-${sessionId}.txt`);
        const fileContents = transcriptLines.join('\n');
        try {
          fs.writeFileSync(outPath, fileContents, 'utf8');
          console.log(`Saved transcript to ${outPath}`);
        } catch (err) {
          console.error('Error writing transcript file:', err);
        }
      } else {
        console.log('No transcript lines captured, skipping file write.');
      }
    };
  
    // Add the cleanupIntervals function to the array
    cleanupHandlers.push(cleanupIntervals);
  
    // Return all cleanup handlers so the TpaServer can call them when session ends
    return cleanupHandlers;
  }
