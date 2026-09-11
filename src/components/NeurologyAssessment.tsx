import React, { useState } from 'react';
import { Patient, NeurologicalAssessment, SurgeonUser, DataEntryAttribution } from '../types/spine';
import { DataAttributionBadge } from './DataAttributionBadge';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  Activity, 
  Calculator, 
  Save, 
  CheckCircle2, 
  Sliders, 
  AlertCircle, 
  Award, 
  Clock 
} from 'lucide-react';

interface NeurologyAssessmentProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onSave: (assessment: NeurologicalAssessment) => Promise<void>;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const NeurologyAssessment: React.FC<NeurologyAssessmentProps> = ({
  patient,
  currentSurgeon,
  onSave,
  onOpenProtocol,
}) => {
  const latestAssessment = patient.assessments && patient.assessments.length > 0 
    ? patient.assessments[patient.assessments.length - 1] 
    : null;

  const [timing, setTiming] = useState<NeurologicalAssessment['timing']>('Post-Op Day 1');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Motor power state
  const [motorPower, setMotorPower] = useState(latestAssessment?.motorPower || {
    hipFlexionL2: { left: 5, right: 5 },
    kneeExtensionL3: { left: 5, right: 5 },
    ankleDorsiflexionL4: { left: 5, right: 5 },
    greatToeExtensionL5: { left: 5, right: 5 },
    anklePlantarflexionS1: { left: 5, right: 5 },
    deltoidC5: { left: 5, right: 5 },
    bicepsC6: { left: 5, right: 5 },
    tricepsC7: { left: 5, right: 5 },
    fingerFlexorsC8: { left: 5, right: 5 },
    interosseiT1: { left: 5, right: 5 },
  });

  // Reflexes & Sphincter
  const [kneeJerk, setKneeJerk] = useState<any>(latestAssessment?.reflexes.kneeJerk || '2+ (Normal)');
  const [ankleJerk, setAnkleJerk] = useState<any>(latestAssessment?.reflexes.ankleJerk || '2+ (Normal)');
  const [plantarReflex, setPlantarReflex] = useState<any>(latestAssessment?.reflexes.plantarReflex || 'Flexor (Normal)');
  const [hoffmanSign, setHoffmanSign] = useState<any>(latestAssessment?.reflexes.hoffmanSign || 'Negative');
  const [sphincterControl, setSphincterControl] = useState<any>(latestAssessment?.sphincterControl || 'Normal Continence');

  // VAS scores
  const [vasBack, setVasBack] = useState<number>(latestAssessment?.vasBackPain ?? 3);
  const [vasLeg, setVasLeg] = useState<number>(latestAssessment?.vasLegPain ?? 1);
  const [walkingMeters, setWalkingMeters] = useState<number>(latestAssessment?.walkingToleranceMeters ?? 150);

  // ODI Questions (10 items, 0 to 5 each)
  const [odiScores, setOdiScores] = useState<number[]>([1, 1, 1, 1, 1, 1, 0, 0, 1, 1]);

  const odiTotal = odiScores.reduce((a, b) => a + b, 0);
  const odiPercentage = Math.round((odiTotal / 50) * 100);

  const handleScoreChange = (index: number, val: number) => {
    const updated = [...odiScores];
    updated[index] = val;
    setOdiScores(updated);
  };

  const getOdiInterpretation = (pct: number) => {
    if (pct <= 20) return { label: 'Minimal Disability', color: '#34c759' };
    if (pct <= 40) return { label: 'Moderate Disability', color: '#0071e3' };
    if (pct <= 60) return { label: 'Severe Disability', color: '#ff9500' };
    if (pct <= 80) return { label: 'Crippled', color: '#ff3b30' };
    return { label: 'Bed-Bound / Exaggerated', color: '#d70015' };
  };

  const odiTier = getOdiInterpretation(odiPercentage);

  const handleMotorChange = (muscle: string, side: 'left' | 'right', value: number) => {
    setMotorPower(prev => ({
      ...prev,
      [muscle]: {
        ...(prev as any)[muscle],
        [side]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const nowStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const newAssessment: NeurologicalAssessment = {
      id: `ass-${Date.now()}`,
      assessmentDate: new Date().toISOString().split('T')[0],
      timing,
      examiner: `${currentSurgeon.name} (${currentSurgeon.designation})`,
      motorPower,
      sensoryScores: { 'L4': 'Normal', 'L5': 'Normal', 'S1': 'Normal' },
      reflexes: { kneeJerk, ankleJerk, plantarReflex, hoffmanSign },
      sphincterControl,
      vasBackPain: vasBack,
      vasLegPain: vasLeg,
      odiPercentage,
      walkingToleranceMeters: walkingMeters,
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
      await onSave(newAssessment);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save assessment:', err);
    } finally {
      setSaving(false);
    }
  };

  const isCervical = patient.spineRegion === 'cervical';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="inpatient:neuro-exam"
        pinnedCodes={['STV-SP-POST-03', 'STV-SP-EMR-02']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Staff Data Attribution Header */}
      <DataAttributionBadge
        attribution={latestAssessment?.entryAttribution}
        currentSurgeon={currentSurgeon}
        moduleName="Spine Neurological Assessment"
      />

      {/* Top Banner */}
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
            background: 'rgba(0, 113, 227, 0.08)',
            color: '#0071e3',
            padding: '8px',
            borderRadius: '10px'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Spine Neurological Examination & Functional Calculators
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Dermatomes, myotomes (MRC 0-5), Oswestry Disability Index (ODI), and VAS scoring
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={timing}
            onChange={e => setTiming(e.target.value as any)}
            style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
          >
            <option value="Pre-Op">Pre-Op Baseline</option>
            <option value="Post-Op Day 1">Post-Op Day 1</option>
            <option value="At Discharge">At Discharge</option>
            <option value="6-Week Followup">6-Week Follow-Up</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            {saving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Assessment'}</span>
          </button>
        </div>
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
          <span>Neurological examination and scores saved successfully to patient file.</span>
        </div>
      )}

      {/* Visual Analogue Scale (VAS) Sliders */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sliders size={16} color="#0071e3" />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            VAS Pain Scales (0-10) & Walking Tolerance
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Back/Neck Pain */}
          <div style={{ background: '#fbfbfd', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {isCervical ? 'Neck Axial Pain (VAS)' : 'Low Back Pain (VAS)'}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: vasBack > 5 ? '#ff3b30' : '#0071e3' }}>
                {vasBack} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={vasBack}
              onChange={e => setVasBack(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>0 (No Pain)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe Agony)</span>
            </div>
          </div>

          {/* Leg/Arm Radicular Pain */}
          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {isCervical ? 'Brachial Arm Radicular Pain (VAS)' : 'Sciatica / Leg Radicular Pain (VAS)'}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: vasLeg > 5 ? '#f43f5e' : '#34d399' }}>
                {vasLeg} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={vasLeg}
              onChange={e => setVasLeg(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>0 (No Leg Pain)</span>
              <span>5 (Moderate Sciatica)</span>
              <span>10 (Excruciating)</span>
            </div>
          </div>

          {/* Claudication Distance */}
          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Painless Walking Distance (Meters)
            </label>
            <input
              type="number"
              value={walkingMeters}
              onChange={e => setWalkingMeters(parseInt(e.target.value, 10) || 0)}
              style={{ fontSize: '14px', fontWeight: 600, color: '#0071e3' }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Claudication threshold: &lt; 50m = Severe stenosis
            </span>
          </div>
        </div>
      </div>

      {/* Myotome Motor Examination (MRC 0-5) */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#10b981' }}>
          {isCervical ? 'Upper Extremity Myotomes (C5 - T1)' : 'Lower Extremity Key Myotomes (L2 - S1)'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '10px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)'
          }}>
            <span>Root / Key Muscle Action</span>
            <span style={{ textAlign: 'center' }}>Left (0-5)</span>
            <span style={{ textAlign: 'center' }}>Right (0-5)</span>
          </div>

          {(!isCervical ? [
            { key: 'hipFlexionL2', label: 'L2: Hip Flexors (Iliopsoas)' },
            { key: 'kneeExtensionL3', label: 'L3: Knee Extensors (Quadriceps)' },
            { key: 'ankleDorsiflexionL4', label: 'L4: Ankle Dorsiflexion (Tibialis Anterior)' },
            { key: 'greatToeExtensionL5', label: 'L5: Great Toe Extension (Extensor Hallucis Longus / EHL)' },
            { key: 'anklePlantarflexionS1', label: 'S1: Ankle Plantarflexion (Gastrocnemius / Soleus)' },
          ] : [
            { key: 'deltoidC5', label: 'C5: Shoulder Abduction (Deltoid / Biceps)' },
            { key: 'bicepsC6', label: 'C6: Wrist Extension & Biceps' },
            { key: 'tricepsC7', label: 'C7: Elbow Extension (Triceps / Wrist Flexors)' },
            { key: 'fingerFlexorsC8', label: 'C8: Finger Flexion (FDP)' },
            { key: 'interosseiT1', label: 'T1: Finger Abduction (Dorsal Interossei)' },
          ]).map((item) => {
            const current = (motorPower as any)[item.key] || { left: 5, right: 5 };
            return (
              <div
                key={item.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '10px',
                  alignItems: 'center',
                  background: 'var(--bg-primary)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '12px'
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <select
                  value={current.left}
                  onChange={e => handleMotorChange(item.key as any, 'left', parseInt(e.target.value, 10))}
                  style={{ textAlign: 'center', fontWeight: 700 }}
                >
                  <option value={5}>5 / 5 (Normal Power)</option>
                  <option value={4}>4 / 5 (Against Resistance)</option>
                  <option value={3}>3 / 5 (Against Gravity)</option>
                  <option value={2}>2 / 5 (Gravity Eliminated)</option>
                  <option value={1}>1 / 5 (Trace Flicker)</option>
                  <option value={0}>0 / 5 (Complete Paralysis)</option>
                </select>
                <select
                  value={current.right}
                  onChange={e => handleMotorChange(item.key as any, 'right', parseInt(e.target.value, 10))}
                  style={{ textAlign: 'center', fontWeight: 700 }}
                >
                  <option value={5}>5 / 5 (Normal Power)</option>
                  <option value={4}>4 / 5 (Against Resistance)</option>
                  <option value={3}>3 / 5 (Against Gravity)</option>
                  <option value={2}>2 / 5 (Gravity Eliminated)</option>
                  <option value={1}>1 / 5 (Trace Flicker)</option>
                  <option value={0}>0 / 5 (Complete Paralysis)</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflexes & Sphincter Function */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#a855f7' }}>
          Spinal Reflexes & Sphincter Continence
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Patellar / Knee Jerk (L3-L4)
            </label>
            <select value={kneeJerk} onChange={e => setKneeJerk(e.target.value)}>
              <option value="2+ (Normal)">2+ (Normal)</option>
              <option value="1+ (Hypoactive)">1+ (Hypoactive)</option>
              <option value="3+ (Brisk)">3+ (Brisk / Hyperreflexia)</option>
              <option value="0 (Absent)">0 (Absent)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Achilles / Ankle Jerk (S1)
            </label>
            <select value={ankleJerk} onChange={e => setAnkleJerk(e.target.value)}>
              <option value="2+ (Normal)">2+ (Normal)</option>
              <option value="1+ (Hypoactive)">1+ (Hypoactive / Root compression)</option>
              <option value="0 (Absent)">0 (Absent)</option>
              <option value="3+ (Brisk)">3+ (Brisk)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Plantar Reflex (Babinski)
            </label>
            <select value={plantarReflex} onChange={e => setPlantarReflex(e.target.value)}>
              <option value="Flexor (Normal)">Flexor (Normal)</option>
              <option value="Extensor (Babinski Positive)">Extensor (Babinski Positive - UMN Sign)</option>
              <option value="Equivocal">Equivocal</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Sphincter / Bladder Function
            </label>
            <select value={sphincterControl} onChange={e => setSphincterControl(e.target.value)}>
              <option value="Normal Continence">Normal Continence</option>
              <option value="Hesitancy">Hesitancy</option>
              <option value="Urinary Retention">Urinary Retention (Catheterized)</option>
              <option value="Incontinence">Incontinence (Cauda Equina Emergency)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Oswestry Disability Index (ODI) Calculator */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="#0071e3" />
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Oswestry Disability Index (ODI v2.1)
              </h3>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Gold standard spine clinical functional disability score
              </p>
            </div>
          </div>

          {/* Live Calculated Score Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            padding: '6px 14px',
            borderRadius: '10px',
            border: `1px solid ${odiTier.color}`,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Award size={18} color={odiTier.color} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: odiTier.color, fontFamily: 'var(--font-mono)' }}>
                {odiPercentage}%
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: odiTier.color }}>
                {odiTier.label}
              </div>
            </div>
          </div>
        </div>

        {/* 10 Sections in compact two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
          {[
            '1. Pain Intensity',
            '2. Personal Care (Washing, Dressing)',
            '3. Lifting Objects',
            '4. Walking Ability',
            '5. Sitting Tolerance',
            '6. Standing Tolerance',
            '7. Sleeping Comfort',
            '8. Social Life',
            '9. Traveling / Driving',
            '10. Employment / Homemaking'
          ].map((title, idx) => (
            <div key={idx} style={{ background: '#fbfbfd', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>{title}</span>
                <span style={{ color: '#0071e3', fontWeight: 600 }}>Grade {odiScores[idx]}</span>
              </div>
              <select
                value={odiScores[idx]}
                onChange={e => {
                  const updated = [...odiScores];
                  updated[idx] = parseInt(e.target.value, 10);
                  setOdiScores(updated);
                }}
              >
                <option value={0}>0: No impairment</option>
                <option value={1}>1: Mild impairment</option>
                <option value={2}>2: Moderate limitation</option>
                <option value={3}>3: Pain severely limits activity</option>
                <option value={4}>4: Nearly impossible without help</option>
                <option value={5}>5: Completely disabled for this task</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
