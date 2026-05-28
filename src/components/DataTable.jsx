import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, ThumbsDown, Lock } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DataTable = ({ records, onReviewSuccess }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedIds, setSelectedIds] = useState({});
  const [bulkActionNotes, setBulkActionNotes] = useState('');

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const selected = {};
      records.forEach((rec) => {
        if (rec.status !== 'locked') {
          selected[rec.id] = true;
        }
      });
      setSelectedIds(selected);
    } else {
      setSelectedIds({});
    }
  };

  const handleSelectRow = (id, e) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: e.target.checked ? true : undefined,
    }));
  };

  const activeSelectedIds = Object.keys(selectedIds).filter((id) => selectedIds[id]);

  const handleBulkAction = async (newStatus) => {
    if (activeSelectedIds.length === 0) return;
    try {
      const { default: client } = await import('../api/client');
      await client.post('/records/bulk-review/', {
        ids: activeSelectedIds.map(Number),
        status: newStatus,
        review_notes: bulkActionNotes,
      });
      setSelectedIds({});
      setBulkActionNotes('');
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) {
      console.error(err);
      alert('Error executing bulk action.');
    }
  };

  const handleSingleReview = async (id, newStatus, notes = '') => {
    try {
      const { default: client } = await import('../api/client');
      await client.patch(`/records/${id}/review/`, {
        status: newStatus,
        review_notes: notes,
      });
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) {
      console.error(err);
      alert('Error updating record status.');
    }
  };

  return (
    <div>
      {/* Bulk Review Panel */}
      {activeSelectedIds.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            marginBottom: '20px',
            background: 'rgba(59, 130, 246, 0.08)',
            borderColor: 'rgba(59, 130, 246, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>
              Selected <span style={{ color: '#60a5fa' }}>{activeSelectedIds.length}</span> records for review:
            </span>
            <input
              type="text"
              placeholder="Add review notes (optional)..."
              value={bulkActionNotes}
              onChange={(e) => setBulkActionNotes(e.target.value)}
              className="form-input"
              style={{ width: '260px', padding: '6px 12px', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleBulkAction('approved')} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> Approve Selected
            </button>
            <button onClick={() => handleBulkAction('flagged')} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#fbbf24' }}>
              <AlertTriangle size={16} /> Flag Selected
            </button>
            <button onClick={() => handleBulkAction('rejected')} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#f87171' }}>
              <ThumbsDown size={16} /> Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Primary Ingestion Data Grid Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ width: '40px', paddingLeft: '16px' }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={records.length > 0 && records.every((r) => r.status === 'locked' || selectedIds[r.id])}
                />
              </th>
              <th>Ingested Source</th>
              <th>Date</th>
              <th>Activity / Description</th>
              <th>Scope</th>
              <th style={{ textAlign: 'right' }}>Normalized Activity</th>
              <th style={{ textAlign: 'right' }}>Calculated CO₂e</th>
              <th>Workflow Status</th>
              <th style={{ width: '80px' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => {
              const isExpanded = expandedRows[rec.id];
              const isChecked = !!selectedIds[rec.id];
              
              return (
                <React.Fragment key={rec.id}>
                  <tr>
                    <td style={{ paddingLeft: '16px' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={rec.status === 'locked'}
                        onChange={(e) => handleSelectRow(rec.id, e)}
                      />
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{rec.source_type_display}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{rec.source_file_name}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{rec.activity_date}</td>
                    <td>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#fff' }}>{rec.description}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                        Facility: {rec.facility_name} ({rec.facility_code})
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: rec.scope === 1 ? 'rgba(239, 68, 68, 0.1)' : rec.scope === 2 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                          color: rec.scope === 1 ? '#f87171' : rec.scope === 2 ? '#60a5fa' : '#c084fc',
                        }}
                      >
                        S{rec.scope}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: '#fff' }}>
                      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(rec.quantity)}{' '}
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '400' }}>{rec.unit}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#10b981' }}>
                      {rec.co2e_kg ? (
                        <>
                          {new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(rec.co2e_kg)}{' '}
                          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>kg</span>
                        </>
                      ) : (
                        <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.85rem' }}>Failed</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={rec.status} />
                    </td>
                    <td>
                      <button
                        onClick={() => toggleRow(rec.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px',
                        }}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded comparative view */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={9} style={{ padding: '0', background: 'rgba(0,0,0,0.15)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--panel-border)' }}>
                          
                          {/* Top row details */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px' }}>
                            
                            {/* Raw Source Data comparison */}
                            <div>
                              <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Raw Unstructured Ingested Row</h4>
                              <pre
                                style={{
                                  background: 'rgba(0,0,0,0.3)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  fontFamily: 'monospace',
                                  fontSize: '0.8rem',
                                  color: '#e5e7eb',
                                  maxHeight: '180px',
                                  overflowY: 'auto',
                                }}
                              >
                                {JSON.stringify(rec.raw_data, null, 2)}
                              </pre>
                            </div>

                            {/* Normalization & Mapping logic details */}
                            <div>
                              <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Calculated Normalization Metrics</h4>
                              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#9ca3af' }}>Original Data:</span>
                                  <span>{rec.original_quantity} {rec.original_unit}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#9ca3af' }}>Normalized Volume:</span>
                                  <span>{rec.quantity} {rec.unit}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: '#9ca3af' }}>Grid region/coefficients:</span>
                                  <span>{rec.emission_factor ? `${rec.emission_factor} kg CO2e/${rec.unit}` : 'None'}</span>
                                </div>
                                {rec.period_start && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#9ca3af' }}>Billing Duration:</span>
                                    <span>{rec.period_start} to {rec.period_end}</span>
                                  </div>
                                )}
                                {rec.source_metadata?.flight_origin && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#9ca3af' }}>Aviation Route:</span>
                                    <span style={{ color: '#60a5fa', fontWeight: '600' }}>
                                      {rec.source_metadata.flight_origin} → {rec.source_metadata.flight_destination}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Flag alert notes */}
                          {rec.status === 'flagged' && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(245, 158, 11, 0.06)',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                color: '#fbbf24',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                marginBottom: '20px',
                              }}
                            >
                              <AlertTriangle size={16} />
                              <span>Auto-Flag Alert: {rec.flag_reason}</span>
                            </div>
                          )}

                          {/* Notes trail */}
                          {rec.review_notes && (
                            <div style={{ fontSize: '0.85rem', color: '#d1d5db', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #3b82f6', marginBottom: '20px' }}>
                              <span style={{ fontWeight: '600', color: '#fff' }}>Review Note:</span> {rec.review_notes}
                            </div>
                          )}

                          {/* Individual review actions */}
                          {rec.status !== 'locked' ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button onClick={() => handleSingleReview(rec.id, 'approved')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                Approve Record
                              </button>
                              <button onClick={() => handleSingleReview(rec.id, 'flagged', 'Flagged manually by analyst')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#fbbf24' }}>
                                Flag Anomalous
                              </button>
                              <button onClick={() => handleSingleReview(rec.id, 'rejected')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f87171' }}>
                                Reject Record
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', color: '#a78bfa', fontSize: '0.85rem', fontWeight: '600' }}>
                              <Lock size={14} /> Locked for Audit Ledger
                            </div>
                          )}

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {records.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontStyle: 'italic' }}>
                  No normalized records found. Proceed to the Ingestion page to process files.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
