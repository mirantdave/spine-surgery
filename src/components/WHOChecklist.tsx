import React, { useState } from 'react';
import { Patient, WHOSpineSafetyChecklist, SurgeonUser, DataEntryAttribution } from '../types/spine';
import { DataAttributionBadge } from './DataAttributionBadge';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  AlertTriangle, 
  Sparkles, 
  Clock 
} from 'lucide-react';

interface WHOChecklistProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onSave: (checklist: WHOSpineSafetyChecklist) => Promise<void>;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const WHOChecklist: React.FC<WHOChecklistProps> = ({
  patient,
  currentSurgeon,
  onSave,
  onOpenProtocol,
}) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [chk, setChk] = useState<WHOSpineSafetyChecklist>(() => {
    if (patient.checklist) {
      return patient.checklist;
    }
    return {
      id: `chk-${Date.now()}`,
      patientConfirmedIdentityAndSite: true,
      spinalLevelMarkedOnSkin: true,
      anesthesiaMachineAndMedsChecked: true,
      pulseOximeterFunctioning: true,
      knownAllergy: false,
      difficultAirwayRisk: false,
      bloodLossRiskGt500ml: patient.plannedProcedure.toLowerCase().includes('scoliosis'),
      ivAccess2LargeBoreConfirmed: true,
      allTeamMembersIntroduced: true,
      surgeonAnesthetistNurseConfirmPatient: true,
      spinalLevelConfirmedUnderFluoroscopy: true,
      surgicalApproachAndLevelsAgreed: true,
      implantsAndSizesVerifiedInRoom: true,
      antibioticProphylaxisGivenWithin60Min: true,
      neuromonitoringLeadsActiveAndBaselineChecked: true,
      specialImagingDisplayedOnORScreen: true,
      procedureRecordedName: true,
      instrumentSpongeNeedleCountCorrect: true,
      specimenLabeledCorrectly: true,
      equipmentIssuesAddressed: true,
      postOpRecoveryAndNeuroExamConcernsDiscussed: true,
      completedBy: `${currentSurgeon.name} (${currentSurgeon.designation})`,
      completedAt: new Date().toLocaleString(),
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

  const toggleField = (field: keyof WHOSpineSafetyChecklist) => {
    setChk(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleVerifyAll = () => {
    setChk(prev => ({
      ...prev,
      patientConfirmedIdentityAndSite: true,
      spinalLevelMarkedOnSkin: true,
      anesthesiaMachineAndMedsChecked: true,
      pulseOximeterFunctioning: true,
      ivAccess2LargeBoreConfirmed: true,
      allTeamMembersIntroduced: true,
      surgeonAnesthetistNurseConfirmPatient: true,
      spinalLevelConfirmedUnderFluoroscopy: true,
      surgicalApproachAndLevelsAgreed: true,
      implantsAndSizesVerifiedInRoom: true,
      antibioticProphylaxisGivenWithin60Min: true,
      neuromonitoringLeadsActiveAndBaselineChecked: true,
      specialImagingDisplayedOnORScreen: true,
      procedureRecordedName: true,
      instrumentSpongeNeedleCountCorrect: true,
      specimenLabeledCorrectly: true,
      equipmentIssuesAddressed: true,
      postOpRecoveryAndNeuroExamConcernsDiscussed: true,
      completedAt: new Date().toLocaleString()
    }));
  };

  const handleVerifyAsConsultant = () => {
    const verifiedAttribution: DataEntryAttribution = {
      enteredByName: chk.entryAttribution?.enteredByName || currentSurgeon.name,
      enteredByDesignation: chk.entryAttribution?.enteredByDesignation || currentSurgeon.designation,
      staffTier: chk.entryAttribution?.staffTier || currentSurgeon.tier,
      enteredAt: chk.entryAttribution?.enteredAt || new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      verifiedByConsultant: `${currentSurgeon.name} (${currentSurgeon.designation})`,
      verifiedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      verificationStatus: 'Verified by Consultant'
    };

    const updated = {
      ...chk,
      entryAttribution: verifiedAttribution
    };
    setChk(updated);
    onSave(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(chk);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save checklist:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="inpatient:who-checklist"
        pinnedCodes={['STV-SP-INT-01', 'STV-SP-PRE-07']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Staff Data Attribution Header */}
      <DataAttributionBadge
        attribution={chk.entryAttribution}
        currentSurgeon={currentSurgeon}
        moduleName="WHO Spine Surgical Safety Checklist"
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
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              WHO Surgical Safety Checklist (Spine Protocol)
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Target level fluoroscopy check, neuromonitoring baseline verification, and implant availability
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleVerifyAll}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px', color: '#0071e3' }}
          >
            <Sparkles size={13} color="#0071e3" />
            <span>Verify All Items</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            {saving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Checklist'}</span>
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
          <span>Surgical safety checklist saved and locked to patient OR record.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Sign In */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #0071e3' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#0071e3', marginBottom: '12px' }}>
            1. Sign In (Before Induction)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.patientConfirmedIdentityAndSite} onChange={() => toggleField('patientConfirmedIdentityAndSite')} />
              <span>Patient identity, site & procedure confirmed</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.spinalLevelMarkedOnSkin} onChange={() => toggleField('spinalLevelMarkedOnSkin')} />
              <span style={{ fontWeight: 600, color: '#0071e3' }}>Spine level marked on patient skin</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.anesthesiaMachineAndMedsChecked} onChange={() => toggleField('anesthesiaMachineAndMedsChecked')} />
              <span>Anesthesia machine & medication safety check complete</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.pulseOximeterFunctioning} onChange={() => toggleField('pulseOximeterFunctioning')} />
              <span>Pulse oximeter on patient and functioning</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.ivAccess2LargeBoreConfirmed} onChange={() => toggleField('ivAccess2LargeBoreConfirmed')} />
              <span>Two large bore IV accesses / central line confirmed</span>
            </label>
          </div>
        </div>

        {/* Time Out */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #af52de' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#8944ab', marginBottom: '12px' }}>
            2. Time Out (Before Incision)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.allTeamMembersIntroduced} onChange={() => toggleField('allTeamMembersIntroduced')} />
              <span>Team members introduced by name and role</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.spinalLevelConfirmedUnderFluoroscopy} onChange={() => toggleField('spinalLevelConfirmedUnderFluoroscopy')} />
              <span style={{ fontWeight: 600, color: '#28a745' }}>Spinal level re-confirmed with C-arm fluoroscopy needle</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.implantsAndSizesVerifiedInRoom} onChange={() => toggleField('implantsAndSizesVerifiedInRoom')} />
              <span style={{ fontWeight: 600, color: '#8944ab' }}>Implants & cages verified physically in room</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.neuromonitoringLeadsActiveAndBaselineChecked} onChange={() => toggleField('neuromonitoringLeadsActiveAndBaselineChecked')} />
              <span>Neuromonitoring (MEP/SSEP) baseline active & valid</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.antibioticProphylaxisGivenWithin60Min} onChange={() => toggleField('antibioticProphylaxisGivenWithin60Min')} />
              <span>IV Antibiotic given within 60 mins before incision</span>
            </label>
          </div>
        </div>

        {/* Sign Out */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #34c759' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#28a745', marginBottom: '12px' }}>
            3. Sign Out (Before Leaving OR)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.procedureRecordedName} onChange={() => toggleField('procedureRecordedName')} />
              <span>Name of procedure verified and recorded</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.instrumentSpongeNeedleCountCorrect} onChange={() => toggleField('instrumentSpongeNeedleCountCorrect')} />
              <span>Instrument, sponge & needle count correct</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.specimenLabeledCorrectly} onChange={() => toggleField('specimenLabeledCorrectly')} />
              <span>Specimen labeled (biopsy / bone / disc material)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.equipmentIssuesAddressed} onChange={() => toggleField('equipmentIssuesAddressed')} />
              <span>No equipment problems to be addressed</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={chk.postOpRecoveryAndNeuroExamConcernsDiscussed} onChange={() => toggleField('postOpRecoveryAndNeuroExamConcernsDiscussed')} />
              <span>Post-op recovery and PACU neurological exam planned</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
