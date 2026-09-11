import { ClinicalProtocol } from '../../types/protocol';

// ============================================================================
// DISCHARGE & FOLLOW-UP SPINE PROTOCOLS (STV-SP-DIS-xx)
// Stavya Spine Hospital — Department of Spine Surgery
// ============================================================================

export const DISCHARGE_FOLLOWUP_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'proto-dis-01',
    code: 'STV-SP-DIS-01',
    title: 'Discharge Readiness Criteria & Red-Flag Education',
    shortLabel: 'Discharge Criteria & Red Flags',
    category: 'Discharge & Follow-Up',
    summary:
      'Objective criteria a patient must meet before leaving hospital, and the structured red-flag education that determines whether they come back at the right moment rather than a week too late.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.5',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Bharat Rajendraprasad Dave, Chief of Spine Surgery',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every spine surgical patient before discharge from the inpatient unit.'],
    phases: [
      {
        id: 'dis01-ph1',
        title: 'Clinical Discharge Criteria — All Must Be Met',
        steps: [
          {
            id: 'dis01-s1',
            timing: 'Day of discharge',
            action: 'Pain controlled on oral analgesia alone, with a resting VAS of 3 or less for at least 24 hours.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'dis01-s2',
            timing: 'Day of discharge',
            action: 'Neurological status stable or improving compared with the post-operative baseline, formally examined and documented on the day of discharge.',
            responsible: 'Discharging Consultant',
            criticalStop: true
          },
          {
            id: 'dis01-s3',
            timing: 'Day of discharge',
            action: 'Independently ambulant with the prescribed brace and walking aid, including safe stair negotiation where the home requires it.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true
          },
          {
            id: 'dis01-s4',
            timing: 'Day of discharge',
            action: 'Wound clean, dry and well-apposed, with no erythema, discharge or dehiscence; drain removed.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'dis01-s5',
            timing: 'Day of discharge',
            action: 'Voiding spontaneously with no significant residual volume, and bowels opened or a laxative plan in place.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis01-s6',
            timing: 'Day of discharge',
            action: 'Afebrile for 24 hours, tolerating a normal diet, and haemodynamically stable.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'dis01-s7',
            timing: 'Day of discharge',
            action: 'Safe home environment with an available caregiver confirmed, and transport arranged.',
            responsible: 'Discharge Coordinator'
          }
        ]
      },
      {
        id: 'dis01-ph2',
        title: 'Red-Flag Education — Teach Back Required',
        steps: [
          {
            id: 'dis01-s8',
            timing: 'Before discharge',
            action: 'Teach the emergency red flags: any loss of bladder or bowel control, new numbness around the genitals or inner thighs — return immediately.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'dis01-s9',
            timing: 'Before discharge',
            action: 'Teach: new or worsening weakness, numbness or heaviness in the limbs — return immediately.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'dis01-s10',
            timing: 'Before discharge',
            action: 'Teach: fever above 38°C with wound pain, redness, swelling or any discharge — contact the hospital the same day.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis01-s11',
            timing: 'Before discharge',
            action: 'Teach: clear watery fluid leaking from the wound, or a severe headache that is worse on sitting up — contact immediately.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis01-s12',
            timing: 'Before discharge',
            action: 'Teach: calf pain or swelling, sudden breathlessness or chest pain — attend the emergency department.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis01-s13',
            timing: 'Before discharge',
            action: 'Ask the patient and the accompanying relative to repeat the red flags back in their own words; do not discharge until they can.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'dis01-s14',
            timing: 'Before discharge',
            action: 'Give the 24-hour spine helpline number in writing and confirm it is saved in the patient\'s phone.',
            responsible: 'Discharge Coordinator'
          }
        ]
      },
      {
        id: 'dis01-ph3',
        title: 'Discharge Documentation Pack',
        steps: [
          {
            id: 'dis01-s15',
            timing: 'Before discharge',
            action: 'Complete the discharge summary — hospital course, operative summary, implants, neurological status, wound status and follow-up plan.',
            responsible: 'Ward Registrar',
            criticalStop: true
          },
          {
            id: 'dis01-s16',
            timing: 'Before discharge',
            action: 'Issue the medication list with doses, durations, the opioid taper and the NSAID restriction where fusion was performed.',
            responsible: 'Ward Registrar'
          },
          {
            id: 'dis01-s17',
            timing: 'Before discharge',
            action: 'Issue the implant identification card, the physiotherapy home programme and the written spinal precautions.',
            responsible: 'Discharge Coordinator'
          },
          {
            id: 'dis01-s18',
            timing: 'Before discharge',
            action: 'Book and confirm the follow-up appointment and the suture removal date in writing.',
            responsible: 'Discharge Coordinator',
            criticalStop: true
          },
          {
            id: 'dis01-s19',
            timing: 'Before discharge',
            action: 'Consultant countersigns the discharge summary before the patient leaves.',
            responsible: 'Discharging Consultant',
            criticalStop: true
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Pain score', trigger: 'VAS > 4 on oral analgesia', action: 'Do not discharge; review analgesia and exclude a surgical cause.', severity: 'Escalate' },
      { parameter: 'Mobility', trigger: 'Unable to walk independently with an aid', action: 'Do not discharge home; consider rehabilitation transfer.', severity: 'Escalate' },
      { parameter: 'Wound', trigger: 'Any erythema, discharge or dehiscence', action: 'Do not discharge; investigate for infection.', severity: 'Critical' },
      { parameter: 'Red-flag teach-back', trigger: 'Patient cannot repeat the red flags', action: 'Repeat the education; involve a family member; document.', severity: 'Escalate' }
    ],
    documentation: [
      'Discharge criteria checklist completed and signed.',
      'Red-flag education documented with teach-back confirmation.',
      'Consultant-countersigned discharge summary with follow-up date.'
    ],
    linkedModules: [
      { target: 'discharge', label: 'Complete the discharge summary' },
      { target: 'inpatient:neuro-exam', label: 'Discharge neuro assessment' },
      { target: 'inpatient:prescriptions', label: 'Discharge medications' },
      { target: 'pathway', label: 'Discharge day milestones' }
    ],
    references: [
      'ERAS Society spine consensus — discharge criteria, 2021.',
      'NABH Accreditation Standards — Discharge planning and patient education requirements.',
      'Kripalani S et al. Deficits in communication and information transfer between hospital-based and primary care physicians. JAMA, 2007.'
    ],
    auditMetrics: [
      { metric: 'Discharges with all criteria documented as met', target: '100%' },
      { metric: '30-day readmission rate', target: '< 5%' },
      { metric: 'Discharge summaries countersigned before the patient leaves', target: '100%' }
    ]
  },

  {
    id: 'proto-dis-02',
    code: 'STV-SP-DIS-02',
    title: 'Spinal Orthosis, Bracing & Ergonomic Precautions',
    shortLabel: 'Bracing & Spinal Precautions',
    category: 'Discharge & Follow-Up',
    summary:
      'Which brace, for how long, and the activity restrictions that protect the construct during the biological window in which fusion occurs — expressed in terms a patient can actually follow at home.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade C (Level IV Evidence)',
    version: 'v3.0',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Parth Joshi, Head of Spine Physiotherapy & Rehabilitation',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every post-operative spine patient; brace type and duration determined by region, construct and bone quality.'],
    phases: [
      {
        id: 'dis02-ph1',
        title: 'Orthosis Prescription by Region',
        steps: [
          {
            id: 'dis02-s1',
            timing: 'POD 1',
            action: 'Lumbar and lumbosacral fusion: rigid LSO brace worn whenever the patient is out of bed for 6 weeks, then weaned over 2 weeks.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis02-s2',
            timing: 'POD 1',
            action: 'Lumbar microdiscectomy and decompression without fusion: soft lumbar corset for comfort only, for 2–4 weeks, and not mandatory.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis02-s3',
            timing: 'POD 1',
            action: 'ACDF and anterior cervical procedures: rigid Philadelphia collar for 4–6 weeks, or a soft collar for comfort in single-level plated constructs at consultant discretion.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis02-s4',
            timing: 'POD 1',
            action: 'Thoracolumbar deformity and long constructs: custom TLSO for 3 months where bone quality or construct length demands it.',
            responsible: 'Orthotist'
          },
          {
            id: 'dis02-s5',
            timing: 'POD 1',
            action: 'Osteoporotic and cement-augmented constructs: extended bracing to 3 months with concurrent anti-osteoporotic therapy.',
            responsible: 'Spine Physiotherapist + Endocrinology'
          }
        ]
      },
      {
        id: 'dis02-ph2',
        title: 'Brace Use Training',
        steps: [
          {
            id: 'dis02-s6',
            timing: 'Before discharge',
            action: 'Teach the patient to apply and remove the brace while lying flat, and to check the fit and the skin underneath daily.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true
          },
          {
            id: 'dis02-s7',
            timing: 'Before discharge',
            action: 'Explain that the brace comes off in bed and for bathing, and goes on before sitting up or standing.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis02-s8',
            timing: 'Before discharge',
            action: 'Teach skin care — a cotton vest under the brace, daily skin inspection for pressure areas, and reporting any breakdown.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis02-s9',
            timing: 'Before discharge',
            action: 'Confirm the patient can independently demonstrate fitting the brace correctly.',
            responsible: 'Spine Physiotherapist',
            criticalStop: true
          }
        ]
      },
      {
        id: 'dis02-ph3',
        title: 'Spinal Precautions & Activity Progression',
        steps: [
          {
            id: 'dis02-s10',
            timing: '0–6 weeks',
            action: 'No bending at the waist, no twisting of the trunk, no lifting over 3 kg; use log-rolling to get in and out of bed.',
            responsible: 'Patient (taught by Physiotherapy)'
          },
          {
            id: 'dis02-s11',
            timing: '0–6 weeks',
            action: 'Sit for no more than 30–45 minutes at a stretch, on a firm chair with lumbar support and feet flat on the floor.',
            responsible: 'Patient'
          },
          {
            id: 'dis02-s12',
            timing: '0–6 weeks',
            action: 'Walk on level ground, building from 10 minutes three times daily to 30–45 minutes total by 6 weeks. No car driving.',
            responsible: 'Patient'
          },
          {
            id: 'dis02-s13',
            timing: '6–12 weeks',
            action: 'Wean the brace, start core stabilisation and gentle stretching under physiotherapy supervision, and resume driving once off opioids and able to perform an emergency stop.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis02-s14',
            timing: '3–6 months',
            action: 'Progress to full activity — desk work at 4–6 weeks, light manual work at 3 months, heavy manual work and contact sport only after documented fusion.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'dis02-s15',
            timing: 'Home setup',
            action: 'Advise a firm mattress, a raised toilet seat where hip flexion is limited, removing floor rugs, and keeping daily-use items at waist height.',
            responsible: 'Occupational Therapy'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Skin under brace', trigger: 'Redness that does not fade within 30 minutes', action: 'Adjust or re-fit the orthosis; refer to the orthotist.', severity: 'Watch' },
      { parameter: 'Brace compliance', trigger: 'Patient not wearing the brace as prescribed', action: 'Re-educate and identify the barrier — fit, heat, comfort or understanding.', severity: 'Escalate' },
      { parameter: 'Pain on weaning', trigger: 'Significant pain increase when the brace is removed', action: 'Extend bracing and reassess construct stability radiographically.', severity: 'Escalate' }
    ],
    documentation: [
      'Brace type and prescribed duration recorded in the discharge summary.',
      'Brace competency confirmed by physiotherapy before discharge.',
      'Written spinal precautions handed to the patient.'
    ],
    linkedModules: [
      { target: 'discharge', label: 'Brace instructions & precautions' },
      { target: 'connectors', label: 'Physiotherapy & orthotics' },
      { target: 'pathway', label: 'Mobilisation milestones' }
    ],
    references: [
      'Yee AJ et al. Use of a postoperative lumbar corset after lumbar spinal arthrodesis: a randomised trial. JBJS Am, 2008.',
      'Connolly PJ et al. Bracing after spinal fusion — current practice review.',
      'AAOS patient education standards for post-operative spinal orthoses.'
    ],
    auditMetrics: [
      { metric: 'Patients demonstrating independent brace application before discharge', target: '100%' },
      { metric: 'Brace-related pressure injuries', target: '0' }
    ]
  },

  {
    id: 'proto-dis-03',
    code: 'STV-SP-DIS-03',
    title: 'Wound Care, Suture Removal & Home Dressing',
    shortLabel: 'Wound Care & Suture Removal',
    category: 'Discharge & Follow-Up',
    summary:
      'Home wound care instructions, the suture and staple removal schedule by region, and the criteria that tell a patient when a wound problem is a phone call versus an emergency visit.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade C (Level IV Evidence)',
    version: 'v2.5',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Sister Anita Gohel, Senior Nursing Officer (Spine Unit)',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every surgical spine wound from closure until healing is complete.'],
    phases: [
      {
        id: 'dis03-ph1',
        title: 'Inpatient Wound Care',
        steps: [
          {
            id: 'dis03-s1',
            timing: 'POD 0 to POD 2',
            action: 'Leave the primary theatre dressing undisturbed for 48 hours unless it is soaked or the wound needs assessment.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'dis03-s2',
            timing: 'POD 2',
            action: 'Inspect the wound under aseptic technique, document its appearance, and apply a clean occlusive dressing.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis03-s3',
            timing: 'Every dressing change',
            action: 'Record erythema, swelling, discharge character, edge apposition and any suture reaction.',
            responsible: 'Ward Nursing Staff'
          }
        ]
      },
      {
        id: 'dis03-ph2',
        title: 'Home Wound Care Instructions',
        steps: [
          {
            id: 'dis03-s4',
            timing: 'Before discharge',
            action: 'Teach the patient to keep the dressing clean and dry, and to change it only as instructed, with clean hands.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis03-s5',
            timing: 'Before discharge',
            action: 'Permit showering with a waterproof dressing from POD 3–5; prohibit bathtubs, swimming pools and rivers until the wound is fully healed.',
            responsible: 'Ward Nursing Staff'
          },
          {
            id: 'dis03-s6',
            timing: 'Before discharge',
            action: 'Prohibit applying oil, turmeric, powders or any home remedy to the incision.',
            responsible: 'Ward Nursing Staff',
            criticalStop: true
          },
          {
            id: 'dis03-s7',
            timing: 'Before discharge',
            action: 'Instruct the patient to photograph the wound and send it on the helpline if they are worried, rather than waiting for the appointment.',
            responsible: 'Discharge Coordinator'
          }
        ]
      },
      {
        id: 'dis03-ph3',
        title: 'Suture & Staple Removal',
        steps: [
          {
            id: 'dis03-s8',
            timing: 'Day 10–12',
            action: 'Remove cervical sutures or staples at day 10–12; the anterior cervical wound heals quickly and cosmesis matters.',
            responsible: 'OPD Nursing / Registrar'
          },
          {
            id: 'dis03-s9',
            timing: 'Day 12–14',
            action: 'Remove thoracolumbar sutures or staples at day 12–14, extending to day 21 in diabetic, obese, steroid-treated or revision patients.',
            responsible: 'OPD Nursing / Registrar'
          },
          {
            id: 'dis03-s10',
            timing: 'At removal',
            action: 'Inspect the wound before removing; if there is any doubt about healing, remove alternate sutures and review in 3–4 days.',
            responsible: 'OPD Registrar',
            criticalStop: true
          },
          {
            id: 'dis03-s11',
            timing: 'After removal',
            action: 'Advise scar care — silicone gel or massage from 3 weeks, and sun protection for 6 months.',
            responsible: 'OPD Nursing'
          },
          {
            id: 'dis03-s12',
            timing: 'Subcuticular closures',
            action: 'For absorbable subcuticular closures, no removal is needed; trim the tails at review.',
            responsible: 'OPD Nursing'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'Wound discharge', trigger: 'Any purulent discharge', action: 'Same-day review; do not wait for the scheduled appointment (STV-SP-EMR-03).', severity: 'Critical' },
      { parameter: 'Clear fluid leak', trigger: 'Any occurrence', action: 'Immediate review — suspect CSF fistula (STV-SP-EMR-04).', severity: 'Critical' },
      { parameter: 'Spreading erythema', trigger: 'Extending beyond 2 cm from the incision', action: 'Same-day review and inflammatory markers.', severity: 'Escalate' },
      { parameter: 'Wound dehiscence', trigger: 'Any separation of the wound edges', action: 'Urgent review; may need re-closure in theatre.', severity: 'Critical' }
    ],
    documentation: [
      'Wound status entries in every ward round and at each OPD visit.',
      'Suture removal date recorded in the discharge summary and confirmed at the visit.',
      'Home wound care instructions issued in writing.'
    ],
    linkedModules: [
      { target: 'inpatient:rounds', label: 'Wound status charting' },
      { target: 'discharge', label: 'Suture removal date & instructions' }
    ],
    references: [
      'CDC Guideline for the Prevention of Surgical Site Infection — postoperative incision care, 2017.',
      'Toon CD et al. Early versus delayed post-operative bathing or showering. Cochrane Database of Systematic Reviews.',
      'NICE Guideline NG125 — Surgical site infections: prevention and treatment.'
    ],
    auditMetrics: [
      { metric: 'Wound reviews documented at suture removal', target: '100%' },
      { metric: 'Superficial wound complications after discharge', target: '< 3%' }
    ]
  },

  {
    id: 'proto-dis-04',
    code: 'STV-SP-DIS-04',
    title: 'Structured Follow-Up, Radiographic Surveillance & Outcome Tracking',
    shortLabel: 'Follow-Up & Fusion Surveillance',
    category: 'Discharge & Follow-Up',
    summary:
      'The fixed follow-up calendar with the imaging and outcome instruments due at each visit, so fusion progress and patient-reported recovery are measured rather than assumed.',
    priority: 'Mandatory',
    evidenceGrade: 'Grade B (Level II-III Evidence)',
    version: 'v3.1',
    effectiveFrom: '01-Apr-2026',
    nextReviewDue: '31-Mar-2027',
    owner: 'Dr. Mirant Bharat Dave, Managing Director & Consultant Spine Surgeon',
    applicability: { regions: 'all', statuses: 'all', universal: true },
    indications: ['Every operated spine patient from discharge through at least 2 years for instrumented fusion.'],
    phases: [
      {
        id: 'dis04-ph1',
        title: 'Early Follow-Up (2 weeks – 3 months)',
        steps: [
          {
            id: 'dis04-s1',
            timing: '2 weeks',
            action: 'Wound review and suture removal, neurological examination, pain score, and confirmation that brace and precautions are being followed.',
            responsible: 'OPD Registrar'
          },
          {
            id: 'dis04-s2',
            timing: '6 weeks',
            action: 'Standing AP and lateral radiographs, neurological examination, VAS and ODI or NDI, and the decision on brace weaning and return to desk work.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'dis04-s3',
            timing: '6 weeks',
            action: 'Start supervised core stabilisation physiotherapy and progress the walking programme.',
            responsible: 'Spine Physiotherapist'
          },
          {
            id: 'dis04-s4',
            timing: '3 months',
            action: 'Radiographs to assess early fusion and alignment, outcome scores, and clearance for light manual activity.',
            responsible: 'Consultant Spine Surgeon'
          }
        ]
      },
      {
        id: 'dis04-ph2',
        title: 'Consolidation Follow-Up (6 months – 2 years)',
        steps: [
          {
            id: 'dis04-s5',
            timing: '6 months',
            action: 'Standing radiographs with dynamic flexion-extension views to assess motion at the fused segment.',
            responsible: 'Radiology'
          },
          {
            id: 'dis04-s6',
            timing: '12 months',
            action: 'Formal fusion assessment — radiographs, and CT where union is uncertain — plus a full outcome score set.',
            responsible: 'Consultant Spine Surgeon',
            criticalStop: true
          },
          {
            id: 'dis04-s7',
            timing: '12 months',
            action: 'Clear the patient for unrestricted activity only once fusion is radiologically confirmed and the examination is satisfactory.',
            responsible: 'Consultant Spine Surgeon'
          },
          {
            id: 'dis04-s8',
            timing: '24 months',
            action: 'Assess for adjacent segment degeneration, implant integrity and durability of the outcome; deformity constructs continue annual review.',
            responsible: 'Consultant Spine Surgeon'
          }
        ]
      },
      {
        id: 'dis04-ph3',
        title: 'Outcome Instruments at Every Visit',
        steps: [
          {
            id: 'dis04-s9',
            timing: 'Every visit',
            action: 'Record VAS for back and leg pain, or neck and arm pain for cervical cases.',
            responsible: 'OPD Nursing'
          },
          {
            id: 'dis04-s10',
            timing: 'Every visit',
            action: 'Record ODI for lumbar cases and NDI for cervical cases, and compare against the pre-operative baseline.',
            responsible: 'OPD Nursing'
          },
          {
            id: 'dis04-s11',
            timing: 'Myelopathy cases',
            action: 'Record mJOA score and Nurick grade at each visit for myelopathy patients.',
            responsible: 'OPD Registrar'
          },
          {
            id: 'dis04-s12',
            timing: 'Every visit',
            action: 'Record walking tolerance in metres and return-to-work status.',
            responsible: 'OPD Nursing'
          },
          {
            id: 'dis04-s13',
            timing: 'Every visit',
            action: 'File the visit record in the patient chart so the outcome trajectory is visible across the whole episode of care.',
            responsible: 'OPD Registrar'
          }
        ]
      }
    ],
    thresholds: [
      { parameter: 'ODI improvement', trigger: '< 15 point improvement at 6 months', action: 'Investigate for pseudarthrosis, recurrent pathology, adjacent segment disease or a non-structural pain driver.', severity: 'Escalate' },
      { parameter: 'Fusion status at 12 months', trigger: 'No bridging bone, with motion on dynamic films', action: 'Diagnose pseudarthrosis; assess symptoms and plan accordingly (STV-SP-EMR-07).', severity: 'Escalate' },
      { parameter: 'New radicular pain at follow-up', trigger: 'New distribution', action: 'MRI to assess recurrent herniation or adjacent segment disease.', severity: 'Escalate' },
      { parameter: 'Missed appointments', trigger: 'Two consecutive missed visits after fusion', action: 'Active recall by the coordinator — silent non-union is a real risk.', severity: 'Watch' }
    ],
    documentation: [
      'Structured OPD visit note with examination, imaging and outcome scores at each visit.',
      'Fusion status documented explicitly at 12 months.',
      'Return-to-work and activity clearances recorded with dates.'
    ],
    linkedModules: [
      { target: 'inpatient:neuro-exam', label: 'Serial outcome scores' },
      { target: 'reports', label: 'Follow-up imaging' },
      { target: 'discharge', label: 'Follow-up schedule' },
      { target: 'anatomy', label: 'Operated levels' }
    ],
    references: [
      'Fairbank JC, Pynsent PB. The Oswestry Disability Index. Spine, 2000.',
      'Vernon H, Mior S. The Neck Disability Index: a study of reliability and validity.',
      'Bono CM et al. Measurement techniques for lumbar arthrodesis assessment. The Spine Journal.'
    ],
    auditMetrics: [
      { metric: 'Patients with complete 12-month outcome scores', target: '> 85%' },
      { metric: 'Documented fusion assessment at 12 months for instrumented cases', target: '100%' }
    ]
  }
];
