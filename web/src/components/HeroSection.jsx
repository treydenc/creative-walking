export default function HeroSection() {
    return (
      <section style={{
        textAlign: 'center',
        marginBottom: '3rem',
        opacity: 0.1 // Very subtle since we already have the p5 animation
      }}>
        <h1 style={{
          fontFamily: 'monospace',
          fontWeight: '300',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          letterSpacing: '0.2em',
          lineHeight: 1.2,
          margin: 0
        }}>
          CREATIVITY WALKS
        </h1>
      </section>
    );
  }