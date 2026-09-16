import { getPersonColor, formatTime } from '../data/inspirationData';

export default function WalkTab({ 
  walkStarted, 
  personInfo, 
  inspiredPeople,
  durationMinutes, 
  handleStartWalk, 
  handleStopWalk 
}) {
  if (!walkStarted || !personInfo) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '1rem'
        }}>
          You haven't started your walk yet.
        </p>
        <button
          onClick={handleStartWalk}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: '1px solid rgba(16, 185, 129, 0.7)',
            color: 'rgba(16, 185, 129, 0.9)',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.05em'
          }}
        >
          START INSPIRATION WALK
        </button>
      </div>
    );
  }

  // Get style for current person
  const currentStyle = getPersonColor(personInfo.currentPersonIndex);

  return (
    <div>
      <h2 style={{
        fontSize: '1.1rem',
        fontWeight: '400',
        letterSpacing: '0.05em',
        marginBottom: '1.5rem'
      }}>
        WALK PROGRESS
      </h2>
      
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          CURRENT INSPIRATION:
        </p>
        <div style={{
          marginTop: '0.5rem',
          padding: '1.5rem',
          ...currentStyle
        }}>
          <h3 style={{
            fontWeight: '400',
            fontSize: '1.1rem',
            letterSpacing: '0.05em'
          }}>
            {personInfo.currentPerson.toUpperCase()}
          </h3>
          <p style={{
            fontSize: '0.9rem',
            opacity: 0.9
          }}>
            Think from their perspective
          </p>
        </div>
        
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.7)'
        }}>
          <span>Time with this perspective: {formatTime(personInfo.segmentLength - personInfo.remainingInSegment)}</span>
          <span>Time left with this perspective: {formatTime(personInfo.remainingInSegment)}</span>
        </div>
        
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          marginTop: '0.5rem',
          position: 'relative'
        }}>
          <div 
            style={{
              position: 'absolute',
              height: '100%',
              backgroundColor: currentStyle.color,
              width: `${((personInfo.segmentLength - personInfo.remainingInSegment) / personInfo.segmentLength) * 100}%`
            }}
          ></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>
          OVERALL PROGRESS:
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '0.5rem'
        }}>
          <span>Elapsed: {formatTime(personInfo.elapsed)}</span>
          <span>Remaining: {formatTime(personInfo.totalRemaining)}</span>
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          position: 'relative'
        }}>
          <div 
            style={{
              position: 'absolute',
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.5)',
              width: `${(personInfo.elapsed / durationMinutes) * 100}%`
            }}
          ></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          PERSON SEQUENCE:
        </p>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '0.5rem',
          paddingBottom: '0.5rem'
        }}>
          {inspiredPeople.map((person, index) => {
            const isActive = index === personInfo.currentPersonIndex;
            const isPast = index < personInfo.currentPersonIndex;
            const style = getPersonColor(index);
            
            return (
              <div 
                key={index}
                style={{
                  padding: '0.75rem',
                  minWidth: '100px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  opacity: isPast ? 0.6 : 1,
                  border: isActive ? '2px solid ' + style.color : '1px solid rgba(255,255,255,0.1)',
                  background: isActive ? style.background : isPast ? 'rgba(0,0,0,0.3)' : style.background
                }}
              >
                {person}
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <button
          onClick={handleStopWalk}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.7)',
            color: 'rgba(239, 68, 68, 0.9)',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.05em'
          }}
        >
          STOP WALK & RETURN HOME
        </button>
        <p style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)',
          marginTop: '0.5rem'
        }}>
          Stopping the walk will end your session and return to the homepage.
        </p>
      </div>
    </div>
  );
}