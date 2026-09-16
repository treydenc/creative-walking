export default function Footer() {
    return (
      <footer style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem',
          fontFamily: 'monospace'
        }}>
          C_WALKS © {new Date().getFullYear()}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1.5rem'
        }}>
          <a href="#" style={{
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: '0.8rem'
          }}>Privacy</a>
          <a href="#" style={{
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: '0.8rem'
          }}>Terms</a>
        </div>
      </footer>
    );
  }