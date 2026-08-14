"use client";
import React, { useState } from 'react';
import { 
  Dna, 
  Search, 
  Sparkles, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpRight, 
  HelpCircle,
  Plus,
  Info,
  Apple,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Biomarker } from '../types';
import { analyzeBiomarkerWithAI } from '../services/geminiService';

const INITIAL_BIOMARKERS: Biomarker[] = [
  {
    id: 'BM-1',
    code: 'TP53',
    name: 'TP53 Tumor Suppressor Status',
    category: 'Genomic',
    standardRange: 'Wild-Type (Intact)',
    currentValue: 'Exon 5 Missense Mutation',
    unit: 'Variant',
    status: 'elevated',
    clinicalImpact: 'Impaired intrinsic apoptosis; elevated relevance for epigenetic priming and reactivation protocols (Azacitidine).',
    actionableDiet: 'Incorporate cruciferous sulforaphanes and curcumin to support cellular defense pathways.'
  },
  {
    id: 'BM-2',
    code: 'hs-CRP',
    name: 'High-Sensitivity C-Reactive Protein',
    category: 'Inflammatory',
    standardRange: '< 1.0',
    currentValue: '0.8',
    unit: 'mg/L',
    status: 'optimal',
    clinicalImpact: 'Low systemic baseline inflammation, indicating good microenvironment stability.',
    actionableDiet: 'Maintain high omega-3 fatty acid intake (EPA/DHA) and regular aerobic zone 2 conditioning.'
  },
  {
    id: 'BM-3',
    code: 'HbA1c',
    name: 'Glycated Hemoglobin',
    category: 'Metabolic',
    standardRange: '4.0 - 5.6',
    currentValue: '5.2',
    unit: '%',
    status: 'optimal',
    clinicalImpact: 'Optimal glycemic control and insulin sensitivity, reducing fuel availability for glycolytic disease pathways.',
    actionableDiet: 'Continue low glycemic-load nutrition with adequate soluble fiber (>35g/day).'
  },
  {
    id: 'BM-4',
    code: 'Vit-D3',
    name: '25-Hydroxy Vitamin D',
    category: 'Hormonal',
    standardRange: '40 - 70',
    currentValue: '34',
    unit: 'ng/mL',
    status: 'low',
    clinicalImpact: 'Sub-optimal immunomodulatory and nuclear receptor signaling.',
    actionableDiet: 'Targeted supplementation (4,000–5,000 IU/day with Vitamin K2 and dietary fat) and safe morning sunlight exposure.'
  },
  {
    id: 'BM-5',
    code: 'mTOR/pS6K',
    name: 'Phosphorylated S6 Kinase / mTOR Axis',
    category: 'Metabolic',
    standardRange: 'Modulated Baseline',
    currentValue: 'Elevated Phosphorylation',
    unit: 'Relative Index',
    status: 'elevated',
    clinicalImpact: 'Active anabolic signaling. Intermittent fasting or AMPK activators (Metformin, Berberine) may downregulate overactivation.',
    actionableDiet: 'Implement 16:8 intermittent fasting window 4 days/week to stimulate autophagy.'
  }
];

export function BiomarkerAnalyzer({ selectedLanguage = 'English' }: { selectedLanguage?: string }) {
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(INITIAL_BIOMARKERS);
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker>(INITIAL_BIOMARKERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Analysis Form
  const [customName, setCustomName] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [customAnalysis, setCustomAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAddingBiomarker, setIsAddingBiomarker] = useState(false);

  const filteredBiomarkers = biomarkers.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunCustomAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    setIsAnalyzing(true);
    setCustomAnalysis(null);

    try {
      const result = await analyzeBiomarkerWithAI(
        customName,
        customValue,
        customUnit,
        customContext,
        selectedLanguage
      );
      setCustomAnalysis(result);
    } catch (err) {
      setCustomAnalysis("Unable to complete AI analysis. Please verify inputs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveCustomBiomarker = () => {
    if (!customName.trim()) return;
    const newEntry: Biomarker = {
      id: `BM-${Date.now()}`,
      code: customName.split(' ')[0].toUpperCase(),
      name: customName,
      category: 'Metabolic',
      standardRange: 'Standard Clinical Norms',
      currentValue: customValue || 'Logged',
      unit: customUnit || 'units',
      status: 'optimal',
      clinicalImpact: customContext || 'Custom biomarker logged into active health profile.',
      actionableDiet: 'Consult your physician for personalized dietary targets.'
    };
    setBiomarkers([newEntry, ...biomarkers]);
    setSelectedBiomarker(newEntry);
    setIsAddingBiomarker(false);
    setCustomName('');
    setCustomValue('');
    setCustomUnit('');
    setCustomContext('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Dna size={16} />
              Biomarker & Genomic Intelligence
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Biomarker Tracking & Clinical Interpretation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor key blood markers, genomic sequencing results, and metabolic indicators with clinical reference ranges.
            </p>
          </div>

          <button
            onClick={() => setIsAddingBiomarker(!isAddingBiomarker)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start md:self-auto"
          >
            <Plus size={15} />
            {isAddingBiomarker ? 'Close Analyzer Form' : 'Analyze New Lab Value'}
          </button>
        </div>

        {/* Search input */}
        <div className="mt-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tracked biomarkers (e.g. CRP, TP53, HbA1c, Vitamin D)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* AI Custom Lab Value Evaluator Modal / Form */}
      <AnimatePresence>
        {isAddingBiomarker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-50/50 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-6 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-4">
              <Sparkles size={16} />
              Instant AI Biomarker Interpretation
            </div>

            <form onSubmit={handleRunCustomAnalysis} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Biomarker / Test Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ferritin, EGFR, Total Cholesterol"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 145, Positive, 1.2"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Units
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ng/mL, mg/dL, %"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Context / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Routine 6-month checkup, patient experiencing mild fatigue..."
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <Sparkles size={14} />
                  {isAnalyzing ? 'Analyzing with AI...' : 'Run Clinical AI Analysis'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveCustomBiomarker}
                  className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  <FileCheck size={14} className="inline mr-1.5" />
                  Save to My Biomarker List
                </button>
              </div>
            </form>

            {customAnalysis && (
              <div className="mt-5 p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line shadow-sm">
                {customAnalysis}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid of Tracked Markers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of Biomarkers */}
        <div className="lg:col-span-6 space-y-3">
          {filteredBiomarkers.map((bm) => (
            <div
              key={bm.id}
              onClick={() => setSelectedBiomarker(bm)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedBiomarker.id === bm.id
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    bm.status === 'optimal'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                      : bm.status === 'elevated'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {bm.code.slice(0, 4)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {bm.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      Category: {bm.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    {bm.currentValue} {bm.unit}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase ${
                    bm.status === 'optimal' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {bm.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: In-Depth Breakdown */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedBiomarker.code} • {selectedBiomarker.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedBiomarker.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Standard Target</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {selectedBiomarker.standardRange}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Activity size={14} className="text-indigo-600" />
                  Clinical Significance
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedBiomarker.clinicalImpact}
                </p>
              </div>

              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Apple size={14} className="text-emerald-600" />
                  Evidence-Based Dietary & Lifestyle Protocol
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {selectedBiomarker.actionableDiet}
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Info size={14} />
                  Requires verification on next comprehensive metabolic panel.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
