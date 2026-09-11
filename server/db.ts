import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEMO_PATIENTS } from '../src/data/templates.js';
import { STAVYA_SURGEONS } from '../src/data/surgeons.js';
import { DEMO_DEPARTMENT_CONNECTORS } from '../src/data/departmentConnectors.js';
import { Patient, SurgeonUser, PatientDepartmentConnectors } from '../src/types/spine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'spine_db.json');

export interface AuditEvent {
  id: string;
  timestamp: string;
  patientId?: string;
  patientName?: string;
  department?: string;
  action: string;
  actor: string;
  details: string;
  category: 'CONNECTOR' | 'CLINICAL' | 'SMART_ASSIST' | 'SECURITY';
}

export interface SpineDatabase {
  patients: Patient[];
  surgeons: SurgeonUser[];
  auditLog: AuditEvent[];
}

// In-memory cache
let dbCache: SpineDatabase | null = null;

export function initDatabase(): SpineDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      
      let modified = false;
      if (!parsed.surgeons || parsed.surgeons.length === 0) {
        parsed.surgeons = STAVYA_SURGEONS;
        modified = true;
      }
      if (!parsed.auditLog) {
        parsed.auditLog = [];
        modified = true;
      }

      // Ensure every patient has department connectors populated
      if (Array.isArray(parsed.patients)) {
        parsed.patients = parsed.patients.map((p: Patient) => {
          if (!p.departmentConnectors && DEMO_DEPARTMENT_CONNECTORS[p.id]) {
            p.departmentConnectors = DEMO_DEPARTMENT_CONNECTORS[p.id];
            modified = true;
          }
          return p;
        });
      }

      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }

      dbCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  const initialPatients = DEMO_PATIENTS.map(p => ({
    ...p,
    departmentConnectors: p.departmentConnectors || DEMO_DEPARTMENT_CONNECTORS[p.id] || undefined
  }));

  const initialData: SpineDatabase = {
    patients: initialPatients,
    surgeons: STAVYA_SURGEONS,
    auditLog: [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        department: 'System',
        action: 'DATABASE_INITIALIZED',
        actor: 'System Bootstrap',
        details: 'SpineOS database successfully seeded with Stavya patient cases and official surgeon roster.',
        category: 'SECURITY'
      }
    ]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  dbCache = initialData;
  return initialData;
}

export function getDatabase(): SpineDatabase {
  if (dbCache) return dbCache;
  return initDatabase();
}

export function saveDatabase(data: SpineDatabase): void {
  dbCache = data;
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
    // Fallback direct write
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
  const db = getDatabase();
  const newEvent: AuditEvent = {
    ...event,
    id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString()
  };
  
  if (!db.auditLog) db.auditLog = [];
  db.auditLog.unshift(newEvent);
  
  // Keep last 300 audit events
  if (db.auditLog.length > 300) {
    db.auditLog = db.auditLog.slice(0, 300);
  }
  
  saveDatabase(db);
  return newEvent;
}
