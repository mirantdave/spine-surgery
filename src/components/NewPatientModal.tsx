import React, { useState } from 'react';
import { Patient, SpineRegion, SpineLevel, SurgicalApproach, SurgeonUser } from '../types/spine';
import { X, Plus, UserPlus, ShieldCheck, UserCheck } from 'lucide-react';
import { SpineColumnSelector } from './SpineColumnSelector';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Partial<Patient>) => Promise<void>;
  currentSurgeon?: SurgeonUser;
}

const STAVYA_CONSULTANTS = [
  'Dr. Bharat Rajendraprasad Dave',
  'Dr. Mirant Bharat Dave',
  'Dr. Ajay Krishnan',
  'Dr. Ravi Ranjan Rai',
  'Dr. Shivanand Mayi',
  'Dr. Amritesh Singh'
];

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  currentSurgeon,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(50);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mrn, setMrn] = useState(`SPN-2026-0${Math.floor(86 + Math.random() * 20)}`);
  const [roomBed, setRoomBed] = useState('Spine Deluxe - Bed 402');
  const [attendingSurgeon, setAttendingSurgeon] = useState(
    currentSurgeon?.tier === 'CONSULTANT_SPINE_SURGEON' 
      ? currentSurgeon.formalName 
      : STAVYA_CONSULTANTS[0]
  );
  const [diagnosis, setDiagnosis] = useState('L4-L5 Lumbar Canal Stenosis with Radiculopathy');
  const [procedure, setProcedure] = useState('MIS-TLIF L4-L5 with Pedicle Screw Fixation');
  const [spineRegion, setSpineRegion] = useState<SpineRegion>('lumbar');
  const [affectedLevels, setAffectedLevels] = useState<SpineLevel[]>(['L4', 'L5']);
  const [approach, setApproach] = useState<SurgicalApproach>('Posterior (MIS / Tubular)');
  const [status, setStatus] = useState<any>('Scheduled for Surgery');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleLevel = (lvl: SpineLevel) => {
    if (affectedLevels.includes(lvl)) {
      setAffectedLevels(affectedLevels.filter(l => l !== lvl));
    } else {
      setAffectedLevels([...affectedLevels, lvl]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const timeStamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' IST';

    const isConsultant = currentSurgeon?.tier === 'CONSULTANT_SPINE_SURGEON';

    const newPatient: Partial<Patient> = {
      mrn,
      name,
      age,
      gender,
      roomBed,
      contactNumber: '+91 98250 44890',
      attendingSurgeon,
      admissionDate: new Date().toISOString().split('T')[0],
      plannedOrSurgeryDate: new Date().toISOString().split('T')[0],
      status,
      primaryDiagnosis: diagnosis,
      spineRegion,
      affectedLevels,
      affectedDiscs: [],
      plannedProcedure: procedure,
      approach,
      avatarColor: spineRegion === 'cervical' ? '#059669' : spineRegion === 'thoracic' ? '#a855f7' : '#2563eb',
      entryAttribution: {
        enteredByName: currentSurgeon?.formalName || 'Dr. Saurabh Shrikant Kulkarni',
        enteredByDesignation: currentSurgeon?.designation || 'Senior Registrar (Spine Surgery)',
        enteredAt: timeStamp,
        staffTier: currentSurgeon?.tier || 'SENIOR_REGISTRAR',
        verificationStatus: isConsultant ? 'Verified by Consultant' : 'Pending Consultant Review',
        verifiedByConsultant: isConsultant ? currentSurgeon?.formalName : undefined,
        verifiedAt: isConsultant ? timeStamp : undefined,
      }
    };

    try {
      await onAddPatient(newPatient);
      onClose();
    } catch (err) {
      console.error('Failed to add patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1500,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        position: 'relative',
        background: '#ffffff',
        borderRadius: '18px',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f5f5f7',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '7px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
          <div style={{
            background: 'rgba(0, 113, 227, 0.08)',
            padding: '12px',
            borderRadius: '14px',
            color: '#0071e3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserPlus size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.015em' }}>
              New Spine Surgical Admission / Case
            </h2>
            <p style={{ fontSize: '13px', color: '#6e6e73', margin: '3px 0 0 0' }}>
              Initialize digital paperless record with anatomical levels and surgical approach
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Patient Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh Kulkarni" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Age & Gender</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value, 10))} style={{ width: '60px' }} />
                <select value={gender} onChange={e => setGender(e.target.value as any)}>
                  <option value="Male">M</option>
                  <option value="Female">F</option>
                  <option value="Other">O</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>MRN / Hospital ID</label>
              <input type="text" value={mrn} onChange={e => setMrn(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Room / Bed Location</label>
              <input type="text" value={roomBed} onChange={e => setRoomBed(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Clinical Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Scheduled for Surgery">Scheduled for Surgery</option>
                <option value="Pre-Op Evaluation">Pre-Op Evaluation</option>
                <option value="Post-Op Day 0">Post-Op Day 0</option>
                <option value="Post-Op Day 1">Post-Op Day 1</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Primary Diagnosis</label>
              <input type="text" required value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Attending Spine Consultant (Stavya)</label>
              <select value={attendingSurgeon} onChange={e => setAttendingSurgeon(e.target.value)}>
                {STAVYA_CONSULTANTS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Planned Spine Procedure</label>
              <input type="text" required value={procedure} onChange={e => setProcedure(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#1d1d1f', marginBottom: '5px' }}>Surgical Approach</label>
              <select value={approach} onChange={e => setApproach(e.target.value as any)}>
                <option value="Posterior (MIS / Tubular)">Posterior (MIS / Tubular)</option>
                <option value="Posterior (Open)">Posterior (Open)</option>
                <option value="Anterior (Smith-Robinson ACDF)">Anterior (Smith-Robinson ACDF)</option>
                <option value="Anterior Retroperitoneal (ALIF)">Anterior Retroperitoneal (ALIF)</option>
                <option value="Percutaneous Endoscopic (PECD / PELD)">Percutaneous Endoscopic (PECD / PELD)</option>
              </select>
            </div>
          </div>

          {/* Spine Column Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px' }}>
              Select Spine Region & Operated Vertebral Levels:
            </label>
            <SpineColumnSelector
              selectedLevels={affectedLevels}
              onToggleLevel={toggleLevel}
              primaryRegion={spineRegion}
            />
          </div>

          {/* Staff Attribution Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: '#f5f5f7',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: '11px',
            color: '#6e6e73'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={14} color="#0071e3" />
              <span>
                Data Entry Recorder: <strong style={{ color: '#1d1d1f' }}>{currentSurgeon?.formalName || 'Dr. Saurabh Shrikant Kulkarni'}</strong> ({currentSurgeon?.designation || 'Senior Registrar'})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} color="#059669" />
              <span style={{ color: '#059669', fontWeight: 600 }}>Stavya Audit Trail Logged</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Plus size={15} />
              <span>{loading ? 'Creating...' : 'Create Digital Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
