import React, { useState, useEffect, useRef } from 'react';
import { Patient, OperativeNote, DischargeSummary, MedicationItem, WardRoundEntry, WHOSpineSafetyChecklist, NeurologicalAssessment, SpineLevel, SurgeonUser } from './types/spine';
import { PatientProtocolCompliance, ProtocolModuleTarget } from './types/protocol';
import { DEMO_PATIENTS } from './data/templates';
import { STAVYA_SURGEONS } from './data/surgeons';
import { Navbar } from './components/Navbar';
import { PatientSidebar } from './components/PatientSidebar';
import { NetworkModal } from './components/NetworkModal';
import { SurgeonHierarchyModal } from './components/SurgeonHierarchyModal';
import { OperativeNoteEditor } from './components/OperativeNoteEditor';
import { DischargeSummaryEditor } from './components/DischargeSummaryEditor';
import { PrescriptionManager } from './components/PrescriptionManager';
import { NeurologyAssessment } from './components/NeurologyAssessment';
import { WardRoundsTracker } from './components/WardRoundsTracker';
import { WHOChecklist } from './components/WHOChecklist';
import { SpineColumnSelector } from './components/SpineColumnSelector';
import { PrintView } from './components/PrintView';
import { NewPatientModal } from './components/NewPatientModal';
import { DepartmentConnectorsHub } from './components/DepartmentConnectorsHub';
import { StaffDirectoryModal } from './components/StaffDirectoryModal';
import { Surgery2DXRayModal } from './components/Surgery2DXRayModal';
import { Surgery2DXRayViewer } from './components/Surgery2DXRayViewer';
import { CarePathwayTimeline } from './components/CarePathwayTimeline';
import { ClinicalReportsView } from './components/ClinicalReportsView';
import { ClinicalProtocolsHub } from './components/ClinicalProtocolsHub';
import { SmartClinicalAssistModal } from './components/SmartClinicalAssistModal';
import { matchProtocolsToPatient } from './data/clinicalProtocols';
import { 
  FileText, 
  FileCheck2, 
  Pill, 
  Activity, 
  ClipboardList, 
  ShieldCheck, 
  Layers, 
  Printer, 
  Bed, 
  Route, 
  FileBarChart, 
  Stethoscope, 
  BookOpenCheck, 
  Building2,
  ChevronDown
} from 'lucide-react';

export function App() {
  const [surgeons, setSurgeons] = useState<SurgeonUser[]>(STAVYA_SURGEONS);
  const [currentSurgeon, setCurrentSurgeon] = useState<SurgeonUser>(STAVYA_SURGEONS[0]);
  const [hierarchyModalOpen, setHierarchyModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(DEMO_PATIENTS[0].id);
  const [activeTab, setActiveTab] = useState<'pathway' | 'ot-note' | 'inpatient' | 'discharge' | 'feeds'>('pathway');
  const [inpatientSubTab, setInpatientSubTab] = useState<'rounds' | 'prescriptions' | 'neuro-exam' | 'who-checklist'>('rounds');
  const [feedsSubTab, setFeedsSubTab] = useState<'connectors' | 'reports' | 'protocols' | 'anatomy'>('connectors');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [newPatientModalOpen, setNewPatientModalOpen] = useState(false);
  const [staffDirectoryModalOpen, setStaffDirectoryModalOpen] = useState(false);
  const [surgeryXRayModalOpen, setSurgeryXRayModalOpen] = useState(false);
  const [printType, setPrintType] = useState<'ot-note' | 'discharge-summary' | 'prescriptions' | null>(null);
  const [printDropdownOpen, setPrintDropdownOpen] = useState(false);
  const [focusProtocolId, setFocusProtocolId] = useState<string | null>(null);
  const [smartAssistModalOpen, setSmartAssistModalOpen] = useState(false);

  const printMenuRef = useRef<HTMLDivElement>(null);

  const [networkInfo, setNetworkInfo] = useState({
    ip: '192.168.6.167',
    clientPort: 3030,
    clientUrl: 'http://192.168.6.167:3030',
    networkName: 'Hospital Spine Surgical WiFi'
  });

  // Close print dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (printMenuRef.current && !printMenuRef.current.contains(event.target as Node)) {
        setPrintDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch network info, patients, and surgeons from backend API
  const fetchPatients = () => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        }
      })
      .catch(err => {
        console.warn('API offline or dev mode, using embedded demo data:', err);
      });
  };

  useEffect(() => {
    // 1. Network / WiFi
    fetch('/api/network-info')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setNetworkInfo(data);
        }
      })
      .catch(err => {
        console.warn('Using default network IP detection:', err);
      });

    // 2. Patients
    fetchPatients();

    // 3. Surgeons
    fetch('/api/surgeons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSurgeons(data);
        }
      })
      .catch(err => {
        console.warn('Using embedded Stavya surgeons data:', err);
      });
  }, []);

  // Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // API Mutators
  const handleSaveOtNote = async (note: OperativeNote) => {
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/ot-note`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      if (res.ok) {
        const updated = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, operativeNote: updated } : p));
      } else {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, operativeNote: note } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, operativeNote: note } : p));
    }
  };

  const handleSaveDischargeSummary = async (summary: DischargeSummary) => {
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/discharge-summary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary)
      });
      if (res.ok) {
        const updated = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, dischargeSummary: updated } : p));
      } else {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, dischargeSummary: summary } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, dischargeSummary: summary } : p));
    }
  };

  const handleSavePrescriptions = async (meds: MedicationItem[]) => {
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/prescriptions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meds)
      });
      if (res.ok) {
        const updated = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, prescriptions: updated } : p));
      } else {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, prescriptions: meds } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, prescriptions: meds } : p));
    }
  };

  const handleAddRound = async (round: WardRoundEntry) => {
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/rounds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(round)
      });
      if (res.ok) {
        const newRound = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
          ...p,
          wardRounds: [...(p.wardRounds || []), newRound]
        } : p));
      } else {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
          ...p,
          wardRounds: [...(p.wardRounds || []), round]
        } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
        ...p,
        wardRounds: [...(p.wardRounds || []), round]
      } : p));
    }
  };

  const handleSaveChecklist = async (chk: WHOSpineSafetyChecklist) => {
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/checklist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chk)
      });
      if (res.ok) {
        const updated = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, checklist: updated } : p));
      } else {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, checklist: chk } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, checklist: chk } : p));
    }
  };

  const handleSaveAssessment = async (ass: NeurologicalAssessment) => {
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ass)
      });
      if (res.ok) {
        const newAss = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
          ...p,
          assessments: [...(p.assessments || []), newAss]
        } : p));
      } else {
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
          ...p,
          assessments: [...(p.assessments || []), ass]
        } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {
        ...p,
        assessments: [...(p.assessments || []), ass]
      } : p));
    }
  };

  const handleSaveProtocolCompliance = async (entry: PatientProtocolCompliance) => {
    const applyLocally = (list: PatientProtocolCompliance[] | undefined) => {
      const existing = list || [];
      const idx = existing.findIndex(c => c.protocolId === entry.protocolId);
      if (idx === -1) return [...existing, entry];
      return existing.map(c => c.protocolId === entry.protocolId ? entry : c);
    };

    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/protocol-compliance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const updated: PatientProtocolCompliance[] = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, protocolCompliance: updated } : p));
        return;
      }
    } catch {
      // Offline fallback
    }

    setPatients(prev => prev.map(p => p.id === selectedPatient.id
      ? { ...p, protocolCompliance: applyLocally(p.protocolCompliance) }
      : p));
  };

  // Jump from a protocol step straight to the chart module that documents it
  const handleNavigateToModule = (target: ProtocolModuleTarget) => {
    if (target.startsWith('inpatient:')) {
      setActiveTab('inpatient');
      setInpatientSubTab(target.split(':')[1] as 'rounds' | 'prescriptions' | 'neuro-exam' | 'who-checklist');
      return;
    }
    if (target === 'connectors') {
      setActiveTab('feeds');
      setFeedsSubTab('connectors');
      return;
    }
    if (target === 'reports') {
      setActiveTab('feeds');
      setFeedsSubTab('reports');
      return;
    }
    if (target === 'anatomy') {
      setActiveTab('feeds');
      setFeedsSubTab('anatomy');
      return;
    }
    if (target === 'ot-note' || target === 'discharge' || target === 'pathway') {
      setActiveTab(target);
    }
  };

  // Open a specific protocol from any clinical module
  const handleOpenProtocol = (protocolId: string) => {
    setFocusProtocolId(protocolId);
    setActiveTab('feeds');
    setFeedsSubTab('protocols');
  };

  const handleAddPatient = async (newPatientData: Partial<Patient>) => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatientData)
      });
      if (res.ok) {
        const created = await res.json();
        setPatients([created, ...patients]);
        setSelectedPatientId(created.id);
      } else {
        const fallback: Patient = {
          ...newPatientData,
          id: `patient-${Date.now()}`,
          prescriptions: [],
          wardRounds: [],
          assessments: [],
          avatarColor: '#2563eb'
        } as Patient;
        setPatients([fallback, ...patients]);
        setSelectedPatientId(fallback.id);
      }
    } catch {
      const fallback: Patient = {
        ...newPatientData,
        id: `patient-${Date.now()}`,
        prescriptions: [],
        wardRounds: [],
        assessments: [],
        avatarColor: '#2563eb'
      } as Patient;
      setPatients([fallback, ...patients]);
      setSelectedPatientId(fallback.id);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset database to realistic spine patient cases? Any unsaved edits will be refreshed.')) {
      try {
        const res = await fetch('/api/reset-demo', { method: 'POST' });
        if (res.ok) {
          const fresh = await res.json();
          if (fresh.patients) setPatients(fresh.patients);
          if (fresh.surgeons) setSurgeons(fresh.surgeons);
          setSelectedPatientId(fresh.patients[0]?.id || DEMO_PATIENTS[0].id);
        } else {
          setPatients(DEMO_PATIENTS);
          setSelectedPatientId(DEMO_PATIENTS[0].id);
        }
      } catch {
        setPatients(DEMO_PATIENTS);
        setSelectedPatientId(DEMO_PATIENTS[0].id);
      }
    }
  };

  const togglePatientLevel = (lvl: SpineLevel) => {
    const updated = selectedPatient.affectedLevels.includes(lvl)
      ? selectedPatient.affectedLevels.filter(l => l !== lvl)
      : [...selectedPatient.affectedLevels, lvl];
    
    setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, affectedLevels: updated } : p));
  };

  const handleImportFromConnectorsToOtNote = async () => {
    if (!selectedPatient.departmentConnectors) return;
    const con = selectedPatient.departmentConnectors;

    const existingNote = selectedPatient.operativeNote;
    const updatedNote: OperativeNote = {
      id: existingNote?.id || `op-${Date.now()}`,
      surgeryDate: existingNote?.surgeryDate || selectedPatient.plannedOrSurgeryDate,
      startTime: existingNote?.startTime || '08:30 AM',
      endTime: existingNote?.endTime || '11:15 AM',
      primarySurgeon: existingNote?.primarySurgeon || selectedPatient.attendingSurgeon,
      assistantSurgeon: existingNote?.assistantSurgeon || selectedPatient.fellowOrResident || 'Dr. Amritesh Singh',
      anesthesiologist: con.pacAnesthesia?.recordedBy?.name 
        ? `${con.pacAnesthesia.recordedBy.name} (${con.pacAnesthesia.recordedBy.designation})`
        : (existingNote?.anesthesiologist || 'Dr. Kashyap Rameshchandra Shah'),
      scrubNurse: con.cssdOt?.scrubNurseAssigned || existingNote?.scrubNurse || 'Sister Bansari Patel / Gopalbhai Prajapati',
      preOpDiagnosis: existingNote?.preOpDiagnosis || selectedPatient.primaryDiagnosis,
      postOpDiagnosis: existingNote?.postOpDiagnosis || selectedPatient.primaryDiagnosis,
      procedureName: existingNote?.procedureName || selectedPatient.plannedProcedure,
      icd10Codes: existingNote?.icd10Codes || ['M43.16', 'M48.06'],
      operativeLevels: existingNote?.operativeLevels || selectedPatient.affectedLevels,
      approach: existingNote?.approach || selectedPatient.approach,
      anesthesiaType: con.pacAnesthesia?.plannedAnesthesiaType || existingNote?.anesthesiaType || 'General Endotracheal with Motor Evoked Potentials',
      position: existingNote?.position || 'Prone on Jackson radiolucent spinal table with bolsters',
      incisionDetails: existingNote?.incisionDetails || 'Midline / paramedian incision verified under fluoroscopy.',
      cArmConfirmation: true,
      fluorescopyTimeSec: existingNote?.fluorescopyTimeSec || 38,
      radiationDoseDAP: existingNote?.radiationDoseDAP || '14.8 mGy.cm²',
      microscopeUsed: true,
      microscopeModel: 'Zeiss Kinevo 900 3D HD',
      decompressionDetails: existingNote?.decompressionDetails || 'Meticulous neural decompression completed under high magnification.',
      discectomyDetails: existingNote?.discectomyDetails || 'Complete discectomy and cartilaginous endplate preparation with curettes.',
      interbodyFusionDetails: existingNote?.interbodyFusionDetails || 'Interbody cage packed with local bone graft and DBM placed into disc space.',
      instrumentationDetails: existingNote?.instrumentationDetails || 'Percutaneous pedicle screws placed and verified under AP/Lateral C-arm.',
      boneGraftUsed: existingNote?.boneGraftUsed || 'Autologous local bone graft mixed with DBM putty.',
      duralIntegrity: 'Intact - No tear',
      hemostasisAndClosure: existingNote?.hemostasisAndClosure || 'Meticulous hemostasis with bipolar and Floseal. Layered closure.',
      estimatedBloodLossMl: existingNote?.estimatedBloodLossMl || 120,
      drainsPlaced: existingNote?.drainsPlaced || '1x 10Fr negative suction Hemovac subfascial drain placed',
      entryAttribution: {
        enteredByName: currentSurgeon.name,
        enteredByDesignation: currentSurgeon.designation,
        staffTier: currentSurgeon.tier,
        enteredAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST (Imported from Stavya PAC & OT Connectors)',
        verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? 'Verified by Consultant' : 'Pending Consultant Review',
        verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? currentSurgeon.name : undefined,
        verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : undefined
      },
      implants: existingNote?.implants || [
        {
          id: `imp-${Date.now()}-1`,
          type: 'Pedicle Screw',
          level: selectedPatient.affectedLevels[0] || 'L4-L5',
          side: 'Bilateral',
          dimensions: '6.5 x 45 mm',
          material: 'Titanium',
          manufacturer: 'Medtronic CD Horizon',
          lotNumber: 'MDT-SP-88210'
        }
      ],
      neuromonitoring: existingNote?.neuromonitoring || {
        modality: ['MEP', 'SSEP', 'Triggered EMG'],
        baselineEstablished: true,
        baselineNotes: 'Stable baseline neurophysiologic signals confirmed.',
        intraopEvents: 'No significant neuro drop (>50% amp) observed.',
        closingStatus: 'Stable Baseline'
      },
      complications: existingNote?.complications || 'None reported. Hemostasis achieved. Duramater intact.',
      immediatePostOpPlan: existingNote?.immediatePostOpPlan || 'Shift to post-op recovery. Monitor hourly lower limb motor-sensory charting. Log-roll precautions.',
      surgeonSignature: existingNote?.surgeonSignature || selectedPatient.attendingSurgeon || currentSurgeon.name,
      isLocked: existingNote?.isLocked || false
    };

    await handleSaveOtNote(updatedNote);
    setActiveTab('ot-note');
  };

  const handleImportFromConnectorsToDischarge = async () => {
    if (!selectedPatient.departmentConnectors) return;
    const con = selectedPatient.departmentConnectors;

    const existingSummary = selectedPatient.dischargeSummary;
    const updatedSummary: DischargeSummary = {
      id: existingSummary?.id || `ds-${Date.now()}`,
      dischargeDate: existingSummary?.dischargeDate || new Date().toISOString().split('T')[0],
      summaryAuthor: selectedPatient.attendingSurgeon || currentSurgeon.name,
      admissionDate: selectedPatient.admissionDate,
      surgeryDate: selectedPatient.plannedOrSurgeryDate,
      hospitalCourseSummary: existingSummary?.hospitalCourseSummary || `${selectedPatient.name} (${selectedPatient.age}y/${selectedPatient.gender}) admitted for ${selectedPatient.plannedProcedure}. Surgical procedure completed uneventfully. Vitals remained stable on nursing station under ${con.nursing?.recordedBy?.name || 'Sister Anita Gohel'}. Early mobilization initiated by Dr. Parth Joshi (Physiotherapy). Pain well managed.`,
      operativeSummaryBrief: existingSummary?.operativeSummaryBrief || `${selectedPatient.plannedProcedure} via ${selectedPatient.approach}. Implants verified by CSSD (${con.cssdOt?.recordedBy?.name || 'Brijesh Bhatt / Dev Puri'}). Construct verified stable on C-arm.`,
      implantsSummary: con.cssdOt?.spinalImplantsConsignment || existingSummary?.implantsSummary || 'Spine instrumentation placed per operative record',
      dischargeNeuroStatus: con.physiotherapy?.postOpMobilizationMilestones?.orthoticBracePrescribed
        ? `Ambulatory with ${con.physiotherapy.postOpMobilizationMilestones.orthoticBracePrescribed}. Bilateral lower limb motor power preserved (5/5). Sensations intact.`
        : (existingSummary?.dischargeNeuroStatus || 'Independent ambulation with spinal brace. Neurological exam preserved.'),
      woundConditionAtDischarge: 'Surgical wound clean, dry, well-apposed. No signs of infection, erythema, or discharge. Dressing dry and intact.',
      sutureRemovalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' (Day 14 post-op at Stavya Spine OPD)',
      drainRemovalDateAndTotal: 'Drain removed on POD 2; cumulative output within expected limits (< 100 ml).',
      mobilityAtDischarge: con.physiotherapy?.postOpMobilizationMilestones?.assistedWalkerAmbulationMeters
        ? `Assisted walker ambulation > ${con.physiotherapy.postOpMobilizationMilestones.assistedWalkerAmbulationMeters} meters`
        : (selectedPatient.spineRegion === 'cervical' ? 'Ambulatory with cervical collar' : 'Ambulatory with rigid LSO brace'),
      braceInstructions: con.physiotherapy?.postOpMobilizationMilestones?.orthoticBracePrescribed || (selectedPatient.spineRegion === 'cervical' ? 'Rigid cervical collar 4-6 weeks' : 'Rigid LSO brace while out of bed for 6 weeks'),
      spinalPrecautions: [
        'Strict log-rolling technique when turning in bed.',
        'No bending forward at the waist or twisting.',
        'Strict 3 kg lifting limit for 6 weeks.',
        'Avoid prolonged sitting (> 45 minutes continuous).'
      ],
      redFlagWarnings: [
        'Sudden loss of bowel or bladder control (Cauda Equina emergency - report immediately!).',
        'New or worsening weakness/numbness in lower extremities.',
        'High fever (> 100.4°F) with wound pain or erythema.',
        'Clear fluid drainage from wound dressing.'
      ],
      medications: existingSummary?.medications || selectedPatient.prescriptions || [],
      firstFollowUpDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' at Stavya Spine OPD (Dr. Bharat Dave / Team)',
      emergencyContact: 'Stavya 24/7 Helpline: 7486038896 / 079-26401000',
      dischargeStatus: 'Ready for Home',
      surgeonSignature: selectedPatient.attendingSurgeon,
      entryAttribution: {
        enteredByName: currentSurgeon.name,
        enteredByDesignation: currentSurgeon.designation,
        staffTier: currentSurgeon.tier,
        enteredAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST (Imported from Stavya Pharmacy & Physio Connectors)',
        verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? 'Verified by Consultant' : 'Pending Consultant Review',
        verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? currentSurgeon.name : undefined,
        verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : undefined
      }
    };

    await handleSaveDischargeSummary(updatedSummary);
    setActiveTab('discharge');
  };

  const handleUpdateConnectors = async (updatedConnectors: any) => {
    if (!selectedPatient) return;
    try {
      const res = await fetch(`/api/patients/${selectedPatient.id}/connectors`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConnectors)
      });
      if (res.ok) {
        const updated = await res.json();
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, departmentConnectors: updated } : p));
      }
    } catch {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, departmentConnectors: updatedConnectors } : p));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
      {/* Minimalist Spine Surgeon Header */}
      <Navbar
        onOpenNetworkModal={() => setNetworkModalOpen(true)}
        networkUrl={networkInfo.clientUrl}
        onResetDemo={handleResetDemo}
        onAddNewPatient={() => setNewPatientModalOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedPatient={selectedPatient}
        currentSurgeon={currentSurgeon}
        onOpenHierarchyModal={() => setHierarchyModalOpen(true)}
        onOpenStaffDirectory={() => setStaffDirectoryModalOpen(true)}
        onOpenSmartAssist={() => setSmartAssistModalOpen(true)}
      />

      {/* Main SpineOS Clinical Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Clean Patient Sidebar */}
        <PatientSidebar
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={(id) => setSelectedPatientId(id)}
          filterText={searchTerm}
        />

        {/* Center Clinical Area */}
        {selectedPatient ? (
          <main style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '16px 22px',
            gap: '14px',
            background: 'var(--bg-canvas)'
          }}>
            {/* Minimalist Patient Clinical Strip */}
            <div style={{
              padding: '14px 18px',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              {/* Left Identity: Avatar + Name + Demographics + Bed */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: selectedPatient.avatarColor || '#0071e3',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                      {selectedPatient.name}
                    </h2>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: '4px' }}>
                      {selectedPatient.mrn}
                    </span>
                    <span className="badge badge-blue" style={{ fontSize: '10px', padding: '2px 7px' }}>
                      {selectedPatient.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    <span>{selectedPatient.age}y / {selectedPatient.gender}</span>
                    <span style={{ color: 'var(--border-strong)' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bed size={12} color="#0071e3" /> {selectedPatient.roomBed}
                    </span>
                    <span style={{ color: 'var(--border-strong)' }}>•</span>
                    <span>Surgeon: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPatient.attendingSurgeon}</strong></span>
                  </div>
                </div>
              </div>

              {/* Center: Spinal Levels & Procedure */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(0, 113, 227, 0.08)',
                  color: '#0071e3',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap'
                }}>
                  {selectedPatient.affectedLevels.join('-') || selectedPatient.spineRegion.toUpperCase()}
                </span>
                <span 
                  style={{ 
                    fontSize: '12.5px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)', 
                    maxWidth: '340px', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }} 
                  title={selectedPatient.plannedProcedure}
                >
                  {selectedPatient.plannedProcedure}
                </span>
              </div>

              {/* Right: Clean 1-Click Action Group (Radiograph, Print, AI Risk) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                <button
                  onClick={() => setSurgeryXRayModalOpen(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 113, 227, 0.25)',
                    background: 'rgba(0, 113, 227, 0.05)',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#0071e3',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                  title="View 2D executed fluoroscopy & implant alignment"
                >
                  <Layers size={13} />
                  <span>Radiograph</span>
                </button>

                {/* Print Dropdown */}
                <div style={{ position: 'relative' }} ref={printMenuRef}>
                  <button
                    onClick={() => setPrintDropdownOpen(prev => !prev)}
                    style={{
                      padding: '6px 11px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="Print clinical documents"
                  >
                    <Printer size={13} color="#0071e3" />
                    <span>Print</span>
                    <ChevronDown size={11} color="var(--text-muted)" />
                  </button>

                  {printDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '36px',
                      right: 0,
                      width: '180px',
                      background: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      padding: '5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      zIndex: 200
                    }}>
                      <button
                        onClick={() => {
                          setPrintType('ot-note');
                          setPrintDropdownOpen(false);
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={12} color="#0071e3" />
                        <span>Print OT Note</span>
                      </button>

                      <button
                        onClick={() => {
                          setPrintType('discharge-summary');
                          setPrintDropdownOpen(false);
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileCheck2 size={12} color="#059669" />
                        <span>Print Discharge</span>
                      </button>

                      <button
                        onClick={() => {
                          setPrintType('prescriptions');
                          setPrintDropdownOpen(false);
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Pill size={12} color="#f59e0b" />
                        <span>Print Medication Rx</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Surgeon-Centric 4+1 Segmented Navigation Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <div className="apple-segmented-nav" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                {[
                  { id: 'pathway', label: 'Clinical Overview', icon: Route },
                  { id: 'ot-note', label: 'Operative Record', icon: FileText, count: selectedPatient.operativeNote ? '✓' : '' },
                  { id: 'inpatient', label: 'Rounds & Inpatient', icon: Stethoscope, count: (selectedPatient.wardRounds || []).length ? `${(selectedPatient.wardRounds || []).length}` : '' },
                  { id: 'discharge', label: 'Discharge Summary', icon: FileCheck2, count: selectedPatient.dischargeSummary ? '✓' : '' },
                  { id: 'feeds', label: 'Feeds & Diagnostics', icon: Building2 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`apple-segmented-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={13} color={isActive ? '#0071e3' : '#6b7280'} />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count !== '' && (
                        <span style={{
                          background: isActive ? 'rgba(0, 113, 227, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: isActive ? '#0071e3' : 'var(--text-muted)',
                          borderRadius: '999px',
                          padding: '1px 5px',
                          fontSize: '9.5px',
                          fontWeight: 700
                        }}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Content Body */}
            <div style={{ flex: 1 }}>
              {/* Tab 1: Clinical Overview & Pathway */}
              {activeTab === 'pathway' && (
                <CarePathwayTimeline patient={selectedPatient} onOpenProtocol={handleOpenProtocol} />
              )}

              {/* Tab 2: Operative Record */}
              {activeTab === 'ot-note' && (
                <OperativeNoteEditor
                  patient={selectedPatient}
                  currentSurgeon={currentSurgeon}
                  onSave={handleSaveOtNote}
                  onPrintPreview={() => setPrintType('ot-note')}
                  onOpenProtocol={handleOpenProtocol}
                />
              )}

              {/* Tab 3: Rounds & Inpatient Care */}
              {activeTab === 'inpatient' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Clean Inpatient Sub-Navigation */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    background: '#f1f3f5',
                    padding: '3px',
                    borderRadius: '10px',
                    alignSelf: 'flex-start'
                  }}>
                    {[
                      { id: 'rounds', label: 'Ward Rounds & Drains', icon: ClipboardList, count: (selectedPatient.wardRounds || []).length },
                      { id: 'prescriptions', label: 'Routine Spine Rx', icon: Pill, count: (selectedPatient.prescriptions || []).length },
                      { id: 'neuro-exam', label: 'Neuro Exam & ODI', icon: Activity, count: (selectedPatient.assessments || []).length },
                      { id: 'who-checklist', label: 'WHO Safety Checklist', icon: ShieldCheck, count: selectedPatient.checklist ? '✓' : '' }
                    ].map((sub) => {
                      const isSubActive = inpatientSubTab === sub.id;
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setInpatientSubTab(sub.id as any)}
                          style={{
                            border: 'none',
                            background: isSubActive ? '#ffffff' : 'transparent',
                            color: isSubActive ? '#0071e3' : '#6b7280',
                            padding: '5px 12px',
                            borderRadius: '7px',
                            fontSize: '11.5px',
                            fontWeight: isSubActive ? 600 : 500,
                            cursor: 'pointer',
                            boxShadow: isSubActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <SubIcon size={12} color={isSubActive ? '#0071e3' : '#9ca3af'} />
                          <span>{sub.label}</span>
                          {sub.count !== undefined && sub.count !== '' && (
                            <span style={{
                              background: isSubActive ? 'rgba(0, 113, 227, 0.1)' : '#e5e7eb',
                              color: isSubActive ? '#0071e3' : '#6b7280',
                              padding: '1px 5px',
                              borderRadius: '999px',
                              fontSize: '9.5px',
                              fontWeight: 700
                            }}>
                              {sub.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {inpatientSubTab === 'rounds' && (
                    <WardRoundsTracker
                      patient={selectedPatient}
                      currentSurgeon={currentSurgeon}
                      onAddRound={handleAddRound}
                      onOpenProtocol={handleOpenProtocol}
                    />
                  )}
                  {inpatientSubTab === 'prescriptions' && (
                    <PrescriptionManager
                      patient={selectedPatient}
                      currentSurgeon={currentSurgeon}
                      onSave={handleSavePrescriptions}
                      onPrintPreview={() => setPrintType('prescriptions')}
                      onOpenProtocol={handleOpenProtocol}
                    />
                  )}
                  {inpatientSubTab === 'neuro-exam' && (
                    <NeurologyAssessment
                      patient={selectedPatient}
                      currentSurgeon={currentSurgeon}
                      onSave={handleSaveAssessment}
                      onOpenProtocol={handleOpenProtocol}
                    />
                  )}
                  {inpatientSubTab === 'who-checklist' && (
                    <WHOChecklist
                      patient={selectedPatient}
                      currentSurgeon={currentSurgeon}
                      onSave={handleSaveChecklist}
                      onOpenProtocol={handleOpenProtocol}
                    />
                  )}
                </div>
              )}

              {/* Tab 4: Discharge Summary */}
              {activeTab === 'discharge' && (
                <DischargeSummaryEditor
                  patient={selectedPatient}
                  currentSurgeon={currentSurgeon}
                  onSave={handleSaveDischargeSummary}
                  onPrintPreview={() => setPrintType('discharge-summary')}
                  onOpenProtocol={handleOpenProtocol}
                />
              )}

              {/* Tab 5: Consolidated Feeds, Reports & Protocols */}
              {activeTab === 'feeds' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Clean Sub-Navigation */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    background: '#f1f3f5',
                    padding: '3px',
                    borderRadius: '10px',
                    alignSelf: 'flex-start'
                  }}>
                    {[
                      { id: 'connectors', label: 'Hospital Connectors (9 Feeds)', icon: Building2 },
                      { id: 'reports', label: 'Diagnostic Reports', icon: FileBarChart },
                      { id: 'protocols', label: `Clinical Protocols (${matchProtocolsToPatient(selectedPatient).length})`, icon: BookOpenCheck },
                      { id: 'anatomy', label: 'Spine Column Anatomy', icon: Layers }
                    ].map((sub) => {
                      const isSubActive = feedsSubTab === sub.id;
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setFeedsSubTab(sub.id as any)}
                          style={{
                            border: 'none',
                            background: isSubActive ? '#ffffff' : 'transparent',
                            color: isSubActive ? '#0071e3' : '#6b7280',
                            padding: '5px 12px',
                            borderRadius: '7px',
                            fontSize: '11.5px',
                            fontWeight: isSubActive ? 600 : 500,
                            cursor: 'pointer',
                            boxShadow: isSubActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <SubIcon size={12} color={isSubActive ? '#0071e3' : '#9ca3af'} />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {feedsSubTab === 'connectors' && (
                    <DepartmentConnectorsHub
                      patient={selectedPatient}
                      currentSurgeon={currentSurgeon}
                      onImportToOtNote={handleImportFromConnectorsToOtNote}
                      onImportToDischarge={handleImportFromConnectorsToDischarge}
                      onOpenDirectory={() => setStaffDirectoryModalOpen(true)}
                      onUpdateConnectors={handleUpdateConnectors}
                    />
                  )}

                  {feedsSubTab === 'reports' && (
                    <ClinicalReportsView 
                      patient={selectedPatient}
                      onPrintReport={() => setPrintType('ot-note')}
                    />
                  )}

                  {feedsSubTab === 'protocols' && (
                    <ClinicalProtocolsHub
                      patient={selectedPatient}
                      currentSurgeon={currentSurgeon}
                      focusProtocolId={focusProtocolId}
                      onSaveCompliance={handleSaveProtocolCompliance}
                      onNavigateToModule={handleNavigateToModule}
                    />
                  )}

                  {feedsSubTab === 'anatomy' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
                      <SpineColumnSelector
                        selectedLevels={selectedPatient.affectedLevels}
                        onToggleLevel={togglePatientLevel}
                        primaryRegion={selectedPatient.spineRegion}
                      />

                      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          Spinal Column Operative Mapping
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          Interactive anatomical level visualizer for <strong>{selectedPatient.name}</strong> ({selectedPatient.mrn}).
                          Click any vertebral body on the left column to toggle instrumented or decompressed surgical segments.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px' }}>
                          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Operated Region</div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0071e3', textTransform: 'capitalize' }}>
                              {selectedPatient.spineRegion} Spine
                            </div>
                          </div>

                          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Targeted Vertebral Levels</div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                              {selectedPatient.affectedLevels.join(' - ') || 'None selected'}
                            </div>
                          </div>

                          <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approach Angle</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {selectedPatient.approach}
                            </div>
                          </div>
                        </div>

                        {/* Live 2D Executed Surgery X-Ray Animation */}
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>🩻</span>
                            <span>Executed Surgery 2D Radiograph Animation (Lateral & AP)</span>
                          </div>
                          <Surgery2DXRayViewer patient={selectedPatient} height="360px" variant="full" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a patient from the surgical roster to open their paperless chart.
          </div>
        )}
      </div>

      {/* Surgeon Hierarchy & Credentials Modal */}
      <SurgeonHierarchyModal
        isOpen={hierarchyModalOpen}
        onClose={() => setHierarchyModalOpen(false)}
        surgeons={surgeons}
        currentSurgeon={currentSurgeon}
        onSelectSurgeon={setCurrentSurgeon}
      />

      {/* Network / WiFi QR Code Modal */}
      <NetworkModal
        isOpen={networkModalOpen}
        onClose={() => setNetworkModalOpen(false)}
        networkInfo={networkInfo}
      />

      {/* New Patient Admission Modal */}
      <NewPatientModal
        isOpen={newPatientModalOpen}
        onClose={() => setNewPatientModalOpen(false)}
        onAddPatient={handleAddPatient}
        currentSurgeon={currentSurgeon}
      />

      {/* Stavya 213 Staff Org Directory Modal */}
      <StaffDirectoryModal
        isOpen={staffDirectoryModalOpen}
        onClose={() => setStaffDirectoryModalOpen(false)}
      />

      {/* 2D Executed Surgery X-Ray Modal */}
      {selectedPatient && (
        <Surgery2DXRayModal
          isOpen={surgeryXRayModalOpen}
          onClose={() => setSurgeryXRayModalOpen(false)}
          patient={selectedPatient}
        />
      )}

      {/* Official Printable Record Overlay */}
      {printType && selectedPatient && (
        <PrintView
          patient={selectedPatient}
          type={printType}
          onClose={() => setPrintType(null)}
        />
      )}

      {/* AI Sentinel & Smart Clinical Decision Support Modal */}
      {selectedPatient && (
        <SmartClinicalAssistModal
          patient={selectedPatient}
          currentSurgeon={currentSurgeon}
          isOpen={smartAssistModalOpen}
          onClose={() => setSmartAssistModalOpen(false)}
          onNavigateToTab={(tab) => {
            if (tab === 'protocols' || tab === 'connectors' || tab === 'reports' || tab === 'anatomy') {
              setActiveTab('feeds');
              setFeedsSubTab(tab);
            } else if (tab === 'pathway' || tab === 'ot-note' || tab === 'inpatient' || tab === 'discharge') {
              setActiveTab(tab);
            }
          }}
          onRefreshData={fetchPatients}
          onApplySynthesizedNote={(synth) => {
            handleSaveOtNote(synth);
            setActiveTab('ot-note');
          }}
        />
      )}
    </div>
  );
}

export default App;
