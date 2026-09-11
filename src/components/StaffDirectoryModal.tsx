import React, { useState, useMemo } from 'react';
import { X, Search, Phone, Mail, User, Building2, ShieldCheck, ChevronRight, Award, Clock } from 'lucide-react';
import { STAVYA_EMPLOYEES, STAVYA_GOVERNANCE, StavyaEmployee } from '../data/stavyaOrg';

interface StaffDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUnit?: string;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Staff', count: 213 },
  { id: 'Spine Surgery', label: 'Spine Surgery', filterUnits: ['Consultant Spine Surgeons', 'Junior Consultants', 'Senior Registrars', 'Junior Registrars'] },
  { id: 'Nursing', label: 'Nursing & OT', filterUnits: ['Nursing Leadership', 'Floor In-charges', 'IPD & HDU Nursing', 'Operating Theatres', 'CSSD'] },
  { id: 'Radiology', label: 'Radiology & Imaging', filterUnits: ['Radiology'] },
  { id: 'Anesthesia', label: 'Anesthesia & Medicine', filterUnits: ['Anesthesia', 'Medicine', 'Medical Officers'] },
  { id: 'Rehab', label: 'Physiotherapy & Associates', filterUnits: ['Physiotherapy and Rehabilitation', 'Spine Associates', 'Clinical Coordinators'] },
  { id: 'Patient Experience', label: 'Admissions & Front Desk', filterUnits: ['Admission', 'Front Desk', 'Patient Experience', 'PROs', 'Patient Escorts', 'Communication Centre'] },
  { id: 'Pharmacy', label: 'Pharmacy', filterUnits: ['Pharmacy'] },
  { id: 'Finance', label: 'Finance & Billing', filterUnits: ['Finance'] },
  { id: 'Quality & Research', label: 'Quality & Research', filterUnits: ['Quality', 'Clinical Research'] },
  { id: 'Operations', label: 'Operations & IT', filterUnits: ['Facility Operations', 'Infrastructure & Engineering', 'Biomedical Engineering', 'Human Resource', 'MD Office', 'Food Services'] },
];

export const StaffDirectoryModal: React.FC<StaffDirectoryModalProps> = ({
  isOpen,
  onClose,
  initialUnit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(initialUnit ? 'all' : 'all');
  const [selectedStaff, setSelectedStaff] = useState<StavyaEmployee | null>(null);

  const allStaff = useMemo(() => Object.values(STAVYA_EMPLOYEES), []);

  const filteredStaff = useMemo(() => {
    return allStaff.filter(person => {
      // Category filter
      if (activeCategory !== 'all') {
        const tab = CATEGORY_TABS.find(t => t.id === activeCategory);
        if (tab?.filterUnits && !tab.filterUnits.includes(person.unit)) {
          return false;
        }
      }

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        person.name.toLowerCase().includes(q) ||
        person.desig.toLowerCase().includes(q) ||
        person.unit.toLowerCase().includes(q) ||
        person.dept_master.toLowerCase().includes(q) ||
        person.mobile.includes(q) ||
        person.code.includes(q)
      );
    });
  }, [allStaff, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1600,
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1080px',
        width: '100%',
        height: '88vh',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafafc'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(0, 113, 227, 0.1)',
                color: '#0071e3',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Stavya Spine Hospital & Research Institute
              </div>
              <span style={{ fontSize: '12px', color: '#86868b' }}>• 213 Confirmed Employees</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', margin: '6px 0 0 0', letterSpacing: '-0.02em' }}>
              Hospital Organizational Directory & Staff Connectors
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f0f0f2',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1d1d1f'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={16} color="#86868b" style={{ position: 'absolute', left: '14px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, designation, department, employee code or phone..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '12px',
                  border: '1px solid #d2d2d7',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#f5f5f7'
                }}
              />
            </div>
            <div style={{ fontSize: '13px', color: '#86868b', whiteSpace: 'nowrap' }}>
              Showing <strong style={{ color: '#1d1d1f' }}>{filteredStaff.length}</strong> staff members
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATEGORY_TABS.map(tab => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveCategory(tab.id); setSelectedStaff(null); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: active ? 600 : 500,
                    backgroundColor: active ? '#0071e3' : '#f5f5f7',
                    color: active ? '#ffffff' : '#424245',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area: Split List & Details Pane */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedStaff ? '1.2fr 1fr' : '1fr', overflow: 'hidden' }}>
          {/* Staff Grid / Table */}
          <div style={{ overflowY: 'auto', padding: '16px 24px', borderRight: selectedStaff ? '1px solid rgba(0, 0, 0, 0.08)' : 'none' }}>
            {filteredStaff.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#86868b' }}>
                No employees found matching "{searchQuery}".
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: selectedStaff ? '1fr' : 'repeat(auto-fill, minmax(310px, 1fr))', gap: '12px' }}>
                {filteredStaff.map(person => {
                  const isSelected = selectedStaff?.id === person.id;
                  const isSpine = person.unit.toLowerCase().includes('spine') || person.unit.toLowerCase().includes('consultant') || person.unit.toLowerCase().includes('registrar');
                  const isNurse = person.unit.toLowerCase().includes('nurs') || person.unit.toLowerCase().includes('floor') || person.unit.toLowerCase().includes('theatre');

                  return (
                    <div
                      key={person.id}
                      onClick={() => setSelectedStaff(person)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #0071e3' : '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: isSelected ? 'rgba(0, 113, 227, 0.03)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(0, 113, 227, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: isSpine ? '#0071e3' : isNurse ? '#059669' : '#86868b',
                            backgroundColor: isSpine ? 'rgba(0, 113, 227, 0.08)' : isNurse ? 'rgba(5, 150, 105, 0.08)' : '#f5f5f7',
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}>
                            {person.unit}
                          </span>
                          <span style={{ fontSize: '10px', color: '#86868b', fontFamily: 'var(--font-mono)' }}>
                            #{person.code}
                          </span>
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f' }}>
                          {person.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#515154', marginTop: '2px' }}>
                          {person.desig}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px dashed rgba(0, 0, 0, 0.06)',
                        paddingTop: '8px',
                        fontSize: '11px',
                        color: '#86868b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={11} color="#0071e3" />
                          <span>{person.mobile}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>Reports to: <strong style={{ color: '#1d1d1f' }}>{person.reports ? person.reports.split(' ')[0] + ' ' + (person.reports.split(' ')[1] || '') : 'Board'}</strong></span>
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Drawer */}
          {selectedStaff && (
            <div style={{
              backgroundColor: '#fafafc',
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#0071e3',
                    letterSpacing: '0.04em'
                  }}>
                    {selectedStaff.unit} • Code {selectedStaff.code}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', margin: '4px 0 0 0' }}>
                    {selectedStaff.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#515154', margin: '2px 0 0 0', fontWeight: 500 }}>
                    {selectedStaff.desig}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  style={{
                    background: '#e5e5ea',
                    border: 'none',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Direct Communication Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a
                  href={`tel:${selectedStaff.mobile}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#0071e3',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={14} />
                  <span>Call {selectedStaff.mobile}</span>
                </a>

                {selectedStaff.email ? (
                  <a
                    href={`mailto:${selectedStaff.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#f5f5f7',
                      color: '#1d1d1f',
                      border: '1px solid #d2d2d7',
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <Mail size={14} />
                    <span>Email Staff</span>
                  </a>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f7',
                    color: '#86868b',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    Internal Intercom
                  </div>
                )}
              </div>

              {/* Staff Details Cards */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#86868b', letterSpacing: '0.04em' }}>
                  Organizational Reporting & Governance
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#86868b' }}>Reports Directly To:</span>
                  <strong style={{ color: '#0071e3' }}>{selectedStaff.reports || 'Governing Body / Board'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#86868b' }}>Hospital Department:</span>
                  <strong style={{ color: '#1d1d1f' }}>{selectedStaff.dept_master}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#86868b' }}>Hospital Branch:</span>
                  <strong style={{ color: '#1d1d1f' }}>{selectedStaff.branch}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#86868b' }}>Employment Status:</span>
                  <span style={{
                    color: selectedStaff.emp === 'Confirm' ? '#059669' : '#d97706',
                    fontWeight: 600
                  }}>
                    {selectedStaff.emp} ({selectedStaff.worker})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#86868b' }}>Assigned Shift:</span>
                  <span style={{ color: '#1d1d1f', textAlign: 'right', maxWidth: '60%' }}>
                    {selectedStaff.shift || 'Standard Hospital Shift'}
                  </span>
                </div>
              </div>

              {/* Personal & Qualifications */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#86868b', letterSpacing: '0.04em' }}>
                  Qualifications & Bio Data
                </div>

                {selectedStaff.edu1 && (
                  <div style={{ fontSize: '12px', color: '#1d1d1f' }}>
                    <span style={{ color: '#86868b', display: 'block', fontSize: '11px' }}>Education / Degrees:</span>
                    <strong>{selectedStaff.edu1}</strong>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#86868b', display: 'block', fontSize: '11px' }}>Blood Group:</span>
                    <strong>{selectedStaff.blood || 'Recorded in HR'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#86868b', display: 'block', fontSize: '11px' }}>Joining Date:</span>
                    <strong>{selectedStaff.join || 'Active'}</strong>
                  </div>
                </div>

                {selectedStaff.note && (
                  <div style={{
                    marginTop: '4px',
                    padding: '10px',
                    backgroundColor: '#fff8ec',
                    borderRadius: '8px',
                    border: '1px solid #f0dcae',
                    fontSize: '11px',
                    color: '#b8791d'
                  }}>
                    <strong>Unit Note: </strong>{selectedStaff.note}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
