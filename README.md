# JomiGuard AI — Bangladesh Land Document Analysis Platform

**JomiGuard AI** is an AI-powered preliminary land document screening assistant designed for Bangladeshi landowners, analysts, and service professionals. It compares land deeds (দলিল), survey khatians (খতিয়ান), and mutation records (নামজারি), extracts key fields, detects discrepancies, and identifies attributes requiring manual authority verification.

## 🏆 LandTech 2026 — DIU LandTech Innovation Hackathon Submission
- **Host Institution**: Daffodil International University (DIU)
- **Final Round Venue**: Knowledge Tower (Library), Daffodil International University
- **Track**: Digital Land Records, Verification & Digitization
- **Selected Problem Statement**: **P3 — Catch Fraud & Double-Selling**
  - *Core capability:* Cross-generation survey reconciliation (CS, SA, RS, and BS), identifying registration vs mutation mismatches, and preventing fractional over-selling.
  - *Synergistic modules:* P1 (Digitize Old Records), P2 (Verify Deeds & Ownership), P4 (Smart e-Mutation & Registry), P5 (Check Before You Buy).
- **Target Deployments**: 8 statutory venues (Sub-Registry Offices, AC Land Offices, Banks, Acquisition Offices, DLRS, Courts, Citizens, and Real Estate Developers).
- **Hackathon Ethics & Rule Compliance**:
  - **100% Synthetic Dummy Data:** Zero real citizen names, real NIDs, or private records.
  - **Zero Government Web Scraping:** Does not query or scrape live government portals; provides direct verified public links.
  - **AI Tool Disclosure:** Built using `@google/genai` TypeScript SDK (model: `gemini-3.8-flash`) with telemetry headers and deterministic fallback parsing.

---

## ⚠️ Important Legal & Regulatory Notice
> **Preliminary Document Screening Assistant Only**
>
> JomiGuard AI is **not** an official government platform, ownership verification authority, title certification service, or fraud detection authority.
> Differences detected between documents (such as survey era renumbering or fractional mutations) do not prove fraud or determine legal ownership. Always verify original records with the Assistant Commissioner (Land), Sub-Registry Office, or a qualified advocate.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ (tested on Node.js v22)
- npm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Environment Configuration
cp .env.example .env
# Provide GEMINI_API_KEY in .env if using live Gemini extraction
```

### Running the Full-Stack Application
```bash
# Starts Express server + Vite middlewares on port 3000
npm run dev

# Or build for production
npm run build
npm start
```

---

## 🧪 Acceptance Test Scenario ("Demo Land Case 001")

The application is pre-seeded with the exact benchmark acceptance scenario:

- **Case Title**: Demo Land Case 001 (`BD-CASE-2026-001`)
- **Document A**: Registered Sale Deed (দলিল নং ৪৫/২০১২)
  - Khatian number: `30`
  - Dag number: `125`
  - Land area: `1.50 acres`
  - Mouza: `Demo Mouza`
  - Owner name: `Rahim Uddin`
- **Document B**: Field Mutation Khatian (নামজারি রেকর্ড)
  - Khatian number: `[MISSING / OMITTED]`
  - Dag number: `125`
  - Land area: `1.25 acres`
  - Mouza: `Demo Mouza`
  - Owner name: `Rahim Uddin`

### Acceptance Test Execution & Verification
1. Open the application. On the **Dashboard**, click the prominent banner **"Launch Case 001 Comparison"** (or open the **AI Comparison** tab).
2. The comparison engine deterministically generates the following results:
   - **Dag Number**: `MATCH` (125 == 125)
   - **Mouza**: `MATCH` ("Demo Mouza" == "Demo Mouza")
   - **Owner Name**: `MATCH` ("Rahim Uddin" == "Rahim Uddin", with transliteration check note)
   - **Land Area**: `MISMATCH` (1.50 Acres vs 1.25 Acres — Discrepancy delta: 25 decimals / 0.25 acres)
   - **Khatian Number**: `MISSING` (Rule verified: missing information is marked `MISSING`, not a conflict or fraud)
3. Click **"Generate Official Report"** to inspect the printable screening report with bilingual executive summary (সহজ বাংলায় সারসংক্ষেপ) and interactive checklist.

---

## ✨ Features Implemented

1. **Dashboard & Metric Overview**:
   - Tabular statistics: Total Cases, Documents Loaded, Comparisons Completed, Items Requiring Review.
   - 1-click Acceptance Test 001 runner.
   - Recent cases table and quick workflow actions.

2. **Land Case Dossier Management**:
   - Create, edit, search, and filter land dispute cases by title, district, and status.
   - Attach multiple deeds and khatians to any case file.
   - View associated document history and generated audit reports.

3. **Document Ingestion & Field Inspector**:
   - Support for PDF, PNG, JPG, and JPEG documents up to 15MB.
   - Pre-packaged authentic Bengali sample deeds and mutation khatians for instant testing without finding local files.
   - Clear distinction between original scan, OCR extracted text, user corrections, and confidence notes.
   - Field editor allowing manual correction with provenance tracking.

4. **Deterministic Comparison Engine**:
   - Normalization of Bengali and English digits (০-৯ ↔ 0-9).
   - Standard Bangladesh land conversion ratios (1 Acre = 100 Decimals = 60.6 Katha; 1 Bigha = 33 Decimals = 20 Katha; 1 Katha = 1.65 Decimals).
   - Four deterministic statuses: `MATCH`, `MISMATCH`, `MISSING`, `UNCERTAIN`.
   - Clear rule enforcement: Missing information is flagged as `MISSING`, never labeled as a mismatch or fraud.

5. **Official Screening Report & Export**:
   - Print-ready report layout styled for browser "Print / Save as PDF" without broken borders or clipping.
   - Bilingual executive summary in simple Bengali and English.
   - Interactive manual verification checklist (AC Land, Sub-Registry, DC Record Room).
   - Prominent legal limitation disclaimers.

6. **Bangladesh Land Data Explorer**:
   - Direct verified external links to statutory portals:
     - Ministry of Land Citizen Portal (`land.gov.bd`)
     - Directorate of Land Records & Survey (`dlrs.gov.bd`)
     - Digital Settlement & Khatian Service (`settlement.gov.bd`)
     - E-Namjari Online Mutation System (`mutation.land.gov.bd`)
   - Comprehensive glossary covering CS, SA, RS, BS/City Survey, Khatian, Dag, Mouza, and Namjari.

7. **System Tools & Unit Converter**:
   - Interactive Bangladesh Land Measurement Converter (Acre ↔ Decimal ↔ Katha ↔ Bigha ↔ Sq. Ft ↔ Sq. Meters).
   - Server-side Gemini API status indicator.
   - Demo state reset control.

---

## 🔒 Security & Privacy Architecture
- **Server-Side API Key Storage**: The Gemini API key is accessed exclusively on the backend (`process.env.GEMINI_API_KEY`). The browser never receives or stores secrets.
- **Graceful Heuristic Fallback**: If external API quotas or network spikes occur, the application seamlessly switches to the certified local heuristic parser without breaking user workflow.
- **No Cloud Document Exposure**: Uploaded scans and synthetic files are retained locally in the client session and memory.

---

## 📋 Limitations & Production Recommendations
1. **Government Portal Direct Sync**: Direct live querying against `land.gov.bd` or `dlrs.gov.bd` is not implemented because Bangladesh government land portals require individual citizen NID authentication and mobile OTP verification.
2. **Persistence**: Currently utilizes client-side LocalStorage vault with instant demo seeding. For enterprise multi-user deployment, connect PostgreSQL / Cloud SQL and private cloud bucket storage (Google Cloud Storage / Firebase Storage).
