export default function Header() {
  return (
    <header style={{
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '1rem',
        letterSpacing: '0.1em'
      }}>
        C_WALKS
      </div>
      
      <nav style={{
        display: 'flex',
        gap: '2rem'
      }}>
        <a href="#" style={{
          color: 'rgba(255,255,255,0.7)',
          textDecoration: 'none',
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>About</a>
        <a href="#" style={{
          color: 'rgba(255,255,255,0.7)',
          textDecoration: 'none',
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>Contact</a>
      </nav>
    </header>
  );
}