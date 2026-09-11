import React, { useState } from 'react';
import { 
  Patient, 
  SurgeonUser, 
  PatientDepartmentConnectors, 
  AdmissionsConnectorData, 
  NursingStationConnectorData, 
  RadiologyConnectorData, 
  PACAnesthesiaConnectorData, 
  CSSDOperatingTheatreConnectorData, 
  PharmacyConnectorData, 
  PhysiotherapyConnectorData, 
  FinanceBillingConnectorData, 
  ClinicalResearchConnectorData 
} from '../types/spine';
import { 
  Building2, 
  Activity, 
  FileText, 
  ShieldCheck, 
  Radio, 
  HeartPulse, 
  Sparkles, 
  Pill, 
  Accessibility, 
  CreditCard, 
  FlaskConical, 
  Phone, 
  UserCheck, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StaffDirectoryModal } from './StaffDirectoryModal';

interface DepartmentConnectorsHubProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  onImportToOtNote?: (connectorData: Partial<PatientDepartmentConnectors>) => void;
  onImportToDischarge?: (connectorData: Partial<PatientDepartmentConnectors>) => void;
  onUpdateConnectors?: (connectors: PatientDepartmentConnectors) => void;
  onOpenDirectory?: () => void;
}

type DeptFilter = 'all' | 'nursing' | 'admissions' | 'radiology' | 'pac' | 'otCssd' | 'pharmacy' | 'physio' | 'billing' | 'research';

export const DepartmentConnectorsHub: React.FC<DepartmentConnectorsHubProps> = ({
  patient,
  currentSurgeon,
  onImportToOtNote,
  onImportToDischarge,
  onUpdateConnectors,
  onOpenDirectory,
}) => {
  const [activeFilter, setActiveFilter] = useState<DeptFilter>('all');
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const connectors = patient.departmentConnectors;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/patients/${patient.id}/connectors`);
      if (res.ok) {
        const fresh = await res.json();
        if (onUpdateConnectors) onUpdateConnectors(fresh);
      }
      setSyncNotice('Hospital departmental feeds synchronized with Stavya central EMR.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSyncNotice(null), 3500);
    }
  };

  const handleDispatchAction = async (action: string, data: any, message: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/connectors/dispatch-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          action,
          data,
          actorName: currentSurgeon.name
        })
      });
      const result = await res.json();
      if (result.success && result.connectors && onUpdateConnectors) {
        onUpdateConnectors(result.connectors);
      }
      setSyncNotice(message);
    } catch (err) {
      console.error(err);
      setSyncNotice('Failed to dispatch departmental event.');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  const handleImportToOt = () => {
    if (onImportToOtNote && connectors) {
      onImportToOtNote(connectors);
      setSyncNotice('Pre-Op Nursing vitals, PAC clearance, and Radiology findings imported into Operative Note!');
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  const handleImportToDischarge = () => {
    if (onImportToDischarge && connectors) {
      onImportToDischarge(connectors);
      setSyncNotice('Physiotherapy mobility milestones, nursing wound status, and TPA billing clearance imported into Discharge Summary!');
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  if (!connectors) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <Building2 size={42} color="#0071e3" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1d1d1f' }}>
          Initializing Hospital Connectors for {patient.name}
        </h3>
        <p style={{ fontSize: '13px', color: '#6e6e73', maxWidth: '480px', margin: '8px auto 20px' }}>
          Connecting to Stavya Nursing stations, Admissions desk, Radiology PACS, and PAC Anesthesia records...
        </p>
        <button onClick={handleRefresh} className="btn btn-primary" style={{ margin: '0 auto' }}>
          <RefreshCw size={14} />
          <span>Connect Feeds</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner: Connected Ecosystem & Quick Integration Bar */}
      <div className="glass-panel" style={{
        padding: '22px 26px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(0, 113, 227, 0.08)',
                color: '#0071e3',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Hospital Integration Hub
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                <span>9 Active Department Connectors</span>
              </div>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1d1d1f', margin: '8px 0 2px', letterSpacing: '-0.02em' }}>
              Inter-Departmental Clinical Data Streams
            </h2>
            <p style={{ fontSize: '13px', color: '#515154', margin: 0 }}>
              Live feeds for <strong>{patient.name}</strong> ({patient.mrn} • {patient.roomBed}) entered by Stavya nursing, admissions, front desk, and allied teams.
            </p>
          </div>

          {/* Integration & Directory Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenDirectory ? onOpenDirectory() : setStaffModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '999px',
                background: 'rgba(29, 111, 184, 0.08)',
                color: '#1d6fb8',
                border: '1px solid rgba(29, 111, 184, 0.25)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Open full Stavya Hospital 213-staff directory"
            >
              <Users size={14} color="#1d6fb8" />
              <span>Stavya Org Directory (213 Staff)</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                backgroundColor: '#f5f5f7',
                border: '1px solid #d2d2d7',
                color: '#1d1d1f',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>

            {onImportToOtNote && (
              <button
                onClick={handleImportToOt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: 'rgba(0, 113, 227, 0.08)',
                  border: '1px solid rgba(0, 113, 227, 0.25)',
                  color: '#0071e3',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Import to OT Note</span>
              </button>
            )}

            {onImportToDischarge && (
              <button
                onClick={handleImportToDischarge}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: '#0071e3',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Import to Discharge</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncNotice && (
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '12.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          {[
            { id: 'all', label: 'All Feeds (9)', icon: Layers },
            { id: 'nursing', label: 'Nursing Station', icon: HeartPulse },
            { id: 'admissions', label: 'Admissions & Front Desk', icon: Building2 },
            { id: 'radiology', label: 'Radiology PACS', icon: Radio },
            { id: 'pac', label: 'PAC & Anesthesia', icon: Activity },
            { id: 'otCssd', label: 'OT & CSSD', icon: Sparkles },
            { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
            { id: 'physio', label: 'Physiotherapy & Rehab', icon: Accessibility },
            { id: 'billing', label: 'IPD Billing & TPA', icon: CreditCard },
            { id: 'research', label: 'Spine Registry', icon: FlaskConical },
          ].map(tab => {
            const active = activeFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as DeptFilter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 500,
                  backgroundColor: active ? '#0071e3' : '#f5f5f7',
                  color: active ? '#ffffff' : '#515154',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stream Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '18px' }}>
        {/* =========================================================================
            1. IPD & HDU NURSING STATION CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'nursing') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: '#059669',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <HeartPulse size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                      Inpatient Nursing Station
                    </h3>
                    <span style={{
                      backgroundColor: 'rgba(5, 150, 105, 0.1)',
                      color: '#059669',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {connectors.nursing.floorStation}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    Real-time vitals, pre-op verification & hourly neurovascular monitoring
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={13} />
                <span>Live Feed</span>
              </div>
            </div>

            {/* Current Vitals Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Blood Pressure</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{connectors.nursing.currentVitals.bloodPressure}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Pulse Rate</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{connectors.nursing.currentVitals.pulse} bpm</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>SpO2</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{connectors.nursing.currentVitals.spo2}%</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Temperature</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{connectors.nursing.currentVitals.temperature}°F</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Pain (VAS)</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: connectors.nursing.currentVitals.vasPainScore > 4 ? '#d97706' : '#0f172a', marginTop: '2px' }}>
                  {connectors.nursing.currentVitals.vasPainScore}/10
                </div>
              </div>
            </div>

            {/* Pre-Op Checklist Badges */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#86868b', marginBottom: '8px', letterSpacing: '0.04em' }}>
                Pre-Op Preparation & Safety Handover
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>Skin Preparation: <strong>Complete</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>Surgical Site Marked: <strong>Verified</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>NPO Since: <strong>{connectors.nursing.preOpStatus.npoStrictlyMaintainedSince}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>IV Line: <strong>{connectors.nursing.preOpStatus.ivLineSiteAndGauge}</strong></span>
                </div>
              </div>
            </div>

            {/* Post-Op Care Log */}
            <div style={{
              backgroundColor: '#f5f5f7',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div>
                <strong style={{ color: '#1d1d1f' }}>Hourly Neurovascular Log: </strong>
                <span style={{ color: '#515154' }}>{connectors.nursing.postOpCare.hourlyNeurovascularCheck}</span>
              </div>
              <div>
                <strong style={{ color: '#1d1d1f' }}>Drains & Dressing: </strong>
                <span style={{ color: '#515154' }}>{connectors.nursing.postOpCare.activeDrainsStatus} • {connectors.nursing.postOpCare.incisionDressingCondition}</span>
              </div>
            </div>

            {/* Live Action Dispatcher */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              <button
                onClick={() => handleDispatchAction('LOG_VITALS', { bloodPressure: '120/78 mmHg', pulse: 72, spo2: 99, vasPainScore: 1 }, 'Nursing: Stat vital signs recorded & synchronized!')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(5, 150, 105, 0.08)',
                  color: '#059669',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <HeartPulse size={12} />
                <span>Log Vitals (120/78)</span>
              </button>
              <button
                onClick={() => handleDispatchAction('UPDATE_DRAIN', { drainOutputMl: 18 }, 'Nursing: Suction drain volume (<30ml) recorded!')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0, 113, 227, 0.08)',
                  color: '#0071e3',
                  border: '1px solid rgba(0, 113, 227, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={12} />
                <span>Update Drain (&lt;30ml)</span>
              </button>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#059669" />
                <span>Logged by: <strong style={{ color: '#1d1d1f' }}>{connectors.nursing.recordedBy.name}</strong> ({connectors.nursing.recordedBy.designation})</span>
              </div>
              <a href={`tel:${connectors.nursing.recordedBy.contact}`} style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 600 }}>
                Call Station
              </a>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. ADMISSIONS & FRONT DESK CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'admissions') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(0, 113, 227, 0.1)',
                  color: '#0071e3',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Admissions & Front Desk Handover
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    UHID, Insurance pre-authorization & admission demographics
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: connectors.admissions.preAuthStatus === 'Approved' ? 'rgba(5, 150, 105, 0.1)' : '#fef3c7',
                color: connectors.admissions.preAuthStatus === 'Approved' ? '#059669' : '#b45309',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                Pre-Auth: {connectors.admissions.preAuthStatus}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px' }}>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>UHID / Hospital ID</span>
                <strong style={{ color: '#1d1d1f' }}>{connectors.admissions.uhid}</strong>
              </div>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>IPD Registration #</span>
                <strong style={{ color: '#1d1d1f' }}>{connectors.admissions.ipdNumber}</strong>
              </div>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>Payer / Plan</span>
                <strong style={{ color: '#1d1d1f' }}>{connectors.admissions.payerType}</strong>
              </div>
            </div>

            {connectors.admissions.tpaName && (
              <div style={{ fontSize: '12px', color: '#515154' }}>
                <strong>TPA / Insurance: </strong>{connectors.admissions.tpaName} • Approved Amount: <strong style={{ color: '#059669' }}>₹{connectors.admissions.approvedAmount?.toLocaleString()}</strong>
              </div>
            )}

            <div style={{ fontSize: '12px', color: '#515154' }}>
              <strong>Emergency Contact: </strong>{connectors.admissions.emergencyContactName} ({connectors.admissions.emergencyContactPhone})
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              color: '#334155'
            }}>
              <strong>Admission Desk Note: </strong>{connectors.admissions.handoverNotes}
            </div>

            {/* Live Action Dispatcher */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              <button
                onClick={() => handleDispatchAction('TPA_PREAUTH_UPDATE', { approvedAmount: 340000, status: 'Pre-Auth Active & Sanctioned' }, 'Admissions: TPA Pre-Authorization updated to ₹3,40,000!')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0, 113, 227, 0.08)',
                  color: '#0071e3',
                  border: '1px solid rgba(0, 113, 227, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={12} />
                <span>Update Pre-Auth (₹3.4L)</span>
              </button>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#0071e3" />
                <span>Admitted by: <strong style={{ color: '#1d1d1f' }}>{connectors.admissions.recordedBy.name}</strong> ({connectors.admissions.recordedBy.designation})</span>
              </div>
              <span>{connectors.admissions.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. RADIOLOGY & PACS IMAGING CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'radiology') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Radio size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Radiology & Neuro-Imaging
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    {connectors.radiology.mriSpineProtocol} • Accession #{connectors.radiology.mriStudyId}
                  </div>
                </div>
              </div>

              <a
                href={connectors.radiology.pacsViewerUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#f5f5f7',
                  border: '1px solid #d2d2d7',
                  color: '#0071e3',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Launch PACS</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div style={{
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '12px',
              color: '#581c87',
              lineHeight: '1.5'
            }}>
              <strong>Radiologist Verified Impression: </strong>{connectors.radiology.mriReportSummary}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#86868b' }}>Stenosis Severity: </span>
                <strong style={{ color: '#b45309' }}>{connectors.radiology.stenosisSeverity}</strong>
              </div>
              <div>
                <span style={{ color: '#86868b' }}>Cord Signal: </span>
                <strong style={{ color: '#1d1d1f' }}>{connectors.radiology.cordSignalChange}</strong>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: '#86868b' }}>Dynamic X-Ray Findings: </span>
                <span style={{ color: '#1d1d1f' }}>{connectors.radiology.xRayFlexionExtension}</span>
              </div>
            </div>

            {/* Live Action Dispatcher */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              <button
                onClick={() => handleDispatchAction('PACS_SYNC_STUDY', { dosimetry: '14.2 mGy.cm2 (Fluoroscopy time: 48 sec)' }, 'PACS: Latest DICOM series & C-Arm fluoro dosimetry synced!')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(124, 58, 237, 0.08)',
                  color: '#7c3aed',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} />
                <span>Sync PACS & C-Arm Fluoro Dose</span>
              </button>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#7c3aed" />
                <span>Verified by: <strong style={{ color: '#1d1d1f' }}>{connectors.radiology.recordedBy.name}</strong> ({connectors.radiology.recordedBy.designation})</span>
              </div>
              <span>{connectors.radiology.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            4. PAC & ANESTHESIA CLEARANCE CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'pac') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Activity size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Pre-Anesthetic Clearance (PAC)
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    Airway, Cardiac & Prone Operative Risk Assessment
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {connectors.pacAnesthesia.pacFitnessStatus}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>ASA Class</span>
                <strong style={{ color: '#1d1d1f' }}>{connectors.pacAnesthesia.asaPhysicalStatus}</strong>
              </div>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>Mallampati</span>
                <strong style={{ color: '#1d1d1f' }}>{connectors.pacAnesthesia.mallampatiScore}</strong>
              </div>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>Blood Reserve</span>
                <strong style={{ color: '#dc2626' }}>{connectors.pacAnesthesia.crossMatchedBloodUnits.split(' ')[0]} Units</strong>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#515154', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Cardiac / Medical Clearance: </strong>{connectors.pacAnesthesia.cardiacClearanceSummary}</div>
              <div><strong>Prone Clearance: </strong>{connectors.pacAnesthesia.pronePositionClearance}</div>
              <div><strong>Special Monitoring: </strong>{connectors.pacAnesthesia.specialMonitoringRequired}</div>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#dc2626" />
                <span>Cleared by: <strong style={{ color: '#1d1d1f' }}>{connectors.pacAnesthesia.recordedBy.name}</strong> ({connectors.pacAnesthesia.recordedBy.designation})</span>
              </div>
              <span>{connectors.pacAnesthesia.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. OPERATING THEATRE & CSSD STERILIZATION CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'otCssd') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    OT Readiness & CSSD Sterilization
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    {connectors.cssdOt.assignedTheatre} • Batch #{connectors.cssdOt.sterileSetBatchNo}
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                CSSD: {connectors.cssdOt.autoclaveIndicatorStatus}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#515154', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Implants Consignment: </strong>{connectors.cssdOt.spinalImplantsConsignment}</div>
              <div><strong>Microscope & Neuromonitoring: </strong>{connectors.cssdOt.microscopeStatus} • {connectors.cssdOt.neuromonitoringLeadStatus}</div>
              <div><strong>OT Team Assigned: </strong>Scrub: {connectors.cssdOt.scrubNurseAssigned} | Tech: {connectors.cssdOt.otTechnicianAssigned}</div>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#0284c7" />
                <span>Verified by: <strong style={{ color: '#1d1d1f' }}>{connectors.cssdOt.recordedBy.name}</strong> ({connectors.cssdOt.recordedBy.designation})</span>
              </div>
              <span>{connectors.cssdOt.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            6. PHARMACY & INPATIENT MEDICATION CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'pharmacy') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(217, 119, 6, 0.1)',
                  color: '#d97706',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Pill size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Pharmacy & Drug Dispensation
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    Surgical antibiotic prophylaxis, DVT protocol & inpatient stock
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                Prophylaxis Given
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#515154', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Antibiotic Prophylaxis: </strong>{connectors.pharmacy.surgicalProphylaxisAntibiotic}</div>
              <div><strong>Anticoagulant Protocol: </strong>{connectors.pharmacy.anticoagulantProtocol}</div>
              <div><strong>Hemostats & Bone Graft: </strong>{connectors.pharmacy.implantBoneGraftDispensed}</div>
            </div>

            {/* Live Action Dispatcher */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              <button
                onClick={() => handleDispatchAction('PHARMACY_STAT_DISPENSE', { drugName: 'Inj. Cefuroxime 1.5g IV' }, 'Pharmacy: Pre-incision antibiotic prophylaxis dispensed!')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(217, 119, 6, 0.08)',
                  color: '#d97706',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Pill size={12} />
                <span>Dispense Stat Cefuroxime 1.5g IV</span>
              </button>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#d97706" />
                <span>Dispensed by: <strong style={{ color: '#1d1d1f' }}>{connectors.pharmacy.recordedBy.name}</strong> ({connectors.pharmacy.recordedBy.designation})</span>
              </div>
              <span>{connectors.pharmacy.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            7. PHYSIOTHERAPY & REHABILITATION CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'physio') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Accessibility size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Physiotherapy & Spine Rehabilitation
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    Pre-op functional baseline & post-op mobilization milestones
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                Pre-Op ODI: {connectors.physiotherapy.preOpFunctionalBaseline.preOpOswestryPercentage}%
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#515154', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Pre-Op Walking Tolerance: </strong>{connectors.physiotherapy.preOpFunctionalBaseline.walkingToleranceMeters} meters ({connectors.physiotherapy.preOpFunctionalBaseline.gaitPattern})</div>
              <div><strong>Mobilization Status: </strong>Bedside sitting: {connectors.physiotherapy.postOpMobilizationMilestones.bedsideSittingToleranceMins} mins • Walker ambulation: {connectors.physiotherapy.postOpMobilizationMilestones.assistedWalkerAmbulationMeters}m</div>
              <div><strong>Orthotic Spinal Brace: </strong>{connectors.physiotherapy.postOpMobilizationMilestones.orthoticBracePrescribed}</div>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#10b981" />
                <span>Rehab lead: <strong style={{ color: '#1d1d1f' }}>{connectors.physiotherapy.recordedBy.name}</strong> ({connectors.physiotherapy.recordedBy.designation})</span>
              </div>
              <span>{connectors.physiotherapy.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            8. FINANCE, TPA & IPD BILLING CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'billing') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    IPD Billing, Insurance & TPA Desk
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    Package estimate, insurance sanction & discharge clearance
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: connectors.financeBilling.billingClearanceForDischarge === 'Cleared for Discharge' ? 'rgba(5, 150, 105, 0.1)' : '#fef3c7',
                color: connectors.financeBilling.billingClearanceForDischarge === 'Cleared for Discharge' ? '#059669' : '#b45309',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {connectors.financeBilling.billingClearanceForDischarge}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>Package Estimate</span>
                <strong style={{ color: '#1d1d1f' }}>₹{connectors.financeBilling.totalEstimatedPackageRate.toLocaleString()}</strong>
              </div>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>TPA Sanction</span>
                <strong style={{ color: '#059669' }}>₹{connectors.financeBilling.tpaApprovedAmount.toLocaleString()}</strong>
              </div>
              <div style={{ backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>Interim Total</span>
                <strong style={{ color: '#1d1d1f' }}>₹{connectors.financeBilling.interimBillAmount.toLocaleString()}</strong>
              </div>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#6366f1" />
                <span>Audited by: <strong style={{ color: '#1d1d1f' }}>{connectors.financeBilling.recordedBy.name}</strong> ({connectors.financeBilling.recordedBy.designation})</span>
              </div>
              <span>{connectors.financeBilling.recordedBy.timestamp}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            9. CLINICAL RESEARCH & SPINE REGISTRY CONNECTOR
        ========================================================================= */}
        {(activeFilter === 'all' || activeFilter === 'research') && (
          <div className="glass-panel" style={{
            padding: '22px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  color: '#ec4899',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Clinical Research & Spine Registry
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#86868b', marginTop: '2px' }}>
                    Stavya Research Registry #{connectors.clinicalResearch.stavyaSpineRegistryId}
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                Consent Enrolled
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#515154', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Trial / Registry Cohort: </strong>{connectors.clinicalResearch.trialEnrollmentName}</div>
              <div>
                <strong>Pre-Op PROMs Baseline: </strong>
                VAS Back: {connectors.clinicalResearch.promsBaseline.vasBackPain}/10 • VAS Leg: {connectors.clinicalResearch.promsBaseline.vasLegPain}/10 • ODI: {connectors.clinicalResearch.promsBaseline.odiDisabilityIndex}%
              </div>
              <div>
                <strong>Scheduled Registry Follow-ups: </strong>
                {connectors.clinicalResearch.scheduledRegistryFollowUps.join(' • ')}
              </div>
            </div>

            {/* Staff Attribution Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              paddingTop: '10px',
              fontSize: '11px',
              color: '#86868b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} color="#ec4899" />
                <span>Coordinator: <strong style={{ color: '#1d1d1f' }}>{connectors.clinicalResearch.recordedBy.name}</strong> ({connectors.clinicalResearch.recordedBy.designation})</span>
              </div>
              <span>{connectors.clinicalResearch.recordedBy.timestamp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Staff Directory Modal */}
      <StaffDirectoryModal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
      />
    </div>
  );
};
