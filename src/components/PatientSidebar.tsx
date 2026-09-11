import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types/spine';
import { Bed, Calendar } from 'lucide-react';

interface PatientSidebarProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  filterText: string;
  onOpenPatient3D?: (patient: Patient) => void;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  filterText,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(filterText.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(filterText.toLowerCase()) ||
      patient.primaryDiagnosis.toLowerCase().includes(filterText.toLowerCase()) ||
      patient.affectedLevels.some(l => l.toLowerCase().includes(filterText.toLowerCase())) ||
      patient.plannedProcedure.toLowerCase().includes(filterText.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'POSTOP') return patient.status.startsWith('Post-Op');
    if (statusFilter === 'SCHEDULED') return patient.status === 'Scheduled for Surgery' || patient.status === 'Pre-Op Evaluation';
    if (statusFilter === 'DISCHARGED') return patient.status === 'Discharged';
    return true;
  });

  const getStatusBadge = (status: PatientStatus) => {
    if (status.includes('POD 0') || status.includes('POD 1')) {
      return <span className="badge badge-amber" style={{ fontSize: '10px', padding: '1px 6px' }}>{status}</span>;
    }
    if (status.includes('POD 2') || status.includes('POD 3')) {
      return <span className="badge badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>{status}</span>;
    }
    if (status === 'Scheduled for Surgery') {
      return <span className="badge badge-purple" style={{ fontSize: '10px', padding: '1px 6px' }}>Scheduled</span>;
    }
    if (status === 'Discharged') {
      return <span className="badge badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>Discharged</span>;
    }
    return <span className="badge badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>{status}</span>;
  };

  return (
    <aside style={{
      width: '300px',
      borderRight: '1px solid var(--border-color)',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 52px)',
      overflow: 'hidden'
    }}>
      {/* Header & Clean 3-way Filter */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Patients
          </span>
          <span style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            borderRadius: '999px',
            padding: '1px 7px',
            fontSize: '11px',
            fontWeight: 600
          }}>
            {filteredPatients.length}
          </span>
        </div>

        {/* Quick Filter Segmented Control */}
        <div style={{
          display: 'flex',
          gap: '2px',
          background: '#f1f2f4',
          padding: '2px',
          borderRadius: '8px'
        }}>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'POSTOP', label: 'Inpatients' },
            { key: 'SCHEDULED', label: 'Planned' },
            { key: 'DISCHARGED', label: 'Done' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                flex: 1,
                background: statusFilter === tab.key ? '#ffffff' : 'transparent',
                boxShadow: statusFilter === tab.key ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
                color: statusFilter === tab.key ? '#1d1d1f' : '#6e6e73',
                border: 'none',
                padding: '4px 2px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: statusFilter === tab.key ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px',
        background: '#ffffff'
      }}>
        {filteredPatients.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            fontSize: '12px'
          }}>
            No matching patient records
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatientId;

              return (
                <div
                  key={patient.id}
                  onClick={() => onSelectPatient(patient.id)}
                  style={{
                    padding: '9px 11px',
                    borderRadius: '9px',
                    background: isSelected ? 'rgba(0, 113, 227, 0.06)' : '#ffffff',
                    border: isSelected ? '1px solid rgba(0, 113, 227, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  {/* Top Line: Name and Status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {patient.name}
                    </span>
                    {getStatusBadge(patient.status)}
                  </div>

                  {/* Spinal Level & Procedure */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: 'rgba(0, 113, 227, 0.08)',
                      color: '#0071e3'
                    }}>
                      {patient.affectedLevels.join('-') || patient.spineRegion.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1
                    }}>
                      {patient.plannedProcedure}
                    </span>
                  </div>

                  {/* Bed & Details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '10.5px',
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Bed size={11} color="#0071e3" /> {patient.roomBed.replace('Spine Ward - ', '')}
                    </span>
                    <span>{patient.age}y/{patient.gender.charAt(0)} • {patient.mrn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
