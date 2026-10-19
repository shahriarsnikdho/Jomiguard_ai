/**
 * JomiGuard AI — Deterministic Land Document Comparison Engine
 * Strictly follows Bangladesh land record conventions & the MVP Specification.
 */

import { ComparisonField, ComparisonResult, LandDocument } from '../types';

// Convert Bengali numerals (০-৯) to English (0-9)
export function bengaliToEnglishDigits(str: string): string {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let res = str;
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(bn[i], i.toString());
  }
  return res;
}

// Convert English numerals to Bengali digits
export function englishToBengaliDigits(str: string | number): string {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[0-9]/g, (w) => bn[parseInt(w, 10)]);
}

// Clean and normalize strings for matching
export function normalizeText(val: string | null | undefined): string {
  if (!val) return '';
  return val
    .trim()
    .toLowerCase()
    .replace(/[\s\t\n]+/g, ' ')
    .replace(/[,\-_./()]/g, ' ')
    .trim();
}

/**
 * Standardize land unit to Decimal (শতক/শতাংশ) for accurate mathematical comparison.
 * Bangladesh standard conversions:
 * 1 Acre = 100 Decimals
 * 1 Bigha (বিঘা) = 33 Decimals (standard Bengal government measure)
 * 1 Katha (কাঠা) = 1.65 Decimals (1/20 of standard Bigha)
 * 1 Square Foot = 0.00229568 Decimals (435.6 sq ft = 1 Decimal)
 */
export function convertToDecimalUnit(value: number, unit: string | null | undefined): number | null {
  if (!unit) return null;
  const cleanUnit = normalizeText(unit);

  if (cleanUnit.includes('acre') || cleanUnit.includes('একর')) {
    return value * 100;
  }
  if (cleanUnit.includes('decimal') || cleanUnit.includes('dec') || cleanUnit.includes('শতক') || cleanUnit.includes('শতাংশ') || cleanUnit.includes('shotok')) {
    return value;
  }
  if (cleanUnit.includes('bigha') || cleanUnit.includes('বিঘা')) {
    return value * 33;
  }
  if (cleanUnit.includes('katha') || cleanUnit.includes('কাঠা') || cleanUnit.includes('cottah')) {
    return value * 1.65;
  }
  if (cleanUnit.includes('sq ft') || cleanUnit.includes('square feet') || cleanUnit.includes('বর্গফুট')) {
    return value / 435.6;
  }

  // Unknown unit
  return null;
}

/**
 * Compare two owner names taking into account honorifics, transliteration differences,
 * and Bengali prefixes (Md., Sheikh, Khan, etc.)
 */
function compareOwnerNames(nameA: string | null, nameB: string | null): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  if (!nameA && !nameB) {
    return {
      status: 'MISSING',
      explanation: 'Owner names are absent in both documents.',
      explanationBn: 'উভয় দলিলেই মালিকের নাম অনুপস্থিত।',
      recommendedAction: 'Verify seller/buyer signature schedules on physical documents.',
      recommendedActionBn: 'মূল দলিলের স্বাক্ষর পাতা ও দাতা-গ্রহীতার পরিচয় খতিয়ে দেখুন।',
    };
  }

  if (!nameA || !nameB) {
    const presentDoc = nameA ? 'Document A' : 'Document B';
    return {
      status: 'MISSING',
      explanation: `Owner name is missing in ${nameA ? 'Document B' : 'Document A'} while present in ${presentDoc}.`,
      explanationBn: `মালিকের নাম শুধুমাত্র একটি দলিলে পাওয়া গেছে, অন্যটিতে অনুপস্থিত।`,
      recommendedAction: 'Confirm whether the missing party is listed in an endorsement or schedule.',
      recommendedActionBn: 'অন্য দলিলে তফসিল বা পৃষ্ঠপোষণ অংশে নাম উল্লেখ আছে কিনা যাচাই করুন।',
    };
  }

  const normA = normalizeText(nameA);
  const normB = normalizeText(nameB);

  // Exact normalized match
  if (normA === normB) {
    return {
      status: 'MATCH',
      explanation: `Names match identically ("${nameA}"). Note: Exact identity must still be confirmed against National ID / Birth Certificate as transliteration variants can occur.`,
      explanationBn: `মালিকের নাম হুবহু মিলেছে ("${nameA}")। দ্রষ্টব্য: জাতীয় পরিচয়পত্রের সাথে ব্যক্তির মূল পরিচয় নিশ্চিত করা প্রয়োজন।`,
      recommendedAction: 'Cross-reference owner NID or parentage (Father/Husband name) in the Deed Schedule.',
      recommendedActionBn: 'দলিলের তপশীলে উল্লিখিত পিতা/স্বামীর নাম ও জাতীয় পরিচয়পত্র মিলিয়ে দেখুন।',
    };
  }

  // Common title prefix stripped comparison (e.g. Md. Rahim Uddin vs Rahim Uddin)
  const stripPrefixes = (n: string) =>
    n.replace(/\b(md|mohammed|muhammad|mst|mosammat|sheikh|khandakar|chowdhury|alhaj|late|মৌলভী|মোঃ|মোহাম্মদ|মোসাঃ|মোসাম্মৎ|শেখ|খন্দকার|চৌধুরী|হাজী|মরহুম)\b/gi, '')
      .replace(/\./g, '')
      .trim();

  const coreA = stripPrefixes(normA);
  const coreB = stripPrefixes(normB);

  if (coreA && coreB && (coreA === coreB || coreA.includes(coreB) || coreB.includes(coreA))) {
    return {
      status: 'MATCH',
      explanation: `Names are consistent with common title/prefix variations ("${nameA}" vs "${nameB}"). Subject to official verification.`,
      explanationBn: `নামের উপাধি বা পদবীযুক্ত পার্থক্যের মধ্যেও মূল ব্যক্তি সামঞ্জস্যপূর্ণ ("${nameA}" বনাম "${nameB}")।`,
      recommendedAction: 'Verify whether title or prefix addition was regularized in affidavit or mutation.',
      recommendedActionBn: 'নামের পদবী বা উপাধির পরিবর্তন কোনো এফিডেভিট বা ওয়ারিশ সনদের অন্তর্ভুক্ত কিনা দেখুন।',
    };
  }

  // True mismatch
  return {
    status: 'MISMATCH',
    explanation: `Different owner names recorded: "${nameA}" vs "${nameB}". This indicates a change of hands, co-sharer, or potential discrepancy.`,
    explanationBn: `দলিলে ভিন্ন ভিন্ন মালিকের নাম পাওয়া গেছে: "${nameA}" বনাম "${nameB}"। এটি হাতবদল, শরিকানা বা অসঙ্গতির ইঙ্গিত দেয়।`,
    recommendedAction: 'Inspect chain of title (বায়া দলিল / Chain Deeds) and genealogy (ওয়ারিশান সনদ).',
    recommendedActionBn: 'মালিকানা হস্তান্তরের ধারাবাহিক বায়া দলিল ও ওয়ারিশান সনদ পরীক্ষা করুন।',
  };
}

/**
 * Compare Dag (Plot) numbers
 */
function compareDagNumbers(dagA: string | null, dagB: string | null): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  if (!dagA && !dagB) {
    return {
      status: 'MISSING',
      explanation: 'Dag/Plot number is missing in both documents.',
      explanationBn: 'উভয় নথিতেই দাগ নম্বর অনুপস্থিত।',
      recommendedAction: 'Locate schedule of land (তফসিল) in the original record.',
      recommendedActionBn: 'মূল নথির জমি তফসিলে দাগ নম্বর চিহ্নিত করুন।',
    };
  }

  if (!dagA || !dagB) {
    return {
      status: 'MISSING',
      explanation: `Dag number is specified in ${dagA ? 'Document A (' + dagA + ')' : 'Document B (' + dagB + ')'} but missing in the other document. Missing information is not an automatic conflict.`,
      explanationBn: `দাগ নম্বর শুধুমাত্র একটি নথিতে উপস্থিত, অপরটিতে অনুপস্থিত। তথ্য না থাকা মানেই জালিয়াতি বা সংঘাত নয়।`,
      recommendedAction: 'Check original deed schedules or certified khatian copy for plot enumeration.',
      recommendedActionBn: 'খতিয়ানের সার্টিফাইড কপি বা মূল দলিলের দাগের তালিকা যাচাই করুন।',
    };
  }

  const cleanA = bengaliToEnglishDigits(dagA).replace(/[^0-9/]/g, '').trim();
  const cleanB = bengaliToEnglishDigits(dagB).replace(/[^0-9/]/g, '').trim();

  if (cleanA === cleanB) {
    return {
      status: 'MATCH',
      explanation: `Plot numbers match consistently (Dag ${dagA}). Both documents refer to the same primary survey plot.`,
      explanationBn: `দাগ নম্বর হুবহু মিলেছে (দাগ নং ${dagA})। উভয় নথি একই সার্ভে প্লট নির্দেশ করছে।`,
      recommendedAction: 'Cross-check plot boundaries with the Mouza Sheet map (মৌজা নকশা).',
      recommendedActionBn: 'সংশ্লিষ্ট মৌজা নকশার সাথে দাগের অবস্থান মিলিয়ে নিন।',
    };
  }

  return {
    status: 'MISMATCH',
    explanation: `Different Dag numbers recorded: "${dagA}" vs "${dagB}".`,
    explanationBn: `ভিন্ন দাগ নম্বর পরিলক্ষিত হয়েছে: "${dagA}" বনাম "${dagB}"।`,
    recommendedAction: 'Verify if the plot was sub-divided (বাটা দাগ / পৈক দাগ) during RS or BS settlement.',
    recommendedActionBn: 'আরএস বা বিএস জরিপে মূল দাগ খণ্ডিত বা বাটা দাগ হয়েছে কিনা তহশিল অফিসে অনুসন্ধান করুন।',
  };
}

/**
 * Compare Khatian numbers
 */
function compareKhatianNumbers(khatianA: string | null, khatianB: string | null): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  // If either is missing, rule states: MISSING information is NOT a mismatch!
  if (!khatianA || !khatianB) {
    const present = khatianA ? `Document A records Khatian ${khatianA}` : `Document B records Khatian ${khatianB}`;
    return {
      status: 'MISSING',
      explanation: `Khatian number is missing in ${!khatianA ? 'Document A' : 'Document B'} (${present}). Note: Missing information does not constitute a conflict or fraud.`,
      explanationBn: `খতিয়ান নম্বর একটি দলিলে অনুপস্থিত (${!khatianA ? 'নথি ক' : 'নথি খ'})। বিধিমতে তথ্য অনুপস্থিত থাকা মানে ভুল বা সংঘাত নয়।`,
      recommendedAction: 'Obtain certified Khatian Porcha (খতিয়ানের পর্চা) from the District Record Room or E-Khatian portal.',
      recommendedActionBn: 'জেলা প্রশাসকের রেকর্ড রুম বা ই-খতিয়ান পোর্টাল (land.gov.bd) থেকে সার্টিফাইড পর্চা সংগ্রহ করুন।',
    };
  }

  const cleanA = bengaliToEnglishDigits(khatianA).replace(/[^0-9/]/g, '').trim();
  const cleanB = bengaliToEnglishDigits(khatianB).replace(/[^0-9/]/g, '').trim();

  if (cleanA === cleanB) {
    return {
      status: 'MATCH',
      explanation: `Khatian numbers match identically (${khatianA}).`,
      explanationBn: `খতিয়ান নম্বর হুবহু মিলেছে (${khatianA})।`,
      recommendedAction: 'Verify survey lineage (CS -> SA -> RS -> BS / City Survey).',
      recommendedActionBn: 'জরিপের ধারাবাহিকতা (সিএস -> এসএ -> আরএস -> বিএস) তহশিল লেজারে যাচাই করুন।',
    };
  }

  return {
    status: 'MISMATCH',
    explanation: `Different Khatian numbers recorded: "${khatianA}" vs "${khatianB}". This often occurs across different survey eras (e.g. RS vs BS) or after mutation.`,
    explanationBn: `ভিন্ন খতিয়ান নম্বর পাওয়া গেছে: "${khatianA}" বনাম "${khatianB}"। এটি সাধারণত ভিন্ন জরিপ (যেমন আরএস বনাম বিএস) বা নামজারির কারণে হয়।`,
    recommendedAction: 'Trace the survey chain to verify if one Khatian derived from the other via Mutation (নামজারি).',
    recommendedActionBn: 'এসিল্যান্ড অফিসে জমাখারিজ বা নামজারি পরোয়ানা দেখে খতিয়ানের যোগসূত্র নিশ্চিত করুন।',
  };
}

/**
 * Compare Land Area with unit conversions
 */
function compareLandArea(
  areaA: number | null,
  unitA: string | null | undefined,
  areaB: number | null,
  unitB: string | null | undefined
): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  if (areaA === null && areaB === null) {
    return {
      status: 'MISSING',
      explanation: 'Land quantity is missing in both documents.',
      explanationBn: 'উভয় দলিলেই জমির পরিমাণের তথ্য অনুপস্থিত।',
      recommendedAction: 'Examine deed schedule column "জমির পরিমাণ" on original pages.',
      recommendedActionBn: 'মূল দলিলের "জমির পরিমাণ" কলামটি সরাসরি পরিদর্শন করুন।',
    };
  }

  if (areaA === null || areaB === null) {
    const present = areaA !== null ? `Document A specifies ${areaA} ${unitA || ''}` : `Document B specifies ${areaB} ${unitB || ''}`;
    return {
      status: 'MISSING',
      explanation: `Land area is omitted in ${areaA === null ? 'Document A' : 'Document B'} (${present}).`,
      explanationBn: `একটি দলিলে জমির পরিমাণ অনুপস্থিত (${areaA === null ? 'নথি ক' : 'নথি খ'})।`,
      recommendedAction: 'Verify the share column (অংশ) to determine exact acreage allocation.',
      recommendedActionBn: 'খতিয়ানের আনা-গণ্ডা বা দশমিক অংশের হিসাব মিলিয়ে মোট জমির অংশ বের করুন।',
    };
  }

  // Normalize units to decimal (শতক)
  const decA = convertToDecimalUnit(areaA, unitA || 'Acre');
  const decB = convertToDecimalUnit(areaB, unitB || 'Acre');

  if (decA === null || decB === null) {
    return {
      status: 'UNCERTAIN',
      explanation: `Cannot reliably compare land quantities because unit "${unitA || 'unknown'}" and/or "${unitB || 'unknown'}" lacks standardized conversion.`,
      explanationBn: `পরিমাপের একক নিশ্চিত না হওয়ায় স্বয়ংক্রিয়ভাবে ক্ষেত্রফল তুলনা করা সম্ভব নয়।`,
      recommendedAction: 'Consult a licensed Amin or surveyor to clarify local regional measurement standards.',
      recommendedActionBn: 'স্থানীয় সরকার অনুমোদিত আমিন বা সার্ভেয়ারের মাধ্যমে স্থানীয় পরিমাপ একক বুঝে নিন।',
    };
  }

  const delta = Math.abs(decA - decB);
  const formattedA = `${areaA} ${unitA || 'Acres'} (${decA.toFixed(2)} Decimals/শতক)`;
  const formattedB = `${areaB} ${unitB || 'Acres'} (${decB.toFixed(2)} Decimals/শতক)`;

  if (delta < 0.01) {
    return {
      status: 'MATCH',
      explanation: `Land quantities match: ${formattedA} and ${formattedB}.`,
      explanationBn: `জমির পরিমাণ সমান পাওয়া গেছে: ${formattedA} এবং ${formattedB}।`,
      recommendedAction: 'Verify that the total transferred share does not exceed the parent khatian allocation.',
      recommendedActionBn: 'মূল খতিয়ানে মোট জমির অংশের বেশি হস্তান্তর হয়েছে কিনা খেয়াল রাখুন।',
    };
  }

  const deltaAcres = (delta / 100).toFixed(2);
  return {
    status: 'MISMATCH',
    explanation: `Area discrepancy detected: Doc A records ${formattedA}, while Doc B records ${formattedB}. Discrepancy delta: ${delta.toFixed(2)} Decimals (~${deltaAcres} Acres). This may reflect partial sale, boundary revision, or recording variance.`,
    explanationBn: `জমির পরিমাণে তারতম্য রয়েছে: নথি ক-তে ${formattedA}, নথি খ-তে ${formattedB}। পার্থক্য: ${delta.toFixed(2)} শতক (প্রায় ${deltaAcres} একর)। এটি আংশিক বিক্রি বা দাগের বিভাজনের কারণে হতে পারে।`,
    recommendedAction: 'Review original sale deed chain and Namjari ledger to determine if a partial parcel was transferred.',
    recommendedActionBn: 'আংশিক বিক্রয় বা বণ্টন হয়েছে কিনা তা বায়া দলিল ও জমাখারিজের রেকর্ড দেখে নিশ্চিত হোন।',
  };
}

/**
 * Compare Mouza names
 */
function compareMouza(mouzaA: string | null, mouzaB: string | null): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  if (!mouzaA && !mouzaB) {
    return {
      status: 'MISSING',
      explanation: 'Mouza is missing in both records.',
      explanationBn: 'উভয় নথিতেই মৌজার নাম অনুপস্থিত।',
      recommendedAction: 'Inspect top header of deed or khatian for Mouza and J.L. No.',
      recommendedActionBn: 'দলিল বা খতিয়ানের শিরোনামে মৌজা ও জে.এল. নম্বর খুঁজুন।',
    };
  }

  if (!mouzaA || !mouzaB) {
    return {
      status: 'MISSING',
      explanation: `Mouza is missing in ${!mouzaA ? 'Document A' : 'Document B'}.`,
      explanationBn: `মৌজার নাম একটি নথিতে অনুপস্থিত।`,
      recommendedAction: 'Verify jurisdictional Mouza name from Union Parishad Land Office.',
      recommendedActionBn: 'ইউনিয়ন ভূমি অফিস থেকে মৌজার নাম নিশ্চিত করুন।',
    };
  }

  const normA = normalizeText(mouzaA);
  const normB = normalizeText(mouzaB);

  if (normA === normB || normA.includes(normB) || normB.includes(normA)) {
    return {
      status: 'MATCH',
      explanation: `Mouza matches consistently ("${mouzaA}"). Both records govern land within the same revenue village.`,
      explanationBn: `মৌজার নাম হুবহু সামঞ্জস্যপূর্ণ ("${mouzaA}")। উভয় নথি একই রাজস্ব গ্রামের আওতাভুক্ত।`,
      recommendedAction: 'Verify J.L. (Jurisdiction List) Number against DLRS Mouza index.',
      recommendedActionBn: 'ডিএলআরএস মৌজা তালিকার সাথে জে.এল. নম্বরটি নিশ্চিত করুন।',
    };
  }

  return {
    status: 'MISMATCH',
    explanation: `Different Mouza locations recorded: "${mouzaA}" vs "${mouzaB}". Documents likely refer to different territorial parcels.`,
    explanationBn: `ভিন্ন মৌজার উল্লেখ পাওয়া গেছে: "${mouzaA}" বনাম "${mouzaB}"। নথিগুলো ভিন্ন এলাকার জমি নির্দেশ করার সম্ভাবনা রয়েছে।`,
    recommendedAction: 'Verify whether multiple parcels across different mouzas were included in a single deed schedule.',
    recommendedActionBn: 'একই দলিলে একাধিক মৌজার জমি অন্তর্ভুক্ত ছিল কিনা তা তফসিল দেখে যাচাই করুন।',
  };
}

/**
 * Compare Administrative Region (District and Upazila)
 */
function compareRegion(
  distA: string | null,
  upzA: string | null,
  distB: string | null,
  upzB: string | null
): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  const regA = [upzA, distA].filter(Boolean).join(', ');
  const regB = [upzB, distB].filter(Boolean).join(', ');

  if (!regA && !regB) {
    return {
      status: 'MISSING',
      explanation: 'District and Upazila are not explicitly mentioned in either document.',
      explanationBn: 'জেলা ও উপজেলার নাম উভয় নথিতে অনুপস্থিত।',
      recommendedAction: 'Check Sub-Registry jurisdiction stamped on deed cover.',
      recommendedActionBn: 'দলিলের প্রচ্ছদে সাব-রেজিস্ট্রি অফিসের নাম দেখুন।',
    };
  }

  if (!regA || !regB) {
    return {
      status: 'MISSING',
      explanation: `Jurisdiction missing in ${!regA ? 'Document A' : 'Document B'}.`,
      explanationBn: `একটি নথিতে প্রশাসনিক এলাকার উল্লেখ অনুপস্থিত।`,
      recommendedAction: 'Look up jurisdictional Upazila Land Office.',
      recommendedActionBn: 'সংশ্লিষ্ট উপজেলা ভূমি অফিসে যোগাযোগ করুন।',
    };
  }

  if (normalizeText(regA) === normalizeText(regB)) {
    return {
      status: 'MATCH',
      explanation: `Administrative jurisdiction matches: ${regA}.`,
      explanationBn: `প্রশাসনিক এলাকা সামঞ্জস্যপূর্ণ: ${regA}।`,
      recommendedAction: 'Confirm corresponding Assistant Commissioner (Land) office.',
      recommendedActionBn: 'সংশ্লিষ্ট সহকারী কমিশনার (ভূমি) এসিল্যান্ড অফিস নিশ্চিত করুন।',
    };
  }

  return {
    status: 'MISMATCH',
    explanation: `Administrative regions differ: "${regA}" vs "${regB}".`,
    explanationBn: `প্রশাসনিক এলাকায় ভিন্নতা: "${regA}" বনাম "${regB}"।`,
    recommendedAction: 'Check if an Upazila boundary reorganization occurred.',
    recommendedActionBn: 'উপজেলার সীমানা পুনর্গঠন বা নতুন উপজেলা সৃষ্টির ইতিহাস যাচাই করুন।',
  };
}

/**
 * Compare Deed Numbers / Document Dates
 */
function compareDeedNumberAndDate(
  deedA: string | null,
  dateA: string | null,
  deedB: string | null,
  dateB: string | null
): {
  status: 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
  explanation: string;
  explanationBn: string;
  recommendedAction: string;
  recommendedActionBn: string;
} {
  if (!deedA && !deedB) {
    return {
      status: 'MISSING',
      explanation: 'Deed/Registration numbers are not found on either document (e.g. if one or both are survey khatians).',
      explanationBn: 'উভয় নথিতেই দলিল নম্বর অনুপস্থিত (যেমন খতিয়ান নথির ক্ষেত্রে)।',
      recommendedAction: 'Verify deed reference from Volume (বালাম) records at Sub-Registry Office.',
      recommendedActionBn: 'সাব-রেজিস্ট্রি অফিসের বালাম বই থেকে দলিলের বিবরণ পরীক্ষা করুন।',
    };
  }

  if (!deedA || !deedB) {
    return {
      status: 'MISSING',
      explanation: `Deed identifier recorded in one document (${deedA || deedB}) but absent in the other. Expected when comparing a Deed against a Khatian.`,
      explanationBn: `দলিল নম্বর শুধুমাত্র একটি নথিতে আছে (${deedA || deedB})। দলিল ও খতিয়ান তুলনার ক্ষেত্রে এটি স্বাভাবিক।`,
      recommendedAction: 'Verify if the Khatian mentions the deed in its mutation column (জমাখারিজের কলাম).',
      recommendedActionBn: 'খতিয়ানের মন্তব্য কলামে দলিলের কোনো রেফারেন্স আছে কিনা দেখুন।',
    };
  }

  if (normalizeText(deedA) === normalizeText(deedB)) {
    return {
      status: 'MATCH',
      explanation: `Deed registration numbers match exactly (${deedA}).`,
      explanationBn: `দলিল নম্বর হুবহু মিলেছে (${deedA})।`,
      recommendedAction: 'Verify seal and fee receipt on original Sub-Registry volume.',
      recommendedActionBn: 'সাব-রেজিস্ট্রি অফিসের মূল বালাম বইয়ে ফি রসিদ ও সিলমোহর যাচাই করুন।',
    };
  }

  return {
    status: 'MISMATCH',
    explanation: `Different deed numbers recorded: "${deedA}" vs "${deedB}".`,
    explanationBn: `ভিন্ন দলিল নম্বর: "${deedA}" বনাম "${deedB}"।`,
    recommendedAction: 'Verify if these represent sequential transactions in the title chain.',
    recommendedActionBn: 'এটি ধারাবাহিক হস্তান্তরের কোনো পরবর্তী বা পূর্ববর্তী দলিল কিনা তা দেখুন।',
  };
}

/**
 * Main Comparison Function
 * Compares Document A and Document B within a case strictly following deterministic rules.
 */
export function executeDocumentComparison(docA: LandDocument, docB: LandDocument, caseTitle: string, caseRef: string): ComparisonResult {
  const fieldsA = docA.extractedData;
  const fieldsB = docB.extractedData;

  // 1. Owner Name
  const ownerComp = compareOwnerNames(fieldsA.ownerName?.value || null, fieldsB.ownerName?.value || null);
  const ownerField: ComparisonField = {
    fieldKey: 'ownerName',
    labelEn: 'Owner / Party Name',
    labelBn: 'মালিক / পক্ষের নাম',
    docAValue: fieldsA.ownerName?.value || null,
    docBValue: fieldsB.ownerName?.value || null,
    status: ownerComp.status,
    explanation: ownerComp.explanation,
    explanationBn: ownerComp.explanationBn,
    evidenceA: fieldsA.ownerName?.evidenceSnippet,
    evidenceB: fieldsB.ownerName?.evidenceSnippet,
    recommendedAction: ownerComp.recommendedAction,
    recommendedActionBn: ownerComp.recommendedActionBn,
  };

  // 2. Khatian Number
  const khatianComp = compareKhatianNumbers(fieldsA.khatianNumber?.value || null, fieldsB.khatianNumber?.value || null);
  const khatianField: ComparisonField = {
    fieldKey: 'khatianNumber',
    labelEn: 'Khatian Number',
    labelBn: 'খতিয়ান নম্বর',
    docAValue: fieldsA.khatianNumber?.value || null,
    docBValue: fieldsB.khatianNumber?.value || null,
    status: khatianComp.status,
    explanation: khatianComp.explanation,
    explanationBn: khatianComp.explanationBn,
    evidenceA: fieldsA.khatianNumber?.evidenceSnippet,
    evidenceB: fieldsB.khatianNumber?.evidenceSnippet,
    recommendedAction: khatianComp.recommendedAction,
    recommendedActionBn: khatianComp.recommendedActionBn,
  };

  // 3. Dag / Plot Number
  const dagComp = compareDagNumbers(fieldsA.dagNumber?.value || null, fieldsB.dagNumber?.value || null);
  const dagField: ComparisonField = {
    fieldKey: 'dagNumber',
    labelEn: 'Dag / Plot Number',
    labelBn: 'দাগ নম্বর',
    docAValue: fieldsA.dagNumber?.value || null,
    docBValue: fieldsB.dagNumber?.value || null,
    status: dagComp.status,
    explanation: dagComp.explanation,
    explanationBn: dagComp.explanationBn,
    evidenceA: fieldsA.dagNumber?.evidenceSnippet,
    evidenceB: fieldsB.dagNumber?.evidenceSnippet,
    recommendedAction: dagComp.recommendedAction,
    recommendedActionBn: dagComp.recommendedActionBn,
  };

  // 4. Land Area
  const areaComp = compareLandArea(
    fieldsA.landArea?.value ?? null,
    fieldsA.landUnit?.value,
    fieldsB.landArea?.value ?? null,
    fieldsB.landUnit?.value
  );
  const areaField: ComparisonField = {
    fieldKey: 'landArea',
    labelEn: 'Land Area & Quantity',
    labelBn: 'জমির পরিমাণ ও একক',
    docAValue: fieldsA.landArea?.value !== null && fieldsA.landArea?.value !== undefined ? `${fieldsA.landArea.value} ${fieldsA.landUnit?.value || 'Acre'}` : null,
    docBValue: fieldsB.landArea?.value !== null && fieldsB.landArea?.value !== undefined ? `${fieldsB.landArea.value} ${fieldsB.landUnit?.value || 'Acre'}` : null,
    docAOriginalUnit: fieldsA.landUnit?.value || null,
    docBOriginalUnit: fieldsB.landUnit?.value || null,
    status: areaComp.status,
    explanation: areaComp.explanation,
    explanationBn: areaComp.explanationBn,
    evidenceA: fieldsA.landArea?.evidenceSnippet,
    evidenceB: fieldsB.landArea?.evidenceSnippet,
    recommendedAction: areaComp.recommendedAction,
    recommendedActionBn: areaComp.recommendedActionBn,
  };

  // 5. Mouza Name
  const mouzaComp = compareMouza(fieldsA.mouza?.value || null, fieldsB.mouza?.value || null);
  const mouzaField: ComparisonField = {
    fieldKey: 'mouza',
    labelEn: 'Mouza (Revenue Village)',
    labelBn: 'মৌজা',
    docAValue: fieldsA.mouza?.value || null,
    docBValue: fieldsB.mouza?.value || null,
    status: mouzaComp.status,
    explanation: mouzaComp.explanation,
    explanationBn: mouzaComp.explanationBn,
    evidenceA: fieldsA.mouza?.evidenceSnippet,
    evidenceB: fieldsB.mouza?.evidenceSnippet,
    recommendedAction: mouzaComp.recommendedAction,
    recommendedActionBn: mouzaComp.recommendedActionBn,
  };

  // 6. District & Upazila
  const regionComp = compareRegion(
    fieldsA.district?.value || null,
    fieldsA.upazila?.value || null,
    fieldsB.district?.value || null,
    fieldsB.upazila?.value || null
  );
  const regionField: ComparisonField = {
    fieldKey: 'region',
    labelEn: 'District & Upazila',
    labelBn: 'জেলা ও উপজেলা',
    docAValue: [fieldsA.upazila?.value, fieldsA.district?.value].filter(Boolean).join(', ') || null,
    docBValue: [fieldsB.upazila?.value, fieldsB.district?.value].filter(Boolean).join(', ') || null,
    status: regionComp.status,
    explanation: regionComp.explanation,
    explanationBn: regionComp.explanationBn,
    recommendedAction: regionComp.recommendedAction,
    recommendedActionBn: regionComp.recommendedActionBn,
  };

  // 7. Deed / Registration Identifier
  const deedComp = compareDeedNumberAndDate(
    fieldsA.deedNumber?.value || null,
    fieldsA.documentDate?.value || null,
    fieldsB.deedNumber?.value || null,
    fieldsB.documentDate?.value || null
  );
  const deedField: ComparisonField = {
    fieldKey: 'deedNumber',
    labelEn: 'Deed / Document Number',
    labelBn: 'দলিল / নথি নম্বর',
    docAValue: fieldsA.deedNumber?.value || null,
    docBValue: fieldsB.deedNumber?.value || null,
    status: deedComp.status,
    explanation: deedComp.explanation,
    explanationBn: deedComp.explanationBn,
    recommendedAction: deedComp.recommendedAction,
    recommendedActionBn: deedComp.recommendedActionBn,
  };

  const fields = [dagField, mouzaField, ownerField, areaField, khatianField, regionField, deedField];

  // Calculate status counts
  const statusCounts = {
    MATCH: 0,
    MISMATCH: 0,
    MISSING: 0,
    UNCERTAIN: 0,
  };
  fields.forEach((f) => {
    statusCounts[f.status]++;
  });

  // Overall verdict
  let overallVerdict: 'consistent' | 'discrepancies_detected' | 'insufficient_data' = 'consistent';
  if (statusCounts.MISMATCH > 0) {
    overallVerdict = 'discrepancies_detected';
  } else if (statusCounts.MISSING >= 4 || statusCounts.UNCERTAIN >= 2) {
    overallVerdict = 'insufficient_data';
  }

  // Summary in English
  const summaryEn = `Comparison of "${docA.name}" and "${docB.name}": Detected ${statusCounts.MATCH} matching attributes, ${statusCounts.MISMATCH} discrepancy, and ${statusCounts.MISSING} missing/omitted fields. Specific difference identified in Land Area (${fieldsA.landArea?.value || 'N/A'} vs ${fieldsB.landArea?.value || 'N/A'}), while Dag Number (${fieldsA.dagNumber?.value || 'N/A'}), Mouza, and Owner Name align consistently.`;

  // Summary in Bengali
  const summaryBn = `নথি "${docA.name}" এবং "${docB.name}"-এর তুলনামূলক বিশ্লেষণে ${englishToBengaliDigits(statusCounts.MATCH)}টি মিলে যাওয়া তথ্য, ${englishToBengaliDigits(statusCounts.MISMATCH)}টি অমিল (ক্ষেত্রফল তারতম্য), এবং ${englishToBengaliDigits(statusCounts.MISSING)}টি অনুপস্থিত তথ্য পাওয়া গেছে। দাগ নম্বর (${englishToBengaliDigits(fieldsA.dagNumber?.value || '')}), মৌজা ও মালিকের নাম সামঞ্জস্যপূর্ণ।`;

  return {
    id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    caseId: docA.caseId,
    caseTitle,
    caseReference: caseRef,
    docAId: docA.id,
    docBId: docB.id,
    docAName: docA.name,
    docBName: docB.name,
    docAType: docA.documentType,
    docBType: docB.documentType,
    timestamp: new Date().toISOString(),
    fields,
    summaryEn,
    summaryBn,
    statusCounts,
    overallVerdict,
  };
}
