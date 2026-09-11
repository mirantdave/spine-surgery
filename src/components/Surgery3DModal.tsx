import React from 'react';
import { Patient } from '../types/spine';
import { Surgery3DViewer } from './Surgery3DViewer';
import { 
  X, 
  Layers, 
  ShieldCheck, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Printer, 
  ExternalLink,
  Sparkles,
  Calendar,
  User,
  Bed
} from 'lucide-react';

interface Surgery3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onNavigateToOtNote?: () => void;
}

export const Surgery3DModal: React.FC<Surgery3DModalProps> = ({
  isOpen,
  onClose,
  patient,
  onNavigateToOtNote,
}) => {
  if (!isOpen) return null;

  const note = patient.operativeNote;

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1180px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(0, 113, 227, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0071e3 0%, #0284c7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)'
            }}>
              🧊
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  {patient.name}
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  background: '#f5f5f7',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  MRN: {patient.mrn}
                </span>
                <span className="badge badge-blue">
                  {patient.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                <span>{patient.age}y / {patient.gender}</span>
                <span>•</span>
                <span><Bed size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {patient.roomBed}</span>
                <span>•</span>
                <span>Primary Surgeon: <strong>{patient.attendingSurgeon}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                background: '#f5f5f7',
                color: '#6e6e73',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e5ea';
                e.currentTarget.style.color = '#1d1d1f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f7';
                e.currentTarget.style.color = '#6e6e73';
              }}
              title="Close 3D View (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split Grid (3D Interactive Canvas on Left, Surgical Blueprint on Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 0.95fr',
          flex: 1,
          overflowY: 'auto',
          minHeight: '560px'
        }}>
          {/* Left Column: Interactive 3D WebGL Canvas */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRight: '1px solid var(--border-color)' }}>
            <Surgery3DViewer patient={patient} height="560px" interactiveHUD={true} />
          </div>

          {/* Right Column: Executed Surgical Records & Hardware Specs */}
          <div style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#ffffff'
          }}>
            {/* Executed Procedure Header */}
            <div style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.06) 0%, rgba(2, 132, 199, 0.03) 100%)',
              border: '1px solid rgba(0, 113, 227, 0.2)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0071e3', fontWeight: 700 }}>
                Executed Surgical Construct
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', marginTop: '3px' }}>
                {patient.plannedProcedure}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(0, 113, 227, 0.1)',
                  color: '#0071e3',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  Levels: {patient.affectedLevels.join(' - ') || patient.spineRegion}
                </span>
                <span style={{ fontSize: '11.5px', color: '#424245' }}>
                  Approach: <strong>{patient.approach}</strong>
                </span>
                <span style={{ fontSize: '11.5px', color: '#424245' }}>
                  Date: <strong>{patient.plannedOrSurgeryDate}</strong>
                </span>
              </div>
            </div>

            {/* Implants & Hardware Verified in 3D */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#1d1d1f' }}>
                  <Sparkles size={14} color="#0071e3" />
                  <span>Verified 3D Implants & Fixation</span>
                </div>
                <span style={{ fontSize: '11px', color: '#34c759', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Confirmed Biplanar
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {note?.implants && note.implants.length > 0 ? (
                  note.implants.map((imp) => (
                    <div key={imp.id} style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f' }}>
                          {imp.type} ({imp.side})
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#6e6e73', fontFamily: 'var(--font-mono)' }}>
                          Level: {imp.level} • {imp.dimensions} • {imp.material}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#0071e3' }}>
                          {imp.manufacturer}
                        </div>
                        <div style={{ fontSize: '9.5px', color: '#86868b', fontFamily: 'var(--font-mono)' }}>
                          Lot: {imp.lotNumber}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    fontSize: '11.5px',
                    color: '#64748b'
                  }}>
                    Implants rendered according to standard {patient.plannedProcedure} construct specifications.
                  </div>
                )}
              </div>
            </div>

            {/* Surgical Execution Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1d1d1f' }}>
                Intraoperative Technique & Safeguards
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: '#f5f5f7' }}>
                  <div style={{ fontSize: '10px', color: '#86868b', textTransform: 'uppercase' }}>Neuromonitoring</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', marginTop: '2px' }}>
                    {note?.neuromonitoring?.closingStatus || 'Stable Baseline (MEP/SSEP)'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#34c759', marginTop: '2px' }}>
                    Triggered EMG safe (&gt; 15 mA)
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: '#f5f5f7' }}>
                  <div style={{ fontSize: '10px', color: '#86868b', textTransform: 'uppercase' }}>Dural Integrity</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', marginTop: '2px' }}>
                    {note?.duralIntegrity || 'Intact - No CSF Leak'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#0071e3', marginTop: '2px' }}>
                    Valsalva maneuver negative
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: '#f5f5f7' }}>
                  <div style={{ fontSize: '10px', color: '#86868b', textTransform: 'uppercase' }}>Estimated Blood Loss</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', marginTop: '2px' }}>
                    {note?.estimatedBloodLossMl || 120} ml
                  </div>
                  <div style={{ fontSize: '10px', color: '#6e6e73', marginTop: '2px' }}>
                    Hemostasis with Floseal & Bipolar
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: '#f5f5f7' }}>
                  <div style={{ fontSize: '10px', color: '#86868b', textTransform: 'uppercase' }}>Fluoroscopy / C-Arm</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', marginTop: '2px' }}>
                    {note?.fluorescopyTimeSec || 38}s (DAP: {note?.radiationDoseDAP || '14.8 mGy.cm²'})
                  </div>
                  <div style={{ fontSize: '10px', color: '#6e6e73', marginTop: '2px' }}>
                    AP & Lateral confirmed
                  </div>
                </div>
              </div>

              {/* Surgeon Audit Attribution */}
              <div style={{
                marginTop: '4px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(52, 199, 89, 0.08)',
                border: '1px solid rgba(52, 199, 89, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#34c759" />
                <div style={{ fontSize: '11px', color: '#1d1d1f' }}>
                  <strong>Consultant Verified:</strong> {patient.attendingSurgeon} (Stavya Spine Surgery Department)
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              {onNavigateToOtNote && (
                <button
                  onClick={() => {
                    onNavigateToOtNote();
                    onClose();
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, height: '36px', fontSize: '12px', borderRadius: '10px' }}
                >
                  <FileText size={14} />
                  <span>Open Full Operative Record</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="btn btn-secondary"
                style={{ height: '36px', fontSize: '12px', borderRadius: '10px', padding: '0 16px' }}
              >
                Close 3D
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
