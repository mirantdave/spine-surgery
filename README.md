# 🏥 SpineOS | Paperless Spine Surgery Digital Suite
**Stavya Spine Hospital & Research Institute**

A comprehensive, paperless digital clinical and operative suite designed specifically for spine surgeons. SpineOS integrates operative notes, interactive 3D/2D spinal column visualizers, 9 departmental hospital connectors, and an advanced AI Sentinel for surgical risk stratification and clinical decision support.

---

## 🌐 Instant Local WiFi Access

SpineOS is pre-configured to bind to all network interfaces (`0.0.0.0`). Any mobile device, iPad, tablet, or laptop connected to the same hospital or clinic WiFi can access the suite directly:

- **Web Application Client**: `http://192.168.6.167:3030`
- **Clinical API Backend**: `http://192.168.6.167:3031`
- **WiFi Pairing QR Code**: Click the **WiFi Broadcast** button in the top navbar to display the instant scan QR code for bedside rounds.

---

## 🚀 Quick Start from GitHub

```bash
# 1. Clone the repository
git clone https://github.com/mirantdave/spine-surgery.git
cd spine-surgery

# 2. Install dependencies
npm install

# 3. Launch both the Clinical Backend (port 3031) and Vite Client (port 3030)
npm run dev
```

The system will automatically detect your local WiFi IPv4 address and print the network URL in the terminal.

---

## 🧠 Key Features & Modules

### 1. SpineAI Sentinel & Clinical Decision Support
- **Modified Frailty Index (mFI-5)**: Assesses 5 comorbidity drivers to predict 30-day post-op morbidity risk.
- **Caprini VTE / DVT Risk Engine**: Stratified thromboprophylaxis recommendations (IPC vs. LMWH timing) for prone spine surgery.
- **Drug-Allergy Sentinel**: Active prescription audits flagging antiplatelets before incision, NSAID renal precautions, and missing antimicrobial prophylaxis.
- **Discharge Readiness Score (DRS 0–100%)**: Objective 5-milestone criteria tracking (pain control, ambulation, drain output, catheter removal, TPA insurance clearance).

### 2. Cross-Departmental Connectors (9 Active Streams)
1. **Admissions & TPA Desk**: Pre-auth sanctions, bed location, insurance clearance.
2. **Inpatient Nursing**: Real-time vitals telemetry, hourly neuro checks, surgical drain logs.
3. **Radiology & PACS**: DICOM study linking, stenosis grading, C-Arm fluoro dosimetry (`mGy·cm²`).
4. **PAC & Anesthesia**: ASA grade, Mallampati airway, prone tolerance, neuromonitoring baseline.
5. **CSSD & Operating Theatre**: Sterile implant tray barcodes, autoclave biological indicator verification.
6. **Clinical Pharmacy**: Antibiotic prophylaxis timing (60 min pre-incision), multimodal analgesics.
7. **Physiotherapy & Rehab**: Baseline ODI/VAS, post-op day-by-day mobilization milestones.
8. **Finance & Billing**: Cashless claim approval, implant cost accounting, discharge bill clearance.
9. **Clinical Research**: Stavya Spine Registry enrollment, pre/post PROM outcomes.

### 3. Operative & Anatomical Suite
- **Interactive Spine Column Selector**: Clickable vertebral bodies (C1-S1) and disc spaces.
- **Smart Operative Note Auto-Fill**: One-click synthesis from CSSD implants, PACS dosimetry, and spine anatomy.
- **2D/3D Executed Surgery Visualizer**: AP and Lateral x-ray fluoroscopy animations with pedicle screws and cages.
- **WHO Surgical Safety Checklist**: Sign-in, Time-out, and Sign-out verification.
- **Ward Rounds Tracker**: Daily progress notes, drain tracking, and pain VAS logs.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS design tokens (Apple Health / Glassmorphic aesthetics), Lucide icons, Three.js.
- **Backend**: Node.js, Express 5, TypeScript (via `tsx`).
- **Database**: Persistent JSON store with in-memory caching and atomic file writes (`server/db.ts`).
- **Network**: Dual-binding to `0.0.0.0` for local LAN / WiFi broadcast.
