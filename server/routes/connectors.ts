import { Router, Request, Response } from 'express';
import { getDatabase, saveDatabase, logAuditEvent } from '../db.js';
import { PatientDepartmentConnectors } from '../../src/types/spine.js';
import { DEMO_DEPARTMENT_CONNECTORS } from '../../src/data/departmentConnectors.js';
import { STAVYA_EMPLOYEES } from '../../src/data/stavyaOrg.js';

const router = Router();

// Department registry metadata
export const STAVYA_CONNECTED_DEPARTMENTS = [
  { id: 'admissions', name: 'Admissions & TPA Desk', head: 'Zeal Vishal Thacore', code: 'ADM', status: 'ONLINE', protocol: 'HL7 / FHIR Gateway' },
  { id: 'nursing', name: 'Inpatient Nursing Station', head: 'Anita Sunilbhai Gohel', code: 'NRS', status: 'ONLINE', protocol: 'Live Ward Telemetry' },
  { id: 'radiology', name: 'Radiology & Stavya PACS', head: 'Dr. Preety Ajay Krishnan', code: 'RAD', status: 'ONLINE', protocol: 'DICOM 3.0 / C-Arm Fluoro' },
  { id: 'pacAnesthesia', name: 'Pre-Anesthesia Clinic & OT Anesthesia', head: 'Dr. Sunita Kulkarni', code: 'PAC', status: 'ONLINE', protocol: 'Anesthesia Information Management (AIMS)' },
  { id: 'cssdOt', name: 'CSSD & Surgical Theatre Robotics', head: 'Sister Deepa & OT Incharge', code: 'CSSD', status: 'ONLINE', protocol: 'GS1 Barcode / RFID Tray' },
  { id: 'pharmacy', name: 'Clinical Pharmacy & Formulary', head: 'Pharmacist In-charge', code: 'PHM', status: 'ONLINE', protocol: 'Stavya Hospital Formulary API' },
  { id: 'physiotherapy', name: 'Spine Rehabilitation & Physio', head: 'Senior Spine Physiotherapist', code: 'PT', status: 'ONLINE', protocol: 'Functional Mobility Tracker' },
  { id: 'financeBilling', name: 'IPD Accounts & TPA Settlement', head: 'Finance Manager', code: 'BIL', status: 'ONLINE', protocol: 'National Health Claims Gateway' },
  { id: 'clinicalResearch', name: 'Stavya Spine Research & Registry', head: 'Research Coordinator', code: 'RES', status: 'ONLINE', protocol: 'Spine Registry Electronic Data Capture' }
];

// GET /api/connectors/departments - list of all active departmental connectors
router.get('/departments', (_req: Request, res: Response) => {
  res.json({
    hospital: 'Stavya Spine Hospital & Research Institute',
    connectedUnits: STAVYA_CONNECTED_DEPARTMENTS.length,
    departments: STAVYA_CONNECTED_DEPARTMENTS
  });
});

// GET /api/connectors/audit-log - recent departmental stream events
router.get('/audit-log', (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const dept = req.query.department as string;

  let logs = db.auditLog || [];
  if (dept) {
    logs = logs.filter(l => l.department?.toLowerCase() === dept.toLowerCase());
  }

  res.json(logs.slice(0, limit));
});

// GET /api/patients/:id/connectors - all connectors for a patient
router.get('/:patientId/connectors', (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const connectors = patient.departmentConnectors || DEMO_DEPARTMENT_CONNECTORS[patient.id] || {};
  res.json(connectors);
});

// PUT /api/patients/:id/connectors - batch update all connectors for a patient
router.put('/:patientId/connectors', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.patientId);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  db.patients[index].departmentConnectors = {
    ...db.patients[index].departmentConnectors,
    ...req.body
  };
  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Cross-Departmental Hub',
    action: 'CONNECTORS_BATCH_UPDATED',
    actor: 'Hospital Systems Integrator',
    details: `Updated departmental feeds across multiple clinical streams for ${db.patients[index].name}`,
    category: 'CONNECTOR'
  });

  res.json(db.patients[index].departmentConnectors);
});

// GET /api/patients/:id/connectors/:dept - get specific department stream
router.get('/:patientId/connectors/:dept', (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const deptKey = req.params.dept as keyof PatientDepartmentConnectors;
  const connectors = patient.departmentConnectors || DEMO_DEPARTMENT_CONNECTORS[patient.id];
  const deptData = connectors ? connectors[deptKey] : null;

  if (!deptData) {
    return res.status(404).json({ error: `No connector data recorded for department: ${req.params.dept}` });
  }

  res.json(deptData);
});

// PUT /api/patients/:id/connectors/:dept - update specific department stream
router.put('/:patientId/connectors/:dept', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.patientId);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const deptKey = req.params.dept as keyof PatientDepartmentConnectors;
  if (!db.patients[index].departmentConnectors) {
    db.patients[index].departmentConnectors = (DEMO_DEPARTMENT_CONNECTORS[db.patients[index].id] || {}) as PatientDepartmentConnectors;
  }

  (db.patients[index].departmentConnectors as any)[deptKey] = {
    ...(db.patients[index].departmentConnectors as any)[deptKey],
    ...req.body
  };

  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: req.params.dept.toUpperCase(),
    action: 'DEPARTMENT_STREAM_UPDATED',
    actor: req.body.recordedBy?.name || 'Department Officer',
    details: `Updated clinical feed for department [${req.params.dept}] for patient ${db.patients[index].name}`,
    category: 'CONNECTOR'
  });

  res.json((db.patients[index].departmentConnectors as any)[deptKey]);
});

// POST /api/connectors/dispatch-action - Interactive Action Dispatcher / Webhook Simulator
router.post('/dispatch-action', (req: Request, res: Response) => {
  const { patientId, action, data, actorName } = req.body;

  if (!patientId || !action) {
    return res.status(400).json({ error: 'patientId and action are required' });
  }

  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === patientId);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const patient = db.patients[index];
  if (!patient.departmentConnectors) {
    patient.departmentConnectors = (DEMO_DEPARTMENT_CONNECTORS[patient.id] || {}) as PatientDepartmentConnectors;
  }

  const now = new Date();
  const timestampStr = now.toLocaleDateString('en-GB') + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  let auditDetails = '';
  let updatedDepartment = 'Cross-Departmental Hub';

  switch (action) {
    case 'LOG_VITALS': {
      updatedDepartment = 'Nursing';
      const nursing = patient.departmentConnectors.nursing || ({} as any);
      nursing.currentVitals = {
        ...nursing.currentVitals,
        bloodPressure: data.bloodPressure || nursing.currentVitals?.bloodPressure || '120/80 mmHg',
        pulse: data.pulse || nursing.currentVitals?.pulse || 72,
        spo2: data.spo2 || nursing.currentVitals?.spo2 || 99,
        temperature: data.temperature || nursing.currentVitals?.temperature || 98.6,
        vasPainScore: data.vasPainScore !== undefined ? data.vasPainScore : nursing.currentVitals?.vasPainScore || 2
      };
      nursing.recordedBy = {
        staffId: 'e010',
        name: actorName || 'Anita Sunilbhai Gohel',
        designation: 'Floor In-charge · 4th Floor',
        unit: 'Floor In-charges',
        contact: '7016507186',
        timestamp: timestampStr
      };
      patient.departmentConnectors.nursing = nursing;
      auditDetails = `New telemetry vitals logged: BP ${nursing.currentVitals.bloodPressure}, Pulse ${nursing.currentVitals.pulse} bpm, SpO2 ${nursing.currentVitals.spo2}%, VAS ${nursing.currentVitals.vasPainScore}/10`;
      break;
    }

    case 'UPDATE_DRAIN': {
      updatedDepartment = 'Nursing';
      const nursing = patient.departmentConnectors.nursing || ({} as any);
      const outputMl = data.drainOutputMl || 25;
      nursing.postOpCare = {
        ...nursing.postOpCare,
        activeDrainsStatus: `Suction drain: ${outputMl} ml in last 24h (${outputMl < 30 ? 'Ready for removal' : 'Active monitoring required'})`
      };
      patient.departmentConnectors.nursing = nursing;
      auditDetails = `Surgical drain output updated: ${outputMl} ml in last 24h. Status: ${outputMl < 30 ? 'Discontinuation threshold met' : 'Active drainage'}`;
      break;
    }

    case 'PACS_SYNC_STUDY': {
      updatedDepartment = 'Radiology';
      const radiology = patient.departmentConnectors.radiology || ({} as any);
      radiology.mriStudyId = data.studyId || radiology.mriStudyId || `MR-SPN-${Date.now().toString().slice(-5)}`;
      radiology.cArmFluoroDosimetryDAP = data.dosimetry || '14.2 mGy.cm2 (Fluoroscopy time: 48 sec)';
      radiology.recordedBy = {
        staffId: 'e048',
        name: actorName || 'Dr. Preety Ajay Krishnan',
        designation: 'Radiologist · Head, Radiology',
        unit: 'Radiology',
        contact: '9824202768',
        timestamp: timestampStr
      };
      patient.departmentConnectors.radiology = radiology;
      auditDetails = `PACS study sync verified. Study ID: ${radiology.mriStudyId}, Fluoroscopy Dosimetry: ${radiology.cArmFluoroDosimetryDAP}`;
      break;
    }

    case 'PAC_CLEARANCE': {
      updatedDepartment = 'PAC / Anesthesia';
      const pac = patient.departmentConnectors.pacAnesthesia || ({} as any);
      pac.fitnessStatus = data.fitnessStatus || 'Fit for General Anesthesia with Prone Spine Positioning';
      pac.asaPhysicalStatus = data.asaStatus || pac.asaPhysicalStatus || 'ASA II';
      pac.recordedBy = {
        staffId: 'e060',
        name: actorName || 'Dr. Sunita Kulkarni',
        designation: 'Chief of Anesthesiology',
        unit: 'Anesthesiology & Critical Care',
        contact: '9824011223',
        timestamp: timestampStr
      };
      patient.departmentConnectors.pacAnesthesia = pac;
      auditDetails = `Pre-anesthetic evaluation updated: ${pac.fitnessStatus} (ASA ${pac.asaPhysicalStatus})`;
      break;
    }

    case 'STERILE_IMPLANT_VERIFY': {
      updatedDepartment = 'CSSD / OT';
      const cssd = patient.departmentConnectors.cssdOt || ({} as any);
      cssd.pedicleScrewTraysBarcode = data.barcode || `STV-SPN-TRAY-${Date.now().toString().slice(-4)}`;
      cssd.autoclaveCycleNumber = data.cycle || 'AC-2026-09-CYCLE-04 (Biological Indicator: Negative / Passed)';
      cssd.recordedBy = {
        staffId: 'e030',
        name: actorName || 'Sister Deepa (Staff Nurse / OT Senior)',
        designation: 'CSSD & OT In-charge',
        unit: 'Operating Theatre Services',
        contact: '9825100991',
        timestamp: timestampStr
      };
      patient.departmentConnectors.cssdOt = cssd;
      auditDetails = `CSSD sterile implant tray verified: Tray Barcode ${cssd.pedicleScrewTraysBarcode}, Autoclave Cycle: ${cssd.autoclaveCycleNumber}`;
      break;
    }

    case 'PHARMACY_STAT_DISPENSE': {
      updatedDepartment = 'Pharmacy';
      const pharmacy = patient.departmentConnectors.pharmacy || ({} as any);
      const drugName = data.drugName || 'Inj. Cefuroxime 1.5g IV';
      pharmacy.antibioticProphylaxisGiven = `Administered ${drugName} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} (Strictly within 60 min of incision)`;
      patient.departmentConnectors.pharmacy = pharmacy;
      auditDetails = `Stat surgical prophylaxis dispensed & verified: ${pharmacy.antibioticProphylaxisGiven}`;
      break;
    }

    case 'PHYSIO_MILESTONE_LOG': {
      updatedDepartment = 'Physiotherapy';
      const physio = patient.departmentConnectors.physiotherapy || ({} as any);
      const milestoneText = data.milestone || 'Independent bedside standing & 25-meter walker ambulation achieved with LSO brace';
      physio.postOpMobilizationMilestones = {
        ...physio.postOpMobilizationMilestones,
        pod1SittingBedside: true,
        pod2WalkerAmbulation: true,
        summary: milestoneText
      };
      physio.recordedBy = {
        staffId: 'e140',
        name: actorName || 'Dr. Hardik Patel, MPT (Neuro-Spine)',
        designation: 'Senior Spine Physiotherapist',
        unit: 'Physiotherapy & Rehabilitation',
        contact: '9879500112',
        timestamp: timestampStr
      };
      patient.departmentConnectors.physiotherapy = physio;
      auditDetails = `Physiotherapy milestone documented: ${milestoneText}`;
      break;
    }

    case 'TPA_PREAUTH_UPDATE': {
      updatedDepartment = 'Finance & Billing';
      const billing = patient.departmentConnectors.financeBilling || ({} as any);
      const admissions = patient.departmentConnectors.admissions || ({} as any);
      const approvedAmount = data.approvedAmount || 320000;
      billing.preAuthApprovedAmount = approvedAmount;
      billing.finalSettlementStatus = data.status || 'Pre-Auth Active & Sanctioned';
      admissions.approvedAmount = approvedAmount;
      admissions.preAuthStatus = 'Approved';
      patient.departmentConnectors.financeBilling = billing;
      patient.departmentConnectors.admissions = admissions;
      auditDetails = `TPA Cashless Pre-Auth updated: ₹${approvedAmount.toLocaleString('en-IN')} sanctioned by insurer.`;
      break;
    }

    default:
      return res.status(400).json({ error: `Unknown connector action: ${action}` });
  }

  saveDatabase(db);

  const logged = logAuditEvent({
    patientId: patient.id,
    patientName: patient.name,
    department: updatedDepartment,
    action: `ACTION_${action}`,
    actor: actorName || 'Hospital Automation Desk',
    details: auditDetails,
    category: 'CONNECTOR'
  });

  res.json({
    success: true,
    action,
    auditEvent: logged,
    connectors: patient.departmentConnectors
  });
});

export default router;
