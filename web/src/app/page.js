'use client';

import React from 'react';
import { Eye, Brain } from 'lucide-react';
import P5Background from '../components/Background';
import Card from '../components/Card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import { useRouter } from 'next/navigation'; // Use this import

export default function HomePage() {
  const router = useRouter(); // No conditional import needed
  
  const selectWalkType = async (type) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log(`Making API call to: ${apiUrl}/api/select-walk-type`);
      
      const response = await fetch(`${apiUrl}/api/select-walk-type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walkType: type }),
      });
      
      const data = await response.json();
      console.log('API call successful:', data);
      
      // Navigate only after the API call completes
      router.push(`/${type}`);
    } catch (error) {
      console.error(`Error selecting walk type:`, error);
      // Navigate anyway
      router.push(`/${type}`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: 'white',
      fontFamily: 'sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* P5 Background */}
      <P5Background />
      
      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Hero Section */}
          <HeroSection />
          
          {/* Walk Type Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Six Thinking Hats Card */}
            <Card 
              title="Six Thinking Hats"
              description="Apply Edward de Bono's methodology to view your challenges from six distinct perspectives."
              icon={<Eye size={20} />}
              items={['White', 'Red', 'Black', 'Yellow', 'Green', 'Blue']}
              onClick={() => selectWalkType('sixHat')}
            />
            
            {/* Inspiration Walks Card */}
            <Card 
              title="Inspiration Walks"
              description="Channel the mindsets of six people who inspire you to unlock new perspectives."
              icon={<Brain size={20} />}
              items={['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5', 'Person 6']}
              onClick={() => selectWalkType('inspiration')}
            />
          </div>
          
          {/* How It Works */}
          <HowItWorks />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}