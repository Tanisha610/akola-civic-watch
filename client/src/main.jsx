import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import 'leaflet/dist/leaflet.css';

const savedTheme = localStorage.getItem('acw-theme');
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', (savedTheme || (prefersDark ? 'dark' : 'light')) === 'dark');
document.documentElement.style.colorScheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
