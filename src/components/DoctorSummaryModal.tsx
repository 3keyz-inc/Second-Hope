"use client";
import React from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  X, 
  CheckCircle2, 
  Stethoscope, 
  Activity, 
  AlertCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';

export function DoctorSummaryModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8">
        {/* Header with actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Clinical Consultation Brief (Doctor-Ready)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated from active biomarker logs, treatment protocols, and vital telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Printer size={14} />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Patient / Profile Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Report Date</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Portal ID</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">OMNI-7749-TX</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Goal</span>
              <span className="font-bold text-slate-900 dark:text-white">Oncology & Metabolic Optimization</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Compliance Rate</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">92% (High Adherence)</span>
            </div>
          </div>

          {/* Current Active Protocols */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Stethoscope size={14} className="text-indigo-600" />
              1. Current Regimens & Lifestyle Interventions
            </h4>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="p-2.5">Intervention</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Clinical Purpose</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-2.5 font-bold">Azacitidine + Losartan Protocol</td>
                    <td className="p-2.5">Pharmacotherapy</td>
                    <td className="p-2.5">Epigenetic reactivation & microenvironment decompression</td>
                    <td className="p-2.5 text-emerald-600 font-semibold">Active</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">16:8 Fasting-Mimicking Window</td>
                    <td className="p-2.5">Nutrition</td>
                    <td className="p-2.5">Autophagy stimulation & insulin modulation</td>
                    <td className="p-2.5 text-emerald-600 font-semibold">Active</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Zone 2 Aerobic Exercise (3x/wk)</td>
                    <td className="p-2.5">Physical Activity</td>
                    <td className="p-2.5">Lactate clearance & cardiovascular stamina</td>
                    <td className="p-2.5 text-emerald-600 font-semibold">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Biomarkers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity size={14} className="text-indigo-600" />
              2. Lab & Biomarker Baselines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">TP53 Genomic Status</span>
                <span className="font-bold text-slate-900 dark:text-white">Exon 5 Missense (Sequenced)</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">hs-CRP (Inflammation)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">0.8 mg/L (Optimal)</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">HbA1c</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">5.2% (Normal Glycemic)</span>
              </div>
            </div>
          </div>

          {/* Prepared Questions for Attending Physician */}
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-indigo-600" />
              3. Key Questions to Review with Attending Clinician
            </h4>
            <ul className="space-y-1.5 text-xs text-indigo-900 dark:text-indigo-300 list-disc list-inside leading-relaxed">
              <li>Are there single-patient expanded access (IND) options or Phase II combination trials for epigenetic priming (low-dose azacitidine)?</li>
              <li>Should we repeat next-generation sequencing or liquid biopsy to verify circulating tumor DNA kinetics?</li>
              <li>Are there any contraindications between current blood pressure metrics and microenvironment modulation (low-dose losartan)?</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
