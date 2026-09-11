import { Router, Request, Response } from 'express';
import { getDatabase, logAuditEvent } from '../db.js';
import { STAVYA_SURGEONS } from '../../src/data/surgeons.js';
import { STAVYA_EMPLOYEES, STAVYA_UNITS, STAVYA_GOVERNANCE } from '../../src/data/stavyaOrg.js';

const router = Router();

// GET /api/surgeons - list all active surgeons in Stavya spine surgery department
router.get('/', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.surgeons || STAVYA_SURGEONS);
});

// GET /api/surgeons/:id - single surgeon profile
router.get('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const surgeons = db.surgeons || STAVYA_SURGEONS;
  const surgeon = surgeons.find(s => s.id === req.params.id);
  if (!surgeon) {
    return res.status(404).json({ error: 'Surgeon not found' });
  }
  res.json(surgeon);
});

// GET /api/surgeons/:id/privileges - check clinical privileges
router.get('/:id/privileges', (req: Request, res: Response) => {
  const db = getDatabase();
  const surgeons = db.surgeons || STAVYA_SURGEONS;
  const surgeon = surgeons.find(s => s.id === req.params.id);
  if (!surgeon) {
    return res.status(404).json({ error: 'Surgeon not found' });
  }

  res.json({
    surgeonId: surgeon.id,
    name: surgeon.name,
    tier: surgeon.tier,
    tierLabel: surgeon.tierLabel,
    hierarchyRank: surgeon.hierarchyRank,
    privileges: {
      canApproveOTNotes: surgeon.canApproveOTNotes,
      canFinalizeDischarge: surgeon.canFinalizeDischarge,
      canPrescribeRestrictedMeds: surgeon.canPrescribeRestrictedMeds,
      canSignAsPrimarySurgeon: surgeon.canSignAsPrimarySurgeon,
      canPerformWardRounds: surgeon.canPerformWardRounds
    }
  });
});

// POST /api/auth/login - authenticate surgeon by PIN or credentials
router.post('/auth/login', (req: Request, res: Response) => {
  const { identifier, passwordOrPin } = req.body;
  const db = getDatabase();
  const surgeons = db.surgeons || STAVYA_SURGEONS;

  const surgeon = surgeons.find(
    s => (s.username.toLowerCase() === identifier?.toLowerCase() || 
          s.email.toLowerCase() === identifier?.toLowerCase() || 
          s.id === identifier) &&
         (s.password === passwordOrPin || s.pin === passwordOrPin || !passwordOrPin)
  );

  if (!surgeon) {
    return res.status(401).json({ error: 'Invalid surgeon credentials or PIN' });
  }

  logAuditEvent({
    department: 'Spine Surgery',
    action: 'SURGEON_SESSION_STARTED',
    actor: surgeon.name,
    details: `Surgeon authenticated: ${surgeon.formalName} (${surgeon.tierLabel})`,
    category: 'SECURITY'
  });

  res.json({
    success: true,
    user: surgeon
  });
});

// GET /api/staff-directory - full hospital staff directory
router.get('/directory/all', (_req: Request, res: Response) => {
  res.json({
    governance: STAVYA_GOVERNANCE,
    units: STAVYA_UNITS,
    employees: Object.values(STAVYA_EMPLOYEES),
    totalStaff: Object.keys(STAVYA_EMPLOYEES).length
  });
});

export default router;
