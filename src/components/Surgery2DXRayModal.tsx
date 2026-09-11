import React, { useState } from 'react';
import { Patient } from '../types/spine';
import { Surgery2DXRayViewer } from './Surgery2DXRayViewer';
import { X, Printer, Download, Eye, Scan, CheckCircle2, Sliders } from 'lucide-react';

interface Surgery2DXRayModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

export const Surgery2DXRayModal: React.FC<Surgery2DXRayModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'lateral' | 'ap'>('both');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(16px)',
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        height: '88vh',
        background: '#070b12',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Control Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.8)'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stavya Intraoperative C-Arm Fluoroscopy Suite
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '2px 0 0' }}>
              Executed Surgery 2D X-Ray Animation • {patient.name} ({patient.mrn})
            </h2>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Procedure: <strong>{patient.plannedProcedure}</strong> • Levels: <strong>{patient.affectedLevels.join('-')}</strong> • Surgeon: {patient.attendingSurgeon}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={13} />
              <span>Print Film</span>
            </button>

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: High Resolution 2D X-Ray Viewer */}
        <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
          <Surgery2DXRayViewer
            patient={patient}
            height="100%"
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};
