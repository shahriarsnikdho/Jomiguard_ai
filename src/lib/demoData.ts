/**
 * JomiGuard AI — Reproducible Synthetic Demo Data & Acceptance Test Scenario
 * Fully aligned with Acceptance Test in Section 12 of the Specification.
 */

import { LandCase, LandDocument, ComparisonReport } from '../types';
import { executeDocumentComparison } from './comparisonEngine';

export const INITIAL_DEMO_CASES: LandCase[] = [
  {
    id: 'case_demo_001',
    title: 'Demo Land Case 001',
    caseReference: 'BD-CASE-2026-001',
    district: 'Gazipur',
    upazila: 'Gazipur Sadar',
    mouza: 'Demo Mouza',
    notes: 'Synthetic benchmark acceptance test: Comparing Registered Sale Deed (1.50 Acres, Khatian 30) against Field Mutation Khatian (1.25 Acres, Dag 125, Khatian omitted).',
    createdAt: '2026-10-15T10:00:00.000Z',
    updatedAt: '2026-10-18T14:30:00.000Z',
    status: 'under_review',
    documentIds: ['doc_demo_001_a', 'doc_demo_001_b'],
  },
  {
    id: 'case_demo_002',
    title: 'Sreepur Mouza RS vs BS Mutation Verification',
    caseReference: 'BD-CASE-2026-002',
    district: 'Gazipur',
    upazila: 'Sreepur',
    mouza: 'Bhawal Mirzapur',
    notes: 'Inheritance mutation check across RS survey and latest City/BS survey. Multiple co-sharer names listed.',
    createdAt: '2026-10-12T09:15:00.000Z',
    updatedAt: '2026-10-17T11:20:00.000Z',
    status: 'active',
    documentIds: ['doc_demo_002_a', 'doc_demo_002_b'],
  },
  {
    id: 'case_demo_003',
    title: 'Dhanmondi Residential Deed vs E-Namjari Record',
    caseReference: 'BD-CASE-2026-003',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    mouza: 'Dhanmondi Residential Area',
    notes: 'Commercial lease deed screening against modern E-Namjari mutation clearance certificate.',
    createdAt: '2026-10-08T16:00:00.000Z',
    updatedAt: '2026-10-16T12:00:00.000Z',
    status: 'completed',
    documentIds: ['doc_demo_003_a', 'doc_demo_003_b'],
  },
];

export const INITIAL_DEMO_DOCUMENTS: LandDocument[] = [
  // --- Case 001: Document A ---
  {
    id: 'doc_demo_001_a',
    caseId: 'case_demo_001',
    name: 'Document A — Registered Sale Deed (দলিল নং ৪৫/২০১২)',
    documentType: 'deed',
    subType: 'Kabala Deed (সাব-কবলা দলিল)',
    uploadedAt: '2026-10-15T10:05:00.000Z',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    isSyntheticDemo: true,
    sampleContentText: `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার — সাব-রেজিস্ট্রার কার্যালয়, গাজীপুর সদর
দলিল নং: ৪৫/২০১২, তারিখ: ১২/০৩/২০১২ খ্রিঃ
শ্রেণী: সাফ-কবলা হস্তান্তর দলিল
গ্রহীতা/মালিক: রহিম উদ্দিন (Rahim Uddin), পিতা: মরহুম আব্দুল করিম, সাং- ডেমো মৌজা।
সম্পত্তির তফসিল:
জেলা: গাজীপুর, উপজেলা: গাজীপুর সদর, মৌজা: Demo Mouza, জে.এল নং: ৪৪
খতিয়ান নং: ৩০ (ত্রিশ)
দাগ নং: ১২৫ (একশত পঁচিশ)
জমির শ্রেণী: নাল জমি
জমির পরিমাণ: ১.৫০ একর (1.50 Acres / দেড় একর)
চৌহদ্দি: উত্তরে সরকারি রাস্তা, দক্ষিণে খলিল মিয়া, পূর্বে সরকারি খাল, পশ্চিমে করিম বক্সের জোত।`,
    extractionStatus: 'verified',
    extractionSource: 'demo_extractor',
    extractedData: {
      ownerName: {
        value: 'Rahim Uddin',
        confidence: 0.98,
        evidenceSnippet: 'গ্রহীতা/মালিক: রহিম উদ্দিন (Rahim Uddin), পিতা: মরহুম আব্দুল করিম',
        pageNumber: 1,
      },
      khatianNumber: {
        value: '30',
        confidence: 0.96,
        evidenceSnippet: 'খতিয়ান নং: ৩০ (ত্রিশ)',
        pageNumber: 2,
      },
      dagNumber: {
        value: '125',
        confidence: 0.99,
        evidenceSnippet: 'দাগ নং: ১২৫ (একশত পঁচিশ)',
        pageNumber: 2,
      },
      landArea: {
        value: 1.5,
        confidence: 0.97,
        evidenceSnippet: 'জমির পরিমাণ: ১.৫০ একর (1.50 Acres)',
        pageNumber: 2,
      },
      landUnit: {
        value: 'Acre',
        confidence: 0.95,
      },
      mouza: {
        value: 'Demo Mouza',
        confidence: 0.99,
        evidenceSnippet: 'মৌজা: Demo Mouza, জে.এল নং: ৪৪',
        pageNumber: 1,
      },
      upazila: {
        value: 'Gazipur Sadar',
        confidence: 0.95,
      },
      district: {
        value: 'Gazipur',
        confidence: 0.98,
      },
      deedNumber: {
        value: '45/2012',
        confidence: 0.98,
        evidenceSnippet: 'দলিল নং: ৪৫/২০১২',
        pageNumber: 1,
      },
      documentDate: {
        value: '12/03/2012',
        confidence: 0.94,
      },
    },
  },

  // --- Case 001: Document B ---
  {
    id: 'doc_demo_001_b',
    caseId: 'case_demo_001',
    name: 'Document B — Field Mutation Khatian (নামজারি খতিয়ান রেকর্ড)',
    documentType: 'khatian',
    subType: 'Mutation Record (নামজারি/জমাখারিজ)',
    uploadedAt: '2026-10-15T10:12:00.000Z',
    fileSize: '1.2 MB',
    fileType: 'image/jpeg',
    isSyntheticDemo: true,
    sampleContentText: `সহকারী কমিশনার (ভূমি) এর কার্যালয়, গাজীপুর
নামজারি কেস নং: ১১২/২০১৭-১৮
মালিকের নাম: রহিম উদ্দিন (Rahim Uddin)
মৌজা: Demo Mouza
দাগ নং: ১২৫
জমির পরিমাণ: ১.২৫ একর (1.25 Acres)
[বিজ্ঞপ্তি: মূল জরিপ খতিয়ান নম্বর এই নামজারি মাঠ কপিতে অনুল্লেখিত / অনুপস্থিত]
মন্তব্য: বাটা দাগ নং ১২৫/১ অনুসারে অবশিষ্ট অংশ শরিকগণের জোতে রক্ষিত।`,
    extractionStatus: 'verified',
    extractionSource: 'demo_extractor',
    extractedData: {
      ownerName: {
        value: 'Rahim Uddin',
        confidence: 0.97,
        evidenceSnippet: 'মালিকের নাম: রহিম উদ্দিন (Rahim Uddin)',
        pageNumber: 1,
      },
      khatianNumber: {
        value: null, // REQUIRED: MISSING
        confidence: 0,
        notes: 'Khatian number is explicitly omitted in this mutation field copy.',
      },
      dagNumber: {
        value: '125',
        confidence: 0.99,
        evidenceSnippet: 'দাগ নং: ১২৫',
        pageNumber: 1,
      },
      landArea: {
        value: 1.25,
        confidence: 0.96,
        evidenceSnippet: 'জমির পরিমাণ: ১.২৫ একর (1.25 Acres)',
        pageNumber: 1,
      },
      landUnit: {
        value: 'Acre',
        confidence: 0.95,
      },
      mouza: {
        value: 'Demo Mouza',
        confidence: 0.99,
        evidenceSnippet: 'মৌজা: Demo Mouza',
        pageNumber: 1,
      },
      upazila: {
        value: 'Gazipur Sadar',
        confidence: 0.92,
      },
      district: {
        value: 'Gazipur',
        confidence: 0.96,
      },
      deedNumber: {
        value: null,
        confidence: 0,
      },
      documentDate: {
        value: '18/09/2018',
        confidence: 0.91,
      },
    },
  },

  // --- Case 002: Document A ---
  {
    id: 'doc_demo_002_a',
    caseId: 'case_demo_002',
    name: 'RS Khatian No. 142 (আর.এস. খতিয়ান ১৪২)',
    documentType: 'khatian',
    subType: 'RS Survey (আর এস জরিপ)',
    uploadedAt: '2026-10-12T09:20:00.000Z',
    fileSize: '2.1 MB',
    fileType: 'application/pdf',
    isSyntheticDemo: true,
    sampleContentText: `জেলা: গাজীপুর, উপজেলা: শ্রীপুর, মৌজা: Bhawal Mirzapur
খতিয়ান নং: ১৪২
দাগ নং: ৫৪০
মালিক: মোঃ আনোয়ার হোসেন ও শরিকগণ
জমির পরিমাণ: ০.৮০ একর (80 Decimals)`,
    extractionStatus: 'verified',
    extractionSource: 'demo_extractor',
    extractedData: {
      ownerName: { value: 'Md. Anwar Hossain', confidence: 0.95 },
      khatianNumber: { value: '142', confidence: 0.98 },
      dagNumber: { value: '540', confidence: 0.98 },
      landArea: { value: 0.8, confidence: 0.95 },
      landUnit: { value: 'Acre', confidence: 0.95 },
      mouza: { value: 'Bhawal Mirzapur', confidence: 0.97 },
      upazila: { value: 'Sreepur', confidence: 0.95 },
      district: { value: 'Gazipur', confidence: 0.98 },
      deedNumber: { value: null, confidence: 0 },
    },
  },

  // --- Case 002: Document B ---
  {
    id: 'doc_demo_002_b',
    caseId: 'case_demo_002',
    name: 'BS Survey Khatian No. 890 (বি.এস. খতিয়ান ৮৯০)',
    documentType: 'khatian',
    subType: 'BS Survey (বি এস জরিপ)',
    uploadedAt: '2026-10-12T09:25:00.000Z',
    fileSize: '1.9 MB',
    fileType: 'application/pdf',
    isSyntheticDemo: true,
    sampleContentText: `জেলা: গাজীপুর, উপজেলা: শ্রীপুর, মৌজা: Bhawal Mirzapur
খতিয়ান নং: ৮৯০
দাগ নং: ৫৪০
মালিক: আনোয়ার হোসেন
জমির পরিমাণ: ৮০ শতক (80 Decimals / 0.80 Acre)`,
    extractionStatus: 'verified',
    extractionSource: 'demo_extractor',
    extractedData: {
      ownerName: { value: 'Anwar Hossain', confidence: 0.95 },
      khatianNumber: { value: '890', confidence: 0.98 },
      dagNumber: { value: '540', confidence: 0.98 },
      landArea: { value: 80, confidence: 0.95 },
      landUnit: { value: 'Decimal', confidence: 0.95 },
      mouza: { value: 'Bhawal Mirzapur', confidence: 0.97 },
      upazila: { value: 'Sreepur', confidence: 0.95 },
      district: { value: 'Gazipur', confidence: 0.98 },
      deedNumber: { value: null, confidence: 0 },
    },
  },

  // --- Case 003: Document A ---
  {
    id: 'doc_demo_003_a',
    caseId: 'case_demo_003',
    name: 'Commercial Registered Lease Deed No. 7820',
    documentType: 'deed',
    subType: 'Lease Agreement',
    uploadedAt: '2026-10-08T16:10:00.000Z',
    fileSize: '3.4 MB',
    fileType: 'application/pdf',
    isSyntheticDemo: true,
    sampleContentText: `District: Dhaka, Upazila: Dhanmondi, Mouza: Dhanmondi Residential Area
Deed No: 7820/2021
Owner: Shamsul Huda
Plot/Dag No: 18/A
Area: 6.50 Katha`,
    extractionStatus: 'verified',
    extractionSource: 'demo_extractor',
    extractedData: {
      ownerName: { value: 'Shamsul Huda', confidence: 0.98 },
      khatianNumber: { value: '4501', confidence: 0.92 },
      dagNumber: { value: '18/A', confidence: 0.96 },
      landArea: { value: 6.5, confidence: 0.96 },
      landUnit: { value: 'Katha', confidence: 0.95 },
      mouza: { value: 'Dhanmondi Residential Area', confidence: 0.98 },
      upazila: { value: 'Dhanmondi', confidence: 0.98 },
      district: { value: 'Dhaka', confidence: 0.99 },
      deedNumber: { value: '7820/2021', confidence: 0.98 },
    },
  },

  // --- Case 003: Document B ---
  {
    id: 'doc_demo_003_b',
    caseId: 'case_demo_003',
    name: 'E-Namjari Clearance Certificate 2024',
    documentType: 'mutation_record',
    subType: 'E-Mutation (ই-নামজারি)',
    uploadedAt: '2026-10-08T16:15:00.000Z',
    fileSize: '950 KB',
    fileType: 'application/pdf',
    isSyntheticDemo: true,
    sampleContentText: `Office of AC Land Dhanmondi Circle
Owner: Shamsul Huda
Dag No: 18/A, Khatian: 4501
Area: 10.725 Decimals (6.5 Katha equivalent)`,
    extractionStatus: 'verified',
    extractionSource: 'demo_extractor',
    extractedData: {
      ownerName: { value: 'Shamsul Huda', confidence: 0.98 },
      khatianNumber: { value: '4501', confidence: 0.96 },
      dagNumber: { value: '18/A', confidence: 0.98 },
      landArea: { value: 10.725, confidence: 0.98 },
      landUnit: { value: 'Decimal', confidence: 0.98 },
      mouza: { value: 'Dhanmondi Residential Area', confidence: 0.98 },
      upazila: { value: 'Dhanmondi', confidence: 0.98 },
      district: { value: 'Dhaka', confidence: 0.99 },
      deedNumber: { value: '7820/2021', confidence: 0.94 },
    },
  },
];

/**
 * Generate initial pre-calculated report for Demo Land Case 001
 * so when user opens the app or clicks "Reports", it's instantly available and verifiable.
 */
export function createInitialDemoReport(): ComparisonReport {
  const docA = INITIAL_DEMO_DOCUMENTS[0];
  const docB = INITIAL_DEMO_DOCUMENTS[1];
  const comparison = executeDocumentComparison(docA, docB, 'Demo Land Case 001', 'BD-CASE-2026-001');

  return {
    id: 'report_demo_001',
    comparisonId: comparison.id,
    caseId: 'case_demo_001',
    caseReference: 'BD-CASE-2026-001',
    caseTitle: 'Demo Land Case 001',
    generatedAt: '2026-10-18T14:35:00.000Z',
    executiveSummaryBn: `সহজ বাংলায় সারসংক্ষেপ:
১. দাগ নম্বর সামঞ্জস্যপূর্ণ: উভয় নথিতেই ১২৫ নম্বর দাগ উল্লিখিত রয়েছে।
২. মালিকের নাম: রহিম উদ্দিন (Rahim Uddin) উভয় নথিতে অপরিবর্তিত আছে।
৩. জমির পরিমাণের তারতম্য (গুরুত্বপূর্ণ): নথি ক-তে জমির পরিমাণ ১.৫০ একর (দেড় একর), কিন্তু নথি খ-তে ১.২৫ একর (সোয়া একর)। এতে ০.২৫ একর (২৫ শতক) জমির কমতি রয়েছে। এটি আংশিক বিক্রি বা দাগ বিভাজনের ফল হতে পারে।
৪. খতিয়ান অনুপস্থিত: নথি খ-তে খতিয়ান নম্বর উল্লেখ নেই, যা মাঠ পরোয়ানায় প্রায়শই ঘটে। এটি স্বয়ংক্রিয় জালিয়াতির প্রমাণ নয়।`,
    executiveSummaryEn: `Executive Summary:
1. Plot Consistency: Both documents reference Survey Dag 125 consistently.
2. Owner Alignment: Party name 'Rahim Uddin' aligns across both records.
3. Quantity Variance: Document A registers 1.50 Acres, whereas Document B records 1.25 Acres. A difference of 0.25 Acres (25 Decimals) requires field title reconciliation.
4. Omission: Document B lacks Khatian numbering. In accordance with screening guidelines, this is flagged as MISSING, not an intrinsic defect.`,
    comparisonResult: comparison,
    manualVerificationChecklist: [
      {
        id: 'chk_1',
        taskEn: 'Inspect Upazila AC (Land) Namjari register for Dag 125 to verify the remaining 0.25 acres allocation.',
        taskBn: 'উপজেলা সহকারী কমিশনার (ভূমি) এসিল্যান্ড অফিসে নামজারি বালাম বই পরীক্ষা করে বাকি ০.২৫ একরের মালিকানা নিশ্চিত করুন।',
        authority: 'Assistant Commissioner (Land) / এসিল্যান্ড অফিস',
        priority: 'high',
        done: false,
      },
      {
        id: 'chk_2',
        taskEn: 'Obtain certified Khatian Porcha copy from District Deputy Commissioner (DC) Record Room.',
        taskBn: 'জেলা প্রশাসকের (ডিসি) রেকর্ড রুম থেকে ৩০ নং খতিয়ানের মূল সার্টিফাইড পর্চা উত্তোলন করুন।',
        authority: 'District DC Record Room / জেলা রেকর্ড রুম',
        priority: 'high',
        done: false,
      },
      {
        id: 'chk_3',
        taskEn: 'Verify deed volume authenticity (বালাম পরীক্ষা) at Gazipur Sadar Sub-Registry Office.',
        taskBn: 'গাজীপুর সদর সাব-রেজিস্ট্রি অফিসে ৪৫/২০১২ নং দলিলের বালাম ভলিউম ও ফিসের রসিদ মিলিয়ে দেখুন।',
        authority: 'Sub-Registry Office / সাব-রেজিস্ট্রি অফিস',
        priority: 'medium',
        done: false,
      },
      {
        id: 'chk_4',
        taskEn: 'Review physical Mouza Map (মৌজা নকশা) sheet to ensure plot 125 has no bata dag (বাটা দাগ).',
        taskBn: 'মৌজা নকশায় ১২৫ নম্বর দাগের অবস্থান ও কোনো বাটা দাগ সৃষ্টি হয়েছে কিনা তা আমিন দ্বারা চিহ্নিত করুন।',
        authority: 'DLRS / ভূমি রেকর্ড ও জরিপ অধিদপ্তর',
        priority: 'medium',
        done: false,
      },
    ],
    disclaimerEn: 'AI-assisted preliminary screening only. Differences do not prove fraud or determine legal ownership. Verify original records with the appropriate authority or a qualified professional.',
    disclaimerBn: 'এআই-সহায়তাপ্রাপ্ত প্রাথমিক বাছাইকরণ রিপোর্ট মাত্র। তথ্যের অমিল কোনোভাবেই জালিয়াতি বা মালিকানার চূড়ান্ত প্রামাণ্যতা নির্ধারণ করে না। প্রয়োজনীয় মূল নথি সংশ্লিষ্ট ভূমি কর্তৃপক্ষ বা যোগ্য আইনজীবীর মাধ্যমে যাচাই করুন।',
    isDemoData: true,
  };
}
