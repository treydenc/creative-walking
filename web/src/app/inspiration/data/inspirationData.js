// Get a color for a person based on their index - minimalist styling
export const getPersonColor = (index) => {
    const styles = [
      { // Purple
        style: {
          background: 'rgba(139, 92, 246, 0.05)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: 'rgba(139, 92, 246, 0.9)'
        }
      },
      { // Blue
        style: {
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: 'rgba(59, 130, 246, 0.9)'
        }
      },
      { // Green
        style: {
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'rgba(16, 185, 129, 0.9)'
        }
      },
      { // Yellow/Gold
        style: {
          background: 'rgba(251, 191, 36, 0.05)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          color: 'rgba(251, 191, 36, 0.9)'
        }
      },
      { // Orange
        style: {
          background: 'rgba(249, 115, 22, 0.05)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          color: 'rgba(249, 115, 22, 0.9)'
        }
      },
      { // Red
        style: {
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'rgba(239, 68, 68, 0.9)'
        }
      }
    ];
    
    return styles[index % styles.length].style;
  };
  
  // Format time as mm:ss
  export const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };