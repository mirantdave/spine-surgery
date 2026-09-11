import { ClinicalProtocol } from '../../types/protocol';

// ============================================================================
// PRE-OPERATIVE SPINE SURGERY PROTOCOLS (STV-SP-PRE-xx)
// Stavya Spine Hospital — Department of Spine Surgery
// ============================================================================

export const PRE_OPERATIVE_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'proto-pre-01',
    code: 'STV-SP-PRE-01',
    title: 'Pre-Operative Spine Workup & Surgical Risk Stratification',
    shortLabel: 'Pre-Op Workup & Risk Stratification',
    category: 'Pre-Operative',
    summary:
      'Mandatory baseline clinical, radiological and laboratory workup completed on every spine patient before an operative slot is confirmed. Establishes the neurological baseline against which every post-operative examination is compared.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v4.2',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: [
      'Every patient listed for an elective or emergency spinal procedure.',
      'Re-workup required if the surgical date moves more than 30 days from the original listing.'
    ],
    phases: [
      {
        id: 'pre01-ph1',
        title: 'Clinical Baseline (Day -2 to Day -1)',
        description: 'Documented by the admitting registrar and countersigned by the operating consultant.',
        steps: [
          {
            id: 'pre01-s1',
            timing: 'On admission',
            action: 'Complete structured spine history — pain duration, radicular distribution, claudication distance, bowel/bladder function, night pain, constitutional symptoms.',
            responsible: 'Admitting Registrar (Spine Surgery)',
            detail: 'Red-flag screen for infection, malignancy, fracture and cauda equina must be explicitly negative or escalated.'
          },
          {
            id: 'pre01-s2',
            timing: 'On admission',
            action: 'Record full baseline neurological examination — MRC motor grading of all myotomes bilaterally, dermatomal sensory chart, reflexes, Hoffman/Babinski, sphincter status.',
            responsible: 'Admitting Registrar (Spine Surgery)',
            criticalStop: true,
            detail: 'A pre-operative motor chart is mandatory. Surgery must not proceed without a documented baseline exam in the Neuro Exam module.'
          },
          {
            id: 'pre01-s3',
            timing: 'Day -1',
            action: 'Record baseline patient-reported outcome scores — VAS back/leg (or neck/arm), ODI or NDI, walking tolerance; add mJOA and Nurick grade for all myelopathy cases.',
            responsible: 'Junior Registrar / Spine Physiotherapist',
            detail: 'These scores anchor the 6-week, 3-month and 1-year outcome comparison.'
          },
          {
            id: 'pre01-s4',
            timing: 'Day -1',
            action: 'Document comorbidity profile and ASA grade — diabetes, hypertension, cardiac and respiratory disease, chronic steroid use, prior spine surgery, allergy history.',
            responsible: 'Admitting Registrar (Spine Surgery)'
          }
        ]
      },
      {
        id: 'pre01-ph2',
        title: 'Radiological Workup',
        steps: [
          {
            id: 'pre01-s5',
            timing: 'Before listing',
            action: 'MRI of the symptomatic region reviewed on PACS by the operating consultant — never on report text alone.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'pre01-s6',
            timing: 'Before listing',
            action: 'Standing whole-spine AP and lateral radiographs with dynamic flexion-extension views to assess instability and sagittal balance.',
            responsible: 'Radiology Department',
            detail: 'Mandatory for every instrumented fusion, spondylolisthesis and deformity case.'
          },
          {
            id: 'pre01-s7',
            timing: 'Before listing',
            action: 'CT spine for bone anatomy, pedicle morphometry and Hounsfield-unit bone quality where instrumentation is planned.',
            responsible: 'Radiology Department',
            detail: 'Vertebral body HU < 110 at L1 triggers the Osteoporotic Spine protocol (STV-SP-SPL-02).'
          },
          {
            id: 'pre01-s8',
            timing: 'Day -1',
            action: 'Cross-verify that imaging identity, laterality and operative level match the consent form and the surgical plan.',
            responsible: 'Operating Consultant + Senior Registrar',
            criticalStop: true
          }
        ]
      },
      {
        id: 'pre01-ph3',
        title: 'Laboratory & Cardiopulmonary Workup',
        steps: [
          {
            id: 'pre01-s9',
            timing: 'Day -2 to Day -1',
            action: 'Baseline bloods — CBC, coagulation profile (PT/INR, aPTT), renal and liver function, serum electrolytes, HbA1c, blood grouping and cross-match.',
            responsible: 'Laboratory Services'
          },
          {
            id: 'pre01-s10',
            timing: 'Day -2 to Day -1',
            action: 'Infection screen — CRP, ESR, urine routine and microscopy; viral markers (HBsAg, HCV, HIV) as per hospital policy.',
            responsible: 'Laboratory Services',
            detail: 'Active urinary tract infection is an absolute contraindication to elective instrumented fusion until treated and cleared.'
          },
          {
            id: 'pre01-s11',
            timing: 'Day -1',
            action: 'ECG and chest radiograph for all patients above 40 years, and 2D echocardiography where cardiac risk factors exist.',
            responsible: 'Anaesthesia / Internal Medicine'
          },
          {
            id: 'pre01-s12',
            timing: 'Day -1',
            action: 'Consolidate the workup into the pre-operative summary and obtain the operating consultant\'s written fitness-to-proceed endorsement.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Haemoglobin', trigger: '< 10 g/dL for major fusion or deformity', action: 'Defer elective surgery; investigate and correct anaemia; start iron/erythropoietin per haematology advice.', severity: 'Escalate' },
      { parameter: 'HbA1c', trigger: '> 7.5%', action: 'Postpone elective instrumented fusion; refer to endocrinology for glycaemic optimisation (STV-SP-PRE-05).', severity: 'Escalate' },
      { parameter: 'INR', trigger: '> 1.4', action: 'Do not proceed. Correct and re-check; review anticoagulant hold protocol (STV-SP-PRE-04).', severity: 'Critical' },
      { parameter: 'CRP / ESR', trigger: 'Unexplained elevation with fever or night pain', action: 'Defer; exclude spondylodiscitis or malignancy before instrumentation (STV-SP-SPL-03).', severity: 'Critical' },
      { parameter: 'Platelet count', trigger: '< 100 x 10⁹/L', action: 'Haematology review before proceeding; arrange platelet support for major deformity work.', severity: 'Escalate' }
    ],
    redFlags: [
      'Progressive motor deficit or new-onset foot drop — expedite as a semi-urgent case.',
      'Saddle anaesthesia, urinary retention or faecal incontinence — activate the Cauda Equina protocol (STV-SP-EMR-01) immediately.',
      'Constitutional symptoms with vertebral destruction on imaging — investigate infection or malignancy before elective instrumentation.'
    ],
    documentation: [
      'Baseline neurological assessment saved in the Neuro Exam & ODI module.',
      'All imaging and laboratory reports filed in Clinical Reports.',
      'Consultant fitness endorsement recorded with attribution and timestamp.'
    ],
    linkedModules: [
      { target: 'inpatient:neuro-exam', label: 'Record baseline neuro exam' },
      { target: 'reports', label: 'Review imaging & lab reports' },
      { target: 'pathway', label: 'Day -1 pre-op milestones' }
    ],
    references: [
      'NASS Evidence-Based Clinical Guidelines for Multidisciplinary Spine Care (2020 update).',
      'AOSpine Knowledge Forum — Pre-operative assessment and outcome instruments in degenerative spine disease.',
      'Fehlings MG et al. Clinical practice guidelines for the management of degenerative cervical myelopathy. Global Spine Journal, 2017.'
    ],
    auditMetrics: [
      { metric: 'Cases with a complete documented pre-operative motor chart', target: '100%' },
      { metric: 'Elective cases proceeding with HbA1c > 7.5%', target: '< 2%' }
    ]
  },

  {
    id: 'proto-pre-02',
    code: 'STV-SP-PRE-02',
    title: 'Surgical Antibiotic Prophylaxis & SSI Prevention Bundle',
    shortLabel: 'Antibiotic Prophylaxis & SSI Bundle',
    category: 'Pre-Operative',
    summary:
      'Weight-adjusted antibiotic prophylaxis, skin decolonisation, hair removal and normothermia bundle applied to every spine case to keep the deep surgical site infection rate below 1% for instrumented fusions.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v3.6',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ajay Krishnan, Consultant Spine Surgeon & Infection Control Lead',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: [
      'All spinal procedures, instrumented and non-instrumented.',
      'Extended cover considered for revision surgery, deformity correction and prolonged operative time.'
    ],
    contraindications: [
      'Documented severe beta-lactam anaphylaxis — substitute Vancomycin or Clindamycin per the allergy pathway.'
    ],
    phases: [
      {
        id: 'pre02-ph1',
        title: 'Night Before Surgery',
        steps: [
          {
            id: 'pre02-s1',
            timing: 'Day -1, 21:00',
            action: 'Chlorhexidine gluconate 4% full-body wash including the operative region; repeat on the morning of surgery.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'pre02-s2',
            timing: 'Day -1',
            action: 'Screen for active skin lesions, folliculitis, pressure sores or fungal infection over the planned incision.',
            responsible: 'Ward Nursing Staff / Registrar',
            detail: 'Any active skin infection over the operative field defers the elective case.',
            criticalStop: true
          },
          {
            id: 'pre02-s3',
            timing: 'Day -1',
            action: 'Confirm MRSA nasal screening result for revision, deformity and immunocompromised cases; commence Mupirocin 2% nasal ointment if positive.',
            responsible: 'Infection Control Nurse'
          }
        ]
      },
      {
        id: 'pre02-ph2',
        title: 'Induction & Incision Window',
        steps: [
          {
            id: 'pre02-s4',
            timing: 'T-60 to T-30 min',
            action: 'Administer weight-adjusted IV Cefuroxime 1.5 g (2 g if > 80 kg) so the full dose is infused before skin incision.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true,
            detail: 'Timing is verified aloud during the WHO Time-Out. A dose given after incision counts as a protocol variance.'
          },
          {
            id: 'pre02-s5',
            timing: 'T-30 min',
            action: 'Clipper hair removal only, immediately before draping. Razors are prohibited.',
            responsible: 'OT Nursing / Scrub Team'
          },
          {
            id: 'pre02-s6',
            timing: 'T-15 min',
            action: 'Alcoholic chlorhexidine 2% skin preparation applied in concentric strokes and allowed to air-dry for a full 3 minutes before draping.',
            responsible: 'Operating Surgeon / Scrub Nurse',
            detail: 'Drying time is what kills the organisms — do not drape a wet field.'
          },
          {
            id: 'pre02-s7',
            timing: 'Intra-operative',
            action: 'Re-dose Cefuroxime every 4 hours of operative time, or after blood loss exceeding 1500 ml.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'pre02-s8',
            timing: 'Throughout surgery',
            action: 'Maintain core temperature above 36°C with forced-air warming and warmed irrigation fluids; keep OT door traffic to a minimum.',
            responsible: 'Anaesthesia & OT Nursing'
          }
        ]
      },
      {
        id: 'pre02-ph3',
        title: 'Post-Operative Continuation',
        steps: [
          {
            id: 'pre02-s9',
            timing: 'POD 0 to POD 1',
            action: 'Continue IV Cefuroxime 1.5 g 12-hourly for 24 hours after surgery, then stop. Routine prophylaxis beyond 24 hours is not permitted.',
            responsible: 'Ward Registrar',
            detail: 'Prolonged prophylaxis drives resistance without reducing SSI. Drain presence alone does not justify continuation.'
          },
          {
            id: 'pre02-s10',
            timing: 'POD 1 onward',
            action: 'Keep the primary dressing undisturbed for 48 hours unless soaked; use sterile technique for every subsequent inspection.',
            responsible: 'Ward Nursing Staff'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Cefuroxime', dose: '1.5 g (2 g if weight > 80 kg)', route: 'IV', timing: '30–60 min before skin incision, then 12-hourly for 24 h', notes: 'First-line prophylaxis for all spine cases.' },
      { drug: 'Vancomycin', dose: '15 mg/kg', route: 'IV over 60–90 min', timing: 'Start 120 min before incision', notes: 'For proven beta-lactam anaphylaxis or MRSA colonisation. Slow infusion prevents red-man syndrome.' },
      { drug: 'Clindamycin', dose: '900 mg', route: 'IV', timing: '30–60 min before incision', notes: 'Alternative in beta-lactam allergy where Vancomycin is unsuitable.' },
      { drug: 'Vancomycin powder (topical)', dose: '1 g intrawound', route: 'Topical, subfascial', timing: 'Immediately before closure', notes: 'Instrumented fusion and revision cases — see STV-SP-INT-08.' },
      { drug: 'Gentamicin', dose: '5 mg/kg single dose', route: 'IV', timing: 'At induction', notes: 'Added only for prolonged revision or previously infected fields, on consultant instruction.' }
    ],
    thresholds: [
      { parameter: 'Antibiotic-to-incision interval', trigger: 'Dose given < 15 min before or after incision', action: 'Log as a protocol variance in the OT record and inform the infection control lead.', severity: 'Escalate' },
      { parameter: 'Core temperature', trigger: '< 36.0°C intra-operatively', action: 'Escalate active warming; document in the anaesthesia record.', severity: 'Watch' },
      { parameter: 'Operative duration', trigger: '> 4 hours', action: 'Mandatory intra-operative antibiotic re-dose.', severity: 'Escalate' }
    ],
    redFlags: [
      'Purulent or serous discharge from the wound beyond POD 3 — activate the SSI protocol (STV-SP-EMR-03).',
      'Fever above 38.0°C with rising CRP after POD 3 — deep infection until proven otherwise.'
    ],
    documentation: [
      'Antibiotic name, dose and exact administration time recorded in the Operative Record.',
      'Prophylaxis stop date charted in the prescription module — no silent continuation.',
      'WHO Time-Out confirmation that prophylaxis was given within 60 minutes.'
    ],
    linkedModules: [
      { target: 'inpatient:who-checklist', label: 'Confirm prophylaxis in Time-Out' },
      { target: 'inpatient:prescriptions', label: 'Chart antibiotic course' },
      { target: 'ot-note', label: 'Record dose & timing in OT note' }
    ],
    references: [
      'Berríos-Torres SI et al. CDC Guideline for the Prevention of Surgical Site Infection. JAMA Surgery, 2017.',
      'North American Spine Society. Evidence-Based Guideline: Antibiotic Prophylaxis in Spine Surgery, 2013.',
      'WHO Global Guidelines for the Prevention of Surgical Site Infection, 2nd edition, 2018.'
    ],
    auditMetrics: [
      { metric: 'Prophylaxis delivered within the 60-minute window', target: '> 98%' },
      { metric: 'Deep SSI rate for instrumented fusion', target: '< 1%' },
      { metric: 'Prophylaxis continued beyond 24 hours without indication', target: '0%' }
    ]
  },

  {
    id: 'proto-pre-03',
    code: 'STV-SP-PRE-03',
    title: 'Venous Thromboembolism Risk Stratification & Prophylaxis',
    shortLabel: 'VTE Risk & Thromboprophylaxis',
    category: 'Pre-Operative',
    summary:
      'Balances the risk of deep vein thrombosis and pulmonary embolism against the catastrophic risk of a post-operative spinal epidural haematoma. Mechanical prophylaxis is universal; chemical prophylaxis is timed, risk-tiered and never started before haemostasis is confirmed.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.1',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ravi Ranjan Rai, Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: [
      'Every admitted spine surgical patient, stratified into low, moderate or high VTE risk.'
    ],
    contraindications: [
      'Active intraspinal bleeding, uncorrected coagulopathy or platelet count below 50 x 10⁹/L — mechanical prophylaxis only.'
    ],
    phases: [
      {
        id: 'pre03-ph1',
        title: 'Risk Stratification (Day -1)',
        steps: [
          {
            id: 'pre03-s1',
            timing: 'On admission',
            action: 'Score VTE risk — age > 60, BMI > 30, malignancy, prior VTE, thrombophilia, oral contraceptive use, immobility, anticipated operative time > 4 hours, multi-level fusion or deformity.',
            responsible: 'Admitting Registrar (Spine Surgery)',
            detail: 'Low = single-level decompression in a mobile patient. High = deformity, multi-level fusion, malignancy, prior VTE or a non-ambulatory patient.'
          },
          {
            id: 'pre03-s2',
            timing: 'On admission',
            action: 'Document the assigned risk tier and the resulting prophylaxis plan in the chart, countersigned by the operating consultant.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      },
      {
        id: 'pre03-ph2',
        title: 'Mechanical Prophylaxis (Universal)',
        steps: [
          {
            id: 'pre03-s3',
            timing: 'From induction',
            action: 'Apply graduated compression stockings and intermittent pneumatic calf compression devices in the operating room, before positioning.',
            responsible: 'OT Nursing Staff',
            detail: 'Universal for every spine case irrespective of risk tier. Contraindicated only in established peripheral arterial disease.'
          },
          {
            id: 'pre03-s4',
            timing: 'POD 0 onward',
            action: 'Teach and enforce hourly active ankle-pump and quadriceps-setting exercises while the patient is on bed rest.',
            responsible: 'Ward Nursing & Physiotherapy'
          },
          {
            id: 'pre03-s5',
            timing: 'POD 0 evening / POD 1 morning',
            action: 'Mobilise out of bed at the earliest safe opportunity — early ambulation is the single most effective VTE prophylaxis.',
            responsible: 'Spine Physiotherapist'
          }
        ]
      },
      {
        id: 'pre03-ph3',
        title: 'Chemical Prophylaxis (Risk-Tiered)',
        steps: [
          {
            id: 'pre03-s6',
            timing: 'POD 1 evening',
            action: 'For moderate and high risk patients start Enoxaparin 40 mg subcutaneously once daily, but only after the drain output falls below 100 ml in 12 hours and no new neurological deficit is present.',
            responsible: 'Ward Registrar + Operating Consultant',
            criticalStop: true,
            detail: 'Never start chemical prophylaxis on POD 0 after an open decompression. Consultant sign-off is mandatory for every first dose.'
          },
          {
            id: 'pre03-s7',
            timing: 'POD 1 onward',
            action: 'Perform a focused motor examination before and 6 hours after the first Enoxaparin dose, and chart it.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'pre03-s8',
            timing: 'Renal impairment',
            action: 'Reduce Enoxaparin to 30 mg once daily when creatinine clearance is below 30 ml/min, or use unfractionated heparin 5000 U 12-hourly.',
            responsible: 'Ward Registrar / Internal Medicine'
          },
          {
            id: 'pre03-s9',
            timing: 'At discharge',
            action: 'Continue prophylaxis for 14 days in high-risk and non-ambulatory patients; stop at discharge for low-risk fully ambulatory patients.',
            responsible: 'Discharging Consultant'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Enoxaparin (LMWH)', dose: '40 mg once daily (30 mg if CrCl < 30 ml/min)', route: 'Subcutaneous', timing: 'First dose POD 1 evening after haemostasis confirmed', notes: 'Standard chemical prophylaxis. Hold if drain output > 100 ml/12 h.' },
      { drug: 'Unfractionated Heparin', dose: '5000 units 12-hourly', route: 'Subcutaneous', timing: 'POD 1 onward', notes: 'Preferred in severe renal impairment; shorter half-life if reversal is needed.' },
      { drug: 'Aspirin', dose: '75–150 mg once daily', route: 'Oral', timing: 'POD 1 onward', notes: 'Only for selected low-risk ambulatory patients where LMWH is judged unsafe.' }
    ],
    thresholds: [
      { parameter: 'Drain output', trigger: '> 100 ml in the 12 hours before the planned first LMWH dose', action: 'Withhold chemical prophylaxis; continue mechanical measures; reassess in 12 hours.', severity: 'Escalate' },
      { parameter: 'New motor deficit after LMWH', trigger: 'Any drop of one MRC grade or more', action: 'Stop LMWH immediately, urgent MRI, activate the epidural haematoma protocol (STV-SP-EMR-02).', severity: 'Critical' },
      { parameter: 'Unilateral calf swelling or pain', trigger: 'Any new occurrence', action: 'Urgent venous Doppler of both lower limbs and haematology consultation.', severity: 'Escalate' },
      { parameter: 'Sudden dyspnoea, tachycardia, desaturation', trigger: 'Any occurrence', action: 'Treat as pulmonary embolism — high-flow oxygen, CT pulmonary angiogram, intensivist call.', severity: 'Critical' }
    ],
    redFlags: [
      'Acute breathlessness with pleuritic chest pain and SpO₂ below 92% — suspect pulmonary embolism.',
      'Escalating back pain with progressive leg weakness after starting LMWH — suspect epidural haematoma.'
    ],
    documentation: [
      'VTE risk tier and justification recorded on admission.',
      'Consultant authorisation for the first chemical prophylaxis dose.',
      'Daily drain output and motor charting in the Ward Rounds module.'
    ],
    linkedModules: [
      { target: 'inpatient:prescriptions', label: 'Chart LMWH prophylaxis' },
      { target: 'inpatient:rounds', label: 'Drain output & motor charting' },
      { target: 'discharge', label: 'Discharge prophylaxis duration' }
    ],
    references: [
      'NASS Evidence-Based Guideline: Antithrombotic Therapies in Spine Surgery, 2009 (reaffirmed).',
      'Falck-Ytter Y et al. Prevention of VTE in Orthopedic Surgery Patients. CHEST Guidelines, 9th edition.',
      'Glotzbecker MP et al. Thromboembolic disease in spinal surgery: a systematic review. Spine, 2009.'
    ],
    auditMetrics: [
      { metric: 'Documented VTE risk stratification on admission', target: '100%' },
      { metric: 'Symptomatic VTE within 90 days of spine surgery', target: '< 1%' },
      { metric: 'Epidural haematoma attributed to early chemical prophylaxis', target: '0' }
    ]
  },

  {
    id: 'proto-pre-04',
    code: 'STV-SP-PRE-04',
    title: 'Antiplatelet & Anticoagulant Hold, Bridging and Restart',
    shortLabel: 'Anticoagulant Hold & Bridging',
    category: 'Pre-Operative',
    summary:
      'Defines exactly how long each antithrombotic agent is withheld before spinal surgery, when bridging is required, and when therapy is safely restarted — the commonest source of both cancelled lists and post-operative haematoma.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.8',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Kashyap Rameshchandra Shah, Head of Anaesthesia',
    applicability: { regions: 'all', statuses: 'all' },
    indications: [
      'Any patient on antiplatelet, anticoagulant or direct oral anticoagulant therapy listed for spinal surgery.'
    ],
    phases: [
      {
        id: 'pre04-ph1',
        title: 'Medication Reconciliation',
        steps: [
          {
            id: 'pre04-s1',
            timing: 'At listing',
            action: 'Take a complete antithrombotic history including over-the-counter aspirin, herbal supplements, fish oil and traditional preparations.',
            responsible: 'Admitting Registrar (Spine Surgery)',
            criticalStop: true
          },
          {
            id: 'pre04-s2',
            timing: 'At listing',
            action: 'Establish the indication and thrombotic risk — drug-eluting stent within 12 months, mechanical valve, atrial fibrillation with high CHA₂DS₂-VASc, or prior VTE.',
            responsible: 'Cardiology / Internal Medicine',
            detail: 'A coronary stent placed within 6 months makes elective spine surgery a cardiology-led decision, not a surgical one.'
          }
        ]
      },
      {
        id: 'pre04-ph2',
        title: 'Pre-Operative Hold Windows',
        steps: [
          {
            id: 'pre04-s3',
            timing: 'Day -7',
            action: 'Stop Clopidogrel, Prasugrel or Ticagrelor 7 days before surgery (5 days minimum for Clopidogrel on cardiology advice).',
            responsible: 'Pre-Anaesthesia Clinic'
          },
          {
            id: 'pre04-s4',
            timing: 'Day -5',
            action: 'Stop Aspirin/Ecosprin 5 days before instrumented or open procedures; it may be continued for minor percutaneous work on consultant instruction.',
            responsible: 'Pre-Anaesthesia Clinic'
          },
          {
            id: 'pre04-s5',
            timing: 'Day -5 to Day -3',
            action: 'Stop Warfarin 5 days before surgery and confirm INR below 1.4 on the morning of surgery.',
            responsible: 'Pre-Anaesthesia Clinic',
            criticalStop: true
          },
          {
            id: 'pre04-s6',
            timing: 'Day -3 to Day -2',
            action: 'Stop direct oral anticoagulants — Rivaroxaban and Apixaban 72 hours, Dabigatran 72–96 hours depending on renal function.',
            responsible: 'Pre-Anaesthesia Clinic'
          },
          {
            id: 'pre04-s7',
            timing: 'Day -1, 12:00',
            action: 'Give the last therapeutic LMWH bridging dose no later than 24 hours before incision.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          }
        ]
      },
      {
        id: 'pre04-ph3',
        title: 'Bridging & Post-Operative Restart',
        steps: [
          {
            id: 'pre04-s8',
            timing: 'Day -5 to Day -1',
            action: 'Bridge high thrombotic risk patients with therapeutic LMWH once the oral agent is stopped, under cardiology or haematology direction.',
            responsible: 'Internal Medicine / Haematology'
          },
          {
            id: 'pre04-s9',
            timing: 'POD 1 to POD 2',
            action: 'Restart prophylactic-dose anticoagulation only after the operating consultant confirms haemostasis and an intact neurological examination.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'pre04-s10',
            timing: 'POD 2 to POD 5',
            action: 'Resume therapeutic anticoagulation in a stepwise fashion, typically 48–72 hours after major spinal decompression, with daily neurological review.',
            responsible: 'Operating Consultant + Internal Medicine'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Aspirin / Ecosprin', dose: '75–150 mg', route: 'Oral', timing: 'Hold 5 days pre-op; restart POD 2–3', notes: 'May be continued for percutaneous or minor procedures on consultant instruction.' },
      { drug: 'Clopidogrel', dose: '75 mg', route: 'Oral', timing: 'Hold 5–7 days pre-op', notes: 'Requires cardiology clearance if a coronary stent is in situ.' },
      { drug: 'Warfarin', dose: 'Variable', route: 'Oral', timing: 'Hold 5 days; verify INR < 1.4', notes: 'Bridge with therapeutic LMWH in mechanical valve or high-risk AF.' },
      { drug: 'Rivaroxaban / Apixaban', dose: 'Variable', route: 'Oral', timing: 'Hold 72 hours pre-op', notes: 'Extend the hold in renal impairment.' },
      { drug: 'Dabigatran', dose: 'Variable', route: 'Oral', timing: 'Hold 72–96 hours pre-op', notes: 'Duration governed by creatinine clearance; Idarucizumab is the reversal agent.' }
    ],
    thresholds: [
      { parameter: 'INR on the morning of surgery', trigger: '> 1.4', action: 'Cancel or defer the case; correct with vitamin K or prothrombin complex concentrate as advised.', severity: 'Critical' },
      { parameter: 'Coronary stent age', trigger: 'Drug-eluting stent < 6 months old', action: 'Defer elective spine surgery; joint cardiology and anaesthesia decision required.', severity: 'Critical' },
      { parameter: 'Last therapeutic LMWH dose', trigger: '< 24 hours before incision', action: 'Postpone the case — neuraxial and epidural bleeding risk is unacceptable.', severity: 'Critical' }
    ],
    redFlags: [
      'Patient self-reports having taken aspirin or clopidogrel that morning — cancel and reschedule.',
      'Unexpected intra-operative coagulopathic ooze — send urgent coagulation profile and consider an occult antithrombotic.'
    ],
    documentation: [
      'Antithrombotic hold plan with exact stop dates recorded in the pre-operative note.',
      'Morning-of-surgery INR filed in Clinical Reports for all warfarin patients.',
      'Consultant authorisation and timestamp for the post-operative restart.'
    ],
    linkedModules: [
      { target: 'connectors', label: 'PAC & Pharmacy anticoagulant feed' },
      { target: 'inpatient:prescriptions', label: 'Restart orders' },
      { target: 'reports', label: 'Coagulation profile' }
    ],
    references: [
      'Horlocker TT et al. Regional Anesthesia in the Patient Receiving Antithrombotic Therapy. ASRA Guidelines, 4th edition, 2018.',
      'Douketis JD et al. Perioperative Management of Antithrombotic Therapy. CHEST Guidelines, 2022.',
      'NASS Evidence-Based Guideline: Antithrombotic Therapies in Spine Surgery.'
    ],
    auditMetrics: [
      { metric: 'Same-day cancellations due to unrecognised antithrombotic use', target: '< 1%' },
      { metric: 'Documented restart authorisation by the operating consultant', target: '100%' }
    ]
  },

  {
    id: 'proto-pre-05',
    code: 'STV-SP-PRE-05',
    title: 'Metabolic, Nutritional & Tobacco Optimisation for Spinal Fusion',
    shortLabel: 'Fusion Optimisation (Sugar, Nutrition, Smoking)',
    category: 'Pre-Operative',
    summary:
      'Modifiable host factors govern whether a fusion unites and whether the wound heals. Glycaemic control, nutritional repletion and tobacco cessation are treated as surgical prerequisites, not advice.',
    priority: 'Strongly Recommended',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.4',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Shivanand Mayi, Consultant Spine Surgeon',
    applicability: {
      regions: 'all',
      procedureKeywords: ['fusion', 'tlif', 'plif', 'alif', 'olif', 'xlif', 'acdf', 'arthrodesis', 'deformity', 'instrument'],
      statuses: 'all'
    },
    indications: [
      'All planned instrumented arthrodesis and deformity correction procedures.',
      'Any patient with diabetes, BMI below 18.5 or above 35, or active tobacco use.'
    ],
    phases: [
      {
        id: 'pre05-ph1',
        title: 'Glycaemic Optimisation',
        steps: [
          {
            id: 'pre05-s1',
            timing: 'At listing',
            action: 'Check HbA1c on every diabetic patient and on all patients above 50 years listed for fusion.',
            responsible: 'Admitting Registrar (Spine Surgery)'
          },
          {
            id: 'pre05-s2',
            timing: '6–12 weeks pre-op',
            action: 'Refer to endocrinology for optimisation if HbA1c exceeds 7.5%; defer the elective fusion until control improves.',
            responsible: 'Endocrinology',
            criticalStop: true,
            detail: 'HbA1c above 7.5% roughly doubles the deep SSI and pseudarthrosis risk.'
          },
          {
            id: 'pre05-s3',
            timing: 'Peri-operative',
            action: 'Maintain perioperative capillary glucose between 140 and 180 mg/dL using a sliding-scale insulin regimen; avoid hypoglycaemia.',
            responsible: 'Anaesthesia & Ward Nursing'
          }
        ]
      },
      {
        id: 'pre05-ph2',
        title: 'Nutritional Repletion',
        steps: [
          {
            id: 'pre05-s4',
            timing: 'At listing',
            action: 'Screen serum albumin, total lymphocyte count, prealbumin, vitamin D and BMI.',
            responsible: 'Clinical Nutrition Team',
            detail: 'Albumin below 3.5 g/dL or a total lymphocyte count below 1500/mm³ defines surgically relevant malnutrition.'
          },
          {
            id: 'pre05-s5',
            timing: '2–6 weeks pre-op',
            action: 'Start high-protein supplementation at 1.5 g/kg/day with vitamin D3 60,000 IU weekly and elemental calcium 1000 mg daily where deficient.',
            responsible: 'Clinical Nutrition Team'
          },
          {
            id: 'pre05-s6',
            timing: 'Pre-op',
            action: 'Correct iron-deficiency anaemia with oral or intravenous iron so haemoglobin exceeds 12 g/dL before major deformity surgery.',
            responsible: 'Internal Medicine'
          }
        ]
      },
      {
        id: 'pre05-ph3',
        title: 'Tobacco & Lifestyle',
        steps: [
          {
            id: 'pre05-s7',
            timing: 'At listing',
            action: 'Document tobacco, bidi, gutkha and smokeless tobacco use, and counsel on complete cessation for at least 4 weeks before and 3 months after fusion.',
            responsible: 'Operating Consultant Spine Surgeon',
            detail: 'Nicotine inhibits osteoblast function and roughly doubles the non-union rate.'
          },
          {
            id: 'pre05-s8',
            timing: 'Pre-op',
            action: 'Offer nicotine replacement therapy and enrol in the cessation clinic; record the quit date in the chart.',
            responsible: 'Pulmonology / Cessation Clinic'
          },
          {
            id: 'pre05-s9',
            timing: 'Pre-op',
            action: 'Prescribe pre-operative pulmonary physiotherapy and incentive spirometry for smokers and for all thoracic deformity cases.',
            responsible: 'Spine Physiotherapist'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'HbA1c', trigger: '> 7.5%', action: 'Defer elective fusion; endocrinology-led optimisation.', severity: 'Escalate' },
      { parameter: 'Serum albumin', trigger: '< 3.5 g/dL', action: 'Nutritional repletion for 2–6 weeks before elective instrumentation.', severity: 'Escalate' },
      { parameter: 'Serum 25-OH vitamin D', trigger: '< 30 ng/mL', action: 'Loading dose cholecalciferol and calcium supplementation.', severity: 'Watch' },
      { parameter: 'Active smoking', trigger: 'Any use within 4 weeks of a planned fusion', action: 'Counsel, document the discussion, and consider deferring elective multi-level arthrodesis.', severity: 'Escalate' }
    ],
    redFlags: [
      'Unintentional weight loss with hypoalbuminaemia — exclude occult malignancy before elective instrumentation.'
    ],
    documentation: [
      'HbA1c, albumin and vitamin D values filed in Clinical Reports.',
      'Tobacco cessation counselling and quit date recorded in the pre-operative note.',
      'Nutrition plan visible in the Care Pathway Day -1 goals.'
    ],
    linkedModules: [
      { target: 'reports', label: 'Metabolic & nutrition labs' },
      { target: 'pathway', label: 'Pre-op optimisation goals' },
      { target: 'connectors', label: 'Nutrition & pharmacy feeds' }
    ],
    references: [
      'Guzman JZ et al. The impact of diabetes mellitus on patients undergoing spine surgery. Spine, 2014.',
      'Berman D et al. The effect of smoking on spinal fusion. International Journal of Spine Surgery, 2017.',
      'Puvanesarajah V et al. Poor nutrition status and lumbar spine fusion surgery outcomes. Spine, 2017.'
    ],
    auditMetrics: [
      { metric: 'Elective fusions performed with HbA1c > 7.5%', target: '< 5%' },
      { metric: 'Documented cessation counselling in active tobacco users', target: '100%' }
    ]
  },

  {
    id: 'proto-pre-06',
    code: 'STV-SP-PRE-06',
    title: 'Patient Blood Management & Tranexamic Acid Protocol',
    shortLabel: 'Blood Management & Tranexamic Acid',
    category: 'Pre-Operative',
    summary:
      'Anticipates and minimises surgical blood loss through pre-operative anaemia correction, antifibrinolytic therapy, cell salvage and a restrictive transfusion threshold.',
    priority: 'Strongly Recommended',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v3.0',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Kashyap Rameshchandra Shah, Head of Anaesthesia',
    applicability: {
      regions: 'all',
      procedureKeywords: ['fusion', 'deformity', 'scoliosis', 'osteotomy', 'corpectomy', 'multi-level', 'instrument', 'revision'],
      statuses: 'all'
    },
    indications: [
      'Multi-level fusion, deformity correction, osteotomy, corpectomy, revision surgery and tumour resection.',
      'Any case where the anticipated blood loss exceeds 500 ml.'
    ],
    contraindications: [
      'Tranexamic acid is withheld in active thromboembolic disease, recent myocardial infarction and known subarachnoid haemorrhage.'
    ],
    phases: [
      {
        id: 'pre06-ph1',
        title: 'Pre-Operative Preparation',
        steps: [
          {
            id: 'pre06-s1',
            timing: '4 weeks pre-op',
            action: 'Identify and treat pre-operative anaemia; target haemoglobin above 12 g/dL before major deformity surgery.',
            responsible: 'Internal Medicine / Haematology'
          },
          {
            id: 'pre06-s2',
            timing: 'Day -1',
            action: 'Group, screen and cross-match — 2 units for instrumented fusion, 4 units for deformity correction or corpectomy.',
            responsible: 'Blood Bank',
            criticalStop: true
          },
          {
            id: 'pre06-s3',
            timing: 'Day -1',
            action: 'Confirm cell-salvage availability and set-up for all cases with anticipated blood loss above 1000 ml.',
            responsible: 'Anaesthesia Technologist',
            detail: 'Cell salvage is avoided in tumour and active infection cases.'
          }
        ]
      },
      {
        id: 'pre06-ph2',
        title: 'Intra-Operative Blood Conservation',
        steps: [
          {
            id: 'pre06-s4',
            timing: 'At induction',
            action: 'Administer tranexamic acid loading dose 15 mg/kg IV over 15 minutes before incision.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'pre06-s5',
            timing: 'Throughout surgery',
            action: 'Continue tranexamic acid infusion at 1–2 mg/kg/hour until skin closure.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'pre06-s6',
            timing: 'Positioning',
            action: 'Position so the abdomen hangs free on a Jackson or Relton-Hall frame to decompress the epidural venous plexus.',
            responsible: 'Operating Surgeon & OT Team',
            detail: 'Abdominal compression is the commonest avoidable cause of torrential epidural bleeding.'
          },
          {
            id: 'pre06-s7',
            timing: 'Throughout surgery',
            action: 'Maintain controlled hypotension with mean arterial pressure 65–75 mmHg where neuromonitoring signals permit.',
            responsible: 'Consultant Anaesthesiologist',
            detail: 'Abandon relative hypotension immediately if neuromonitoring amplitudes fall — cord perfusion outranks blood conservation.'
          },
          {
            id: 'pre06-s8',
            timing: 'Throughout surgery',
            action: 'Use bipolar diathermy, bone wax, thrombin-gelatin matrix and patient haemostatic technique in preference to transfusion.',
            responsible: 'Operating Surgeon'
          }
        ]
      },
      {
        id: 'pre06-ph3',
        title: 'Transfusion Decision',
        steps: [
          {
            id: 'pre06-s9',
            timing: 'Intra- and post-operative',
            action: 'Apply a restrictive transfusion trigger of haemoglobin 7 g/dL, or 8 g/dL in patients with ischaemic heart disease.',
            responsible: 'Consultant Anaesthesiologist / Ward Registrar'
          },
          {
            id: 'pre06-s10',
            timing: 'Post-operative',
            action: 'Transfuse single units and reassess clinically and biochemically between each unit.',
            responsible: 'Ward Registrar'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Tranexamic Acid', dose: '15 mg/kg loading, then 1–2 mg/kg/hour infusion', route: 'IV', timing: 'Loading before incision; infusion until closure', notes: 'Reduces blood loss by roughly 30% in instrumented spine surgery.' },
      { drug: 'Iron Sucrose', dose: '200 mg per session', route: 'IV', timing: 'Pre-operative anaemia correction', notes: 'Faster repletion than oral iron when the surgical date is close.' },
      { drug: 'Thrombin-gelatin haemostatic matrix', dose: 'As required', route: 'Topical', timing: 'Intra-operative', notes: 'Applied to epidural venous bleeding; avoid packing into the canal under pressure.' }
    ],
    thresholds: [
      { parameter: 'Estimated blood loss', trigger: '> 1500 ml', action: 'Re-dose antibiotics, activate cell salvage, send a coagulation profile and inform the blood bank.', severity: 'Escalate' },
      { parameter: 'Haemoglobin', trigger: '< 7 g/dL (< 8 g/dL with cardiac disease)', action: 'Transfuse a single unit of packed red cells and reassess.', severity: 'Escalate' },
      { parameter: 'Blood loss rate', trigger: '> 500 ml in 15 minutes', action: 'Declare a massive haemorrhage call and activate the massive transfusion pathway (STV-SP-INT-07).', severity: 'Critical' }
    ],
    documentation: [
      'Tranexamic acid dose and timing recorded in the Operative Record.',
      'Estimated blood loss, fluids and every transfused unit charted in the OT note.',
      'Post-operative haemoglobin trend filed in Clinical Reports.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Blood loss & transfusion record' },
      { target: 'connectors', label: 'Blood bank reservation feed' },
      { target: 'reports', label: 'Haemoglobin trend' }
    ],
    references: [
      'CRASH-2 and subsequent surgical tranexamic acid meta-analyses.',
      'Cheriyan T et al. Efficacy of tranexamic acid on surgical bleeding in spine surgery: a meta-analysis. The Spine Journal, 2015.',
      'Carson JL et al. Clinical Practice Guidelines from the AABB: Red Blood Cell Transfusion Thresholds.'
    ],
    auditMetrics: [
      { metric: 'Tranexamic acid administered in eligible major cases', target: '> 95%' },
      { metric: 'Allogeneic transfusion rate in single-level fusion', target: '< 5%' }
    ]
  },

  {
    id: 'proto-pre-07',
    code: 'STV-SP-PRE-07',
    title: 'Surgical Site Marking & Wrong-Level Surgery Prevention',
    shortLabel: 'Site Marking & Wrong-Level Prevention',
    category: 'Pre-Operative',
    summary:
      'A never-event prevention protocol. Wrong-level spine surgery is prevented by a chain of independent verifications running from the ward through to intra-operative fluoroscopy, each documented separately.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v4.0',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every spinal procedure without exception, including revision and percutaneous work.'],
    phases: [
      {
        id: 'pre07-ph1',
        title: 'Ward Verification (Day -1)',
        steps: [
          {
            id: 'pre07-s1',
            timing: 'Day -1',
            action: 'The operating surgeon or senior registrar marks the surgical site and side with an indelible marker while the patient is awake and able to confirm.',
            responsible: 'Operating Surgeon / Senior Registrar',
            criticalStop: true,
            detail: 'The mark must remain visible after skin preparation and draping.'
          },
          {
            id: 'pre07-s2',
            timing: 'Day -1',
            action: 'Verify patient identity, procedure, level and side against the consent form, MRI and the operating list, with the patient participating.',
            responsible: 'Operating Surgeon / Senior Registrar',
            criticalStop: true
          },
          {
            id: 'pre07-s3',
            timing: 'Day -1',
            action: 'Record any anatomical variant that alters counting — lumbosacral transitional vertebra, sacralisation, lumbarisation, cervical ribs, six lumbar vertebrae.',
            responsible: 'Operating Consultant Spine Surgeon',
            detail: 'Where a transitional vertebra exists, the counting convention used must be written explicitly in the operative plan.'
          }
        ]
      },
      {
        id: 'pre07-ph2',
        title: 'Operating Room Verification',
        steps: [
          {
            id: 'pre07-s4',
            timing: 'Before induction',
            action: 'Sign-In: confirm identity, site mark, consent and imaging availability with the patient and the whole team.',
            responsible: 'Anaesthesia & OT Nursing'
          },
          {
            id: 'pre07-s5',
            timing: 'Before incision',
            action: 'Time-Out: the entire team stops; the surgeon states the patient name, procedure, approach, level and side aloud, and every member confirms.',
            responsible: 'Whole Operating Team',
            criticalStop: true
          },
          {
            id: 'pre07-s6',
            timing: 'Before incision',
            action: 'Display the relevant MRI and radiographs on the OT screen, oriented and confirmed by the operating surgeon.',
            responsible: 'Operating Surgeon'
          }
        ]
      },
      {
        id: 'pre07-ph3',
        title: 'Intra-Operative Radiological Confirmation',
        steps: [
          {
            id: 'pre07-s7',
            timing: 'After exposure, before decompression',
            action: 'Place a radio-opaque marker at the intended level and obtain an intra-operative fluoroscopic or radiographic image counting from a fixed anatomical landmark (sacrum, C2, or the last rib-bearing vertebra).',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'pre07-s8',
            timing: 'After localisation',
            action: 'The operating consultant personally reviews and signs off the localisation image before any bone or disc is removed.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'pre07-s9',
            timing: 'After instrumentation',
            action: 'Obtain a final AP and lateral image confirming implant position and the operated level, and store it in the record.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'pre07-s10',
            timing: 'Sign-Out',
            action: 'State the operated level aloud during Sign-Out and confirm it matches the consented level before the patient leaves the room.',
            responsible: 'Whole Operating Team',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Localisation image quality', trigger: 'Landmark not clearly countable (obesity, deformity, osteopenia)', action: 'Do not proceed on assumption — obtain an alternative projection, use navigation, or count from a second fixed landmark.', severity: 'Critical' },
      { parameter: 'Site mark', trigger: 'Absent or illegible at Time-Out', action: 'Stop. Re-verify against consent and imaging with the operating consultant before draping continues.', severity: 'Critical' },
      { parameter: 'Level discrepancy', trigger: 'Any disagreement between team members', action: 'Full stop. No dissection proceeds until unanimous radiological agreement is reached.', severity: 'Critical' }
    ],
    redFlags: [
      'Transitional lumbosacral anatomy without an agreed counting convention.',
      'Consent form and MRI report referring to different levels.',
      'Multi-level pathology where only one level is to be operated.'
    ],
    documentation: [
      'Site marking entry with the marking surgeon\'s name and timestamp.',
      'WHO Sign-In, Time-Out and Sign-Out fully completed in the checklist module.',
      'Intra-operative localisation image reference and fluoroscopy time in the OT note.'
    ],
    linkedModules: [
      { target: 'inpatient:who-checklist', label: 'Complete WHO checklist' },
      { target: 'anatomy', label: 'Confirm operative levels' },
      { target: 'ot-note', label: 'Record C-arm confirmation' }
    ],
    references: [
      'Joint Commission Universal Protocol for Preventing Wrong Site, Wrong Procedure, Wrong Person Surgery.',
      'NASS Sign, Mark & X-ray (SMaX) Programme for wrong-site surgery prevention.',
      'Mayer JE et al. Wrong-level spine surgery: prevention strategies. The Spine Journal, 2012.'
    ],
    auditMetrics: [
      { metric: 'Wrong-level spine procedures', target: '0 (never event)' },
      { metric: 'Cases with a documented intra-operative localisation image', target: '100%' }
    ]
  },

  {
    id: 'proto-pre-08',
    code: 'STV-SP-PRE-08',
    title: 'Informed Consent & Pre-Anaesthesia Clearance',
    shortLabel: 'Informed Consent & PAC Clearance',
    category: 'Pre-Operative',
    summary:
      'Ensures the patient understands the specific neurological risks of spinal surgery and that anaesthetic fitness, airway assessment and post-operative disposition are settled before the patient reaches the operating room.',
    priority: 'Mandatory',
    evidenceGrade: 'Institutional Consensus',
    version: 'v3.3',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Mirant Bharat Dave, Managing Director & Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every spinal procedure performed under anaesthesia.'],
    phases: [
      {
        id: 'pre08-ph1',
        title: 'Surgical Informed Consent',
        steps: [
          {
            id: 'pre08-s1',
            timing: 'Day -1',
            action: 'The operating consultant personally explains the diagnosis, the natural history without surgery, the planned procedure and the realistic expected benefit.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'pre08-s2',
            timing: 'Day -1',
            action: 'Explicitly disclose the material risks — neurological deficit and paralysis, dural tear and CSF leak, infection, implant failure, non-union, adjacent segment degeneration, recurrent disc herniation, blood loss and the possibility of revision surgery.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'pre08-s3',
            timing: 'Day -1',
            action: 'Explain the consent in the patient\'s own language (Gujarati/Hindi/English) with a witness present, and document the language used.',
            responsible: 'Operating Consultant + Witness'
          },
          {
            id: 'pre08-s4',
            timing: 'Day -1',
            action: 'Obtain separate consent for blood transfusion, implants, intra-operative photography and any planned use of navigation or robotics.',
            responsible: 'Admitting Registrar (Spine Surgery)'
          },
          {
            id: 'pre08-s5',
            timing: 'Day -1',
            action: 'Set realistic expectations for pain relief, return to work, driving and lifting; record the discussion.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      },
      {
        id: 'pre08-ph2',
        title: 'Pre-Anaesthesia Clearance',
        steps: [
          {
            id: 'pre08-s6',
            timing: 'Day -1',
            action: 'Perform a formal PAC evaluation — ASA grading, functional capacity in METs, and cardiac risk assessment.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'pre08-s7',
            timing: 'Day -1',
            action: 'Assess the airway with Mallampati grading, thyromental distance and neck movement; flag every cervical myelopathy or rheumatoid patient as a potential difficult airway.',
            responsible: 'Consultant Anaesthesiologist',
            detail: 'Cervical myelopathy patients require awake fibreoptic intubation or in-line stabilisation — never routine neck extension.'
          },
          {
            id: 'pre08-s8',
            timing: 'Day -1',
            action: 'Plan the anaesthetic technique including total intravenous anaesthesia where motor evoked potentials will be monitored.',
            responsible: 'Consultant Anaesthesiologist',
            detail: 'Volatile agents above 0.5 MAC and neuromuscular blockade suppress MEP signals.'
          },
          {
            id: 'pre08-s9',
            timing: 'Day -1',
            action: 'Confirm nil-by-mouth timing — 6 hours for solids, 2 hours for clear fluids — and document the last intake time.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'pre08-s10',
            timing: 'Day -1',
            action: 'Book the post-operative disposition — ward, HDU or ICU — for all deformity, corpectomy, multi-level cervical and high-risk comorbidity cases.',
            responsible: 'Consultant Anaesthesiologist + Operating Consultant'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Functional capacity', trigger: '< 4 METs with cardiac risk factors', action: 'Cardiology review and stress testing before elective major spine surgery.', severity: 'Escalate' },
      { parameter: 'Airway assessment', trigger: 'Mallampati III–IV, or myelopathy with restricted neck movement', action: 'Plan awake fibreoptic intubation; keep a difficult airway trolley in the room.', severity: 'Escalate' },
      { parameter: 'Consent', trigger: 'Incomplete, unsigned or in a language the patient does not read', action: 'Case does not proceed until re-consented appropriately.', severity: 'Critical' }
    ],
    documentation: [
      'Signed and witnessed consent form with the language of explanation recorded.',
      'PAC clearance note with ASA grade and airway plan filed in Clinical Reports.',
      'Nil-by-mouth start time charted by nursing.'
    ],
    linkedModules: [
      { target: 'connectors', label: 'PAC & Anaesthesia connector' },
      { target: 'pathway', label: 'Day -1 consent milestone' },
      { target: 'inpatient:who-checklist', label: 'Sign-In consent verification' }
    ],
    references: [
      'Montgomery v Lanarkshire Health Board — material risk standard for informed consent.',
      'ASA Practice Advisory for Preanesthesia Evaluation, 2012.',
      'Difficult Airway Society guidelines for management of unanticipated difficult intubation, 2015.'
    ],
    auditMetrics: [
      { metric: 'Consent obtained personally by the operating consultant', target: '100%' },
      { metric: 'Same-day cancellations for incomplete PAC', target: '< 1%' }
    ]
  }
];
