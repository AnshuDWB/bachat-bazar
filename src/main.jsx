import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
