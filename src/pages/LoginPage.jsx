import React, { useState } from 'react';
import { Database, Lock, Mail, KeyRound, AlertCircle, RefreshCw } from 'lucide-react';
import client, { setAuthToken } from '../api/client';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginRes = await client.post('/auth/login/', {
        username: email,
        password: password,
      });

      if (loginRes.data.authenticated && loginRes.data.token) {
        // Store the token for all future API requests
        setAuthToken(loginRes.data.token);
        onLoginSuccess(loginRes.data);
      } else {
        setError('Verification failed. Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to authenticate. Verify corporate email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-gradient)',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px 30px',
          borderRadius: '24px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        
        {/* Brand logo */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', borderRadius: '14px', background: 'var(--primary)', color: '#fff', marginBottom: '20px' }}>
          <Database size={28} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: '6px' }}>Breathe ESG</h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '30px' }}>Sign in to corporate data review portal</p>

        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px',
              padding: '12px',
              color: '#f87171',
              fontSize: '0.85rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>Corporate Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="admin or analyst@breathe-esg.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                <Mail size={16} />
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                <KeyRound size={16} />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                Authenticating Analyst...
              </>
            ) : (
              'Enter Workspace'
            )}
          </button>

        </form>

        <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '30px' }}>
          Restricted access. Transaction auditing ledger is monitored.
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
