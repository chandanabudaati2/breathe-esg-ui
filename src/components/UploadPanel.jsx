import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import client from '../api/client';

const SOURCE_TYPES = [
  { id: 'sap_fuel', name: 'SAP Fuel & Procurement (Scope 1)', desc: 'Supports DACH semicolon-delimited CSV, German locale headers, quantity anomalies.' },
  { id: 'utility', name: 'Utility Electricity (Scope 2)', desc: 'Supports billing portal exports, non-aligned calendar periods, kWh/MWh conversions.' },
  { id: 'travel', name: 'Corporate Travel (Scope 3)', desc: 'Supports Concur standard extracts, IATA flight routing uplifts, lodging room-nights.' },
];

const UploadPanel = ({ onUploadSuccess }) => {
  const [selectedSource, setSelectedSource] = useState('sap_fuel');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [log, setLog] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
      setLog('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);
    setLog('');

    const formData = new FormData();
    formData.append('uploaded_file', file);
    formData.append('source_type', selectedSource);
    formData.append('name', file.name);

    try {
      const response = await client.post('/sources/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resData = response.data;
      if (resData.status === 'completed') {
        setStatus('success');
        setLog(`Successfully parsed ${resData.row_count} rows. Errors encountered: ${resData.error_count}.\n\nProcessing log:\n${resData.processing_log}`);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setStatus('error');
        setLog(`File parsing failed.\n\nError log:\n${resData.processing_log}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setLog(err.response?.data?.processing_log || 'Network error encountered during pipeline execution.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px', alignItems: 'start' }}>
      
      {/* Selection Column */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#fff' }}>1. Select Ingestion Source</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SOURCE_TYPES.map((src) => (
            <div
              key={src.id}
              onClick={() => setSelectedSource(src.id)}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${selectedSource === src.id ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}`,
                background: selectedSource === src.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: selectedSource === src.id ? 'var(--primary)' : '#fff' }}>{src.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px', lineHeight: '1.3' }}>{src.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Drag zone Column */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#fff', marginBottom: '16px' }}>2. Upload Flat-File Data</h3>
        
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: '180px',
              border: `2px dashed ${file ? 'var(--primary)' : 'var(--panel-border)'}`,
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.01)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '12px',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ color: file ? 'var(--primary)' : '#9ca3af' }}>
              <Upload size={32} />
            </span>
            {file ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>{file.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>{Math.round(file.size / 1024)} KB</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>Select or drop CSV file here</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>Supports standard accounting and portal extracts</div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={!file || uploading}
              className="btn-primary"
              style={{ opacity: (!file || uploading) ? 0.5 : 1 }}
            >
              {uploading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
                  Processing Ingestion Pipeline...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Ingest & Process Records
                </>
              )}
            </button>
          </div>
        </form>

        {/* Output log */}
        {status && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '12px',
              background: status === 'success' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${status === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              {status === 'success' ? (
                <CheckCircle2 size={18} color="var(--primary)" />
              ) : (
                <XCircle size={18} color="#f87171" />
              )}
              <span style={{ fontWeight: '600', fontSize: '0.95rem', color: status === 'success' ? 'var(--primary)' : '#f87171' }}>
                {status === 'success' ? 'Pipeline Completed Successfully' : 'Pipeline Execution Failed'}
              </span>
            </div>
            <pre
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#d1d5db',
                whiteSpace: 'pre-wrap',
                background: 'rgba(0,0,0,0.2)',
                padding: '12px',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {log}
            </pre>
          </div>
        )}

      </div>
      
      {/* Spin animation styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UploadPanel;
