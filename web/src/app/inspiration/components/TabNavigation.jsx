export default function TabNavigation({ activeTab, setActiveTab, tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'people', label: 'People' },
    { id: 'walk', label: 'Walk' }
  ] }) {
    return (
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        marginBottom: '1.5rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.5)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '1px solid white' : 'none',
              fontFamily: 'monospace',
              cursor: 'pointer',
              marginBottom: '-1px'
            }}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }