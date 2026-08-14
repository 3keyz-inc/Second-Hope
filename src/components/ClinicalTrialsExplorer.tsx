"use client";
import React, { useState } from 'react';
import { 
  Microscope, 
  Search, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClinicalTrial, ResearchPaper } from '../types';
import { summarizeTrialWithAI } from '../services/geminiService';

const SAMPLE_TRIALS: ClinicalTrial[] = [
  {
    id: 'TR-01',
    nctId: 'NCT05423871',
    title: 'Epigenetic Reprogramming and Hypomethylating Agents in Refractory Solid Malignancies',
    phase: 'Phase II',
    status: 'Recruiting',
    category: 'Oncology',
    targetMarker: 'TP53 / Epigenetic Silencing',
    leadInstitution: 'MD Anderson Cancer Center',
    location: 'Houston, TX & Multi-Center',
    summary: 'Evaluating the synergistic potential of low-dose azacitidine combined with microenvironment modulators to reactivate dormant tumor suppressor pathways.',
    intervention: 'Azacitidine + Losartan',
    link: 'https://clinicaltrials.gov/study/NCT05423871',
    publishedDate: 'Updated Oct 2025'
  },
  {
    id: 'TR-02',
    nctId: 'NCT04891244',
    title: 'Metabolic Modulation via Ketogenic Fasting-Mimicking Diets During Standard-of-Care Chemotherapy',
    phase: 'Phase III',
    status: 'Active, not recruiting',
    category: 'Metabolic',
    targetMarker: 'IGF-1 / Glucose Transporters',
    leadInstitution: 'Mayo Clinic Comprehensive Cancer Center',
    location: 'Rochester, MN',
    summary: 'Assessing tumor sensitization and reduction of normal-tissue neurotoxicity when applying cyclic fasting protocols prior to cytotoxic infusions.',
    intervention: 'Cyclic Fasting-Mimicking Protocol (FMD)',
    link: 'https://clinicaltrials.gov/study/NCT04891244',
    publishedDate: 'Updated Dec 2025'
  },
  {
    id: 'TR-03',
    nctId: 'NCT05988112',
    title: 'Next-Generation KRAS G12C and G12D Small Molecule Inhibitors with Immune Checkpoint Blockade',
    phase: 'Phase I',
    status: 'Recruiting',
    category: 'Oncology',
    targetMarker: 'KRAS G12C/D Mutation',
    leadInstitution: 'Memorial Sloan Kettering Cancer Center',
    location: 'New York, NY',
    summary: 'First-in-human trial investigating oral allosteric KRAS switch inhibitors combined with anti-PD-1 monoclonal antibodies for persistent solid tumors.',
    intervention: 'Novel G12C Switch Inhibitor + Pembrolizumab',
    link: 'https://clinicaltrials.gov/study/NCT05988112',
    publishedDate: 'Updated Jan 2026'
  },
  {
    id: 'TR-04',
    nctId: 'NCT06109923',
    title: 'Targeted Microbiome Modulation to Enhance Immunotherapy Responsiveness',
    phase: 'Phase II',
    status: 'Recruiting',
    category: 'Immunology',
    targetMarker: 'Gut Microbial Diversity / CD8+ Infiltration',
    leadInstitution: 'Dana-Farber Cancer Institute',
    location: 'Boston, MA',
    summary: 'Standardized microbial consortium oral capsular transfer to reverse primary resistance in non-responsive checkpoint inhibitor cohorts.',
    intervention: 'Lyophilized Microbial Consortium (SER-401)',
    link: 'https://clinicaltrials.gov/study/NCT06109923',
    publishedDate: 'Updated Feb 2026'
  },
  {
    id: 'TR-05',
    nctId: 'NCT05128800',
    title: 'Senolytic Therapy (Dasatinib + Quercetin) for Reversal of Systemic Biological Aging and Frailty',
    phase: 'Phase II',
    status: 'Enrolling by invitation',
    category: 'Longevity',
    targetMarker: 'p16INK4a / Senescence-Associated Secretory Phenotype',
    leadInstitution: 'Johns Hopkins Medicine',
    location: 'Baltimore, MD',
    summary: 'Intermittent clearing of senescent cells to reduce chronic low-grade inflammation, improve vascular elasticity, and enhance cognitive endurance.',
    intervention: 'Dasatinib + Bioavailable Quercetin',
    link: 'https://clinicaltrials.gov/study/NCT05128800',
    publishedDate: 'Updated Nov 2025'
  },
  {
    id: 'TR-06',
    nctId: 'NCT04721990',
    title: 'GLP-1/GIP Dual Receptor Agonism for Metabolic Syndrome & Neuroinflammation Reduction',
    phase: 'Phase III',
    status: 'Completed',
    category: 'Metabolic',
    targetMarker: 'HbA1c, HOMA-IR, hs-CRP',
    leadInstitution: 'Cleveland Clinic',
    location: 'Cleveland, OH',
    summary: 'Long-term outcomes of dual incretin co-agonism on hepatic steatosis, cardiovascular risk markers, and systemic neuro-inflammation.',
    intervention: 'Tirzepatide weekly subcutaneous',
    link: 'https://clinicaltrials.gov/study/NCT04721990',
    publishedDate: 'Updated Jan 2026'
  }
];

const SAMPLE_PAPERS: ResearchPaper[] = [
  {
    id: 'PUB-01',
    pmid: '38920114',
    title: 'Reversing Resistance: Epigenetic Priming Sensitizes Refractory Solid Tumors to Immunotherapy',
    journal: 'Nature Medicine',
    year: 2025,
    citations: 184,
    category: 'Oncology',
    keyFindings: 'Low-dose DNA demethylation leads to robust antigen presentation re-expression in previously immune-evasive models.',
    link: 'https://pubmed.ncbi.nlm.nih.gov/'
  },
  {
    id: 'PUB-02',
    pmid: '39011422',
    title: 'Circadian Timing of Nutrient Intake and Its Impact on Mitochondrial Autophagy',
    journal: 'Cell Metabolism',
    year: 2026,
    citations: 92,
    category: 'Metabolic',
    keyFindings: 'Time-restricted eating synced with peripheral circadian clocks enhances mitophagy and reduces resting inflammatory cytokines.',
    link: 'https://pubmed.ncbi.nlm.nih.gov/'
  },
  {
    id: 'PUB-03',
    pmid: '37894210',
    title: 'Angiotensin II Receptor Antagonists as Modulators of the Tumor Desmoplastic Stroma',
    journal: 'Cancer Research',
    year: 2025,
    citations: 247,
    category: 'Pharmacology',
    keyFindings: 'Losartan treatment decompresses tumor blood vessels, dramatically improving drug perfusion and CD8+ T-cell infiltration.',
    link: 'https://pubmed.ncbi.nlm.nih.gov/'
  }
];

export function ClinicalTrialsExplorer({ selectedLanguage = 'English' }: { selectedLanguage?: string }) {
  const [activeTab, setActiveTab] = useState<'trials' | 'papers'>('trials');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  
  // AI summary state
  const [selectedTrialForAI, setSelectedTrialForAI] = useState<ClinicalTrial | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryMode, setSummaryMode] = useState<'patient' | 'clinician'>('patient');

  const filteredTrials = SAMPLE_TRIALS.filter(trial => {
    const matchesSearch = 
      trial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.nctId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.intervention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trial.targetMarker && trial.targetMarker.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || trial.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPhase = phaseFilter === 'all' || trial.phase.toLowerCase().replace(' ', '') === phaseFilter.toLowerCase().replace(' ', '');

    return matchesSearch && matchesCategory && matchesPhase;
  });

  const filteredPapers = SAMPLE_PAPERS.filter(paper => {
    return paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.keyFindings.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleGenerateAISummary = async (trial: ClinicalTrial, mode: 'patient' | 'clinician') => {
    setSelectedTrialForAI(trial);
    setSummaryMode(mode);
    setIsSummarizing(true);
    setAiSummary(null);

    try {
      const summary = await summarizeTrialWithAI(
        trial.title,
        trial.phase,
        trial.category,
        `${trial.summary}. Intervention: ${trial.intervention}. Institution: ${trial.leadInstitution}`,
        mode,
        selectedLanguage
      );
      setAiSummary(summary);
    } catch (e) {
      setAiSummary("Unable to connect to AI summarizer. Please review the trial link directly.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Microscope size={16} />
              Global Research Explorer
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Clinical Trials & Breakthrough Literature
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live index of active trials, therapeutic protocols, and peer-reviewed clinical findings.
            </p>
          </div>

          {/* Sub-view switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('trials')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'trials'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Clinical Trials ({SAMPLE_TRIALS.length})
            </button>
            <button
              onClick={() => setActiveTab('papers')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'papers'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PubMed Studies ({SAMPLE_PAPERS.length})
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by drug, mutation (e.g. TP53), NCT ID, or disease area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Therapeutic Areas</option>
              <option value="oncology">Oncology</option>
              <option value="metabolic">Metabolic & Endocrine</option>
              <option value="immunology">Immunology</option>
              <option value="longevity">Longevity & Aging</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Trial Phases</option>
              <option value="phasei">Phase I</option>
              <option value="phaseii">Phase II</option>
              <option value="phaseiii">Phase III</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Content */}
      {activeTab === 'trials' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trial Cards List */}
          <div className="lg:col-span-7 space-y-4">
            {filteredTrials.map((trial) => (
              <div
                key={trial.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-bold rounded-lg">
                      {trial.nctId}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md">
                      {trial.phase}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                      trial.status === 'Recruiting'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {trial.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {trial.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {trial.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {trial.summary}
                  </p>
                </div>

                {/* Trial metadata tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{trial.leadInstitution}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{trial.location}</span>
                  </div>
                </div>

                {/* Actions & AI summary triggers */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateAISummary(trial, 'patient')}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Generate plain-English summary for patient"
                    >
                      <Sparkles size={13} />
                      Explain for Patient
                    </button>
                    <button
                      onClick={() => handleGenerateAISummary(trial, 'clinician')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Generate detailed scientific summary"
                    >
                      <Stethoscope size={13} />
                      Clinical Breakdown
                    </button>
                  </div>

                  <a
                    href={trial.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    ClinicalTrials.gov
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}

            {filteredTrials.length === 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <Search size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching clinical trials</h4>
                <p className="text-xs text-slate-500 mt-1">Try broadening your search term or clearing the active filters.</p>
              </div>
            )}
          </div>

          {/* Right Panel: AI Synthesis & Deep Insights */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles size={16} />
                AI Clinical Research Synthesizer
              </div>
              
              {selectedTrialForAI ? (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {selectedTrialForAI.nctId} • {summaryMode === 'patient' ? 'Patient-Friendly View' : 'Physician Breakdown'}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-2">
                      {selectedTrialForAI.title}
                    </h4>
                  </div>

                  {isSummarizing ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">
                        Analyzing trial parameters with Gemini Intelligence Engine...
                      </p>
                    </div>
                  ) : aiSummary ? (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 whitespace-pre-line">
                        {aiSummary}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                        <span>Language: {selectedLanguage}</span>
                        <button
                          onClick={() => handleGenerateAISummary(
                            selectedTrialForAI, 
                            summaryMode === 'patient' ? 'clinician' : 'patient'
                          )}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                        >
                          Switch to {summaryMode === 'patient' ? 'Clinical' : 'Patient'} Mode
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select a trial to synthesize
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Click "Explain for Patient" or "Clinical Breakdown" on any trial card to get immediate structured AI analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Academic Literature Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {paper.journal} ({paper.year})
                  </span>
                  <span className="font-mono">PMID: {paper.pmid}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {paper.title}
                </h3>
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Key Scientific Takeaway:
                  </span>
                  {paper.keyFindings}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 font-medium">
                  {paper.citations} Peer Citations
                </span>
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  Read on PubMed
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
