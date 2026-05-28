import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import ReviewPage from './pages/ReviewPage';
import IngestionPage from './pages/IngestionPage';
import client, { getAuthToken, clearAuthToken } from './api/client';

const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activePage, setActivePage] = useState('review'); // 'review' or 'upload'

  const checkAuthStatus = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setCheckingAuth(false);
      return;
    }
    try {
      const response = await client.get('/auth/status/');
      if (response.data.authenticated) {
        setUser(response.data);
      } else {
        clearAuthToken();
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      clearAuthToken();
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout/');
    } catch (err) {
      console.error(err);
    } finally {
      clearAuthToken();
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-gradient)' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '600', fontFamily: 'Outfit' }}>
          Establishing secure audit terminal...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <Dashboard
      activePage={activePage}
      setActivePage={setActivePage}
      user={user}
      onLogout={handleLogout}
    >
      {activePage === 'review' ? <ReviewPage /> : <IngestionPage />}
    </Dashboard>
  );
};

export default App;
