import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Bachat Bazar UI Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return children or clean layout rather than blocking full-screen overlay
      return this.props.children || null;
    }

    return this.props.children;
  }
}

