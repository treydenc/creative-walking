// Six Thinking Hats with colors
export const SIX_HATS = [
    { 
      name: "White Hat", 
      color: "white", 
      description: "Facts & Information",
      style: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: 'rgba(255, 255, 255, 0.9)'
      }
    },
    { 
      name: "Red Hat", 
      color: "red", 
      description: "Feelings & Emotions",
      style: {
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: 'rgba(239, 68, 68, 0.9)'
      }
    },
    { 
      name: "Black Hat", 
      color: "black", 
      description: "Caution & Critique",
      style: {
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        color: 'rgba(229, 231, 235, 0.9)'
      }
    },
    { 
      name: "Yellow Hat", 
      color: "yellow", 
      description: "Benefits & Optimism",
      style: {
        background: 'rgba(251, 191, 36, 0.05)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        color: 'rgba(251, 191, 36, 0.9)'
      }
    },
    { 
      name: "Green Hat", 
      color: "green", 
      description: "Creativity & Possibilities",
      style: {
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: 'rgba(16, 185, 129, 0.9)'
      }
    },
    { 
      name: "Blue Hat", 
      color: "blue", 
      description: "Process & Reflection",
      style: {
        background: 'rgba(59, 130, 246, 0.05)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: 'rgba(59, 130, 246, 0.9)'
      }
    }
  ];
  
  // Format time as mm:ss
  export const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };