import React, { useState } from 'react';
import { Patient, OperativeNote, ImplantRecord, SurgicalApproach, SurgeonUser, DataEntryAttribution } from '../types/spine';
import { OPERATIVE_TEMPLATES } from '../data/templates';
import { DataAttributionBadge } from './DataAttributionBadge';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  FileText, 
  Printer, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  CheckSquare,
  Square,
  ShieldCheck, 
  Activity, 
  Clock, 
  Zap, 
  Lock,
  Wand2
} from 'lucide-react';

interface OperativeNoteEditorProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onSave: (note: OperativeNote) => Promise<void>;
  onPrintPreview: () => void;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const OperativeNoteEditor: React.FC<OperativeNoteEditorProps> = ({
  patient,
  currentSurgeon,
  onSave,
  onPrintPreview,
  onOpenProtocol,
}) => {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('MIS-TLIF');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize with patient's existing note or blank with defaults
  const [note, setNote] = useState<OperativeNote>(() => {
    if (patient.operativeNote) {
      return patient.operativeNote;
    }
    return {
      id: `op-${Date.now()}`,
      surgeryDate: patient.plannedOrSurgeryDate || new Date().toISOString().split('T')[0],
      startTime: '08:30 AM',
      endTime: '11:00 AM',
      primarySurgeon: patient.attendingSurgeon || 'Dr. Bharat Rajendraprasad Dave, MS (Ortho), MCh (Spine)',
      assistantSurgeon: patient.fellowOrResident || 'Dr. Amritesh Singh, MS (Ortho)',
      anesthesiologist: 'Dr. Sunita Kulkarni, MD (Anesth)',
      scrubNurse: 'Sister Deepa (Staff Nurse / OT Senior)',
      preOpDiagnosis: patient.primaryDiagnosis,
      postOpDiagnosis: patient.primaryDiagnosis,
      procedureName: patient.plannedProcedure,
      icd10Codes: ['M43.16', 'M48.06'],
      operativeLevels: patient.affectedLevels,
      approach: patient.approach,
      anesthesiaType: 'General Endotracheal',
      position: 'Prone on Jackson Radiolucent Table',
      incisionDetails: 'Paramedian Wiltse incisions over targeted levels.',
      cArmConfirmation: true,
      fluorescopyTimeSec: 35,
      radiationDoseDAP: '15.2 mGy.cm²',
      microscopeUsed: true,
      microscopeModel: 'Zeiss Kinevo 900 3D HD',
      decompressionDetails: 'Under operating microscope and tubular retractor, bilateral facetectomy and hemi-laminectomy completed. Thecal sac and traversing nerve roots mobilized and decompressed.',
      discectomyDetails: 'Complete discectomy performed. Cartilaginous endplates prepared meticulously with rasp and box curettes.',
      interbodyFusionDetails: 'Bullet PEEK cage packed with autologous local bone graft and DBM putty inserted into disc space and verified on lateral fluoroscopy.',
      instrumentationDetails: 'Percutaneous cannulated pedicle screws placed bilaterally. Titanium pre-contoured rods secured with locking caps.',
      boneGraftUsed: 'Autologous local bone graft mixed with Demineralized Bone Matrix (DBM Putty).',
      duralIntegrity: 'Intact - No tear',
      hemostasisAndClosure: 'Complete hemostasis with Floseal and bipolar. Wound closed in layers with 0 Vicryl and 3-0 Monocryl.',
      estimatedBloodLossMl: 100,
      drainsPlaced: '1x 10Fr negative suction Hemovac drain placed subfascial',
      entryAttribution: {
        enteredByName: currentSurgeon.name,
        enteredByDesignation: currentSurgeon.designation,
        staffTier: currentSurgeon.tier,
        enteredAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
        verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? 'Verified by Consultant' : 'Pending Consultant Review',
        verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? currentSurgeon.name : undefined,
        verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : undefined
      },
      implants: [
        {
          id: `imp-${Date.now()}-1`,
          type: 'Pedicle Screw',
          level: patient.affectedLevels[0] || 'L4',
          side: 'Bilateral',
          dimensions: '6.5 x 45 mm',
          material: 'Titanium',
          manufacturer: 'Medtronic Voyager',
          lotNumber: 'MV-88210'
        }
      ],
      neuromonitoring: {
        modality: ['MEP', 'SSEP', 'Triggered EMG'],
        baselineEstablished: true,
        baselineNotes: 'Stable baseline signals recorded before incision.',
        intraopEvents: 'EMG screw thresholds > 15 mA (safe).',
        closingStatus: 'Stable Baseline',
        technologistName: 'Ravi Kumar, CNIM'
      },
      complications: 'None. Procedure tolerated well.',
      immediatePostOpPlan: '1. Extubate in OR. 2. PACU neuro exam. 3. Monitor drain output. 4. Mobilize POD 1 with rigid brace.',
      surgeonSignature: patient.attendingSurgeon || 'Dr. Bharat Rajendraprasad Dave, MS (Ortho), MCh (Spine)',
      isLocked: false,
    };
  });

  const [stepConfirmations, setStepConfirmations] = useState<Record<string, boolean>>(() => {
    return note.stepConfirmations || {
      step1: true,
      step2: true,
      step3: true,
      step4: true,
      step5: true,
      step6: true,
      step7: true
    };
  });

  const toggleStepConfirmation = (stepKey: string) => {
    const updated = {
      ...stepConfirmations,
      [stepKey]: !stepConfirmations[stepKey]
    };
    setStepConfirmations(updated);
    setNote(prev => ({
      ...prev,
      stepConfirmations: updated
    }));
  };

  const handleConfirmAllSteps = () => {
    const allConfirmed: Record<string, boolean> = {
      step1: true,
      step2: true,
      step3: true,
      step4: true,
      step5: true,
      step6: true,
      step7: true
    };
    setStepConfirmations(allConfirmed);
    setNote(prev => ({ ...prev, stepConfirmations: allConfirmed }));
  };

  const handleClearAllSteps = () => {
    const allCleared: Record<string, boolean> = {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
      step6: false,
      step7: false
    };
    setStepConfirmations(allCleared);
    setNote(prev => ({ ...prev, stepConfirmations: allCleared }));
  };

  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSmartSynthesize = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch(`/api/smart/synthesize-ot-note/${patient.id}`, { method: 'POST' });
      if (res.ok) {
        const synth = await res.json();
        setNote(prev => ({
          ...prev,
          ...synth,
          procedureName: synth.procedureName || prev.procedureName,
          approach: synth.approach || prev.approach,
          radiationDoseDAP: synth.cArmRadiationDAP || prev.radiationDoseDAP,
          fluorescopyTimeSec: synth.fluoroscopyTimeSeconds || prev.fluorescopyTimeSec,
          implants: synth.implantsUsed || prev.implants,
          decompressionDetails: synth.findings || prev.decompressionDetails,
          hemostasisAndClosure: synth.postOpInstructions?.join(' ') || prev.hemostasisAndClosure,
        }));
      }
    } catch (err) {
      console.error('Failed to auto-synthesize operative note:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Auto-detect and generate evidence-based note matching patient's planned procedure
  const handleAutoGenerateByProcedure = () => {
    const proc = (patient.plannedProcedure || '').toLowerCase();
    let templateKey = 'MIS-TLIF';
    if (proc.includes('acdf') || proc.includes('cervical discectomy')) {
      templateKey = 'ACDF';
    } else if (proc.includes('scoliosis') || proc.includes('deformity') || proc.includes('ponte')) {
      templateKey = 'ScoliosisCorrection';
    } else if (proc.includes('microdiscectomy') || proc.includes('discectomy') || proc.includes('peld')) {
      templateKey = 'Microdiscectomy';
    } else if (proc.includes('laminoplasty')) {
      templateKey = 'Laminoplasty';
    } else if (proc.includes('kyphoplasty') || proc.includes('vertebroplasty')) {
      templateKey = 'Kyphoplasty';
    } else if (proc.includes('multi-level') || proc.includes('decompression')) {
      templateKey = 'MultiLevelDecompression';
    }

    setSelectedTemplateKey(templateKey);
    handleApplyTemplate(templateKey);
  };

  const handleApplyTemplate = (key: string) => {
    const tpl = OPERATIVE_TEMPLATES[key];
    if (!tpl) return;

    // Build evidence-based implants tailored to patient's affected levels
    let generatedImplants = note.implants;
    if (key === 'MIS-TLIF') {
      const levels = patient.affectedLevels.length > 0 ? patient.affectedLevels : ['L4', 'L5'];
      generatedImplants = levels.flatMap((lvl, idx) => ([
        { id: `imp-gen-${idx}-L`, type: 'Pedicle Screw' as const, level: lvl, side: 'Left' as const, dimensions: '6.5 x 45 mm', material: 'Titanium' as const, manufacturer: 'Medtronic Voyager', lotNumber: `MV-992${idx}1` },
        { id: `imp-gen-${idx}-R`, type: 'Pedicle Screw' as const, level: lvl, side: 'Right' as const, dimensions: '6.5 x 45 mm', material: 'Titanium' as const, manufacturer: 'Medtronic Voyager', lotNumber: `MV-992${idx}2` },
      ]));
      generatedImplants.push({
        id: 'imp-gen-cage',
        type: 'Interbody Cage' as const,
        level: `${levels[0]}-${levels[levels.length - 1]}`,
        side: 'Midline' as const,
        dimensions: '10 x 28 mm, 4° Lordosis',
        material: 'PEEK' as const,
        manufacturer: 'Medtronic Capstone',
        lotNumber: 'MC-44102'
      });
    } else if (key === 'ACDF') {
      const levels = patient.affectedLevels.length > 0 ? patient.affectedLevels : ['C5', 'C6'];
      generatedImplants = [
        { id: 'imp-gen-cage', type: 'Interbody Cage' as const, level: `${levels[0]}-${levels[1] || 'C6'}`, side: 'Midline' as const, dimensions: '6.0 mm, 14 x 12 mm', material: 'PEEK' as const, manufacturer: 'Medtronic Cornerstone', lotNumber: 'CS-8812' },
        { id: 'imp-gen-plate', type: 'Anterior Plate' as const, level: `${levels[0]}-${levels[1] || 'C6'}`, side: 'Midline' as const, dimensions: '22.5 mm 2-level locking', material: 'Titanium' as const, manufacturer: 'Medtronic Atlantis Vision', lotNumber: 'AV-4401' },
        { id: 'imp-gen-scr1', type: 'Cervical Screw' as const, level: levels[0], side: 'Bilateral' as const, dimensions: '14 x 4.0 mm', material: 'Titanium' as const, manufacturer: 'Medtronic Atlantis', lotNumber: 'AS-140' },
        { id: 'imp-gen-scr2', type: 'Cervical Screw' as const, level: levels[1] || 'C6', side: 'Bilateral' as const, dimensions: '14 x 4.0 mm', material: 'Titanium' as const, manufacturer: 'Medtronic Atlantis', lotNumber: 'AS-141' }
      ];
    }

    setNote(prev => ({
      ...prev,
      procedureName: tpl.procedureName || prev.procedureName,
      approach: (tpl.approach as SurgicalApproach) || prev.approach,
      position: tpl.position || prev.position,
      incisionDetails: tpl.incisionDetails || prev.incisionDetails,
      fluorescopyTimeSec: tpl.fluorescopyTimeSec || prev.fluorescopyTimeSec,
      radiationDoseDAP: tpl.radiationDoseDAP || prev.radiationDoseDAP,
      microscopeUsed: tpl.microscopeUsed !== undefined ? tpl.microscopeUsed : prev.microscopeUsed,
      microscopeModel: tpl.microscopeModel || prev.microscopeModel,
      decompressionDetails: tpl.decompressionDetails || prev.decompressionDetails,
      discectomyDetails: tpl.discectomyDetails || prev.discectomyDetails,
      interbodyFusionDetails: tpl.interbodyFusionDetails || prev.interbodyFusionDetails,
      instrumentationDetails: tpl.instrumentationDetails || prev.instrumentationDetails,
      boneGraftUsed: tpl.boneGraftUsed || prev.boneGraftUsed,
      duralIntegrity: tpl.duralIntegrity || prev.duralIntegrity,
      hemostasisAndClosure: tpl.hemostasisAndClosure || prev.hemostasisAndClosure,
      estimatedBloodLossMl: tpl.estimatedBloodLossMl || prev.estimatedBloodLossMl,
      drainsPlaced: tpl.drainsPlaced || prev.drainsPlaced,
      complications: tpl.complications || prev.complications,
      immediatePostOpPlan: tpl.immediatePostOpPlan || prev.immediatePostOpPlan,
      implants: generatedImplants,
      primarySurgeon: patient.attendingSurgeon || prev.primarySurgeon,
      assistantSurgeon: patient.fellowOrResident || prev.assistantSurgeon
    }));
  };

  const handleVerifyAsConsultant = () => {
    const verifiedAttribution: DataEntryAttribution = {
      enteredByName: note.entryAttribution?.enteredByName || currentSurgeon.name,
      enteredByDesignation: note.entryAttribution?.enteredByDesignation || currentSurgeon.designation,
      staffTier: note.entryAttribution?.staffTier || currentSurgeon.tier,
      enteredAt: note.entryAttribution?.enteredAt || new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      verifiedByConsultant: `${currentSurgeon.name} (${currentSurgeon.designation})`,
      verifiedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      verificationStatus: 'Verified by Consultant'
    };

    const updatedNote = {
      ...note,
      entryAttribution: verifiedAttribution,
      isLocked: true,
      surgeonSignature: currentSurgeon.formalName
    };
    setNote(updatedNote);
    onSave(updatedNote);
  };

  const handleAddImplant = () => {
    const newImplant: ImplantRecord = {
      id: `imp-${Date.now()}`,
      type: 'Pedicle Screw',
      level: note.operativeLevels[0] || 'L4',
      side: 'Bilateral',
      dimensions: '6.5 x 45 mm',
      material: 'Titanium',
      manufacturer: 'Medtronic',
      lotNumber: `LOT-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setNote(prev => ({
      ...prev,
      implants: [...prev.implants, newImplant]
    }));
  };

  const handleRemoveImplant = (id: string) => {
    setNote(prev => ({
      ...prev,
      implants: prev.implants.filter(imp => imp.id !== id)
    }));
  };

  const handleImplantChange = (id: string, field: keyof ImplantRecord, value: any) => {
    setNote(prev => ({
      ...prev,
      implants: prev.implants.map(imp => imp.id === id ? { ...imp, [field]: value } : imp)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(note);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save operative note:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="ot-note"
        pinnedCodes={['STV-SP-INT-03', 'STV-SP-INT-06']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Staff Data Attribution & Consultant Verification Header */}
      <DataAttributionBadge
        attribution={note.entryAttribution}
        currentSurgeon={currentSurgeon}
        moduleName="Spine Operative Note"
        onVerify={handleVerifyAsConsultant}
      />

      {/* Top action bar with Template selector */}
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
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              Spine Operative Record (OT Note)
            </h2>
            <p style={{ fontSize: '12px', color: '#6e6e73', margin: '2px 0 0 0' }}>
              Standardized evidence-based documentation with implant traceability and IONM telemetry
            </p>
          </div>
        </div>

        {/* Template insertion box & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAutoGenerateByProcedure}
            className="btn btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              color: '#0071e3',
              border: '1px solid rgba(0, 113, 227, 0.25)',
              background: 'rgba(0, 113, 227, 0.04)'
            }}
            title="Auto-detect patient procedure and generate evidence-based operative narrative and implants"
          >
            <Sparkles size={14} color="#0071e3" />
            <span>Auto-Generate from Procedure</span>
          </button>

          <button
            type="button"
            onClick={handleSmartSynthesize}
            disabled={isSynthesizing}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              background: 'linear-gradient(135deg, #0071e3 0%, #00c7be 100%)',
              border: 'none',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 113, 227, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Auto-synthesize operative note from CSSD implants, PACS dosimetry, and spinal levels"
          >
            <Sparkles size={14} />
            <span>{isSynthesizing ? 'Synthesizing...' : '✨ Smart Auto-Fill (Connectors)'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#6e6e73' }}>
              Template:
            </span>
            <select
              value={selectedTemplateKey}
              onChange={(e) => setSelectedTemplateKey(e.target.value)}
              style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="MIS-TLIF">MIS-TLIF (L4-L5 / L5-S1)</option>
              <option value="ACDF">Anterior Cervical ACDF (C5-C6)</option>
              <option value="Microdiscectomy">Tubular Lumbar Microdiscectomy</option>
              <option value="ScoliosisCorrection">Scoliosis Posterior Deformity PSF</option>
              <option value="MultiLevelDecompression">Multi-Level Decompression & Fusion (L2-L5)</option>
              <option value="Laminoplasty">Cervical Expansile Laminoplasty (C3-C7)</option>
              <option value="Kyphoplasty">Balloon Kyphoplasty (PMMA Cement)</option>
            </select>
            <button
              type="button"
              onClick={() => handleApplyTemplate(selectedTemplateKey)}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '11px', color: '#0071e3' }}
              title="Apply selected template"
            >
              <Wand2 size={13} color="#0071e3" />
              <span>Apply</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onPrintPreview}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <Printer size={14} />
            <span>Print OT Record</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            {saving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save OT Record'}</span>
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
          <span>Operative Note saved successfully to spine database! Accessible to all connected surgeons.</span>
        </div>
      )}

      {/* Grid of details: Surgical Team & Patient Demographics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#0071e3', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={15} color="#0071e3" /> Surgical Team & Timestamps
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Surgery Date</label>
              <input
                type="date"
                value={note.surgeryDate}
                onChange={e => setNote({ ...note, surgeryDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Primary Surgeon</label>
              <input
                type="text"
                value={note.primarySurgeon}
                onChange={e => setNote({ ...note, primarySurgeon: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Start Time</label>
              <input
                type="text"
                value={note.startTime}
                onChange={e => setNote({ ...note, startTime: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>End Time</label>
              <input
                type="text"
                value={note.endTime}
                onChange={e => setNote({ ...note, endTime: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Assistant Surgeon</label>
              <input
                type="text"
                value={note.assistantSurgeon || ''}
                onChange={e => setNote({ ...note, assistantSurgeon: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Anesthesiologist</label>
              <input
                type="text"
                value={note.anesthesiologist}
                onChange={e => setNote({ ...note, anesthesiologist: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} /> OR Environment & Safety
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Surgical Approach</label>
              <select
                value={note.approach}
                onChange={e => setNote({ ...note, approach: e.target.value as SurgicalApproach })}
              >
                <option value="Posterior (MIS / Tubular)">Posterior (MIS / Tubular)</option>
                <option value="Posterior (Open)">Posterior (Open)</option>
                <option value="Anterior (Smith-Robinson ACDF)">Anterior (Smith-Robinson ACDF)</option>
                <option value="Anterior Retroperitoneal (ALIF)">Anterior Retroperitoneal (ALIF)</option>
                <option value="Lateral Transpsoas / Oblique (XLIF / OLIF)">Lateral Transpsoas / Oblique (XLIF / OLIF)</option>
                <option value="Percutaneous Endoscopic (PECD / PELD)">Percutaneous Endoscopic (PECD / PELD)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Patient Position</label>
              <input
                type="text"
                value={note.position}
                onChange={e => setNote({ ...note, position: e.target.value as any })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Fluoroscopy Exposure (Sec)</label>
              <input
                type="number"
                value={note.fluorescopyTimeSec}
                onChange={e => setNote({ ...note, fluorescopyTimeSec: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Radiation Dose (DAP)</label>
              <input
                type="text"
                value={note.radiationDoseDAP || ''}
                onChange={e => setNote({ ...note, radiationDoseDAP: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Operating Microscope</label>
              <input
                type="text"
                value={note.microscopeModel || 'None'}
                onChange={e => setNote({ ...note, microscopeModel: e.target.value, microscopeUsed: !!e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Estimated Blood Loss (ml)</label>
              <input
                type="number"
                value={note.estimatedBloodLossMl}
                onChange={e => setNote({ ...note, estimatedBloodLossMl: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Procedure Title & Diagnoses */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#10b981' }}>
          Diagnostic & Operative Headings
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Full Procedure Name</label>
            <input
              type="text"
              value={note.procedureName}
              onChange={e => setNote({ ...note, procedureName: e.target.value })}
              style={{ fontWeight: 600 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Pre-Operative Diagnosis</label>
              <textarea
                rows={3}
                value={note.preOpDiagnosis}
                onChange={e => setNote({ ...note, preOpDiagnosis: e.target.value })}
                style={{ minHeight: '75px', lineHeight: '1.5', fontSize: '12.5px', padding: '8px 12px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Post-Operative Diagnosis</label>
              <textarea
                rows={3}
                value={note.postOpDiagnosis}
                onChange={e => setNote({ ...note, postOpDiagnosis: e.target.value })}
                style={{ minHeight: '75px', lineHeight: '1.5', fontSize: '12.5px', padding: '8px 12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Spine Operative Narrative with Confirmation Tick Boxes & Large Text Boxes */}
      <div className="glass-panel" style={{ padding: '18px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={16} color="#0071e3" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Detailed Surgical Steps & Findings
              </h3>
              <span style={{
                background: Object.values(stepConfirmations).filter(Boolean).length === 7 ? 'rgba(52, 199, 89, 0.12)' : 'rgba(0, 113, 227, 0.1)',
                color: Object.values(stepConfirmations).filter(Boolean).length === 7 ? '#248a3d' : '#0071e3',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {Object.values(stepConfirmations).filter(Boolean).length} of 7 Steps Confirmed
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              Spacious text areas for effortless reading. Check each step's tick box to confirm surgical verification.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleConfirmAllSteps}
              className="btn btn-secondary"
              style={{ fontSize: '11.5px', padding: '4px 12px', color: '#248a3d', borderColor: 'rgba(52, 199, 89, 0.3)', background: 'rgba(52, 199, 89, 0.06)' }}
            >
              <CheckCircle2 size={13} color="#248a3d" />
              <span>Confirm All Steps</span>
            </button>
            <button
              type="button"
              onClick={handleClearAllSteps}
              className="btn btn-secondary"
              style={{ fontSize: '11.5px', padding: '4px 10px', color: 'var(--text-muted)' }}
            >
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Step 1: Incision & Exposure */}
          <div style={{
            background: stepConfirmations.step1 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step1 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step1 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step1}
                  onChange={() => toggleStepConfirmation('step1')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  1. Incision & Exposure (Approach & Fluoroscopic Level Confirmation)
                </span>
              </label>

              {stepConfirmations.step1 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step1')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <textarea
              rows={5}
              value={note.incisionDetails}
              onChange={e => setNote({ ...note, incisionDetails: e.target.value })}
              style={{
                minHeight: '110px',
                lineHeight: '1.55',
                fontSize: '13px',
                padding: '10px 14px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Step 2: Neural Decompression */}
          <div style={{
            background: stepConfirmations.step2 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step2 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step2 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step2}
                  onChange={() => toggleStepConfirmation('step2')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  2. Neural Decompression & Facetectomy / Flavectomy / Root Release
                </span>
              </label>

              {stepConfirmations.step2 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step2')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <textarea
              rows={6}
              value={note.decompressionDetails}
              onChange={e => setNote({ ...note, decompressionDetails: e.target.value })}
              style={{
                minHeight: '130px',
                lineHeight: '1.55',
                fontSize: '13px',
                padding: '10px 14px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Step 3: Discectomy & Endplate Preparation */}
          <div style={{
            background: stepConfirmations.step3 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step3 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step3 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step3}
                  onChange={() => toggleStepConfirmation('step3')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  3. Discectomy & Cartilaginous Endplate Preparation
                </span>
              </label>

              {stepConfirmations.step3 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step3')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <textarea
              rows={5}
              value={note.discectomyDetails || ''}
              onChange={e => setNote({ ...note, discectomyDetails: e.target.value })}
              style={{
                minHeight: '110px',
                lineHeight: '1.55',
                fontSize: '13px',
                padding: '10px 14px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Step 4: Interbody Fusion & Cage Seating */}
          <div style={{
            background: stepConfirmations.step4 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step4 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step4 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step4}
                  onChange={() => toggleStepConfirmation('step4')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  4. Interbody Fusion & Cage Seating
                </span>
              </label>

              {stepConfirmations.step4 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step4')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <textarea
              rows={5}
              value={note.interbodyFusionDetails || ''}
              onChange={e => setNote({ ...note, interbodyFusionDetails: e.target.value })}
              style={{
                minHeight: '110px',
                lineHeight: '1.55',
                fontSize: '13px',
                padding: '10px 14px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Step 5: Spinal Instrumentation */}
          <div style={{
            background: stepConfirmations.step5 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step5 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step5 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step5}
                  onChange={() => toggleStepConfirmation('step5')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  5. Spinal Instrumentation & Pedicle Screws / Anterior Plates
                </span>
              </label>

              {stepConfirmations.step5 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step5')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <textarea
              rows={5}
              value={note.instrumentationDetails}
              onChange={e => setNote({ ...note, instrumentationDetails: e.target.value })}
              style={{
                minHeight: '110px',
                lineHeight: '1.55',
                fontSize: '13px',
                padding: '10px 14px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Step 6: Bone Grafting & Dural Integrity */}
          <div style={{
            background: stepConfirmations.step6 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step6 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step6 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step6}
                  onChange={() => toggleStepConfirmation('step6')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  6. Bone Grafting & Dural Integrity Verification
                </span>
              </label>

              {stepConfirmations.step6 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step6')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Bone Graft Materials Used
                </label>
                <textarea
                  rows={4}
                  value={note.boneGraftUsed}
                  onChange={e => setNote({ ...note, boneGraftUsed: e.target.value })}
                  style={{
                    minHeight: '90px',
                    lineHeight: '1.5',
                    fontSize: '12.5px',
                    padding: '10px 12px',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#ffffff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Dural Integrity Verification & Drains
                </label>
                <select
                  value={note.duralIntegrity}
                  onChange={e => setNote({ ...note, duralIntegrity: e.target.value as any })}
                  style={{ height: '38px', marginBottom: '8px', width: '100%' }}
                >
                  <option value="Intact - No tear">Intact - No dural tear (Valsalva test negative)</option>
                  <option value="Dural tear repaired primarily with 5-0 Prolene + Fibrin glue">Dural tear repaired primarily with 5-0 Prolene + Fibrin glue</option>
                  <option value="Dural patch applied">Dural patch / Collagen matrix applied</option>
                </select>
                <input
                  type="text"
                  placeholder="Drains placed (e.g. 10Fr Hemovac subfascial)"
                  value={note.drainsPlaced}
                  onChange={e => setNote({ ...note, drainsPlaced: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Step 7: Hemostasis & Layered Closure */}
          <div style={{
            background: stepConfirmations.step7 ? 'rgba(52, 199, 89, 0.02)' : '#ffffff',
            border: stepConfirmations.step7 ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: stepConfirmations.step7 ? '0 1px 3px rgba(52, 199, 89, 0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={!!stepConfirmations.step7}
                  onChange={() => toggleStepConfirmation('step7')}
                  style={{ width: '16px', height: '16px', accentColor: '#34c759', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  7. Hemostasis & Layered Wound Closure
                </span>
              </label>

              {stepConfirmations.step7 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(52, 199, 89, 0.1)',
                  color: '#248a3d',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={12} />
                  <span>Confirmed by {currentSurgeon.name.split(',')[0]}</span>
                </span>
              ) : (
                <span
                  onClick={() => toggleStepConfirmation('step7')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Click to confirm step
                </span>
              )}
            </div>
            <textarea
              rows={5}
              value={note.hemostasisAndClosure}
              onChange={e => setNote({ ...note, hemostasisAndClosure: e.target.value })}
              style={{
                minHeight: '110px',
                lineHeight: '1.55',
                fontSize: '13px',
                padding: '10px 14px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#ffffff'
              }}
            />
          </div>
        </div>
      </div>

      {/* Implant Tracking Matrix */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#34d399" />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Spine Implants Traceability & Log
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddImplant}
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px', color: '#0071e3' }}
          >
            <Plus size={13} color="#0071e3" />
            <span>Add Implant / Screw</span>
          </button>
        </div>

        {note.implants.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
            No spinal implants logged for this procedure.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {note.implants.map((imp, idx) => (
              <div
                key={imp.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1fr 1fr 1fr auto',
                  gap: '8px',
                  alignItems: 'center',
                  background: '#fbfbfd',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '11px'
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Type</label>
                  <select
                    value={imp.type}
                    onChange={e => handleImplantChange(imp.id, 'type', e.target.value)}
                  >
                    <option value="Pedicle Screw">Pedicle Screw</option>
                    <option value="Interbody Cage">Interbody Cage</option>
                    <option value="Anterior Plate">Anterior Plate</option>
                    <option value="Cervical Screw">Cervical Screw</option>
                    <option value="Connecting Rod">Connecting Rod</option>
                    <option value="Artificial Disc">Artificial Disc</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Level</label>
                  <input
                    type="text"
                    value={imp.level}
                    onChange={e => handleImplantChange(imp.id, 'level', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Side</label>
                  <select
                    value={imp.side || 'Bilateral'}
                    onChange={e => handleImplantChange(imp.id, 'side', e.target.value)}
                  >
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                    <option value="Bilateral">Bilateral</option>
                    <option value="Midline">Midline</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Dimensions</label>
                  <input
                    type="text"
                    value={imp.dimensions}
                    placeholder="e.g. 6.5 x 45mm"
                    onChange={e => handleImplantChange(imp.id, 'dimensions', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Manufacturer</label>
                  <input
                    type="text"
                    value={imp.manufacturer}
                    onChange={e => handleImplantChange(imp.id, 'manufacturer', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Lot #</label>
                  <input
                    type="text"
                    value={imp.lotNumber || ''}
                    placeholder="LOT-xxxxx"
                    onChange={e => handleImplantChange(imp.id, 'lotNumber', e.target.value)}
                  />
                </div>
                <div style={{ paddingTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveImplant(imp.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove implant"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intraoperative Neuromonitoring & Post-Op Plan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={15} /> Neuromonitoring (IONM) Record
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Closing IONM Status</label>
              <select
                value={note.neuromonitoring.closingStatus}
                onChange={e => setNote({
                  ...note,
                  neuromonitoring: { ...note.neuromonitoring, closingStatus: e.target.value as any }
                })}
              >
                <option value="Stable Baseline">Stable Baseline (&gt; 80% baseline throughout)</option>
                <option value="Transient Drop Recovered">Transient Drop Recovered</option>
                <option value="Persistent Deficit">Persistent Deficit</option>
                <option value="Not Used">Not Used</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Intraoperative Events & Stimulations</label>
              <textarea
                rows={4}
                value={note.neuromonitoring.intraopEvents}
                onChange={e => setNote({
                  ...note,
                  neuromonitoring: { ...note.neuromonitoring, intraopEvents: e.target.value }
                })}
                style={{ minHeight: '85px', lineHeight: '1.5', fontSize: '12.5px', padding: '8px 12px' }}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: '#0071e3' }}>
            Immediate Post-Op Plan & Sign-off
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>PACU & Ward Orders</label>
              <textarea
                rows={5}
                value={note.immediatePostOpPlan}
                onChange={e => setNote({ ...note, immediatePostOpPlan: e.target.value })}
                style={{ minHeight: '110px', lineHeight: '1.55', fontSize: '13px', padding: '10px 14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>Operating Surgeon Signature</label>
              <input
                type="text"
                value={note.surgeonSignature}
                onChange={e => setNote({ ...note, surgeonSignature: e.target.value })}
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0071e3' }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
