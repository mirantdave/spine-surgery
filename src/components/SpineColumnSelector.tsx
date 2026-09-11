import React from 'react';
import { SpineLevel, SpineRegion } from '../types/spine';
import { Layers, Activity } from 'lucide-react';

interface SpineColumnSelectorProps {
  selectedLevels: SpineLevel[];
  onToggleLevel: (level: SpineLevel) => void;
  primaryRegion?: SpineRegion;
  readOnly?: boolean;
}

const CERVICAL_LEVELS: SpineLevel[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];
const THORACIC_LEVELS: SpineLevel[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
const LUMBAR_LEVELS: SpineLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
const SACRAL_LEVELS: SpineLevel[] = ['S1'];

export const SpineColumnSelector: React.FC<SpineColumnSelectorProps> = ({
  selectedLevels,
  onToggleLevel,
  primaryRegion = 'lumbar',
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = React.useState<SpineRegion>(primaryRegion);

  const getLevelColor = (level: SpineLevel, isSelected: boolean) => {
    if (!isSelected) return '#f5f5f7';
    if (level.startsWith('C')) return '#0071e3';
    if (level.startsWith('T')) return '#af52de';
    if (level.startsWith('L')) return '#0071e3';
    return '#ff9500';
  };

  const getTextColor = (isSelected: boolean) => {
    return isSelected ? '#ffffff' : 'var(--text-primary)';
  };

  const currentLevels = 
    activeTab === 'cervical' ? CERVICAL_LEVELS :
    activeTab === 'thoracic' ? THORACIC_LEVELS :
    activeTab === 'lumbar' ? LUMBAR_LEVELS : SACRAL_LEVELS;

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#0071e3" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Spine Column & Levels
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Targeted:</span>
          <span className="badge badge-blue" style={{ fontSize: '11px' }}>
            {selectedLevels.length > 0 ? selectedLevels.join(', ') : 'None selected'}
          </span>
        </div>
      </div>

      {/* Region selector tabs (Apple Segmented Control) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        background: '#ebebed',
        padding: '3px',
        borderRadius: '8px'
      }}>
        {(['cervical', 'thoracic', 'lumbar', 'sacral'] as SpineRegion[]).map((region) => {
          const isActive = activeTab === region;
          const count = selectedLevels.filter(l => 
            region === 'cervical' ? l.startsWith('C') :
            region === 'thoracic' ? l.startsWith('T') :
            region === 'lumbar' ? l.startsWith('L') : l.startsWith('S')
          ).length;

          return (
            <button
              key={region}
              onClick={() => setActiveTab(region)}
              style={{
                background: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                border: 'none',
                color: isActive ? '#1d1d1f' : '#6e6e73',
                padding: '6px 4px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 500,
                textTransform: 'capitalize',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{region}</span>
              {count > 0 && (
                <span style={{
                  background: 'rgba(0, 113, 227, 0.1)',
                  color: '#0071e3',
                  borderRadius: '999px',
                  padding: '1px 5px',
                  fontSize: '9px',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive vertebrae stack */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxHeight: '260px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {currentLevels.map((lvl, index) => {
          const isSelected = selectedLevels.includes(lvl);
          const nextLvl = currentLevels[index + 1];
          const discLabel = nextLvl ? `${lvl}-${nextLvl}` : null;

          return (
            <React.Fragment key={lvl}>
              {/* Vertebral Body */}
              <div
                onClick={() => !readOnly && onToggleLevel(lvl)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isSelected ? getLevelColor(lvl, isSelected) : '#ffffff',
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-color)',
                  cursor: readOnly ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 113, 227, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px',
                    height: '24px',
                    borderRadius: '4px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#f5f5f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: getTextColor(isSelected)
                  }}>
                    {lvl}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: getTextColor(isSelected) }}>
                      {lvl.startsWith('C') ? `Cervical Vertebra ${lvl}` :
                       lvl.startsWith('T') ? `Thoracic Vertebra ${lvl}` :
                       lvl.startsWith('L') ? `Lumbar Vertebra ${lvl}` : `Sacral Vertebra ${lvl}`}
                    </div>
                    <div style={{ fontSize: '10px', color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>
                      {isSelected ? 'Instrumented / Targeted Level' : 'Intact anatomy'}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={14} color="#ffffff" />
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase' }}>
                      Active Level
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: '#0071e3', fontWeight: 500 }}>+ Select</span>
                )}
              </div>

              {/* Intervertebral Disc representation */}
              {discLabel && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '2px 0'
                }}>
                  <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
                  <span style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    background: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)'
                  }}>
                    Disc {discLabel}
                  </span>
                  <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Preset Quick Actions for routine spine surgeries */}
      {!readOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Common Surgical Presets:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <button
              onClick={() => {
                onToggleLevel('L4');
                onToggleLevel('L5');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              L4-L5 TLIF
            </button>
            <button
              onClick={() => {
                onToggleLevel('C5');
                onToggleLevel('C6');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              C5-C6 ACDF
            </button>
            <button
              onClick={() => {
                onToggleLevel('L5');
                onToggleLevel('S1');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              L5-S1 Microdiscectomy
            </button>
            <button
              onClick={() => {
                ['L2', 'L3', 'L4', 'L5'].forEach(lvl => onToggleLevel(lvl as SpineLevel));
              }}
              className="btn btn-secondary"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              L2-L5 Multi-Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
