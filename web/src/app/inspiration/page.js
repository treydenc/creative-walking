'use client';

import InspirationWalksPage from './InspirationWalksPage';
import P5Background from '../../components/Background';

export default function Page() {
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
        <InspirationWalksPage />
      </div>
    </div>
  );
}