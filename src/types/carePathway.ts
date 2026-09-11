export type PathwayDayId = 'day-minus-1' | 'day-0' | 'day-1' | 'day-2' | 'day-3';

export type PathwayDayPhase = 
  | 'Pre-Op & Admission'
  | 'Day of Surgery (DOS)'
  | 'Post-Op Day 1 (POD 1)'
  | 'Post-Op Day 2 (POD 2)'
  | 'Discharge & Home Transition (POD 3+)';

export type PathwayDayStatus = 'Completed' | 'In Progress' | 'Upcoming';

export interface PathwayGoalItem {
  id: string;
  category: 'clinical' | 'nursing' | 'physiotherapy' | 'medication' | 'diagnostics';
  title: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface PathwayDayRecord {
  id: PathwayDayId;
  dayNumber: number; // -1, 0, 1, 2, 3
  dayLabel: string;  // e.g. "Day -1", "Day 0 (DOS)", "POD 1", "POD 2", "POD 3+"
  title: string;     // e.g. "Pre-Op Evaluation & Workup"
  phase: PathwayDayPhase;
  date: string;
  status: PathwayDayStatus;
  
  vitals: {
    bloodPressure: string;
    pulse: number;
    temperature?: number;
    spo2: number;
    vasPainScore: number; // 0-10
  };
  
  drainOutputMl?: number;
  drainStatus?: string;
  mobilityStatus: string;
  dietStatus: string;
  
  goals: PathwayGoalItem[];
  
  clinicalNotes: string;
  attendingStaff: {
    name: string;
    designation: string;
    department: string;
  }[];
}

// ============================================================================
// CLINICAL REPORTS INTERFACES
// ============================================================================

export type ReportCategory = 
  | 'radiology'
  | 'laboratory'
  | 'pac'
  | 'implants'
  | 'histopathology';

export interface LabTestValue {
  name: string;
  preOp?: string | number;
  pod1?: string | number;
  pod2?: string | number;
  unit: string;
  referenceRange: string;
  flag?: 'normal' | 'low' | 'high' | 'critical';
}

export interface ClinicalReportItem {
  id: string;
  title: string;
  category: ReportCategory;
  date: string;
  status: 'Final' | 'Preliminary' | 'Verified';
  doctorName: string;
  doctorDesignation: string;
  summary: string;
  findings?: string[];
  impression?: string;
  labValues?: LabTestValue[];
  specifications?: Record<string, string>;
  pacsViewerUrl?: string;
}
