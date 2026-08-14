"use client";
import React, { useState } from 'react';
import { 
  FolderOpen, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  FileCheck,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicalDocument } from '../types';

const INITIAL_DOCS: MedicalDocument[] = [
  {
    id: 'DOC-01',
    name: 'Comprehensive_Metabolic_Panel_Q1.pdf',
    category: 'Lab Report',
    uploadDate: 'May 04, 2026',
    fileSize: '1.4 MB',
    status: 'Verified',
    summary: 'Normal renal & hepatic panels. Fasting glucose at 88 mg/dL, hs-CRP at 0.8 mg/L indicating low baseline systemic inflammation.'
  },
  {
    id: 'DOC-02',
    name: 'NGS_Genomic_Sequencing_Report.pdf',
    category: 'Genomic Sequencing',
    uploadDate: 'April 28, 2026',
    fileSize: '4.2 MB',
    status: 'Analyzed',
    summary: 'Identified TP53 exon 5 variant. Microsatellite stable (MSS). High tumor mutational burden.'
  },
  {
    id: 'DOC-03',
    name: 'Oura_Biometric_Telemetry_Export.csv',
    category: 'Wearable Export',
    uploadDate: 'April 20, 2026',
    fileSize: '820 KB',
    status: 'Verified',
    summary: 'Consistent 7.8 hrs average sleep, resting heart rate average 55 bpm, HRV average 68 ms.'
  }
];

export function MedicalRecordsVault({ onSelectForChat }: { onSelectForChat?: (docName: string) => void }) {
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(INITIAL_DOCS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredDocs = documents.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadProgress(25);

    setTimeout(() => {
      setUploadProgress(75);
      setTimeout(() => {
        const newDoc: MedicalDocument = {
          id: `DOC-${Date.now()}`,
          name: file.name,
          category: file.name.endsWith('.pdf') ? 'Lab Report' : 'Physician Note',
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          status: 'Verified',
          summary: 'Document uploaded and securely encrypted. Ready for clinical synthesis and AI analysis.'
        };
        setDocuments([newDoc, ...documents]);
        setSelectedDoc(newDoc);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <FolderOpen size={16} />
              Secure Document Vault
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Medical Records & Lab Ingestion
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Securely store, organize, and synthesize pathology records, genomic panels, and physician notes.
            </p>
          </div>

          <label className="cursor-pointer px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start md:self-auto">
            <UploadCloud size={16} />
            <span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload Medical Record'}</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleSimulatedUpload}
              accept=".pdf,.csv,.json,.txt,.png,.jpg"
            />
          </label>
        </div>

        {/* Search */}
        <div className="mt-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search uploaded records by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                selectedDoc?.id === doc.id
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 shrink-0">
                  <FileText size={18} />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {doc.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {doc.category} • {doc.fileSize} • {doc.uploadDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-semibold rounded-md border border-emerald-200 dark:border-emerald-900">
                  {doc.status}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-xs text-slate-500">No medical documents match your search.</p>
            </div>
          )}
        </div>

        {/* Right: Document Inspector & Synthesis */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              AI Clinical Document Digest
            </div>

            {selectedDoc ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-indigo-600 font-bold">
                    {selectedDoc.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedDoc.name}
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    Uploaded on {selectedDoc.uploadDate} ({selectedDoc.fileSize})
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    Automated Clinical Summary:
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedDoc.summary || "Summary generation in progress."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {onSelectForChat && (
                    <button
                      onClick={() => onSelectForChat(selectedDoc.name)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles size={14} />
                      Ask AI About This Document
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Select a document from the left to view summary.
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              Client-side isolated. Zero persistent storage of unencrypted health data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
