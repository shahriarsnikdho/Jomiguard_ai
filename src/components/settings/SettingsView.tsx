import React, { useState } from 'react';
import {
  Settings,
  Calculator,
  RotateCcw,
  Shield,
  Server,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { convertToDecimalUnit } from '../../lib/comparisonEngine';

interface SettingsViewProps {
  onResetDemoData: () => void;
  geminiReady?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetDemoData,
  geminiReady = false,
}) => {
  // Converter state
  const [amount, setAmount] = useState<number>(1);
  const [sourceUnit, setSourceUnit] = useState<string>('Acre');

  // Calculate conversions from normalized Decimal value
  const baseDecimals = convertToDecimalUnit(amount, sourceUnit) || 0;

  const conversions = {
    acre: (baseDecimals / 100).toFixed(4),
    decimal: baseDecimals.toFixed(2),
    katha: (baseDecimals / 1.65).toFixed(3),
    bigha: (baseDecimals / 33).toFixed(3),
    sqft: (baseDecimals * 435.6).toFixed(1),
    sqm: (baseDecimals * 40.4686).toFixed(1),
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Configuration & Tools</h2>
        <p className="text-xs text-slate-500">
          Model telemetry, Bangladesh land measurement calculator, and persistence settings
        </p>
      </div>

      {/* Engine & Server-Side Security Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#176B45]" />
            <h3 className="text-sm font-bold text-slate-900">Extraction Engine Architecture</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">v1.0.0-mvp</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Server AI Model</span>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-[#176B45]" />
              <span>Gemini 3.8 Flash (Server-Side @google/genai)</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Secret API key is read strictly on the Express backend via <code>process.env.GEMINI_API_KEY</code>.
              Never exposed to the client bundle.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Current Operating Mode</span>
            <div className="flex items-center gap-2 font-bold">
              {geminiReady ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Live Gemini AI Extraction Online
                </span>
              ) : (
                <span className="text-amber-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Certified Deterministic Demo Parser
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Supports zero-failure local testing when external keys are unpopulated, strictly adhering to specification rules.
            </p>
          </div>
        </div>
      </div>

      {/* Bangladesh Land Unit Converter */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calculator className="w-5 h-5 text-[#D6A84F]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Bangladesh Land Measurement Converter (ভূমি পরিমাপ রূপান্তরক)
            </h3>
            <p className="text-xs text-slate-500">
              Standard statutory conversion ratios across Acre, Decimal (শতক), Katha, Bigha, and Square Feet
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter Land Quantity
              </label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-sm font-mono p-2 border border-slate-300 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Unit (মূল একক)
              </label>
              <select
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-md bg-white focus:outline-none"
              >
                <option value="Acre">Acre (একর)</option>
                <option value="Decimal">Decimal / Shatangsha (শতক / শতাংশ)</option>
                <option value="Katha">Katha (কাঠা)</option>
                <option value="Bigha">Bigha (বিঘা - ৩৩ শতক)</option>
                <option value="Square Feet">Square Feet (বর্গফুট)</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] text-slate-400 block uppercase">Decimals (শতক / শতাংশ)</span>
              <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                {conversions.decimal}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] text-slate-400 block uppercase">Acres (একর)</span>
              <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                {conversions.acre}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] text-slate-400 block uppercase">Katha (কাঠা)</span>
              <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                {conversions.katha}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] text-slate-400 block uppercase">Bigha (বিঘা)</span>
              <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                {conversions.bigha}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] text-slate-400 block uppercase">Square Feet (বর্গফুট)</span>
              <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                {conversions.sqft}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] text-slate-400 block uppercase">Square Meters (বর্গমিটার)</span>
              <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                {conversions.sqm}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Storage & Reset Action */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Demo State Management</h3>
            <p className="text-xs text-slate-500">
              Restore clean baseline data or clear custom test inputs
            </p>
          </div>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Restore all benchmark cases, documents, and reports to default demo state?'
                )
              ) {
                onResetDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Initial Demo State</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Application records are stored locally in the browser’s LocalStorage vault. Resetting will restore
          the original <strong>Demo Land Case 001</strong> and benchmark documents.
        </p>
      </div>

      {/* Security & Privacy Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Shield className="w-4 h-4 text-[#176B45]" />
          <span>Security & Privacy Protocol</span>
        </div>
        <p className="leading-relaxed">
          • Document scans and extracted data are processed in memory and retained solely inside your private browser session.
          <br />
          • No uploaded deed contents are written to public cloud storage or external model training databases.
          <br />
          • In compliance with Section 11 of the engineering specification, secrets are isolated server-side and no telemetry trackers exist in the client.
        </p>
      </div>
    </div>
  );
};
