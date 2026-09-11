import React, { useState } from 'react';
import { Patient, WardRoundEntry, SurgeonUser, DataEntryAttribution } from '../types/spine';
import { DataAttributionBadge } from './DataAttributionBadge';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  ClipboardList, 
  Plus, 
  Droplet, 
  Footprints, 
  HeartPulse, 
  CheckCircle2, 
  Calendar, 
  User, 
  Clock 
} from 'lucide-react';

interface WardRoundsTrackerProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onAddRound: (round: WardRoundEntry) => Promise<void>;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const WardRoundsTracker: React.FC<WardRoundsTrackerProps> = ({
  patient,
  currentSurgeon,
  onAddRound,
  onOpenProtocol,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [postOpDay, setPostOpDay] = useState<string>('POD 2');
  const [author, setAuthor] = useState<string>(`${currentSurgeon.name} (${currentSurgeon.designation})`);
  const [bp, setBp] = useState<string>('124/78 mmHg');
  const [pulse, setPulse] = useState<number>(72);
  const [spo2, setSpo2] = useState<number>(99);
  const [temp, setTemp] = useState<number>(98.4);
  const [drainOutput, setDrainOutput] = useState<number>(20);
  const [drainStatus, setDrainStatus] = useState<WardRoundEntry['drainStatus']>('Active Suction');
  const [woundStatus, setWoundStatus] = useState<WardRoundEntry['woundStatus']>('Clean, dry, intact dressing');
  const [motorExam, setMotorExam] = useState<string>('Bilateral EHL 5/5, TA 5/5, Quadriceps 5/5');
  const [sensoryExam, setSensoryExam] = useState<string>('Normal dermatomal sensation bilaterally');
  const [mobilization, setMobilization] = useState<WardRoundEntry['mobilizationStatus']>('Walking independently with LSO brace');
  const [bowelBladder, setBowelBladder] = useState<WardRoundEntry['bowelBladder']>('Catheter removed, voiding clear');
  const [painVAS, setPainVAS] = useState<number>(2);
  const [plan, setPlan] = useState<string>('Continue mobilization. If drain < 30ml in 24h, remove drain. Prepare for discharge.');

  const rounds = patient.wardRounds || [];

  const handleCreateRound = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const nowStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const newEntry: WardRoundEntry = {
      id: `round-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      postOpDay,
      author: `${currentSurgeon.name} (${currentSurgeon.designation})`,
      vitals: { bloodPressure: bp, pulse, spo2, temperature: temp },
      drainOutput24hMl: drainOutput,
      drainStatus,
      woundStatus,
      motorExam,
      sensoryExam,
      mobilizationStatus: mobilization,
      bowelBladder,
      painScoreVAS: painVAS,
      plan,
      entryAttribution: {
        enteredByName: currentSurgeon.name,
        enteredByDesignation: currentSurgeon.designation,
        staffTier: currentSurgeon.tier,
        enteredAt: nowStr,
        verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? 'Verified by Consultant' : 'Pending Consultant Review',
        verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? currentSurgeon.name : undefined,
        verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? nowStr : undefined
      }
    };

    try {
      await onAddRound(newEntry);
      setSaveSuccess(true);
      setShowAddForm(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to add ward round:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="inpatient:rounds"
        pinnedCodes={['STV-SP-POST-01', 'STV-SP-POST-04']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            padding: '8px',
            borderRadius: '10px'
          }}>
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Inpatient Spine Ward Rounds & Drain Progression
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Daily neurological recovery documentation, drain output tracking, and mobilization milestones
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          <Plus size={14} />
          <span>{showAddForm ? 'Cancel New Note' : 'Add Daily Ward Round'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} />
          <span>Ward round note saved and synchronized across all WiFi devices.</span>
        </div>
      )}

      {/* Add New Ward Round Entry Form */}
      {showAddForm && (
        <form onSubmit={handleCreateRound} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #0071e3' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0071e3' }}>
            New Spine Surgical Daily Note
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Post-Op Day</label>
              <select value={postOpDay} onChange={e => setPostOpDay(e.target.value)}>
                <option value="POD 0">POD 0 (Evening of Surgery)</option>
                <option value="POD 1">POD 1</option>
                <option value="POD 2">POD 2</option>
                <option value="POD 3">POD 3</option>
                <option value="POD 4+">POD 4+</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Examining Surgeon / Author</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Blood Pressure & Pulse</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" value={bp} onChange={e => setBp(e.target.value)} placeholder="120/80" />
                <input type="number" value={pulse} onChange={e => setPulse(parseInt(e.target.value, 10))} placeholder="72 bpm" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>SpO2 & Temp (°F)</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="number" value={spo2} onChange={e => setSpo2(parseInt(e.target.value, 10))} placeholder="99%" />
                <input type="number" step="0.1" value={temp} onChange={e => setTemp(parseFloat(e.target.value))} placeholder="98.4" />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontSize: '12px' }}>
            {/* Drain Status */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                24h Drain Volume (ml) & Status
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  value={drainOutput}
                  onChange={e => setDrainOutput(parseInt(e.target.value, 10) || 0)}
                  placeholder="Output ml"
                />
                <select value={drainStatus} onChange={e => setDrainStatus(e.target.value as any)}>
                  <option value="Active Suction">Active Suction</option>
                  <option value="Gravity">Gravity</option>
                  <option value="Clamped">Clamped</option>
                  <option value="Removed Today">Removed Today</option>
                  <option value="No Drain">No Drain</option>
                </select>
              </div>
              <span style={{ fontSize: '10px', color: drainOutput < 30 ? '#34d399' : '#fbbf24', marginTop: '3px', display: 'block' }}>
                {drainOutput < 30 ? '✓ Drain output < 30ml: Safe for removal' : 'Drain output > 30ml: Continue suction'}
              </span>
            </div>

            {/* Mobilization Milestone */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Mobilization Milestone</label>
              <select value={mobilization} onChange={e => setMobilization(e.target.value as any)}>
                <option value="Bed rest / Log rolling">Bed rest / Log rolling</option>
                <option value="Sitting on edge of bed">Sitting on edge of bed</option>
                <option value="Standing with high walker">Standing with high walker</option>
                <option value="Walking independently with LSO brace">Walking independently with LSO brace</option>
                <option value="Climbing stairs">Climbing stairs</option>
              </select>
            </div>

            {/* Wound Status */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Surgical Dressing / Wound</label>
              <select value={woundStatus} onChange={e => setWoundStatus(e.target.value as any)}>
                <option value="Clean, dry, intact dressing">Clean, dry, intact dressing</option>
                <option value="Minimal serosanguinous soakage">Minimal serosanguinous soakage</option>
                <option value="Sutures clean">Sutures clean</option>
                <option value="Redness / Induration">Redness / Induration</option>
              </select>
            </div>

            {/* Bowel & Bladder */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Bowel & Bladder Function</label>
              <select value={bowelBladder} onChange={e => setBowelBladder(e.target.value as any)}>
                <option value="Passing flatus, Foley catheter in situ">Passing flatus, Foley catheter in situ</option>
                <option value="Catheter removed, voiding clear">Catheter removed, voiding clear</option>
                <option value="Normal bowel movement">Normal bowel movement</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Neurological Motor & Sensory Exam</label>
            <input type="text" value={motorExam} onChange={e => setMotorExam(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Ward Management Plan</label>
            <textarea rows={4} value={plan} onChange={e => setPlan(e.target.value)} style={{ minHeight: '85px', lineHeight: '1.5', fontSize: '12.5px', padding: '8px 12px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Submit Ward Note'}
            </button>
          </div>
        </form>
      )}

      {/* Ward Round Timeline Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rounds.length === 0 ? (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No daily ward rounds recorded yet for this patient.
          </div>
        ) : (
          rounds.map((round) => (
            <div
              key={round.id}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderLeft: '4px solid #0284c7'
              }}
            >
              {/* Top metadata */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-blue" style={{ fontSize: '12px', padding: '3px 10px' }}>
                    {round.postOpDay}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6e6e73' }}>
                    <Calendar size={13} />
                    <span>{round.date} at {round.time}</span>
                  </div>
                  <DataAttributionBadge
                    compact={true}
                    attribution={round.entryAttribution}
                    currentSurgeon={currentSurgeon}
                    moduleName="Ward Round"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>BP: {round.vitals.bloodPressure}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Pulse: {round.vitals.pulse} bpm</span>
                  <span style={{ color: 'var(--text-muted)' }}>SpO2: {round.vitals.spo2}%</span>
                </div>
              </div>

              {/* Badges / Metrics row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fbfbfd',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  border: '1px solid var(--border-color)'
                }}>
                  <Droplet size={14} color="#0071e3" />
                  <span style={{ color: 'var(--text-muted)' }}>24h Drain:</span>
                  <span style={{ fontWeight: 700, color: round.drainOutput24hMl < 30 ? '#28a745' : '#ff9500' }}>
                    {round.drainOutput24hMl} ml ({round.drainStatus})
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fbfbfd',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  border: '1px solid var(--border-color)'
                }}>
                  <Footprints size={14} color="#28a745" />
                  <span style={{ color: 'var(--text-muted)' }}>Mobility:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{round.mobilizationStatus}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fbfbfd',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  border: '1px solid var(--border-color)'
                }}>
                  <HeartPulse size={14} color="#ff3b30" />
                  <span style={{ color: 'var(--text-muted)' }}>VAS Pain:</span>
                  <span style={{ fontWeight: 700, color: '#0071e3' }}>{round.painScoreVAS} / 10</span>
                </div>
              </div>

              {/* Clinical note narrative */}
              <div style={{ fontSize: '12px', background: '#fbfbfd', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Neuro Exam: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{round.motorExam}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Plan & Orders: </span>
                  <span style={{ color: '#0071e3', fontWeight: 500 }}>{round.plan}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
