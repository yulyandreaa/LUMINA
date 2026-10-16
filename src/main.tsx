import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';
import { CartProvider } from './cart/CartProvider';
import { AuthProvider } from './auth/AuthProvider';
import { AccountDataProvider } from './auth/AccountDataProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AccountDataProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AccountDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
