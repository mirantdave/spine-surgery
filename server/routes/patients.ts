import { Router, Request, Response } from 'express';
import { getDatabase, saveDatabase, logAuditEvent } from '../db.js';
import { Patient } from '../../src/types/spine.js';
import { DEMO_DEPARTMENT_CONNECTORS } from '../../src/data/departmentConnectors.js';

const router = Router();

// GET /api/patients - list with optional filters
router.get('/', (req: Request, res: Response) => {
  const db = getDatabase();
  let patients = [...db.patients];

  const { status, spineRegion, search, surgeon } = req.query;

  if (status && typeof status === 'string') {
    patients = patients.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (spineRegion && typeof spineRegion === 'string') {
    patients = patients.filter(p => p.spineRegion.toLowerCase() === spineRegion.toLowerCase());
  }

  if (surgeon && typeof surgeon === 'string') {
    patients = patients.filter(p => 
      p.attendingSurgeon?.toLowerCase().includes(surgeon.toLowerCase()) ||
      p.fellowOrResident?.toLowerCase().includes(surgeon.toLowerCase())
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    patients = patients.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.primaryDiagnosis.toLowerCase().includes(q) ||
      p.roomBed?.toLowerCase().includes(q)
    );
  }

  res.json(patients);
});

// GET /api/patients/:id - single patient
router.get('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json(patient);
});

// POST /api/patients - create patient
router.post('/', (req: Request, res: Response) => {
  const db = getDatabase();
  const count = db.patients.length + 1;
  const id = req.body.id || `patient-${Date.now()}`;
  const mrn = req.body.mrn || `SPN-2026-${String(count).padStart(3, '0')}`;

  const defaultConnectors = DEMO_DEPARTMENT_CONNECTORS[id] || {
    admissions: {
      uhid: `STV-2026-${String(4800 + count).padStart(6, '0')}`,
      ipdNumber: `IPD-26-${String(890 + count).padStart(4, '0')}`,
      admissionType: req.body.status === 'Pre-Op Evaluation' ? 'Planned Elective' : 'Emergency / Direct IPD',
      bedLocation: req.body.roomBed || 'Bed 401',
      wardUnit: '4th Floor Spine IPD Ward',
      payerType: 'TPA / Cashless Insurance',
      tpaName: 'Star Health & Allied Insurance',
      preAuthStatus: 'Approved',
      approvedAmount: 300000,
      emergencyContactName: 'Family Attendant',
      emergencyContactPhone: req.body.contactNumber || '+91 98200 00000',
      admissionVitals: {
        bloodPressure: '128/80 mmHg',
        pulse: 74,
        spo2: 99,
        weightKg: req.body.weightKg || 70,
        heightCm: req.body.heightCm || 170
      },
      handoverNotes: `Admitted under ${req.body.attendingSurgeon || 'Spine Service'}. Consent and pre-auth active.`,
      recordedBy: {
        staffId: 'e211',
        name: 'Zeal Vishal Thacore',
        designation: 'IPD Billing & Admission Officer',
        unit: 'Admission',
        contact: '8866091084',
        timestamp: new Date().toLocaleDateString('en-GB') + ', 08:00 AM IST'
      }
    }
  };

  const newPatient: Patient = {
    ...req.body,
    id,
    mrn,
    departmentConnectors: req.body.departmentConnectors || defaultConnectors,
    prescriptions: req.body.prescriptions || [],
    wardRounds: req.body.wardRounds || [],
    assessments: req.body.assessments || [],
    avatarColor: req.body.avatarColor || '#0071e3',
    status: req.body.status || 'Pre-Op Evaluation'
  };

  db.patients.unshift(newPatient);
  saveDatabase(db);

  logAuditEvent({
    patientId: newPatient.id,
    patientName: newPatient.name,
    department: 'Admissions',
    action: 'PATIENT_REGISTERED',
    actor: req.body.enteredByName || 'Clinical Desk',
    details: `New patient case created for ${newPatient.name} (${newPatient.mrn}) - Diagnosis: ${newPatient.primaryDiagnosis}`,
    category: 'CLINICAL'
  });

  res.status(201).json(newPatient);
});

// PUT /api/patients/:id - update patient
router.put('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  db.patients[index] = { ...db.patients[index], ...req.body };
  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Spine Surgery',
    action: 'PATIENT_UPDATED',
    actor: req.body.enteredByName || 'Attending Surgeon',
    details: `Updated patient details and surgical plan for ${db.patients[index].name}`,
    category: 'CLINICAL'
  });

  res.json(db.patients[index]);
});

// DELETE /api/patients/:id - archive/delete
router.delete('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const removed = db.patients.splice(index, 1)[0];
  saveDatabase(db);

  logAuditEvent({
    patientId: removed.id,
    patientName: removed.name,
    department: 'Medical Records',
    action: 'PATIENT_ARCHIVED',
    actor: 'System Administrator',
    details: `Patient record ${removed.name} (${removed.mrn}) removed from active floor roster.`,
    category: 'SECURITY'
  });

  res.json({ message: 'Patient removed successfully', patient: removed });
});

// PUT /api/patients/:id/ot-note - save operative note
router.put('/:id/ot-note', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  db.patients[index].operativeNote = {
    ...req.body,
    id: req.body.id || `op-${Date.now()}`
  };

  // Status progression
  if (db.patients[index].status === 'Scheduled for Surgery' || db.patients[index].status === 'In Operating Room') {
    db.patients[index].status = 'Post-Op Day 0';
  }

  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Operating Theatre',
    action: 'OT_NOTE_FINALIZED',
    actor: req.body.primarySurgeon || 'Consultant Spine Surgeon',
    details: `Operative note finalized: ${req.body.procedureName || 'Spine Procedure'} (${req.body.startTime} - ${req.body.endTime})`,
    category: 'CLINICAL'
  });

  res.json(db.patients[index].operativeNote);
});

// PUT /api/patients/:id/discharge-summary - update discharge summary
router.put('/:id/discharge-summary', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  db.patients[index].dischargeSummary = {
    ...req.body,
    id: req.body.id || `ds-${Date.now()}`
  };

  if (req.body.status === 'Finalized & Signed') {
    db.patients[index].status = 'Discharged';
  }

  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Discharge Desk',
    action: 'DISCHARGE_SUMMARY_SAVED',
    actor: req.body.signedByConsultant || 'Spine Team',
    details: `Discharge summary updated for ${db.patients[index].name}. Discharge status: ${db.patients[index].status}`,
    category: 'CLINICAL'
  });

  res.json(db.patients[index].dischargeSummary);
});

// PUT /api/patients/:id/prescriptions - update medication regimen
router.put('/:id/prescriptions', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  db.patients[index].prescriptions = req.body;
  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Pharmacy',
    action: 'MEDICATIONS_UPDATED',
    actor: 'Spine Surgeon / Pharmacist',
    details: `Updated active medication bundle (${req.body.length} drugs prescribed) for ${db.patients[index].name}`,
    category: 'CLINICAL'
  });

  res.json(db.patients[index].prescriptions);
});

// POST /api/patients/:id/rounds - append ward round
router.post('/:id/rounds', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const newRound = {
    ...req.body,
    id: req.body.id || `round-${Date.now()}`
  };

  db.patients[index].wardRounds = db.patients[index].wardRounds || [];
  db.patients[index].wardRounds.push(newRound);
  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'IPD Inpatient Ward',
    action: 'WARD_ROUND_LOGGED',
    actor: newRound.doctorName || 'Spine Registrar',
    details: `Ward round logged for ${db.patients[index].name}: Pain VAS ${newRound.vasScore}/10, Vitals: ${newRound.vitals?.bloodPressure}`,
    category: 'CLINICAL'
  });

  res.status(201).json(newRound);
});

// PUT /api/patients/:id/checklist - WHO surgical safety checklist
router.put('/:id/checklist', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  db.patients[index].checklist = {
    ...req.body,
    id: req.body.id || `chk-${Date.now()}`
  };
  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Operating Theatre',
    action: 'WHO_CHECKLIST_UPDATED',
    actor: req.body.verifiedBy || 'Scrub Team',
    details: `WHO Surgical Safety Checklist verified for ${db.patients[index].name}`,
    category: 'SECURITY'
  });

  res.json(db.patients[index].checklist);
});

// POST /api/patients/:id/assessment - neurological assessment
router.post('/:id/assessment', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const assessment = {
    ...req.body,
    id: req.body.id || `ass-${Date.now()}`
  };
  db.patients[index].assessments = db.patients[index].assessments || [];
  db.patients[index].assessments.push(assessment);
  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Neurology / Neuro-Assessment',
    action: 'NEUROLOGY_EVALUATION',
    actor: assessment.assessedBy || 'Spine Specialist',
    details: `Neurological assessment documented for ${db.patients[index].name}: Sensory & motor evaluation recorded`,
    category: 'CLINICAL'
  });

  res.status(201).json(assessment);
});

export default router;
