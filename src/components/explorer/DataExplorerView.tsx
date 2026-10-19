import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Search,
  BookOpen,
  Building,
  ShieldAlert,
  Info,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface OfficialPortal {
  name: string;
  nameBn: string;
  url: string;
  agency: string;
  description: string;
  scope: string;
}

const OFFICIAL_PORTALS: OfficialPortal[] = [
  {
    name: 'Ministry of Land Citizen Portal',
    nameBn: 'ভূমি মন্ত্রণালয় সিটিজেন পোর্টাল',
    url: 'https://www.land.gov.bd/',
    agency: 'Ministry of Land, Government of Bangladesh',
    description: 'Central portal for national land policies, citizen land services, e-Mutation status, and digital land tax (LD Tax / ভূমি উন্নয়ন কর).',
    scope: 'General policy, e-Services, citizen guidelines',
  },
  {
    name: 'Directorate of Land Records and Survey (DLRS)',
    nameBn: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর',
    url: 'https://dlrs.gov.bd/',
    agency: 'DLRS, Ministry of Land',
    description: 'Official repository of Cadastral Survey maps, Mouza sheets, Revision Settlement gazettes, and survey benchmark standards.',
    scope: 'Mouza maps, CS/SA/RS survey history',
  },
  {
    name: 'Settlement & Digital Khatian Service',
    nameBn: 'ডিজিটাল খতিয়ান ও সেটেলমেন্ট সেবা',
    url: 'https://settlement.gov.bd/',
    agency: 'Government of the People’s Republic of Bangladesh',
    description: 'Public portal for requesting certified copies (পর্চা) of RS, BS, and City Survey khatians directly from District Record Rooms.',
    scope: 'Certified Khatian Porcha verification',
  },
  {
    name: 'E-Namjari Online Mutation System',
    nameBn: 'ই-নামজারি ও জমাখারিজ অনলাইন সিস্টেম',
    url: 'https://mutation.land.gov.bd/',
    agency: 'Land Reforms Board / Upazila AC Land Offices',
    description: 'National electronic portal for filing, tracking, and verifying land mutation orders, Dakhila receipts, and separation of holdings.',
    scope: 'Namjari orders, Dakhila receipt verification',
  },
];

interface GlossaryTerm {
  term: string;
  termBn: string;
  category: 'Survey' | 'Document' | 'Administrative' | 'Measurement';
  definitionEn: string;
  definitionBn: string;
  relevance: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'CS (Cadastral Survey)',
    termBn: 'সিএস জরিপ',
    category: 'Survey',
    definitionEn: 'The first comprehensive cadastral survey conducted under the British Bengal Tenancy Act between 1888 and 1940. Serves as the historical baseline for land titles in Bangladesh.',
    definitionBn: '১৮৮৮-১৯৪০ সালে প্রণীত প্রথম আধুনিক ভূমিস্বত্ব জরিপ। একে ঐতিহাসিক বা মূল জরিপ হিসেবে বিবেচনা করা হয়।',
    relevance: 'Essential baseline for tracing original ownership and title chain legitimacy.',
  },
  {
    term: 'SA (State Acquisition Survey)',
    termBn: 'এসএ জরিপ',
    category: 'Survey',
    definitionEn: 'Conducted under the East Bengal State Acquisition and Tenancy Act 1950 after the abolition of the Zamindari system (1956–1962).',
    definitionBn: 'জমিদারি প্রথা উচ্ছেদের পর ১৯৫৬-১৯৬২ সালে প্রস্তুতকৃত জরিপ খতিয়ান।',
    relevance: 'Crucial for confirming whether property vested with the State or legitimate tenant.',
  },
  {
    term: 'RS (Revisional Survey)',
    termBn: 'আরএস জরিপ',
    category: 'Survey',
    definitionEn: 'Field revision of CS and SA surveys. Widely accepted across civil courts as having high evidentiary value in title adjudication.',
    definitionBn: 'সিএস ও এসএ জরিপের ভুলত্রুটি সংশোধনপূর্বক পরিচালিত অত্যন্ত নির্ভরযোগ্য জরিপ।',
    relevance: 'Standard document in land transactions; mismatches against RS require legal scrutiny.',
  },
  {
    term: 'BS / City Survey',
    termBn: 'বিএস / সিটি জরিপ',
    category: 'Survey',
    definitionEn: 'The modern ongoing settlement survey initiated under modern surveying technologies across Bangladesh (and City Survey in municipal Dhaka/Chittagong).',
    definitionBn: 'আধুনিক প্রযুক্তিতে পরিচালিত সাম্প্রতিক জরিপ। সিটি কর্পোরেশন এলাকায় এটি সিটি জরিপ নামে পরিচিত।',
    relevance: 'Current operating record at local Tahsil / AC Land offices for property taxation.',
  },
  {
    term: 'Khatian / Porcha',
    termBn: 'খতিয়ান / পর্চা',
    category: 'Document',
    definitionEn: 'Official Record of Rights (RoR) recording the owner name, co-sharers, Dag numbers, land classification, and specific area share.',
    definitionBn: 'স্বত্বাধিকারের মূল দলিল (Record of Rights) যাতে মালিক, শরিকান, দাগ ও জমির পরিমাণ লিপিবদ্ধ থাকে।',
    relevance: 'Core document analyzed by JomiGuard AI against transaction deeds.',
  },
  {
    term: 'Dag / Plot Number',
    termBn: 'দাগ নম্বর',
    category: 'Administrative',
    definitionEn: 'Unique numerical parcel identifier assigned to a specific tract of land on the surveyed Mouza map.',
    definitionBn: 'মৌজা নকশায় নির্দিষ্ট জমির টুকরোকে চিহ্নিতকারী স্বতন্ত্র নম্বর।',
    relevance: 'Primary spatial anchor; splitting or sub-dividing creates Bata Dag (বাটা দাগ).',
  },
  {
    term: 'Namjari / Mutation (জমাখারিজ)',
    termBn: 'নামজারি / জমাখারিজ',
    category: 'Administrative',
    definitionEn: 'The administrative procedure by which an old owner’s name is substituted by the new buyer’s name in the government revenue ledger at the AC Land office.',
    definitionBn: 'দলিলমূলে জমি ক্রয়ের পর রাজস্ব রেকর্ডে পুরাতন মালিকের নাম বাদ দিয়ে নতুন মালিকের নাম অন্তর্ভুক্তকরণ।',
    relevance: 'Without mutation, ownership is incomplete for government tax and registration purposes.',
  },
  {
    term: 'Bigha, Katha, Decimal, Acre',
    termBn: 'বিঘা, কাঠা, শতক, একর',
    category: 'Measurement',
    definitionEn: 'Standard land measurement units in Bangladesh. 1 Acre = 100 Decimals (শতক); 1 Bigha = 33 Decimals = 20 Katha; 1 Katha = 1.65 Decimals.',
    definitionBn: 'বাংলাদেশে জমির প্রচলিত একক। ১ একর = ১০০ শতক, ১ বিঘা = ৩৩ শতক (২০ কাঠা), ১ কাঠা = ১.৬৫ শতক।',
    relevance: 'Normalized mathematically by JomiGuard AI to detect subtle partial sales.',
  },
];

export const DataExplorerView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredGlossary = GLOSSARY_TERMS.filter((g) => {
    const matchSearch =
      g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.termBn.includes(searchTerm) ||
      g.definitionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.definitionBn.includes(searchTerm);

    const matchCategory = categoryFilter === 'all' || g.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Bangladesh Land Data Explorer</h2>
        <p className="text-xs text-slate-500">
          Official statutory portals, Cadastral survey taxonomy, and provenanced land terminology
        </p>
      </div>

      {/* Authority & Provenance Boundary Notice */}
      <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed space-y-1">
          <div>
            <strong className="text-slate-900 font-bold">Independent Land-Tech Architecture:</strong>{' '}
            JomiGuard AI does not claim or maintain a direct live database API integration with government servers.
            Official government portals require citizen credentials and biometric OTPs.
          </div>
          <div className="text-slate-600">
            Below are authorized direct access portals for official verification, along with transparent synthetic reference examples.
          </div>
        </div>
      </div>

      {/* Official Government Portals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Official Bangladesh Government Land Portals
            </h3>
            <p className="text-xs text-slate-500">
              Direct official public resources for deed certified copies, e-Mutation, and settlement maps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_PORTALS.map((portal) => (
            <div
              key={portal.url}
              className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{portal.name}</h4>
                    <span className="text-xs text-[#176B45] font-sans font-medium">{portal.nameBn}</span>
                  </div>
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Authority: {portal.agency}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {portal.description}
                </p>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-sm">
                  <strong>Service Scope:</strong> {portal.scope}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                  {portal.url}
                </span>
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#176B45] hover:text-[#125335] bg-[#176B45]/5 hover:bg-[#176B45]/10 rounded-md transition-colors"
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bangladesh Land Survey & Legal Glossary */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Bangladesh Land Law & Survey Glossary
            </h3>
            <p className="text-xs text-slate-500">
              Standard legal definitions for CS, SA, RS, BS, Porcha, and Namjari terms
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search term (e.g. RS, Khatian, Dag)..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none w-48 sm:w-60"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Survey">Survey Eras</option>
              <option value="Document">Documents</option>
              <option value="Administrative">Administrative</option>
              <option value="Measurement">Measurement Units</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((g) => (
            <div
              key={g.term}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{g.term}</span>
                <span className="text-[11px] font-sans text-[#176B45] font-semibold">{g.termBn}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {g.definitionEn}
              </p>

              <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                {g.definitionBn}
              </p>

              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                <strong>Why it matters:</strong> {g.relevance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
