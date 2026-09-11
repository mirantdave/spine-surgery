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
  const [activeTab, setActiveTab] = useState<'HIERARCHY' | 'LOGIN_FORM' | 'CREDENTIALS_TABLE'>('HIERARCHY');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  
  // Custom login state
  const [identifier, setIdentifier] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleCopyCredentials = (s: SurgeonUser) => {
    const text = `Doctor: ${s.name}\nTier: ${s.tierLabel}\nEmail: ${s.email}\nUsername: ${s.username}\nQuick PIN: ${s.pin}\nPassword: ${s.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), passwordOrPin: passwordOrPin.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          onSelectSurgeon(data.user);
          onClose();
          return;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setLoginError(errData.error || 'Invalid credentials or PIN.');
        return;
      }
    } catch {
      // Offline fallback
    }

    const found = surgeons.find(
      s => (s.username.toLowerCase() === identifier.trim().toLowerCase() || 
            s.email.toLowerCase() === identifier.trim().toLowerCase()) &&
           (s.password === passwordOrPin.trim() || s.pin === passwordOrPin.trim())
    );

    if (found) {
      onSelectSurgeon(found);
      onClose();
    } else {
      setLoginError('Invalid username/email or password/PIN. Please check the credentials table.');
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
            <button
              onClick={() => setActiveTab('CREDENTIALS_TABLE')}
              style={{
                background: activeTab === 'CREDENTIALS_TABLE' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'CREDENTIALS_TABLE' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                border: 'none',
                color: activeTab === 'CREDENTIALS_TABLE' ? '#1d1d1f' : '#6e6e73',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: activeTab === 'CREDENTIALS_TABLE' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              All 10 Doctor Credentials
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

        {/* Tab 3: All 10 Credentials Reference Table */}
        {activeTab === 'CREDENTIALS_TABLE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#f5f5f7',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f', marginBottom: '2px' }}>
                  Stavya Spine Institute — Staff Credentials Directory
                </h3>
                <p style={{ fontSize: '12px', color: '#6e6e73' }}>
                  Complete login credentials for all 10 spine doctors. Each doctor can log in using their username, email, or 4-digit PIN.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search by doctor, username, or PIN..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  background: '#ffffff',
                  minWidth: '240px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              overflowX: 'auto',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: '#ffffff'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f5f5f7', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', color: '#6e6e73', fontWeight: 600 }}>
                    <th style={{ padding: '10px 14px' }}>Surgeon / Doctor</th>
                    <th style={{ padding: '10px 14px' }}>Hierarchy Tier</th>
                    <th style={{ padding: '10px 14px' }}>Username / Email</th>
                    <th style={{ padding: '10px 14px' }}>Quick PIN</th>
                    <th style={{ padding: '10px 14px' }}>Password</th>
                    <th style={{ padding: '10px 14px' }}>Privileges</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {surgeons
                    .filter(s => {
                      if (!filterQuery) return true;
                      const q = filterQuery.toLowerCase();
                      return (
                        s.name.toLowerCase().includes(q) ||
                        s.username.toLowerCase().includes(q) ||
                        s.email.toLowerCase().includes(q) ||
                        s.pin.includes(q) ||
                        s.tierLabel.toLowerCase().includes(q)
                      );
                    })
                    .map((s, idx) => {
                      const isCurrent = s.id === currentSurgeon.id;
                      const avatarColors: Record<SurgeonTier, { bg: string; color: string }> = {
                        CONSULTANT_SPINE_SURGEON: { bg: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' },
                        JUNIOR_CONSULTANT: { bg: 'rgba(52, 199, 89, 0.1)', color: '#28a745' },
                        SENIOR_REGISTRAR: { bg: 'rgba(175, 82, 222, 0.1)', color: '#af52de' },
                        JUNIOR_REGISTRAR: { bg: 'rgba(255, 149, 0, 0.1)', color: '#d97706' },
                        DIRECTOR_QUALITY: { bg: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }
                      };
                      const avatarStyle = avatarColors[s.tier] || { bg: '#f5f5f7', color: '#1d1d1f' };

                      return (
                        <tr
                          key={s.id}
                          style={{
                            borderBottom: idx === surgeons.length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
                            background: isCurrent ? 'rgba(0, 113, 227, 0.04)' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          {/* Doctor name */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: avatarStyle.bg,
                                color: avatarStyle.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '11px'
                              }}>
                                {s.name.replace('Dr. ', '').charAt(0)}
                              </span>
                              <div>
                                <div style={{ fontWeight: 600, color: '#1d1d1f' }}>
                                  {s.name}
                                  {isCurrent && (
                                    <span style={{
                                      marginLeft: '6px',
                                      fontSize: '10px',
                                      color: '#0071e3',
                                      fontWeight: 700,
                                      background: 'rgba(0, 113, 227, 0.1)',
                                      padding: '2px 6px',
                                      borderRadius: '4px'
                                    }}>
                                      Active
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '11px', color: '#86868b' }}>
                                  {s.designation}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Tier */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            {getTierBadge(s.tier)}
                          </td>

                          {/* Username & Email */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#1d1d1f', fontSize: '12px' }}>
                              {s.username}
                            </div>
                            <div style={{ fontSize: '11px', color: '#86868b' }}>
                              {s.email}
                            </div>
                          </td>

                          {/* PIN */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            <span style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '13px',
                              fontWeight: 700,
                              background: '#f5f5f7',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                              color: '#1d1d1f',
                              letterSpacing: '0.05em'
                            }}>
                              {s.pin}
                            </span>
                          </td>

                          {/* Password */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            <span style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '11px',
                              background: '#f5f5f7',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              color: '#424245'
                            }}>
                              {s.password}
                            </span>
                          </td>

                          {/* Privileges */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '11px', color: '#515154', maxWidth: '220px' }}>
                              {s.tier === 'CONSULTANT_SPINE_SURGEON' && 'Full Surgical, OT & Discharge sign-off authority'}
                              {s.tier === 'JUNIOR_CONSULTANT' && 'Surgical procedures, IPD & Discharge drafts'}
                              {s.tier === 'SENIOR_REGISTRAR' && 'Inpatient care, Round entries & WHO safety'}
                              {s.tier === 'JUNIOR_REGISTRAR' && 'Ward monitoring, pre-op checks & vitals'}
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => handleCopyCredentials(s)}
                                title="Copy all login credentials"
                                style={{
                                  background: copiedId === s.id ? 'rgba(52, 199, 89, 0.15)' : '#f5f5f7',
                                  color: copiedId === s.id ? '#34c759' : '#1d1d1f',
                                  border: '1px solid rgba(0, 0, 0, 0.08)',
                                  padding: '5px 9px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {copiedId === s.id ? <Check size={12} /> : <Copy size={12} />}
                                <span>{copiedId === s.id ? 'Copied' : 'Copy'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  onSelectSurgeon(s);
                                  onClose();
                                }}
                                style={{
                                  background: isCurrent ? 'rgba(0, 113, 227, 0.1)' : '#0071e3',
                                  color: isCurrent ? '#0071e3' : '#ffffff',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <LogIn size={12} />
                                <span>{isCurrent ? 'Logged In' : 'Sign In'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
