export default function SetupTab({
    problem,
    setProblem,
    durationMinutes,
    setDurationMinutes,
    promptFrequency,
    setPromptFrequency,
    inspiredPeople,
    handlePersonChange,
    status,
    isLoading,
    handleSubmit
  }) {
    return (
      <div>
        <p style={{
          marginBottom: '2rem',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: 'rgba(255,255,255,0.7)'
        }}>
          Set up your Inspiration Walk. Name 6 inspirational people whose perspectives 
          will guide your thinking during your walk.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="problem" 
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              YOUR CHALLENGE OR PROBLEM:
            </label>
            <textarea
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'monospace',
                minHeight: '120px',
                resize: 'vertical'
              }}
              placeholder="Describe what you're thinking about..."
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              SIX INSPIRATIONAL PEOPLE:
            </label>
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '1rem'
            }}>
              Choose 6 people whose perspective would be valuable for your challenge.
              They can be historical figures, industry leaders, fictional characters, etc.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              {inspiredPeople.map((person, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    marginRight: '0.5rem',
                    color: 'rgba(255,255,255,0.5)',
                    width: '1.5rem',
                    textAlign: 'center'
                  }}>
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={person}
                    onChange={(e) => handlePersonChange(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontFamily: 'monospace'
                    }}
                    placeholder={`Person ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="duration" 
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              WALK DURATION (MINUTES):
            </label>
            <input
              id="duration"
              type="number"
              min="6"
              max="120"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'monospace'
              }}
            />
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '0.5rem'
            }}>
              Minimum 6 minutes (1 minute per person). Recommended: 30 minutes (5 minutes per person).
            </p>
          </div>
  
          <div style={{ marginBottom: '2rem' }}>
            <label 
              htmlFor="promptFrequency" 
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              PROMPT FREQUENCY (SECONDS):
            </label>
            <input
              id="promptFrequency"
              type="number"
              min="30"
              max="300"
              value={promptFrequency}
              onChange={(e) => setPromptFrequency(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'monospace'
              }}
            />
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '0.5rem'
            }}>
              How often a new prompt appears (minimum 30 seconds, maximum 5 minutes).
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              letterSpacing: '0.05em'
            }}
          >
            {isLoading ? 'GENERATING PROMPTS...' : 'GENERATE INSPIRATION PROMPTS'}
          </button>
          
          {status && (
            <p style={{
              marginTop: '1rem',
              color: status.includes('Error') ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
              fontSize: '0.9rem'
            }}>
              {status}
            </p>
          )}
        </form>
      </div>
    );
  }