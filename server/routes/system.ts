import { Router, Request, Response } from 'express';
import os from 'os';
import { getDatabase, saveDatabase, logAuditEvent } from '../db.js';
import { DEMO_PATIENTS, ROUTINE_MEDICATION_BUNDLES, OPERATIVE_TEMPLATES } from '../../src/data/templates.js';
import { STAVYA_SURGEONS } from '../../src/data/surgeons.js';
import { STAVYA_EMPLOYEES, STAVYA_UNITS, STAVYA_GOVERNANCE } from '../../src/data/stavyaOrg.js';

const router = Router();

function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const LOCAL_IP = getLocalIpAddress();

// GET /api/network-info - WiFi IP & pairing info
router.get('/network-info', (_req: Request, res: Response) => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3031;
  res.json({
    ip: LOCAL_IP,
    apiPort: port,
    clientPort: 3030,
    clientUrl: `http://${LOCAL_IP}:3030`,
    apiUrl: `http://${LOCAL_IP}:${port}`,
    hostname: os.hostname(),
    networkName: 'Hospital Spine Surgical WiFi'
  });
});

// GET /api/templates - operative templates & routine medication bundles
router.get('/templates', (_req: Request, res: Response) => {
  res.json({
    operativeTemplates: OPERATIVE_TEMPLATES,
    medicationBundles: ROUTINE_MEDICATION_BUNDLES
  });
});

// GET /api/staff-directory - governance & staff
router.get('/staff-directory', (_req: Request, res: Response) => {
  res.json({
    governance: STAVYA_GOVERNANCE,
    units: STAVYA_UNITS,
    employees: Object.values(STAVYA_EMPLOYEES),
    totalStaff: Object.keys(STAVYA_EMPLOYEES).length
  });
});

// GET /api/health - healthcheck
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'SpineOS Backend Clinical Core',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  });
});

// GET /api/export - database backup export
router.get('/export', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=stavya_spine_db_${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// POST /api/reset-demo - reset to demo data
router.post('/reset-demo', (_req: Request, res: Response) => {
  const initialData = {
    patients: DEMO_PATIENTS,
    surgeons: STAVYA_SURGEONS,
    auditLog: [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        department: 'System',
        action: 'DATABASE_RESET_DEMO',
        actor: 'Clinical Administrator',
        details: 'Database reset to canonical Stavya patient records.',
        category: 'SECURITY' as const
      }
    ]
  };

  saveDatabase(initialData);

  res.json({
    message: 'Database reset to demo patient cases successfully',
    patients: initialData.patients,
    surgeons: initialData.surgeons
  });
});

export default router;
