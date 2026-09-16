export default function HowItWorks() {
    const steps = [
      { step: 1, text: "Choose your walk type and enter your challenge" },
      { step: 2, text: "Set duration and generate personalized prompts" },
      { step: 3, text: "Follow prompts and discover insights" }
    ];
    
    return (
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '2rem',
        marginBottom: '4rem'
      }}>
        <h2 style={{
          fontFamily: 'monospace',
          fontSize: '1rem',
          fontWeight: '400',
          letterSpacing: '0.1em',
          marginBottom: '2rem',
          textTransform: 'uppercase'
        }}>
          How It Works
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem'
        }}>
          {steps.map(({ step, text }) => (
            <div key={step} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {step}
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                margin: 0,
                lineHeight: 1.5
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }