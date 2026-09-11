// Department Connectors data generator & repository for Stavya Spine Hospital
// Links every patient to real departmental streams and employees from the official Stavya Org Chart.

import { PatientDepartmentConnectors } from '../types/spine';

export const DEMO_DEPARTMENT_CONNECTORS: Record<string, PatientDepartmentConnectors> = {
  'patient-1': {
    admissions: {
      uhid: 'STV-2026-004812',
      ipdNumber: 'IPD-26-0891',
      admissionType: 'Planned Elective',
      bedLocation: 'Bed 402',
      wardUnit: '4th Floor Spine IPD Ward',
      payerType: 'TPA / Cashless Insurance',
      tpaName: 'Star Health & Allied Insurance (Medi Assist TPA)',
      preAuthStatus: 'Approved',
      approvedAmount: 320000,
      emergencyContactName: 'Sunita Rajesh Sharma (Wife)',
      emergencyContactPhone: '+91 98251 99012',
      admissionVitals: {
        bloodPressure: '130/82 mmHg',
        pulse: 76,
        spo2: 99,
        weightKg: 74,
        heightCm: 172
      },
      handoverNotes: 'Patient admitted on 07/09/2026 via OPD. Pre-auth sanctioned for ₹3,20,000 for MIS-TLIF with instrumentation. Informed consent in Gujarati & English placed in physical chart.',
      recordedBy: {
        staffId: 'e211',
        name: 'Zeal Vishal Thacore',
        designation: 'IPD Billing & Admission Officer',
        unit: 'Admission',
        contact: '8866091084',
        timestamp: '07-Sep-2026, 07:30 AM IST'
      }
    },
    nursing: {
      floorStation: '4th Floor Ward',
      currentVitals: {
        bloodPressure: '122/74 mmHg',
        pulse: 72,
        temperature: 98.4,
        spo2: 99,
        respiratoryRate: 16,
        vasPainScore: 2,
        bloodSugarRandomMgDl: 118
      },
      preOpStatus: {
        skinPreparationDone: true,
        surgicalSiteMarked: true,
        npoStrictlyMaintainedSince: '06-Sep-2026 23:00',
        ivLineSiteAndGauge: 'Left forearm 18G cannula patent',
        denturesRemoved: true,
        preOpVitalsVerified: true,
        bloodReserveArranged: true
      },
      postOpCare: {
        hourlyNeurovascularCheck: 'Bilateral EHL & FHL 5/5, bilateral dorsalis pedis strong & palpable, sensations intact along L4, L5, S1 dermatomes',
        foleyCatheterStatus: 'Removed on POD 2; voiding clear urine spontaneously',
        activeDrainsStatus: 'Suction drain removed today (cumulative output 87 ml)',
        incisionDressingCondition: 'Two 3cm paramedian dressings dry and intact. No strike-through or soakage',
        patientPositionLog: 'Log rolled q2h; ambulatory with walker and LSO brace'
      },
      nurseAlerts: [
        'Drain removed on POD 2 (22ml in last 24h)',
        'Foley catheter discontinued; spontaneous voiding confirmed',
        'Patient tolerated normal soft diet without nausea'
      ],
      recordedBy: {
        staffId: 'e010',
        name: 'Anita Sunilbhai Gohel',
        designation: 'Floor In-charge · 4th Floor',
        unit: 'Floor In-charges',
        contact: '7016507186',
        timestamp: '09-Sep-2026, 08:45 AM IST'
      }
    },
    radiology: {
      mriStudyId: 'MR-SPN-2026-10492',
      mriSpineProtocol: 'MRI Lumbar Spine with 3D CISS & Myelo-sequences',
      mriReportSummary: 'L4-L5 Grade 1 degenerative spondylolisthesis (anterior translation of 4.2mm) on background of facet arthropathy and ligamentum flavum hypertrophy resulting in critical central canal stenosis (AP diameter 6.8mm) with severe bilateral lateral recess stenosis impinging traversing L5 nerve roots.',
      stenosisSeverity: 'Severe Central Canal Stenosis',
      discPathology: 'L4-L5 broad-based diffuse disc bulge with bilateral foraminal narrowing',
      spondylolisthesisGrade: 'Grade 1 Degenerative Spondylolisthesis (L4 over L5)',
      cordSignalChange: 'None',
      xRayFlexionExtension: 'Dynamic instability noted at L4-L5 on flexion-extension lateral views (3mm translation difference)',
      cArmFluoroDosimetryDAP: '14.2 mGy.cm2 (Fluoroscopy time: 48 sec)',
      pacsViewerUrl: 'http://pacs.stavyaspine.local/study/MR-SPN-2026-10492',
      radiologistInterpretation: 'Findings correlate directly with patient bilateral neurogenic claudication and L5 radiculopathy. Suggestive of mechanical instability requiring decompression and fusion.',
      recordedBy: {
        staffId: 'e048',
        name: 'Dr. Preety Ajay Krishnan',
        designation: 'Radiologist · Head, Radiology',
        unit: 'Radiology',
        contact: '9824202768',
        timestamp: '06-Sep-2026, 04:15 PM IST'
      }
    },
    pacAnesthesia: {
      asaPhysicalStatus: 'ASA II',
      mallampatiScore: 'Class II',
      airwayAssessment: 'Normal thyromental distance, full neck extension, mouth opening > 3 fingers, stable cervical spine',
      cardiacClearanceSummary: 'Normal ECG, 2D Echocardiogram shows LVEF 60% with grade 1 diastolic dysfunction. Cleared for GA in prone position.',
      physicianMedicalClearance: 'Cleared by Dr. Saunak Dudhiya (Physician & Cardiologist). Blood pressure well controlled on Tab. Telmisartan 40mg.',
      crossMatchedBloodUnits: '2 Units Packed Red Blood Cells (PRBC) cross-matched and reserved at Stavya Blood Storage Centre',
      plannedAnesthesiaType: 'General Endotracheal Anesthesia with Total Intravenous Anesthesia (TIVA) for intra-op neuromonitoring',
      pronePositionClearance: 'Fit for Prone Operative Position',
      specialMonitoringRequired: 'Arterial Line left radial artery, dual large-bore IV access, bladder temperature probe',
      pacFitnessStatus: 'Fit for Spine Surgery',
      recordedBy: {
        staffId: 'e064',
        name: 'Dr. Kashyap Rameshchandra Shah',
        designation: 'Head, Anaesthesia',
        unit: 'Anesthesia',
        contact: '9825047846',
        timestamp: '06-Sep-2026, 06:30 PM IST'
      }
    },
    cssdOt: {
      assignedTheatre: 'OT 2 (MIS & Endoscopy)',
      sterileSetBatchNo: 'AUT-STV-260907-02',
      autoclaveIndicatorStatus: 'Class 5 Chemical Indicator PASSED',
      spinalImplantsConsignment: 'Verified on Site: Medtronic CD Horizon Voyager 6.5x45mm pedicle screws (LOT-48291), Capstone PEEK cage 10x28mm (LOT-83921)',
      microscopeStatus: 'Zeiss KINEVO 900 Calibrated & Draped',
      neuromonitoringLeadStatus: 'NIM-Eclipse 32-Channel MEP/SSEP calibrated',
      scrubNurseAssigned: 'Gopalbhai Hareshbhai Prajapati (OT Nurse)',
      otTechnicianAssigned: 'Vijaybhai Kalubhai Sevta (OT Technician)',
      recordedBy: {
        staffId: 'e026',
        name: 'Brijesh Hasmukhkumar Bhatt',
        designation: 'CNO · ICN · NABH Lead',
        unit: 'Nursing Leadership',
        contact: '7486038894',
        timestamp: '07-Sep-2026, 08:15 AM IST'
      }
    },
    pharmacy: {
      surgicalProphylaxisAntibiotic: 'Inj. Cefuroxime 1.5g IV stat administered at 08:45 AM (30 mins prior to surgical incision)',
      anticoagulantProtocol: 'No active antiplatelet. LMWH (Inj. Enoxaparin 40mg s/c) started POD 1 evening after drain output < 100ml',
      dvtRiskAssessment: 'Moderate (Caprini 3-4)',
      implantBoneGraftDispensed: 'Infuse rhBMP-2 Small kit & FloSeal Hemostatic Matrix 5ml dispensed to OT 2',
      currentInpatientMedsCount: 6,
      stockAvailabilityAlerts: [
        'All routine medications verified in stock',
        'Post-op Gabapentin 300mg & Paracetamol IV available'
      ],
      recordedBy: {
        staffId: 'e112',
        name: 'Jatin Jayantilal Pathak',
        designation: 'HOD Pharmacy',
        unit: 'Pharmacy',
        contact: '7486038917',
        timestamp: '07-Sep-2026, 08:30 AM IST'
      }
    },
    physiotherapy: {
      preOpFunctionalBaseline: {
        walkingToleranceMeters: 45,
        gaitPattern: 'Severe neurogenic claudication after 40-50m; forward stooped posture (shopping-cart sign)',
        lumbarSpineRangeOfMotion: 'Extension restricted by 70% due to pain radiating to both calves',
        preOpOswestryPercentage: 62
      },
      postOpMobilizationMilestones: {
        day1LogRollMastered: true,
        bedsideSittingToleranceMins: 35,
        assistedWalkerAmbulationMeters: 120,
        orthoticBracePrescribed: 'Custom LSO Rigid Spinal Brace fitted and verified for snug pelvic fit',
        homeErgonomicsCounselled: true
      },
      rehabilitationInstructions: 'Patient walking comfortably with walker and LSO brace on POD 2. Stair climbing demonstration scheduled before discharge. Avoid forward bending and twisting for 6 weeks.',
      recordedBy: {
        staffId: 'e075',
        name: 'Dr. Parth Janakbhai Joshi',
        designation: 'Head, Physiotherapy & Rehabilitation',
        unit: 'Physiotherapy and Rehabilitation',
        contact: '8488866392',
        timestamp: '09-Sep-2026, 11:30 AM IST'
      }
    },
    financeBilling: {
      totalEstimatedPackageRate: 345000,
      tpaApprovedAmount: 320000,
      patientCoPayOrDeposit: 25000,
      interimBillAmount: 338500,
      billingClearanceForDischarge: 'Cleared for Discharge',
      insuranceClaimNumber: 'CCN-STAR-2026-884210',
      recordedBy: {
        staffId: 'e137',
        name: 'Manthan Ajaybhai Mehta',
        designation: 'Finance Manager',
        unit: 'Finance',
        contact: '9409624969',
        timestamp: '09-Sep-2026, 02:15 PM IST'
      }
    },
    clinicalResearch: {
      stavyaSpineRegistryId: 'STV-REG-LUM-2026-0391',
      trialEnrollmentName: 'MIS-TLIF vs Open TLIF Registry Cohort',
      patientConsentObtained: true,
      promsBaseline: {
        vasBackPain: 7,
        vasLegPain: 9,
        odiDisabilityIndex: 62,
        eq5dQualityOfLife: 45
      },
      scheduledRegistryFollowUps: ['6 Weeks', '3 Months', '6 Months', '1 Year', '2 Years'],
      recordedBy: {
        staffId: 'e061',
        name: 'Dr. Dhara Arvindkumar Panchal',
        designation: 'Head, Clinical Research',
        unit: 'Clinical Research',
        contact: '8866425868',
        timestamp: '07-Sep-2026, 03:00 PM IST'
      }
    }
  },

  'patient-2': {
    admissions: {
      uhid: 'STV-2026-003921',
      ipdNumber: 'IPD-26-0884',
      admissionType: 'Planned Elective',
      bedLocation: 'Bed 501',
      wardUnit: '5th Floor Spine Special Ward',
      payerType: 'Private Cash',
      preAuthStatus: 'Not Applicable (Self-Pay)',
      emergencyContactName: 'Robert Jenkins (Husband)',
      emergencyContactPhone: '+91 99090 12845',
      admissionVitals: {
        bloodPressure: '124/76 mmHg',
        pulse: 68,
        spo2: 100,
        weightKg: 62,
        heightCm: 165
      },
      handoverNotes: 'Admitted for elective C5-C6 ACDF under Dr. Mirant Dave. Neck pain with right C6 radiculopathy and progressive right arm weakness. All investigations submitted.',
      recordedBy: {
        staffId: 'e181',
        name: 'Sharon Girishbhai Christian',
        designation: 'Head, Front Desk',
        unit: 'Front Desk',
        contact: '7486038896',
        timestamp: '08-Sep-2026, 07:00 AM IST'
      }
    },
    nursing: {
      floorStation: '5th Floor Deluxe',
      currentVitals: {
        bloodPressure: '118/74 mmHg',
        pulse: 70,
        temperature: 98.6,
        spo2: 99,
        respiratoryRate: 15,
        vasPainScore: 3,
        bloodSugarRandomMgDl: 102
      },
      preOpStatus: {
        skinPreparationDone: true,
        surgicalSiteMarked: true,
        npoStrictlyMaintainedSince: '07-Sep-2026 23:30',
        ivLineSiteAndGauge: 'Right forearm 18G cannula',
        denturesRemoved: true,
        preOpVitalsVerified: true,
        bloodReserveArranged: true
      },
      postOpCare: {
        hourlyNeurovascularCheck: 'Right biceps 5/5, wrist extensors 5/5, hand grip strong and equal bilaterally. No breathing or swallowing difficulty.',
        foleyCatheterStatus: 'Not required / Voiding spontaneously',
        activeDrainsStatus: 'Mini-suction wound drain active (output 18 ml in last 12h)',
        incisionDressingCondition: 'Transverse anterior neck dressing intact, clean and dry. No hematoma or neck swelling.',
        patientPositionLog: 'Semi-Fowler position 30 degrees; Philadelphia collar in place'
      },
      nurseAlerts: [
        'Post-Op Day 1: Speech clear, swallowing fluids without choking',
        'Cervical collar compliance verified',
        'Drain output minimal (< 20ml); surgeon notified for morning round review'
      ],
      recordedBy: {
        staffId: 'e127',
        name: 'Trupti Dayabhai Asari',
        designation: 'Floor In-charge · 5th Floor',
        unit: 'Floor In-charges',
        contact: '8469100273',
        timestamp: '09-Sep-2026, 07:15 AM IST'
      }
    },
    radiology: {
      mriStudyId: 'MR-SPN-2026-10388',
      mriSpineProtocol: 'MRI Cervical Spine High Resolution with Cord Axial T2',
      mriReportSummary: 'C5-C6 right paracentral extruded disc herniation with inferior migration causing right C6 exiting nerve root impingement and mild anterior thecal sac indentation without cord signal abnormality.',
      stenosisSeverity: 'Lateral Recess & Foraminal Stenosis',
      discPathology: 'C5-C6 extruded disc fragment measuring 5.4 x 4.1 mm',
      cordSignalChange: 'None',
      xRayFlexionExtension: 'Cervical lordosis preserved. Normal alignment on dynamic flexion-extension.',
      cArmFluoroDosimetryDAP: '8.4 mGy.cm2 (Fluoro time: 24 sec)',
      pacsViewerUrl: 'http://pacs.stavyaspine.local/study/MR-SPN-2026-10388',
      radiologistInterpretation: 'Right C6 radicular compression confirmed on MRI. Ideal candidate for anterior cervical discectomy and interbody fusion.',
      recordedBy: {
        staffId: 'e048',
        name: 'Dr. Preety Ajay Krishnan',
        designation: 'Radiologist · Head, Radiology',
        unit: 'Radiology',
        contact: '9824202768',
        timestamp: '07-Sep-2026, 11:30 AM IST'
      }
    },
    pacAnesthesia: {
      asaPhysicalStatus: 'ASA I',
      mallampatiScore: 'Class I',
      airwayAssessment: 'Good cervical range of motion, normal neck extension, normal dentition',
      cardiacClearanceSummary: 'Normal ECG, no prior medical comorbidities, non-smoker',
      physicianMedicalClearance: 'Cleared for general endotracheal anesthesia with reinforced tube',
      crossMatchedBloodUnits: '1 Unit PRBC reserved',
      plannedAnesthesiaType: 'General Endotracheal Anesthesia with prone/supine monitoring',
      pronePositionClearance: 'Fit for Prone Operative Position',
      specialMonitoringRequired: 'Standard ASA monitors, nerve integrity monitor',
      pacFitnessStatus: 'Fit for Spine Surgery',
      recordedBy: {
        staffId: 'e064',
        name: 'Dr. Kashyap Rameshchandra Shah',
        designation: 'Head, Anaesthesia',
        unit: 'Anesthesia',
        contact: '9825047846',
        timestamp: '07-Sep-2026, 05:00 PM IST'
      }
    },
    cssdOt: {
      assignedTheatre: 'OT 3 (Microdiscectomy)',
      sterileSetBatchNo: 'AUT-STV-260908-01',
      autoclaveIndicatorStatus: 'Class 5 Chemical Indicator PASSED',
      spinalImplantsConsignment: 'Cervical PEEK cage (6x14mm) + Anterior titanium cervical plate 24mm & 4 locking screws on site',
      microscopeStatus: 'Leica PROvido Checked',
      neuromonitoringLeadStatus: 'NIM-Eclipse 32-Channel MEP/SSEP calibrated',
      scrubNurseAssigned: 'Priyanka Hemantbhai Jadhav (OT Nurse)',
      otTechnicianAssigned: 'Anandkumar Jitendrabhai Harijn (OT Technician)',
      recordedBy: {
        staffId: 'e026',
        name: 'Brijesh Hasmukhkumar Bhatt',
        designation: 'CNO · ICN · NABH Lead',
        unit: 'Nursing Leadership',
        contact: '7486038894',
        timestamp: '08-Sep-2026, 07:45 AM IST'
      }
    },
    pharmacy: {
      surgicalProphylaxisAntibiotic: 'Inj. Cefuroxime 1.5g IV stat given prior to incision',
      anticoagulantProtocol: 'No anticoagulant history. Mechanical DVT calf pumps applied.',
      dvtRiskAssessment: 'Moderate (Caprini 3-4)',
      implantBoneGraftDispensed: 'DBM putty 1cc + Bone wax + Surgicel dispensed',
      currentInpatientMedsCount: 5,
      stockAvailabilityAlerts: ['All prescribed IV analgesics and antibiotics ready'],
      recordedBy: {
        staffId: 'e112',
        name: 'Jatin Jayantilal Pathak',
        designation: 'HOD Pharmacy',
        unit: 'Pharmacy',
        contact: '7486038917',
        timestamp: '08-Sep-2026, 08:00 AM IST'
      }
    },
    physiotherapy: {
      preOpFunctionalBaseline: {
        walkingToleranceMeters: 500,
        gaitPattern: 'Normal gait; severe pain on cervical extension (Spurling sign positive on right)',
        lumbarSpineRangeOfMotion: 'Normal',
        preOpOswestryPercentage: 18
      },
      postOpMobilizationMilestones: {
        day1LogRollMastered: true,
        bedsideSittingToleranceMins: 45,
        assistedWalkerAmbulationMeters: 200,
        orthoticBracePrescribed: 'Rigid Philadelphia Cervical Collar fitted and adjusted',
        homeErgonomicsCounselled: true
      },
      rehabilitationInstructions: 'Mobilized on POD 1 with Philadelphia collar. Ambulating well without assistance. Advised strictly to avoid neck twisting or flexion.',
      recordedBy: {
        staffId: 'e075',
        name: 'Dr. Parth Janakbhai Joshi',
        designation: 'Head, Physiotherapy & Rehabilitation',
        unit: 'Physiotherapy and Rehabilitation',
        contact: '8488866392',
        timestamp: '09-Sep-2026, 10:15 AM IST'
      }
    },
    financeBilling: {
      totalEstimatedPackageRate: 265000,
      tpaApprovedAmount: 0,
      patientCoPayOrDeposit: 265000,
      interimBillAmount: 248000,
      billingClearanceForDischarge: 'Interim Audit Pending',
      recordedBy: {
        staffId: 'e137',
        name: 'Manthan Ajaybhai Mehta',
        designation: 'Finance Manager',
        unit: 'Finance',
        contact: '9409624969',
        timestamp: '09-Sep-2026, 01:00 PM IST'
      }
    },
    clinicalResearch: {
      stavyaSpineRegistryId: 'STV-REG-CERV-2026-0182',
      trialEnrollmentName: 'Anterior Cervical Reconstruction Registry',
      patientConsentObtained: true,
      promsBaseline: {
        vasBackPain: 2,
        vasLegPain: 0,
        odiDisabilityIndex: 18,
        eq5dQualityOfLife: 60
      },
      scheduledRegistryFollowUps: ['6 Weeks', '3 Months', '1 Year'],
      recordedBy: {
        staffId: 'e061',
        name: 'Dr. Dhara Arvindkumar Panchal',
        designation: 'Head, Clinical Research',
        unit: 'Clinical Research',
        contact: '8866425868',
        timestamp: '08-Sep-2026, 02:30 PM IST'
      }
    }
  },

  'patient-3': {
    admissions: {
      uhid: 'STV-2026-005118',
      ipdNumber: 'IPD-26-0899',
      admissionType: 'Planned Elective',
      bedLocation: 'Bed 408',
      wardUnit: '4th Floor Spine IPD Ward',
      payerType: 'TPA / Cashless Insurance',
      tpaName: 'HDFC ERGO General Insurance (Vidal Health TPA)',
      preAuthStatus: 'Approved',
      approvedAmount: 185000,
      emergencyContactName: 'Bhavna Amit Patel (Wife)',
      emergencyContactPhone: '+91 97241 88320',
      admissionVitals: {
        bloodPressure: '126/80 mmHg',
        pulse: 78,
        spo2: 99,
        weightKg: 80,
        heightCm: 175
      },
      handoverNotes: 'Admitted for left L5-S1 Tubular Microdiscectomy under Dr. Ajay Krishnan. Pre-auth sanction received. No prior surgical history.',
      recordedBy: {
        staffId: 'e211',
        name: 'Zeal Vishal Thacore',
        designation: 'IPD Billing & Admission Officer',
        unit: 'Admission',
        contact: '8866091084',
        timestamp: '08-Sep-2026, 08:30 AM IST'
      }
    },
    nursing: {
      floorStation: '4th Floor Ward',
      currentVitals: {
        bloodPressure: '120/76 mmHg',
        pulse: 74,
        temperature: 98.4,
        spo2: 99,
        respiratoryRate: 16,
        vasPainScore: 2,
        bloodSugarRandomMgDl: 110
      },
      preOpStatus: {
        skinPreparationDone: true,
        surgicalSiteMarked: true,
        npoStrictlyMaintainedSince: '07-Sep-2026 23:00',
        ivLineSiteAndGauge: 'Left forearm 18G cannula',
        denturesRemoved: true,
        preOpVitalsVerified: true,
        bloodReserveArranged: true
      },
      postOpCare: {
        hourlyNeurovascularCheck: 'Left ankle dorsiflexion 5/5, EHL 5/5, plantarflexion 5/5. Pre-op left S1 radicular pain relieved.',
        foleyCatheterStatus: 'Not catheterized; passing urine naturally',
        activeDrainsStatus: 'No surgical drain used (tubular microdiscectomy)',
        incisionDressingCondition: '18mm micro-incision dressing clean and dry',
        patientPositionLog: 'Mobilized out of bed; walking with soft lumbar support'
      },
      nurseAlerts: [
        'Post-Op Day 1: Patient walked to washroom independently',
        'Radicular pain reduced from 9/10 to 1/10',
        'Discharge planned for today evening or tomorrow morning'
      ],
      recordedBy: {
        staffId: 'e010',
        name: 'Anita Sunilbhai Gohel',
        designation: 'Floor In-charge · 4th Floor',
        unit: 'Floor In-charges',
        contact: '7016507186',
        timestamp: '09-Sep-2026, 09:30 AM IST'
      }
    },
    radiology: {
      mriStudyId: 'MR-SPN-2026-10512',
      mriSpineProtocol: 'MRI Lumbar Spine High-Resolution Sagittal & Axial T2',
      mriReportSummary: 'Left paracentral extruded disc herniation at L5-S1 displacing and compressing the traversing left S1 nerve root in the lateral recess. Minimal degenerative facet change.',
      stenosisSeverity: 'Lateral Recess & Foraminal Stenosis',
      discPathology: 'L5-S1 left paracentral extrusion with inferior sequestration',
      cordSignalChange: 'None',
      xRayFlexionExtension: 'Normal lumbosacral alignment. No segmental instability.',
      pacsViewerUrl: 'http://pacs.stavyaspine.local/study/MR-SPN-2026-10512',
      radiologistInterpretation: 'Classical left S1 nerve root compression suitable for targeted tubular microdiscectomy.',
      recordedBy: {
        staffId: 'e048',
        name: 'Dr. Preety Ajay Krishnan',
        designation: 'Radiologist · Head, Radiology',
        unit: 'Radiology',
        contact: '9824202768',
        timestamp: '07-Sep-2026, 03:30 PM IST'
      }
    },
    pacAnesthesia: {
      asaPhysicalStatus: 'ASA I',
      mallampatiScore: 'Class I',
      airwayAssessment: 'Normal airway and neck flexibility',
      cardiacClearanceSummary: 'Normal ECG and clinical cardio-respiratory exam',
      physicianMedicalClearance: 'Cleared by Dr. Priyank Kapadiya for General Anesthesia in prone position',
      crossMatchedBloodUnits: 'Blood group typed & screened',
      plannedAnesthesiaType: 'General Endotracheal Anesthesia',
      pronePositionClearance: 'Fit for Prone Operative Position',
      specialMonitoringRequired: 'Standard monitoring',
      pacFitnessStatus: 'Fit for Spine Surgery',
      recordedBy: {
        staffId: 'e064',
        name: 'Dr. Kashyap Rameshchandra Shah',
        designation: 'Head, Anaesthesia',
        unit: 'Anesthesia',
        contact: '9825047846',
        timestamp: '07-Sep-2026, 06:00 PM IST'
      }
    },
    cssdOt: {
      assignedTheatre: 'OT 2 (MIS & Endoscopy)',
      sterileSetBatchNo: 'AUT-STV-260908-04',
      autoclaveIndicatorStatus: 'Class 5 Chemical Indicator PASSED',
      spinalImplantsConsignment: 'No implants required (Microdiscectomy); tubular retractor set (18mm) sterilized',
      microscopeStatus: 'Zeiss KINEVO 900 Calibrated & Draped',
      neuromonitoringLeadStatus: 'NIM-Eclipse 32-Channel MEP/SSEP calibrated',
      scrubNurseAssigned: 'Dhruvi Bharatbhai Solanki (OT Nurse)',
      otTechnicianAssigned: 'Himanshu Babubhai Solanki (OT Technician)',
      recordedBy: {
        staffId: 'e026',
        name: 'Brijesh Hasmukhkumar Bhatt',
        designation: 'CNO · ICN · NABH Lead',
        unit: 'Nursing Leadership',
        contact: '7486038894',
        timestamp: '08-Sep-2026, 09:00 AM IST'
      }
    },
    pharmacy: {
      surgicalProphylaxisAntibiotic: 'Inj. Cefuroxime 1.5g IV stat administered pre-op',
      anticoagulantProtocol: 'Not applicable',
      dvtRiskAssessment: 'Moderate (Caprini 3-4)',
      implantBoneGraftDispensed: 'Surgicel & Gelfoam dispensed',
      currentInpatientMedsCount: 4,
      stockAvailabilityAlerts: ['Routine post-op analgesia ready'],
      recordedBy: {
        staffId: 'e112',
        name: 'Jatin Jayantilal Pathak',
        designation: 'HOD Pharmacy',
        unit: 'Pharmacy',
        contact: '7486038917',
        timestamp: '08-Sep-2026, 09:15 AM IST'
      }
    },
    physiotherapy: {
      preOpFunctionalBaseline: {
        walkingToleranceMeters: 60,
        gaitPattern: 'Left antalgic limp with severe calf pain (VAS 9/10)',
        lumbarSpineRangeOfMotion: 'SLR restricted to 25 degrees on left side',
        preOpOswestryPercentage: 58
      },
      postOpMobilizationMilestones: {
        day1LogRollMastered: true,
        bedsideSittingToleranceMins: 40,
        assistedWalkerAmbulationMeters: 150,
        orthoticBracePrescribed: 'Soft Lumbar Support Belt',
        homeErgonomicsCounselled: true
      },
      rehabilitationInstructions: 'Post-op SLR negative. Normal power. Encouraged active walking with soft belt. Avoid heavy bending.',
      recordedBy: {
        staffId: 'e075',
        name: 'Dr. Parth Janakbhai Joshi',
        designation: 'Head, Physiotherapy & Rehabilitation',
        unit: 'Physiotherapy and Rehabilitation',
        contact: '8488866392',
        timestamp: '09-Sep-2026, 11:00 AM IST'
      }
    },
    financeBilling: {
      totalEstimatedPackageRate: 195000,
      tpaApprovedAmount: 185000,
      patientCoPayOrDeposit: 10000,
      interimBillAmount: 190000,
      billingClearanceForDischarge: 'Cleared for Discharge',
      insuranceClaimNumber: 'CCN-HDFC-2026-904122',
      recordedBy: {
        staffId: 'e137',
        name: 'Manthan Ajaybhai Mehta',
        designation: 'Finance Manager',
        unit: 'Finance',
        contact: '9409624969',
        timestamp: '09-Sep-2026, 02:00 PM IST'
      }
    },
    clinicalResearch: {
      stavyaSpineRegistryId: 'STV-REG-LUM-2026-0398',
      trialEnrollmentName: 'Tubular Microdiscectomy Registry',
      patientConsentObtained: true,
      promsBaseline: {
        vasBackPain: 4,
        vasLegPain: 9,
        odiDisabilityIndex: 58,
        eq5dQualityOfLife: 50
      },
      scheduledRegistryFollowUps: ['6 Weeks', '3 Months', '1 Year'],
      recordedBy: {
        staffId: 'e061',
        name: 'Dr. Dhara Arvindkumar Panchal',
        designation: 'Head, Clinical Research',
        unit: 'Clinical Research',
        contact: '8866425868',
        timestamp: '08-Sep-2026, 03:15 PM IST'
      }
    }
  },

  'patient-4': {
    admissions: {
      uhid: 'STV-2026-004902',
      ipdNumber: 'IPD-26-0895',
      admissionType: 'Planned Elective',
      bedLocation: 'Bed 603',
      wardUnit: '6th Floor Spine Suite Ward',
      payerType: 'TPA / Cashless Insurance',
      tpaName: 'ICICI Lombard General Insurance',
      preAuthStatus: 'Approved',
      approvedAmount: 480000,
      emergencyContactName: 'Narayan Nair (Father)',
      emergencyContactPhone: '+91 94280 44912',
      admissionVitals: {
        bloodPressure: '112/70 mmHg',
        pulse: 72,
        spo2: 99,
        weightKg: 46,
        heightCm: 154
      },
      handoverNotes: '16-year-old girl with progressive Adolescent Idiopathic Scoliosis (Lenke 1A, Cobb angle 56 degrees). Scheduled for posterior spinal fusion T4-L1 with Dr. Bharat Dave. Pre-auth sanctioned.',
      recordedBy: {
        staffId: 'e211',
        name: 'Zeal Vishal Thacore',
        designation: 'IPD Billing & Admission Officer',
        unit: 'Admission',
        contact: '8866091084',
        timestamp: '08-Sep-2026, 09:00 AM IST'
      }
    },
    nursing: {
      floorStation: '6th Floor Suite',
      currentVitals: {
        bloodPressure: '114/72 mmHg',
        pulse: 76,
        temperature: 98.4,
        spo2: 99,
        respiratoryRate: 16,
        vasPainScore: 4,
        bloodSugarRandomMgDl: 96
      },
      preOpStatus: {
        skinPreparationDone: true,
        surgicalSiteMarked: true,
        npoStrictlyMaintainedSince: 'Pending surgery tomorrow',
        ivLineSiteAndGauge: 'Left forearm 18G cannula',
        denturesRemoved: false,
        preOpVitalsVerified: true,
        bloodReserveArranged: true
      },
      postOpCare: {
        hourlyNeurovascularCheck: 'Pre-op baseline: Motor 5/5 in all extremities, symmetrical reflexes',
        foleyCatheterStatus: 'To be inserted in OT',
        activeDrainsStatus: 'To be placed in OT',
        incisionDressingCondition: 'Pre-op chlorhexidine skin prep done',
        patientPositionLog: 'Comfortable in bed'
      },
      nurseAlerts: [
        'Pre-Op Scoliosis workup completed',
        'Blood cross-matching: 4 Units PRBC & 2 Units FFP reserved',
        'Incentive spirometry practiced by patient'
      ],
      recordedBy: {
        staffId: 'e037',
        name: 'Dilipkumar Sankarlal Labana',
        designation: 'Floor In-charge · 6th Floor',
        unit: 'Floor In-charges',
        contact: '7231843184',
        timestamp: '09-Sep-2026, 10:00 AM IST'
      }
    },
    radiology: {
      mriStudyId: 'XR-SPN-2026-10499',
      mriSpineProtocol: 'Whole Spine Standing Scannogram & Full Spine MRI',
      mriReportSummary: 'Major right thoracic curve measuring 56° from T5 to T12 with apex at T8. Compensatory lumbar curve measuring 28°. Normal neuroaxis on whole-spine screening MRI (no syrinx, tethered cord, or Chiari malformation).',
      stenosisSeverity: 'Mild',
      discPathology: 'Normal disc hydration throughout lumbar spine',
      cordSignalChange: 'None',
      xRayFlexionExtension: 'Right-bending view demonstrates thoracic curve correction to 34° (flexible component)',
      pacsViewerUrl: 'http://pacs.stavyaspine.local/study/XR-SPN-2026-10499',
      radiologistInterpretation: 'Structural Lenke Type 1A AIS suitable for selective thoracic and upper lumbar posterior spinal fusion.',
      recordedBy: {
        staffId: 'e048',
        name: 'Dr. Preety Ajay Krishnan',
        designation: 'Radiologist · Head, Radiology',
        unit: 'Radiology',
        contact: '9824202768',
        timestamp: '08-Sep-2026, 04:00 PM IST'
      }
    },
    pacAnesthesia: {
      asaPhysicalStatus: 'ASA I',
      mallampatiScore: 'Class I',
      airwayAssessment: 'Airway normal, pulmonary function test shows FVC 84% of predicted (mild restrictive pattern due to thoracic scoliosis)',
      cardiacClearanceSummary: 'Normal 2D Echo and ECG',
      physicianMedicalClearance: 'Cleared by Dr. Saunak Dudhiya. Blood bank coordinated for cell-saver and autologous blood transfusion.',
      crossMatchedBloodUnits: '4 Units PRBC, 2 Units FFP, 4 Units Platelets on call',
      plannedAnesthesiaType: 'Total Intravenous Anesthesia (TIVA with Propofol & Remifentanil) for continuous MEP/SSEP monitoring',
      pronePositionClearance: 'Fit for Prone Operative Position',
      specialMonitoringRequired: 'Arterial line, central venous pressure line, FloTrac cardiac output monitor',
      pacFitnessStatus: 'Fit for Spine Surgery',
      recordedBy: {
        staffId: 'e064',
        name: 'Dr. Kashyap Rameshchandra Shah',
        designation: 'Head, Anaesthesia',
        unit: 'Anesthesia',
        contact: '9825047846',
        timestamp: '08-Sep-2026, 06:30 PM IST'
      }
    },
    cssdOt: {
      assignedTheatre: 'OT 1 (Complex Deformity)',
      sterileSetBatchNo: 'AUT-STV-260908-08',
      autoclaveIndicatorStatus: 'Class 5 Chemical Indicator PASSED',
      spinalImplantsConsignment: 'Medtronic CD Horizon Solera Deformity Set (Cobalt Chrome 5.5/6.0 rods, dual-thread screws, multi-level cross-links, Ponte osteotomes) verified',
      microscopeStatus: 'Loupes (4.5x)',
      neuromonitoringLeadStatus: 'NIM-Eclipse 32-Channel MEP/SSEP calibrated',
      scrubNurseAssigned: 'Bansari Sandipkumar Patel (OT Nurse)',
      otTechnicianAssigned: 'Gopalbhai Dharamsinh Naiya (OT Technician)',
      recordedBy: {
        staffId: 'e026',
        name: 'Brijesh Hasmukhkumar Bhatt',
        designation: 'CNO · ICN · NABH Lead',
        unit: 'Nursing Leadership',
        contact: '7486038894',
        timestamp: '09-Sep-2026, 08:00 AM IST'
      }
    },
    pharmacy: {
      surgicalProphylaxisAntibiotic: 'Inj. Cefuroxime 1.5g IV + Inj. Vancomycin 1g IV scheduled pre-op',
      anticoagulantProtocol: 'Post-op mechanical compression stockings; LMWH POD 1',
      dvtRiskAssessment: 'Moderate (Caprini 3-4)',
      implantBoneGraftDispensed: 'Autologous bone graft collector + Allograft cancellous chips 30cc + Vancomycin 2g powder reserved',
      currentInpatientMedsCount: 4,
      stockAvailabilityAlerts: ['All deformity hemostats (Tranexamic acid 1g IV) prepared'],
      recordedBy: {
        staffId: 'e112',
        name: 'Jatin Jayantilal Pathak',
        designation: 'HOD Pharmacy',
        unit: 'Pharmacy',
        contact: '7486038917',
        timestamp: '09-Sep-2026, 08:30 AM IST'
      }
    },
    physiotherapy: {
      preOpFunctionalBaseline: {
        walkingToleranceMeters: 1000,
        gaitPattern: 'Mild shoulder asymmetry (right shoulder elevation 2.5cm) and right rib hump',
        lumbarSpineRangeOfMotion: 'Thoracic flexibility confirmed',
        preOpOswestryPercentage: 14
      },
      postOpMobilizationMilestones: {
        day1LogRollMastered: false,
        bedsideSittingToleranceMins: 0,
        assistedWalkerAmbulationMeters: 0,
        orthoticBracePrescribed: 'Custom Molded TLSO Brace to be measured post-op',
        homeErgonomicsCounselled: true
      },
      rehabilitationInstructions: 'Pre-operative respiratory muscle training and log-roll instructions provided.',
      recordedBy: {
        staffId: 'e075',
        name: 'Dr. Parth Janakbhai Joshi',
        designation: 'Head, Physiotherapy & Rehabilitation',
        unit: 'Physiotherapy and Rehabilitation',
        contact: '8488866392',
        timestamp: '09-Sep-2026, 11:15 AM IST'
      }
    },
    financeBilling: {
      totalEstimatedPackageRate: 510000,
      tpaApprovedAmount: 480000,
      patientCoPayOrDeposit: 30000,
      interimBillAmount: 495000,
      billingClearanceForDischarge: 'Interim Audit Pending',
      insuranceClaimNumber: 'CCN-ICICI-2026-773190',
      recordedBy: {
        staffId: 'e137',
        name: 'Manthan Ajaybhai Mehta',
        designation: 'Finance Manager',
        unit: 'Finance',
        contact: '9409624969',
        timestamp: '09-Sep-2026, 01:30 PM IST'
      }
    },
    clinicalResearch: {
      stavyaSpineRegistryId: 'STV-REG-DEFORM-2026-0044',
      trialEnrollmentName: 'Prospective AIS High-Density Pedicle Screw Registry',
      patientConsentObtained: true,
      promsBaseline: {
        vasBackPain: 3,
        vasLegPain: 0,
        odiDisabilityIndex: 14,
        eq5dQualityOfLife: 75
      },
      scheduledRegistryFollowUps: ['6 Weeks', '3 Months', '6 Months', '1 Year', '2 Years', '5 Years'],
      recordedBy: {
        staffId: 'e061',
        name: 'Dr. Dhara Arvindkumar Panchal',
        designation: 'Head, Clinical Research',
        unit: 'Clinical Research',
        contact: '8866425868',
        timestamp: '08-Sep-2026, 05:00 PM IST'
      }
    }
  },

  'patient-5': {
    admissions: {
      uhid: 'STV-2026-004119',
      ipdNumber: 'IPD-26-0887',
      admissionType: 'Planned Elective',
      bedLocation: 'Bed 405',
      wardUnit: '4th Floor Spine IPD Ward',
      payerType: 'Private Cash',
      preAuthStatus: 'Not Applicable (Self-Pay)',
      emergencyContactName: 'Laura Miller (Daughter)',
      emergencyContactPhone: '+91 98980 33412',
      admissionVitals: {
        bloodPressure: '136/84 mmHg',
        pulse: 74,
        spo2: 98,
        weightKg: 82,
        heightCm: 178
      },
      handoverNotes: '68-year-old gentleman admitted for L2-L5 Posterior Spinal Decompression, bilateral foraminotomies and fusion under Dr. Ravi Ranjan Rai. Pre-op cardiac clearance on file.',
      recordedBy: {
        staffId: 'e181',
        name: 'Sharon Girishbhai Christian',
        designation: 'Head, Front Desk',
        unit: 'Front Desk',
        contact: '7486038896',
        timestamp: '07-Sep-2026, 10:00 AM IST'
      }
    },
    nursing: {
      floorStation: '4th Floor Ward',
      currentVitals: {
        bloodPressure: '128/78 mmHg',
        pulse: 72,
        temperature: 98.4,
        spo2: 99,
        respiratoryRate: 16,
        vasPainScore: 3,
        bloodSugarRandomMgDl: 122
      },
      preOpStatus: {
        skinPreparationDone: true,
        surgicalSiteMarked: true,
        npoStrictlyMaintainedSince: '07-Sep-2026 23:00',
        ivLineSiteAndGauge: 'Right forearm 18G cannula',
        denturesRemoved: true,
        preOpVitalsVerified: true,
        bloodReserveArranged: true
      },
      postOpCare: {
        hourlyNeurovascularCheck: 'Bilateral lower limb motor 5/5, bilateral pedal pulses positive, no numbness',
        foleyCatheterStatus: 'In situ, draining clear urine (450ml in 6 hours)',
        activeDrainsStatus: 'Subfascial Hemovac drain active (output 45ml in last 12 hours)',
        incisionDressingCondition: 'Midline lumbar dressing dry and clean',
        patientPositionLog: 'Log roll q2h, started assisted sitting on bed edge'
      },
      nurseAlerts: [
        'POD 1: Patient sat at bedside for 20 minutes',
        'Drain output within normal limits (45ml in 12h)',
        'Blood sugar stable (122 mg/dL)'
      ],
      recordedBy: {
        staffId: 'e010',
        name: 'Anita Sunilbhai Gohel',
        designation: 'Floor In-charge · 4th Floor',
        unit: 'Floor In-charges',
        contact: '7016507186',
        timestamp: '09-Sep-2026, 08:30 AM IST'
      }
    },
    radiology: {
      mriStudyId: 'MR-SPN-2026-10420',
      mriSpineProtocol: 'MRI Lumbar Spine Multi-sequence Protocol',
      mriReportSummary: 'Multi-level degenerative canal and foraminal stenosis most pronounced at L3-L4 and L4-L5 with redundant cauda equina nerve roots. Congenitally narrow lumbar canal with secondary degenerative hypertrophy.',
      stenosisSeverity: 'Severe Central Canal Stenosis',
      discPathology: 'L2-L3, L3-L4, L4-L5 diffuse annular disc bulges',
      cordSignalChange: 'None',
      xRayFlexionExtension: 'Grade 1 retrolisthesis L3 on L4. No dynamic progression.',
      cArmFluoroDosimetryDAP: '16.8 mGy.cm2 (Fluoro time: 54 sec)',
      pacsViewerUrl: 'http://pacs.stavyaspine.local/study/MR-SPN-2026-10420',
      radiologistInterpretation: 'Multi-level lumbar canal stenosis correlating with severe neurogenic claudication (walking distance < 30 meters).',
      recordedBy: {
        staffId: 'e048',
        name: 'Dr. Preety Ajay Krishnan',
        designation: 'Radiologist · Head, Radiology',
        unit: 'Radiology',
        contact: '9824202768',
        timestamp: '07-Sep-2026, 02:00 PM IST'
      }
    },
    pacAnesthesia: {
      asaPhysicalStatus: 'ASA II',
      mallampatiScore: 'Class II',
      airwayAssessment: 'Good mouth opening, mild cervical stiffness',
      cardiacClearanceSummary: 'Hypertension on Tab. Amlodipine 5mg. 2D Echo LVEF 55%, mild concentric LVH. Cleared for GA.',
      physicianMedicalClearance: 'Cleared by Dr. Saunak Dudhiya. Pre-op blood pressure 130/80 mmHg.',
      crossMatchedBloodUnits: '2 Units PRBC cross-matched and reserved',
      plannedAnesthesiaType: 'General Endotracheal Anesthesia',
      pronePositionClearance: 'Fit for Prone Operative Position',
      specialMonitoringRequired: 'Arterial line, temperature monitoring',
      pacFitnessStatus: 'Fit for Spine Surgery',
      recordedBy: {
        staffId: 'e064',
        name: 'Dr. Kashyap Rameshchandra Shah',
        designation: 'Head, Anaesthesia',
        unit: 'Anesthesia',
        contact: '9825047846',
        timestamp: '07-Sep-2026, 05:45 PM IST'
      }
    },
    cssdOt: {
      assignedTheatre: 'OT 5 (Trauma)',
      sterileSetBatchNo: 'AUT-STV-260908-06',
      autoclaveIndicatorStatus: 'Class 5 Chemical Indicator PASSED',
      spinalImplantsConsignment: 'Medtronic 8x Pedicle Screws (6.5x45mm) & dual 5.5mm Ti rods verified',
      microscopeStatus: 'Zeiss KINEVO 900 Calibrated & Draped',
      neuromonitoringLeadStatus: 'NIM-Eclipse 32-Channel MEP/SSEP calibrated',
      scrubNurseAssigned: 'Sanjana Maheshbhai Gohel (OT Nurse)',
      otTechnicianAssigned: 'Shailesh Dahyabhai Parmar (OT Technician)',
      recordedBy: {
        staffId: 'e026',
        name: 'Brijesh Hasmukhkumar Bhatt',
        designation: 'CNO · ICN · NABH Lead',
        unit: 'Nursing Leadership',
        contact: '7486038894',
        timestamp: '08-Sep-2026, 08:30 AM IST'
      }
    },
    pharmacy: {
      surgicalProphylaxisAntibiotic: 'Inj. Cefuroxime 1.5g IV given stat at 08:30 AM',
      anticoagulantProtocol: 'No active antiplatelet. LMWH initiated on POD 1 evening.',
      dvtRiskAssessment: 'High Risk (Caprini > 5) - Compression stockings + Chemoprophylaxis',
      implantBoneGraftDispensed: 'Local bone graft + DBM 10cc putty issued',
      currentInpatientMedsCount: 6,
      stockAvailabilityAlerts: ['All post-op medications supplied'],
      recordedBy: {
        staffId: 'e112',
        name: 'Jatin Jayantilal Pathak',
        designation: 'HOD Pharmacy',
        unit: 'Pharmacy',
        contact: '7486038917',
        timestamp: '08-Sep-2026, 08:45 AM IST'
      }
    },
    physiotherapy: {
      preOpFunctionalBaseline: {
        walkingToleranceMeters: 30,
        gaitPattern: 'Severe neurogenic claudication at 30m; bilateral leg heaviness',
        lumbarSpineRangeOfMotion: 'Markedly restricted lumbar extension',
        preOpOswestryPercentage: 66
      },
      postOpMobilizationMilestones: {
        day1LogRollMastered: true,
        bedsideSittingToleranceMins: 25,
        assistedWalkerAmbulationMeters: 60,
        orthoticBracePrescribed: 'Custom LSO rigid brace fitted',
        homeErgonomicsCounselled: true
      },
      rehabilitationInstructions: 'Mobilized to bedside sitting on POD 1. Walker ambulation initiated with LSO brace.',
      recordedBy: {
        staffId: 'e075',
        name: 'Dr. Parth Janakbhai Joshi',
        designation: 'Head, Physiotherapy & Rehabilitation',
        unit: 'Physiotherapy and Rehabilitation',
        contact: '8488866392',
        timestamp: '09-Sep-2026, 10:45 AM IST'
      }
    },
    financeBilling: {
      totalEstimatedPackageRate: 360000,
      tpaApprovedAmount: 0,
      patientCoPayOrDeposit: 360000,
      interimBillAmount: 345000,
      billingClearanceForDischarge: 'Interim Audit Pending',
      recordedBy: {
        staffId: 'e137',
        name: 'Manthan Ajaybhai Mehta',
        designation: 'Finance Manager',
        unit: 'Finance',
        contact: '9409624969',
        timestamp: '09-Sep-2026, 01:15 PM IST'
      }
    },
    clinicalResearch: {
      stavyaSpineRegistryId: 'STV-REG-LUM-2026-0402',
      trialEnrollmentName: 'Multi-Level Lumbar Canal Stenosis Elderly Registry',
      patientConsentObtained: true,
      promsBaseline: {
        vasBackPain: 6,
        vasLegPain: 8,
        odiDisabilityIndex: 66,
        eq5dQualityOfLife: 42
      },
      scheduledRegistryFollowUps: ['6 Weeks', '3 Months', '1 Year'],
      recordedBy: {
        staffId: 'e061',
        name: 'Dr. Dhara Arvindkumar Panchal',
        designation: 'Head, Clinical Research',
        unit: 'Clinical Research',
        contact: '8866425868',
        timestamp: '08-Sep-2026, 03:00 PM IST'
      }
    }
  }
};
