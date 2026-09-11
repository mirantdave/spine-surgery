import { ClinicalProtocol } from '../../types/protocol';

// ============================================================================
// POST-OPERATIVE SPINE SURGERY PROTOCOLS (STV-SP-POST-xx)
// Stavya Spine Hospital — Department of Spine Surgery
// ============================================================================

export const POST_OPERATIVE_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'proto-post-01',
    code: 'STV-SP-POST-01',
    title: 'ERAS Spine Pathway — Post-Operative Day 0 to Day 3',
    shortLabel: 'ERAS Spine Pathway (POD 0–3)',
    category: 'Post-Operative',
    summary:
      'The enhanced recovery backbone of every spine admission: early feeding, early catheter removal, early mobilisation, opioid-sparing analgesia and daily goal-setting that carries the patient to discharge without drift.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v4.3',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every elective spine surgical admission; adapted rather than abandoned for emergency and deformity cases.'],
    phases: [
      {
        id: 'post01-ph1',
        title: 'POD 0 — Day of Surgery',
        steps: [
          {
            id: 'post01-s1',
            timing: 'Recovery room, within 30 min',
            action: 'Perform and document a full motor and sensory examination on emergence, and compare it directly against the pre-operative baseline.',
            responsible: 'Operating Surgeon / Recovery Registrar',
            criticalStop: true,
            detail: 'The first post-operative exam is the reference point for every subsequent neurological decision.'
          },
          {
            id: 'post01-s2',
            timing: 'Hourly for 6 hours',
            action: 'Chart hourly limb motor power, vitals, wound and drain output; extend to 2-hourly overnight if stable.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post01-s3',
            timing: 'POD 0, 4–6 hours',
            action: 'Start clear oral fluids once the patient is awake and not nauseated; progress to a light diet the same evening.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post01-s4',
            timing: 'POD 0, 4–8 hours',
            action: 'Sit the patient up and, for single-level decompression and uncomplicated fusion, stand them with assistance the same evening.',
            responsible: 'Spine Physiotherapist',
            detail: 'Same-day mobilisation is the strongest predictor of a short, complication-free stay.'
          },
          {
            id: 'post01-s5',
            timing: 'POD 0',
            action: 'Start scheduled multimodal analgesia and antiemetics rather than as-required opioids alone (STV-SP-POST-02).',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post01-s6',
            timing: 'POD 0',
            action: 'Apply intermittent pneumatic compression, teach ankle pumps and confirm incentive spirometry hourly while awake.',
            responsible: 'Ward Nursing & Physiotherapy'
          }
        ]
      },
      {
        id: 'post01-ph2',
        title: 'POD 1 — First Post-Operative Day',
        steps: [
          {
            id: 'post01-s7',
            timing: 'POD 1, 08:00',
            action: 'Consultant-led ward round with full neurological examination, wound and drain review, and a written daily plan.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'post01-s8',
            timing: 'POD 1 morning',
            action: 'Remove the urinary catheter and monitor for retention (STV-SP-POST-06).',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post01-s9',
            timing: 'POD 1',
            action: 'Fit the brace or collar if prescribed, and ambulate the patient in the corridor with a walker.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post01-s10',
            timing: 'POD 1',
            action: 'Step down from intravenous to oral analgesia; stop prophylactic antibiotics at 24 hours.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post01-s11',
            timing: 'POD 1 evening',
            action: 'Start chemical VTE prophylaxis if the drain output and neurological status permit (STV-SP-PRE-03).',
            responsible: 'Ward Registrar + Consultant'
          },
          {
            id: 'post01-s12',
            timing: 'POD 1',
            action: 'Send post-operative haemoglobin, renal function and electrolytes; obtain standing radiographs where the patient can stand.',
            responsible: 'Ward Registrar'
          }
        ]
      },
      {
        id: 'post01-ph3',
        title: 'POD 2 — Consolidation',
        steps: [
          {
            id: 'post01-s13',
            timing: 'POD 2',
            action: 'Remove the drain when 24-hour output falls below 50 ml, or by POD 2 regardless, unless otherwise instructed (STV-SP-POST-04).',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post01-s14',
            timing: 'POD 2',
            action: 'Progress ambulation to independent corridor walking with the brace, and start stair training where relevant.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post01-s15',
            timing: 'POD 2',
            action: 'Confirm the patient is on fully oral analgesia with a resting pain score of 3 or less.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post01-s16',
            timing: 'POD 2',
            action: 'Inspect the wound at 48 hours and change to a clean occlusive dressing.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post01-s17',
            timing: 'POD 2',
            action: 'Begin structured discharge education — spinal precautions, brace use, red flags and follow-up.',
            responsible: 'Spine Physiotherapist & Nursing'
          }
        ]
      },
      {
        id: 'post01-ph4',
        title: 'POD 3+ — Discharge Transition',
        steps: [
          {
            id: 'post01-s18',
            timing: 'POD 3',
            action: 'Assess against the formal discharge criteria (STV-SP-DIS-01) and document the decision.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'post01-s19',
            timing: 'POD 3',
            action: 'Complete the discharge summary, prescriptions, brace instructions and the follow-up appointment before the patient leaves.',
            responsible: 'Ward Registrar + Discharge Coordinator'
          },
          {
            id: 'post01-s20',
            timing: 'POD 3',
            action: 'Confirm the patient and family can repeat back the red-flag symptoms and the 24-hour helpline number.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Mobilisation', trigger: 'Not standing by POD 1', action: 'Identify the barrier — pain, hypotension, neurological deficit or fear — and escalate to the consultant.', severity: 'Escalate' },
      { parameter: 'Resting pain score', trigger: 'VAS > 4 on scheduled analgesia', action: 'Review the analgesic ladder; exclude a surgical cause such as haematoma.', severity: 'Escalate' },
      { parameter: 'Oral intake', trigger: 'Not tolerating diet by POD 1', action: 'Exclude ileus; review opioid dose and start prokinetics.', severity: 'Watch' },
      { parameter: 'Length of stay', trigger: 'Exceeding the pathway by more than 2 days', action: 'Document the variance reason and review at the departmental meeting.', severity: 'Watch' }
    ],
    documentation: [
      'Daily ward round entries with vitals, motor exam, drain output, pain score and mobility in the Ward Rounds module.',
      'Care Pathway day goals ticked off as they are achieved.',
      'Any pathway variance explicitly recorded with the reason.'
    ],
    linkedModules: [
      { target: 'pathway', label: 'Open the day-wise care pathway' },
      { target: 'inpatient:rounds', label: 'Chart the daily round' },
      { target: 'inpatient:prescriptions', label: 'Analgesia & prophylaxis' },
      { target: 'discharge', label: 'Discharge summary' }
    ],
    references: [
      'Debono B et al. Consensus statement for perioperative care in lumbar spinal fusion: ERAS Society recommendations. The Spine Journal, 2021.',
      'Wainwright TW et al. Enhanced recovery after surgery and spine surgery. Best Practice & Research Clinical Anaesthesiology, 2016.',
      'Soffin EM et al. Enhanced recovery after lumbar spine fusion. Anesthesiology Clinics.'
    ],
    auditMetrics: [
      { metric: 'Patients mobilised out of bed by POD 1', target: '> 90%' },
      { metric: 'Mean length of stay for single-level fusion', target: '≤ 3 days' },
      { metric: 'Unplanned 30-day readmission', target: '< 5%' }
    ]
  },

  {
    id: 'proto-post-02',
    code: 'STV-SP-POST-02',
    title: 'Multimodal Analgesia & Fusion-Safe Prescribing',
    shortLabel: 'Multimodal Analgesia (Fusion-Safe)',
    category: 'Post-Operative',
    summary:
      'Scheduled paracetamol and neuropathic agents form the base, with opioids reserved for rescue. NSAID use is deliberately restricted after arthrodesis because of the documented effect on fusion rates.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v3.8',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Amritesh Singh, Junior Spine Consultant',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every post-operative spine patient from emergence until discharge and beyond.'],
    contraindications: [
      'NSAIDs are avoided in instrumented arthrodesis, renal impairment, active peptic ulceration and uncontrolled hypertension.'
    ],
    phases: [
      {
        id: 'post02-ph1',
        title: 'Foundation — Scheduled, Not As-Required',
        steps: [
          {
            id: 'post02-s1',
            timing: 'From POD 0',
            action: 'Prescribe scheduled Paracetamol 1 g 8-hourly (maximum 3 g/day if weight is under 50 kg or hepatic impairment exists).',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post02-s2',
            timing: 'From POD 0',
            action: 'Add a gabapentinoid — Pregabalin 75 mg twice daily or Gabapentin 300 mg at night — for radicular and neuropathic pain.',
            responsible: 'Ward Registrar',
            detail: 'Halve the dose in the elderly and in renal impairment; watch for sedation and dizziness.'
          },
          {
            id: 'post02-s3',
            timing: 'From POD 0',
            action: 'Prescribe a muscle relaxant such as Thiocolchicoside 4 mg twice daily or Tizanidine 2 mg at night for paraspinal spasm.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post02-s4',
            timing: 'From POD 0',
            action: 'Add gastroprotection with Pantoprazole 40 mg once daily for the duration of the analgesic course.',
            responsible: 'Ward Registrar'
          }
        ]
      },
      {
        id: 'post02-ph2',
        title: 'Rescue Analgesia & Opioid Stewardship',
        steps: [
          {
            id: 'post02-s5',
            timing: 'POD 0 to POD 1',
            action: 'Use intravenous Tramadol 50–100 mg 8-hourly as required, or a fentanyl PCA for deformity and multi-level fusion cases.',
            responsible: 'Acute Pain Service'
          },
          {
            id: 'post02-s6',
            timing: 'POD 1 to POD 2',
            action: 'Step down to oral rescue opioid and stop the intravenous route once oral intake is established.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post02-s7',
            timing: 'At discharge',
            action: 'Limit the discharge opioid supply to 5–7 days with a written taper plan; no repeat prescription without clinic review.',
            responsible: 'Discharging Consultant',
            criticalStop: true
          },
          {
            id: 'post02-s8',
            timing: 'Throughout',
            action: 'Co-prescribe a stimulant laxative and stool softener with every opioid course.',
            responsible: 'Ward Registrar'
          }
        ]
      },
      {
        id: 'post02-ph3',
        title: 'NSAID Rules & Adjuncts',
        steps: [
          {
            id: 'post02-s9',
            timing: 'Non-fusion cases',
            action: 'For discectomy and decompression without arthrodesis, prescribe Aceclofenac 100 mg twice daily or Etoricoxib 90 mg once daily with food.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post02-s10',
            timing: 'Fusion cases',
            action: 'Avoid NSAIDs entirely for the first 6 weeks after instrumented arthrodesis; if unavoidable, use the lowest dose for the shortest period with consultant approval.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true,
            detail: 'High-dose, prolonged NSAID exposure is associated with pseudarthrosis after spinal fusion.'
          },
          {
            id: 'post02-s11',
            timing: 'Intra- and post-operative',
            action: 'Use adjuncts — local anaesthetic wound infiltration at closure, low-dose ketamine in opioid-tolerant patients, ice and positioning.',
            responsible: 'Anaesthesia / Acute Pain Service'
          },
          {
            id: 'post02-s12',
            timing: 'Every shift',
            action: 'Chart the VAS pain score at rest and on movement, and titrate against it rather than against the drug chart.',
            responsible: 'Ward Nursing Staff'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Paracetamol', dose: '1 g 8-hourly (max 3 g/day if < 50 kg)', route: 'IV then oral', timing: 'Scheduled from POD 0', notes: 'Backbone agent — never as-required only.' },
      { drug: 'Pregabalin', dose: '75 mg twice daily', route: 'Oral', timing: 'From POD 0, continue 4–6 weeks', notes: 'Reduce to 75 mg at night in the elderly or renal impairment.' },
      { drug: 'Tramadol', dose: '50–100 mg 8-hourly as required', route: 'IV then oral', timing: 'Rescue only', notes: 'Caution with serotonergic drugs and epilepsy.' },
      { drug: 'Thiocolchicoside', dose: '4 mg twice daily', route: 'Oral', timing: '5–7 days', notes: 'For paraspinal muscle spasm.' },
      { drug: 'Aceclofenac', dose: '100 mg twice daily', route: 'Oral', timing: 'Non-fusion cases only', notes: 'Contraindicated after instrumented arthrodesis for 6 weeks.' },
      { drug: 'Pantoprazole', dose: '40 mg once daily', route: 'IV then oral', timing: 'Throughout the analgesic course', notes: 'Gastroprotection.' },
      { drug: 'Bisacodyl / Docusate', dose: 'As per formulary', route: 'Oral', timing: 'With every opioid course', notes: 'Opioid-induced constipation prophylaxis.' }
    ],
    thresholds: [
      { parameter: 'VAS pain score', trigger: '> 6 despite scheduled analgesia', action: 'Review for a surgical cause — haematoma, retained fragment, screw irritation — before simply escalating opioids.', severity: 'Escalate' },
      { parameter: 'Respiratory rate', trigger: '< 10/min on opioids', action: 'Stop the opioid, give oxygen, consider naloxone and call for help.', severity: 'Critical' },
      { parameter: 'Sedation score', trigger: 'Increasing sedation with the same dose', action: 'Halve the opioid dose and review renal function.', severity: 'Escalate' },
      { parameter: 'Opioid duration', trigger: 'Still required beyond 2 weeks post-discharge', action: 'Clinic review; refer to the pain service; exclude a structural cause.', severity: 'Escalate' }
    ],
    documentation: [
      'Complete drug chart with scheduled and rescue analgesia in the Prescriptions module.',
      'VAS pain scores at rest and on movement in every ward round entry.',
      'Explicit NSAID restriction documented for fusion patients.'
    ],
    linkedModules: [
      { target: 'inpatient:prescriptions', label: 'Apply the analgesia bundle' },
      { target: 'inpatient:rounds', label: 'Chart pain scores' },
      { target: 'discharge', label: 'Discharge analgesia & taper' }
    ],
    references: [
      'Dunn LK et al. Non-opioid analgesics: novel approaches to perioperative analgesia for major spine surgery. Best Practice & Research Clinical Anaesthesiology, 2016.',
      'Li Q et al. NSAIDs and spinal fusion: a meta-analysis of the effect on non-union. European Spine Journal.',
      'ERAS Society consensus on perioperative pain management in spine surgery, 2021.'
    ],
    auditMetrics: [
      { metric: 'Patients on scheduled multimodal analgesia by POD 1', target: '> 95%' },
      { metric: 'Discharge opioid prescriptions exceeding 7 days', target: '< 10%' },
      { metric: 'NSAIDs prescribed to fusion patients within 6 weeks', target: '< 5%' }
    ]
  },

  {
    id: 'proto-post-03',
    code: 'STV-SP-POST-03',
    title: 'Post-Operative Neurological Surveillance & Motor Charting',
    shortLabel: 'Neuro Surveillance & Motor Charting',
    category: 'Post-Operative',
    summary:
      'Structured, time-bound neurological observation designed so that a developing epidural haematoma or a compressive deficit is detected within the window in which decompression still restores function.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.1',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ajay Krishnan, Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every patient after any spinal decompression, instrumentation or deformity procedure.'],
    phases: [
      {
        id: 'post03-ph1',
        title: 'Immediate Post-Operative Window (0–6 hours)',
        steps: [
          {
            id: 'post03-s1',
            timing: 'On emergence',
            action: 'Examine and document motor power in all key myotomes before the patient leaves the recovery room.',
            responsible: 'Operating Surgeon / Recovery Registrar',
            criticalStop: true
          },
          {
            id: 'post03-s2',
            timing: 'Hourly for 6 hours',
            action: 'Nursing staff chart hip flexion, knee extension, ankle dorsiflexion, great toe extension and plantarflexion bilaterally — and deltoid, biceps, triceps and hand grip after cervical surgery.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'post03-s3',
            timing: 'Hourly for 6 hours',
            action: 'Chart perineal sensation and bladder function, and record the time of the first spontaneous void.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post03-s4',
            timing: 'Any deterioration',
            action: 'A drop of one MRC grade or more, or new severe unrelieved back pain, is escalated immediately to the registrar and the operating consultant — never to the next round.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          }
        ]
      },
      {
        id: 'post03-ph2',
        title: 'Ward Phase (6–72 hours)',
        steps: [
          {
            id: 'post03-s5',
            timing: '2-hourly to POD 1, then each shift',
            action: 'Continue structured motor charting on the standard proforma so trends are visible at a glance.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post03-s6',
            timing: 'Daily',
            action: 'Registrar performs a full documented neurological examination on every ward round and compares it to the pre-operative baseline.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'post03-s7',
            timing: 'Before and after first LMWH dose',
            action: 'Perform a focused motor examination around chemical thromboprophylaxis initiation.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post03-s8',
            timing: 'Daily',
            action: 'Assess and chart the return of pre-operative radicular symptoms — resolution, persistence or new distribution.',
            responsible: 'Ward Registrar'
          }
        ]
      },
      {
        id: 'post03-ph3',
        title: 'Formal Assessments & Escalation',
        steps: [
          {
            id: 'post03-s9',
            timing: 'POD 1',
            action: 'Record a formal Post-Op Day 1 neurological assessment with MRC grading, dermatomal chart, reflexes and sphincter status in the Neuro Exam module.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post03-s10',
            timing: 'At discharge',
            action: 'Record the discharge neurological assessment with updated VAS, ODI or NDI and walking tolerance.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'post03-s11',
            timing: 'On any deficit',
            action: 'Any new or progressive deficit triggers the epidural haematoma pathway (STV-SP-EMR-02) — urgent MRI and consultant review within 60 minutes.',
            responsible: 'Ward Registrar + Consultant',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Motor power', trigger: 'Fall of ≥ 1 MRC grade from the post-operative baseline', action: 'Immediate consultant call and urgent MRI — do not wait for the morning round.', severity: 'Critical' },
      { parameter: 'Back pain', trigger: 'Severe, escalating, unrelieved by opioids', action: 'Suspect an expanding haematoma; examine and image urgently.', severity: 'Critical' },
      { parameter: 'Urinary function', trigger: 'Retention or incontinence after catheter removal', action: 'Bladder scan, re-catheterise, perform perineal sensation testing and exclude cauda equina.', severity: 'Critical' },
      { parameter: 'Saddle sensation', trigger: 'New numbness', action: 'Emergency — activate the cauda equina pathway (STV-SP-EMR-01).', severity: 'Critical' }
    ],
    redFlags: [
      'Progressive bilateral leg weakness in the first 24 hours after lumbar decompression.',
      'New upper limb weakness after cervical surgery — consider haematoma, C5 palsy or construct failure.',
      'Escalating pain that is disproportionate to the procedure performed.'
    ],
    documentation: [
      'Hourly nursing motor chart for the first 6 hours.',
      'Formal POD 1 and discharge neurological assessments in the Neuro Exam module.',
      'Timed escalation entries whenever a deficit is suspected.'
    ],
    linkedModules: [
      { target: 'inpatient:neuro-exam', label: 'Record formal neuro assessment' },
      { target: 'inpatient:rounds', label: 'Daily motor charting' },
      { target: 'pathway', label: 'Neurological milestones' }
    ],
    references: [
      'Awad JN et al. Analysis of the risk factors for the development of post-operative spinal epidural haematoma. JBJS Br, 2005.',
      'Fehlings MG et al. Timing of decompression in acute spinal cord injury — the value of early intervention.',
      'AOSpine post-operative neurological monitoring recommendations.'
    ],
    auditMetrics: [
      { metric: 'Hourly motor charts completed for the first 6 hours', target: '> 95%' },
      { metric: 'Time from deficit detection to MRI', target: '< 60 minutes' }
    ]
  },

  {
    id: 'proto-post-04',
    code: 'STV-SP-POST-04',
    title: 'Surgical Drain Management & Removal Criteria',
    shortLabel: 'Drain Management & Removal',
    category: 'Post-Operative',
    summary:
      'Objective criteria for drain monitoring and removal that balance haematoma prevention against the infection risk of a retained drain, with specific rules for drains near a repaired dura.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.4',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ravi Ranjan Rai, Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all' },
    indications: ['Any patient returning from theatre with a subfascial or subcutaneous surgical drain.'],
    phases: [
      {
        id: 'post04-ph1',
        title: 'Monitoring',
        steps: [
          {
            id: 'post04-s1',
            timing: 'On arrival at the ward',
            action: 'Confirm the drain type, size, site and suction setting against the operative record, and secure it.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'post04-s2',
            timing: 'Every 4 hours on POD 0, then every shift',
            action: 'Record drain volume and character; report any sudden increase, cessation or change to clear fluid.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post04-s3',
            timing: 'Daily',
            action: 'Chart the cumulative 24-hour output in the ward round entry and use it to inform VTE prophylaxis timing.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post04-s4',
            timing: 'Every shift',
            action: 'Inspect the drain exit site for erythema, discharge or leakage around the tube.',
            responsible: 'Ward Nursing Staff'
          }
        ]
      },
      {
        id: 'post04-ph2',
        title: 'Removal',
        steps: [
          {
            id: 'post04-s5',
            timing: 'POD 1 to POD 2',
            action: 'Remove the drain once the 24-hour output falls below 50 ml, or by POD 2 at the latest in routine cases.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post04-s6',
            timing: 'Before removal',
            action: 'Release the suction 30–60 minutes before removal, then withdraw the drain in one smooth movement during expiration.',
            responsible: 'Ward Registrar / Trained Nurse'
          },
          {
            id: 'post04-s7',
            timing: 'At removal',
            action: 'Close the drain site with a single suture or a sterile occlusive dressing and confirm the tip is intact.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'post04-s8',
            timing: 'After removal',
            action: 'Record the removal date, time and total cumulative output in the chart and in the discharge summary.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post04-s9',
            timing: 'Special case',
            action: 'Where the dura was repaired, keep the drain on gravity only and remove it early on consultant instruction — never on suction.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: '24-hour drain output', trigger: '> 250 ml of frank blood', action: 'Check haemoglobin and coagulation; withhold chemical prophylaxis; inform the consultant.', severity: 'Escalate' },
      { parameter: 'Drain character', trigger: 'Clear or straw-coloured fluid', action: 'Suspect a CSF leak — stop suction immediately and escalate (STV-SP-EMR-04).', severity: 'Critical' },
      { parameter: 'Sudden cessation with rising pain', trigger: 'Blocked drain with escalating back pain', action: 'Suspect a blocked drain and an accumulating haematoma; examine neurologically and image.', severity: 'Critical' },
      { parameter: 'Drain duration', trigger: 'Still in situ beyond POD 3', action: 'Consultant review; balance the rising infection risk against the reason for retention.', severity: 'Escalate' }
    ],
    documentation: [
      'Drain output and status in every ward round entry.',
      'Removal date, time and cumulative total recorded in the chart and discharge summary.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Chart drain output' },
      { target: 'ot-note', label: 'Drain placed at surgery' },
      { target: 'discharge', label: 'Drain removal summary' }
    ],
    references: [
      'Kanayama M et al. Is closed-suction drainage necessary for single-level lumbar decompression? Journal of Neurosurgery: Spine.',
      'Cochrane review — Closed suction drainage for spinal surgery.',
      'Waly F et al. The outcome of using closed suction wound drains in patients undergoing lumbar spine surgery. Global Spine Journal.'
    ],
    auditMetrics: [
      { metric: 'Drains removed by POD 2 in routine cases', target: '> 90%' },
      { metric: 'Drain-site infections', target: '< 1%' }
    ]
  },

  {
    id: 'proto-post-05',
    code: 'STV-SP-POST-05',
    title: 'Early Mobilisation & Spine Physiotherapy Progression',
    shortLabel: 'Mobilisation & Physiotherapy',
    category: 'Post-Operative',
    summary:
      'A day-by-day physiotherapy ladder from bed exercises to independent stair climbing, coupled with the spinal precautions and log-rolling technique the patient must own before discharge.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v3.3',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Parth Joshi, Head of Spine Physiotherapy & Rehabilitation',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every post-operative spine patient, with the ladder adjusted for deformity, cervical and neurologically impaired cases.'],
    contraindications: [
      'Delay upright mobilisation where a dural repair requires flat nursing, or where haemodynamic instability persists.'
    ],
    phases: [
      {
        id: 'post05-ph1',
        title: 'POD 0 — Bed Phase',
        steps: [
          {
            id: 'post05-s1',
            timing: 'POD 0',
            action: 'Teach and supervise log-rolling; the patient must never sit straight up from supine.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true
          },
          {
            id: 'post05-s2',
            timing: 'POD 0, hourly',
            action: 'Ankle pumps, static quadriceps and gluteal contractions, and deep breathing with incentive spirometry.',
            responsible: 'Spine Physiotherapist & Nursing'
          },
          {
            id: 'post05-s3',
            timing: 'POD 0, 4–8 hours',
            action: 'Sit the patient on the edge of the bed, then stand with assistance if haemodynamically stable and pain is controlled.',
            responsible: 'Spine Physiotherapist'
          }
        ]
      },
      {
        id: 'post05-ph2',
        title: 'POD 1 — Ambulation',
        steps: [
          {
            id: 'post05-s4',
            timing: 'POD 1 morning',
            action: 'Fit the brace or collar correctly with the patient lying down, then mobilise; teach the patient to apply it independently.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true
          },
          {
            id: 'post05-s5',
            timing: 'POD 1',
            action: 'Walk with a high walker for 20–50 metres, twice or three times through the day, with vitals monitored.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post05-s6',
            timing: 'POD 1',
            action: 'Teach safe transfers — bed to chair, sit to stand, and toilet transfer — using the hip-hinge and log-roll technique.',
            responsible: 'Spine Physiotherapist'
          }
        ]
      },
      {
        id: 'post05-ph3',
        title: 'POD 2–3 — Independence',
        steps: [
          {
            id: 'post05-s7',
            timing: 'POD 2',
            action: 'Progress to independent corridor ambulation of 100 metres or more with the brace, weaning the walker as balance allows.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post05-s8',
            timing: 'POD 2',
            action: 'Train stair climbing where the home environment requires it — one step at a time, leading with the stronger leg going up.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post05-s9',
            timing: 'POD 2 to POD 3',
            action: 'Teach the home exercise programme — walking schedule, posture, hip-hinge lifting, and the exercises deferred until 6 weeks.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post05-s10',
            timing: 'POD 3',
            action: 'Confirm the patient can demonstrate log-rolling, safe transfers, brace application and their walking programme unaided before discharge.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true
          }
        ]
      },
      {
        id: 'post05-ph4',
        title: 'Precautions the Patient Must Own',
        steps: [
          {
            id: 'post05-s11',
            timing: 'Before discharge',
            action: 'No bending forward at the waist, no twisting of the trunk, and no lifting over 3 kg for 6 weeks.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post05-s12',
            timing: 'Before discharge',
            action: 'Limit continuous sitting to 30–45 minutes; get up, walk briefly, then sit again.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'post05-s13',
            timing: 'Before discharge',
            action: 'Explain the walking progression — building to 30–45 minutes daily by 6 weeks — and the restriction on driving until reviewed.',
            responsible: 'Spine Physiotherapist'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Ambulation distance', trigger: '< 20 metres by POD 2', action: 'Physiotherapy and consultant review to identify the limiting factor.', severity: 'Escalate' },
      { parameter: 'Orthostatic hypotension on standing', trigger: 'Systolic drop > 20 mmHg with symptoms', action: 'Return to bed, assess volume status and haemoglobin, retry after correction.', severity: 'Watch' },
      { parameter: 'New leg pain during mobilisation', trigger: 'Radicular pain reproduced on standing', action: 'Stop, examine neurologically and inform the registrar.', severity: 'Escalate' }
    ],
    documentation: [
      'Daily mobility status and distance achieved in the Ward Rounds and Care Pathway modules.',
      'Physiotherapy assessment and home programme documented before discharge.',
      'Brace competency confirmed in the discharge record.'
    ],
    linkedModules: [
      { target: 'pathway', label: 'Mobilisation milestones' },
      { target: 'inpatient:rounds', label: 'Chart mobility status' },
      { target: 'connectors', label: 'Physiotherapy connector' },
      { target: 'discharge', label: 'Home exercise & precautions' }
    ],
    references: [
      'Burgess LC, Wainwright TW. What is the evidence for early mobilisation in elective spine surgery? A narrative review. Healthcare, 2019.',
      'ERAS Society spine consensus — early mobilisation recommendations, 2021.',
      'Oosterhuis T et al. Rehabilitation after lumbar disc surgery. Cochrane Database of Systematic Reviews.'
    ],
    auditMetrics: [
      { metric: 'Patients ambulating by POD 1', target: '> 90%' },
      { metric: 'Documented brace competency before discharge', target: '100%' }
    ]
  },

  {
    id: 'proto-post-06',
    code: 'STV-SP-POST-06',
    title: 'Urinary Catheter Removal & Post-Operative Retention',
    shortLabel: 'Catheter Removal & Retention (POUR)',
    category: 'Post-Operative',
    summary:
      'Early catheter removal to reduce infection, paired with a structured retention pathway — because post-operative urinary retention after spinal surgery must always be distinguished from cauda equina compression.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.2',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Amritesh Singh, Junior Spine Consultant',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every patient catheterised for spinal surgery, and any patient who fails to void after surgery.'],
    phases: [
      {
        id: 'post06-ph1',
        title: 'Catheter Removal',
        steps: [
          {
            id: 'post06-s1',
            timing: 'POD 1 morning',
            action: 'Remove the urinary catheter on the first post-operative morning once the patient can be assisted to a toilet or commode.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post06-s2',
            timing: 'POD 1',
            action: 'Record the time of removal and monitor for a spontaneous void within 6 hours.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'post06-s3',
            timing: 'POD 1 onward',
            action: 'Encourage upright voiding, adequate oral fluids and privacy; avoid a bedpan where the patient can reach a commode.',
            responsible: 'Ward Nursing Staff'
          }
        ]
      },
      {
        id: 'post06-ph2',
        title: 'Retention Pathway',
        steps: [
          {
            id: 'post06-s4',
            timing: '6 hours after removal',
            action: 'If there is no void, perform a bladder scan and record the residual volume.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'post06-s5',
            timing: 'On retention',
            action: 'Before re-catheterising, examine perineal sensation, anal tone and lower limb power to exclude cauda equina compression.',
            responsible: 'Ward Registrar',
            criticalStop: true,
            detail: 'Retention plus saddle numbness is cauda equina syndrome until an MRI says otherwise — never dismissed as opioid effect.'
          },
          {
            id: 'post06-s6',
            timing: 'On retention',
            action: 'Re-catheterise if the residual volume exceeds 400 ml, or perform intermittent catheterisation; review opioid and anticholinergic doses.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post06-s7',
            timing: 'POD 2 to POD 3',
            action: 'Attempt a second trial without catheter after 24–48 hours; consider Tamsulosin 0.4 mg at night in male patients with prostatism.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post06-s8',
            timing: 'Persistent retention',
            action: 'Refer to urology if retention persists beyond the second trial, and arrange MRI if any neurological sign accompanies it.',
            responsible: 'Ward Registrar + Consultant',
            criticalStop: true
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Tamsulosin', dose: '0.4 mg once daily at night', route: 'Oral', timing: 'On retention in males or prophylactically in known prostatism', notes: 'Watch for orthostatic hypotension during early mobilisation.' }
    ],
    thresholds: [
      { parameter: 'Post-void residual volume', trigger: '> 400 ml', action: 'Re-catheterise and start the retention pathway.', severity: 'Escalate' },
      { parameter: 'Retention with saddle anaesthesia', trigger: 'Any occurrence', action: 'Emergency MRI and consultant call — activate the cauda equina pathway (STV-SP-EMR-01).', severity: 'Critical' },
      { parameter: 'Catheter duration', trigger: '> 48 hours without indication', action: 'Remove; each additional day materially raises the catheter-associated UTI risk.', severity: 'Escalate' }
    ],
    documentation: [
      'Catheter removal time and the time of the first spontaneous void in the nursing chart.',
      'Bladder scan residual volumes recorded.',
      'Neurological examination documented before any re-catheterisation for retention.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Bowel & bladder charting' },
      { target: 'inpatient:neuro-exam', label: 'Sphincter assessment' },
      { target: 'pathway', label: 'POD 1 catheter milestone' }
    ],
    references: [
      'Baldini G et al. Postoperative urinary retention: anesthetic and perioperative considerations. Anesthesiology, 2009.',
      'Gould CV et al. CDC Guideline for Prevention of Catheter-Associated Urinary Tract Infections.',
      'Golubovsky JL et al. Risk factors and associated complications for postoperative urinary retention after lumbar surgery. The Spine Journal, 2018.'
    ],
    auditMetrics: [
      { metric: 'Catheters removed by POD 1', target: '> 90%' },
      { metric: 'Catheter-associated urinary tract infections', target: '< 1%' }
    ]
  },

  {
    id: 'proto-post-07',
    code: 'STV-SP-POST-07',
    title: 'Post-Operative Nutrition, Bowel Care & Ileus Prevention',
    shortLabel: 'Nutrition, Bowel Care & Ileus',
    category: 'Post-Operative',
    summary:
      'Early feeding and proactive bowel management prevent the opioid-driven constipation and post-operative ileus that quietly extend spine admissions, with specific vigilance after anterior and lateral approaches.',
    priority: 'Strongly Recommended',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.1',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Shivanand Mayi, Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every post-operative spine patient; heightened vigilance after ALIF, OLIF, XLIF and anterior thoracolumbar approaches.'],
    phases: [
      {
        id: 'post07-ph1',
        title: 'Feeding',
        steps: [
          {
            id: 'post07-s1',
            timing: 'POD 0, 4 hours',
            action: 'Start clear oral fluids once the patient is awake, protecting the airway and free of nausea.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post07-s2',
            timing: 'POD 0 evening',
            action: 'Progress to a light diet, then to a normal high-protein diet on POD 1.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post07-s3',
            timing: 'POD 1 onward',
            action: 'Provide 1.2–1.5 g/kg/day of protein to support wound healing and fusion, with dietitian input for diabetic and malnourished patients.',
            responsible: 'Clinical Nutrition Team'
          },
          {
            id: 'post07-s4',
            timing: 'Anterior approaches',
            action: 'After ALIF, OLIF or XLIF, advance the diet only once bowel sounds return and the abdomen is soft and non-distended.',
            responsible: 'Ward Registrar',
            criticalStop: true
          }
        ]
      },
      {
        id: 'post07-ph2',
        title: 'Bowel Management',
        steps: [
          {
            id: 'post07-s5',
            timing: 'POD 0 onward',
            action: 'Prescribe a stool softener and a stimulant laxative prophylactically with every opioid course — not on request.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'post07-s6',
            timing: 'Daily',
            action: 'Chart bowel sounds, flatus, bowel movements and abdominal girth in the ward round entry.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'post07-s7',
            timing: 'POD 2 to POD 3',
            action: 'If there is no bowel movement by POD 3, escalate to a suppository or an enema after excluding obstruction.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post07-s8',
            timing: 'Throughout',
            action: 'Encourage mobilisation, oral hydration and dietary fibre as first-line bowel management.',
            responsible: 'Ward Nursing & Physiotherapy'
          }
        ]
      },
      {
        id: 'post07-ph3',
        title: 'Ileus Recognition',
        steps: [
          {
            id: 'post07-s9',
            timing: 'On suspicion',
            action: 'For abdominal distension with vomiting and absent bowel sounds, keep the patient nil by mouth, place a nasogastric tube and correct electrolytes.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'post07-s10',
            timing: 'On suspicion',
            action: 'Minimise opioids, use non-opioid analgesia, and correct hypokalaemia and hypomagnesaemia.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'post07-s11',
            timing: 'On suspicion',
            action: 'Obtain an erect abdominal radiograph and a general surgical opinion if there is no improvement within 24 hours.',
            responsible: 'Ward Registrar'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'No bowel movement', trigger: 'By POD 3', action: 'Escalate laxatives; exclude obstruction and ileus.', severity: 'Watch' },
      { parameter: 'Abdominal distension with vomiting', trigger: 'Any occurrence', action: 'Nil by mouth, nasogastric decompression, electrolytes, surgical opinion.', severity: 'Escalate' },
      { parameter: 'Serum potassium', trigger: '< 3.5 mmol/L', action: 'Replace — hypokalaemia both causes and prolongs ileus.', severity: 'Escalate' },
      { parameter: 'Abdominal pain after anterior approach', trigger: 'Severe or peritonitic', action: 'Urgent surgical review to exclude visceral or vascular injury.', severity: 'Critical' }
    ],
    documentation: [
      'Diet status and bowel/bladder entries in every ward round.',
      'Laxative prescription charted alongside every opioid.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Bowel & diet charting' },
      { target: 'inpatient:prescriptions', label: 'Laxative orders' },
      { target: 'pathway', label: 'Diet progression' }
    ],
    references: [
      'Fineberg SJ et al. Incidence and risk factors for postoperative ileus following anterior, posterior and circumferential lumbar fusion. The Spine Journal, 2014.',
      'ERAS Society consensus — early oral nutrition after spine surgery, 2021.',
      'Vather R et al. Management of prolonged post-operative ileus: evidence-based recommendations. ANZ Journal of Surgery.'
    ],
    auditMetrics: [
      { metric: 'Patients tolerating oral diet by POD 1', target: '> 90%' },
      { metric: 'Post-operative ileus rate after anterior lumbar approaches', target: '< 7%' }
    ]
  }
];
