import { ClinicalProtocol } from '../../types/protocol';

// ============================================================================
// INTRA-OPERATIVE SPINE SURGERY PROTOCOLS (STV-SP-INT-xx)
// Stavya Spine Hospital — Department of Spine Surgery
// ============================================================================

export const INTRA_OPERATIVE_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'proto-int-01',
    code: 'STV-SP-INT-01',
    title: 'WHO Surgical Safety Checklist — Spine Adaptation',
    shortLabel: 'WHO Safety Checklist (Spine)',
    category: 'Intra-Operative',
    summary:
      'The WHO three-phase checklist extended with spine-specific items: level confirmation under fluoroscopy, implant availability, neuromonitoring baseline and the closing neurological plan.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade A (Level I Evidence)',
    version: 'v4.1',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every procedure performed in the spine operating rooms, elective or emergency.'],
    phases: [
      {
        id: 'int01-ph1',
        title: 'Sign-In — Before Induction of Anaesthesia',
        steps: [
          {
            id: 'int01-s1',
            timing: 'Before induction',
            action: 'Confirm patient identity, operative site and side, procedure and signed consent with the awake patient.',
            responsible: 'Anaesthesia & OT Nursing',
            criticalStop: true
          },
          {
            id: 'int01-s2',
            timing: 'Before induction',
            action: 'Confirm the skin site mark is present and will remain visible after draping.',
            responsible: 'OT Nursing Staff',
            criticalStop: true
          },
          {
            id: 'int01-s3',
            timing: 'Before induction',
            action: 'Complete the anaesthesia machine and medication check; confirm the pulse oximeter is on and functioning.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'int01-s4',
            timing: 'Before induction',
            action: 'Declare known allergies, difficult airway or aspiration risk, and anticipated blood loss above 500 ml with adequate IV access and blood availability.',
            responsible: 'Consultant Anaesthesiologist'
          }
        ]
      },
      {
        id: 'int01-ph2',
        title: 'Time-Out — Before Skin Incision',
        steps: [
          {
            id: 'int01-s5',
            timing: 'Before incision',
            action: 'All team members introduce themselves by name and role; the room falls silent for the Time-Out.',
            responsible: 'Whole Operating Team',
            criticalStop: true
          },
          {
            id: 'int01-s6',
            timing: 'Before incision',
            action: 'Surgeon, anaesthetist and nurse verbally confirm the patient, the procedure, the approach, the intended vertebral levels and the side.',
            responsible: 'Whole Operating Team',
            criticalStop: true
          },
          {
            id: 'int01-s7',
            timing: 'Before incision',
            action: 'Confirm the spinal level has been or will be verified under fluoroscopy before any bone or disc removal.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int01-s8',
            timing: 'Before incision',
            action: 'Confirm implant trays, sizes and the required instrument sets are physically present, sterile and opened in the room.',
            responsible: 'Scrub Nurse & CSSD',
            criticalStop: true
          },
          {
            id: 'int01-s9',
            timing: 'Before incision',
            action: 'Confirm antibiotic prophylaxis was given within the preceding 60 minutes.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'int01-s10',
            timing: 'Before incision',
            action: 'Confirm neuromonitoring leads are connected and a stable baseline has been established and accepted.',
            responsible: 'Neurophysiology Technologist'
          },
          {
            id: 'int01-s11',
            timing: 'Before incision',
            action: 'Confirm essential imaging is displayed on the operating room screen in the correct orientation.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int01-s12',
            timing: 'Before incision',
            action: 'Surgeon states the anticipated critical steps, expected duration and blood loss; anaesthesia and nursing state their specific concerns.',
            responsible: 'Whole Operating Team'
          }
        ]
      },
      {
        id: 'int01-ph3',
        title: 'Sign-Out — Before the Patient Leaves the Room',
        steps: [
          {
            id: 'int01-s13',
            timing: 'Before leaving OR',
            action: 'Nurse reads back the procedure as performed, including the actual operated levels.',
            responsible: 'Circulating Nurse',
            criticalStop: true
          },
          {
            id: 'int01-s14',
            timing: 'Before leaving OR',
            action: 'Confirm instrument, sponge, needle and cottonoid counts are complete and correct.',
            responsible: 'Scrub & Circulating Nurse',
            criticalStop: true
          },
          {
            id: 'int01-s15',
            timing: 'Before leaving OR',
            action: 'Confirm all specimens are labelled with patient identity, level and side.',
            responsible: 'Circulating Nurse'
          },
          {
            id: 'int01-s16',
            timing: 'Before leaving OR',
            action: 'Record any equipment problems and log implant lot numbers into the traceability ledger.',
            responsible: 'Circulating Nurse & CSSD'
          },
          {
            id: 'int01-s17',
            timing: 'Before leaving OR',
            action: 'Surgeon, anaesthetist and nurse agree the recovery plan, including the frequency of post-operative neurological observation.',
            responsible: 'Whole Operating Team',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Sponge or instrument count', trigger: 'Any discrepancy', action: 'Do not close. Repeat the count, search the field and obtain an intra-operative radiograph before closure.', severity: 'Critical' },
      { parameter: 'Implant availability', trigger: 'Required size unavailable at Time-Out', action: 'Do not incise. Resolve with CSSD and the vendor before starting.', severity: 'Critical' },
      { parameter: 'Neuromonitoring baseline', trigger: 'Unobtainable or unstable', action: 'Discuss with the consultant before incision; document the decision and the alternative safety strategy.', severity: 'Escalate' }
    ],
    documentation: [
      'All three checklist phases completed in the WHO Safety Checklist module with the completing person named.',
      'Any checklist variance explicitly recorded and reported to the quality department.'
    ],
    linkedModules: [
      { target: 'inpatient:who-checklist', label: 'Open the WHO checklist' },
      { target: 'ot-note', label: 'Operative record' },
      { target: 'connectors', label: 'CSSD & OT connector' }
    ],
    references: [
      'Haynes AB et al. A Surgical Safety Checklist to Reduce Morbidity and Mortality in a Global Population. NEJM, 2009.',
      'WHO Surgical Safety Checklist, 2009 revision.',
      'NABH Accreditation Standards for Hospitals, 5th edition — Care of Patients.'
    ],
    auditMetrics: [
      { metric: 'Checklist fully completed across all three phases', target: '100%' },
      { metric: 'Retained foreign body events', target: '0 (never event)' }
    ]
  },

  {
    id: 'proto-int-02',
    code: 'STV-SP-INT-02',
    title: 'Operative Positioning & Pressure-Point Protection',
    shortLabel: 'Positioning & Pressure Protection',
    category: 'Intra-Operative',
    summary:
      'Prone, supine and lateral positioning standards for spine surgery. Protects the eyes, brachial plexus, ulnar nerve and abdominal viscera, and keeps the abdomen free to reduce epidural venous bleeding.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.2',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Kashyap Rameshchandra Shah, Head of Anaesthesia',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every spinal procedure requiring general anaesthesia and operative positioning.'],
    phases: [
      {
        id: 'int02-ph1',
        title: 'Pre-Positioning Preparation',
        steps: [
          {
            id: 'int02-s1',
            timing: 'Before turning',
            action: 'Assign a positioning lead and brief the team; a minimum of five people are required to log-roll an anaesthetised spine patient.',
            responsible: 'Operating Surgeon',
            detail: 'The anaesthetist controls the head and calls the turn.'
          },
          {
            id: 'int02-s2',
            timing: 'Before turning',
            action: 'Secure the endotracheal tube, all vascular lines, the urinary catheter and neuromonitoring leads before the turn.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'int02-s3',
            timing: 'Before turning',
            action: 'Maintain in-line cervical stabilisation throughout the turn in every cervical instability and myelopathy case.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int02-ph2',
        title: 'Prone Positioning (Posterior Approaches)',
        steps: [
          {
            id: 'int02-s4',
            timing: 'At positioning',
            action: 'Position on a Jackson or Relton-Hall frame with chest and iliac supports so the abdomen hangs completely free.',
            responsible: 'Operating Surgeon & OT Team',
            detail: 'A compressed abdomen raises epidural venous pressure and blood loss substantially.'
          },
          {
            id: 'int02-s5',
            timing: 'At positioning',
            action: 'Protect the eyes with tape and a Prone-View or horseshoe headrest; verify there is no globe pressure and reconfirm every 20 minutes.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true,
            detail: 'Direct globe compression is the mechanism of central retinal artery occlusion and irreversible blindness.'
          },
          {
            id: 'int02-s6',
            timing: 'At positioning',
            action: 'Abduct the shoulders less than 90° with the elbows flexed and padded to protect the brachial plexus and ulnar nerve.',
            responsible: 'OT Nursing Staff'
          },
          {
            id: 'int02-s7',
            timing: 'At positioning',
            action: 'Pad the knees, ankles, anterior superior iliac spines and male genitalia; keep the breasts free of compression in female patients.',
            responsible: 'OT Nursing Staff'
          },
          {
            id: 'int02-s8',
            timing: 'At positioning',
            action: 'Place the hips and knees in slight flexion; use reverse Trendelenburg to reduce venous congestion in long cases.',
            responsible: 'Operating Surgeon'
          }
        ]
      },
      {
        id: 'int02-ph3',
        title: 'Supine & Lateral Positioning (Anterior and Lateral Approaches)',
        steps: [
          {
            id: 'int02-s9',
            timing: 'At positioning',
            action: 'For anterior cervical work, place a small interscapular roll with mild neck extension — avoid hyperextension in stenotic or myelopathic necks.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int02-s10',
            timing: 'At positioning',
            action: 'Apply gentle shoulder taping for cervical fluoroscopic visualisation, avoiding brachial plexus traction.',
            responsible: 'OT Nursing Staff'
          },
          {
            id: 'int02-s11',
            timing: 'At positioning',
            action: 'For lateral transpsoas approaches, secure a true 90° lateral position with the table break at the iliac crest and taping over the greater trochanter and thorax.',
            responsible: 'Operating Surgeon',
            detail: 'True lateral orientation is essential for safe psoas docking and neural mapping.'
          },
          {
            id: 'int02-s12',
            timing: 'At positioning',
            action: 'Place an axillary roll and pad the dependent limb in every lateral case.',
            responsible: 'OT Nursing Staff'
          }
        ]
      },
      {
        id: 'int02-ph4',
        title: 'Ongoing Vigilance',
        steps: [
          {
            id: 'int02-s13',
            timing: 'Every 20 minutes',
            action: 'Re-check eye and pressure-point status and record the check in the anaesthesia chart.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'int02-s14',
            timing: 'Every 2 hours',
            action: 'For cases exceeding 4 hours, reposition the head and re-check limb perfusion.',
            responsible: 'Anaesthesia & OT Nursing'
          },
          {
            id: 'int02-s15',
            timing: 'After positioning and after turning back',
            action: 'Re-establish and confirm neuromonitoring signals immediately after final positioning.',
            responsible: 'Neurophysiology Technologist',
            criticalStop: true,
            detail: 'A signal loss appearing at this point is positional until proven otherwise — reposition first.'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Neuromonitoring change after positioning', trigger: 'Any amplitude drop after the turn', action: 'Return the patient to the neutral position immediately and reassess before starting surgery.', severity: 'Critical' },
      { parameter: 'Operative duration prone', trigger: '> 6 hours', action: 'Formal ophthalmic risk documentation; raise mean arterial pressure and re-verify head position.', severity: 'Escalate' },
      { parameter: 'Peak airway pressure', trigger: 'Rise after proning', action: 'Recheck abdominal freedom and chest support placement.', severity: 'Watch' }
    ],
    redFlags: [
      'Post-operative visual loss or eye pain — emergency ophthalmology referral.',
      'New post-operative upper limb weakness after prone positioning — suspect a positional brachial plexus injury.'
    ],
    documentation: [
      'Position, frame type, padding and eye protection recorded in the Operative Record.',
      'Time-stamped pressure-point checks in the anaesthesia chart.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Record position & padding' },
      { target: 'connectors', label: 'Anaesthesia connector' }
    ],
    references: [
      'ASA Practice Advisory for Perioperative Visual Loss Associated with Spine Surgery, 2019.',
      'Kwee MM et al. The prone position during surgery and its complications. Surgical Laparoscopy Endoscopy & Percutaneous Techniques, 2015.',
      'Postoperative Visual Loss Study Group. Risk factors associated with ischemic optic neuropathy after spinal fusion surgery. Anesthesiology, 2012.'
    ],
    auditMetrics: [
      { metric: 'Positioning-related nerve or pressure injuries', target: '0' },
      { metric: 'Documented 20-minute eye checks in prone cases', target: '100%' }
    ]
  },

  {
    id: 'proto-int-03',
    code: 'STV-SP-INT-03',
    title: 'Intra-Operative Neuromonitoring Alert & Rescue Algorithm',
    shortLabel: 'IONM Alert & Rescue Algorithm',
    category: 'Intra-Operative',
    summary:
      'A structured, rehearsed response to loss of motor or somatosensory signals. The team works through anaesthetic, systemic and surgical causes in parallel, with a defined time limit before implants are removed or the correction is reversed.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.5',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ajay Krishnan, Consultant Spine Surgeon',
    applicability: {
      regions: 'all',
      procedureKeywords: ['fusion', 'deformity', 'scoliosis', 'osteotomy', 'corpectomy', 'decompression', 'instrument', 'acdf', 'tlif', 'myelopathy'],
      statuses: 'all'
    },
    indications: [
      'All deformity correction, osteotomy, corpectomy and multi-level instrumented procedures.',
      'All cervical and thoracic decompression for myelopathy.',
      'Any case where cord or root injury risk is judged significant by the operating consultant.'
    ],
    phases: [
      {
        id: 'int03-ph1',
        title: 'Baseline Establishment',
        steps: [
          {
            id: 'int03-s1',
            timing: 'After induction, before incision',
            action: 'Establish reproducible MEP, SSEP and free-run EMG baselines and have the surgeon formally accept them.',
            responsible: 'Neurophysiology Technologist',
            criticalStop: true
          },
          {
            id: 'int03-s2',
            timing: 'After induction',
            action: 'Confirm total intravenous anaesthesia with propofol and remifentanil, no neuromuscular blockade after intubation, and volatile agents below 0.5 MAC.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'int03-s3',
            timing: 'After positioning',
            action: 'Repeat the baseline after final positioning to exclude a positional deficit before surgery begins.',
            responsible: 'Neurophysiology Technologist'
          }
        ]
      },
      {
        id: 'int03-ph2',
        title: 'Alert Criteria & Immediate Response',
        steps: [
          {
            id: 'int03-s4',
            timing: 'On alert',
            action: 'Declare the alert aloud: MEP amplitude falling more than 75–80% from baseline, SSEP amplitude falling more than 50% or latency increasing more than 10%, or sustained free-run EMG neurotonic discharge.',
            responsible: 'Neurophysiology Technologist',
            criticalStop: true
          },
          {
            id: 'int03-s5',
            timing: 'Within 1 minute',
            action: 'Surgeon stops all manipulation, correction and distraction immediately, and notes the exact surgical step in progress.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int03-s6',
            timing: 'Within 2 minutes',
            action: 'Technologist checks technical causes — electrode displacement, cable disconnection, stimulator settings and electrical interference.',
            responsible: 'Neurophysiology Technologist'
          },
          {
            id: 'int03-s7',
            timing: 'Within 3 minutes',
            action: 'Anaesthesia raises mean arterial pressure above 85–90 mmHg, corrects anaemia, temperature and hypocapnia, and confirms no bolus of anaesthetic or relaxant was given.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'int03-s8',
            timing: 'Within 5 minutes',
            action: 'Surgeon inspects the field for cord compression, haematoma, misplaced implants, over-distraction or a translational shift, and removes any offending hardware.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int03-s9',
            timing: 'Within 10 minutes',
            action: 'Reverse the most recent surgical manoeuvre — release the correction, reduce distraction, remove the rod or the cage.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'int03-s10',
            timing: 'Within 15–20 minutes',
            action: 'If signals have not recovered, consider a Stagnara wake-up test and give methylprednisolone only on explicit consultant instruction.',
            responsible: 'Operating Consultant + Anaesthesiologist'
          },
          {
            id: 'int03-s11',
            timing: 'After the event',
            action: 'If signals stay lost, abandon further correction, secure and close, and arrange an immediate post-operative MRI or CT with a neurology review.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int03-ph3',
        title: 'Documentation & Debrief',
        steps: [
          {
            id: 'int03-s12',
            timing: 'End of case',
            action: 'Record the exact alert time, the surgical step, every intervention, the recovery time and the closing signal status in the Operative Record.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int03-s13',
            timing: 'Immediately post-op',
            action: 'Perform and document a wake-up neurological examination in the recovery room and hand over to the ward team in person.',
            responsible: 'Operating Surgeon + Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'int03-s14',
            timing: 'Within 24 hours',
            action: 'Hold a team debrief and submit the event to the departmental morbidity review.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Propofol (TIVA)', dose: '75–150 mcg/kg/min', route: 'IV infusion', timing: 'Throughout the monitored case', notes: 'Preserves MEP amplitude far better than volatile anaesthesia.' },
      { drug: 'Remifentanil', dose: '0.1–0.3 mcg/kg/min', route: 'IV infusion', timing: 'Throughout', notes: 'Opioid of choice alongside TIVA for monitored cases.' },
      { drug: 'Noradrenaline', dose: 'Titrated to MAP > 85 mmHg', route: 'IV infusion', timing: 'On IONM alert', notes: 'Raising cord perfusion pressure is the first systemic rescue manoeuvre.' },
      { drug: 'Methylprednisolone', dose: 'Consultant-directed dosing only', route: 'IV', timing: 'On IONM alert with persistent loss', notes: 'Not routine. Weigh against infection and hyperglycaemia risk; document the decision.' }
    ],
    thresholds: [
      { parameter: 'MEP amplitude', trigger: 'Fall > 75–80% from baseline', action: 'Declare an alert and run the rescue algorithm.', severity: 'Critical' },
      { parameter: 'SSEP amplitude / latency', trigger: 'Amplitude fall > 50% or latency increase > 10%', action: 'Declare an alert and run the rescue algorithm.', severity: 'Critical' },
      { parameter: 'Mean arterial pressure', trigger: '< 80 mmHg during an alert', action: 'Raise MAP above 85–90 mmHg with vasopressors and volume.', severity: 'Critical' },
      { parameter: 'Triggered EMG on pedicle screw', trigger: 'Threshold < 8 mA', action: 'Assume medial or inferior breach — remove, re-probe the tract and redirect the screw.', severity: 'Critical' },
      { parameter: 'Signal recovery time', trigger: 'No recovery within 20 minutes of the alert', action: 'Abandon correction, close, and obtain urgent post-operative imaging.', severity: 'Critical' }
    ],
    redFlags: [
      'Sudden bilateral MEP loss during deformity correction — reverse the correction first, investigate afterwards.',
      'Unilateral loss during pedicle screw insertion — remove that screw before anything else.'
    ],
    documentation: [
      'Neuromonitoring modalities, baseline status, intra-operative events and closing status in the Operative Record.',
      'Alert timeline with interventions and recovery time.',
      'Recovery-room wake-up examination in the Neuro Exam module.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Neuromonitoring section of OT note' },
      { target: 'inpatient:neuro-exam', label: 'Post-op wake-up exam' },
      { target: 'inpatient:who-checklist', label: 'Baseline confirmation' }
    ],
    references: [
      'Vitale MG et al. Best practices in intraoperative neuromonitoring in spine deformity surgery. Spine Deformity, 2014.',
      'Nuwer MR et al. Evidence-based guideline update: intraoperative spinal monitoring. Neurology, 2012.',
      'Ziewacz JE et al. Crisis checklist for the operating room: neuromonitoring signal loss. Neurosurgical Focus, 2012.'
    ],
    auditMetrics: [
      { metric: 'Monitored cases with an accepted pre-incision baseline', target: '100%' },
      { metric: 'IONM alerts with a documented structured response timeline', target: '100%' },
      { metric: 'New permanent neurological deficit after deformity correction', target: '< 1%' }
    ]
  },

  {
    id: 'proto-int-04',
    code: 'STV-SP-INT-04',
    title: 'Intra-Operative Imaging, Navigation & Radiation Safety (ALARA)',
    shortLabel: 'Fluoroscopy, Navigation & ALARA',
    category: 'Intra-Operative',
    summary:
      'Governs fluoroscopic level confirmation, navigation and robotic workflows, and the radiation dose discipline that protects the patient and the operating team over a career of spine surgery.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.9',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ravi Ranjan Rai, Consultant Spine Surgeon & Radiation Safety Officer',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every procedure using fluoroscopy, intra-operative CT, navigation or robotic guidance.'],
    phases: [
      {
        id: 'int04-ph1',
        title: 'Set-Up & Level Confirmation',
        steps: [
          {
            id: 'int04-s1',
            timing: 'Before draping',
            action: 'Confirm that adequate AP and lateral fluoroscopic images of the target level can be obtained in the final operative position.',
            responsible: 'Operating Surgeon',
            criticalStop: true,
            detail: 'In obese or high-thoracic cases, verify imaging feasibility before the incision, not after.'
          },
          {
            id: 'int04-s2',
            timing: 'After exposure',
            action: 'Perform marker-based level localisation counting from a fixed landmark, and have the consultant sign it off.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'int04-s3',
            timing: 'During instrumentation',
            action: 'Confirm every pedicle screw trajectory on AP and lateral projections, or on navigation, before final seating.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int04-s4',
            timing: 'Before closure',
            action: 'Obtain final AP and lateral images documenting implant position, alignment and the operated levels.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int04-ph2',
        title: 'Navigation & Robotic Workflow',
        steps: [
          {
            id: 'int04-s5',
            timing: 'At set-up',
            action: 'Fix the reference array to a rigid bony landmark well away from the working corridor and verify it has not moved after each retractor adjustment.',
            responsible: 'Operating Surgeon',
            detail: 'A bumped reference array is the leading cause of navigation error and screw malposition.'
          },
          {
            id: 'int04-s6',
            timing: 'Before use',
            action: 'Verify navigation accuracy against a known anatomical landmark and re-verify after every registration event.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int04-s7',
            timing: 'During screw placement',
            action: 'Cross-check navigated trajectories against direct anatomical palpation of the pedicle walls and triggered EMG.',
            responsible: 'Operating Surgeon',
            detail: 'Navigation supplements anatomical judgement; it never replaces it.'
          }
        ]
      },
      {
        id: 'int04-ph3',
        title: 'Radiation Protection (ALARA)',
        steps: [
          {
            id: 'int04-s8',
            timing: 'Throughout',
            action: 'Every person in the room wears a lead apron, thyroid shield and, for the primary surgeon, leaded glasses; dosimeters are worn and read monthly.',
            responsible: 'Whole Operating Team',
            criticalStop: true
          },
          {
            id: 'int04-s9',
            timing: 'Throughout',
            action: 'Use pulsed and low-dose fluoroscopy, collimate tightly, and prefer stored last-image-hold over live screening.',
            responsible: 'Radiographer / Operating Surgeon'
          },
          {
            id: 'int04-s10',
            timing: 'Throughout',
            action: 'Keep the image intensifier close to the patient and the X-ray tube below the table; step back during acquisition.',
            responsible: 'Radiographer'
          },
          {
            id: 'int04-s11',
            timing: 'End of case',
            action: 'Record total fluoroscopy time and dose-area product in the Operative Record.',
            responsible: 'Radiographer / Operating Surgeon'
          },
          {
            id: 'int04-s12',
            timing: 'Always',
            action: 'Confirm pregnancy status before any imaging in a woman of childbearing age; use abdominal shielding where imaging is unavoidable.',
            responsible: 'Anaesthesia & OT Nursing',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Fluoroscopy time', trigger: '> 120 seconds for a single-level percutaneous case', action: 'Review technique with the radiation safety officer; consider navigation.', severity: 'Watch' },
      { parameter: 'Navigation accuracy check', trigger: 'Deviation > 2 mm from a known landmark', action: 'Re-register before placing any further implants.', severity: 'Critical' },
      { parameter: 'Cumulative staff dosimeter reading', trigger: 'Approaching the annual regulatory limit', action: 'Rotate staff out of high-exposure cases and audit technique.', severity: 'Escalate' }
    ],
    documentation: [
      'C-arm level confirmation flag, fluoroscopy time and dose-area product in the Operative Record.',
      'Navigation or robotic system and registration method recorded.',
      'Final intra-operative images stored against the case in Clinical Reports.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Fluoroscopy time & dose' },
      { target: 'anatomy', label: 'Confirm operative levels' },
      { target: 'reports', label: 'Intra-operative imaging' }
    ],
    references: [
      'ICRP Publication 117 — Radiological Protection in Fluoroscopically Guided Procedures.',
      'AERB Safety Code for Medical Diagnostic X-Ray Equipment and Installations (India).',
      'Srinivasan D et al. Radiation safety and spine surgery: systematic review. Neurosurgical Focus, 2014.'
    ],
    auditMetrics: [
      { metric: 'Cases with documented fluoroscopy time and dose', target: '100%' },
      { metric: 'Pedicle screw malposition requiring revision', target: '< 2%' }
    ]
  },

  {
    id: 'proto-int-05',
    code: 'STV-SP-INT-05',
    title: 'Incidental Durotomy & Intra-Operative CSF Leak Management',
    shortLabel: 'Durotomy & CSF Leak Management',
    category: 'Intra-Operative',
    summary:
      'Immediate recognition and watertight repair of dural tears, with a defined post-operative regimen. Correct primary management is what separates a minor event from a pseudomeningocele, a fistula or meningitis.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.7',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Shivanand Mayi, Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: [
      'Any breach of dura recognised during decompression, discectomy, revision surgery or deformity correction.',
      'Higher baseline risk in revision surgery, ossified ligamentum flavum, severe stenosis and ankylosing spondylitis.'
    ],
    phases: [
      {
        id: 'int05-ph1',
        title: 'Immediate Recognition & Field Control',
        steps: [
          {
            id: 'int05-s1',
            timing: 'On recognition',
            action: 'Stop, inform the team and the anaesthetist, and enlarge the exposure to visualise the entire extent of the tear.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int05-s2',
            timing: 'Immediately',
            action: 'Place the patient in mild Trendelenburg, pack gently with a cottonoid and control the field; never suction directly on exposed nerve roots.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int05-s3',
            timing: 'Immediately',
            action: 'Inspect for herniated rootlets and reduce them gently into the thecal sac before any repair suture is placed.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int05-ph2',
        title: 'Repair',
        steps: [
          {
            id: 'int05-s4',
            timing: 'Repair',
            action: 'Close accessible tears primarily with 5-0 or 6-0 Prolene or Nurolon on a tapered needle, using a running-locking or interrupted technique under magnification.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int05-s5',
            timing: 'Repair',
            action: 'For ventral or inaccessible tears, apply a dural substitute or muscle-fascia patch graft with fibrin sealant rather than forcing a suture.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int05-s6',
            timing: 'After repair',
            action: 'Test the repair with a Valsalva manoeuvre to 30–40 cm H₂O and confirm there is no leak.',
            responsible: 'Operating Surgeon + Anaesthesiologist',
            criticalStop: true
          },
          {
            id: 'int05-s7',
            timing: 'After repair',
            action: 'Reinforce with fibrin glue or a dural sealant and, where possible, a local muscle or fat graft.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int05-s8',
            timing: 'Closure',
            action: 'Close the fascia in a watertight, multi-layer fashion; this layer is the true barrier against a cutaneous fistula.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int05-s9',
            timing: 'Closure',
            action: 'Avoid a subfascial suction drain over a repaired durotomy; if a drain is essential, use gravity drainage only.',
            responsible: 'Operating Surgeon',
            detail: 'Negative suction over a dural repair maintains the leak and promotes fistula formation.'
          }
        ]
      },
      {
        id: 'int05-ph3',
        title: 'Post-Operative Management',
        steps: [
          {
            id: 'int05-s10',
            timing: 'POD 0 to POD 2',
            action: 'Nurse flat or at less than 30° head elevation for 24–48 hours, with strict log-rolling.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'int05-s11',
            timing: 'POD 0 onward',
            action: 'Monitor for postural headache, nausea, wound bulge and clear wound discharge on every round.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'int05-s12',
            timing: 'POD 0 onward',
            action: 'Give adequate analgesia and antiemetics, and prescribe stool softeners to avoid straining.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'int05-s13',
            timing: 'POD 2 to POD 3',
            action: 'Mobilise gradually once the headache settles; escalate to the CSF leak protocol (STV-SP-EMR-04) if symptoms persist.',
            responsible: 'Spine Physiotherapist + Ward Registrar'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Valsalva leak test', trigger: 'Any persistent leak after repair', action: 'Re-suture or patch until watertight before closing.', severity: 'Critical' },
      { parameter: 'Clear wound discharge post-op', trigger: 'Any occurrence', action: 'Assume CSF fistula — escalate to STV-SP-EMR-04, avoid opportunistic dressing changes.', severity: 'Critical' },
      { parameter: 'Postural headache', trigger: 'Persisting beyond POD 3', action: 'Consider lumbar drain placement and imaging for pseudomeningocele.', severity: 'Escalate' }
    ],
    redFlags: [
      'Fever with neck stiffness and photophobia after a durotomy — exclude meningitis urgently.',
      'Expanding fluctuant wound swelling — pseudomeningocele requiring surgical revision.'
    ],
    documentation: [
      'Dural integrity field completed honestly in the Operative Record, including repair technique and materials.',
      'Post-operative positioning and mobilisation restrictions charted for nursing.',
      'Explicit handover of the durotomy to the ward and night team.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Dural integrity & repair' },
      { target: 'inpatient:rounds', label: 'Monitor for leak & headache' },
      { target: 'pathway', label: 'Modified mobilisation plan' }
    ],
    references: [
      'Guerin P et al. Incidental durotomy during spine surgery: incidence, management and complications. Injury, 2012.',
      'Bosacco SJ et al. Evaluation and treatment of dural tears in lumbar spine surgery. Clinical Orthopaedics, 2001.',
      'AOSpine Recommendations for the management of incidental durotomy.'
    ],
    auditMetrics: [
      { metric: 'Durotomies with a documented watertight repair and Valsalva test', target: '100%' },
      { metric: 'Persistent CSF fistula requiring reoperation', target: '< 10% of durotomies' }
    ]
  },

  {
    id: 'proto-int-06',
    code: 'STV-SP-INT-06',
    title: 'Spinal Implant Traceability, Sterility & CSSD Governance',
    shortLabel: 'Implant Traceability & Sterility',
    category: 'Intra-Operative',
    summary:
      'Every implanted device is traceable to a lot number, a sterilisation cycle and a named patient. Governs loaner tray handling, sterilisation verification and the implant ledger that supports recall management.',
    priority: 'Mandatory',
    evidenceGrade: 'Institutional Consensus',
    version: 'v3.4',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Ajay Krishnan, Consultant Spine Surgeon & CSSD Governance Lead',
    applicability: {
      regions: 'all',
      procedureKeywords: ['fusion', 'instrument', 'screw', 'cage', 'plate', 'disc replacement', 'deformity', 'tlif', 'acdf', 'alif', 'olif', 'xlif'],
      statuses: 'all'
    },
    indications: ['Every procedure in which any permanent implant is placed.'],
    phases: [
      {
        id: 'int06-ph1',
        title: 'Pre-Operative Tray Governance',
        steps: [
          {
            id: 'int06-s1',
            timing: 'Day -1',
            action: 'Loaner and consignment trays are received by CSSD at least 24 hours before surgery for full decontamination and sterilisation.',
            responsible: 'CSSD Supervisor',
            criticalStop: true,
            detail: 'Flash sterilisation of implant trays is prohibited.'
          },
          {
            id: 'int06-s2',
            timing: 'Day -1',
            action: 'Verify the implant inventory against the surgical plan, including the full size range and a complete backup set.',
            responsible: 'Scrub Nurse & Vendor Representative'
          },
          {
            id: 'int06-s3',
            timing: 'Day -1',
            action: 'Confirm sterilisation cycle records, chemical indicators and biological indicator results for every tray.',
            responsible: 'CSSD Supervisor',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int06-ph2',
        title: 'Intra-Operative Verification',
        steps: [
          {
            id: 'int06-s4',
            timing: 'At Time-Out',
            action: 'Confirm aloud that all required implants and instruments are physically present and sterile in the room.',
            responsible: 'Scrub Nurse',
            criticalStop: true
          },
          {
            id: 'int06-s5',
            timing: 'Before opening each implant',
            action: 'Check package integrity, expiry date and the sterility indicator; two people verify size and laterality before the implant is handed to the field.',
            responsible: 'Scrub & Circulating Nurse',
            criticalStop: true
          },
          {
            id: 'int06-s6',
            timing: 'On implantation',
            action: 'Record type, level, side, dimensions, material, manufacturer and lot number for every implant as it is placed.',
            responsible: 'Circulating Nurse'
          },
          {
            id: 'int06-s7',
            timing: 'On final tightening',
            action: 'Apply the manufacturer-specified torque-limiting driver to every locking set screw and confirm the shear-off.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int06-s8',
            timing: 'Never',
            action: 'A dropped or contaminated implant is discarded and documented; it is never re-sterilised for immediate reuse.',
            responsible: 'Scrub Nurse',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int06-ph3',
        title: 'Post-Operative Ledger & Patient Record',
        steps: [
          {
            id: 'int06-s9',
            timing: 'End of case',
            action: 'Paste implant barcode stickers into the OT register and enter every lot number into the electronic implant ledger.',
            responsible: 'Circulating Nurse & CSSD'
          },
          {
            id: 'int06-s10',
            timing: 'At discharge',
            action: 'Issue the patient an implant identification card listing manufacturer, type, material and lot numbers for airport screening and future care.',
            responsible: 'Discharge Coordinator'
          },
          {
            id: 'int06-s11',
            timing: 'End of case',
            action: 'Return all loaner trays to CSSD for decontamination with a documented count before they leave the hospital.',
            responsible: 'CSSD Supervisor'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Biological indicator', trigger: 'Any failed cycle', action: 'Quarantine the entire load; recall and re-sterilise; notify infection control.', severity: 'Critical' },
      { parameter: 'Implant package integrity', trigger: 'Damaged, wet or expired', action: 'Discard and document; do not use.', severity: 'Critical' },
      { parameter: 'Ledger completeness', trigger: 'Any implant without a recorded lot number', action: 'Reconcile before the patient leaves the recovery room.', severity: 'Escalate' }
    ],
    documentation: [
      'Complete implant list with lot numbers in the Operative Record.',
      'CSSD sterilisation cycle reference recorded against the case.',
      'Implant summary reproduced in the Discharge Summary and on the patient implant card.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Implant register' },
      { target: 'connectors', label: 'CSSD & OT consignment feed' },
      { target: 'discharge', label: 'Implant summary for patient' }
    ],
    references: [
      'AAMI ST79 — Comprehensive guide to steam sterilization and sterility assurance in health care facilities.',
      'NABH Accreditation Standards — Facility Management and Safety, CSSD requirements.',
      'ISO 13485 device traceability requirements for implantable medical devices.'
    ],
    auditMetrics: [
      { metric: 'Implants with complete lot-number traceability', target: '100%' },
      { metric: 'Immediate-use (flash) sterilisation of implant trays', target: '0' }
    ]
  },

  {
    id: 'proto-int-07',
    code: 'STV-SP-INT-07',
    title: 'Intra-Operative Massive Haemorrhage & Transfusion Response',
    shortLabel: 'Massive Haemorrhage Response',
    category: 'Intra-Operative',
    summary:
      'A rehearsed team response to catastrophic bleeding from the epidural venous plexus, segmental vessels or great-vessel injury during anterior and lateral approaches.',
    priority: 'Emergency Response',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.5',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Kashyap Rameshchandra Shah, Head of Anaesthesia',
    applicability: { regions: 'all', statuses: 'all' },
    indications: [
      'Blood loss exceeding 1500 ml, or a loss rate above 500 ml in 15 minutes.',
      'Suspected great-vessel or segmental vessel injury during anterior, lateral or corpectomy approaches.'
    ],
    phases: [
      {
        id: 'int07-ph1',
        title: 'Declaration & Immediate Control',
        steps: [
          {
            id: 'int07-s1',
            timing: 'Immediately',
            action: 'Declare "massive haemorrhage" aloud so anaesthesia, nursing and the blood bank respond simultaneously.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int07-s2',
            timing: 'Immediately',
            action: 'Apply direct pressure and pack the field; do not blindly cauterise or clip near the great vessels or the neural elements.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int07-s3',
            timing: 'Within 2 minutes',
            action: 'Call for senior surgical help; summon vascular surgery immediately for any suspected aortic, caval or iliac injury.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int07-s4',
            timing: 'Within 2 minutes',
            action: 'Secure large-bore intravenous access, start a rapid infuser and activate the massive transfusion pack.',
            responsible: 'Consultant Anaesthesiologist'
          }
        ]
      },
      {
        id: 'int07-ph2',
        title: 'Resuscitation',
        steps: [
          {
            id: 'int07-s5',
            timing: 'Ongoing',
            action: 'Transfuse in a balanced 1:1:1 ratio of packed red cells, fresh frozen plasma and platelets.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'int07-s6',
            timing: 'Ongoing',
            action: 'Give tranexamic acid 1 g if not already administered; correct fibrinogen with cryoprecipitate to keep it above 1.5 g/L.',
            responsible: 'Consultant Anaesthesiologist'
          },
          {
            id: 'int07-s7',
            timing: 'Every 30 minutes',
            action: 'Send arterial blood gas, ionised calcium, lactate and coagulation studies; guide therapy by thromboelastography where available.',
            responsible: 'Anaesthesia Technologist'
          },
          {
            id: 'int07-s8',
            timing: 'Ongoing',
            action: 'Prevent the lethal triad — active warming for hypothermia, calcium replacement for citrate toxicity, and correction of acidosis.',
            responsible: 'Consultant Anaesthesiologist',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int07-ph3',
        title: 'Damage Control & Aftercare',
        steps: [
          {
            id: 'int07-s9',
            timing: 'Decision point',
            action: 'Consider damage-control surgery — abandon the definitive correction, pack, close and return for a staged procedure once physiology is restored.',
            responsible: 'Operating Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'int07-s10',
            timing: 'End of case',
            action: 'Transfer to intensive care with an invasively monitored, warmed and fully handed-over patient.',
            responsible: 'Anaesthesia & Intensive Care'
          },
          {
            id: 'int07-s11',
            timing: 'Within 24 hours',
            action: 'Complete an incident report and present the case at the departmental morbidity and mortality meeting.',
            responsible: 'Operating Consultant Spine Surgeon'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Blood loss rate', trigger: '> 500 ml in 15 minutes', action: 'Declare massive haemorrhage and activate the transfusion pack.', severity: 'Critical' },
      { parameter: 'Fibrinogen', trigger: '< 1.5 g/L', action: 'Give cryoprecipitate or fibrinogen concentrate.', severity: 'Critical' },
      { parameter: 'Ionised calcium', trigger: '< 1.1 mmol/L', action: 'Give intravenous calcium chloride or gluconate.', severity: 'Escalate' },
      { parameter: 'Core temperature', trigger: '< 35°C', action: 'Aggressive active warming; consider damage control and staged surgery.', severity: 'Critical' },
      { parameter: 'Sudden hypotension in a lateral or anterior approach', trigger: 'Any occurrence', action: 'Assume great-vessel injury until excluded; call vascular surgery.', severity: 'Critical' }
    ],
    documentation: [
      'Estimated blood loss, every blood product unit and all haemostatic agents recorded in the Operative Record.',
      'Timeline of the haemorrhage declaration and the response.',
      'Incident report filed with the quality department.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Blood loss & transfusion record' },
      { target: 'connectors', label: 'Blood bank activation' },
      { target: 'reports', label: 'Coagulation & gas results' }
    ],
    references: [
      'Association of Anaesthetists — Management of massive haemorrhage guidelines.',
      'Nuttall GA et al. Blood conservation and transfusion in spine surgery. Anesthesiology Clinics.',
      'Hospital Massive Transfusion Protocol, Stavya Blood Bank Standard Operating Procedure.'
    ],
    auditMetrics: [
      { metric: 'Time from declaration to first blood product', target: '< 10 minutes' },
      { metric: 'Documented massive haemorrhage debriefs', target: '100%' }
    ]
  },

  {
    id: 'proto-int-08',
    code: 'STV-SP-INT-08',
    title: 'Wound Closure, Local Antibiotic & Drain Placement Bundle',
    shortLabel: 'Closure, Local Vancomycin & Drains',
    category: 'Intra-Operative',
    summary:
      'Standardised layered closure with intrawound vancomycin powder for instrumented cases, defined drain indications, and the dressing regimen that carries the wound safely through the first 48 hours.',
    priority: 'Strongly Recommended',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v2.6',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Closure of every spinal wound; intrawound vancomycin reserved for instrumented and revision cases.'],
    contraindications: ['Intrawound vancomycin is omitted where a durotomy has been repaired, to avoid intrathecal exposure.'],
    phases: [
      {
        id: 'int08-ph1',
        title: 'Preparation for Closure',
        steps: [
          {
            id: 'int08-s1',
            timing: 'Before closure',
            action: 'Achieve meticulous haemostasis with bipolar diathermy, bone wax on cancellous surfaces and a thrombin-gelatin matrix on epidural veins.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int08-s2',
            timing: 'Before closure',
            action: 'Irrigate copiously with 2–3 litres of warm normal saline, using pulsed lavage in revision and prolonged cases.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int08-s3',
            timing: 'Before closure',
            action: 'Inspect the decompressed neural elements one final time and confirm free dural pulsation with no residual compression.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int08-s4',
            timing: 'Before closure',
            action: 'Confirm sponge, needle and instrument counts are correct with the scrub team.',
            responsible: 'Scrub & Circulating Nurse',
            criticalStop: true
          }
        ]
      },
      {
        id: 'int08-ph2',
        title: 'Local Antibiotic & Layered Closure',
        steps: [
          {
            id: 'int08-s5',
            timing: 'Immediately before fascial closure',
            action: 'Apply 1 g of vancomycin powder subfascially over the instrumentation in fusion and revision cases where the dura is intact.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int08-s6',
            timing: 'Closure',
            action: 'Close the fascia with interrupted or continuous No. 1 absorbable suture — this layer must be watertight and tension-free.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int08-s7',
            timing: 'Closure',
            action: 'Obliterate dead space in the deep subcutaneous layer with 2-0 absorbable sutures, particularly in obese patients.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int08-s8',
            timing: 'Closure',
            action: 'Close skin with a 3-0 subcuticular monofilament, or staples where the wound is under tension or the patient is high-risk.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int08-s9',
            timing: 'After closure',
            action: 'Apply a sterile occlusive dressing to remain undisturbed for 48 hours; consider negative-pressure incisional dressing in high-risk wounds.',
            responsible: 'Scrub Nurse'
          }
        ]
      },
      {
        id: 'int08-ph3',
        title: 'Drain Decision',
        steps: [
          {
            id: 'int08-s10',
            timing: 'Before closure',
            action: 'Place a subfascial closed-suction drain for multi-level decompression, instrumented fusion, revision surgery or persistent diffuse ooze.',
            responsible: 'Operating Surgeon'
          },
          {
            id: 'int08-s11',
            timing: 'Before closure',
            action: 'Omit the drain in single-level microdiscectomy, tubular decompression and uncomplicated ACDF.',
            responsible: 'Operating Surgeon',
            detail: 'A drain does not prevent haematoma in low-risk cases and adds an infection route.'
          },
          {
            id: 'int08-s12',
            timing: 'Before closure',
            action: 'Where the dura has been repaired, use gravity drainage rather than suction, or omit the drain entirely.',
            responsible: 'Operating Surgeon',
            criticalStop: true
          },
          {
            id: 'int08-s13',
            timing: 'End of case',
            action: 'Record the drain type, size, site and suction setting, and hand it over explicitly to the ward team.',
            responsible: 'Operating Surgeon'
          }
        ]
      }
    ],
    drugSpecs: [
      { drug: 'Vancomycin powder', dose: '1 g (2 g for long-segment deformity constructs)', route: 'Topical, subfascial', timing: 'Immediately before fascial closure', notes: 'Omit if a durotomy has been repaired.' },
      { drug: 'Warm normal saline', dose: '2–3 litres', route: 'Irrigation', timing: 'Before closure', notes: 'Pulsed lavage for revision and prolonged cases.' }
    ],
    thresholds: [
      { parameter: 'Persistent diffuse ooze at closure', trigger: 'Not controlled by standard haemostasis', action: 'Place a subfascial drain and check the coagulation profile.', severity: 'Escalate' },
      { parameter: 'Wound tension at closure', trigger: 'Skin edges not apposing without tension', action: 'Undermine or use a relaxing technique; involve plastic surgery for major deformity revision wounds.', severity: 'Escalate' }
    ],
    documentation: [
      'Closure technique, suture materials and local antibiotic use recorded in the Operative Record.',
      'Drain type, size and suction status charted for nursing handover.'
    ],
    linkedModules: [
      { target: 'ot-note', label: 'Closure & drain details' },
      { target: 'inpatient:rounds', label: 'Drain monitoring' },
      { target: 'connectors', label: 'CSSD & nursing handover' }
    ],
    references: [
      'Bakhsheshian J et al. The use of vancomycin powder in modern spine surgery: systematic review. World Neurosurgery, 2015.',
      'Kanayama M et al. Effective prevention of surgical site infection using a Centers for Disease Control and Prevention guideline-based bundle. Journal of Neurosurgery: Spine.',
      'Cochrane review — Wound drains after spinal surgery.'
    ],
    auditMetrics: [
      { metric: 'Instrumented fusions receiving intrawound vancomycin where indicated', target: '> 90%' },
      { metric: 'Wound dehiscence rate', target: '< 1%' }
    ]
  }
];
