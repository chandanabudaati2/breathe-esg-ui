import React from 'react';
import { ShieldCheck, AlertTriangle, Database, Activity, Lock } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num || 0);
  };

  const scopeTotals = stats.scopes || {};
  const s1 = scopeTotals[1]?.co2e || 0;
  const s2 = scopeTotals[2]?.co2e || 0;
  const s3 = scopeTotals[3]?.co2e || 0;
  const totalScope = s1 + s2 + s3 || 1; // prevent zero division

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      
      {/* Total CO2 Card */}
      <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10px', bottom: '-15px', opacity: 0.08, color: '#10b981' }}>
          <Activity size={100} />
        </div>
        <h4 style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Carbon Footprint</h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'Outfit' }}>
            {formatNumber(stats.total_co2e_kg / 1000)}
          </span>
          <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500' }}>t CO₂e</span>
        </div>
        
        {/* Scope breakdown bar */}
        <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '12px', background: '#374151' }}>
          <div style={{ width: `${(s1 / totalScope) * 100}%`, background: '#ef4444' }} title={`Scope 1: ${formatNumber(s1)} kg`} />
          <div style={{ width: `${(s2 / totalScope) * 100}%`, background: '#3b82f6' }} title={`Scope 2: ${formatNumber(s2)} kg`} />
          <div style={{ width: `${(s3 / totalScope) * 100}%`, background: '#8b5cf6' }} title={`Scope 3: ${formatNumber(s3)} kg`} />
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />S1: {Math.round((s1 / totalScope) * 100)}%</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />S2: {Math.round((s2 / totalScope) * 100)}%</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} />S3: {Math.round((s3 / totalScope) * 100)}%</span>
        </div>
      </div>

      {/* Pending Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h4 style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Pending Review</h4>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', fontFamily: 'Outfit' }}>
              {stats.status?.pending || 0}
            </span>
          </div>
          <span style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Database size={20} />
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '10px' }}>Awaiting analyst action</p>
      </div>

      {/* Flagged Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h4 style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Flagged Alerts</h4>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'Outfit' }}>
              {stats.status?.flagged || 0}
            </span>
          </div>
          <span style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
            <AlertTriangle size={20} />
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '10px' }}>Suspicious anomalies flagged</p>
      </div>

      {/* Approved/Locked Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h4 style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Approved & Locked</h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                {stats.status?.approved || 0}
              </span>
              <span style={{ color: '#6b7280', fontSize: '1.2rem' }}>/</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Outfit' }}>
                {stats.status?.locked || 0}
              </span>
            </div>
          </div>
          <span style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
            <ShieldCheck size={20} />
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '10px' }}>Ready for audit lock verification</p>
      </div>

    </div>
  );
};

export default StatsCards;
