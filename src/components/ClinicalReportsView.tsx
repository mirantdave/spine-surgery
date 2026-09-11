import React, { useState } from 'react';
import { Patient } from '../types/spine';
import { ClinicalReportItem, ReportCategory } from '../types/carePathway';
import { getPatientClinicalReports } from '../data/patientCareData';
import { 
  FileText, 
  Layers, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Printer, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Filter,
  Microscope,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

interface ClinicalReportsViewProps {
  patient: Patient;
  onPrintReport?: (reportTitle: string) => void;
}

export const ClinicalReportsView: React.FC<ClinicalReportsViewProps> = ({ patient, onPrintReport }) => {
  const [reports] = useState<ClinicalReportItem[]>(() => getPatientClinicalReports(patient));
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-mri-01');

  const filteredReports = reports.filter(rep => {
    const matchesCategory = selectedCategory === 'all' || rep.category === selectedCategory;
    const matchesSearch = rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rep.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handlePrint = (report: ClinicalReportItem) => {
    if (onPrintReport) {
      onPrintReport(report.title);
    } else {
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Category Segmented Control - Apple Clean Design */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0071e3',
              boxShadow: '0 0 8px #0071e3'
            }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Patient Diagnostic & Clinical Reports
            </h3>
            <span style={{
              background: 'rgba(0, 113, 227, 0.08)',
              color: '#0071e3',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              {reports.length} Verified Reports
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Diagnostic imaging, serial laboratory hematology, cardiac clearance, implants certificates & culture results.
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f4f5f7',
          padding: '6px 12px',
          borderRadius: '10px',
          width: '240px'
        }}>
          <Search size={14} color="#86868b" />
          <input
            type="text"
            placeholder="Search report title, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              color: '#1d1d1f',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { key: 'all', label: 'All Reports', count: reports.length },
          { key: 'radiology', label: 'Radiology & PACS (MRI / X-Ray)', count: 2 },
          { key: 'laboratory', label: 'Pathology & Blood Labs (CBC / CRP)', count: 1 },
          { key: 'pac', label: 'Pre-Anesthesia PAC & Cardiac', count: 1 },
          { key: 'implants', label: 'Implants & Traceability', count: 1 },
          { key: 'histopathology', label: 'Histopathology & Swab Culture', count: 1 }
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key as any)}
            style={{
              border: 'none',
              background: selectedCategory === cat.key ? '#0071e3' : '#ffffff',
              color: selectedCategory === cat.key ? '#ffffff' : '#4b5563',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: selectedCategory === cat.key ? '#0071e3' : 'var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{cat.label}</span>
            <span style={{
              background: selectedCategory === cat.key ? 'rgba(255, 255, 255, 0.25)' : '#f3f4f6',
              color: selectedCategory === cat.key ? '#ffffff' : '#6b7280',
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '999px'
            }}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* 2-Column Reports Layout (List on Left, Focused Report Reader on Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 340px) 1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Left Column: Report Thumbnails List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredReports.map((report) => {
            const isSelected = report.id === selectedReportId;
            const isLab = report.category === 'laboratory';
            const isRad = report.category === 'radiology';

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                style={{
                  background: isSelected ? 'rgba(0, 113, 227, 0.04)' : '#ffffff',
                  border: isSelected ? '2px solid #0071e3' : '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 113, 227, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: isRad ? 'rgba(0, 113, 227, 0.1)' : isLab ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: isRad ? '#0071e3' : isLab ? '#dc2626' : '#059669'
                  }}>
                    {report.category}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {report.date}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                  {report.title}
                </div>

                <p style={{
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.4'
                }}>
                  {report.summary}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #f8fafc' }}>
                  <span>{report.doctorName}</span>
                  <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle2 size={11} /> {report.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Official Report Reader (Apple Minimalist Document Style) */}
        {activeReport && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px 28px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Report Letterhead Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-color)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Stavya Spine Hospital & Research Institute • Diagnostic Services
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1d1d1f', margin: '4px 0 2px' }}>
                  {activeReport.title}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Patient: <strong>{patient.name}</strong> ({patient.age}y/{patient.gender}) • MRN: <strong>{patient.mrn}</strong> • Date: {activeReport.date}
                </div>
              </div>

              {/* Action Buttons: Print & PACS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeReport.pacsViewerUrl && (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Connecting to Stavya DICOM PACS Gateway for MRN: ${patient.mrn}... Viewer loading in high-resolution DICOM viewport.`); }}
                    className="btn btn-secondary"
                    style={{ fontSize: '11.5px', padding: '5px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ExternalLink size={12} color="#0071e3" />
                    <span>Open PACS</span>
                  </a>
                )}
                <button
                  onClick={() => handlePrint(activeReport)}
                  className="btn btn-primary"
                  style={{ fontSize: '11.5px', padding: '5px 14px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Printer size={12} />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Clinical Summary Box */}
            <div style={{
              background: 'rgba(0, 113, 227, 0.03)',
              border: '1px solid rgba(0, 113, 227, 0.12)',
              borderRadius: '12px',
              padding: '12px 16px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', marginBottom: '3px' }}>
                Executive Clinical Summary
              </div>
              <p style={{ fontSize: '12.5px', color: '#1d1d1f', margin: 0, lineHeight: '1.5', fontWeight: 500 }}>
                {activeReport.summary}
              </p>
            </div>

            {/* Laboratory Test Values Table (If Lab Category) */}
            {activeReport.labValues && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Serial Blood Investigation Trends
                </div>
                <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>Investigation Test</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>Pre-Op</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>POD 1</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>POD 2 (Today)</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>Unit</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>Reference Range</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, color: '#4b5563' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeReport.labValues.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < activeReport.labValues!.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1f2937' }}>{row.name}</td>
                          <td style={{ padding: '8px 12px', color: '#6b7280' }}>{row.preOp || '—'}</td>
                          <td style={{ padding: '8px 12px', color: '#6b7280' }}>{row.pod1 || '—'}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#111827' }}>{row.pod2 || '—'}</td>
                          <td style={{ padding: '8px 12px', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>{row.unit}</td>
                          <td style={{ padding: '8px 12px', color: '#6b7280', fontSize: '11px' }}>{row.referenceRange}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10.5px',
                              fontWeight: 600,
                              color: '#16a34a'
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                              Normal
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Findings List (If Text Report) */}
            {activeReport.findings && activeReport.findings.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Detailed Diagnostic Findings
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeReport.findings.map((finding, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#374151', lineHeight: '1.5' }}>
                      <span style={{ color: '#0071e3', fontWeight: 700 }}>•</span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impression Section */}
            {activeReport.impression && (
              <div style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Conclusion & Impression
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: '1.4' }}>
                  {activeReport.impression}
                </div>
              </div>
            )}

            {/* Specifications / Protocol Tags */}
            {activeReport.specifications && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(activeReport.specifications).map(([key, val], idx) => (
                  <div key={idx} style={{
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    color: '#4b5563'
                  }}>
                    <strong>{key}:</strong> {val}
                  </div>
                ))}
              </div>
            )}

            {/* Attending Consultant Signature Block */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              marginTop: '4px'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1d1d1f' }}>
                  {activeReport.doctorName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {activeReport.doctorDesignation}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(52, 199, 89, 0.08)',
                color: '#16a34a',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                <CheckCircle2 size={13} />
                <span>Electronically Signed & Verified</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
