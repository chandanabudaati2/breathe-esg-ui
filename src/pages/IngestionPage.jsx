import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import UploadPanel from '../components/UploadPanel';
import client from '../api/client';

const IngestionPage = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    try {
      const response = await client.get('/sources/');
      // Handle DRF paginated response: {count, next, previous, results}
      const data = response.data;
      setSources(data.results !== undefined ? data.results : data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Upload Panel */}
      <UploadPanel onUploadSuccess={fetchSources} />

      {/* Ingestion History */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#fff' }}>Ingestion History</h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>Historical pipeline uploads and processing statuses</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchSources(); }}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh History
          </button>
        </div>

        {/* Table representation */}
        <div style={{ overflowX: 'auto' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>File Ingestion Source</th>
                <th>Uploaded At</th>
                <th>Parsed Rows</th>
                <th>Anomalous Errors</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((src) => (
                <tr key={src.id}>
                  <td>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{src.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Type: {src.source_type === 'sap_fuel' ? 'SAP Fuel' : src.source_type === 'utility' ? 'Utility Electricity' : 'Corporate Travel'}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(src.uploaded_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td>{src.row_count !== null ? src.row_count : '-'}</td>
                  <td>
                    {src.error_count !== null ? (
                      <span style={{ color: src.error_count > 0 ? '#f87171' : '#9ca3af', fontWeight: src.error_count > 0 ? '600' : '400' }}>
                        {src.error_count}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: src.status === 'completed' ? 'rgba(16,185,129,0.1)' : src.status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
                        color: src.status === 'completed' ? '#34d399' : src.status === 'failed' ? '#f87171' : '#60a5fa',
                      }}
                    >
                      {src.status === 'completed' ? (
                        <CheckCircle2 size={12} />
                      ) : src.status === 'failed' ? (
                        <AlertCircle size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {src.status}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#9ca3af', fontSize: '0.8rem' }}>
                    {src.processing_log || 'No processing details.'}
                  </td>
                </tr>
              ))}

              {sources.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#9ca3af', fontStyle: 'italic' }}>
                    No ingestion logs available. Ingest a file above to begin processing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default IngestionPage;
