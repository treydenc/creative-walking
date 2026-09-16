'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import TabNavigation from './components/TabNavigation';
import SetupTab from './components/SetupTab';
import HatsTab from './components/HatsTab';
import WalkTab from './components/WalkTab';
import { SIX_HATS } from './data/sixHatsData';

export default function SixHatsPage() {
  const router = useRouter();
  
  // State variables
  const [problem, setProblem] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [hatPrompts, setHatPrompts] = useState({});
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [walkStarted, setWalkStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [promptFrequency, setPromptFrequency] = useState(30);
  
  useEffect(() => {
    async function fetchSettings() {
      try {
        // Try to fetch settings from API, fallback gracefully if not available
        const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/walk-settings`;
        const res = await fetch(url).catch(() => ({ ok: false }));
        
        if (!res.ok) {
          console.warn('Walk settings API not available, using default values');
          return;
        }
        
        const data = await res.json();
        
        if (data.settings?.problem) {
          setProblem(data.settings.problem);
          setDurationMinutes(data.settings.durationMinutes || 30);
          
          if (data.settings.startTime) {
            setStartTime(data.settings.startTime);
            setWalkStarted(true);
            setActiveTab('walk');
          }
        }
        
        if (data.hasPrompts) {
          setActiveTab('hats');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }
    
    fetchSettings();
  }, []);
  
  // Update current time for timer
  useEffect(() => {
    if (walkStarted) {
      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [walkStarted]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!problem.trim()) {
      setStatus('Please describe your problem or challenge.');
      return;
    }
    
    if (!durationMinutes || durationMinutes < 6) {
      setStatus('Walk duration must be at least 6 minutes (1 minute per hat).');
      return;
    }

    if (!promptFrequency || promptFrequency < 30) {
      setStatus('Prompt frequency must be at least 30 seconds.');
      return;
    }
    
    setIsLoading(true);
    setStatus('');
    
    try {
      // Mock API call for development if API not available
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/walk-settings`;
      let result;
      
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problem: problem.trim(),
            durationMinutes: parseInt(durationMinutes),
            promptFrequencySeconds: parseInt(promptFrequency)
          }),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        result = await res.json();
      } catch (error) {
        console.warn('API call failed, using mock data', error);
        // Create mock hat prompts for development/testing
        const mockPrompts = {};
        SIX_HATS.forEach(hat => {
          mockPrompts[hat.name] = [
            `Consider ${problem} from a ${hat.description} perspective`,
            `What ${hat.description.toLowerCase()} aspects of ${problem} should you focus on?`,
            `Using the ${hat.name}, think about how ${problem} affects your goals`
          ];
        });
        
        result = {
          success: true,
          hatPrompts: mockPrompts
        };
      }
      
      if (result.success) {
        setStatus('Six Hat Thinking prompts generated! Go to Hats tab to view them.');
        setHatPrompts(result.hatPrompts);
        setActiveTab('hats');
      } else {
        setStatus(`Error: ${result.error || 'Failed to generate prompts'}`);
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
      setStatus('Error connecting to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle starting the walk
  const handleStartWalk = async () => {
    try {
      const startTimeValue = Date.now();
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/start-walk`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
          startTimeValue = data.startTime;
        }
      } catch (error) {
        console.warn('API call failed, using local time', error);
      }
      
      setStartTime(startTimeValue);
      setCurrentTime(Date.now());
      setWalkStarted(true);
      setActiveTab('walk');
    } catch (error) {
      console.error('Error starting walk:', error);
      setStatus('Error starting walk. Please try again.');
    }
  };
  
  // Calculate current hat and time remaining
  const calculateHatInfo = () => {
    if (!walkStarted || !startTime || !durationMinutes) return null;
    
    const elapsed = (currentTime - startTime) / 60000; // in minutes
    const segmentLength = durationMinutes / 6;
    const currentSegment = Math.min(Math.floor(elapsed / segmentLength), 5);
    const remainingInSegment = segmentLength - (elapsed % segmentLength);
    const totalRemaining = durationMinutes - elapsed;
    
    return {
      currentHat: SIX_HATS[currentSegment],
      remainingInSegment,
      totalRemaining,
      elapsed,
      segmentLength
    };
  };
  
  const handleStopWalk = async () => {
    if (!walkStarted) return;
    
    try {
      // Try to call API, but if it fails, just continue with local state changes
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/stop-walk`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.warn('API call failed, continuing with navigation', error);
      }
      
      setWalkStarted(false);
      setStartTime(null);
      
      // Navigate back to home page
      router.push('/');
    } catch (error) {
      console.error('Error stopping walk:', error);
      setStatus('Error stopping walk. Please try again.');
    }
  };
  
  const hatInfo = calculateHatInfo();
  
  return (
    <div style={{
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'monospace',
      padding: '2rem 1rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
<div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '1rem'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '400',
          letterSpacing: '0.1em',
          margin: 0
        }}>
          SIX THINKING HATS
        </h1>
        
        <Link href="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.8,
          transition: 'opacity 0.2s'
        }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} 
           onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}>
          &#8592; {/* Left arrow character */}
        </Link>
      </div>
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'setup' && (
          <SetupTab
            problem={problem}
            setProblem={setProblem}
            durationMinutes={durationMinutes}
            setDurationMinutes={setDurationMinutes}
            promptFrequency={promptFrequency}
            setPromptFrequency={setPromptFrequency}
            status={status}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        )}
        
        {activeTab === 'hats' && (
          <HatsTab
            hatPrompts={hatPrompts}
            handleStartWalk={handleStartWalk}
          />
        )}
        
        {activeTab === 'walk' && (
          <WalkTab
            walkStarted={walkStarted}
            hatInfo={hatInfo}
            durationMinutes={durationMinutes}
            handleStartWalk={handleStartWalk}
            handleStopWalk={handleStopWalk}
          />
        )}
      </div>
    </div>
  );
}