import { PathwayDayRecord, ClinicalReportItem } from '../types/carePathway';
import { Patient } from '../types/spine';

export function getPatientCarePathway(patient: Patient): PathwayDayRecord[] {
  const isCervical = patient.spineRegion === 'cervical';
  const isScoliosis = patient.plannedProcedure.toLowerCase().includes('scoliosis');
  const isMicrodiscectomy = patient.plannedProcedure.toLowerCase().includes('microscopic');

  // Base admission date and day progression
  const surgDate = patient.plannedOrSurgeryDate || '2026-09-07';

  return [
    {
      id: 'day-minus-1',
      dayNumber: -1,
      dayLabel: 'Day -1',
      title: 'Admission, Diagnostics & Pre-Op Optimization',
      phase: 'Pre-Op & Admission',
      date: '06-Sep-2026',
      status: 'Completed',
      vitals: {
        bloodPressure: '124/80 mmHg',
        pulse: 74,
        temperature: 98.4,
        spo2: 99,
        vasPainScore: 7
      },
      mobilityStatus: isScoliosis ? 'Ambulatory, structural deformity' : 'Ambulatory < 50m with neurogenic claudication',
      dietStatus: 'Normal dinner, strict NPO from 24:00 (Midnight)',
      clinicalNotes: 'Patient admitted to Spine Ward. Comprehensive baseline spine examination completed. All imaging cross-referenced. Pre-anesthesia fitness approved.',
      attendingStaff: [
        { name: 'Dr. Hardik Suthar', designation: 'Senior Registrar (Spine Surgery)', department: 'Clinical Spine' },
        { name: 'Sister Anita Gohel', designation: 'Senior Staff Nurse', department: 'Inpatient Nursing' },
        { name: 'Dr. Kashyap Rameshchandra Shah', designation: 'Consultant Anesthesiologist', department: 'Anesthesia' }
      ],
      goals: [
        { id: 'g-1', category: 'diagnostics', title: 'MRI & Flexion/Extension X-Rays reviewed by attending consultant', completed: true, completedBy: 'Dr. Bharat Dave' },
        { id: 'g-2', category: 'clinical', title: 'Pre-Anesthesia PAC Medical Clearance & Airway evaluation cleared', completed: true, completedBy: 'Dr. Kashyap Shah' },
        { id: 'g-3', category: 'clinical', title: 'Informed surgical consent signed and operative spine level marked', completed: true, completedBy: 'Dr. Hardik Suthar' },
        { id: 'g-4', category: 'medication', title: '2 Units Packed Red Cells crossmatched & reserved in Blood Bank', completed: true, completedBy: 'Blood Bank' },
        { id: 'g-5', category: 'physiotherapy', title: 'Pre-hab log-roll orientation & deep breathing spirometry taught', completed: true, completedBy: 'Dr. Parth Joshi (PT)' },
        { id: 'g-6', category: 'nursing', title: 'Skin prep, surgical bath, and NPO status verified', completed: true, completedBy: 'Sister Anita Gohel' }
      ]
    },
    {
      id: 'day-0',
      dayNumber: 0,
      dayLabel: 'Day 0 (DOS)',
      title: 'Operating Room Execution & PACU Stabilization',
      phase: 'Day of Surgery (DOS)',
      date: '07-Sep-2026',
      status: 'Completed',
      vitals: {
        bloodPressure: '118/76 mmHg',
        pulse: 78,
        temperature: 98.2,
        spo2: 98,
        vasPainScore: 4
      },
      drainOutputMl: isMicrodiscectomy ? 0 : 40,
      drainStatus: isMicrodiscectomy ? 'No drain' : 'Negative suction Hemovac active',
      mobilityStatus: 'Bed rest with 2-hourly log-roll protocol. Bilateral active ankle pumps initiated.',
      dietStatus: 'Sips of water at 4 hours post-op, progressed to soft diet as tolerated.',
      clinicalNotes: `${patient.plannedProcedure} executed uneventfully. Continuous MEP/SSEP baseline 100% stable throughout. Implants confirmed on biplanar fluoroscopy. Extubated smoothly in OR.`,
      attendingStaff: [
        { name: patient.attendingSurgeon, designation: 'Chief Spine Surgeon', department: 'Spine Surgery' },
        { name: 'Dr. Kashyap Rameshchandra Shah', designation: 'Consultant Anesthesiologist', department: 'Anesthesia' },
        { name: 'Gopalbhai Prajapati', designation: 'OT Scrub Specialist', department: 'Operating Theatres' }
      ],
      goals: [
        { id: 'g-7', category: 'clinical', title: 'WHO Surgical Safety Checklist Sign-In, Time-Out & Sign-Out completed', completed: true, completedBy: 'OT Team' },
        { id: 'g-8', category: 'clinical', title: 'Intraoperative neuromonitoring baseline verified stable upon closing', completed: true, completedBy: 'Ravi Kumar, CNIM' },
        { id: 'g-9', category: 'clinical', title: 'Fluoroscopic verification of pedicle screws / cage alignment stored', completed: true, completedBy: patient.attendingSurgeon },
        { id: 'g-10', category: 'nursing', title: 'Immediate PACU neurological assessment: Bilateral EHL/TA 5/5, sensations intact', completed: true, completedBy: 'Sister Vaishali' },
        { id: 'g-11', category: 'medication', title: 'Post-op IV multi-modal analgesia & antibiotic prophylaxis administered', completed: true, completedBy: 'Ward Nursing' }
      ]
    },
    {
      id: 'day-1',
      dayNumber: 1,
      dayLabel: 'POD 1',
      title: 'Consultant Morning Round, Log-Roll & Supported Ambulation',
      phase: 'Post-Op Day 1 (POD 1)',
      date: '08-Sep-2026',
      status: 'Completed',
      vitals: {
        bloodPressure: '122/78 mmHg',
        pulse: 74,
        temperature: 98.4,
        spo2: 99,
        vasPainScore: 3
      },
      drainOutputMl: isMicrodiscectomy ? 0 : 65,
      drainStatus: isMicrodiscectomy ? 'No drain' : 'Active suction (Serosanguinous)',
      mobilityStatus: isCervical 
        ? 'Ambulatory with soft collar, independent sitting and walking'
        : 'Out of bed: Log-roll mastered, bedside sitting 30 mins, walked 45 meters with walker & LSO brace',
      dietStatus: 'Full regular diet with high protein and dietary fiber',
      clinicalNotes: 'First post-op consultant ward round. Wound dressing dry and clean. Pre-op radicular leg pain completely resolved. Post-op check X-ray confirmed pristine construct alignment.',
      attendingStaff: [
        { name: 'Dr. Arijit Vashishtha', designation: 'Senior Registrar (Spine Surgery)', department: 'Clinical Spine' },
        { name: 'Dr. Parth Joshi', designation: 'Senior Spine Physiotherapist', department: 'Physiotherapy' },
        { name: 'Sister Bhavna Parmar', designation: 'Staff Nurse', department: 'Inpatient Ward' }
      ],
      goals: [
        { id: 'g-12', category: 'clinical', title: 'Consultant Spine Ward Round & physical neuro check completed', completed: true, completedBy: 'Dr. Arijit Vashishtha' },
        { id: 'g-13', category: 'diagnostics', title: 'Post-operative check X-Rays (AP & Lateral) completed & archived in PACS', completed: true, completedBy: 'Radiology' },
        { id: 'g-14', category: 'physiotherapy', title: 'Assisted ambulation with walker & orthotic brace fitted', completed: true, completedBy: 'Dr. Parth Joshi (PT)' },
        { id: 'g-15', category: 'medication', title: 'Step-down from IV analgesics to oral spine medication protocol', completed: true, completedBy: 'Dr. Kishan Panjwani' },
        { id: 'g-16', category: 'nursing', title: '24-hour drain output measured & logged in surgical records', completed: true, completedBy: 'Sister Bhavna' }
      ]
    },
    {
      id: 'day-2',
      dayNumber: 2,
      dayLabel: 'POD 2',
      title: 'Drain & Foley Removal, Independent Ambulation & Lab Audit',
      phase: 'Post-Op Day 2 (POD 2)',
      date: '09-Sep-2026',
      status: patient.status.includes('Day 2') ? 'In Progress' : 'Completed',
      vitals: {
        bloodPressure: '120/78 mmHg',
        pulse: 72,
        temperature: 98.2,
        spo2: 99,
        vasPainScore: 2
      },
      drainOutputMl: isMicrodiscectomy ? 0 : 20,
      drainStatus: isMicrodiscectomy ? 'No drain' : 'Criteria met (< 30ml/24h) - Drain Removed',
      mobilityStatus: 'Independent walker ambulation > 120 meters. Stair climbing trial (1 flight) completed.',
      dietStatus: 'Regular oral diet with adequate hydration',
      clinicalNotes: 'Drain removed aseptically after satisfying output criteria. Foley catheter removed; patient voided spontaneously with zero retention. Post-op blood investigations (Hb: 11.9 g/dL, CRP on downward trend).',
      attendingStaff: [
        { name: patient.attendingSurgeon, designation: 'Chief Spine Surgeon', department: 'Spine Surgery' },
        { name: 'Dr. Kishan Naresh Panjwani', designation: 'Junior Registrar (Spine Surgery)', department: 'Clinical Spine' },
        { name: 'Sister Anita Gohel', designation: 'Senior Staff Nurse', department: 'Inpatient Ward' }
      ],
      goals: [
        { id: 'g-17', category: 'clinical', title: 'Surgical drain removal under aseptic technique (output < 30ml)', completed: true, completedBy: 'Dr. Kishan Panjwani' },
        { id: 'g-18', category: 'nursing', title: 'Indwelling urinary catheter removed; spontaneous voiding confirmed', completed: true, completedBy: 'Sister Anita' },
        { id: 'g-19', category: 'physiotherapy', title: 'Independent ambulation & stair-navigation milestones cleared', completed: true, completedBy: 'Dr. Parth Joshi (PT)' },
        { id: 'g-20', category: 'diagnostics', title: 'Post-op CBC and CRP blood audit verified within acceptable parameters', completed: true, completedBy: 'Dr. Shailesh Shah' },
        { id: 'g-21', category: 'clinical', title: 'Spine ergonomics briefing & home precautions counseling with family', completed: false, notes: 'Scheduled for 04:30 PM today' }
      ]
    },
    {
      id: 'day-3',
      dayNumber: 3,
      dayLabel: 'POD 3+',
      title: 'Wound Finalization, Discharge Counseling & Suture Plan',
      phase: 'Discharge & Home Transition (POD 3+)',
      date: '10-Sep-2026',
      status: patient.status === 'Discharged' ? 'Completed' : 'Upcoming',
      vitals: {
        bloodPressure: '118/76 mmHg',
        pulse: 70,
        temperature: 98.4,
        spo2: 99,
        vasPainScore: 1
      },
      drainOutputMl: 0,
      drainStatus: 'Drain removed on POD 2',
      mobilityStatus: 'Ambulatory with minimal assistance / light walker and prescribed spinal orthosis',
      dietStatus: 'Home spine nutrition plan (high protein, calcium & vitamin D supplements)',
      clinicalNotes: 'Patient ready for discharge to home. Final wound check shows well-healed incision without discharge. Discharge summary signed. Suture removal scheduled for Day 14.',
      attendingStaff: [
        { name: patient.attendingSurgeon, designation: 'Chief Spine Surgeon', department: 'Spine Surgery' },
        { name: 'Ms. Priyanshi Mehta', designation: 'Discharge & Billing Coordinator', department: 'Admissions' },
        { name: 'Dr. Parth Joshi', designation: 'Senior Physiotherapist', department: 'Rehabilitation' }
      ],
      goals: [
        { id: 'g-22', category: 'clinical', title: 'Final surgical wound dressing change to waterproof barrier dressing', completed: patient.status === 'Discharged', completedBy: 'Spine Surgery Registrar' },
        { id: 'g-23', category: 'clinical', title: 'Discharge summary signed and locked by primary consultant surgeon', completed: !!patient.dischargeSummary, completedBy: patient.attendingSurgeon },
        { id: 'g-24', category: 'medication', title: 'Take-home spine medication pack & instructions explained by pharmacist', completed: patient.status === 'Discharged', completedBy: 'Pharmacy' },
        { id: 'g-25', category: 'clinical', title: 'Emergency red-flag warning card handed over (cauda equina, fever, CSF leak)', completed: patient.status === 'Discharged' },
        { id: 'g-26', category: 'clinical', title: 'First follow-up OPD visit booked for suture/staple removal (21-Sep-2026)', completed: true, completedBy: 'Front Desk' }
      ]
    }
  ];
}

export function getPatientClinicalReports(patient: Patient): ClinicalReportItem[] {
  const isCervical = patient.spineRegion === 'cervical';
  const isScoliosis = patient.plannedProcedure.toLowerCase().includes('scoliosis');
  const isMicro = patient.plannedProcedure.toLowerCase().includes('microscopic');
  const levelStr = patient.affectedLevels.join('-') || 'L4-L5';

  return [
    {
      id: 'rep-mri-01',
      title: `Magnetic Resonance Imaging (MRI) - ${isCervical ? 'Cervical' : 'Lumbosacral'} Spine`,
      category: 'radiology',
      date: '05-Sep-2026',
      status: 'Final',
      doctorName: 'Dr. Rakesh K. Patel, MD',
      doctorDesignation: 'Senior Consultant Radiologist',
      summary: `High-resolution 3.0 Tesla MRI demonstrates significant central canal and neural foraminal compromise at ${levelStr}.`,
      findings: [
        `T1/T2/STIR sagittal and axial sequences obtained on 3.0T Siemens Magnetom.`,
        isCervical
          ? `C5-C6: Marked posterior disc-osteophyte complex with bilateral uncovertebral arthropathy resulting in severe spinal canal stenosis (AP diameter 7.8 mm) and cord compression with mild T2 hyperintensity.`
          : isScoliosis
          ? `Right-convex thoracic curve with apex at T8 (Cobb angle 48°). Compensatory lumbar curve (Cobb 32°). No syrinx, tethered cord, or Chiari malformation.`
          : `L4-L5: Grade I degenerative spondylolisthesis (5.2 mm anterior translation of L4 on L5). Marked facet joint hypertrophy with ligamentum flavum thickening (4.9 mm). Severe central canal stenosis (AP diameter 6.8 mm) and bilateral lateral recess narrowing with entrapment of traversing L5 nerve roots.`,
        `Thecal sac contour significantly compromised at targeted pathology level.`,
        `Adjacent levels demonstrate mild age-appropriate spondylotic changes without critical stenosis.`
      ],
      impression: isCervical
        ? `C5-C6 severe cervical spondylotic myelopathy with neural foraminal stenosis.`
        : isScoliosis
        ? `Adolescent Idiopathic Scoliosis (Lenke Type 1A) with normal neuroaxis.`
        : `L4-L5 Grade I degenerative spondylolisthesis with severe central and lateral recess stenosis and bilateral radiculopathy.`,
      pacsViewerUrl: 'pacs://stavya.hospital/viewer?studyId=STV-MRI-88421&patient=' + patient.mrn,
      specifications: {
        'Scanner': 'Siemens Magnetom Vida 3.0T',
        'Protocol': 'Spine Routine + 3D Myelography Sequences',
        'Contrast': 'Non-Contrast Study'
      }
    },
    {
      id: 'rep-xray-01',
      title: `Post-Operative Check Radiographs (${isCervical ? 'Cervical Spine' : 'Lumbosacral Spine'} AP & Lateral)`,
      category: 'radiology',
      date: '08-Sep-2026',
      status: 'Final',
      doctorName: 'Dr. Rakesh K. Patel, MD',
      doctorDesignation: 'Senior Consultant Radiologist',
      summary: `Post-operative instrumentation check reveals anatomic alignment and secure implant fixation without complication.`,
      findings: [
        isCervical
          ? `Low-profile anterior cervical titanium plate secured across C5-C6 with 4 bicortical locking screws in excellent alignment. PEEK cervical interbody cage seated centrally with anatomical lordosis.`
          : isMicro
          ? `Post-discectomy check shows preserved disc space height and no acute bony abnormality. Natural lumbar lordosis preserved.`
          : isScoliosis
          ? `Bilateral long contoured cobalt-chromium rods spanning T4 to L1 with multi-level pedicle screw fixation. Thoracic Cobb angle corrected from 48° down to 14° (70.8% correction). Transverse crosslink in good position.`
          : `Bilateral L4 and L5 percutaneous pedicle screws well seated within pedicle corridors without cortical breach. Pre-contoured titanium rods locked with set screws. Interbody PEEK cage seated in anterior-middle third with restored focal lordosis.`,
        `No hardware loosening, migration, or screw pull-out.`,
        `Soft tissue planes clean with expected post-surgical gas shadows. No hematoma.`
      ],
      impression: `Satisfactory post-operative spinal instrumentation and anatomical alignment.`,
      pacsViewerUrl: 'pacs://stavya.hospital/viewer?studyId=STV-XR-99104&patient=' + patient.mrn,
      specifications: {
        'Modality': 'Digital Radiography (DR)',
        'Views': 'Anteroposterior (AP) & Lateral Standing Views',
        'Radiation Dose': '0.18 mSv'
      }
    },
    {
      id: 'rep-lab-01',
      title: 'Hematology, Coagulation & Inflammatory Markers (CBC + CRP)',
      category: 'laboratory',
      date: '09-Sep-2026',
      status: 'Final',
      doctorName: 'Dr. Shailesh Shah, MD (Pathology)',
      doctorDesignation: 'Chief of Laboratory Medicine',
      summary: 'Serial hematologic monitoring shows stable post-op hemoglobin, controlled inflammatory response, and normal renal function.',
      labValues: [
        { name: 'Hemoglobin (Hb)', preOp: '13.6', pod1: '11.5', pod2: '11.9', unit: 'g/dL', referenceRange: '12.0 - 16.0', flag: 'normal' },
        { name: 'Hematocrit (PCV)', preOp: '41.2', pod1: '35.0', pod2: '36.2', unit: '%', referenceRange: '36.0 - 48.0', flag: 'normal' },
        { name: 'Total Leucocyte Count (TLC)', preOp: '7,200', pod1: '10,900', pod2: '8,400', unit: '/cu.mm', referenceRange: '4,000 - 11,000', flag: 'normal' },
        { name: 'Platelet Count', preOp: '240,000', pod1: '215,000', pod2: '230,000', unit: '/cu.mm', referenceRange: '150,000 - 450,000', flag: 'normal' },
        { name: 'C-Reactive Protein (CRP)', preOp: '2.1', pod1: '28.4', pod2: '13.8', unit: 'mg/L', referenceRange: '< 5.0 (Decreasing post-op trend)', flag: 'normal' },
        { name: 'Prothrombin Time (PT / INR)', preOp: '1.02', pod1: '1.06', pod2: '1.04', unit: 'INR', referenceRange: '0.85 - 1.15', flag: 'normal' },
        { name: 'Serum Creatinine', preOp: '0.88', pod1: '0.92', pod2: '0.89', unit: 'mg/dL', referenceRange: '0.70 - 1.20', flag: 'normal' },
        { name: 'Serum Potassium (K+)', preOp: '4.3', pod1: '4.1', pod2: '4.2', unit: 'mEq/L', referenceRange: '3.5 - 5.1', flag: 'normal' },
        { name: 'Random Blood Sugar', preOp: '104', pod1: '126', pod2: '112', unit: 'mg/dL', referenceRange: '70 - 140', flag: 'normal' }
      ]
    },
    {
      id: 'rep-pac-01',
      title: 'Pre-Anesthesia Checkup (PAC) & Medical Cardiac Clearance',
      category: 'pac',
      date: '06-Sep-2026',
      status: 'Final',
      doctorName: 'Dr. Kashyap Rameshchandra Shah, MD',
      doctorDesignation: 'Senior Consultant Anesthesiologist',
      summary: 'Patient evaluated for elective major spine surgery under General Endotracheal Anesthesia in prone position. Declared medically fit.',
      findings: [
        `Physical Status: ASA Grade II (Mild systemic disease: Well-controlled Essential Hypertension).`,
        `Airway: Mallampati Class II, adequate thyromental distance (> 6.5 cm), full cervical spine flexion and extension without neuro deficits.`,
        `Cardiovascular: 12-lead ECG demonstrates normal sinus rhythm with rate 72 bpm, no ischemic changes. 2D-Echocardiography reveals normal left ventricular size and systolic function with LVEF 62%, no regional wall motion abnormalities.`,
        `Respiratory: Clear bilateral vesicular breath sounds, SpO2 99% on room air. Chest X-ray clear.`,
        `Prone Position Feasibility: Patient cleared for prone operative positioning on Jackson radiolucent table with Wilson frame. Padded head-holder and eye protectors mandated.`
      ],
      impression: 'FIT FOR SPINE SURGERY UNDER GENERAL ANESTHESIA (ASA II). 2 units PRBC cross-matched.',
      specifications: {
        'ASA Status': 'Grade II',
        'Airway Grade': 'Mallampati II',
        'Cardiac LVEF': '62% (Normal)',
        'Anesthesia Plan': 'GA with Invasive BP & Continuous MEP/SSEP Neuromonitoring'
      }
    },
    {
      id: 'rep-imp-01',
      title: 'Spine Surgical Implants Authenticity & Traceability Certificate',
      category: 'implants',
      date: '07-Sep-2026',
      status: 'Verified',
      doctorName: patient.attendingSurgeon,
      doctorDesignation: 'Primary Operating Spine Surgeon',
      summary: 'Complete traceability certificate for all titanium and PEEK implants inserted during spine surgery.',
      findings: [
        `Implant manufacturer barcodes verified against OT Consignment Ledger.`,
        `All pedicle screws constructed from high-grade Ti6Al4V ELI (Titanium Grade 5) biocompatible alloy.`,
        `All interbody cages manufactured from radiolucent polyetheretherketone (PEEK) with tantalum marker pins for radiographic tracking.`,
        `Torque-limiting driver applied to 12.0 Nm shear-off specification on all locking set screws.`,
        `Biological graft: Autologous local bone chips combined with Demineralized Bone Matrix (DBM Putty).`
      ],
      impression: 'All hardware successfully deployed with verified sterility indicators and barcode tracking.'
    },
    {
      id: 'rep-histo-01',
      title: 'Histopathology & Microbiological Disc Culture Report',
      category: 'histopathology',
      date: '09-Sep-2026',
      status: 'Final',
      doctorName: 'Dr. Sunita Kothari, MD (Microbiology)',
      doctorDesignation: 'Consultant Microbiologist & Pathologist',
      summary: 'Excised disc tissue and intra-operative swabs verify degenerative benign pathology and sterile surgical field.',
      findings: [
        `Specimen: Excised intervertebral disc material and ligamentum flavum from operative level (${levelStr}).`,
        `Gross: Multiple fragments of irregular fibrocartilaginous tissue weighing 4.5 grams.`,
        `Microscopic: Sections show avascular degenerative fibrocartilage with mucoid degeneration, focal chondrocyte cluster formation, and dense collagenous bands. No evidence of granulomatous inflammation, tuberculosis, or neoplasia.`,
        `Intraoperative Swab Culture (48 Hours): Aerobic and anaerobic cultures incubated at 37°C reveal NO BACTERIAL GROWTH after 48 hours. Field sterile.`
      ],
      impression: `Degenerative intervertebral disc disease. Sterile intraoperative culture.`,
      specifications: {
        'Biopsy No': 'STV-HP-2026-4409',
        'Culture Status': 'Sterile (No Growth at 48 Hours)',
        'Malignancy / Granuloma': 'Negative'
      }
    }
  ];
}
