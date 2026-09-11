import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types/spine';
import { Users, Bed, Calendar, Filter, Sparkles } from 'lucide-react';

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
  onOpenPatient3D,
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
      return <span className="badge badge-amber">{status}</span>;
    }
    if (status.includes('POD 2') || status.includes('POD 3')) {
      return <span className="badge badge-green">{status}</span>;
    }
    if (status === 'Scheduled for Surgery') {
      return <span className="badge badge-purple">Scheduled</span>;
    }
    if (status === 'Discharged') {
      return <span className="badge badge-blue">Discharged</span>;
    }
    return <span className="badge badge-blue">{status}</span>;
  };

  return (
    <aside style={{
      width: '310px',
      borderRight: '1px solid var(--border-color)',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 54px)',
      overflow: 'hidden'
    }}>
      {/* Header & Filter Tabs */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Patients
            </span>
          </div>
          <span style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            borderRadius: '999px',
            padding: '1px 7px',
            fontSize: '11px',
            fontWeight: 500
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
            { key: 'POSTOP', label: 'Inpatient' },
            { key: 'SCHEDULED', label: 'Planned' },
            { key: 'DISCHARGED', label: 'Discharged' }
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
                fontSize: '10.5px',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatientId;

              return (
                <div
                  key={patient.id}
                  onClick={() => onSelectPatient(patient.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(0, 113, 227, 0.06)' : '#ffffff',
                    border: isSelected ? '1px solid rgba(0, 113, 227, 0.35)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 1px 4px rgba(0, 113, 227, 0.08)' : 'none',
                    position: 'relative'
                  }}
                >
                  {/* Top line: Name and Status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: patient.avatarColor || '#0071e3',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700
                      }}>
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                          {patient.name}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {patient.mrn} • {patient.age}y/{patient.gender.charAt(0)}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(patient.status)}
                  </div>

                  {/* Spinal levels and procedure */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: patient.spineRegion === 'cervical' ? 'rgba(0, 113, 227, 0.08)' :
                                  patient.spineRegion === 'thoracic' ? 'rgba(175, 82, 222, 0.1)' : 'rgba(52, 199, 89, 0.1)',
                      color: patient.spineRegion === 'cervical' ? '#0071e3' :
                             patient.spineRegion === 'thoracic' ? '#af52de' : '#248a3d'
                    }}>
                      {patient.affectedLevels.join('-') || patient.spineRegion}
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

                  {/* Bed & Date footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    paddingTop: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bed size={11} />
                      <span>{patient.roomBed}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      <span>{patient.plannedOrSurgeryDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Helper footer */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '10.5px',
        color: 'var(--text-muted)',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>WiFi Sync Active</span>
        <span style={{ color: '#34c759', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <Sparkles size={11} /> Stavya Live
        </span>
      </div>
    </aside>
  );
};
