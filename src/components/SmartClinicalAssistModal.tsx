import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  Zap, 
  X, 
  Clock, 
  Activity, 
  ChevronRight, 
  FileText, 
  CheckSquare, 
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Patient, SurgeonUser } from '../types/spine';

interface SmartClinicalAssistModalProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onRefreshData?: () => void;
  onApplySynthesizedNote?: (note: any) => void;
}

export const SmartClinicalAssistModal: React.FC<SmartClinicalAssistModalProps> = ({
  patient,
  currentSurgeon,
  isOpen,
  onClose,
  onNavigateToTab,
  onRefreshData,
  onApplySynthesizedNote
}) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'drugs' | 'discharge' | 'synthesis'>('risk');
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState<any>(null);
  const [drugAuditData, setDrugAuditData] = useState<any>(null);
  const [dischargeData, setDischargeData] = useState<any>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch(`/api/smart/risk-analysis/${patient.id}`).then(r => r.json()).catch(() => null),
      fetch(`/api/smart/drug-safety-audit/${patient.id}`).then(r => r.json()).catch(() => null),
      fetch(`/api/smart/discharge-readiness/${patient.id}`).then(r => r.json()).catch(() => null)
    ]).then(([risk, drugs, discharge]) => {
      if (!isMounted) return;
      setRiskData(risk);
      setDrugAuditData(drugs);
      setDischargeData(discharge);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, patient.id]);

  if (!isOpen) return null;

  const handleSynthesizeNote = async () => {
    setSynthesizing(true);
    try {
      const res = await fetch(`/api/smart/synthesize-ot-note/${patient.id}`, { method: 'POST' });
      const synthesized = await res.json();
      if (onApplySynthesizedNote) {
        onApplySynthesizedNote(synthesized);
      }
      setActionNotice('Smart Operative Note synthesized from CSSD implants, PACS dosimetry, and spine anatomy!');
      setTimeout(() => setActionNotice(null), 4000);
      if (onNavigateToTab) {
        onNavigateToTab('ot-note');
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSynthesizing(false);
    }
  };

  const handleQuickDispatch = async (action: string, data: any, message: string) => {
    try {
      await fetch('/api/connectors/dispatch-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          action,
          data,
          actorName: currentSurgeon.name
        })
      });
      setActionNotice(message);
      if (onRefreshData) onRefreshData();
      // Re-fetch smart metrics
      const [risk, drugs, discharge] = await Promise.all([
        fetch(`/api/smart/risk-analysis/${patient.id}`).then(r => r.json()),
        fetch(`/api/smart/drug-safety-audit/${patient.id}`).then(r => r.json()),
        fetch(`/api/smart/discharge-readiness/${patient.id}`).then(r => r.json())
      ]);
      setRiskData(risk);
      setDrugAuditData(drugs);
      setDischargeData(discharge);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e5e5ea',
          background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0071e3 0%, #00c7be 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                  SpineOS AI Sentinel & Clinical Decision Support
                </h2>
                <span className="badge badge-blue" style={{ fontSize: '10px', fontWeight: 700 }}>
                  LIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#6e6e73', margin: '2px 0 0 0' }}>
                Patient: <strong>{patient.name}</strong> ({patient.mrn}) · {patient.age}y {patient.gender} · {patient.status}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f2f2f7',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#8e8e93',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div style={{
            background: '#34c759',
            color: '#ffffff',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <CheckCircle2 size={16} />
            {actionNotice}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e5ea',
          background: '#f9f9fb',
          padding: '0 16px'
        }}>
          <button
            onClick={() => setActiveTab('risk')}
            style={{
              padding: '12px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'risk' ? '2px solid #0071e3' : '2px solid transparent',
              color: activeTab === 'risk' ? '#0071e3' : '#6e6e73',
              fontWeight: activeTab === 'risk' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={16} />
            Surgical Risk & Frailty (mFI-5)
          </button>

          <button
            onClick={() => setActiveTab('drugs')}
            style={{
              padding: '12px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'drugs' ? '2px solid #0071e3' : '2px solid transparent',
              color: activeTab === 'drugs' ? '#0071e3' : '#6e6e73',
              fontWeight: activeTab === 'drugs' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Pill size={16} />
            Drug-Allergy Sentinel
            {drugAuditData?.alertsCount > 0 && (
              <span style={{
                background: drugAuditData.overallStatus === 'CRITICAL' ? '#ff3b30' : '#ff9500',
                color: '#fff',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '10px',
                fontWeight: 700
              }}>
                {drugAuditData.alertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('discharge')}
            style={{
              padding: '12px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'discharge' ? '2px solid #0071e3' : '2px solid transparent',
              color: activeTab === 'discharge' ? '#0071e3' : '#6e6e73',
              fontWeight: activeTab === 'discharge' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckSquare size={16} />
            Discharge Readiness ({dischargeData?.totalScorePercent || 0}%)
          </button>

          <button
            onClick={() => setActiveTab('synthesis')}
            style={{
              padding: '12px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'synthesis' ? '2px solid #0071e3' : '2px solid transparent',
              color: activeTab === 'synthesis' ? '#0071e3' : '#6e6e73',
              fontWeight: activeTab === 'synthesis' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} />
            Smart Operative Note Auto-Fill
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <RefreshCw size={32} color="#0071e3" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#6e6e73' }}>
                Analyzing patient clinical streams, telemetry, and pharmacotherapy...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: SURGICAL RISK & FRAILTY */}
              {activeTab === 'risk' && riskData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Summary Badges Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {/* mFI-5 Score */}
                    <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Modified Frailty Index</span>
                        <span className="badge badge-blue" style={{ fontWeight: 700 }}>mFI-5</span>
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: '#0071e3', margin: '8px 0 4px' }}>
                        {riskData.mfi5.score} <span style={{ fontSize: '16px', color: '#94a3b8' }}>/ 5</span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                        {riskData.mfi5.frailtyTier}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        30-Day Morbidity: ~{riskData.mfi5.estimated30DayMorbidityPct}%
                      </div>
                    </div>

                    {/* Caprini DVT Risk */}
                    <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Caprini VTE Risk</span>
                        <span className="badge badge-purple" style={{ fontWeight: 700 }}>DVT Score</span>
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: '#8b5cf6', margin: '8px 0 4px' }}>
                        {riskData.capriniVte.score} <span style={{ fontSize: '14px', fontWeight: 600 }}>pts</span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                        {riskData.capriniVte.riskTier}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Dual IPC + Anticoagulation protocol
                      </div>
                    </div>

                    {/* SSI Risk */}
                    <div className="glass-panel" style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Surgical Site Infection</span>
                        <span className="badge badge-green" style={{ fontWeight: 700 }}>SSI Risk</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', margin: '8px 0 4px' }}>
                        {riskData.surgicalSiteInfection.riskLevel}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                        Stavya SSI Benchmark: &lt; 0.5%
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        1g Vancomycin powder recommended
                      </div>
                    </div>
                  </div>

                  {/* Identified Risk Factors Details */}
                  <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                      Identified Clinical Frailty & Thrombosis Drivers
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {riskData.mfi5.identifiedFactors.map((f: string, i: number) => (
                        <li key={i}><strong>Frailty:</strong> {f}</li>
                      ))}
                      {riskData.capriniVte.identifiedFactors.map((f: string, i: number) => (
                        <li key={i}><strong>VTE / Thrombosis:</strong> {f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={18} color="#2563eb" />
                      Recommended Clinical Thromboprophylaxis & SSI Bundles
                    </h4>
                    <p style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                      <strong>DVT Protocol:</strong> {riskData.capriniVte.clinicalRecommendation}
                    </p>
                    <p style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5', margin: 0 }}>
                      <strong>Antibiotic Bundle:</strong> {riskData.surgicalSiteInfection.prophylaxisProtocol}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: DRUG-ALLERGY SENTINEL */}
              {activeTab === 'drugs' && drugAuditData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: drugAuditData.overallStatus === 'CRITICAL' ? '#fef2f2' : drugAuditData.overallStatus === 'WARNING' ? '#fffbeb' : '#f0fdf4',
                    border: `1px solid ${drugAuditData.overallStatus === 'CRITICAL' ? '#fecaca' : drugAuditData.overallStatus === 'WARNING' ? '#fde68a' : '#bbf7d0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {drugAuditData.overallStatus === 'CRITICAL' ? (
                        <AlertTriangle size={24} color="#dc2626" />
                      ) : drugAuditData.overallStatus === 'WARNING' ? (
                        <AlertTriangle size={24} color="#d97706" />
                      ) : (
                        <CheckCircle2 size={24} color="#16a34a" />
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                          Overall Pharmacotherapy Safety: {drugAuditData.overallStatus}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Audited {drugAuditData.prescriptionsCount} active medications against known allergies and spine surgery protocols.
                        </div>
                      </div>
                    </div>
                  </div>

                  {drugAuditData.alerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                      <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>No Drug-Drug or Surgical Conflicts Found</div>
                      <p style={{ fontSize: '12px' }}>All medications comply with Stavya Spine Surgical Guidelines.</p>
                    </div>
                  ) : (
                    drugAuditData.alerts.map((alert: any, idx: number) => (
                      <div key={idx} style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderLeft: `4px solid ${alert.severity === 'CRITICAL' ? '#dc2626' : alert.severity === 'WARNING' ? '#d97706' : '#2563eb'}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                            {alert.title}
                          </span>
                          <span className={`badge ${alert.severity === 'CRITICAL' ? 'badge-red' : alert.severity === 'WARNING' ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: '10px' }}>
                            {alert.severity}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0071e3', marginTop: '4px' }}>
                          Drug: {alert.drugName}
                        </div>
                        <p style={{ fontSize: '13px', color: '#475569', margin: '6px 0 10px 0', lineHeight: '1.4' }}>
                          {alert.description}
                        </p>
                        <div style={{
                          background: '#f8fafc',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#334155',
                          border: '1px solid #e2e8f0'
                        }}>
                          <strong>Recommended Action:</strong> {alert.clinicalAction}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: DISCHARGE READINESS SCORE */}
              {activeTab === 'discharge' && dischargeData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Score Gauge */}
                  <div style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Discharge Readiness Score (DRS)</div>
                      <div style={{ fontSize: '36px', fontWeight: 800, color: dischargeData.totalScorePercent >= 80 ? '#16a34a' : '#d97706' }}>
                        {dischargeData.totalScorePercent}%
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                        Status: {dischargeData.readinessStatus === 'READY' ? '✅ Ready for Safe Discharge' : '⏳ Pending Clinical Milestones'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleQuickDispatch('PHYSIO_MILESTONE_LOG', { milestone: 'Walker ambulation & brace mobility verified' }, 'Physiotherapy mobility verified!')}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px' }}
                      >
                        Verify Physio Ambulation
                      </button>
                      <button
                        onClick={() => handleQuickDispatch('UPDATE_DRAIN', { drainOutputMl: 15 }, 'Surgical drain discontinued!')}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px' }}
                      >
                        Confirm Drain Discontinued
                      </button>
                    </div>
                  </div>

                  {/* 5 Milestone Criteria List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {dischargeData.criteria.map((c: any) => (
                      <div key={c.id} style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {c.passed ? (
                            <CheckCircle2 size={20} color="#16a34a" />
                          ) : (
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                          )}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                              {c.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              Target: {c.target} · <em>({c.currentValue})</em>
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: c.passed ? '#16a34a' : '#94a3b8'
                        }}>
                          +{c.weight} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SMART OPERATIVE NOTE AUTO-FILL */}
              {activeTab === 'synthesis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    padding: '18px',
                    borderRadius: '12px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe'
                  }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={20} color="#2563eb" />
                      One-Click Cross-Departmental Operative Note Synthesis
                    </h4>
                    <p style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                      SpineOS can automatically aggregate data from:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#1e3a8a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li><strong>CSSD Connector:</strong> Sterile tray barcode, lot numbers for pedicle screws & interbody cages</li>
                      <li><strong>Radiology Connector:</strong> C-Arm fluoroscopy dosimetry (mGy·cm²) & exposure seconds</li>
                      <li><strong>PAC / Anesthesia:</strong> Anesthesia start/end times, fluid balance, neuromonitoring baseline</li>
                      <li><strong>Anatomical Mapping:</strong> Segmental fusion levels ({patient.affectedLevels.join(', ')}) & disc space</li>
                    </ul>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={handleSynthesizeNote}
                      disabled={synthesizing}
                      className="btn btn-primary"
                      style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)'
                      }}
                    >
                      {synthesizing ? (
                        <>
                          <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                          Synthesizing Note...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Synthesize & Load into Operative Note Editor
                        </>
                      )}
                    </button>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                      Pre-populates all surgical steps, implant lists, and dosimetry while keeping draft mode for surgeon review.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #e5e5ea',
          background: '#f9f9fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '12px', color: '#8e8e93', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#34c759" />
            Stavya Spine Surgery Clinical Quality & Decision Support Engine
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: '12px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
