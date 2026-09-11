import type { PatientProtocolCompliance } from './protocol';

export type SpineRegion = 'cervical' | 'thoracic' | 'lumbar' | 'sacral';

export type SurgeonTier =
  | 'CONSULTANT_SPINE_SURGEON'
  | 'JUNIOR_CONSULTANT'
  | 'SENIOR_REGISTRAR'
  | 'JUNIOR_REGISTRAR'
  | 'DIRECTOR_QUALITY';

export interface SurgeonUser {
  id: string;
  name: string;
  formalName: string;
  designation: string;
  governanceRole?: string;
  tier: SurgeonTier;
  tierLabel: string;
  hierarchyRank: number; // 1 = Consultant, 2 = Junior Consultant, 3 = Senior Registrar, 4 = Junior Registrar
  department: string;
  email: string;
  username: string;
  password: string;
  pin: string;
  initials: string;
  color: string;
  canApproveOTNotes: boolean;
  canFinalizeDischarge: boolean;
  canPrescribeRestrictedMeds: boolean;
  canSignAsPrimarySurgeon: boolean;
  canPerformWardRounds: boolean;
}

export interface DataEntryAttribution {
  enteredByName: string;
  enteredByDesignation: string; // e.g. "Dr. Kishan Naresh Panjwani, Junior Registrar (Spine Surgery)"
  enteredAt: string;            // e.g. "09-Sep-2026 14:15 IST"
  staffTier: SurgeonTier;
  verifiedByConsultant?: string;// e.g. "Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery"
  verifiedAt?: string;          // e.g. "09-Sep-2026 15:30 IST"
  verificationStatus: 'Pending Consultant Review' | 'Verified by Consultant' | 'Approved & Locked';
}

export type SpineLevel =
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7'
  | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9' | 'T10' | 'T11' | 'T12'
  | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
  | 'S1';

export type SpineDiscLevel =
  | 'C1-C2' | 'C2-C3' | 'C3-C4' | 'C4-C5' | 'C5-C6' | 'C6-C7' | 'C7-T1'
  | 'T1-T2' | 'T2-T3' | 'T3-T4' | 'T4-T5' | 'T5-T6' | 'T6-T7' | 'T7-T8' | 'T8-T9' | 'T9-T10' | 'T10-T11' | 'T11-T12' | 'T12-L1'
  | 'L1-L2' | 'L2-L3' | 'L3-L4' | 'L4-L5' | 'L5-S1';

export type SurgicalApproach = 
  | 'Posterior (Open)'
  | 'Posterior (MIS / Tubular)'
  | 'Anterior (Smith-Robinson ACDF)'
  | 'Anterior Retroperitoneal (ALIF)'
  | 'Lateral Transpsoas / Oblique (XLIF / OLIF)'
  | 'Percutaneous Endoscopic (PECD / PELD)'
  | 'Combined Anterior-Posterior';

export type PatientStatus = 
  | 'Pre-Op Evaluation'
  | 'Scheduled for Surgery'
  | 'In Operating Room'
  | 'Post-Op Day 0'
  | 'Post-Op Day 1'
  | 'Post-Op Day 2'
  | 'Post-Op Day 3+'
  | 'Discharged'
  | 'Follow-Up Clinic';

export interface ImplantRecord {
  id: string;
  type: 'Pedicle Screw' | 'Interbody Cage' | 'Anterior Plate' | 'Cervical Screw' | 'Connecting Rod' | 'Cross-Link' | 'Artificial Disc' | 'Cement / Spacer';
  level: string;
  side?: 'Left' | 'Right' | 'Bilateral' | 'Midline';
  dimensions: string; // e.g. "6.5 x 45mm", "10mm x 28mm 4° lordosis"
  material: 'Titanium' | 'PEEK' | 'Cobalt-Chrome' | '3D Porous Titanium' | 'Composite';
  manufacturer: string;
  lotNumber?: string;
}

export interface NeuromonitoringData {
  modality: ('MEP' | 'SSEP' | 'Free-Run EMG' | 'Triggered EMG')[];
  baselineEstablished: boolean;
  baselineNotes: string;
  intraopEvents: string;
  closingStatus: 'Stable Baseline' | 'Transient Drop Recovered' | 'Persistent Deficit' | 'Not Used';
  technologistName?: string;
}

export interface OperativeNote {
  id: string;
  surgeryDate: string;
  startTime: string;
  endTime: string;
  primarySurgeon: string;
  assistantSurgeon?: string;
  anesthesiologist: string;
  scrubNurse?: string;
  preOpDiagnosis: string;
  postOpDiagnosis: string;
  procedureName: string;
  icd10Codes: string[];
  operativeLevels: string[];
  approach: SurgicalApproach;
  anesthesiaType: string;
  position: string;
  
  // Surgical Details
  incisionDetails: string;
  cArmConfirmation: boolean;
  fluorescopyTimeSec: number;
  radiationDoseDAP?: string; // mGy.cm2
  microscopeUsed: boolean;
  microscopeModel?: string;
  navigationOrRobotics?: string;
  
  // Steps & Narrative
  decompressionDetails: string;
  discectomyDetails?: string;
  interbodyFusionDetails?: string;
  instrumentationDetails: string;
  boneGraftUsed: string; // Autologous local bone graft, DBM, BMP-2, etc.
  duralIntegrity: 'Intact - No tear' | 'Dural tear repaired primarily with 5-0 Prolene + Fibrin glue' | 'Dural patch applied';
  hemostasisAndClosure: string;
  stepConfirmations?: Record<string, boolean>;
  
  // Quantitative metrics
  estimatedBloodLossMl: number;
  bloodProductsTransfused?: string;
  fluidsAdministeredMl?: number;
  urineOutputMl?: number;
  drainsPlaced: string; // e.g. "1x 10Fr negative suction Hemovac drain"
  specimensSent?: string;
  
  implants: ImplantRecord[];
  neuromonitoring: NeuromonitoringData;
  complications: string;
  immediatePostOpPlan: string;
  surgeonSignature: string;
  isLocked: boolean;
  entryAttribution?: DataEntryAttribution;
}

export interface MedicationItem {
  id: string;
  drugName: string;
  genericName: string;
  dosage: string;
  route: string;
  frequency: string;
  durationDays: number;
  instructions: string; // "After food", "Avoid NSAID in fusion", "Empty stomach", etc.
  category: 'Analgesic' | 'Neuropathic Pain' | 'Muscle Relaxant' | 'Gastroprotection' | 'DVT Prophylaxis' | 'Antibiotic' | 'Bone Health' | 'Laxative' | 'Steroid Taper';
  isPreselected?: boolean;
}

export interface PrescriptionBundle {
  id: string;
  bundleName: string;
  description: string;
  applicableProcedures: string[];
  medications: MedicationItem[];
}

export interface WardRoundEntry {
  id: string;
  date: string;
  time: string;
  postOpDay: string; // "POD 0", "POD 1", "POD 2", etc.
  author: string;
  vitals: {
    bloodPressure: string;
    pulse: number;
    spo2: number;
    temperature: number;
  };
  drainOutput24hMl: number;
  drainStatus: 'Active Suction' | 'Gravity' | 'Clamped' | 'Removed Today' | 'No Drain';
  woundStatus: 'Clean, dry, intact dressing' | 'Minimal serosanguinous soakage' | 'Sutures clean' | 'Redness / Induration';
  motorExam: string; // e.g. "Bilateral EHL 5/5, TA 5/5, Quadriceps 5/5"
  sensoryExam: string; // e.g. "Dermatomes L4, L5, S1 intact bilaterally"
  mobilizationStatus: 'Bed rest / Log rolling' | 'Sitting on edge of bed' | 'Standing with high walker' | 'Walking independently with LSO brace' | 'Climbing stairs';
  bowelBladder: string;
  painScoreVAS: number; // 0-10
  plan: string;
  entryAttribution?: DataEntryAttribution;
}

export interface WHOSpineSafetyChecklist {
  id: string;
  // Sign In (Before induction of anesthesia)
  patientConfirmedIdentityAndSite: boolean;
  spinalLevelMarkedOnSkin: boolean;
  anesthesiaMachineAndMedsChecked: boolean;
  pulseOximeterFunctioning: boolean;
  knownAllergy: boolean;
  allergyDetails?: string;
  difficultAirwayRisk: boolean;
  bloodLossRiskGt500ml: boolean;
  ivAccess2LargeBoreConfirmed: boolean;
  
  // Time Out (Before skin incision)
  allTeamMembersIntroduced: boolean;
  surgeonAnesthetistNurseConfirmPatient: boolean;
  spinalLevelConfirmedUnderFluoroscopy: boolean;
  surgicalApproachAndLevelsAgreed: boolean;
  implantsAndSizesVerifiedInRoom: boolean;
  antibioticProphylaxisGivenWithin60Min: boolean;
  neuromonitoringLeadsActiveAndBaselineChecked: boolean;
  specialImagingDisplayedOnORScreen: boolean;
  
  // Sign Out (Before patient leaves OR)
  procedureRecordedName: boolean;
  instrumentSpongeNeedleCountCorrect: boolean;
  specimenLabeledCorrectly: boolean;
  equipmentIssuesAddressed: boolean;
  postOpRecoveryAndNeuroExamConcernsDiscussed: boolean;
  
  completedBy: string;
  completedAt: string;
  entryAttribution?: DataEntryAttribution;
}

export interface NeurologicalAssessment {
  id: string;
  assessmentDate: string;
  timing: 'Pre-Op' | 'Post-Op Day 1' | 'At Discharge' | '6-Week Followup';
  examiner: string;
  
  // Lower Limb Motor (0-5)
  motorPower: {
    hipFlexionL2: { left: number; right: number };
    kneeExtensionL3: { left: number; right: number };
    ankleDorsiflexionL4: { left: number; right: number };
    greatToeExtensionL5: { left: number; right: number };
    anklePlantarflexionS1: { left: number; right: number };
    // Upper Limb Motor (for cervical)
    deltoidC5?: { left: number; right: number };
    bicepsC6?: { left: number; right: number };
    tricepsC7?: { left: number; right: number };
    fingerFlexorsC8?: { left: number; right: number };
    interosseiT1?: { left: number; right: number };
  };
  
  sensoryScores: {
    [level: string]: 'Normal' | 'Impaired' | 'Absent';
  };
  
  reflexes: {
    kneeJerk: '0 (Absent)' | '1+ (Hypoactive)' | '2+ (Normal)' | '3+ (Brisk)' | '4+ (Clonus)';
    ankleJerk: '0 (Absent)' | '1+ (Hypoactive)' | '2+ (Normal)' | '3+ (Brisk)' | '4+ (Clonus)';
    plantarReflex: 'Flexor (Normal)' | 'Equivocal' | 'Extensor (Babinski Positive)';
    hoffmanSign?: 'Negative' | 'Positive';
  };
  
  sphincterControl: 'Normal Continence' | 'Hesitancy' | 'Urinary Retention' | 'Incontinence' | 'Indwelling Catheter';
  
  // Scores
  vasBackPain: number; // 0-10
  vasLegPain: number; // 0-10
  vasNeckPain?: number; // 0-10
  vasArmPain?: number; // 0-10
  odiPercentage?: number; // 0-100%
  ndiPercentage?: number; // 0-100%
  mJOAScore?: number; // 0-17
  nurickGrade?: number; // 0-5
  walkingToleranceMeters: number;
  entryAttribution?: DataEntryAttribution;
}

export interface DischargeSummary {
  id: string;
  dischargeDate: string;
  summaryAuthor: string;
  admissionDate: string;
  surgeryDate: string;
  hospitalCourseSummary: string;
  operativeSummaryBrief: string;
  implantsSummary: string;
  
  // Physical & Neuro Status at Discharge
  dischargeNeuroStatus: string;
  woundConditionAtDischarge: string;
  sutureRemovalDate: string;
  drainRemovalDateAndTotal: string;
  mobilityAtDischarge: string; // e.g. "Ambulatory with walker and LSO rigid brace"
  
  // Patient Guidance & Spine Ergonomics
  braceInstructions: string; // "LSO brace to be worn at all times while sitting or walking for 6 weeks"
  spinalPrecautions: string[]; // Log-rolling, no bending at waist, no lifting > 3kg, no twisting
  redFlagWarnings: string[]; // Cauda equina (loss of bladder control), new weakness, fever > 101F, clear fluid wound leak
  
  // Discharge Medications
  medications: MedicationItem[];
  
  // Follow Up
  firstFollowUpDate: string;
  emergencyContact: string;
  dischargeStatus: 'Ready for Home' | 'Transfer to Rehab' | 'Signed and Finalized';
  surgeonSignature: string;
  entryAttribution?: DataEntryAttribution;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  roomBed: string;
  contactNumber: string;
  attendingSurgeon: string;
  fellowOrResident?: string;
  admissionDate: string;
  plannedOrSurgeryDate: string;
  status: PatientStatus;
  
  // Clinical Diagnosis & Spine Data
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  spineRegion: SpineRegion;
  affectedLevels: SpineLevel[];
  affectedDiscs: SpineDiscLevel[];
  plannedProcedure: string;
  approach: SurgicalApproach;
  
  // Sub-documents
  operativeNote?: OperativeNote;
  dischargeSummary?: DischargeSummary;
  prescriptions: MedicationItem[];
  wardRounds: WardRoundEntry[];
  checklist?: WHOSpineSafetyChecklist;
  assessments: NeurologicalAssessment[];
  /** Per-protocol execution records from the Clinical Protocols module. */
  protocolCompliance?: PatientProtocolCompliance[];
  
  avatarColor: string;
  notes?: string;
  entryAttribution?: DataEntryAttribution;
  departmentConnectors?: PatientDepartmentConnectors;
}

// ==========================================
// INTER-DEPARTMENTAL PATIENT CONNECTORS
// ==========================================

export interface ConnectorStaffStamp {
  staffId?: string;
  name: string;
  designation: string;
  unit: string;
  contact?: string;
  timestamp: string;
}

export interface AdmissionsConnectorData {
  uhid: string;
  ipdNumber: string;
  admissionType: 'Planned Elective' | 'Emergency / Acute Cauda Equina' | 'Transfer from ICU';
  bedLocation: string;
  wardUnit: string;
  payerType: 'TPA / Cashless Insurance' | 'Private Cash' | 'Ayushman Bharat PMJAY' | 'Corporate PSU';
  tpaName?: string;
  preAuthStatus: 'Approved' | 'Query Raised' | 'Under Review' | 'Not Applicable (Self-Pay)';
  approvedAmount?: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  admissionVitals: {
    bloodPressure: string;
    pulse: number;
    spo2: number;
    weightKg: number;
    heightCm: number;
  };
  handoverNotes: string;
  recordedBy: ConnectorStaffStamp;
}

export interface NursingStationConnectorData {
  floorStation: '4th Floor Ward' | '5th Floor Deluxe' | '6th Floor Suite' | 'HDU / Step Down ICU';
  currentVitals: {
    bloodPressure: string;
    pulse: number;
    temperature: number;
    spo2: number;
    respiratoryRate: number;
    vasPainScore: number; // 0-10
    bloodSugarRandomMgDl: number;
  };
  preOpStatus: {
    skinPreparationDone: boolean;
    surgicalSiteMarked: boolean;
    npoStrictlyMaintainedSince: string;
    ivLineSiteAndGauge: string;
    denturesRemoved: boolean;
    preOpVitalsVerified: boolean;
    bloodReserveArranged: boolean;
  };
  postOpCare: {
    hourlyNeurovascularCheck: string; // e.g. "Bilateral EHL & FHL 5/5, Dorsalis Pedis palpable, sensations intact"
    foleyCatheterStatus: string;
    activeDrainsStatus: string;
    incisionDressingCondition: string;
    patientPositionLog: string;
  };
  nurseAlerts: string[];
  recordedBy: ConnectorStaffStamp;
}

export interface RadiologyConnectorData {
  mriStudyId: string;
  mriSpineProtocol: string;
  mriReportSummary: string;
  stenosisSeverity: 'Mild' | 'Moderate' | 'Severe Central Canal Stenosis' | 'Lateral Recess & Foraminal Stenosis';
  discPathology: string;
  spondylolisthesisGrade?: string;
  cordSignalChange: 'None' | 'T2 Hyperintensity (Myelomalacia)' | 'Subacute Cord Contusion';
  xRayFlexionExtension: string;
  cArmFluoroDosimetryDAP?: string;
  pacsViewerUrl: string;
  radiologistInterpretation: string;
  recordedBy: ConnectorStaffStamp;
}

export interface PACAnesthesiaConnectorData {
  asaPhysicalStatus: 'ASA I' | 'ASA II' | 'ASA III' | 'ASA IV' | 'ASA E (Emergency)';
  mallampatiScore: 'Class I' | 'Class II' | 'Class III' | 'Class IV';
  airwayAssessment: string;
  cardiacClearanceSummary: string;
  physicianMedicalClearance: string;
  crossMatchedBloodUnits: string; // "2 Units Packed Red Cells reserved in Blood Bank"
  plannedAnesthesiaType: string;
  pronePositionClearance: 'Fit for Prone Operative Position' | 'Caution: Cervical Spine Fragility / Airway Risk';
  specialMonitoringRequired: string; // "Arterial Line, Dual Large Bore IV, CVP"
  pacFitnessStatus: 'Fit for Spine Surgery' | 'Fit with High Anesthetic Risk' | 'Deferred pending investigations';
  recordedBy: ConnectorStaffStamp;
}

export interface CSSDOperatingTheatreConnectorData {
  assignedTheatre: 'OT 1 (Complex Deformity)' | 'OT 2 (MIS & Endoscopy)' | 'OT 3 (Microdiscectomy)' | 'OT 4 (Endoscopy & Daycare)' | 'OT 5 (Trauma)' | 'OT 6 (Elective Spine)';
  sterileSetBatchNo: string;
  autoclaveIndicatorStatus: 'Class 5 Chemical Indicator PASSED' | 'Biological Indicator Validated' | 'In Process';
  spinalImplantsConsignment: string; // "Verified with Vendor: Medtronic CD Horizon Screws & PEEK Cages on site"
  microscopeStatus: 'Zeiss KINEVO 900 Calibrated & Draped' | 'Leica PROvido Checked' | 'Loupes (4.5x)';
  neuromonitoringLeadStatus: 'NIM-Eclipse 32-Channel MEP/SSEP calibrated';
  scrubNurseAssigned: string;
  otTechnicianAssigned: string;
  recordedBy: ConnectorStaffStamp;
}

export interface PharmacyConnectorData {
  surgicalProphylaxisAntibiotic: string; // "Inj. Cefuroxime 1.5g IV stat given 30 mins pre-incision"
  anticoagulantProtocol: string; // "Ecosprin held 5 days prior. LMWH (Enoxaparin 40mg) scheduled POD 1 evening"
  dvtRiskAssessment: 'Moderate (Caprini 3-4)' | 'High Risk (Caprini > 5) - Compression stockings + Chemoprophylaxis';
  implantBoneGraftDispensed: string; // "Infuse Bone Graft (rhBMP-2) & FloSeal Hemostatic Matrix issued"
  currentInpatientMedsCount: number;
  stockAvailabilityAlerts: string[];
  recordedBy: ConnectorStaffStamp;
}

export interface PhysiotherapyConnectorData {
  preOpFunctionalBaseline: {
    walkingToleranceMeters: number;
    gaitPattern: string; // "Antalgic gait with neurogenic claudication at 50 meters"
    lumbarSpineRangeOfMotion: string;
    preOpOswestryPercentage: number;
  };
  postOpMobilizationMilestones: {
    day1LogRollMastered: boolean;
    bedsideSittingToleranceMins: number;
    assistedWalkerAmbulationMeters: number;
    orthoticBracePrescribed: string; // "Custom LSO Rigid Brace / Philadelphia Collar fitted"
    homeErgonomicsCounselled: boolean;
  };
  rehabilitationInstructions: string;
  recordedBy: ConnectorStaffStamp;
}

export interface FinanceBillingConnectorData {
  totalEstimatedPackageRate: number;
  tpaApprovedAmount: number;
  patientCoPayOrDeposit: number;
  interimBillAmount: number;
  billingClearanceForDischarge: 'Cleared for Discharge' | 'Interim Audit Pending' | 'Awaiting TPA Settlement Letter';
  insuranceClaimNumber?: string;
  recordedBy: ConnectorStaffStamp;
}

export interface ClinicalResearchConnectorData {
  stavyaSpineRegistryId: string;
  trialEnrollmentName?: string;
  patientConsentObtained: boolean;
  promsBaseline: {
    vasBackPain: number;
    vasLegPain: number;
    odiDisabilityIndex: number;
    eq5dQualityOfLife: number;
  };
  scheduledRegistryFollowUps: string[];
  recordedBy: ConnectorStaffStamp;
}

export interface PatientDepartmentConnectors {
  admissions: AdmissionsConnectorData;
  nursing: NursingStationConnectorData;
  radiology: RadiologyConnectorData;
  pacAnesthesia: PACAnesthesiaConnectorData;
  cssdOt: CSSDOperatingTheatreConnectorData;
  pharmacy: PharmacyConnectorData;
  physiotherapy: PhysiotherapyConnectorData;
  financeBilling: FinanceBillingConnectorData;
  clinicalResearch: ClinicalResearchConnectorData;
}

