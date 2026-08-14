"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Stethoscope, 
  HeartHandshake, 
  Flame, 
  Copy, 
  Check, 
  Globe, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'M-1',
    role: 'assistant',
    persona: 'specialist',
    text: `Hello! I am your **Clinical Intelligence & Research Assistant** on the OmniHealth portal. 

I can assist you with:
- **Investigating Clinical Trials:** Analyzing mechanism of action, study phases, and eligibility criteria on ClinicalTrials.gov.
- **Biomarker Interpretation:** Evaluating blood panels, genomic variants (e.g., TP53), and metabolic markers.
- **Evidence-Based Synergies:** Exploring protocols like epigenetic priming (Azacitidine) or microenvironment modulation (Losartan).
- **Lifestyle & Vitality:** Structuring anti-inflammatory nutrition, circadian fasting windows, and sleep architecture.

How can I support your research today?`,
    timestamp: Date.now(),
    suggestedQuestions: [
      "How does Azacitidine prime solid tumors for immunotherapy?",
      "What is the clinical role of Losartan in tumor microenvironment modulation?",
      "Explain the key biomarkers for metabolic syndrome and insulin resistance."
    ]
  }
];

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español (Spanish)' },
  { code: 'French', label: 'Français (French)' },
  { code: 'German', label: 'Deutsch (German)' },
  { code: 'Arabic', label: 'العربية (Arabic)' },
  { code: 'Chinese', label: '中文 (Chinese)' },
  { code: 'Japanese', label: '日本語 (Japanese)' },
  { code: 'Portuguese', label: 'Português (Portuguese)' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' }
];

export function AIChatPanel({ 
  selectedLanguage = 'English', 
  onLanguageChange,
  initialQuery = ""
}: { 
  selectedLanguage?: string; 
  onLanguageChange?: (lang: string) => void;
  initialQuery?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [activePersona, setActivePersona] = useState<'specialist' | 'vitality' | 'advocate'>('specialist');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setInputMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `USER-${Date.now()}`,
      role: 'user',
      persona: activePersona,
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyForApi = messages.slice(-5).map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendChatMessage(query, activePersona, selectedLanguage, historyForApi);

      const assistantMessage: ChatMessage = {
        id: `ASSISTANT-${Date.now()}`,
        role: 'assistant',
        persona: activePersona,
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `ERR-${Date.now()}`,
        role: 'assistant',
        persona: activePersona,
        text: "I apologize, but I encountered an issue connecting to the clinical research engine. Please try again in a few moments.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGES[0]]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              OmniHealth AI Research Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Evidence-based clinical intelligence powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <Globe size={13} className="text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Persona Switcher Bar */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Persona:</span>
        
        <button
          onClick={() => setActivePersona('specialist')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activePersona === 'specialist'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Stethoscope size={13} />
          Clinical Specialist
        </button>

        <button
          onClick={() => setActivePersona('vitality')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activePersona === 'vitality'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Flame size={13} />
          Metabolic & Vitality Coach
        </button>

        <button
          onClick={() => setActivePersona('advocate')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activePersona === 'advocate'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HeartHandshake size={13} />
          Patient Advocate
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <Bot size={16} />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              <div className="whitespace-pre-line">
                {m.text}
              </div>

              {/* Suggested Questions */}
              {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 mt-3">
                  <div className="text-[10px] font-bold text-slate-400">Suggested Inquiries:</div>
                  <div className="flex flex-col gap-1.5">
                    {m.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40"
                      >
                        • {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {m.role === 'assistant' && (
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                    title="Copy response"
                  >
                    {copiedId === m.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  </button>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              Synthesizing clinical evidence...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask our ${activePersona === 'specialist' ? 'Clinical Specialist' : activePersona === 'vitality' ? 'Vitality Coach' : 'Patient Advocate'} a research question...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" />
            Medical Disclaimer: Informational & research use only. Consult qualified healthcare professionals.
          </span>
          <span>Target Language: {selectedLanguage}</span>
        </div>
      </div>
    </div>
  );
}
