import React, { useState } from 'react';
import { Wifi, Plus, RefreshCw, Sun, Moon, Search, Users, Sparkles, MoreHorizontal } from 'lucide-react';
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
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 20px',
      height: '52px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <img
            src="/stavya-logo.jpg"
            alt="Stavya Spine Hospital"
            style={{
              height: '26px',
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
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Stavya
            </span>
          </div>
        </div>

        {/* Minimal WiFi Live Sync Pill */}
        <button
          onClick={onOpenNetworkModal}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '3px 9px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="WiFi Sync Active • Click for connection details"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#34c759',
            display: 'inline-block'
          }} />
          <Wifi size={11} color="#0071e3" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
            {networkUrl ? networkUrl.replace(/^https?:\/\//, '') : 'Sync'}
          </span>
        </button>
      </div>

      {/* Global Spotlight Search Bar (Apple Style) */}
      <div style={{
        flex: 1,
        maxWidth: '380px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={13} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search patient, MRN, diagnosis, level (e.g. L4-L5)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '32px',
            paddingRight: '36px',
            background: '#f4f5f7',
            border: '1px solid transparent',
            color: 'var(--text-primary)',
            fontSize: '12px',
            height: '32px',
            borderRadius: '999px',
            outline: 'none',
            transition: 'all 0.15s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#0071e3';
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = '#f4f5f7';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        />
        <span style={{
          position: 'absolute',
          right: '9px',
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

      {/* Right Controls: AI Assistant, New Patient, Tools Overflow, Surgeon Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, position: 'relative' }}>
        {onOpenSmartAssist && (
          <button
            onClick={onOpenSmartAssist}
            style={{
              height: '32px',
              padding: '0 12px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '999px',
              background: 'rgba(0, 113, 227, 0.08)',
              color: '#0071e3',
              border: '1px solid rgba(0, 113, 227, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="SpineOS Clinical Decision Support & AI Risk Review"
          >
            <Sparkles size={13} />
            <span>AI Risk Check</span>
          </button>
        )}

        <button
          onClick={onAddNewPatient}
          className="btn btn-primary"
          style={{ height: '32px', padding: '0 14px', fontSize: '12px', borderRadius: '999px', gap: '5px' }}
        >
          <Plus size={13} />
          <span>New Patient</span>
        </button>

        {/* Minimal Tools Overflow Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setToolsMenuOpen(prev => !prev)}
            style={{
              height: '32px',
              width: '32px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: toolsMenuOpen ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Hospital tools & preferences"
          >
            <MoreHorizontal size={14} />
          </button>

          {toolsMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '210px',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 200
              }}
              onMouseLeave={() => setToolsMenuOpen(false)}
            >
              <button
                onClick={() => {
                  onOpenStaffDirectory();
                  setToolsMenuOpen(false);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Users size={14} color="#0071e3" />
                <span>Staff Directory (213)</span>
              </button>

              <button
                onClick={() => {
                  onToggleTheme();
                  setToolsMenuOpen(false);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#6366f1" />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <button
                onClick={() => {
                  onResetDemo();
                  setToolsMenuOpen(false);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <RefreshCw size={14} />
                <span>Reset Demo Records</span>
              </button>
            </div>
          )}
        </div>

        {/* Surgeon Profile Pill */}
        <button
          onClick={onOpenHierarchyModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-secondary)',
            padding: '3px 10px 3px 4px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
          title="Switch logged-in surgeon or review permissions"
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
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            {currentSurgeon.name.replace('Dr. ', '')}
          </span>
        </button>
      </div>
    </header>
  );
};
