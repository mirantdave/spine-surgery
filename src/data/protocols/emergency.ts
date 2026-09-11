import { ClinicalProtocol } from '../../types/protocol';

// ============================================================================
// COMPLICATION & EMERGENCY SPINE PROTOCOLS (STV-SP-EMR-xx)
// Stavya Spine Hospital — Department of Spine Surgery
// ============================================================================

export const EMERGENCY_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'proto-emr-01',
    code: 'STV-SP-EMR-01',
    title: 'Cauda Equina Syndrome — Emergency Recognition & Decompression',
    shortLabel: 'Cauda Equina Emergency',
    category: 'Complication & Emergency',
    summary:
      'Time-critical pathway for suspected cauda equina compression, whether on presentation or after surgery. The clock starts at symptom onset, and the target is decompression within 24 hours of onset and within 8 hours of a confirmed diagnosis.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v4.0',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: {
      regions: ['lumbar', 'sacral'],
      diagnosisKeywords: ['cauda equina', 'disc herniation', 'stenosis', 'extruded', 'massive disc', 'retention'],
      statuses: 'all'
    },
    indications: [
      'Any patient with new bladder or bowel dysfunction, saddle anaesthesia or bilateral radiculopathy.',
      'Post-operative retention with perineal numbness after lumbar surgery.'
    ],
    phases: [
      {
        id: 'emr01-ph1',
        title: 'Recognition (Target: 0–30 minutes)',
        steps: [
          {
            id: 'emr01-s1',
            timing: 'Immediately',
            action: 'Identify the red flags — urinary retention or overflow incontinence, faecal incontinence or loss of anal sensation, saddle or perineal anaesthesia, bilateral sciatica, progressive motor weakness, sexual dysfunction.',
            responsible: 'Any Clinician or Nurse',
            criticalStop: true
          },
          {
            id: 'emr01-s2',
            timing: 'Within 15 minutes',
            action: 'Perform and document a focused examination — perineal pinprick in all sacral dermatomes, digital rectal examination for tone and voluntary contraction, bilateral lower limb power, and reflexes.',
            responsible: 'On-Call Spine Registrar',
            criticalStop: true
          },
          {
            id: 'emr01-s3',
            timing: 'Within 15 minutes',
            action: 'Bladder scan for post-void residual volume and catheterise if it exceeds 400 ml, recording the drained volume.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'emr01-s4',
            timing: 'Within 30 minutes',
            action: 'Call the on-call consultant spine surgeon directly. This call is never delegated or deferred to the morning.',
            responsible: 'On-Call Spine Registrar',
            criticalStop: true
          }
        ]
      },
      {
        id: 'emr01-ph2',
        title: 'Confirmation (Target: within 2 hours)',
        steps: [
          {
            id: 'emr01-s5',
            timing: 'Within 1 hour',
            action: 'Arrange an emergency MRI of the whole lumbosacral spine — out of hours, at night and at weekends without exception.',
            responsible: 'On-Call Spine Registrar + Radiology',
            criticalStop: true,
            detail: 'If MRI is contraindicated or unavailable, arrange urgent CT myelography. Clinical suspicion alone does not justify operating without imaging, and normal imaging does not by itself exclude an evolving lesion.'
          },
          {
            id: 'emr01-s6',
            timing: 'Immediately on imaging',
            action: 'The consultant personally reviews the images and classifies the syndrome as incomplete (CES-I, altered sensation with preserved voiding) or with retention (CES-R).',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr01-s7',
            timing: 'On confirmation',
            action: 'Keep the patient nil by mouth, secure intravenous access, complete pre-anaesthetic assessment and consent for emergency decompression.',
            responsible: 'On-Call Team'
          }
        ]
      },
      {
        id: 'emr01-ph3',
        title: 'Decompression (Target: within 8 hours of diagnosis)',
        steps: [
          {
            id: 'emr01-s8',
            timing: 'Within 8 hours of diagnosis',
            action: 'Activate the emergency theatre and perform wide decompression — laminectomy with careful discectomy and thorough removal of the compressive fragment.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true,
            detail: 'The earlier the decompression, particularly while the syndrome is still incomplete, the better the sphincter recovery.'
          },
          {
            id: 'emr01-s9',
            timing: 'Intra-operative',
            action: 'Use gentle bilateral retraction and avoid additional traction on an already compressed cauda equina.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'emr01-s10',
            timing: 'Post-operative',
            action: 'Continue hourly neurological and sphincter observation for 24 hours, with a formal assessment documented at 24 hours.',
            responsible: 'Ward Nursing & Registrar'
          },
          {
            id: 'emr01-s11',
            timing: 'Post-operative',
            action: 'Refer for bladder rehabilitation and intermittent catheterisation training where sphincter function has not returned.',
            responsible: 'Urology & Rehabilitation'
          },
          {
            id: 'emr01-s12',
            timing: 'Within 24 hours',
            action: 'Document the full timeline — symptom onset, presentation, examination, MRI, diagnosis and knife-to-skin — for medico-legal completeness.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Post-void residual volume', trigger: '> 500 ml with saddle numbness', action: 'Treat as CES-R; emergency MRI and theatre activation.', severity: 'Critical' },
      { parameter: 'Time from diagnosis to decompression', trigger: '> 8 hours', action: 'Escalate to the department head; record the reason for delay.', severity: 'Critical' },
      { parameter: 'Anal tone', trigger: 'Reduced or absent voluntary contraction', action: 'Emergency MRI regardless of other findings.', severity: 'Critical' },
      { parameter: 'Bilateral progressive leg weakness', trigger: 'Any progression over hours', action: 'Emergency imaging and decompression.', severity: 'Critical' }
    ],
    redFlags: [
      'Painless urinary retention in a patient with back pain — cauda equina until excluded.',
      'A patient who reports "not feeling the toilet paper" — that is saddle anaesthesia.',
      'Bilateral sciatica that suddenly improves while weakness worsens — this can signal complete compression, not recovery.'
    ],
    documentation: [
      'Timed entries for onset, examination, consultant call, MRI and incision.',
      'Perineal sensation and rectal examination findings recorded explicitly.',
      'Pre-operative and 24-hour post-operative sphincter status in the Neuro Exam module.'
    ],
    linkedModules: [
      { target: 'inpatient:neuro-exam', label: 'Sphincter & perineal assessment' },
      { target: 'reports', label: 'Emergency MRI' },
      { target: 'ot-note', label: 'Emergency decompression record' }
    ],
    references: [
      'Todd NV. Guidelines for cauda equina syndrome: red flags and imaging. British Journal of Neurosurgery, 2017.',
      'Ahn UM et al. Cauda equina syndrome secondary to lumbar disc herniation: a meta-analysis of surgical outcomes. Spine, 2000.',
      'British Association of Spine Surgeons / Society of British Neurological Surgeons standards of care for cauda equina syndrome, 2018.'
    ],
    auditMetrics: [
      { metric: 'Time from suspicion to MRI', target: '< 2 hours' },
      { metric: 'Time from diagnosis to decompression', target: '< 8 hours' },
      { metric: 'Cases with a complete documented timeline', target: '100%' }
    ]
  },

  {
    id: 'proto-emr-02',
    code: 'STV-SP-EMR-02',
    title: 'Post-Operative Spinal Epidural Haematoma & New Neurological Deficit',
    shortLabel: 'Epidural Haematoma / New Deficit',
    category: 'Complication & Emergency',
    summary:
      'The most time-critical complication in spine surgery. Any new post-operative deficit is treated as a compressive haematoma until imaging proves otherwise, with a target of return to theatre within 6 hours of onset.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.7',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: [
      'Any new or progressive motor deficit after spinal surgery.',
      'Severe escalating back or neck pain disproportionate to the procedure.',
      'New bladder dysfunction or saddle numbness in the post-operative period.'
    ],
    phases: [
      {
        id: 'emr02-ph1',
        title: 'Recognition & Immediate Escalation (0–30 minutes)',
        steps: [
          {
            id: 'emr02-s1',
            timing: 'Immediately',
            action: 'Nursing staff who detect a fall of one MRC grade or more, or new severe pain, call the registrar immediately and do not wait for the next round.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'emr02-s2',
            timing: 'Within 15 minutes',
            action: 'Registrar attends, performs and documents a full neurological examination, and compares it against the recovery-room baseline.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'emr02-s3',
            timing: 'Within 20 minutes',
            action: 'Check the drain — a suddenly blocked or unexpectedly high-output drain both point towards haematoma.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'emr02-s4',
            timing: 'Within 30 minutes',
            action: 'Call the operating consultant directly, stop all anticoagulation and antiplatelet therapy, and send an urgent coagulation profile.',
            responsible: 'Ward Registrar',
            criticalStop: true
          }
        ]
      },
      {
        id: 'emr02-ph2',
        title: 'Imaging (Target: within 1 hour)',
        steps: [
          {
            id: 'emr02-s5',
            timing: 'Within 60 minutes',
            action: 'Emergency MRI of the operated region; CT myelography only if MRI is genuinely contraindicated.',
            responsible: 'Ward Registrar + Radiology',
            criticalStop: true
          },
          {
            id: 'emr02-s6',
            timing: 'Immediately',
            action: 'Imaging must never delay theatre in a rapidly deteriorating patient — a consultant may take the patient straight back on clinical grounds.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr02-s7',
            timing: 'Concurrently',
            action: 'Book the emergency theatre, inform anaesthesia and cross-match blood while imaging proceeds.',
            responsible: 'On-Call Team'
          }
        ]
      },
      {
        id: 'emr02-ph3',
        title: 'Surgical Evacuation (Target: within 6 hours of onset)',
        steps: [
          {
            id: 'emr02-s8',
            timing: 'Within 6 hours of onset',
            action: 'Return to theatre for evacuation — reopen the wound, remove the clot, extend the decompression as required and secure meticulous haemostasis.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true,
            detail: 'Neurological recovery correlates strongly with the interval between deficit onset and evacuation.'
          },
          {
            id: 'emr02-s9',
            timing: 'Intra-operative',
            action: 'Identify and control the bleeding source — epidural veins, cancellous bone edges, segmental vessels — and reassess the coagulation status.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'emr02-s10',
            timing: 'Intra-operative',
            action: 'Place a fresh drain and consider leaving the fascia loosely approximated if there is ongoing ooze.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'emr02-s11',
            timing: 'Post-evacuation',
            action: 'Hourly neurological observation for 24 hours; withhold chemical thromboprophylaxis for 48–72 hours and use mechanical measures only.',
            responsible: 'Ward Nursing & Registrar',
            criticalStop: true
          },
          {
            id: 'emr02-s12',
            timing: 'Within 24 hours',
            action: 'Discuss the event honestly with the patient and family, file an incident report and present the case at morbidity review.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Motor power', trigger: 'Fall of ≥ 1 MRC grade post-operatively', action: 'Consultant call and emergency MRI within 60 minutes.', severity: 'Critical' },
      { parameter: 'Time from deficit to evacuation', trigger: '> 6 hours', action: 'Recovery prospects fall sharply; escalate to the department head and document the delay.', severity: 'Critical' },
      { parameter: 'Pain', trigger: 'Severe escalating pain unresponsive to opioids', action: 'Treat as haematoma until imaging excludes it.', severity: 'Critical' },
      { parameter: 'INR / coagulation', trigger: 'Any derangement', action: 'Reverse urgently with vitamin K, prothrombin complex concentrate or platelets as indicated.', severity: 'Critical' }
    ],
    redFlags: [
      'A patient who moved their legs well in recovery and cannot lift them 4 hours later.',
      'Escalating pain with a drain that has suddenly stopped draining.',
      'New deficit within hours of the first chemical thromboprophylaxis dose.'
    ],
    documentation: [
      'Timed entries: deficit detection, registrar review, consultant call, MRI and knife-to-skin.',
      'Anticoagulation stop time recorded.',
      'Serial neurological examinations before and after evacuation.'
    ],
    linkedModules: [
      { target: 'inpatient:neuro-exam', label: 'Serial neuro assessments' },
      { target: 'inpatient:rounds', label: 'Motor charting & drain output' },
      { target: 'ot-note', label: 'Evacuation operative record' },
      { target: 'reports', label: 'Emergency MRI' }
    ],
    references: [
      'Amiri AR et al. Postoperative spinal epidural hematoma: incidence, risk factors and outcome. The Spine Journal, 2013.',
      'Kou J et al. Risk factors for spinal epidural hematoma after spinal surgery. Spine, 2002.',
      'Lawton MT et al. Surgical management of spinal epidural hematoma: relationship between surgical timing and neurological outcome. Journal of Neurosurgery, 1995.'
    ],
    auditMetrics: [
      { metric: 'Time from deficit detection to MRI', target: '< 60 minutes' },
      { metric: 'Time from deficit to evacuation', target: '< 6 hours' },
      { metric: 'Symptomatic epidural haematoma rate', target: '< 0.5%' }
    ]
  },

  {
    id: 'proto-emr-03',
    code: 'STV-SP-EMR-03',
    title: 'Surgical Site Infection & Deep Instrumented Wound Infection',
    shortLabel: 'SSI & Deep Wound Infection',
    category: 'Complication & Emergency',
    summary:
      'Graded response from superficial cellulitis to deep infection around instrumentation, built on early debridement, tissue culture before antibiotics, and implant retention wherever the construct is stable.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.2',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ajay Krishnan, Consultant Spine Surgeon & Infection Control Lead',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: [
      'Wound erythema, induration, discharge or dehiscence at any point after spinal surgery.',
      'Unexplained fever with rising inflammatory markers after POD 3.',
      'New or worsening back pain after an initially good recovery.'
    ],
    phases: [
      {
        id: 'emr03-ph1',
        title: 'Assessment & Classification',
        steps: [
          {
            id: 'emr03-s1',
            timing: 'On suspicion',
            action: 'Examine the wound under sterile conditions and classify as superficial (above fascia) or deep (below fascia, involving implants).',
            responsible: 'Ward Registrar + Consultant',
            criticalStop: true
          },
          {
            id: 'emr03-s2',
            timing: 'On suspicion',
            action: 'Send CBC, CRP, ESR, procalcitonin and two sets of blood cultures before any antibiotic is given.',
            responsible: 'Ward Registrar',
            criticalStop: true,
            detail: 'Empirical antibiotics started before cultures are the commonest reason a deep spinal infection is never microbiologically identified.'
          },
          {
            id: 'emr03-s3',
            timing: 'Within 24 hours',
            action: 'Obtain contrast-enhanced MRI to define collections, epidural abscess and disc space involvement.',
            responsible: 'Radiology'
          },
          {
            id: 'emr03-s4',
            timing: 'On suspicion',
            action: 'Never take a superficial swab as the definitive sample — deep tissue specimens are obtained at debridement.',
            responsible: 'Operating Surgeon'
          }
        ]
      },
      {
        id: 'emr03-ph2',
        title: 'Superficial Infection',
        steps: [
          {
            id: 'emr03-s5',
            timing: 'Day 0',
            action: 'For cellulitis without a deep collection, start empirical oral or intravenous antistaphylococcal therapy and mark the erythema margin.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'emr03-s6',
            timing: 'Daily',
            action: 'Review daily for progression; failure to settle within 48 hours implies a deep infection until proven otherwise.',
            responsible: 'Ward Registrar',
            criticalStop: true
          }
        ]
      },
      {
        id: 'emr03-ph3',
        title: 'Deep Infection — Surgical Debridement',
        steps: [
          {
            id: 'emr03-s7',
            timing: 'Within 24 hours of diagnosis',
            action: 'Take the patient to theatre for thorough irrigation and debridement — open the fascia fully, excise all non-viable tissue and irrigate with 6–9 litres.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr03-s8',
            timing: 'Intra-operative',
            action: 'Send at least five separate deep tissue specimens for aerobic, anaerobic, fungal and mycobacterial culture plus histopathology.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr03-s9',
            timing: 'Intra-operative',
            action: 'Retain the instrumentation where the construct is stable and the fusion is immature; exchange only loose or grossly contaminated components.',
            responsible: 'Operating Consultant Spine Surgeon',
            detail: 'Premature implant removal risks instability and deformity; the biofilm is managed with debridement and suppression.'
          },
          {
            id: 'emr03-s10',
            timing: 'Intra-operative',
            action: 'Consider local antibiotic delivery and place drains; plan a second-look debridement at 48–72 hours if contamination is heavy.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'emr03-s11',
            timing: 'Refractory cases',
            action: 'Use negative-pressure wound therapy for large defects, with plastic surgery involvement for flap coverage where needed.',
            responsible: 'Plastic Surgery'
          }
        ]
      },
      {
        id: 'emr03-ph4',
        title: 'Antimicrobial Therapy',
        steps: [
          {
            id: 'emr03-s12',
            timing: 'After samples are taken',
            action: 'Start empirical intravenous Vancomycin plus a broad-spectrum beta-lactam, guided by local antibiograms.',
            responsible: 'Infectious Disease Consultant'
          },
          {
            id: 'emr03-s13',
            timing: 'On culture results',
            action: 'De-escalate to targeted therapy; continue intravenous treatment for 2–6 weeks depending on organism, implant involvement and response.',
            responsible: 'Infectious Disease Consultant',
            criticalStop: true
          },
          {
            id: 'emr03-s14',
            timing: 'After IV course',
            action: 'Consider oral suppression for up to 3–6 months where instrumentation is retained.',
            responsible: 'Infectious Disease Consultant'
          },
          {
            id: 'emr03-s15',
            timing: 'Weekly',
            action: 'Track CRP weekly as the primary response marker; monitor renal function and drug levels on Vancomycin.',
            responsible: 'Ward Registrar'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'CRP trend', trigger: 'Rising or plateauing after POD 5', action: 'Assume deep infection; image and plan debridement.', severity: 'Critical' },
      { parameter: 'Wound discharge', trigger: 'Purulent or persisting beyond POD 5', action: 'Theatre for debridement and deep cultures.', severity: 'Critical' },
      { parameter: 'Fever', trigger: '> 38.0°C beyond POD 3 without another source', action: 'Full septic screen and wound imaging.', severity: 'Escalate' },
      { parameter: 'Response to debridement', trigger: 'No clinical or biochemical improvement at 72 hours', action: 'Repeat debridement; reconsider implant retention.', severity: 'Critical' }
    ],
    redFlags: [
      'New neurological deficit with an infected wound — suspect epidural abscess and decompress urgently.',
      'Sepsis physiology — hypotension, tachycardia, altered sensorium — activate the sepsis bundle in parallel.'
    ],
    documentation: [
      'Wound appearance and inflammatory marker trends recorded at every ward round.',
      'Deep tissue culture results and the antibiotic plan filed in Clinical Reports.',
      'Debridement operative records with implant decisions explained.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Wound status charting' },
      { target: 'reports', label: 'Cultures & inflammatory markers' },
      { target: 'ot-note', label: 'Debridement record' },
      { target: 'connectors', label: 'Microbiology & pharmacy feeds' }
    ],
    references: [
      'Berbari EF et al. IDSA Clinical Practice Guidelines for Native Vertebral Osteomyelitis, 2015.',
      'Gerometta A et al. Postoperative spondylodiscitis. International Orthopaedics, 2012.',
      'Kowalski TJ et al. The management and outcome of spinal implant infections. Clinical Infectious Diseases, 2007.'
    ],
    auditMetrics: [
      { metric: 'Deep tissue cultures taken before antibiotics', target: '> 95%' },
      { metric: 'Time from deep SSI diagnosis to debridement', target: '< 24 hours' },
      { metric: 'Instrumentation retained at first debridement', target: '> 80%' }
    ]
  },

  {
    id: 'proto-emr-04',
    code: 'STV-SP-EMR-04',
    title: 'Persistent CSF Leak, Pseudomeningocele & Cutaneous Fistula',
    shortLabel: 'Persistent CSF Leak & Fistula',
    category: 'Complication & Emergency',
    summary:
      'Escalating management for a dural leak that continues after primary repair — from bed rest and pressure dressing through lumbar drainage to surgical re-exploration — with meningitis as the risk being defended against.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade C (Level IV Evidence)',
    version: 'v2.3',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Shivanand Mayi, Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all' },
    indications: [
      'Clear or blood-tinged fluid leaking from the wound after spinal surgery.',
      'Persistent postural headache, or a fluctuant wound swelling.'
    ],
    phases: [
      {
        id: 'emr04-ph1',
        title: 'Recognition & Conservative Management',
        steps: [
          {
            id: 'emr04-s1',
            timing: 'On recognition',
            action: 'Confirm the fluid is CSF — clear, non-clotting, with a positive halo sign, and beta-2 transferrin testing where the diagnosis is uncertain.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'emr04-s2',
            timing: 'Immediately',
            action: 'Stop any suction drainage, apply a bulky pressure dressing and place the patient flat with strict bed rest for 48–72 hours.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'emr04-s3',
            timing: 'Immediately',
            action: 'Do not repeatedly change or probe the dressing — each opening is a route for retrograde meningitis.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'emr04-s4',
            timing: 'Daily',
            action: 'Monitor for fever, neck stiffness, photophobia and altered sensorium; treat any of these as meningitis until excluded.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'emr04-s5',
            timing: 'Supportive',
            action: 'Give adequate analgesia, antiemetics, hydration and stool softeners to avoid straining.',
            responsible: 'Ward Registrar'
          }
        ]
      },
      {
        id: 'emr04-ph2',
        title: 'Lumbar Drainage',
        steps: [
          {
            id: 'emr04-s6',
            timing: 'If leaking beyond 72 hours',
            action: 'Place a lumbar subarachnoid drain and divert CSF at 10–15 ml per hour under consultant supervision.',
            responsible: 'Consultant Spine Surgeon / Anaesthesia'
          },
          {
            id: 'emr04-s7',
            timing: 'During drainage',
            action: 'Monitor closely for over-drainage — severe headache, altered consciousness, or a pneumocephalus picture.',
            responsible: 'Ward Nursing & Registrar',
            criticalStop: true
          },
          {
            id: 'emr04-s8',
            timing: 'After 3–5 days',
            action: 'Clamp the drain in a trial fashion, mobilise the patient, then remove it if the wound stays dry.',
            responsible: 'Ward Registrar'
          }
        ]
      },
      {
        id: 'emr04-ph3',
        title: 'Surgical Re-Exploration',
        steps: [
          {
            id: 'emr04-s9',
            timing: 'Failed conservative management',
            action: 'Return to theatre for direct repair when the leak persists beyond 5–7 days, when a pseudomeningocele is expanding, or when a cutaneous fistula is established.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr04-s10',
            timing: 'Intra-operative',
            action: 'Identify the defect, repair it primarily or with a patch graft, reinforce with a muscle or fat graft and sealant, and confirm watertightness with Valsalva.',
            responsible: 'Operating Consultant Spine Surgeon'
          },
          {
            id: 'emr04-s11',
            timing: 'Intra-operative',
            action: 'Achieve a robust multi-layer watertight fascial closure and avoid suction drainage over the repair.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr04-s12',
            timing: 'On suspicion of meningitis',
            action: 'Perform lumbar puncture with CSF cell count, glucose, protein and culture, and start empirical intravenous antibiotics that cross the blood-brain barrier.',
            responsible: 'Infectious Disease Consultant',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Leak duration', trigger: '> 5–7 days despite bed rest and drainage', action: 'Surgical re-exploration and repair.', severity: 'Critical' },
      { parameter: 'Fever with neck stiffness', trigger: 'Any occurrence with a CSF leak', action: 'Treat as meningitis — lumbar puncture, cultures, empirical antibiotics.', severity: 'Critical' },
      { parameter: 'Pseudomeningocele size', trigger: 'Expanding or symptomatic', action: 'Surgical repair rather than repeated aspiration.', severity: 'Escalate' },
      { parameter: 'Headache during lumbar drainage', trigger: 'Severe or with altered consciousness', action: 'Clamp the drain, lie the patient flat, obtain a CT head to exclude pneumocephalus.', severity: 'Critical' }
    ],
    redFlags: [
      'Repeated needle aspiration of a pseudomeningocele — this converts a closed collection into an infected one.',
      'Any CSF leak with fever and headache — meningitis until proven otherwise.'
    ],
    documentation: [
      'Leak recognition, character and volume documented daily.',
      'Bed rest and positioning orders explicit in the nursing plan.',
      'Repair operative record with the technique and materials used.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Wound & leak monitoring' },
      { target: 'ot-note', label: 'Dural repair record' },
      { target: 'reports', label: 'CSF studies' }
    ],
    references: [
      'Menon SK et al. Management of persistent cerebrospinal fluid leak following spinal surgery. Asian Spine Journal.',
      'Hughes SA et al. Duraplasty and CSF diversion in the management of postoperative dural leaks. Neurosurgical Focus.',
      'Guerin P et al. Incidental durotomy during spine surgery. Injury, 2012.'
    ],
    auditMetrics: [
      { metric: 'CSF leaks resolving without reoperation', target: '> 80%' },
      { metric: 'Post-durotomy meningitis', target: '< 1%' }
    ]
  },

  {
    id: 'proto-emr-05',
    code: 'STV-SP-EMR-05',
    title: 'C5 Palsy after Cervical Decompression',
    shortLabel: 'C5 Palsy Management',
    category: 'Complication & Emergency',
    summary:
      'Recognition and management of the deltoid and biceps weakness that appears within days of cervical decompression, and the algorithm that separates a self-limiting tethering palsy from ongoing compression needing revision.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.0',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ravi Ranjan Rai, Consultant Spine Surgeon',
    applicability: {
      regions: ['cervical'],
      procedureKeywords: ['cervical', 'acdf', 'laminoplasty', 'laminectomy', 'corpectomy', 'myelopathy'],
      statuses: 'all'
    },
    indications: [
      'New deltoid or biceps weakness after cervical decompression, typically appearing between POD 1 and POD 7.',
      'Reported incidence of roughly 5–8% after posterior cervical decompression.'
    ],
    phases: [
      {
        id: 'emr05-ph1',
        title: 'Recognition & Differentiation',
        steps: [
          {
            id: 'emr05-s1',
            timing: 'On detection',
            action: 'Document deltoid and biceps power bilaterally with MRC grading and map the sensory deficit over the lateral shoulder.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'emr05-s2',
            timing: 'On detection',
            action: 'Distinguish C5 palsy — isolated shoulder abduction and elbow flexion weakness with preserved myelopathy improvement — from cord compression, haematoma or construct failure.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr05-s3',
            timing: 'Within 24 hours',
            action: 'Obtain an urgent MRI to exclude a compressive haematoma, residual stenosis, cord signal change or graft or implant displacement.',
            responsible: 'Radiology',
            criticalStop: true
          },
          {
            id: 'emr05-s4',
            timing: 'Within 24 hours',
            action: 'Obtain a CT to assess foraminal narrowing at C4-C5 and the position of the posterior construct.',
            responsible: 'Radiology'
          }
        ]
      },
      {
        id: 'emr05-ph2',
        title: 'Management',
        steps: [
          {
            id: 'emr05-s5',
            timing: 'If no compression',
            action: 'Manage conservatively — reassure the patient, explain that most palsies recover over weeks to months, and record the discussion.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'emr05-s6',
            timing: 'From day 1',
            action: 'Start physiotherapy with passive shoulder range-of-motion to prevent adhesive capsulitis, plus a sling for comfort and support.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true,
            detail: 'A frozen shoulder is often more disabling in the long run than the palsy itself.'
          },
          {
            id: 'emr05-s7',
            timing: 'From day 1',
            action: 'Treat neuropathic shoulder pain with a gabapentinoid and adequate analgesia.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'emr05-s8',
            timing: 'If compression found',
            action: 'Where MRI shows residual foraminal or cord compression, plan revision decompression or foraminotomy.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr05-s9',
            timing: 'At 4–6 weeks',
            action: 'Arrange nerve conduction studies and EMG if there is no recovery, to document the lesion and prognosis.',
            responsible: 'Neurophysiology'
          },
          {
            id: 'emr05-s10',
            timing: 'Ongoing',
            action: 'Review at 6 weeks, 3 months and 6 months with serial MRC grading recorded in the Neuro Exam module.',
            responsible: 'Consultant Spine Surgeon'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Deltoid power', trigger: '≤ 2/5', action: 'Urgent MRI, formal rehabilitation referral, discuss the recovery timeline explicitly with the patient.', severity: 'Escalate' },
      { parameter: 'Progressive weakness', trigger: 'Deteriorating over 24–48 hours', action: 'Treat as a compressive lesion — emergency imaging and consider revision.', severity: 'Critical' },
      { parameter: 'Bilateral C5 palsy', trigger: 'Any occurrence', action: 'Urgent imaging; suspect excessive cord drift-back or a posterior construct problem.', severity: 'Critical' },
      { parameter: 'Recovery', trigger: 'No improvement at 6 months', action: 'Consider nerve transfer or tendon transfer reconstruction options.', severity: 'Escalate' }
    ],
    redFlags: [
      'Weakness accompanied by worsening myelopathy signs — this is not a simple C5 palsy.',
      'New weakness with severe neck pain — exclude haematoma first.'
    ],
    documentation: [
      'Serial deltoid and biceps MRC grading in the Neuro Exam module.',
      'Post-operative MRI and CT findings filed in Clinical Reports.',
      'Patient counselling about the expected recovery timeline recorded.'
    ],
    linkedModules: [
      { target: 'inpatient:neuro-exam', label: 'Upper limb motor grading' },
      { target: 'reports', label: 'Post-op MRI / CT' },
      { target: 'connectors', label: 'Physiotherapy referral' }
    ],
    references: [
      'Sakaura H et al. C5 palsy after decompression surgery for cervical myelopathy: review of the literature. Spine, 2003.',
      'Nassr A et al. The incidence of C5 palsy after multilevel cervical decompression procedures. Spine, 2012.',
      'Gu Y et al. Risk factors of postoperative C5 palsy: a systematic review. European Spine Journal.'
    ],
    auditMetrics: [
      { metric: 'C5 palsy rate after posterior cervical decompression', target: '< 8%' },
      { metric: 'Palsies with a documented MRI within 24 hours', target: '100%' }
    ]
  },

  {
    id: 'proto-emr-06',
    code: 'STV-SP-EMR-06',
    title: 'Post-ACDF Airway Compromise, Neck Haematoma & Dysphagia',
    shortLabel: 'Post-ACDF Airway & Haematoma',
    category: 'Complication & Emergency',
    summary:
      'The anterior cervical airway emergency. A tense neck haematoma can asphyxiate a patient within minutes, and the correct response is bedside decompression of the wound before any attempt at intubation or transfer.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.9',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Kashyap Rameshchandra Shah, Head of Anaesthesia',
    applicability: {
      regions: ['cervical'],
      approaches: ['Anterior (Smith-Robinson ACDF)'],
      procedureKeywords: ['acdf', 'anterior cervical', 'corpectomy', 'disc replacement', 'cervical'],
      statuses: 'all'
    },
    indications: [
      'Any patient after anterior cervical surgery with neck swelling, stridor, dysphagia, dyspnoea or voice change.'
    ],
    phases: [
      {
        id: 'emr06-ph1',
        title: 'Airway Emergency — Expanding Neck Haematoma',
        steps: [
          {
            id: 'emr06-s1',
            timing: 'Immediately',
            action: 'Recognise the emergency — visible neck swelling, stridor, respiratory distress, inability to lie flat, or agitation.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'emr06-s2',
            timing: 'Within 60 seconds',
            action: 'Call the emergency airway team and the operating surgeon simultaneously; sit the patient up and give high-flow oxygen.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'emr06-s3',
            timing: 'Immediately',
            action: 'Open the wound at the bedside — remove the skin sutures or staples, open the platysma and evacuate the clot to decompress the airway.',
            responsible: 'Any Trained Clinician Present',
            criticalStop: true,
            detail: 'This is a bedside procedure and must not wait for theatre. An emergency ACDF wound-opening set is kept at every cervical patient bedside.'
          },
          {
            id: 'emr06-s4',
            timing: 'Immediately after decompression',
            action: 'Secure the airway — expect a distorted, oedematous airway; be prepared for fibreoptic intubation or surgical cricothyroidotomy.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'emr06-s5',
            timing: 'After stabilisation',
            action: 'Transfer to theatre for formal exploration, haemostasis, washout and re-closure over a drain.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      },
      {
        id: 'emr06-ph2',
        title: 'Airway Oedema Without Haematoma',
        steps: [
          {
            id: 'emr06-s6',
            timing: 'On suspicion',
            action: 'Keep the patient in a high-dependency setting with continuous pulse oximetry and hourly airway observation for 24 hours after multi-level or long anterior procedures.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'emr06-s7',
            timing: 'On suspicion',
            action: 'Give intravenous dexamethasone, nebulised adrenaline and humidified oxygen; nurse the patient sitting up.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'emr06-s8',
            timing: 'Deteriorating',
            action: 'Perform early elective intubation rather than waiting for a crash airway — a difficult airway trolley must be immediately available.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          }
        ]
      },
      {
        id: 'emr06-ph3',
        title: 'Dysphagia & Voice Change',
        steps: [
          {
            id: 'emr06-s9',
            timing: 'POD 0 onward',
            action: 'Assess swallowing before the first oral intake; start with sips and progress as tolerated.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'emr06-s10',
            timing: 'POD 1 onward',
            action: 'For persistent dysphagia, refer to speech and swallow therapy, use a soft diet, and consider a short dexamethasone course.',
            responsible: 'Speech & Swallow Therapy'
          },
          {
            id: 'emr06-s11',
            timing: 'Persistent hoarseness',
            action: 'Refer for laryngoscopy to assess recurrent laryngeal nerve function if hoarseness persists beyond 2 weeks.',
            responsible: 'ENT Consultant'
          },
          {
            id: 'emr06-s12',
            timing: 'Discharge counselling',
            action: 'Explain that mild dysphagia is common after ACDF and usually settles within 4–6 weeks, and give clear return advice.',
            responsible: 'Ward Registrar'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Dexamethasone', dose: '8 mg 8-hourly, tapering', route: 'IV', timing: 'On airway oedema or significant dysphagia', notes: 'Watch glycaemia in diabetic patients.' },
      { drug: 'Nebulised Adrenaline', dose: '1 mg in 5 ml saline', route: 'Nebulised', timing: 'On stridor', notes: 'Temporising measure only — prepare definitive airway management in parallel.' }
    ],
    thresholds: [
      { parameter: 'Stridor', trigger: 'Any occurrence after anterior cervical surgery', action: 'Airway emergency — open the wound at the bedside and call the airway team.', severity: 'Critical' },
      { parameter: 'Neck circumference / swelling', trigger: 'Visibly expanding', action: 'Immediate bedside decompression; do not wait for imaging.', severity: 'Critical' },
      { parameter: 'SpO₂', trigger: '< 92% with neck swelling', action: 'Treat as an airway emergency.', severity: 'Critical' },
      { parameter: 'Dysphagia', trigger: 'Persisting beyond 6 weeks', action: 'ENT and speech therapy referral; consider imaging for prominent hardware.', severity: 'Escalate' }
    ],
    redFlags: [
      'A restless, agitated patient after ACDF is hypoxic until proven otherwise — not anxious.',
      'Inability to lie flat after cervical surgery is an airway sign.'
    ],
    documentation: [
      'Hourly airway and neck swelling observations for 24 hours after multi-level anterior cervical surgery.',
      'Timed record of any bedside decompression and airway intervention.',
      'Swallow status charted before the first oral intake.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Airway & swallow observations' },
      { target: 'ot-note', label: 'Anterior cervical operative record' },
      { target: 'connectors', label: 'Anaesthesia & ENT referral' }
    ],
    references: [
      'Sagi HC et al. Airway complications associated with surgery on the anterior cervical spine. Spine, 2002.',
      'Palumbo MA et al. Airway compromise due to wound hematoma following anterior cervical spine surgery. The Open Orthopaedics Journal, 2012.',
      'Difficult Airway Society guidelines — management of the obstructed airway.'
    ],
    auditMetrics: [
      { metric: 'Bedside wound-opening sets available at every anterior cervical bedside', target: '100%' },
      { metric: 'Airway compromise events with documented response times', target: '100%' }
    ]
  },

  {
    id: 'proto-emr-07',
    code: 'STV-SP-EMR-07',
    title: 'Implant Failure, Pseudarthrosis & Proximal Junctional Kyphosis',
    shortLabel: 'Implant Failure & PJK Surveillance',
    category: 'Complication & Emergency',
    summary:
      'Surveillance and management of mechanical construct failure — screw loosening or breakage, rod fracture, cage subsidence or migration, non-union, and proximal junctional failure after long deformity constructs.',
    priority: 'Strongly Recommended',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.4',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Mirant Bharat Dave, Managing Director & Consultant Spine Surgeon',
    applicability: {
      regions: 'all',
      procedureKeywords: ['fusion', 'instrument', 'deformity', 'scoliosis', 'osteotomy', 'tlif', 'plif', 'alif', 'acdf', 'screw', 'cage'],
      statuses: 'all'
    },
    indications: [
      'Recurrent or new pain after an initial good result following instrumented fusion.',
      'Radiographic screw haloing, rod fracture, cage subsidence or loss of correction on follow-up imaging.',
      'Proximal junctional angle progression after long deformity constructs.'
    ],
    phases: [
      {
        id: 'emr07-ph1',
        title: 'Surveillance',
        steps: [
          {
            id: 'emr07-s1',
            timing: '6 weeks, 3, 6, 12 and 24 months',
            action: 'Obtain standing AP and lateral radiographs at each visit, with full-length films for deformity constructs.',
            responsible: 'Radiology'
          },
          {
            id: 'emr07-s2',
            timing: 'Each visit',
            action: 'Measure and trend the proximal junctional angle, segmental lordosis, sagittal vertical axis and pelvic parameters.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'emr07-s3',
            timing: 'Each visit',
            action: 'Look specifically for screw haloing, rod fracture, cage subsidence or migration, and loss of the achieved correction.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr07-s4',
            timing: 'At 12 months',
            action: 'Assess fusion status with CT where union is uncertain — bridging trabecular bone and no motion on dynamic films.',
            responsible: 'Radiology'
          }
        ]
      },
      {
        id: 'emr07-ph2',
        title: 'Evaluation of Suspected Failure',
        steps: [
          {
            id: 'emr07-s5',
            timing: 'On suspicion',
            action: 'Take a focused history — pain returning after a pain-free interval, mechanical pain worse on loading, or a new deformity.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'emr07-s6',
            timing: 'On suspicion',
            action: 'Obtain CT with metal-artefact reduction and dynamic flexion-extension radiographs.',
            responsible: 'Radiology'
          },
          {
            id: 'emr07-s7',
            timing: 'On suspicion',
            action: 'Exclude low-grade infection with CRP, ESR and, where doubt persists, image-guided biopsy — indolent infection often masquerades as loosening.',
            responsible: 'Ward Registrar + Microbiology',
            criticalStop: true
          },
          {
            id: 'emr07-s8',
            timing: 'On suspicion',
            action: 'Assess bone quality with DEXA and CT Hounsfield units, and evaluate the metabolic bone profile (STV-SP-SPL-02).',
            responsible: 'Endocrinology'
          }
        ]
      },
      {
        id: 'emr07-ph3',
        title: 'Management',
        steps: [
          {
            id: 'emr07-s9',
            timing: 'Asymptomatic findings',
            action: 'Observe asymptomatic hardware findings with continued surveillance — not every radiographic abnormality needs revision.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'emr07-s10',
            timing: 'Symptomatic pseudarthrosis',
            action: 'Plan revision with hardware exchange, meticulous fusion bed preparation, autograft or biologics, and correction of host factors.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr07-s11',
            timing: 'Proximal junctional failure',
            action: 'For neurological compromise, severe pain or progressive kyphosis, plan proximal extension of the construct with junctional protection.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'emr07-s12',
            timing: 'Prevention',
            action: 'At the index surgery, preserve the posterior ligamentous complex at the upper instrumented vertebra, avoid over-correction, use transitional rods or cement augmentation in osteoporotic bone, and restore age-appropriate sagittal alignment.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Proximal junctional angle', trigger: 'Increase > 10° from the immediate post-operative value', action: 'Defines PJK — increase surveillance frequency and assess symptoms.', severity: 'Escalate' },
      { parameter: 'Rod fracture', trigger: 'Any occurrence with pain', action: 'Assume pseudarthrosis at that level; plan revision.', severity: 'Escalate' },
      { parameter: 'Cage subsidence', trigger: '> 2 mm with recurrent symptoms', action: 'Assess foraminal height loss and construct stability.', severity: 'Escalate' },
      { parameter: 'Neurological compromise from junctional failure', trigger: 'Any occurrence', action: 'Urgent imaging and surgical stabilisation.', severity: 'Critical' }
    ],
    redFlags: [
      'Pain returning after a genuinely pain-free interval following fusion — this is mechanical or infective, not incidental.',
      'Acute proximal junctional fracture with neurological signs — surgical emergency.'
    ],
    documentation: [
      'Serial radiographic measurements recorded at each follow-up.',
      'Fusion status assessment at 12 months.',
      'Infection screen results before attributing failure to mechanics alone.'
    ],
    linkedModules: [
      { target: 'reports', label: 'Follow-up imaging' },
      { target: 'anatomy', label: 'Construct & levels' },
      { target: 'ot-note', label: 'Index construct details' }
    ],
    references: [
      'Glattes RC et al. Proximal junctional kyphosis in adult spinal deformity following long instrumented posterior spinal fusion. Spine, 2005.',
      'Kim YJ et al. Proximal junctional kyphosis in adolescent idiopathic scoliosis after 3 different types of posterior segmental spinal instrumentation. Spine.',
      'Chun DS et al. The role of bone graft substitutes and biologics in spinal fusion. The Spine Journal.'
    ],
    auditMetrics: [
      { metric: 'Symptomatic pseudarthrosis after single-level fusion', target: '< 5%' },
      { metric: 'Revision surgery for PJK after long deformity constructs', target: '< 10%' }
    ]
  }
];
