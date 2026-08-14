"use client";
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Dna, 
  ExternalLink, 
  Zap, 
  BookOpen, 
  FileText, 
  Network, 
  CheckCircle2,
  Sparkles,
  PhoneForwarded,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export function EvidenceVault({ selectedLanguage = 'English' }: { selectedLanguage?: string }) {
  const [activeVector, setActiveVector] = useState<'epigenetic' | 'microenvironment' | 'metabolic'>('epigenetic');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Zap size={16} />
            Breakthrough Clinical Protocols & Mechanisms
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Context-Shift Clinical Protocol Monograph
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Targeting cellular microenvironments and epigenetic expression rather than solely relying on non-specific cytotoxic pathways.
          </p>

          <div className="mt-4 p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl inline-block">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              Core Clinical Hypothesis:
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 font-serif italic max-w-2xl leading-relaxed">
              "Modifying the surrounding vascular and epigenetic matrix (the soil) alters therapeutic sensitivity, unlocking synergistic response in previously refractory models."
            </p>
          </div>
        </div>
      </div>

      {/* Main Dual Vector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vector 1: Epigenetic Reprogramming */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
                Vector I: Epigenetic Priming
              </span>
              <Activity className="text-indigo-600 w-4 h-4" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
              Azacitidine (DNA Methyltransferase Inhibitor)
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Hypomethylating agent that reverses hypermethylation at promoter regions of silenced tumor suppressor genes (e.g., TP53, CDKN2A), priming cells for immune recognition.
            </p>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600" />
                Clinical Application & Access:
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluated under Single-Patient IND (compassionate use) and Phase II combination trials for refractory solid tumors.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">Rx: Vidaza / Generic</span>
            <a
              href="https://en.wikipedia.org/wiki/Azacitidine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline"
            >
              Pharmacology Reference
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Vector 2: Microenvironment Modulation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                Vector II: Microenvironment Modulator
              </span>
              <Network className="text-emerald-600 w-4 h-4" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
              Losartan (Angiotensin II Type 1 Receptor Blocker)
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Downregulates TGF-beta and solid stress in desmoplastic matrices, opening collapsed blood vessels and dramatically enhancing perfusion of systemic therapeutics.
            </p>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Clinical Accessibility:
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Widely available generic oral medication with excellent safety profile when blood pressure parameters are monitored.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">Oral Tablet (25–50mg)</span>
            <a
              href="https://en.wikipedia.org/wiki/Losartan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline"
            >
              Clinical Details
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Protocol Execution Roadmap */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-600" />
          Clinical Execution & Physician Discussion Guide
        </h3>

        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white mb-1">
              Step 1: Baseline Genomic & Biomarker Sequencing
            </div>
            <p>
              Obtain next-generation sequencing (NGS) and epigenetic methylation markers to identify target mutations and potential reactivation pathways.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white mb-1">
              Step 2: Compassionate Use / Expanded Access Inquiries
            </div>
            <p>
              If standard lines have been exhausted, review single-patient expanded access programs through academic institutions (e.g. MD Anderson, Mayo Clinic, Dana-Farber) or pharmaceutical sponsors.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white mb-1">
              Step 3: Integrated Metabolic & Nutritional Shielding
            </div>
            <p>
              Pair pharmacotherapy with evidence-based fasting-mimicking cycles, anti-inflammatory nutrition, and zone 2 aerobic exercise to maximize tolerability and therapeutic index.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
