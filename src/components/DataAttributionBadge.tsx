import React from 'react';
import { DataEntryAttribution, SurgeonUser } from '../types/spine';
import { ShieldCheck, Clock, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface DataAttributionBadgeProps {
  attribution?: DataEntryAttribution;
  currentSurgeon: SurgeonUser;
  moduleName: string;
  onVerify?: () => void;
  compact?: boolean;
}

export const DataAttributionBadge: React.FC<DataAttributionBadgeProps> = ({
  attribution,
  currentSurgeon,
  moduleName,
  onVerify,
  compact = false
}) => {
  // If no attribution is passed, provide default based on current surgeon
  const data: DataEntryAttribution = attribution || {
    enteredByName: currentSurgeon.name,
    enteredByDesignation: currentSurgeon.designation,
    enteredAt: '09-Sep-2026, 02:30 PM IST',
    staffTier: currentSurgeon.tier,
    verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' 
      ? 'Verified by Consultant' 
      : 'Pending Consultant Review',
    verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' 
      ? currentSurgeon.name 
      : undefined,
    verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' 
      ? '09-Sep-2026, 02:35 PM IST' 
      : undefined
  };

  const isConsultant = currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON';
  const isVerified = data.verificationStatus === 'Verified by Consultant' || data.verificationStatus === 'Approved & Locked';

  if (compact) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 10px',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '999px',
        fontSize: '11px',
        color: '#515154'
      }}>
        <span style={{ fontWeight: 600, color: '#1d1d1f' }}>Recorded by:</span>
        <span>{data.enteredByName}</span>
        <span style={{ color: '#86868b' }}>•</span>
        <span style={{ color: '#0071e3' }}>{data.enteredByDesignation}</span>
        {isVerified && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            color: '#10b981',
            fontWeight: 600,
            background: 'rgba(16, 185, 129, 0.08)',
            padding: '2px 6px',
            borderRadius: '999px'
          }}>
            <CheckCircle2 size={11} /> Verified
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '10px 16px',
      background: isVerified ? 'rgba(0, 113, 227, 0.03)' : '#fbfbfd',
      border: isVerified ? '1px solid rgba(0, 113, 227, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '12px',
      marginBottom: '16px',
      transition: 'all 0.2s ease'
    }}>
      {/* Left: Staff Entry Information */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isVerified ? 'rgba(0, 113, 227, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          color: isVerified ? '#0071e3' : '#515154',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '12px'
        }}>
          {data.enteredByName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', fontWeight: 600 }}>
              {moduleName} Data Recorded By:
            </span>
            <strong style={{ fontSize: '13px', color: '#1d1d1f', fontWeight: 600 }}>
              {data.enteredByName}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px', fontSize: '12px', color: '#515154' }}>
            <span style={{ color: '#0071e3', fontWeight: 500 }}>
              {data.enteredByDesignation}
            </span>
            <span style={{ color: '#d2d2d7' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#86868b', fontSize: '11px' }}>
              <Clock size={11} />
              {data.enteredAt}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Consultant Verification Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isVerified ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            color: '#065f46',
            fontWeight: 500
          }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>
              <strong>Verified by:</strong> {data.verifiedByConsultant || 'Spine Consultant'} {data.verifiedAt ? `(${data.verifiedAt})` : ''}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.2)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              color: '#c2410c',
              fontWeight: 500
            }}>
              <AlertCircle size={13} color="#ea580c" />
              <span>Pending Consultant Review</span>
            </div>

            {/* If Logged-in Doctor is Tier 1 Consultant, allow 1-click verification */}
            {isConsultant && onVerify && (
              <button
                onClick={onVerify}
                type="button"
                className="btn btn-primary"
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Verify and endorse this entry as Supervising Spine Consultant"
              >
                <UserCheck size={13} />
                <span>Verify & Sign-off as Consultant</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
