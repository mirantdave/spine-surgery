import React from 'react';
import { Wifi, Plus, RefreshCw, Sun, Moon, Search, User, Users, Key, Sparkles } from 'lucide-react';
import { Patient, SurgeonUser } from '../types/spine';

interface NavbarProps {
  onOpenNetworkModal: () => void;
  networkUrl: string;
  onResetDemo: () => void;
  onAddNewPatient: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedPatient?: Patient;
  currentSurgeon: SurgeonUser;
  onOpenHierarchyModal: () => void;
  onOpenStaffDirectory: () => void;
  onOpenSmartAssist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNetworkModal,
  networkUrl,
  onResetDemo,
  onAddNewPatient,
  theme,
  onToggleTheme,
  searchTerm,
  onSearchChange,
  currentSurgeon,
  onOpenHierarchyModal,
  onOpenStaffDirectory,
  onOpenSmartAssist,
}) => {
  const getTierBadge = () => {
    switch (currentSurgeon.tier) {
      case 'CONSULTANT_SPINE_SURGEON':
        return <span className="badge badge-blue" style={{ fontSize: '9px' }}>Consultant</span>;
      case 'JUNIOR_CONSULTANT':
        return <span className="badge badge-green" style={{ fontSize: '9px' }}>Jr. Consultant</span>;
      case 'SENIOR_REGISTRAR':
        return <span className="badge badge-purple" style={{ fontSize: '9px' }}>Sr. Registrar</span>;
      case 'JUNIOR_REGISTRAR':
        return <span className="badge badge-amber" style={{ fontSize: '9px' }}>Jr. Registrar</span>;
      default:
        return null;
    }
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 20px',
      height: '54px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand & WiFi Broadcast */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/stavya-logo.jpg"
            alt="Stavya Spine Hospital"
            style={{
              height: '28px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '4px'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              SpineOS
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
              Stavya Spine
            </span>
          </div>
        </div>

        {/* Minimal WiFi Live Share Pill */}
        <button
          onClick={onOpenNetworkModal}
          style={{
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '4px 10px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="WiFi Live Sync • Click for QR code to open on iPad/Mobile"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#34c759',
            boxShadow: '0 0 6px rgba(52, 199, 89, 0.7)',
            display: 'inline-block'
          }} />
          <Wifi size={12} color="#0071e3" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>{networkUrl.replace('http://', '')}</span>
        </button>
      </div>

      {/* Global Spotlight Search Bar (Apple macOS Style) */}
      <div style={{
        flex: 1,
        maxWidth: '360px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={13} style={{ position: 'absolute', left: '11px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search patient, MRN, diagnosis, levels..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '32px',
            paddingRight: '40px',
            background: '#f2f3f5',
            border: '1px solid transparent',
            color: 'var(--text-primary)',
            fontSize: '12px',
            height: '30px',
            borderRadius: '999px',
            boxShadow: 'none',
            outline: 'none',
            transition: 'background 0.15s ease, border-color 0.15s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.4)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = '#f2f3f5';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        />
        <span style={{
          position: 'absolute',
          right: '8px',
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(0,0,0,0.05)',
          padding: '1px 5px',
          borderRadius: '4px',
          pointerEvents: 'none'
        }}>
          ⌘K
        </span>
      </div>

      {/* Action Buttons & Doctor Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {onOpenSmartAssist && (
          <button
            onClick={onOpenSmartAssist}
            style={{
              height: '30px',
              padding: '0 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #0071e3 0%, #00c7be 100%)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 113, 227, 0.25)',
              transition: 'transform 0.15s ease'
            }}
            title="Open SpineOS AI Sentinel & Clinical Decision Support"
          >
            <Sparkles size={13} />
            <span>AI Sentinel</span>
          </button>
        )}

        <button
          onClick={onAddNewPatient}
          className="btn btn-primary"
          style={{ height: '30px', padding: '0 12px', fontSize: '12px', borderRadius: '999px', gap: '5px' }}
        >
          <Plus size={13} />
          <span>New Patient</span>
        </button>

        {/* Stavya 213 Staff Org Directory */}
        <button
          onClick={onOpenStaffDirectory}
          style={{ 
            height: '30px', 
            padding: '0 10px', 
            fontSize: '11px', 
            borderRadius: '999px', 
            color: 'var(--text-secondary)', 
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.15s ease'
          }}
          title="Browse & search all 213 staff from Stavya Hospital Org Chart"
        >
          <Users size={12} color="#0071e3" />
          <span>Staff (213)</span>
        </button>

        <button
          onClick={onResetDemo}
          style={{
            height: '30px',
            width: '30px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="Reset to realistic demo spine cases"
        >
          <RefreshCw size={12} />
        </button>

        <button
          onClick={onToggleTheme}
          style={{
            height: '30px',
            width: '30px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        {/* Doctor Profile Pill */}
        <button
          onClick={onOpenHierarchyModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            padding: '3px 10px 3px 4px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
          title="Switch logged-in surgeon or view credentials"
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: currentSurgeon.color || '#0071e3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '10px'
          }}>
            {currentSurgeon.initials}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {currentSurgeon.name}
            </span>
            {getTierBadge()}
          </div>
        </button>
      </div>
    </header>
  );
};
