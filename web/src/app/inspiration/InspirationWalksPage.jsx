'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import TabNavigation from './components/TabNavigation';
import SetupTab from './components/SetupTab';
import PeopleTab from './components/PeopleTab';
import WalkTab from './components/WalkTab';
import { getPersonColor, formatTime } from './data/inspirationData';

export default function InspirationWalksPage() {
  const router = useRouter();
  
  // State variables
  const [problem, setProblem] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [inspiredPeople, setInspiredPeople] = useState(['', '', '', '', '', '']);
  const [peoplePrompts, setPeoplePrompts] = useState({});
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [walkStarted, setWalkStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [promptFrequency, setPromptFrequency] = useState(30);
  
  // Load settings on page load
  useEffect(() => {
    async function fetchSettings() {
      try {
        // Try to fetch settings from API, fallback gracefully if not available
        const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspiration/walk-settings`;
        const res = await fetch(url).catch(() => ({ ok: false }));
        
        if (!res || !res.ok) {
          console.warn('Walk settings API not available, using default values');
          return;
        }
        
        const data = await res.json();
        
        if (data.settings?.problem) {
          setProblem(data.settings.problem);
          setDurationMinutes(data.settings.durationMinutes || 30);
          
          if (data.settings.inspiredPeople && data.settings.inspiredPeople.length === 6) {
            setInspiredPeople(data.settings.inspiredPeople);
          }
          
          if (data.settings.startTime) {
            setStartTime(data.settings.startTime);
            setWalkStarted(true);
            setActiveTab('walk');
          }
        }
        
        if (data.hasPrompts) {
          setPeoplePrompts(data.peoplePrompts || {});
          setActiveTab('people');
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
  
  // Handle updating an inspired person
  const handlePersonChange = (index, value) => {
    const newPeople = [...inspiredPeople];
    newPeople[index] = value;
    setInspiredPeople(newPeople);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!problem.trim()) {
      setStatus('Please describe your problem or challenge.');
      return;
    }
    
    if (!durationMinutes || durationMinutes < 6) {
      setStatus('Walk duration must be at least 6 minutes (1 minute per perspective).');
      return;
    }

    if (!promptFrequency || promptFrequency < 30) {
      setStatus('Prompt frequency must be at least 30 seconds.');
      return;
    }
    
    // Validate that all people are filled in
    const emptyPeopleIndexes = inspiredPeople.map((person, index) => 
      person.trim() === '' ? index + 1 : null
    ).filter(index => index !== null);
    
    if (emptyPeopleIndexes.length > 0) {
      setStatus(`Please fill in all inspirational people. Missing: Person ${emptyPeopleIndexes.join(', Person ')}`);
      return;
    }
    
    setIsLoading(true);
    setStatus('');
    
    try {
      // Try to send to API, fallback to mock data if API fails
      let result;
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspiration/walk-settings`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problem: problem.trim(),
            durationMinutes: parseInt(durationMinutes),
            inspiredPeople: inspiredPeople.map(p => p.trim()),
            promptFrequencySeconds: parseInt(promptFrequency)
          }),
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        result = await res.json();
      } catch (error) {
        console.warn('API call failed, using mock data', error);
        // Create mock prompts for development/testing
        const mockPrompts = {};
        inspiredPeople.forEach(person => {
          if (person.trim()) {
            mockPrompts[person] = [
              `What would ${person} think about ${problem}?`,
              `How would ${person} approach this challenge?`,
              `What unique perspective would ${person} bring to this situation?`
            ];
          }
        });
        
        result = {
          success: true,
          peoplePrompts: mockPrompts
        };
      }
      
      if (result.success) {
        setStatus('Inspiration prompts generated! Go to People tab to view them.');
        setPeoplePrompts(result.peoplePrompts || {});
        setActiveTab('people');
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
      let startTimeValue = Date.now();
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspiration/start-walk`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            startTimeValue = data.startTime;
          }
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
  
  // Calculate current person and time remaining
  const calculatePersonInfo = () => {
    if (!walkStarted || !startTime || !durationMinutes) return null;
    
    const elapsed = (currentTime - startTime) / 60000; // in minutes
    const segmentLength = durationMinutes / 6;
    const currentSegment = Math.min(Math.floor(elapsed / segmentLength), 5);
    const remainingInSegment = segmentLength - (elapsed % segmentLength);
    const totalRemaining = durationMinutes - elapsed;
    
    return {
      currentPerson: inspiredPeople[currentSegment],
      currentPersonIndex: currentSegment,
      remainingInSegment,
      totalRemaining,
      elapsed,
      segmentLength
    };
  };
  
  const personInfo = calculatePersonInfo();
  
  const handleStopWalk = async () => {
    if (!walkStarted) return;
    
    try {
      // Try to call API, but continue to home if it fails
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inspiration/stop-walk`;
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
          INSPIRATION WALKS
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
        tabs={[
          { id: 'setup', label: 'Setup' },
          { id: 'people', label: 'People' },
          { id: 'walk', label: 'Walk' }
        ]}
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
            inspiredPeople={inspiredPeople}
            handlePersonChange={handlePersonChange}
            status={status}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        )}
        
        {activeTab === 'people' && (
          <PeopleTab
            inspiredPeople={inspiredPeople}
            peoplePrompts={peoplePrompts}
            handleStartWalk={handleStartWalk}
          />
        )}
        
        {activeTab === 'walk' && (
          <WalkTab
            walkStarted={walkStarted}
            personInfo={personInfo}
            inspiredPeople={inspiredPeople}
            durationMinutes={durationMinutes}
            handleStartWalk={handleStartWalk}
            handleStopWalk={handleStopWalk}
          />
        )}
      </div>
    </div>
  );
}