import React from 'react';
import { Database, FileSpreadsheet, Lock, User, LogOut } from 'lucide-react';

const Dashboard = ({ activePage, setActivePage, user, onLogout, children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <header
        className="glass-panel"
        style={{
          margin: '20px 20px 0 20px',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '16px',
        }}
      >
        {/* Brand logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <Database size={20} />
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Breathe <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial' }}>ESG</span>
          </span>
          <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Auditors Hub
          </span>
        </div>

        {/* Navigation Actions */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActivePage('review')}
            className={activePage === 'review' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Database size={16} />
            Review Dashboard
          </button>
          <button
            onClick={() => setActivePage('upload')}
            className={activePage === 'upload' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <FileSpreadsheet size={16} />
            Ingestion Hub
          </button>
        </nav>

        {/* User Session Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={16} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>{user?.username || 'Analyst'}</span>
              <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Breathe Analyst</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <main style={{ flex: 1, padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* Footer information */}
      <footer style={{ padding: '20px', textAlign: 'center', color: '#4b5563', fontSize: '0.8rem' }}>
        &copy; 2026 Breathe ESG Ingestion Engine. All rights reserved. Database-agnostic transactional audit ledger.
      </footer>
    </div>
  );
};

export default Dashboard;
