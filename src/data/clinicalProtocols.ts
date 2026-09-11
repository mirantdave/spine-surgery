import { Patient } from '../types/spine';
import {
  ClinicalProtocol,
  ProtocolCategory,
  ProtocolMatch,
  ProtocolModuleTarget,
  PatientProtocolCompliance,
  ProtocolComplianceStatus
} from '../types/protocol';
import { PRE_OPERATIVE_PROTOCOLS } from './protocols/preOperative';
import { INTRA_OPERATIVE_PROTOCOLS } from './protocols/intraOperative';
import { POST_OPERATIVE_PROTOCOLS } from './protocols/postOperative';
import { EMERGENCY_PROTOCOLS } from './protocols/emergency';
import { DISCHARGE_FOLLOWUP_PROTOCOLS } from './protocols/dischargeFollowUp';
import { SPECIAL_POPULATION_PROTOCOLS } from './protocols/specialPopulations';

// ============================================================================
// STAVYA SPINE SURGERY — MASTER CLINICAL PROTOCOL LIBRARY
// Aggregates every institutional spine protocol and provides the matching
// engine that surfaces the relevant subset for an individual patient.
// ============================================================================

export const ALL_CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  ...PRE_OPERATIVE_PROTOCOLS,
  ...INTRA_OPERATIVE_PROTOCOLS,
  ...POST_OPERATIVE_PROTOCOLS,
  ...EMERGENCY_PROTOCOLS,
  ...DISCHARGE_FOLLOWUP_PROTOCOLS,
  ...SPECIAL_POPULATION_PROTOCOLS
];

export const PROTOCOL_CATEGORY_ORDER: ProtocolCategory[] = [
  'Pre-Operative',
  'Intra-Operative',
  'Post-Operative',
  'Complication & Emergency',
  'Discharge & Follow-Up',
  'Special Population'
];

/** Accent colour per category, matching the clinical workspace palette. */
export const PROTOCOL_CATEGORY_COLORS: Record<ProtocolCategory, string> = {
  'Pre-Operative': '#0071e3',
  'Intra-Operative': '#7c3aed',
  'Post-Operative': '#059669',
  'Complication & Emergency': '#dc2626',
  'Discharge & Follow-Up': '#ea580c',
  'Special Population': '#0891b2'
};

export function getProtocolById(protocolId: string): ClinicalProtocol | undefined {
  return ALL_CLINICAL_PROTOCOLS.find(p => p.id === protocolId);
}

export function getProtocolByCode(code: string): ClinicalProtocol | undefined {
  return ALL_CLINICAL_PROTOCOLS.find(p => p.code.toLowerCase() === code.toLowerCase());
}

export function getProtocolsByCategory(category: ProtocolCategory): ClinicalProtocol[] {
  return ALL_CLINICAL_PROTOCOLS.filter(p => p.category === category);
}

/** Every protocol that deep-links into a given chart module. */
export function getProtocolsForModule(target: ProtocolModuleTarget): ClinicalProtocol[] {
  return ALL_CLINICAL_PROTOCOLS.filter(p => p.linkedModules.some(m => m.target === target));
}

export function countProtocolSteps(protocol: ClinicalProtocol): number {
  return protocol.phases.reduce((total, phase) => total + phase.steps.length, 0);
}

export function countCriticalStops(protocol: ClinicalProtocol): number {
  return protocol.phases.reduce(
    (total, phase) => total + phase.steps.filter(s => s.criticalStop).length,
    0
  );
}

function textIncludesAny(haystack: string, needles?: string[]): string | null {
  if (!needles || needles.length === 0) return null;
  const lower = haystack.toLowerCase();
  const hit = needles.find(n => lower.includes(n.toLowerCase()));
  return hit || null;
}

/**
 * Decides whether a protocol applies to a patient and how specific that match
 * is. Universal protocols always apply; targeted protocols must match on
 * region, patient stage, age band and at least one clinical keyword.
 */
export function matchProtocolToPatient(
  protocol: ClinicalProtocol,
  patient: Patient
): ProtocolMatch | null {
  const app = protocol.applicability;
  const reasons: string[] = [];
  let score = 0;

  // Region gate
  if (app.regions !== 'all') {
    if (!app.regions.includes(patient.spineRegion)) return null;
    score += 25;
    reasons.push(`${patient.spineRegion.charAt(0).toUpperCase() + patient.spineRegion.slice(1)} spine case`);
  }

  // Patient journey stage gate
  if (app.statuses && app.statuses !== 'all') {
    if (!app.statuses.includes(patient.status)) return null;
    score += 10;
    reasons.push(`Active at "${patient.status}"`);
  }

  // Age band gate
  if (app.ageRange) {
    const { min, max } = app.ageRange;
    if (min !== undefined && patient.age < min) return null;
    if (max !== undefined && patient.age > max) return null;
    score += 10;
    reasons.push(`Age ${patient.age} within protocol band`);
  }

  if (app.universal) {
    score += 40;
    reasons.push('Applies to every spine surgical patient');
    return { protocol, relevanceScore: score, matchReasons: reasons };
  }

  // Clinical specificity gate — at least one clinical signal must match.
  const hasClinicalCriteria = Boolean(
    (app.procedureKeywords && app.procedureKeywords.length) ||
    (app.diagnosisKeywords && app.diagnosisKeywords.length) ||
    (app.approaches && app.approaches.length)
  );

  if (hasClinicalCriteria) {
    let clinicalHit = false;

    const procedureHit = textIncludesAny(patient.plannedProcedure || '', app.procedureKeywords);
    if (procedureHit) {
      clinicalHit = true;
      score += 30;
      reasons.push(`Planned procedure matches "${procedureHit}"`);
    }

    const diagnosisText = `${patient.primaryDiagnosis || ''} ${patient.secondaryDiagnosis || ''}`;
    const diagnosisHit = textIncludesAny(diagnosisText, app.diagnosisKeywords);
    if (diagnosisHit) {
      clinicalHit = true;
      score += 25;
      reasons.push(`Diagnosis matches "${diagnosisHit}"`);
    }

    if (app.approaches && app.approaches.includes(patient.approach)) {
      clinicalHit = true;
      score += 20;
      reasons.push(`Surgical approach: ${patient.approach}`);
    }

    if (!clinicalHit) return null;
  } else if (score === 0) {
    // No criteria at all and not universal — treat as library-only.
    return null;
  }

  return { protocol, relevanceScore: score, matchReasons: reasons };
}

/** All protocols applicable to this patient, most specific first. */
export function matchProtocolsToPatient(patient: Patient): ProtocolMatch[] {
  return ALL_CLINICAL_PROTOCOLS
    .map(p => matchProtocolToPatient(p, patient))
    .filter((m): m is ProtocolMatch => m !== null)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      return (
        PROTOCOL_CATEGORY_ORDER.indexOf(a.protocol.category) -
        PROTOCOL_CATEGORY_ORDER.indexOf(b.protocol.category)
      );
    });
}

export function getPatientProtocolCompliance(
  patient: Patient,
  protocolId: string
): PatientProtocolCompliance | undefined {
  return (patient.protocolCompliance || []).find(c => c.protocolId === protocolId);
}

export interface ProtocolProgress {
  totalSteps: number;
  completedSteps: number;
  notApplicableSteps: number;
  /** Percentage of applicable steps that are done (0–100). */
  percentComplete: number;
  criticalStopsOutstanding: number;
  status: ProtocolComplianceStatus;
}

export function computeProtocolProgress(
  protocol: ClinicalProtocol,
  compliance?: PatientProtocolCompliance
): ProtocolProgress {
  const allSteps = protocol.phases.flatMap(phase => phase.steps);
  const completed = new Set(compliance?.completedStepIds || []);
  const notApplicable = new Set(compliance?.notApplicableStepIds || []);

  const applicableSteps = allSteps.filter(s => !notApplicable.has(s.id));
  const completedSteps = applicableSteps.filter(s => completed.has(s.id)).length;
  const criticalStopsOutstanding = applicableSteps.filter(
    s => s.criticalStop && !completed.has(s.id)
  ).length;

  const percentComplete = applicableSteps.length
    ? Math.round((completedSteps / applicableSteps.length) * 100)
    : 100;

  let status: ProtocolComplianceStatus = 'Not Started';
  if (compliance?.status === 'Variance Documented') {
    status = 'Variance Documented';
  } else if (percentComplete === 100 && applicableSteps.length > 0) {
    status = 'Complete';
  } else if (completedSteps > 0 || notApplicable.size > 0) {
    status = 'In Progress';
  }

  return {
    totalSteps: allSteps.length,
    completedSteps,
    notApplicableSteps: notApplicable.size,
    percentComplete,
    criticalStopsOutstanding,
    status
  };
}

export function createEmptyCompliance(
  protocolId: string,
  authorName: string
): PatientProtocolCompliance {
  return {
    protocolId,
    completedStepIds: [],
    notApplicableStepIds: [],
    status: 'Not Started',
    lastUpdatedAt: new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST',
    lastUpdatedBy: authorName
  };
}

/** Headline counts for the protocol library, used by the hub header. */
export function getProtocolLibrarySummary() {
  return {
    totalProtocols: ALL_CLINICAL_PROTOCOLS.length,
    totalSteps: ALL_CLINICAL_PROTOCOLS.reduce((n, p) => n + countProtocolSteps(p), 0),
    totalCriticalStops: ALL_CLINICAL_PROTOCOLS.reduce((n, p) => n + countCriticalStops(p), 0),
    byCategory: PROTOCOL_CATEGORY_ORDER.map(category => ({
      category,
      count: getProtocolsByCategory(category).length
    }))
  };
}
