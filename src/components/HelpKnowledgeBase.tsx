"use client";
import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Stethoscope, 
  Dna, 
  Target, 
  Activity,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    category: 'Getting Started',
    question: 'How do I search for active clinical trials on this platform?',
    answer: 'Navigate to the "Clinical Trials" tab. You can use the search bar to query by condition (e.g. "Solid Tumors", "Metabolic Syndrome"), specific drug names (e.g. "Azacitidine", "Losartan"), or genetic mutations (e.g. "TP53", "KRAS"). Use the Phase and Therapeutic Area filters to narrow down your search.'
  },
  {
    category: 'Biomarkers',
    question: 'What is the Biomarker & Lab Analyzer tool?',
    answer: 'The Biomarker Analyzer helps you understand lab results by matching values with clinical reference ranges and evidence-based lifestyle modifications. You can also type in custom lab tests from your personal blood panels to get instant AI-generated interpretations.'
  },
  {
    category: 'Protocols',
    question: 'What is the "Context-Shift" treatment protocol?',
    answer: 'The Context-Shift protocol is an evidence-based clinical strategy that focuses on modifying the epigenetic expression and microenvironment surrounding abnormal cells (the "soil") rather than solely relying on non-specific cytotoxic destruction. It explores combinations such as low-dose DNA methyltransferase inhibitors and angiotensin receptor blockers.'
  },
  {
    category: 'Consultation',
    question: 'How do I generate a report to bring to my doctor?',
    answer: 'Click "Doctor Summary" at the top right of the application or inside the Treatment Planner. The platform compiles your active interventions, monitored biomarkers, and AI-suggested clinical questions into a clean, printable brief.'
  },
  {
    category: 'AI Assistant',
    question: 'How do the different AI Research Personas work?',
    answer: 'The AI Research Assistant offers three distinct modes: 1) Clinical Specialist (deep scientific reasoning, trial mechanisms, pharmacology), 2) Metabolic & Vitality Coach (daily habits, sleep architecture, anti-inflammatory nutrition), and 3) Patient Advocate (plain-English translations and compassionate guidance). You can also switch between 9 global languages.'
  }
];

const GLOSSARY = [
  { term: 'Epigenetic Priming', desc: 'Reversing chemical methyl marks on DNA to reactivate tumor suppressor genes.' },
  { term: 'Desmoplasia', desc: 'Dense fibrous connective tissue surrounding solid tumors that impedes blood flow and drug delivery.' },
  { term: 'Heart Rate Variability (HRV)', desc: 'Variation in time between heartbeats, reflecting autonomic nervous system recovery.' },
  { term: 'Liquid Biopsy', desc: 'Non-invasive blood test analyzing circulating cell-free DNA (cfDNA) or tumor cells.' },
  { term: 'Autophagy', desc: 'Cellular recycling process where the body breaks down and clears damaged intracellular components.' }
];

export function HelpKnowledgeBase() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = GLOSSARY.filter(g => 
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.desc.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <HelpCircle size={16} />
          Knowledge Base & User Manual
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions & Medical Glossary
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Step-by-step guides for navigating clinical intelligence tools, interpreting lab panels, and preparing for consultations.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: FAQs */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Frequently Asked Questions
          </h3>

          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {faq.category}
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${openIndex === i ? 'rotate-180 text-indigo-600' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right: Medical Terms Glossary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <BookOpen size={16} className="text-indigo-600" />
              Clinical Terminology Glossary
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search medical terms..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredGlossary.map((g, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {g.term}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Reviewed against PubMed & MeSH indexed clinical terminologies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
