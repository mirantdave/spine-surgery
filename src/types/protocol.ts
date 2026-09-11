import type { SpineRegion, SurgicalApproach, PatientStatus, DataEntryAttribution } from './spine';

// ============================================================================
// STAVYA SPINE SURGERY — CLINICAL PROTOCOL LIBRARY TYPE MODEL
// Institutional standard operating protocols spanning the entire spine
// surgical continuum: pre-operative workup, intra-operative conduct,
// post-operative care, complication escalation, discharge and follow-up.
// ============================================================================

export type ProtocolCategory =
  | 'Pre-Operative'
  | 'Intra-Operative'
  | 'Post-Operative'
  | 'Complication & Emergency'
  | 'Discharge & Follow-Up'
  | 'Special Population';

/** Strength of the underlying published evidence supporting the protocol. */
export type ProtocolEvidenceGrade =
  | 'Grade A (Level I Evidence)'
  | 'Grade B (Level II-III Evidence)'
  | 'Grade C (Level IV Evidence)'
  | 'Institutional Consensus';

/** How binding the protocol is on the treating team. */
export type ProtocolPriority =
  | 'Mandatory'
  | 'Strongly Recommended'
  | 'Conditional'
  | 'Emergency Response';

/** Deep links from a protocol step into the corresponding chart module. */
export type ProtocolModuleTarget =
  | 'pathway'
  | 'reports'
  | 'ot-note'
  | 'inpatient:rounds'
  | 'inpatient:prescriptions'
  | 'inpatient:neuro-exam'
  | 'inpatient:who-checklist'
  | 'discharge'
  | 'connectors'
  | 'anatomy';

export interface ProtocolModuleLink {
  target: ProtocolModuleTarget;
  label: string;
}

export interface ProtocolStep {
  id: string;
  /** When the step must happen, e.g. "T-60 min", "POD 1, 08:00", "Within 30 min of alert". */
  timing: string;
  action: string;
  /** Role accountable for executing and signing the step. */
  responsible: string;
  detail?: string;
  /** Hard stop — surgery/escalation must not proceed until satisfied. */
  criticalStop?: boolean;
}

export interface ProtocolPhase {
  id: string;
  title: string;
  description?: string;
  steps: ProtocolStep[];
}

export interface ProtocolDrugSpec {
  drug: string;
  dose: string;
  route: string;
  timing: string;
  notes?: string;
}

/** Objective trigger → mandated action pairs (escalation thresholds). */
export interface ProtocolThreshold {
  parameter: string;
  trigger: string;
  action: string;
  severity?: 'Watch' | 'Escalate' | 'Critical';
}

export interface ProtocolAuditMetric {
  metric: string;
  target: string;
}

export interface ProtocolApplicability {
  /** 'all' applies to every spine region. */
  regions: SpineRegion[] | 'all';
  approaches?: SurgicalApproach[];
  /** Case-insensitive substrings matched against the planned procedure. */
  procedureKeywords?: string[];
  /** Case-insensitive substrings matched against primary/secondary diagnosis. */
  diagnosisKeywords?: string[];
  /** Patient journey stages at which the protocol is live. */
  statuses?: PatientStatus[] | 'all';
  ageRange?: { min?: number; max?: number };
  /** Universal protocols that apply to every spine patient regardless of case. */
  universal?: boolean;
}

export interface ClinicalProtocol {
  id: string;
  /** Institutional document code, e.g. "STV-SP-PRE-02". */
  code: string;
  title: string;
  shortLabel: string;
  category: ProtocolCategory;
  summary: string;
  priority: ProtocolPriority;
  evidenceGrade: ProtocolEvidenceGrade;
  version: string;
  effectiveFrom: string;
  nextReviewDue: string;
  owner: string;
  applicability: ProtocolApplicability;
  indications: string[];
  contraindications?: string[];
  phases: ProtocolPhase[];
  drugSpecs?: ProtocolDrugSpec[];
  thresholds?: ProtocolThreshold[];
  redFlags?: string[];
  /** What must be charted in this EMR for the protocol to be auditable. */
  documentation: string[];
  linkedModules: ProtocolModuleLink[];
  references: string[];
  auditMetrics?: ProtocolAuditMetric[];
}

export type ProtocolComplianceStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Complete'
  | 'Variance Documented';

/** Per-patient execution record for a single protocol. */
export interface PatientProtocolCompliance {
  protocolId: string;
  completedStepIds: string[];
  notApplicableStepIds: string[];
  status: ProtocolComplianceStatus;
  varianceNote?: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  entryAttribution?: DataEntryAttribution;
}

/** A protocol paired with why the engine surfaced it for this patient. */
export interface ProtocolMatch {
  protocol: ClinicalProtocol;
  /** Higher = more specific to this patient's case. */
  relevanceScore: number;
  matchReasons: string[];
}
