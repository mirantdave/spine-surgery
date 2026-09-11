import React, { useState } from 'react';
import { Patient, MedicationItem, SurgeonUser } from '../types/spine';
import { ROUTINE_MEDICATION_BUNDLES } from '../data/templates';
import { DataAttributionBadge } from './DataAttributionBadge';
import { ProtocolLinkStrip } from './ProtocolLinkStrip';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Clock 
} from 'lucide-react';

interface PrescriptionManagerProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onSave: (meds: MedicationItem[]) => Promise<void>;
  onPrintPreview: () => void;
  /** Opens the governing clinical protocol in the Clinical Protocols module. */
  onOpenProtocol?: (protocolId: string) => void;
}

export const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  patient,
  currentSurgeon,
  onSave,
  onPrintPreview,
  onOpenProtocol,
}) => {
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    if (patient.prescriptions && patient.prescriptions.length > 0) {
      return patient.prescriptions;
    }
    // Default to fusion protocol if fusion is planned, or microdiscectomy if discectomy
    if (patient.plannedProcedure.toLowerCase().includes('microdiscectomy') || patient.plannedProcedure.toLowerCase().includes('endoscopic')) {
      return ROUTINE_MEDICATION_BUNDLES[1].medications;
    } else if (patient.plannedProcedure.toLowerCase().includes('acdf') || patient.spineRegion === 'cervical') {
      return ROUTINE_MEDICATION_BUNDLES[2].medications;
    }
    return ROUTINE_MEDICATION_BUNDLES[0].medications;
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleApplyBundle = (bundleId: string) => {
    const bundle = ROUTINE_MEDICATION_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) return;
    setMedications(bundle.medications);
  };

  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      drugName: 'Paracetamol',
      genericName: 'Acetaminophen',
      dosage: '1000 mg',
      route: 'Oral',
      frequency: 'TID (Thrice Daily)',
      durationDays: 5,
      instructions: 'Take after food.',
      category: 'Analgesic',
      isPreselected: false,
    };
    setMedications([...medications, newMed]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleMedChange = (id: string, field: keyof MedicationItem, value: any) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(medications);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save prescriptions:', err);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryBadge = (category: MedicationItem['category']) => {
    switch (category) {
      case 'Analgesic': return <span className="badge badge-rose">{category}</span>;
      case 'Neuropathic Pain': return <span className="badge badge-purple">{category}</span>;
      case 'Muscle Relaxant': return <span className="badge badge-amber">{category}</span>;
      case 'DVT Prophylaxis': return <span className="badge badge-blue">{category}</span>;
      case 'Bone Health': return <span className="badge badge-green">{category}</span>;
      default: return <span className="badge badge-blue">{category}</span>;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProtocolLinkStrip
        patient={patient}
        moduleTarget="inpatient:prescriptions"
        pinnedCodes={['STV-SP-POST-02', 'STV-SP-PRE-03']}
        onOpenProtocol={onOpenProtocol}
      />

      {/* Staff Data Attribution Header */}
      <DataAttributionBadge
        currentSurgeon={currentSurgeon}
        moduleName="Spine Medication & Prescription Protocol"
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
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#fb7185',
            padding: '8px',
            borderRadius: '10px'
          }}>
            <Pill size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Routine Spine Medication & Prescription Protocols
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Pre-selected spine regimens: Fusion-safe analgesia, neuropathic radicular relief, DVT prophylaxis, and bone healing
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddMedication}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px', color: '#0071e3' }}
          >
            <Plus size={13} color="#0071e3" />
            <span>Add Single Drug</span>
          </button>

          <button
            type="button"
            onClick={onPrintPreview}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Printer size={14} />
            <span>Print Rx Slip</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            {saving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Prescriptions'}</span>
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
          <span>Prescriptions updated and saved across network. Ready for pharmacy & discharge.</span>
        </div>
      )}

      {/* Routine Medication Bundles 1-Click Cards */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={16} color="#0071e3" />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            1-Click Pre-Selected Routine Spine Protocols
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {ROUTINE_MEDICATION_BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {bundle.bundleName}
                  </h4>
                  <span className="badge badge-blue" style={{ fontSize: '9px' }}>
                    {bundle.medications.length} Drugs
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {bundle.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApplyBundle(bundle.id)}
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '5px 10px', color: '#0071e3', alignSelf: 'flex-start' }}
              >
                <Sparkles size={12} color="#0071e3" />
                <span>Apply This Protocol</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fusion Warning Callout */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
        color: '#fbbf24'
      }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 700 }}>Spine Surgeon Clinical Tip: </span>
          <span>
            Non-selective NSAIDs (e.g. Ibuprofen, Naproxen, Diclofenac) can inhibit osteoblastic activity and impair interbody fusion. For fusion cases (TLIF, ACDF, PSF), Paracetamol and short-term Tramadol are preferred.
          </span>
        </div>
      </div>

      {/* Active Medication List */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#f43f5e' }}>
          Active Prescriptions for {patient.name} ({medications.length} Items)
        </h3>

        {medications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '12px' }}>
            No medications prescribed yet. Click a protocol above or add drugs manually.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {medications.map((med) => (
              <div
                key={med.id}
                style={{
                  background: '#fbfbfd',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.2fr 0.8fr 2.5fr auto',
                  gap: '10px',
                  alignItems: 'center',
                  fontSize: '11px'
                }}
              >
                {/* Drug Name & Category */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {getCategoryBadge(med.category)}
                  </div>
                  <input
                    type="text"
                    value={med.drugName}
                    onChange={e => handleMedChange(med.id, 'drugName', e.target.value)}
                    style={{ fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{med.genericName}</span>
                </div>

                {/* Dosage */}
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Dosage</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={e => handleMedChange(med.id, 'dosage', e.target.value)}
                  />
                </div>

                {/* Route */}
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Route</label>
                  <select
                    value={med.route}
                    onChange={e => handleMedChange(med.id, 'route', e.target.value)}
                  >
                    <option value="Oral">Oral</option>
                    <option value="IV">IV</option>
                    <option value="SC">SC</option>
                    <option value="IM">IM</option>
                    <option value="Topical">Topical</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Frequency</label>
                  <select
                    value={med.frequency}
                    onChange={e => handleMedChange(med.id, 'frequency', e.target.value)}
                  >
                    <option value="OD (Once Daily)">OD (Once Daily)</option>
                    <option value="BD (Twice Daily)">BD (Twice Daily)</option>
                    <option value="TID (Thrice Daily)">TID (Thrice Daily)</option>
                    <option value="QID (4 Times Daily)">QID (4 Times Daily)</option>
                    <option value="At Bedtime (HS)">At Bedtime (HS)</option>
                    <option value="SOS / PRN">SOS / PRN (As needed)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Days</label>
                  <input
                    type="number"
                    value={med.durationDays}
                    onChange={e => handleMedChange(med.id, 'durationDays', parseInt(e.target.value, 10) || 1)}
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Instructions</label>
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={e => handleMedChange(med.id, 'instructions', e.target.value)}
                  />
                </div>

                {/* Delete */}
                <div style={{ paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(med.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove Drug"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};
