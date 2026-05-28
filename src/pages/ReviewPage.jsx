import React, { useState, useEffect } from 'react';
import { RefreshCw, Filter, Search, Lock, ShieldAlert } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import DataTable from '../components/DataTable';
import client from '../api/client';

const ReviewPage = () => {
  const [stats, setStats] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [sourceType, setSourceType] = useState('');
  const [status, setStatus] = useState('');
  const [scope, setScope] = useState('');
  const [search, setSearch] = useState('');
  
  const [locking, setLocking] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await client.get('/review/stats/');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      const params = {};
      if (sourceType) params.source_type = sourceType;
      if (status) params.status = status;
      if (scope) params.scope = scope;
      if (search) params.search = search;

      const response = await client.get('/records/', { params });
      // Handle DRF paginated response: {count, next, previous, results}
      const data = response.data;
      setRecords(data.results !== undefined ? data.results : data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecords()]);
    setLoading(false);
  };

  const handleAuditLock = async () => {
    const approvedCount = stats.status?.approved || 0;
    if (approvedCount === 0) {
      alert("No approved records are available to lock. Approve records in the grid first.");
      return;
    }

    const confirmLock = window.confirm(
      `CRITICAL LEDGER WARNING:\n\nYou are about to permanently lock ${approvedCount} approved records for audit validation. This action is IRREVERSIBLE and seals the transactions from further edits.\n\nDo you want to proceed?`
    );
    if (!confirmLock) return;

    setLocking(true);
    try {
      await client.post('/records/lock/');
      await refreshData();
    } catch (err) {
      console.error(err);
      alert('Error sealing audit ledger.');
    } finally {
      setLocking(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [sourceType, status, scope, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Stats Board */}
      <StatsCards stats={stats} />

      {/* Filter and control panel */}
      <div className="glass-panel" style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Outfit', color: '#fff' }}>Filter Ledger Records</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAuditLock}
              disabled={locking || (stats.status?.approved || 0) === 0}
              className="btn-primary"
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.2)',
                opacity: (locking || (stats.status?.approved || 0) === 0) ? 0.5 : 1,
              }}
            >
              <Lock size={15} /> {locking ? 'Locking Ledger...' : 'Seal Approved for Audit'}
            </button>
            <button
              onClick={refreshData}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Ingestion Source</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="form-select"
            >
              <option value="">All Sources</option>
              <option value="sap_fuel">SAP Fuel & Procurement</option>
              <option value="utility">Utility Electricity</option>
              <option value="travel">Corporate Travel</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Review Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
              <option value="locked">Audit Locked</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Emissions Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="form-select"
            >
              <option value="">All Scopes</option>
              <option value="1">Scope 1 (Direct)</option>
              <option value="2">Scope 2 (Indirect)</option>
              <option value="3">Scope 3 (Other Indirect)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Search Description</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '34px' }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                <Search size={14} />
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Primary Grid Table */}
      <DataTable records={records} onReviewSuccess={refreshData} />

    </div>
  );
};

export default ReviewPage;
