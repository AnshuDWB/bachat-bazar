import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Bachat Bazar UI ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleClearCacheAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(true);
      }
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0E0E0E',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#181818',
            border: '1px solid #333333',
            borderRadius: '24px',
            padding: '32px 24px',
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#D71920',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '28px',
              fontWeight: 'bold'
            }}>
              B
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              BACHAT BAZAR
            </h2>
            <p style={{ fontSize: '13px', color: '#999999', marginBottom: '24px' }}>
              A new update was deployed! Please tap the button below to load the latest version.
            </p>

            <button
              onClick={this.handleClearCacheAndReload}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: '#D71920',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              🔄 Refresh & Load Latest Store
            </button>

            <a
              href="/"
              style={{
                display: 'block',
                fontSize: '12px',
                color: '#999999',
                textDecoration: 'underline',
                marginTop: '12px'
              }}
            >
              Go to Home Page
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
