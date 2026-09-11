import React from 'react';
import { Patient } from '../types/spine';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface PrintViewProps {
  patient: Patient;
  type: 'ot-note' | 'discharge-summary' | 'prescriptions';
  onClose: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({ patient, type, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const ot = patient.operativeNote;
  const ds = patient.dischargeSummary;
  const meds = patient.prescriptions || [];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      zIndex: 2000,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Floating Control Bar (Hidden when printed) */}
      <div className="no-print" style={{
        width: '100%',
        maxWidth: '850px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        background: '#ffffff',
        padding: '12px 24px',
        borderRadius: '14px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
          {type === 'ot-note' ? 'Spine Operative Record Print Document' :
           type === 'discharge-summary' ? 'Spine Discharge Summary Print Document' : 'Spine Prescription Slip'}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            <X size={15} />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (White A4 style layout) */}
      <div className="print-page" style={{
        width: '100%',
        maxWidth: '850px',
        background: '#ffffff',
        color: '#0f172a',
        padding: '40px 50px',
        borderRadius: '8px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        lineHeight: '1.6'
      }}>
        {/* Hospital Letterhead Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #0284c7',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/stavya-logo.jpg"
              alt="Stavya Spine Hospital"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0369a1', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Institute of Advanced Spine Surgery
              </h1>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Center for Minimally Invasive & Complex Spinal Deformity Reconstruction
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
            <div>NABH & JCI Accredited Facility</div>
            <div>24/7 Spine Trauma Helpline: +91 98201 00000</div>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          fontSize: '11px'
        }}>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Patient Name:</span>
            <strong style={{ fontSize: '13px', color: '#0f172a' }}>{patient.name}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>MRN / Bed:</span>
            <strong>{patient.mrn} • {patient.roomBed}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Age / Gender:</span>
            <strong>{patient.age} Yrs / {patient.gender}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Attending Surgeon:</span>
            <strong style={{ color: '#0369a1' }}>{patient.attendingSurgeon}</strong>
          </div>
        </div>

        {/* Document Body depending on Type */}
        {type === 'ot-note' && ot && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a' }}>
                Operative Summary & Surgical Record
              </h2>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>PROCEDURE PERFORMED: </strong>
              <span>{ot.procedureName}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', background: '#f1f5f9', padding: '10px', borderRadius: '4px' }}>
              <div><strong>Pre-Op Diagnosis: </strong>{ot.preOpDiagnosis}</div>
              <div><strong>Post-Op Diagnosis: </strong>{ot.postOpDiagnosis}</div>
              <div><strong>Date of Surgery: </strong>{ot.surgeryDate} ({ot.startTime} - {ot.endTime})</div>
              <div><strong>Anesthesia / Position: </strong>{ot.anesthesiaType} / {ot.position}</div>
              <div><strong>Primary Surgeon: </strong>{ot.primarySurgeon}</div>
              <div><strong>Anesthesiologist: </strong>{ot.anesthesiologist}</div>
              <div><strong>Fluoroscopy Time: </strong>{ot.fluorescopyTimeSec} sec (DAP: {ot.radiationDoseDAP})</div>
              <div><strong>Estimated Blood Loss: </strong>{ot.estimatedBloodLossMl} ml</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div>
                <strong>SURGICAL APPROACH & EXPOSURE: </strong>
                <p>{ot.incisionDetails}</p>
              </div>
              <div>
                <strong>NEURAL DECOMPRESSION & DISCECTOMY: </strong>
                <p>{ot.decompressionDetails} {ot.discectomyDetails}</p>
              </div>
              {ot.interbodyFusionDetails && (
                <div>
                  <strong>INTERBODY FUSION: </strong>
                  <p>{ot.interbodyFusionDetails}</p>
                </div>
              )}
              <div>
                <strong>INSTRUMENTATION & FIXATION: </strong>
                <p>{ot.instrumentationDetails}</p>
              </div>
              <div>
                <strong>BONE GRAFT & DURAL INTEGRITY: </strong>
                <p>{ot.boneGraftUsed} • Dural Integrity: {ot.duralIntegrity}.</p>
              </div>
              <div>
                <strong>CLOSURE & DRAINS: </strong>
                <p>{ot.hemostasisAndClosure} • Drains: {ot.drainsPlaced}.</p>
              </div>
            </div>

            {/* Implants Table */}
            {ot.implants.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <strong>SPINAL HARDWARE & IMPLANTS LOGGED:</strong>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Item Type</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Level</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Side</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Dimensions</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Material</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Manufacturer / Lot #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ot.implants.map((imp, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{imp.type}</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{imp.level}</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{imp.side || 'Bilateral'}</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{imp.dimensions}</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{imp.material}</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{imp.manufacturer} {imp.lotNumber ? `(${imp.lotNumber})` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Audit Trail & Data Entry Attribution */}
            {ot.entryAttribution && (
              <div style={{
                margin: '16px 0',
                padding: '8px 12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Data Entered By: </strong>{ot.entryAttribution.enteredByName} ({ot.entryAttribution.enteredByDesignation}) • {ot.entryAttribution.enteredAt}
                </div>
                <div style={{ fontWeight: 600, color: ot.entryAttribution.verificationStatus === 'Verified by Consultant' ? '#059669' : '#d97706' }}>
                  ✓ {ot.entryAttribution.verificationStatus} {ot.entryAttribution.verifiedByConsultant ? `• ${ot.entryAttribution.verifiedByConsultant}` : ''}
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Electronic Signature Certified</div>
                <div style={{ fontWeight: 700 }}>{ot.surgeonSignature}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: '150px', borderBottom: '1px solid #000', marginBottom: '4px' }}></div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Primary Spine Surgeon Signature</div>
              </div>
            </div>
          </div>
        )}

        {type === 'discharge-summary' && ds && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a' }}>
                Spine Surgical Discharge Summary
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px', background: '#f1f5f9', padding: '10px', borderRadius: '4px' }}>
              <div><strong>Admission Date: </strong>{ds.admissionDate}</div>
              <div><strong>Surgery Date: </strong>{ds.surgeryDate}</div>
              <div><strong>Discharge Date: </strong>{ds.dischargeDate}</div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>PRIMARY DIAGNOSIS: </strong>
              <span>{patient.primaryDiagnosis}</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>PROCEDURE PERFORMED: </strong>
              <span>{patient.plannedProcedure}</span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>HOSPITAL COURSE & RECOVERY:</strong>
              <p style={{ textAlign: 'justify', marginTop: '4px' }}>{ds.hospitalCourseSummary}</p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>DISCHARGE NEUROLOGICAL & PHYSICAL STATUS:</strong>
              <p style={{ marginTop: '4px' }}>{ds.dischargeNeuroStatus}</p>
              <p style={{ marginTop: '2px' }}>Wound: {ds.woundConditionAtDischarge} • Drain: {ds.drainRemovalDateAndTotal}</p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>SPINE ERGONOMICS & BRACE PROTOCOL:</strong>
              <p style={{ fontWeight: 600, color: '#0369a1' }}>{ds.braceInstructions}</p>
              <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                {ds.spinalPrecautions.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
              <strong style={{ color: '#be123c' }}>RED FLAG EMERGENCY SIGNS (REPORT IMMEDIATELY):</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '4px', color: '#9f1239' }}>
                {ds.redFlagWarnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>

            {/* Discharge Meds */}
            {meds.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <strong>DISCHARGE MEDICATIONS:</strong>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Medicine Name</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Dosage & Route</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Frequency</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Days</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Special Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meds.map((m, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}><strong>{m.drugName}</strong> ({m.genericName})</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{m.dosage} ({m.route})</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{m.frequency}</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{m.durationDays} days</td>
                        <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', background: '#f8fafc', padding: '10px', borderRadius: '4px' }}>
              <div><strong>First OPD Follow-Up: </strong>{ds.firstFollowUpDate}</div>
              <div><strong>Suture Removal: </strong>{ds.sutureRemovalDate}</div>
              <div><strong>24/7 Helpline: </strong>{ds.emergencyContact}</div>
              <div><strong>Status: </strong>{ds.dischargeStatus}</div>
            </div>

            {/* Audit Trail & Data Entry Attribution */}
            {ds.entryAttribution && (
              <div style={{
                margin: '16px 0',
                padding: '8px 12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Data Entered By: </strong>{ds.entryAttribution.enteredByName} ({ds.entryAttribution.enteredByDesignation}) • {ds.entryAttribution.enteredAt}
                </div>
                <div style={{ fontWeight: 600, color: ds.entryAttribution.verificationStatus === 'Verified by Consultant' ? '#059669' : '#d97706' }}>
                  ✓ {ds.entryAttribution.verificationStatus} {ds.entryAttribution.verifiedByConsultant ? `• ${ds.entryAttribution.verifiedByConsultant}` : ''}
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Authorized Spine Surgical Sign-off</div>
                <div style={{ fontWeight: 700 }}>{ds.surgeonSignature}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: '150px', borderBottom: '1px solid #000', marginBottom: '4px' }}></div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Spine Surgeon Signature & Seal</div>
              </div>
            </div>
          </div>
        )}

        {type === 'prescriptions' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a' }}>
                Official Spine Surgical Prescription (Rx)
              </h2>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Diagnosis: </strong>{patient.primaryDiagnosis}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Rx Drug & Generic</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Dose & Route</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Frequency</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Duration</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Timing & Instructions</th>
                </tr>
              </thead>
              <tbody>
                {meds.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                      <strong style={{ color: '#0369a1' }}>{m.drugName}</strong>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>{m.genericName}</div>
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{m.dosage} ({m.route})</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}><strong>{m.frequency}</strong></td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{m.durationDays} days</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{m.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Prescribed by:</div>
                <div style={{ fontWeight: 700 }}>{patient.attendingSurgeon}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: '150px', borderBottom: '1px solid #000', marginBottom: '4px' }}></div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Doctor's Signature & Reg No.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
