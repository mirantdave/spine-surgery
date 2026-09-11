import React, { useState } from 'react';
import { SurgeonUser, SurgeonTier } from '../types/spine';
import { 
  Shield, 
  UserCheck, 
  X, 
  Key, 
  Lock, 
  Check, 
  Copy, 
  Sparkles, 
  Award, 
  Stethoscope, 
  Users,
  ChevronRight,
  LogIn
} from 'lucide-react';

interface SurgeonHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  surgeons: SurgeonUser[];
  currentSurgeon: SurgeonUser;
  onSelectSurgeon: (surgeon: SurgeonUser) => void;
}

export const SurgeonHierarchyModal: React.FC<SurgeonHierarchyModalProps> = ({
  isOpen,
  onClose,
  surgeons,
  currentSurgeon,
  onSelectSurgeon,
}) => {
  const [activeTab, setActiveTab] = useState<'HIERARCHY' | 'LOGIN_FORM'>('HIERARCHY');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom login state
  const [identifier, setIdentifier] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleCopyCredentials = (s: SurgeonUser) => {
    const text = `Doctor: ${s.name}\nUsername: ${s.username}\nPIN: ${s.pin}\nPassword: ${s.password}\nRole: ${s.tierLabel}`;
    navigator.clipboard.writeText(text);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = surgeons.find(
      s => (s.username.toLowerCase() === identifier.trim().toLowerCase() || 
            s.email.toLowerCase() === identifier.trim().toLowerCase()) &&
           (s.password === passwordOrPin.trim() || s.pin === passwordOrPin.trim())
    );

    if (found) {
      onSelectSurgeon(found);
      onClose();
    } else {
      setLoginError('Invalid username/email or password/PIN. Please check the directory.');
    }
  };

  const consultantSurgeons = surgeons.filter(s => s.tier === 'CONSULTANT_SPINE_SURGEON');
  const juniorConsultants = surgeons.filter(s => s.tier === 'JUNIOR_CONSULTANT');
  const seniorRegistrars = surgeons.filter(s => s.tier === 'SENIOR_REGISTRAR');
  const juniorRegistrars = surgeons.filter(s => s.tier === 'JUNIOR_REGISTRAR');

  const getTierBadge = (tier: SurgeonTier) => {
    switch (tier) {
      case 'CONSULTANT_SPINE_SURGEON':
        return <span className="badge badge-blue">Consultant Spine Surgeon</span>;
      case 'JUNIOR_CONSULTANT':
        return <span className="badge badge-green">Junior Consultant</span>;
      case 'SENIOR_REGISTRAR':
        return <span className="badge badge-purple">Senior Registrar</span>;
      case 'JUNIOR_REGISTRAR':
        return <span className="badge badge-amber">Junior Registrar</span>;
      default:
        return <span className="badge badge-blue">{tier}</span>;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '960px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        background: '#ffffff',
        borderRadius: '18px',
        boxShadow: 'var(--shadow-modal)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f5f5f7',
            border: 'none',
            color: '#1d1d1f',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: '#0071e3',
              padding: '11px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0, 113, 227, 0.25)'
            }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Stavya Spine Surgery Hierarchy & Credentials Directory
                </h2>
                <span className="badge badge-blue">10 Surgeons</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Role-based access credentials for all Consultant Spine Surgeons, Junior Consultants, Senior Registrars, and Junior Registrars
              </p>
            </div>
          </div>

          {/* Segmented Control */}
          <div style={{ display: 'flex', background: '#ebebed', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveTab('HIERARCHY')}
              style={{
                background: activeTab === 'HIERARCHY' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'HIERARCHY' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                border: 'none',
                color: activeTab === 'HIERARCHY' ? '#1d1d1f' : '#6e6e73',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: activeTab === 'HIERARCHY' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Hierarchy Directory & Quick Switch
            </button>
            <button
              onClick={() => setActiveTab('LOGIN_FORM')}
              style={{
                background: activeTab === 'LOGIN_FORM' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'LOGIN_FORM' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                border: 'none',
                color: activeTab === 'LOGIN_FORM' ? '#1d1d1f' : '#6e6e73',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: activeTab === 'LOGIN_FORM' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Manual PIN / Password Login
            </button>
          </div>
        </div>

        {/* Current Active Surgeon Card */}
        <div style={{
          background: 'rgba(0, 113, 227, 0.05)',
          border: '1px solid rgba(0, 113, 227, 0.2)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: currentSurgeon.color || '#0071e3',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700
            }}>
              {currentSurgeon.initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Active Logged-In: {currentSurgeon.name}
                </span>
                {getTierBadge(currentSurgeon.tier)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {currentSurgeon.designation} • Username: <code style={{ color: '#0071e3', fontWeight: 600 }}>{currentSurgeon.username}</code> • PIN: <code style={{ color: '#28a745', fontWeight: 600 }}>{currentSurgeon.pin}</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: currentSurgeon.canApproveOTNotes ? 'rgba(52, 199, 89, 0.1)' : '#f5f5f7',
              color: currentSurgeon.canApproveOTNotes ? '#28a745' : 'var(--text-muted)',
              border: currentSurgeon.canApproveOTNotes ? '1px solid rgba(52, 199, 89, 0.25)' : '1px solid var(--border-color)',
              fontWeight: 600
            }}>
              {currentSurgeon.canApproveOTNotes ? '✓ Can Sign & Lock OT Notes' : 'Co-Sign Required'}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: currentSurgeon.canFinalizeDischarge ? 'rgba(52, 199, 89, 0.1)' : '#f5f5f7',
              color: currentSurgeon.canFinalizeDischarge ? '#28a745' : 'var(--text-muted)',
              border: currentSurgeon.canFinalizeDischarge ? '1px solid rgba(52, 199, 89, 0.25)' : '1px solid var(--border-color)',
              fontWeight: 600
            }}>
              {currentSurgeon.canFinalizeDischarge ? '✓ Can Finalize Discharge' : 'Consultant Review'}
            </span>
          </div>
        </div>

        {/* TAB 1: Complete Hierarchy Directory View */}
        {activeTab === 'HIERARCHY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* TIER 1: Consultant Spine Surgeons (5) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#0071e3" />
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0071e3', letterSpacing: '-0.01em' }}>
                    1. Consultant Spine Surgeons (5)
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Full Surgical, OT Approval & Discharge Authority
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {consultantSurgeons.map((s) => {
                  const isCurrent = s.id === currentSurgeon.id;

                  return (
                    <div
                      key={s.id}
                      style={{
                        background: isCurrent ? 'rgba(0, 113, 227, 0.05)' : '#ffffff',
                        border: isCurrent ? '1px solid #0071e3' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {s.name}
                          </span>
                          {isCurrent && <span className="badge badge-green" style={{ fontSize: '9px' }}>Current</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#0071e3', fontWeight: 600 }}>
                          {s.designation} {s.governanceRole ? `(${s.governanceRole})` : ''}
                        </div>

                        {/* Credentials box */}
                        <div style={{
                          background: '#f5f5f7',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          padding: '6px 10px',
                          marginTop: '8px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}>
                          <div>Username: <strong style={{ color: '#1d1d1f' }}>{s.username}</strong></div>
                          <div>PIN: <strong style={{ color: '#0071e3' }}>{s.pin}</strong> | Pwd: <span style={{ color: '#6e6e73' }}>{s.password}</span></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            onSelectSurgeon(s);
                            onClose();
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '5px 10px', fontSize: '11px' }}
                        >
                          <UserCheck size={13} />
                          <span>{isCurrent ? 'Active Now' : 'Login as Dr. ' + s.name.split(' ')[1]}</span>
                        </button>
                        <button
                          onClick={() => handleCopyCredentials(s)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '11px' }}
                          title="Copy credentials"
                        >
                          {copiedId === s.id ? <Check size={13} color="#0071e3" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIER 2: Junior Consultants (1) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Stethoscope size={18} color="#28a745" />
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#28a745', letterSpacing: '-0.01em' }}>
                    2. Junior Consultants (1)
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Surgical Procedures & Clinical Ward Leadership
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {juniorConsultants.map((s) => {
                  const isCurrent = s.id === currentSurgeon.id;

                  return (
                    <div
                      key={s.id}
                      style={{
                        background: isCurrent ? 'rgba(52, 199, 89, 0.05)' : '#ffffff',
                        border: isCurrent ? '1px solid #34c759' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {s.name}
                          </span>
                          {isCurrent && <span className="badge badge-green" style={{ fontSize: '9px' }}>Current</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#28a745', fontWeight: 600 }}>
                          {s.designation}
                        </div>

                        <div style={{
                          background: '#f5f5f7',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          padding: '6px 10px',
                          marginTop: '8px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}>
                          <div>Username: <strong style={{ color: '#1d1d1f' }}>{s.username}</strong></div>
                          <div>PIN: <strong style={{ color: '#28a745' }}>{s.pin}</strong> | Pwd: <span style={{ color: '#6e6e73' }}>{s.password}</span></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            onSelectSurgeon(s);
                            onClose();
                          }}
                          className={isCurrent ? "btn btn-success" : "btn btn-secondary"}
                          style={{ flex: 1, padding: '5px 10px', fontSize: '11px' }}
                        >
                          <UserCheck size={13} />
                          <span>{isCurrent ? 'Active Now' : 'Login as Dr. ' + s.name.split(' ')[1]}</span>
                        </button>
                        <button
                          onClick={() => handleCopyCredentials(s)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '11px' }}
                          title="Copy credentials"
                        >
                          {copiedId === s.id ? <Check size={13} color="#28a745" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIER 3: Senior Registrars (2) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color="#af52de" />
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#af52de', letterSpacing: '-0.01em' }}>
                    3. Senior Registrars (2)
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Inpatient Ward Rounds, Pre-op Workups & Operative Assistance
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {seniorRegistrars.map((s) => {
                  const isCurrent = s.id === currentSurgeon.id;

                  return (
                    <div
                      key={s.id}
                      style={{
                        background: isCurrent ? 'rgba(175, 82, 222, 0.05)' : '#ffffff',
                        border: isCurrent ? '1px solid #af52de' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {s.name}
                          </span>
                          {isCurrent && <span className="badge badge-green" style={{ fontSize: '9px' }}>Current</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#af52de', fontWeight: 600 }}>
                          {s.designation}
                        </div>

                        <div style={{
                          background: '#f5f5f7',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          padding: '6px 10px',
                          marginTop: '8px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}>
                          <div>Username: <strong style={{ color: '#1d1d1f' }}>{s.username}</strong></div>
                          <div>PIN: <strong style={{ color: '#af52de' }}>{s.pin}</strong> | Pwd: <span style={{ color: '#6e6e73' }}>{s.password}</span></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            onSelectSurgeon(s);
                            onClose();
                          }}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '5px 10px', fontSize: '11px', color: isCurrent ? '#af52de' : 'var(--text-primary)' }}
                        >
                          <UserCheck size={13} />
                          <span>{isCurrent ? 'Active Now' : 'Login as Dr. ' + s.name.split(' ')[1]}</span>
                        </button>
                        <button
                          onClick={() => handleCopyCredentials(s)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '11px' }}
                          title="Copy credentials"
                        >
                          {copiedId === s.id ? <Check size={13} color="#af52de" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIER 4: Junior Registrars (2) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color="#ff9500" />
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#ff9500', letterSpacing: '-0.01em' }}>
                    4. Junior Registrars (2)
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Daily Vitals, Drain Tracking, Neuro Scoring & WHO Safety Checklist
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {juniorRegistrars.map((s) => {
                  const isCurrent = s.id === currentSurgeon.id;

                  return (
                    <div
                      key={s.id}
                      style={{
                        background: isCurrent ? 'rgba(255, 149, 0, 0.05)' : '#ffffff',
                        border: isCurrent ? '1px solid #ff9500' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {s.name}
                          </span>
                          {isCurrent && <span className="badge badge-green" style={{ fontSize: '9px' }}>Current</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#ff9500', fontWeight: 600 }}>
                          {s.designation}
                        </div>

                        <div style={{
                          background: '#f5f5f7',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          padding: '6px 10px',
                          marginTop: '8px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}>
                          <div>Username: <strong style={{ color: '#1d1d1f' }}>{s.username}</strong></div>
                          <div>PIN: <strong style={{ color: '#ff9500' }}>{s.pin}</strong> | Pwd: <span style={{ color: '#6e6e73' }}>{s.password}</span></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            onSelectSurgeon(s);
                            onClose();
                          }}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '5px 10px', fontSize: '11px', color: isCurrent ? '#ff9500' : 'var(--text-primary)' }}
                        >
                          <UserCheck size={13} />
                          <span>{isCurrent ? 'Active Now' : 'Login as Dr. ' + s.name.split(' ')[1]}</span>
                        </button>
                        <button
                          onClick={() => handleCopyCredentials(s)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '11px' }}
                          title="Copy credentials"
                        >
                          {copiedId === s.id ? <Check size={13} color="#ff9500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Manual Login Form */}
        {activeTab === 'LOGIN_FORM' && (
          <form onSubmit={handleManualLogin} style={{ maxWidth: '420px', margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                padding: '10px 16px',
                borderRadius: '12px',
                marginBottom: '14px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)'
              }}>
                <img
                  src="/stavya-logo.jpg"
                  alt="Stavya Spine Hospital"
                  style={{ height: '40px', width: 'auto', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Surgeon Portal Sign In
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Enter your Stavya doctor username or email and 4-digit PIN / password
              </p>
            </div>

            {loginError && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Username or Email (e.g. drbharatdave, drmirantdave, drarijit)
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Username or stavya.org email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Password or 4-Digit Quick PIN (e.g. 1001, 1002, 3001)
              </label>
              <input
                type="password"
                required
                value={passwordOrPin}
                onChange={e => setPasswordOrPin(e.target.value)}
                placeholder="PIN or password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
              <LogIn size={15} />
              <span>Authenticate & Enter SpineOS</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
