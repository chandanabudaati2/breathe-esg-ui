import React from 'react';

const STATUS_STYLING = {
  pending: {
    bg: 'var(--status-pending-bg)',
    color: 'var(--status-pending-text)',
    border: 'var(--status-pending-border)',
    label: 'Pending Review'
  },
  approved: {
    bg: 'var(--status-approved-bg)',
    color: 'var(--status-approved-text)',
    border: 'var(--status-approved-border)',
    label: 'Approved'
  },
  flagged: {
    bg: 'var(--status-flagged-bg)',
    color: 'var(--status-flagged-text)',
    border: 'var(--status-flagged-border)',
    label: 'Flagged'
  },
  rejected: {
    bg: 'var(--status-rejected-bg)',
    color: 'var(--status-rejected-text)',
    border: 'var(--status-rejected-border)',
    label: 'Rejected'
  },
  locked: {
    bg: 'var(--status-locked-bg)',
    color: 'var(--status-locked-text)',
    border: 'var(--status-locked-border)',
    label: 'Audit Locked'
  }
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_STYLING[status] || STATUS_STYLING.pending;
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: '600',
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        letterSpacing: '0.03em',
        textTransform: 'uppercase'
      }}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
