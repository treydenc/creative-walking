import { getPersonColor } from '../data/inspirationData';

export default function PeopleTab({ inspiredPeople, peoplePrompts, handleStartWalk }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.1rem',
          fontWeight: '400',
          letterSpacing: '0.05em'
        }}>
          YOUR INSPIRATIONAL PERSPECTIVES
        </h2>
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
          START WALK
        </button>
      </div>
      
      <p style={{
        marginBottom: '2rem',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        color: 'rgba(255,255,255,0.7)'
      }}>
        These prompts will appear on your glasses during your walk,
        with 1/6 of your walk time dedicated to each person's perspective.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {inspiredPeople.map((person, index) => {
          const style = getPersonColor(index);
          
          return (
            <div 
              key={index} 
              style={{
                padding: '1.5rem',
                ...style
              }}
            >
              <h3 style={{
                fontWeight: '400',
                fontSize: '1rem',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                PERSON {index + 1}: {person.toUpperCase()}
              </h3>
              
              {peoplePrompts[person] && peoplePrompts[person].length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {peoplePrompts[person].map((prompt, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: 'rgba(255,255,255,0.9)'
                      }}
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.9rem'
                }}>
                  Prompts will appear here once generated.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}