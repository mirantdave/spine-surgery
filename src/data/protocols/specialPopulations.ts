import { ClinicalProtocol } from '../../types/protocol';

// ============================================================================
// SPECIAL POPULATION SPINE PROTOCOLS (STV-SP-SPL-xx)
// Stavya Spine Hospital — Department of Spine Surgery
// ============================================================================

export const SPECIAL_POPULATION_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'proto-spl-01',
    code: 'STV-SP-SPL-01',
    title: 'Adolescent Idiopathic Scoliosis — Deformity Correction Protocol',
    shortLabel: 'AIS Deformity Correction',
    category: 'Special Population',
    summary:
      'End-to-end protocol for posterior spinal fusion in adolescent idiopathic scoliosis: Lenke-based planning, fusion level selection, correction technique with neuromonitoring discipline, and the paediatric-specific perioperative care that follows.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.0',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ajay Krishnan, Consultant Spine Surgeon (Deformity Service)',
    applicability: {
      regions: ['thoracic', 'lumbar'],
      procedureKeywords: ['scoliosis', 'deformity', 'ponte', 'osteotomy', 'kyphosis', 'ais'],
      diagnosisKeywords: ['scoliosis', 'deformity', 'kyphosis', 'cobb'],
      ageRange: { max: 25 },
      statuses: 'all'
    },
    indications: [
      'Cobb angle above 45–50° in a skeletally immature patient, or a progressive curve despite bracing.',
      'Documented curve progression above 5° between visits, significant trunk imbalance or cosmetic deformity with a structural curve.'
    ],
    phases: [
      {
        id: 'spl01-ph1',
        title: 'Pre-Operative Planning',
        steps: [
          {
            id: 'spl01-s1',
            timing: 'At listing',
            action: 'Obtain standing full-spine PA and lateral radiographs plus supine bending films, and classify the curve by the Lenke system.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'spl01-s2',
            timing: 'At listing',
            action: 'Assess skeletal maturity with Risser grade and the triradiate cartilage status to predict remaining growth.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'spl01-s3',
            timing: 'At listing',
            action: 'Obtain whole-spine MRI in every case to exclude syrinx, Chiari malformation, tethered cord or an intraspinal anomaly.',
            responsible: 'Radiology',
            criticalStop: true,
            detail: 'Mandatory in atypical curves — left thoracic curves, rapid progression, abnormal neurology or early onset.'
          },
          {
            id: 'spl01-s4',
            timing: 'At listing',
            action: 'Select fusion levels using the Lenke classification with structural criteria, and confirm the stable and neutral vertebrae.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'spl01-s5',
            timing: 'At listing',
            action: 'Perform pulmonary function testing where the thoracic curve exceeds 60° or there is restrictive symptomatology.',
            responsible: 'Pulmonology'
          },
          {
            id: 'spl01-s6',
            timing: 'At listing',
            action: 'Cross-match 2–4 units, plan cell salvage and confirm tranexamic acid dosing (STV-SP-PRE-06).',
            responsible: 'Anaesthesia & Blood Bank'
          }
        ]
      },
      {
        id: 'spl01-ph2',
        title: 'Intra-Operative Conduct',
        steps: [
          {
            id: 'spl01-s7',
            timing: 'At induction',
            action: 'Establish full MEP, SSEP and EMG monitoring under total intravenous anaesthesia, with a baseline accepted before incision.',
            responsible: 'Neurophysiology & Anaesthesia',
            criticalStop: true
          },
          {
            id: 'spl01-s8',
            timing: 'Exposure',
            action: 'Perform subperiosteal exposure to the transverse process tips across the planned levels, preserving the facet capsules at the ends of the construct.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'spl01-s9',
            timing: 'Instrumentation',
            action: 'Place high-density pedicle screws using freehand or navigated technique, confirming each with triggered EMG and fluoroscopy.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'spl01-s10',
            timing: 'Correction',
            action: 'Perform Ponte osteotomies as needed, then correct with rod derotation, direct vertebral rotation and in-situ bending — gradually and never against a signal change.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'spl01-s11',
            timing: 'Correction',
            action: 'Maintain mean arterial pressure above 80 mmHg throughout the correction to preserve cord perfusion.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'spl01-s12',
            timing: 'Fusion',
            action: 'Decorticate thoroughly and pack with autologous local bone, iliac crest or allograft as planned.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'spl01-s13',
            timing: 'Before closure',
            action: 'Obtain final radiographs to confirm correction, coronal and sagittal balance, shoulder level and implant position.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          }
        ]
      },
      {
        id: 'spl01-ph3',
        title: 'Paediatric Post-Operative Care',
        steps: [
          {
            id: 'spl01-s14',
            timing: 'POD 0',
            action: 'Nurse in HDU with hourly neurological observation, weight-based analgesia and paediatric-appropriate fluid management.',
            responsible: 'HDU Nursing & Registrar',
            criticalStop: true
          },
          {
            id: 'spl01-s15',
            timing: 'POD 0 to POD 1',
            action: 'Monitor haemoglobin, urine output and chest expansion; use incentive spirometry hourly while awake.',
            responsible: 'Ward Nursing & Physiotherapy'
          },
          {
            id: 'spl01-s16',
            timing: 'POD 1 to POD 2',
            action: 'Mobilise with physiotherapy; most adolescents walk on POD 1 or POD 2 without a brace unless the construct requires one.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'spl01-s17',
            timing: 'POD 2 to POD 5',
            action: 'Transition to oral analgesia, involve the family in care, and plan school return at 4–6 weeks.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'spl01-s18',
            timing: 'Follow-up',
            action: 'Review at 6 weeks, 3, 6, 12 and 24 months with standing full-spine radiographs and SRS-22r outcome scores; no contact sport for 6–12 months.',
            responsible: 'Consultant Spine Surgeon'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Neuromonitoring signal', trigger: 'MEP fall > 75% during correction', action: 'Release the correction immediately and run the IONM rescue algorithm (STV-SP-INT-03).', severity: 'Critical' },
      { parameter: 'Estimated blood loss', trigger: '> 30% of estimated blood volume', action: 'Transfuse, activate cell salvage and reassess coagulation.', severity: 'Escalate' },
      { parameter: 'Correction percentage', trigger: 'Less than expected from bending films', action: 'Reassess for a missed structural curve or inadequate release rather than forcing correction.', severity: 'Watch' },
      { parameter: 'Post-operative shoulder imbalance', trigger: '> 2 cm', action: 'Review upper instrumented vertebra selection at follow-up; counsel the family.', severity: 'Watch' },
      { parameter: 'Superior mesenteric artery syndrome', trigger: 'Post-op vomiting and abdominal distension in a thin adolescent', action: 'Nasogastric decompression, left lateral positioning, nutrition input.', severity: 'Escalate' }
    ],
    redFlags: [
      'Left thoracic curve or abnormal neurological findings — mandatory MRI before any correction.',
      'Rapid curve progression in a skeletally immature patient — exclude an underlying syndromic or neuromuscular cause.'
    ],
    documentation: [
      'Lenke classification, Cobb angles and planned fusion levels recorded pre-operatively.',
      'Correction percentage, neuromonitoring events and final alignment in the Operative Record.',
      'SRS-22r outcome scores at each follow-up visit.'
    ],
    linkedModules: [
      { target: 'anatomy', label: 'Fusion level mapping' },
      { target: 'ot-note', label: 'Deformity correction record' },
      { target: 'inpatient:neuro-exam', label: 'Serial neuro monitoring' },
      { target: 'reports', label: 'Full-spine imaging' }
    ],
    references: [
      'Lenke LG et al. Adolescent idiopathic scoliosis: a new classification to determine extent of spinal arthrodesis. JBJS Am, 2001.',
      'Vitale MG et al. Best practices in intraoperative neuromonitoring in spine deformity surgery. Spine Deformity, 2014.',
      'Weinstein SL et al. Adolescent idiopathic scoliosis. The Lancet, 2008.'
    ],
    auditMetrics: [
      { metric: 'Pre-operative whole-spine MRI obtained', target: '100%' },
      { metric: 'Mean Cobb angle correction', target: '> 65%' },
      { metric: 'New permanent neurological deficit', target: '< 0.5%' }
    ]
  },

  {
    id: 'proto-spl-02',
    code: 'STV-SP-SPL-02',
    title: 'Osteoporotic Spine — Bone Health Optimisation & Fixation Strategy',
    shortLabel: 'Osteoporotic Spine & Bone Health',
    category: 'Special Population',
    summary:
      'Identifies poor bone stock before surgery and adapts both the medical therapy and the construct — cement augmentation, longer constructs, larger screws — so fixation holds in bone that will not otherwise grip.',
    priority: 'Strongly Recommended',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.6',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ravi Ranjan Rai, Consultant Spine Surgeon',
    applicability: {
      regions: 'all',
      diagnosisKeywords: ['osteoporo', 'osteopeni', 'compression fracture', 'vertebral fracture', 'insufficiency'],
      // Age-gated: any instrumented construct in an older spine needs a bone-quality plan.
      procedureKeywords: ['fusion', 'instrument', 'screw', 'tlif', 'plif', 'alif', 'deformity', 'vertebroplasty', 'kyphoplasty', 'cement'],
      ageRange: { min: 55 },
      statuses: 'all'
    },
    indications: [
      'Postmenopausal women and men above 65 undergoing instrumented fusion.',
      'DEXA T-score of -2.5 or below, or vertebral CT Hounsfield units below 110 at L1.',
      'Any fragility or insufficiency vertebral fracture.'
    ],
    phases: [
      {
        id: 'spl02-ph1',
        title: 'Assessment',
        steps: [
          {
            id: 'spl02-s1',
            timing: 'At listing',
            action: 'Obtain DEXA of the hip and spine, and measure vertebral Hounsfield units on the pre-operative CT.',
            responsible: 'Radiology',
            criticalStop: true,
            detail: 'Lumbar DEXA is falsely elevated by degenerative change and aortic calcification — Hounsfield units are the more honest measure in a degenerative spine.'
          },
          {
            id: 'spl02-s2',
            timing: 'At listing',
            action: 'Send a metabolic bone panel — serum calcium, phosphate, 25-OH vitamin D, parathyroid hormone, alkaline phosphatase, renal and thyroid function.',
            responsible: 'Laboratory Services'
          },
          {
            id: 'spl02-s3',
            timing: 'At listing',
            action: 'Exclude secondary causes — myeloma, hyperparathyroidism, chronic steroid use, malabsorption, hypogonadism.',
            responsible: 'Endocrinology',
            criticalStop: true
          }
        ]
      },
      {
        id: 'spl02-ph2',
        title: 'Medical Optimisation',
        steps: [
          {
            id: 'spl02-s4',
            timing: 'Pre-operative, 3–6 months where elective',
            action: 'Consider anabolic therapy with Teriparatide 20 mcg subcutaneously daily for severe osteoporosis before elective instrumentation.',
            responsible: 'Endocrinology',
            detail: 'Anabolic agents improve screw purchase and fusion rates more than antiresorptives in the perioperative window.'
          },
          {
            id: 'spl02-s5',
            timing: 'Pre- and post-operative',
            action: 'Replete vitamin D to above 30 ng/mL and give elemental calcium 1000–1200 mg daily.',
            responsible: 'Endocrinology'
          },
          {
            id: 'spl02-s6',
            timing: 'Post-operative',
            action: 'Defer bisphosphonates in the immediate post-fusion period on consultant advice, and resume or start therapy once early consolidation is established.',
            responsible: 'Endocrinology'
          },
          {
            id: 'spl02-s7',
            timing: 'Ongoing',
            action: 'Address fall risk — vision, balance, home hazards, sedating medication — and enrol in a fracture liaison pathway.',
            responsible: 'Geriatric Medicine'
          }
        ]
      },
      {
        id: 'spl02-ph3',
        title: 'Surgical Fixation Strategy',
        steps: [
          {
            id: 'spl02-s8',
            timing: 'Planning',
            action: 'Extend the construct over more levels to distribute load rather than relying on short-segment fixation in weak bone.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl02-s9',
            timing: 'Planning',
            action: 'Use larger-diameter and longer screws, undertap or skip tapping, and consider bicortical purchase where anatomy permits.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'spl02-s10',
            timing: 'Intra-operative',
            action: 'Use cement-augmented fenestrated screws at the upper and lower instrumented vertebrae, injecting under live fluoroscopy.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true,
            detail: 'Watch continuously for cement extravasation towards the canal, the foramen or the venous system — stop immediately on any posterior leak.'
          },
          {
            id: 'spl02-s11',
            timing: 'Planning',
            action: 'Protect the junctional levels — preserve the posterior ligamentous complex, consider vertebroplasty at the level above, and use transitional rods.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl02-s12',
            timing: 'Post-operative',
            action: 'Brace for 3 months, mobilise carefully and arrange radiographic surveillance for screw loosening and junctional failure.',
            responsible: 'Spine Physiotherapist + Consultant'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Teriparatide', dose: '20 mcg once daily', route: 'Subcutaneous', timing: '3–6 months pre-operatively and continued post-op', notes: 'Anabolic; improves screw purchase and fusion. Contraindicated with prior skeletal radiation or bone malignancy.' },
      { drug: 'Cholecalciferol (Vitamin D3)', dose: '60,000 IU weekly loading, then maintenance', route: 'Oral', timing: 'Pre- and post-operative', notes: 'Target serum 25-OH vitamin D above 30 ng/mL.' },
      { drug: 'Elemental Calcium', dose: '1000–1200 mg daily in divided doses', route: 'Oral', timing: 'Ongoing', notes: 'Take with food; separate from iron and thyroxine.' },
      { drug: 'Zoledronic Acid', dose: '5 mg annually', route: 'IV infusion', timing: 'After early fusion consolidation', notes: 'Timing relative to fusion decided by the consultant.' },
      { drug: 'PMMA bone cement', dose: '1–2 ml per fenestrated screw', route: 'Intraosseous via fenestrated screw', timing: 'Intra-operative', notes: 'Inject under live lateral fluoroscopy; stop at the first sign of leak.' }
    ],
    thresholds: [
      { parameter: 'DEXA T-score', trigger: '≤ -2.5', action: 'Treat as osteoporotic — adapt the construct and start medical therapy.', severity: 'Escalate' },
      { parameter: 'Vertebral Hounsfield units at L1', trigger: '< 110', action: 'Poor screw purchase expected — plan augmentation and a longer construct.', severity: 'Escalate' },
      { parameter: 'Cement extravasation', trigger: 'Any posterior or venous leak on fluoroscopy', action: 'Stop injection immediately; assess neurologically; watch for cement embolism.', severity: 'Critical' },
      { parameter: 'New junctional pain post-op', trigger: 'Any occurrence', action: 'Radiograph to exclude junctional fracture or screw pull-out.', severity: 'Escalate' }
    ],
    redFlags: [
      'Sudden severe back pain after a trivial injury in an osteoporotic patient — new vertebral fracture.',
      'Multiple vertebral fractures at presentation — exclude myeloma and metastatic disease before attributing them to osteoporosis.'
    ],
    documentation: [
      'DEXA T-score and Hounsfield units recorded in the pre-operative plan.',
      'Cement augmentation levels and volumes recorded in the Operative Record.',
      'Anti-osteoporotic therapy plan documented in the discharge summary.'
    ],
    linkedModules: [
      { target: 'reports', label: 'DEXA & metabolic panel' },
      { target: 'ot-note', label: 'Augmentation details' },
      { target: 'discharge', label: 'Bone health therapy plan' }
    ],
    references: [
      'Ohtori S et al. Teriparatide accelerates lumbar posterolateral fusion in women with postmenopausal osteoporosis. Spine, 2012.',
      'Schreiber JJ et al. Hounsfield units for assessing bone mineral density and strength. JBJS Am, 2011.',
      'ISCD Official Positions on DEXA interpretation, and the Endocrine Society osteoporosis guidelines.'
    ],
    auditMetrics: [
      { metric: 'Fusion candidates over 65 with documented bone quality assessment', target: '> 90%' },
      { metric: 'Screw loosening at 12 months in augmented constructs', target: '< 10%' }
    ]
  },

  {
    id: 'proto-spl-03',
    code: 'STV-SP-SPL-03',
    title: 'Spinal Tuberculosis & Pyogenic Spondylodiscitis',
    shortLabel: 'Spinal TB & Spondylodiscitis',
    category: 'Special Population',
    summary:
      'Diagnosis-first pathway for spinal infection — tissue before antibiotics, prolonged targeted therapy, and clear surgical indications for neurological deficit, instability, abscess and failed medical management. Spinal tuberculosis remains a leading cause of spinal infection in this population.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.4',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Shivanand Mayi, Consultant Spine Surgeon',
    applicability: {
      regions: 'all',
      diagnosisKeywords: ['tuberculosis', 'tb', 'pott', 'spondylodiscitis', 'discitis', 'abscess', 'infection', 'osteomyelitis'],
      statuses: 'all'
    },
    indications: [
      'Back pain with fever, night sweats or weight loss and raised inflammatory markers.',
      'MRI showing vertebral endplate destruction, disc-space involvement, paravertebral or epidural collection.',
      'Any neurological deficit associated with a spinal infective lesion.'
    ],
    phases: [
      {
        id: 'spl03-ph1',
        title: 'Diagnosis — Tissue Before Antibiotics',
        steps: [
          {
            id: 'spl03-s1',
            timing: 'At presentation',
            action: 'Obtain contrast-enhanced whole-spine MRI to define the extent, skip lesions, abscesses and cord compression.',
            responsible: 'Radiology',
            criticalStop: true
          },
          {
            id: 'spl03-s2',
            timing: 'At presentation',
            action: 'Send CBC, CRP, ESR, procalcitonin, blood cultures, Mantoux or IGRA, HIV serology and a chest radiograph.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'spl03-s3',
            timing: 'Before antibiotics',
            action: 'Perform CT-guided or open biopsy for histopathology, Gram stain, pyogenic culture, AFB smear, mycobacterial culture, GeneXpert MTB/RIF and fungal culture.',
            responsible: 'Interventional Radiology / Operating Surgeon',
            criticalStop: true,
            detail: 'Never start empirical antibiotics before tissue is obtained unless the patient is septic or neurologically deteriorating.'
          },
          {
            id: 'spl03-s4',
            timing: 'If first biopsy is negative',
            action: 'Repeat the biopsy — the first attempt is non-diagnostic in a substantial proportion of cases.',
            responsible: 'Operating Surgeon'
          }
        ]
      },
      {
        id: 'spl03-ph2',
        title: 'Medical Management',
        steps: [
          {
            id: 'spl03-s5',
            timing: 'On confirmation of TB',
            action: 'Start four-drug anti-tubercular therapy — isoniazid, rifampicin, pyrazinamide and ethambutol — for 2 months, then two or three drugs to complete 12–18 months for spinal disease.',
            responsible: 'Pulmonology / Infectious Disease',
            criticalStop: true
          },
          {
            id: 'spl03-s6',
            timing: 'On confirmation of pyogenic infection',
            action: 'Give culture-directed intravenous antibiotics for 6 weeks, followed by oral therapy guided by clinical and CRP response.',
            responsible: 'Infectious Disease Consultant'
          },
          {
            id: 'spl03-s7',
            timing: 'Monthly',
            action: 'Monitor liver function on anti-tubercular therapy, watch for drug reactions, and add pyridoxine to prevent isoniazid neuropathy.',
            responsible: 'Pulmonology'
          },
          {
            id: 'spl03-s8',
            timing: 'Ongoing',
            action: 'Track the response with CRP, ESR, weight, pain and appetite; repeat MRI at 3 months where the response is uncertain.',
            responsible: 'Ward / OPD Registrar'
          },
          {
            id: 'spl03-s9',
            timing: 'Throughout',
            action: 'Provide bracing, nutritional support and graded mobilisation while medical therapy takes effect.',
            responsible: 'Spine Physiotherapist & Nutrition'
          }
        ]
      },
      {
        id: 'spl03-ph3',
        title: 'Surgical Indications & Technique',
        steps: [
          {
            id: 'spl03-s10',
            timing: 'On indication',
            action: 'Operate for neurological deficit, spinal instability or deformity, a large abscess needing drainage, failure of medical therapy, or an unclear diagnosis needing tissue.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'spl03-s11',
            timing: 'Surgery',
            action: 'Debride all necrotic tissue and abscess thoroughly, decompress the neural elements and send further specimens.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl03-s12',
            timing: 'Surgery',
            action: 'Reconstruct the anterior column with a structural graft or cage and stabilise posteriorly with instrumentation — modern evidence supports instrumentation in the presence of infection when debridement is adequate.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl03-s13',
            timing: 'Surgery',
            action: 'Correct the kyphotic deformity where feasible, particularly in paediatric Pott\'s disease with spine-at-risk signs.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl03-s14',
            timing: 'Post-operative',
            action: 'Continue the full course of anti-tubercular or antibiotic therapy — surgery never shortens the medical course.',
            responsible: 'Infectious Disease / Pulmonology',
            criticalStop: true
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Isoniazid', dose: '5 mg/kg (max 300 mg) daily', route: 'Oral', timing: 'Full 12–18 month course', notes: 'Add pyridoxine 10–25 mg daily to prevent peripheral neuropathy.' },
      { drug: 'Rifampicin', dose: '10 mg/kg (max 600 mg) daily', route: 'Oral', timing: 'Full course', notes: 'Warn the patient about orange discolouration of urine; many drug interactions.' },
      { drug: 'Pyrazinamide', dose: '25 mg/kg daily', route: 'Oral', timing: 'First 2 months', notes: 'Monitor uric acid and liver function.' },
      { drug: 'Ethambutol', dose: '15 mg/kg daily', route: 'Oral', timing: 'First 2 months', notes: 'Baseline and periodic visual acuity and colour vision testing.' },
      { drug: 'Empirical IV antibiotics (pyogenic)', dose: 'Vancomycin plus a broad-spectrum beta-lactam', route: 'IV', timing: 'Only after cultures are taken', notes: 'De-escalate to culture-directed therapy as soon as sensitivities return.' }
    ],
    thresholds: [
      { parameter: 'Neurological deficit', trigger: 'Any progressive deficit', action: 'Urgent decompression — do not wait for medical therapy to work.', severity: 'Critical' },
      { parameter: 'CRP response', trigger: 'Not falling after 4 weeks of therapy', action: 'Re-biopsy, reconsider the organism and exclude drug resistance.', severity: 'Escalate' },
      { parameter: 'Kyphotic deformity', trigger: 'Progression, or spine-at-risk signs in children', action: 'Surgical stabilisation and deformity correction.', severity: 'Escalate' },
      { parameter: 'Liver enzymes on ATT', trigger: '> 3x upper limit with symptoms, or > 5x without', action: 'Stop hepatotoxic drugs and rechallenge sequentially under supervision.', severity: 'Critical' }
    ],
    redFlags: [
      'Thoracic spinal TB with early cord signal change — decompress before deficit becomes established.',
      'Constitutional symptoms with multi-level vertebral destruction — always exclude malignancy alongside infection.'
    ],
    documentation: [
      'Biopsy route, samples sent and all microbiology results filed in Clinical Reports.',
      'Anti-tubercular regimen with start date and planned duration recorded.',
      'Serial CRP, ESR and neurological status tracked through treatment.'
    ],
    linkedModules: [
      { target: 'reports', label: 'Microbiology & histopathology' },
      { target: 'inpatient:neuro-exam', label: 'Serial neuro assessment' },
      { target: 'inpatient:prescriptions', label: 'ATT / antibiotic course' },
      { target: 'ot-note', label: 'Debridement & reconstruction' }
    ],
    references: [
      'Rajasekaran S et al. Spinal tuberculosis: current concepts. Global Spine Journal, 2018.',
      'Berbari EF et al. IDSA Clinical Practice Guidelines for Native Vertebral Osteomyelitis, 2015.',
      'WHO Consolidated Guidelines on Tuberculosis Treatment, 2022 update.'
    ],
    auditMetrics: [
      { metric: 'Tissue diagnosis obtained before starting therapy', target: '> 90%' },
      { metric: 'Treatment completion for spinal tuberculosis', target: '> 95%' }
    ]
  },

  {
    id: 'proto-spl-04',
    code: 'STV-SP-SPL-04',
    title: 'Metastatic Spine Disease — NOMS Framework & Cord Compression',
    shortLabel: 'Metastatic Spine & Cord Compression',
    category: 'Special Population',
    summary:
      'Decision framework for spinal metastases using neurological, oncological, mechanical and systemic assessment, with the SINS instability score and the emergency pathway for metastatic epidural spinal cord compression.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.8',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Mirant Bharat Dave, Managing Director & Consultant Spine Surgeon',
    applicability: {
      regions: 'all',
      diagnosisKeywords: ['metasta', 'tumour', 'tumor', 'malignan', 'carcinoma', 'lymphoma', 'myeloma', 'cord compression', 'pathological fracture'],
      statuses: 'all'
    },
    indications: [
      'Known or suspected spinal metastasis with pain, instability or neurological compromise.',
      'Suspected metastatic epidural spinal cord compression — a true oncological emergency.'
    ],
    phases: [
      {
        id: 'spl04-ph1',
        title: 'Emergency Assessment — Cord Compression',
        steps: [
          {
            id: 'spl04-s1',
            timing: 'Within 1 hour',
            action: 'Obtain whole-spine MRI in any cancer patient with new back pain and neurological signs — skip lesions are common, so image the whole spine.',
            responsible: 'Radiology',
            criticalStop: true
          },
          {
            id: 'spl04-s2',
            timing: 'Immediately',
            action: 'Start Dexamethasone 16 mg daily (after a loading dose in severe compression) with gastroprotection and glucose monitoring.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'spl04-s3',
            timing: 'Immediately',
            action: 'Nurse flat with log-rolling until spinal stability is established.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'spl04-s4',
            timing: 'Within 24 hours',
            action: 'Convene the spine oncology multidisciplinary team — spine surgery, medical oncology, radiation oncology and palliative care.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          }
        ]
      },
      {
        id: 'spl04-ph2',
        title: 'NOMS Decision Framework',
        steps: [
          {
            id: 'spl04-s5',
            timing: 'MDT',
            action: 'Neurological: grade the myelopathy and radiculopathy and apply the Bilsky epidural spinal cord compression scale.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'spl04-s6',
            timing: 'MDT',
            action: 'Oncological: establish the tumour histology and its radiosensitivity — lymphoma, myeloma, breast and prostate are typically radiosensitive; renal, thyroid, melanoma and sarcoma are typically not.',
            responsible: 'Medical Oncologist'
          },
          {
            id: 'spl04-s7',
            timing: 'MDT',
            action: 'Mechanical: calculate the SINS score across location, pain, lesion type, alignment, vertebral collapse and posterolateral involvement.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'spl04-s8',
            timing: 'MDT',
            action: 'Systemic: assess performance status, extent of visceral disease, expected survival and the ability to tolerate surgery.',
            responsible: 'Medical Oncologist'
          },
          {
            id: 'spl04-s9',
            timing: 'MDT',
            action: 'Reach a documented consensus — radiotherapy alone, separation surgery followed by stereotactic radiosurgery, stabilisation alone, or best supportive care.',
            responsible: 'Spine Oncology MDT',
            criticalStop: true
          }
        ]
      },
      {
        id: 'spl04-ph3',
        title: 'Surgical Management',
        steps: [
          {
            id: 'spl04-s10',
            timing: 'Where indicated',
            action: 'Perform separation surgery — circumferential decompression creating a safe margin from the cord, followed by stereotactic radiosurgery, rather than attempting gross total resection.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl04-s11',
            timing: 'Where indicated',
            action: 'Stabilise with instrumentation spanning the pathological level, extending two levels above and below in poor-quality bone; use cement augmentation as needed.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'spl04-s12',
            timing: 'Pre-operative',
            action: 'Arrange pre-operative embolisation for hypervascular metastases — renal cell and thyroid carcinoma in particular.',
            responsible: 'Interventional Radiology',
            criticalStop: true
          },
          {
            id: 'spl04-s13',
            timing: 'Where suitable',
            action: 'For painful vertebral collapse without cord compression or instability, consider vertebroplasty or kyphoplasty.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'spl04-s14',
            timing: 'Post-operative',
            action: 'Start radiotherapy 2–3 weeks after surgery once the wound has healed, and resume systemic therapy per oncology.',
            responsible: 'Radiation & Medical Oncology'
          },
          {
            id: 'spl04-s15',
            timing: 'Throughout',
            action: 'Involve palliative care early for pain, goals of care and symptom control regardless of the surgical decision.',
            responsible: 'Palliative Care Team',
            criticalStop: true
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Dexamethasone', dose: '16 mg daily in divided doses, tapering after definitive treatment', route: 'IV then oral', timing: 'Immediately on suspected cord compression', notes: 'With gastroprotection and glucose monitoring; higher loading doses only on consultant instruction.' },
      { drug: 'Zoledronic Acid', dose: '4 mg every 3–4 weeks', route: 'IV infusion', timing: 'Ongoing skeletal-related event prevention', notes: 'Dental assessment first — risk of osteonecrosis of the jaw.' },
      { drug: 'Denosumab', dose: '120 mg monthly', route: 'Subcutaneous', timing: 'Ongoing', notes: 'Alternative to bisphosphonates, particularly in renal impairment.' }
    ],
    thresholds: [
      { parameter: 'SINS score', trigger: '≥ 13', action: 'Unstable — surgical stabilisation indicated.', severity: 'Critical' },
      { parameter: 'SINS score', trigger: '7–12', action: 'Potentially unstable — surgical consultation required before radiotherapy alone.', severity: 'Escalate' },
      { parameter: 'Bilsky grade', trigger: 'Grade 2–3 with radioresistant tumour', action: 'Separation surgery followed by stereotactic radiosurgery.', severity: 'Critical' },
      { parameter: 'Motor deficit duration', trigger: 'Established paraplegia > 48 hours', action: 'Surgery unlikely to restore ambulation — focus on stability, pain and palliative goals.', severity: 'Escalate' },
      { parameter: 'Expected survival', trigger: '< 3 months', action: 'Favour radiotherapy, pain control and supportive care over major surgery.', severity: 'Watch' }
    ],
    redFlags: [
      'New back pain in any patient with a known malignancy — image before attributing it to anything else.',
      'Nocturnal pain with weight loss and no prior cancer diagnosis — investigate for a primary tumour.'
    ],
    documentation: [
      'SINS and Bilsky scores recorded explicitly in the assessment.',
      'MDT decision with the rationale and all participants named.',
      'Goals of care discussion documented with the patient and family.'
    ],
    linkedModules: [
      { target: 'reports', label: 'Staging & spinal imaging' },
      { target: 'inpatient:neuro-exam', label: 'Serial neurological status' },
      { target: 'ot-note', label: 'Separation surgery record' },
      { target: 'connectors', label: 'Oncology & palliative care' }
    ],
    references: [
      'Laufer I et al. The NOMS framework: approach to the treatment of spinal metastatic tumors. The Oncologist, 2013.',
      'Fisher CG et al. A novel classification system for spinal instability in neoplastic disease (SINS). Spine, 2010.',
      'Patchell RA et al. Direct decompressive surgical resection in the treatment of spinal cord compression caused by metastatic cancer. The Lancet, 2005.'
    ],
    auditMetrics: [
      { metric: 'Suspected cord compression imaged within 24 hours', target: '100%' },
      { metric: 'Cases with a documented MDT decision', target: '100%' },
      { metric: 'Ambulatory status preserved at discharge in treated cord compression', target: '> 70%' }
    ]
  }
];
