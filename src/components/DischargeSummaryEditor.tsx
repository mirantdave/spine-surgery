import React, { useState } from 'react';
import { Patient, DischargeSummary, SurgeonUser, DataEntryAttribution } from '../types/spine';
import { DataAttributionBadge } from './DataAttributionBadge';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  FileCheck2, 
  Printer, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake, 
  ShieldAlert, 
  Clock 
} from 'lucide-react';

interface DischargeSummaryEditorProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onSave: (summary: DischargeSummary) => Promise<void>;
  onPrintPreview: () => void;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const DischargeSummaryEditor: React.FC<DischargeSummaryEditorProps> = ({
  patient,
  currentSurgeon,
  onSave,
  onPrintPreview,
  onOpenProtocol,
}) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize with patient's existing discharge summary or smart pre-fill
  const [summary, setSummary] = useState<DischargeSummary>(() => {
    if (patient.dischargeSummary) {
      return patient.dischargeSummary;
    }
    return {
      id: `ds-${Date.now()}`,
      dischargeDate: new Date().toISOString().split('T')[0],
      summaryAuthor: patient.attendingSurgeon || 'Dr. Bharat Rajendraprasad Dave, MS (Ortho), MCh (Spine)',
      admissionDate: patient.admissionDate,
      surgeryDate: patient.plannedOrSurgeryDate,
      hospitalCourseSummary: `${patient.age}-year-old ${patient.gender.toLowerCase()} admitted with ${patient.primaryDiagnosis}. Underwent uneventful ${patient.plannedProcedure} on ${patient.plannedOrSurgeryDate}. Post-operatively, patient had significant symptomatic relief. Mobilized early with physiotherapist assistance. Drain output remained low and drain was safely removed. Patient is clinically stable and neurological exam is preserved.`,
      operativeSummaryBrief: `${patient.plannedProcedure} via ${patient.approach}. Implants placed safely and checked on fluoroscopy. Hemostasis verified. No dural leak.`,
      implantsSummary: patient.operativeNote?.implants.map(i => `${i.type} (${i.dimensions}) at ${i.level}`).join(', ') || 'Spinal instrumentation per operative record',
      dischargeNeuroStatus: 'Ambulatory with spinal orthosis. Bilateral lower limb motor power 5/5 (L2-S1). Dermatomal sensation intact. Normal voluntary urinary and bowel continence.',
      woundConditionAtDischarge: 'Surgical incision clean, dry, well-healed, and apposed. No signs of infection, erythema, or CSF leak.',
      sutureRemovalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' (Day 14 post-op at Stavya OPD)',
      drainRemovalDateAndTotal: 'Drain removed on POD 2. Cumulative output < 100 ml.',
      mobilityAtDischarge: patient.spineRegion === 'cervical' 
        ? 'Ambulatory independently with rigid cervical collar (Philadelphia/Aspen collar)' 
        : 'Ambulatory independently with rigid Lumbo-Sacral Orthosis (LSO) brace',
      braceInstructions: patient.spineRegion === 'cervical'
        ? 'Philadelphia cervical collar to be worn at all times while sitting or walking for 4-6 weeks. May be removed only for sponge bath while keeping head in neutral alignment.'
        : 'Rigid LSO brace to be worn at all times when out of bed (sitting, standing, or walking) for 6 weeks. May be removed while lying flat in bed.',
      spinalPrecautions: [
        'Strict log-rolling technique when turning in bed or getting in/out of bed.',
        'No bending forward or sideways at the waist; bend knees and hips if picking light objects.',
        'Strict lifting limit: Do not lift anything heavier than 3 kg (approx. 5 lbs) for 6 weeks.',
        'No twisting or rotation of the spine.',
        'Avoid prolonged sitting: Limit continuous sitting to 30-45 minutes, then take a short walk.'
      ],
      redFlagWarnings: [
        'SUDDEN LOSS OF BOWEL OR BLADDER CONTROL, or numbness around the saddle/groin area (Cauda Equina warning - Emergency!).',
        'Sudden onset of new weakness in legs or foot (e.g. foot drop, inability to stand on toes or heels).',
        'High fever (> 100.4°F / 38°C) with severe chills or wound inflammation.',
        'Clear watery fluid discharge or soaking of dressing from the surgical incision (suspicion of CSF leak).'
      ],
      medications: patient.prescriptions || [],
      firstFollowUpDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' at 10:00 AM (Stavya Spine OPD)',
      emergencyContact: '+91 98201 00000 (Stavya 24/7 Spine Helpline)',
      dischargeStatus: 'Ready for Home',
      surgeonSignature: patient.attendingSurgeon || 'Dr. Bharat Rajendraprasad Dave, MS (Ortho), MCh (Spine)',
      entryAttribution: {
        enteredByName: currentSurgeon.name,
        enteredByDesignation: currentSurgeon.designation,
        staffTier: currentSurgeon.tier,
        enteredAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
        verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? 'Verified by Consultant' : 'Pending Consultant Review',
        verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? currentSurgeon.name : undefined,
        verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : undefined
      }
    };
  });

  const handleVerifyAsConsultant = () => {
    const verifiedAttribution: DataEntryAttribution = {
      enteredByName: summary.entryAttribution?.enteredByName || currentSurgeon.name,
      enteredByDesignation: summary.entryAttribution?.enteredByDesignation || currentSurgeon.designation,
      staffTier: summary.entryAttribution?.staffTier || currentSurgeon.tier,
      enteredAt: summary.entryAttribution?.enteredAt || new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      verifiedByConsultant: `${currentSurgeon.name} (${currentSurgeon.designation})`,
      verifiedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      verificationStatus: 'Verified by Consultant'
    };

    const updated = {
      ...summary,
      entryAttribution: verifiedAttribution,
      dischargeStatus: 'Signed and Finalized' as const,
      surgeonSignature: currentSurgeon.formalName
    };
    setSummary(updated);
    onSave(updated);
  };

  const handleGenerateCourse = () => {
    const drainRounds = patient.wardRounds || [];
    const drainInfo = drainRounds.length > 0
      ? `Drain tracked across ${drainRounds.length} ward rounds, latest output was ${drainRounds[drainRounds.length - 1].drainOutput24hMl}ml (${drainRounds[drainRounds.length - 1].drainStatus}).`
      : 'Drain removed uneventfully.';

    const newCourse = `${patient.age}-year-old ${patient.gender.toLowerCase()} admitted on ${patient.admissionDate} with ${patient.primaryDiagnosis}. Underwent ${patient.plannedProcedure} on ${patient.plannedOrSurgeryDate} under ${patient.attendingSurgeon}. Post-op course was uneventful. ${drainInfo} Patient mobilized comfortably with brace, voiding clear, and afebrile. Satisfactory pain control achieved on oral protocol. Discharged in stable condition.`;

    setSummary(prev => ({
      ...prev,
      hospitalCourseSummary: newCourse
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(summary);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save discharge summary:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="discharge"
        pinnedCodes={['STV-SP-DIS-01', 'STV-SP-DIS-02']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Staff Data Attribution & Consultant Verification Header */}
      <DataAttributionBadge
        attribution={summary.entryAttribution}
        currentSurgeon={currentSurgeon}
        moduleName="Spine Discharge Summary"
        onVerify={handleVerifyAsConsultant}
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
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            padding: '8px',
            borderRadius: '10px'
          }}>
            <FileCheck2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Spine Surgical Discharge Summary
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Comprehensive paperless discharge documentation with spinal ergonomics & recovery milestones
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleGenerateCourse}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px', color: '#0071e3' }}
          >
            <Sparkles size={13} color="#0071e3" />
            <span>Auto-Generate Course</span>
          </button>

          <button
            type="button"
            onClick={onPrintPreview}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Printer size={14} />
            <span>Print Official Discharge</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            {saving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Finalize Summary'}</span>
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
          <span>Discharge Summary saved and updated across all devices on the network.</span>
        </div>
      )}

      {/* Hospital Course & Operative Summary */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#0071e3' }}>
          Hospital Stay & Operative Recap
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Admission Date</label>
              <input
                type="date"
                value={summary.admissionDate}
                onChange={e => setSummary({ ...summary, admissionDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Surgery Date</label>
              <input
                type="date"
                value={summary.surgeryDate}
                onChange={e => setSummary({ ...summary, surgeryDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Discharge Date</label>
              <input
                type="date"
                value={summary.dischargeDate}
                onChange={e => setSummary({ ...summary, dischargeDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Hospital Course Narrative
            </label>
            <textarea
              rows={6}
              value={summary.hospitalCourseSummary}
              onChange={e => setSummary({ ...summary, hospitalCourseSummary: e.target.value })}
              style={{ minHeight: '130px', lineHeight: '1.55', fontSize: '13px', padding: '10px 14px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Operative Procedure Summary
              </label>
              <textarea
                rows={4}
                value={summary.operativeSummaryBrief}
                onChange={e => setSummary({ ...summary, operativeSummaryBrief: e.target.value })}
                style={{ minHeight: '95px', lineHeight: '1.5', fontSize: '12.5px', padding: '10px 12px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Implants & Hardware Traceability
              </label>
              <textarea
                rows={4}
                value={summary.implantsSummary}
                onChange={e => setSummary({ ...summary, implantsSummary: e.target.value })}
                style={{ minHeight: '95px', lineHeight: '1.5', fontSize: '12.5px', padding: '10px 12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discharge Physical & Neurological Status */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#10b981' }}>
          Physical & Neurological Status at Discharge
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Neurological Exam at Discharge
            </label>
            <textarea
              rows={4}
              value={summary.dischargeNeuroStatus}
              onChange={e => setSummary({ ...summary, dischargeNeuroStatus: e.target.value })}
              style={{ minHeight: '95px', lineHeight: '1.5', fontSize: '12.5px', padding: '10px 12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Surgical Wound Condition
            </label>
            <textarea
              rows={4}
              value={summary.woundConditionAtDischarge}
              onChange={e => setSummary({ ...summary, woundConditionAtDischarge: e.target.value })}
              style={{ minHeight: '95px', lineHeight: '1.5', fontSize: '12.5px', padding: '10px 12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Mobility & Orthosis at Discharge
            </label>
            <input
              type="text"
              value={summary.mobilityAtDischarge}
              onChange={e => setSummary({ ...summary, mobilityAtDischarge: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Suture / Staple Removal Plan
            </label>
            <input
              type="text"
              value={summary.sutureRemovalDate}
              onChange={e => setSummary({ ...summary, sutureRemovalDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Spine Ergonomics & Spinal Precautions */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <HeartHandshake size={16} color="#0071e3" />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Patient Guidance & Spinal Ergonomics
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Spinal Brace / Collar Usage Protocol
            </label>
            <textarea
              rows={4}
              value={summary.braceInstructions}
              onChange={e => setSummary({ ...summary, braceInstructions: e.target.value })}
              style={{ minHeight: '95px', lineHeight: '1.5', fontSize: '12.5px', padding: '10px 12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Key Post-Operative Spine Precautions (Log-roll, Lifting, Sitting limits)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {summary.spinalPrecautions.map((prec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#0071e3', fontWeight: 700 }}>•</span>
                  <input
                    type="text"
                    value={prec}
                    onChange={e => {
                      const updated = [...summary.spinalPrecautions];
                      updated[idx] = e.target.value;
                      setSummary({ ...summary, spinalPrecautions: updated });
                    }}
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Red Flag Emergency Warnings */}
      <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldAlert size={18} color="#f43f5e" />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fb7185' }}>
            Red Flag Warning Symptoms (Emergency Contacts Provided to Patient)
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {summary.redFlagWarnings.map((warning, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={14} color="#f43f5e" />
              <input
                type="text"
                value={warning}
                onChange={e => {
                  const updated = [...summary.redFlagWarnings];
                  updated[idx] = e.target.value;
                  setSummary({ ...summary, redFlagWarnings: updated });
                }}
                style={{ fontSize: '12px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up & Discharge Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        <div className="glass-panel" style={{ padding: '14px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>First OPD Follow-Up</label>
          <input
            type="text"
            value={summary.firstFollowUpDate}
            onChange={e => setSummary({ ...summary, firstFollowUpDate: e.target.value })}
          />
        </div>
        <div className="glass-panel" style={{ padding: '14px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>24/7 Spine Emergency Line</label>
          <input
            type="text"
            value={summary.emergencyContact}
            onChange={e => setSummary({ ...summary, emergencyContact: e.target.value })}
          />
        </div>
        <div className="glass-panel" style={{ padding: '14px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Attending Surgeon Signature</label>
          <input
            type="text"
            value={summary.surgeonSignature}
            onChange={e => setSummary({ ...summary, surgeonSignature: e.target.value })}
            style={{ color: '#0071e3', fontWeight: 600 }}
          />
        </div>
      </div>
    </form>
  );
};
