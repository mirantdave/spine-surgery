import React, { useState } from 'react';
import { Patient } from '../types/spine';
import { PathwayDayRecord, PathwayGoalItem, PathwayDayId } from '../types/carePathway';
import { getPatientCarePathway } from '../data/patientCareData';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Activity, 
  Heart, 
  Footprints, 
  Utensils, 
  Droplets, 
  UserCheck, 
  ChevronRight, 
  Layers,
  Sparkles,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

interface CarePathwayTimelineProps {
  patient: Patient;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const CarePathwayTimeline: React.FC<CarePathwayTimelineProps> = ({ patient, onOpenProtocol }) => {
  const [pathway, setPathway] = useState<PathwayDayRecord[]>(() => getPatientCarePathway(patient));
  const [selectedDayId, setSelectedDayId] = useState<PathwayDayId>('day-2'); // Default to POD 2 (active day)
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');

  // Sync pathway if patient changes
  React.useEffect(() => {
    setPathway(getPatientCarePathway(patient));
  }, [patient]);

  const activeDay = pathway.find(d => d.id === selectedDayId) || pathway[3];

  const handleToggleGoal = (dayId: PathwayDayId, goalId: string) => {
    setPathway(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        goals: day.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
      };
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="pathway"
        pinnedCodes={['STV-SP-POST-01', 'STV-SP-POST-05']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Top Header Card - Apple Minimalist Style */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0071e3',
              boxShadow: '0 0 8px #0071e3'
            }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Spine Surgical Clinical Care Pathway
            </h3>
            <span style={{
              background: 'rgba(0, 113, 227, 0.08)',
              color: '#0071e3',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              Evidence-Based Fast Track
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Day-wise perioperative milestones from admission workup through surgical execution and hospital discharge.
          </div>
        </div>

        {/* View Mode Toggle: Day by Day vs Full Timeline */}
        <div style={{
          display: 'flex',
          gap: '2px',
          background: '#f4f5f7',
          padding: '3px',
          borderRadius: '10px'
        }}>
          <button
            onClick={() => setViewMode('focused')}
            style={{
              border: 'none',
              background: viewMode === 'focused' ? '#ffffff' : 'transparent',
              color: viewMode === 'focused' ? '#1d1d1f' : '#6e6e73',
              boxShadow: viewMode === 'focused' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: viewMode === 'focused' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Day-by-Day View
          </button>
          <button
            onClick={() => setViewMode('all')}
            style={{
              border: 'none',
              background: viewMode === 'all' ? '#ffffff' : 'transparent',
              color: viewMode === 'all' ? '#1d1d1f' : '#6e6e73',
              boxShadow: viewMode === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: viewMode === 'all' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Full Pathway Overview
          </button>
        </div>
      </div>

      {/* Horizontal Apple-Style Day Stepper / Picker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px'
      }}>
        {pathway.map((day) => {
          const isSelected = day.id === selectedDayId && viewMode === 'focused';
          const isCompleted = day.status === 'Completed';
          const isInProgress = day.status === 'In Progress';

          return (
            <div
              key={day.id}
              onClick={() => {
                setSelectedDayId(day.id);
                setViewMode('focused');
              }}
              style={{
                background: isSelected ? 'rgba(0, 113, 227, 0.04)' : '#ffffff',
                border: isSelected ? '2px solid #0071e3' : '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 113, 227, 0.1)' : '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: isSelected ? '#0071e3' : 'var(--text-secondary)'
                }}>
                  {day.dayLabel}
                </span>
                {isCompleted ? (
                  <CheckCircle2 size={15} color="#34c759" />
                ) : isInProgress ? (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#0071e3',
                    boxShadow: '0 0 6px #0071e3'
                  }} />
                ) : (
                  <Circle size={14} color="#d1d5db" />
                )}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {day.phase}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{day.date}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 5px',
                  borderRadius: '999px',
                  background: isCompleted ? 'rgba(52, 199, 89, 0.1)' : isInProgress ? 'rgba(0, 113, 227, 0.1)' : '#f3f4f6',
                  color: isCompleted ? '#28a745' : isInProgress ? '#0071e3' : '#6b7280'
                }}>
                  {day.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      {viewMode === 'focused' ? (
        /* Focused Single Day View */
        <DayDetailCard 
          day={activeDay} 
          onToggleGoal={(gId) => handleToggleGoal(activeDay.id, gId)}
        />
      ) : (
        /* Full Vertical Timeline Overview */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pathway.map((day) => (
            <DayDetailCard 
              key={day.id} 
              day={day} 
              onToggleGoal={(gId) => handleToggleGoal(day.id, gId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SINGLE DAY DETAIL CARD (CLEAN & BREATHABLE)
// ============================================================================

interface DayDetailCardProps {
  day: PathwayDayRecord;
  onToggleGoal: (goalId: string) => void;
}

const DayDetailCard: React.FC<DayDetailCardProps> = ({ day, onToggleGoal }) => {
  const completedGoalsCount = day.goals.filter(g => g.completed).length;
  const progressPercent = Math.round((completedGoalsCount / (day.goals.length || 1)) * 100);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      padding: '20px 24px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      {/* Day Top Line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '14px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'rgba(0, 113, 227, 0.1)',
            color: '#0071e3',
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: '999px'
          }}>
            {day.dayLabel}
          </span>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {day.title}
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Phase: <strong>{day.phase}</strong> • Date: {day.date}
            </span>
          </div>
        </div>

        {/* Milestones Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Milestones Achieved
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0071e3' }}>
              {completedGoalsCount} of {day.goals.length} ({progressPercent}%)
            </div>
          </div>
          <div style={{
            width: '80px',
            height: '8px',
            background: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent === 100 ? '#34c759' : '#0071e3',
              borderRadius: '999px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Clinical Metrics Strip (Vitals, Pain, Drain, Mobility) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px'
      }}>
        {/* Vitals */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '12px 14px',
          border: '1px solid #eef2f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
            <Heart size={13} color="#ef4444" />
            <span>Blood Pressure & Pulse</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {day.vitals.bloodPressure}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Pulse: {day.vitals.pulse} bpm • SpO2: {day.vitals.spo2}%
          </div>
        </div>

        {/* VAS Pain Score */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '12px 14px',
          border: '1px solid #eef2f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
            <Activity size={13} color="#f59e0b" />
            <span>VAS Pain Score</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: day.vitals.vasPainScore <= 3 ? '#16a34a' : '#d97706' }}>
              {day.vitals.vasPainScore}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 10</span>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '999px',
              background: day.vitals.vasPainScore <= 3 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: day.vitals.vasPainScore <= 3 ? '#16a34a' : '#d97706'
            }}>
              {day.vitals.vasPainScore <= 3 ? 'Mild / Well Controlled' : 'Moderate'}
            </span>
          </div>
        </div>

        {/* Mobility Status */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '12px 14px',
          border: '1px solid #eef2f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
            <Footprints size={13} color="#0071e3" />
            <span>Physiotherapy & Mobility</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.4' }}>
            {day.mobilityStatus}
          </div>
        </div>

        {/* Drain / Diet */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '12px 14px',
          border: '1px solid #eef2f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
            <Droplets size={13} color="#0284c7" />
            <span>Surgical Drain Output</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {day.drainOutputMl !== undefined ? `${day.drainOutputMl} ml/24h` : 'No drain'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {day.drainStatus || 'Monitored'}
          </div>
        </div>
      </div>

      {/* Clinical Milestones Checklist */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckSquare size={14} color="#0071e3" />
          <span>Care Pathway Clinical Milestones & Checklist</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {day.goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => onToggleGoal(goal.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '10px',
                background: goal.completed ? 'rgba(52, 199, 89, 0.04)' : '#ffffff',
                border: goal.completed ? '1px solid rgba(52, 199, 89, 0.25)' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => {}} // handled by parent onClick
                  style={{ cursor: 'pointer', accentColor: '#0071e3' }}
                />
                <span style={{
                  fontSize: '12.5px',
                  color: goal.completed ? '#1f2937' : '#4b5563',
                  textDecoration: goal.completed ? 'none' : 'none',
                  fontWeight: goal.completed ? 600 : 400
                }}>
                  {goal.title}
                </span>
              </div>

              {goal.completedBy && (
                <span style={{
                  fontSize: '11px',
                  color: '#059669',
                  background: 'rgba(5, 150, 105, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <UserCheck size={11} />
                  {goal.completedBy}
                </span>
              )}

              {goal.notes && !goal.completed && (
                <span style={{ fontSize: '11px', color: '#d97706', fontStyle: 'italic' }}>
                  {goal.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Narrative Clinical Notes & Staff Attribution */}
      <div style={{
        background: '#fcfcfd',
        borderRadius: '12px',
        padding: '12px 16px',
        border: '1px solid #eef2f6',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            Daily Spine Consultant Notes
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            {day.clinicalNotes}
          </p>
        </div>

        {/* Responsible Staff Stamps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Care Team on Duty
          </div>
          {day.attendingStaff.map((staff, idx) => (
            <div key={idx} style={{ fontSize: '11px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#0071e3' }}>•</span>
              <strong>{staff.name}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>({staff.designation})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
