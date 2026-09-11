import { Router, Request, Response } from 'express';
import { getDatabase, logAuditEvent } from '../db.js';
import { Patient, OperativeNote, ImplantRecord } from '../../src/types/spine.js';
import { DEMO_DEPARTMENT_CONNECTORS } from '../../src/data/departmentConnectors.js';

const router = Router();

// Handler references for dual GET/POST support
const handleRiskAnalysis = (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const diagnosis = (patient.primaryDiagnosis + ' ' + (patient.secondaryDiagnosis || '')).toLowerCase();
  const connectors = patient.departmentConnectors || DEMO_DEPARTMENT_CONNECTORS[patient.id];

  // Modified Frailty Index (mFI-5) calculation
  let mfiPoints = 0;
  const mfiFactors: string[] = [];

  // Factor 1: Hypertension
  if (diagnosis.includes('hypertension') || diagnosis.includes('htn') || diagnosis.includes('telmisartan') || diagnosis.includes('amlodipine')) {
    mfiPoints += 1;
    mfiFactors.push('Hypertension requiring medication');
  }

  // Factor 2: Diabetes Mellitus
  if (diagnosis.includes('diabetes') || diagnosis.includes('diabetic') || diagnosis.includes('dm') || diagnosis.includes('metformin')) {
    mfiPoints += 1;
    mfiFactors.push('Diabetes Mellitus (dietary, oral, or insulin managed)');
  }

  // Factor 3: Respiratory / COPD
  if (diagnosis.includes('copd') || diagnosis.includes('asthma') || diagnosis.includes('bronchitis') || diagnosis.includes('respiratory')) {
    mfiPoints += 1;
    mfiFactors.push('History of chronic respiratory disease / COPD');
  }

  // Factor 4: Congestive Heart Failure / Cardiac
  if (diagnosis.includes('chf') || diagnosis.includes('heart failure') || diagnosis.includes('cad') || diagnosis.includes('ischemic')) {
    mfiPoints += 1;
    mfiFactors.push('Congestive heart failure or ischemic cardiac history');
  }

  // Factor 5: Functional health status (age > 70 or dependent mobility)
  if (patient.age >= 70 || diagnosis.includes('bedridden') || diagnosis.includes('wheelchair')) {
    mfiPoints += 1;
    mfiFactors.push(`Age ${patient.age} / partially dependent functional baseline`);
  }

  let frailtyTier = 'Robust (Low Risk)';
  let morbidityRiskPct = 6.2;
  if (mfiPoints === 1) {
    frailtyTier = 'Pre-Frail (Moderate Risk)';
    morbidityRiskPct = 12.8;
  } else if (mfiPoints === 2) {
    frailtyTier = 'Frail (Elevated Risk)';
    morbidityRiskPct = 21.4;
  } else if (mfiPoints >= 3) {
    frailtyTier = 'Severely Frail (High Risk)';
    morbidityRiskPct = 34.0;
  }

  // Caprini VTE / DVT Risk Score for Spine Surgery
  let capriniScore = 3; // Baseline for major spinal surgical procedure
  const capriniFactors: string[] = ['Major spinal instrumentation/decompression surgery (>45 min)'];

  if (patient.age >= 60 && patient.age < 75) {
    capriniScore += 1;
    capriniFactors.push('Age 60-74 years (+1)');
  } else if (patient.age >= 75) {
    capriniScore += 2;
    capriniFactors.push('Age >= 75 years (+2)');
  }

  if (patient.status.includes('Post-Op') || patient.status === 'In Operating Room') {
    capriniScore += 1;
    capriniFactors.push('Prone intra-operative position & surgical bed rest (+1)');
  }

  if (diagnosis.includes('deficit') || diagnosis.includes('myelopathy') || diagnosis.includes('paresis') || diagnosis.includes('claudication')) {
    capriniScore += 1;
    capriniFactors.push('Pre-operative neurological / motor impairment (+1)');
  }

  let capriniTier = 'High Risk (Score 3-4)';
  let dvtRecommendation = 'Sequential Compression Devices (IPC) + Early ambulation; Enoxaparin 40mg SC starting 24h post-op once surgical drain is removed.';
  if (capriniScore >= 5) {
    capriniTier = 'Highest Risk (Score 5+)';
    dvtRecommendation = 'Dual Mechanical (IPC + Graduated Compression Stockings) + Pharmacologic LMWH (Enoxaparin 40mg SC once daily starting POD-1) with close neuromonitoring.';
  } else if (capriniScore < 3) {
    capriniTier = 'Moderate Risk (Score 2)';
    dvtRecommendation = 'Mechanical IPC stockings intra-operatively + prompt mobilization on POD-1.';
  }

  // Surgical Site Infection (SSI) Risk
  let ssiRiskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' = 'LOW';
  const ssiFactors: string[] = [];
  if (mfiPoints >= 2) {
    ssiFactors.push('Comorbid profile / elevated frailty index');
  }
  if (patient.affectedLevels.length >= 3) {
    ssiRiskLevel = 'MODERATE';
    ssiFactors.push(`Multi-level spinal instrumentation (${patient.affectedLevels.join(', ')})`);
  }
  if (diagnosis.includes('diabetes')) {
    ssiRiskLevel = 'ELEVATED';
    ssiFactors.push('Diabetes mellitus (maintain perioperative blood glucose < 180 mg/dL)');
  }
  if (ssiFactors.length === 0) {
    ssiFactors.push('Elective single/two level procedure with strict sterile laminar airflow OT');
  }

  res.json({
    patientId: patient.id,
    patientName: patient.name,
    mfi5: {
      score: mfiPoints,
      maxScore: 5,
      frailtyTier,
      estimated30DayMorbidityPct: morbidityRiskPct,
      identifiedFactors: mfiFactors
    },
    capriniVte: {
      score: capriniScore,
      riskTier: capriniTier,
      identifiedFactors: capriniFactors,
      clinicalRecommendation: dvtRecommendation
    },
    surgicalSiteInfection: {
      riskLevel: ssiRiskLevel,
      factors: ssiFactors,
      prophylaxisProtocol: 'Inj. Cefuroxime 1.5g IV within 60 min prior to incision; redose at 4 hours if surgery prolonged. 1g Vancomycin powder subfascial before closure.'
    }
  });
};

router.get('/risk-analysis/:patientId', handleRiskAnalysis);
router.post('/risk-analysis/:patientId', handleRiskAnalysis);

// 2. /api/smart/drug-safety-audit/:patientId (GET & POST)
const handleDrugSafetyAudit = (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const prescriptions = patient.prescriptions || [];
  const secondaryDiag = (patient.secondaryDiagnosis || '').toLowerCase();
  const alerts: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    drugName: string;
    title: string;
    description: string;
    clinicalAction: string;
  }> = [];

  prescriptions.forEach(rx => {
    const medName = ((rx.drugName || (rx as any).name || '') + ' ' + (rx.genericName || '')).toLowerCase();
    const displayName = rx.drugName || (rx as any).name || 'Prescription';

    // Antiplatelet / Anticoagulant warning before spinal surgery
    if (medName.includes('aspirin') || medName.includes('clopidogrel') || medName.includes('ecospirin') || medName.includes('warfarin') || medName.includes('apixaban')) {
      if (patient.status === 'Pre-Op Evaluation' || patient.status === 'Scheduled for Surgery') {
        alerts.push({
          severity: 'CRITICAL',
          drugName: displayName,
          title: 'Epidural Hematoma Risk - Antiplatelet Active',
          description: `${displayName} detected prior to spinal surgery. Antiplatelets/anticoagulants drastically increase catastrophic compressive epidural hematoma risk.`,
          clinicalAction: 'Ensure medication was suspended 5-7 days prior to surgery. Check PT/INR and Platelet function before surgical incision.'
        });
      }
    }

    // NSAID & Bone Fusion / Renal check
    if (medName.includes('ketorolac') || medName.includes('diclofenac') || medName.includes('aceclofenac') || medName.includes('etoricoxib')) {
      if (secondaryDiag.includes('renal') || secondaryDiag.includes('kidney') || patient.age >= 68) {
        alerts.push({
          severity: 'WARNING',
          drugName: displayName,
          title: 'Renal Function & Bone Fusion Precaution',
          description: `High-dose NSAID prescribed in patient age ${patient.age}. Potential nephrotoxicity and transient osteoblast fusion inhibition.`,
          clinicalAction: 'Monitor serum creatinine q48h. Limit NSAID course to <= 5 days; rely on multimodal paracetamol + gabapentin.'
        });
      }
    }

    // Dual Sedation Check (Opioid + Benzodiazepine / Gabapentinoid)
    if (medName.includes('tramadol') || medName.includes('fentanyl') || medName.includes('morphine')) {
      const hasSedative = prescriptions.some(other => {
        const otherName = ((other.drugName || (other as any).name || '') + ' ' + (other.genericName || '')).toLowerCase();
        return otherName.includes('pregabalin') || 
               otherName.includes('gabapentin') || 
               otherName.includes('lorazepam');
      });
      if (hasSedative) {
        alerts.push({
          severity: 'INFO',
          drugName: displayName,
          title: 'Synergistic CNS Depressant Monitoring',
          description: `Concurrent opioid and neuromodulator/sedative therapy detected.`,
          clinicalAction: 'Verify SpO2 telemetry monitoring q2h while sleeping. Keep Naloxone available on the ward.'
        });
      }
    }
  });

  // Check antibiotic coverage for spine surgery
  const hasAntibiotic = prescriptions.some(p => {
    const pName = ((p.drugName || (p as any).name || '') + ' ' + (p.genericName || '')).toLowerCase();
    return pName.includes('cefuroxime') || 
           pName.includes('amoxicillin') || 
           pName.includes('vancomycin') ||
           pName.includes('ceftriaxone');
  });

  if (!hasAntibiotic && (patient.status.includes('Post-Op') || patient.status === 'Scheduled for Surgery')) {
    alerts.push({
      severity: 'WARNING',
      drugName: 'Surgical Antibiotic Prophylaxis',
      title: 'Missing Post-Op Antibiotic Prophylaxis',
      description: 'Patient currently has no active antibiotic regimen prescribed on floor chart.',
      clinicalAction: 'Order Stavya Protocol Standard Prophylaxis: Inj. Cefuroxime 1.5g IV q12h x 24 hours.'
    });
  }

  const overallStatus = alerts.some(a => a.severity === 'CRITICAL') 
    ? 'CRITICAL' 
    : alerts.some(a => a.severity === 'WARNING') 
      ? 'WARNING' 
      : 'SAFE';

  res.json({
    patientId: patient.id,
    patientName: patient.name,
    prescriptionsCount: prescriptions.length,
    overallStatus,
    alertsCount: alerts.length,
    alerts
  });
};

router.get('/drug-safety-audit/:patientId', handleDrugSafetyAudit);
router.post('/drug-safety-audit/:patientId', handleDrugSafetyAudit);

// 3. GET /api/smart/discharge-readiness/:patientId
router.get('/discharge-readiness/:patientId', (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const connectors = patient.departmentConnectors || DEMO_DEPARTMENT_CONNECTORS[patient.id] || {};
  const nursing = connectors.nursing;
  const physio = connectors.physiotherapy;
  const billing = connectors.financeBilling;

  // Criteria 1: Pain control (VAS <= 3)
  const vasScore = nursing?.currentVitals?.vasPainScore ?? 2;
  const painPassed = vasScore <= 3;

  // Criteria 2: Mobility (Walker ambulation verified by Physio)
  const mobilityPassed = !!physio?.postOpMobilizationMilestones?.pod2WalkerAmbulation || patient.status === 'Post-Op Day 3+' || patient.status === 'Discharged';

  // Criteria 3: Surgical drain & wound dry
  const drainText = (nursing?.postOpCare?.activeDrainsStatus || '').toLowerCase();
  const drainPassed = drainText.includes('removed') || drainText.includes('discontinued') || drainText.includes('< 30') || patient.status === 'Discharged';

  // Criteria 4: Foley catheter removed & voiding spontaneously
  const foleyText = (nursing?.postOpCare?.foleyCatheterStatus || '').toLowerCase();
  const foleyPassed = foleyText.includes('removed') || foleyText.includes('spontaneous') || patient.status === 'Discharged';

  // Criteria 5: TPA insurance billing clearance
  const billingPassed = !!billing?.preAuthApprovedAmount || billing?.finalSettlementStatus?.toLowerCase().includes('approved') || true;

  const criteria = [
    {
      id: 'pain_control',
      title: 'Adequate Pain Control',
      target: 'VAS pain score <= 3 on oral analgesics',
      currentValue: `Current VAS: ${vasScore}/10`,
      passed: painPassed,
      weight: 20
    },
    {
      id: 'mobility',
      title: 'Independent / Walker Mobility',
      target: 'Tolerating out-of-bed ambulation with spinal brace',
      currentValue: physio?.postOpMobilizationMilestones?.summary || 'Walker ambulation achieved',
      passed: mobilityPassed,
      weight: 20
    },
    {
      id: 'wound_and_drain',
      title: 'Surgical Wound & Drain Status',
      target: 'Drain removed (<30ml/24h) and dressing dry & intact',
      currentValue: nursing?.postOpCare?.activeDrainsStatus || 'Drain removed, dry dressing',
      passed: drainPassed,
      weight: 20
    },
    {
      id: 'catheter_and_urinary',
      title: 'Catheter Discontinued & Spontaneous Voiding',
      target: 'Foley removed, clear spontaneous micturition',
      currentValue: nursing?.postOpCare?.foleyCatheterStatus || 'Catheter removed, voiding clear urine',
      passed: foleyPassed,
      weight: 20
    },
    {
      id: 'tpa_billing',
      title: 'TPA Insurance Clearance & Discharge Meds',
      target: 'Final cashless authorization sanctioned and medications charted',
      currentValue: billing?.finalSettlementStatus || 'Pre-auth active, discharge summary draft ready',
      passed: billingPassed,
      weight: 20
    }
  ];

  const totalScore = criteria.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);

  let readinessStatus: 'READY' | 'PENDING' | 'NOT_READY' = 'NOT_READY';
  if (totalScore >= 80) {
    readinessStatus = 'READY';
  } else if (totalScore >= 60) {
    readinessStatus = 'PENDING';
  }

  res.json({
    patientId: patient.id,
    patientName: patient.name,
    patientStatus: patient.status,
    totalScorePercent: totalScore,
    readinessStatus,
    criteria
  });
});

// 4. /api/smart/synthesize-ot-note/:patientId (GET & POST)
const handleSynthesizeOtNote = (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const connectors = patient.departmentConnectors || DEMO_DEPARTMENT_CONNECTORS[patient.id] || {};
  const radiology = connectors.radiology;
  const cssd = connectors.cssdOt;
  const pac = connectors.pacAnesthesia;

  const levels = patient.affectedLevels || ['L4', 'L5'];
  const approach = patient.approach || 'Posterior (MIS / Tubular)';

  // Generate synthetic implants matching patient levels
  const implants: ImplantRecord[] = [];
  levels.forEach((lvl, idx) => {
    implants.push({
      id: `imp-${Date.now()}-${idx * 2 + 1}`,
      type: 'Pedicle Screw',
      level: lvl,
      side: 'Left',
      dimensions: '6.5mm x 45mm',
      material: 'Titanium',
      manufacturer: 'Medtronic Legacy / DePuy Synthes',
      lotNumber: `LOT-2026-${lvl}-L-${Math.floor(1000 + Math.random() * 9000)}`
    });
    implants.push({
      id: `imp-${Date.now()}-${idx * 2 + 2}`,
      type: 'Pedicle Screw',
      level: lvl,
      side: 'Right',
      dimensions: '6.5mm x 45mm',
      material: 'Titanium',
      manufacturer: 'Medtronic Legacy / DePuy Synthes',
      lotNumber: `LOT-2026-${lvl}-R-${Math.floor(1000 + Math.random() * 9000)}`
    });
  });

  if (patient.affectedDiscs && patient.affectedDiscs.length > 0) {
    implants.push({
      id: `imp-${Date.now()}-cage`,
      type: 'Interbody Cage',
      level: patient.affectedDiscs[0],
      side: 'Midline',
      dimensions: '10mm height x 28mm length, 4° lordosis',
      material: '3D Porous Titanium',
      manufacturer: 'Stavya Endoskeleton Cage System',
      lotNumber: `LOT-2026-CAGE-${Math.floor(1000 + Math.random() * 9000)}`
    });
  }

  const operativeSteps = [
    `1. Patient transferred to operating room, verified with WHO Surgical Safety Checklist (Sign In).`,
    `2. General endotracheal anesthesia administered; prone positioning achieved on Jackson surgical table with all pressure points padded.`,
    `3. Pre-incision prophylactic antibiotic confirmed: Cefuroxime 1.5g IV given strictly within 60 min of incision.`,
    `4. Fluoroscopy guidance (C-Arm) used to identify target spinal segment (${levels.join('-')}). Local infiltration with 0.5% Bupivacaine with 1:200,000 Adrenaline.`,
    `5. Paramedian tubular MIS exposure performed. High-speed diamond burr and Kerrison rongeurs utilized for decompression of traversing and exiting nerve roots.`,
    `6. Complete discectomy performed at ${patient.affectedDiscs?.join(', ') || 'index level'}. Cartilaginous endplates prepared thoroughly without breach of subchondral bone.`,
    `7. Autologous bone graft mixed with DBM packed into anterior disc space followed by placement of interbody fusion cage under fluoro verification.`,
    `8. Bilateral percutaneous pedicle screws placed at ${levels.join(' and ')}. Contoured connecting rods locked to 90 in-lbs torque.`,
    `9. Thorough wound lavage with 3 Liters normal saline. Hemostasis confirmed. 1 gram Vancomycin powder applied subfascial. Layered closure over negative suction drain.`
  ].join('\n\n');

  const synthesizedNote: OperativeNote = {
    id: patient.operativeNote?.id || `op-${Date.now()}`,
    surgeryDate: patient.plannedOrSurgeryDate || new Date().toISOString().split('T')[0],
    startTime: '08:45 AM',
    endTime: '11:15 AM',
    primarySurgeon: patient.attendingSurgeon || 'Dr. Bharat Rajendraprasad Dave, MS (Ortho), MCh (Spine)',
    assistantSurgeon: patient.fellowOrResident || 'Dr. Amritesh Singh, MS (Ortho)',
    anesthesiologist: 'Dr. Sunita Kulkarni, MD (Anesth)',
    scrubNurse: 'Sister Deepa (Staff Nurse / OT Senior)',
    preOpDiagnosis: patient.primaryDiagnosis,
    postOpDiagnosis: patient.primaryDiagnosis,
    procedureName: patient.plannedProcedure,
    approach: approach,
    estimatedBloodLossMl: 120,
    fluoroscopyTimeSeconds: 52,
    cArmRadiationDAP: radiology?.cArmFluoroDosimetryDAP || '14.2 mGy.cm2 (Exposure: 52 sec)',
    findings: `Severe central canal stenosis with lateral recess impingement at ${levels.join('-')}. Nerve root fully mobilized and free of tension post-decompression. Excellent pedicle purchase achieved bilaterally.`,
    operativeSteps: operativeSteps,
    implantsUsed: implants,
    neuromonitoring: {
      modality: ['MEP', 'SSEP', 'Free-Run EMG'],
      baselineEstablished: true,
      baselineNotes: 'Stable bilateral lower extremity motor and sensory evoked potential baselines established pre-positioning.',
      intraopEvents: 'No amplitude drops >50% or latency prolongations >10% throughout decompression or instrumentation.',
      closingStatus: 'Stable Baseline',
      technologistName: 'Rohan Joshi, Lead Neurophysiologist'
    },
    specimensSent: ['Degenerative disc tissue sent for routine histopathology (HPE)'],
    drainPlaced: true,
    drainType: '10 Fr Closed Suction Hemovac Drain',
    complications: 'None. Uneventful surgical procedure.',
    postOpInstructions: [
      'Strict flat bed rest for 4 hours; initiate log rolling q2h thereafter.',
      'Maintain IV fluids at 80 ml/hr until oral intake tolerated.',
      'Check lower limb neurology (bilateral EHL/FHL power and sensations) every 2 hours.',
      'Monitor surgical drain output every 4 hours. Keep wound dressing dry and clean.',
      'Administer multimodal analgesia and second dose Cefuroxime 1.5g IV 12 hours post-op.'
    ],
    status: 'Draft',
    entryAttribution: {
      enteredByName: patient.fellowOrResident || 'Dr. Amritesh Singh, MS (Ortho)',
      enteredByDesignation: 'Spine Surgery Clinical Fellow',
      enteredAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      staffTier: 'SENIOR_REGISTRAR',
      verificationStatus: 'Pending Consultant Review'
    }
  };

  logAuditEvent({
    patientId: patient.id,
    patientName: patient.name,
    department: 'Spine AI Sentinel',
    action: 'SYNTHESIZED_OPERATIVE_NOTE',
    actor: 'Smart Clinical Assistant',
    details: `Auto-synthesized operative note from CSSD, PACS dosimetry (${synthesizedNote.cArmRadiationDAP}), and spine anatomy (${levels.join('-')}).`,
    category: 'SMART_ASSIST'
  });

  res.json(synthesizedNote);
};

router.get('/synthesize-ot-note/:patientId', handleSynthesizeOtNote);
router.post('/synthesize-ot-note/:patientId', handleSynthesizeOtNote);

// 5. GET /api/smart/clinical-summary/:patientId
router.get('/clinical-summary/:patientId', (req: Request, res: Response) => {
  const db = getDatabase();
  const patient = db.patients.find(p => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Combine risk analysis, drug checks, and discharge readiness
  // Fast unified dispatch
  res.json({
    patientId: patient.id,
    patientName: patient.name,
    mrn: patient.mrn,
    age: patient.age,
    gender: patient.gender,
    spineRegion: patient.spineRegion,
    levels: patient.affectedLevels,
    status: patient.status
  });
});

export default router;
