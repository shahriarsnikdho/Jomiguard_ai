import React from 'react';
import {
  Award,
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Layers,
  Users,
  Target,
  ExternalLink,
  Presentation,
  FileText,
  Clock,
  Landmark,
} from 'lucide-react';

export const HackathonDossierView: React.FC = () => {
  const problems = [
    {
      id: 'P1',
      title: 'Digitize Old Records',
      titleBn: 'পুরাতন রেকর্ড ডিজিটালকরণ',
      desc: 'Convert scanned Khatian, Porcha, and Deed documents, including handwritten and printed Bangla, into searchable digital records.',
      status: 'Integrated Feature',
      highlight: false,
    },
    {
      id: 'P2',
      title: 'Verify Deeds & Ownership',
      titleBn: 'দলিল ও মালিকানা সত্যতা যাচাই',
      desc: 'Systems to verify land documents and detect altered or fabricated copies.',
      status: 'Integrated Feature',
      highlight: false,
    },
    {
      id: 'P3',
      title: 'Catch Fraud & Double-Selling',
      titleBn: 'জালিয়াতি ও দ্বৈত বিক্রয় শনাক্তকরণ',
      desc: 'Detect forged documents, multiple sales of the same land parcel, and mismatches between registration and mutation records across CS, SA, RS, and BS survey generations.',
      status: 'Primary Selected Focus ★',
      highlight: true,
    },
    {
      id: 'P4',
      title: 'Smart e-Mutation & Registry',
      titleBn: 'স্মার্ট ই-নামজারি ও সাব-রেজিস্ট্রি সমন্বয়',
      desc: 'Connect deed registration with land mutation through automated verification and status tracking.',
      status: 'Workflow Supported',
      highlight: false,
    },
    {
      id: 'P5',
      title: 'Check Before You Buy',
      titleBn: 'জমি ক্রয়ের পূর্বে নাগরিক যাচাই',
      desc: 'Citizen-friendly platform to check land ownership, mutation history, court cases, and khas/acquisition status before purchasing.',
      status: 'Citizen Workflow',
      highlight: false,
    },
    {
      id: 'P6',
      title: 'Your Own Idea',
      titleBn: 'উদ্ভাবনী ধারণা',
      desc: 'Independent e-governance innovation track.',
      status: 'Supported',
      highlight: false,
    },
  ];

  const venues = [
    {
      name: 'Sub-Registry Offices',
      nameBn: 'সাব-রেজিস্ট্রি অফিস',
      impact: 'Verify seller ownership and previous registered deeds before executing a deed transfer to eliminate duplicate conveyances.',
    },
    {
      name: 'AC Land & Union Land Offices',
      nameBn: 'সহকারী কমিশনার (ভূমি) ও তহশিল অফিস',
      impact: 'Speed up e-Mutation (নামজারি) processing by instantly spotting discrepancies between registered deed schedules and RS/BS Khatians.',
    },
    {
      name: 'Banks & Financial Institutions',
      nameBn: 'ব্যাংক ও আর্থিক প্রতিষ্ঠান',
      impact: 'Verify land offered as collateral for commercial/agricultural loans to eliminate double-mortgaging risks.',
    },
    {
      name: 'Land Acquisition Offices',
      nameBn: 'ভূমি অধিগ্রহণ শাখা (ডিসি অফিস)',
      impact: 'Screen rightful owners before disbursing compensation funds for national highway, bridge, and infrastructure projects.',
    },
    {
      name: 'Survey and Records Offices (DLRS)',
      nameBn: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর',
      impact: 'Digitize legacy Khatians and cross-match plot allocations with surveyed Mouza boundary sheets.',
    },
    {
      name: 'Courts and Lawyers',
      nameBn: 'আদালত ও আইনজীবীগণ',
      impact: 'Review unbroken chain of title (বায়া দলিল ও ওয়ারিশান রেকর্ড) for expedited civil dispute adjudication.',
    },
    {
      name: 'Citizens and Land Buyers',
      nameBn: 'সাধারণ নাগরিক ও ক্রেতাগণ',
      impact: 'Accessible preliminary screening ("Check Before You Buy") to avoid purchasing disputed, fractional, or acquired land.',
    },
    {
      name: 'Real Estate Developers',
      nameBn: 'রিয়েল এস্টেট ডেভেলপার প্রতিষ্ঠান',
      impact: 'Verify contiguous parcel acreage and dispute-free titles prior to major residential or commercial land acquisitions.',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hackathon Badge Header */}
      <div className="bg-gradient-to-r from-[#176B45] to-[#125335] text-white rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold tracking-wide">
              <Award className="w-4 h-4 text-[#D6A84F]" />
              <span>LandTech 2026 · DIU LandTech Innovation Hackathon</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              JomiGuard AI — Hackathon Submission Dossier
            </h1>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed font-sans">
              Practical LandTech Software for E-Governance in Bangladesh · Track: Digital Land Records, Verification & Digitization
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-xs space-y-1.5 shrink-0 font-mono">
            <div><strong>Host:</strong> Daffodil International University</div>
            <div><strong>Venue:</strong> Knowledge Tower (Library), DIU</div>
            <div><strong>Selected Track:</strong> Digital Verification & Screening</div>
            <div><strong>Selected Focus:</strong> Problem P3 (Catch Fraud & Double-Selling)</div>
          </div>
        </div>
      </div>

      {/* Selected Problem Spotlight (P3) */}
      <div className="bg-white border-2 border-[#176B45] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#176B45]" />
            <h2 className="text-base font-bold text-slate-900">
              Selected Problem: P3 — Catch Fraud, Multi-Survey Inconsistencies & Double-Selling
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Selected Hackathon Problem Focus
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          In Bangladesh, most land disputes stem from unaligned records across historical survey eras (CS, SA, RS, and BS)
          and disconnected record systems between <strong>Sub-Registry Offices</strong> (Ministry of Law) and <strong>AC Land Offices</strong> (Ministry of Land).
          JomiGuard AI directly solves this by providing a deterministic, bilingual, automated cross-verification engine that detects:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900 block">1. Fractional Over-Selling</span>
            <p className="text-slate-600 leading-relaxed">
              Compares Deed schedule area against parent Khatian share using standardized conversions (Acre, Decimal/শতক, Katha, Bigha) to catch unrecorded double-selling.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900 block">2. Multi-Survey Dag Discrepancies</span>
            <p className="text-slate-600 leading-relaxed">
              Traces survey plot transitions (CS → SA → RS → BS) to flag Bata Dag (বাটা দাগ) splits and unverified plot substitutions.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900 block">3. Registry vs Mutation Mismatches</span>
            <p className="text-slate-600 leading-relaxed">
              Cross-screens Sub-Registry deed transfer volumes against AC Land e-Namjari dockets to ensure legal continuity before registration.
            </p>
          </div>
        </div>
      </div>

      {/* 8 Practical Application Venues */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Where Your Solution Can Be Used: 8 Official Bangladesh Venues
          </h3>
          <p className="text-xs text-slate-500">
            Aligned directly with the LandTech 2026 Hackathon target stakeholder deployments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {venues.map((venue, idx) => (
            <div
              key={venue.name}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 hover:border-[#176B45]/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#176B45]/10 text-[#176B45] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-xs text-slate-900 leading-tight">
                  {venue.name}
                </span>
              </div>
              <span className="text-[10px] text-[#176B45] font-sans font-semibold block">
                {venue.nameBn}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {venue.impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Statements Breakdown Grid (P1 - P6) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Hackathon Problem Alignment (P1 — P6)
          </h3>
          <p className="text-xs text-slate-500">
            Evaluation mapping showing how JomiGuard AI addresses the competition tracks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {problems.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-lg border text-xs space-y-2 ${
                p.highlight
                  ? 'bg-emerald-50/50 border-[#176B45]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#176B45] text-sm">{p.id}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold ${
                    p.highlight
                      ? 'bg-[#176B45] text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="font-bold text-slate-900">{p.title}</div>
              <div className="text-[10px] text-slate-500 font-sans">{p.titleBn}</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hackathon Rules & Integrity Verification */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-[#176B45]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              LandTech 2026 Rules & Ethics Compliance Audit
            </h3>
            <p className="text-xs text-slate-500">
              Strict conformance to competition privacy, dummy data, and AI disclosure requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">100% Synthetic & Dummy Data:</strong>
                <p className="text-slate-600 leading-relaxed">
                  No real citizen names, real NID numbers, phone numbers, or private land records were used.
                  All benchmarks (e.g. Rahim Uddin, Demo Mouza, Dag 125) are fully artificial synthetic fixtures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">No Web Scraping or CAPTCHA Bypassing:</strong>
                <p className="text-slate-600 leading-relaxed">
                  The application does not scrape, bulk-download, or penetrate live government systems (land.gov.bd, dlrs.gov.bd).
                  It functions as an independent screening engine with verified public portal links.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">AI Tool Disclosure:</strong>
                <p className="text-slate-600 leading-relaxed">
                  Uses Google Gemini 3.8 Flash TypeScript SDK via an isolated server-side proxy route (<code>/api/extract</code>)
                  with a zero-hallucination structured schema and deterministic heuristic fallback parser.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Student Presentation Readiness:</strong>
                <p className="text-slate-600 leading-relaxed">
                  Structured for the DIU Knowledge Tower Final Round 5-minute pitch and 3-minute technical Q&A in English or Bangla.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Note & Pitch Deck Outline */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-[#176B45]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Round 1 Concept Note & Final Pitch Deck Structure
              </h3>
              <p className="text-xs text-slate-500">
                Framework for submission and live demonstration at Daffodil International University
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">4-Page Note · 10-Slide Deck</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900 block">4-Page Concept Note Summary:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed">
              <li><strong>Section 1: Selected Problem (P3):</strong> Fraud, duplicate conveyances, and multi-era survey mismatches in Bangladesh.</li>
              <li><strong>Section 2: Importance in Bangladesh:</strong> Over 70% of civil court cases relate to land title discrepancies.</li>
              <li><strong>Section 3: Proposed Solution:</strong> Automated dual-document screening engine with deterministic unit normalization.</li>
              <li><strong>Section 4: System Architecture & Nationwide Scale:</strong> Express + React SPA, modular OCR/Gemini service, zero cloud leak.</li>
            </ul>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900 block">Final Round 5-Minute Live Pitch Structure:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed">
              <li><strong>Minute 1:</strong> The Problem — CS, SA, RS, BS survey discrepancies and deed vs mutation silos.</li>
              <li><strong>Minute 2:</strong> Live Demo — Acceptance Case 001 (Dag 125 MATCH, 0.25 Acre MISMATCH, Khatian MISSING).</li>
              <li><strong>Minute 3:</strong> Innovation — Deterministic land arithmetic (Acre/Decimal/Katha/Bigha) and bilingual executive summary.</li>
              <li><strong>Minute 4:</strong> Impact & Nationwide Deployability across the 8 statutory venues.</li>
              <li><strong>Minute 5:</strong> Conclusion & Future e-Governance API Roadmap.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
