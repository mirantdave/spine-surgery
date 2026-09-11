import { Router, Request, Response } from 'express';
import { ALL_CLINICAL_PROTOCOLS, getProtocolById, getProtocolLibrarySummary } from '../../src/data/clinicalProtocols.js';
import { getDatabase, saveDatabase, logAuditEvent } from '../db.js';
import { PatientProtocolCompliance } from '../../src/types/protocol.js';

const router = Router();

// GET /api/protocols - full protocol catalog
router.get('/', (req: Request, res: Response) => {
  const { category } = req.query;
  const protocols = category
    ? ALL_CLINICAL_PROTOCOLS.filter(p => p.category === category)
    : ALL_CLINICAL_PROTOCOLS;

  res.json({
    summary: getProtocolLibrarySummary(),
    protocols
  });
});

// GET /api/protocols/summary - summary metrics
router.get('/summary', (_req: Request, res: Response) => {
  res.json(getProtocolLibrarySummary());
});

// GET /api/protocols/:id - single protocol details
router.get('/:id', (req: Request, res: Response) => {
  const protocol = getProtocolById(req.params.id);
  if (!protocol) {
    return res.status(404).json({ error: 'Clinical protocol not found' });
  }
  res.json(protocol);
});

// GET /api/protocols/patient/:patientId - get compliance for a patient
router.get('/patient/:patientId', (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json(patient.protocolCompliance || []);
});

// PUT /api/protocols/patient/:patientId - save or update compliance entry
router.put('/patient/:patientId', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.patients.findIndex(p => p.id === req.params.patientId);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const entry = req.body as PatientProtocolCompliance;
  if (!entry || !entry.protocolId) {
    return res.status(400).json({ error: 'protocolId is required' });
  }

  const protocol = getProtocolById(entry.protocolId);
  if (!protocol) {
    return res.status(404).json({ error: 'Clinical protocol not found' });
  }

  const existing = db.patients[index].protocolCompliance || [];
  const position = existing.findIndex(c => c.protocolId === entry.protocolId);
  db.patients[index].protocolCompliance = position === -1
    ? [...existing, entry]
    : existing.map(c => (c.protocolId === entry.protocolId ? entry : c));

  saveDatabase(db);

  logAuditEvent({
    patientId: db.patients[index].id,
    patientName: db.patients[index].name,
    department: 'Clinical Quality & NABH',
    action: 'PROTOCOL_COMPLIANCE_RECORDED',
    actor: entry.signedBy?.name || 'Quality Officer',
    details: `Updated compliance for protocol [${protocol.code}] ${protocol.title} (${entry.checklistState.filter(s => s.checked).length}/${entry.checklistState.length} checklist items verified).`,
    category: 'CLINICAL'
  });

  res.json(db.patients[index].protocolCompliance);
});

export default router;
