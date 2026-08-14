"use client";
import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  Award, 
  Pill, 
  Heart, 
  Moon, 
  Activity,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InterventionGoal } from '../types';

const INITIAL_GOALS: InterventionGoal[] = [
  {
    id: 'G-1',
    title: 'Epigenetic Priming: Low-Dose Azacitidine Infusion Cycle',
    category: 'Pharmacotherapy',
    priority: 'high',
    impactPercentage: 90,
    status: 'active',
    evidenceGrade: 'A (Clinical Trials)',
    notes: 'Administered under clinical supervision to reverse tumor suppressor promoter hypermethylation.'
  },
  {
    id: 'G-2',
    title: 'Angiotensin II Modulation: Generic Losartan (50mg daily)',
    category: 'Pharmacotherapy',
    priority: 'high',
    impactPercentage: 85,
    status: 'active',
    evidenceGrade: 'B (Observational)',
    notes: 'Decompresses solid tumor microenvironment and facilitates drug delivery.'
  },
  {
    id: 'G-3',
    title: 'Circadian Fasting-Mimicking Protocol (16:8 Window)',
    category: 'Nutrition',
    priority: 'medium',
    impactPercentage: 75,
    status: 'active',
    evidenceGrade: 'A (Clinical Trials)',
    notes: 'Enhances cellular autophagy and optimizes insulin sensitivity parameters.'
  },
  {
    id: 'G-4',
    title: 'Zone 2 Aerobic Conditioning (45 mins, 3x per week)',
    category: 'Physical Activity',
    priority: 'medium',
    impactPercentage: 70,
    status: 'active',
    evidenceGrade: 'A (Clinical Trials)',
    notes: 'Maintains lactate clearance and stimulates mitochondrial density.'
  },
  {
    id: 'G-5',
    title: 'Deep Sleep Optimization (>1.5 hrs Slow-Wave Sleep)',
    category: 'Sleep & Recovery',
    priority: 'high',
    impactPercentage: 80,
    status: 'active',
    evidenceGrade: 'B (Observational)',
    notes: 'Crucial for glymphatic clearance and immune system homeostasis.'
  }
];

export function TreatmentPlanner({ onExportSummary }: { onExportSummary?: () => void }) {
  const [goals, setGoals] = useState<InterventionGoal[]>(INITIAL_GOALS);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New goal form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<InterventionGoal['category']>('Pharmacotherapy');
  const [newPriority, setNewPriority] = useState<InterventionGoal['priority']>('medium');
  const [newNotes, setNewNotes] = useState('');
  const [newImpact, setNewImpact] = useState<number>(75);

  const filteredGoals = goals.filter(g => {
    if (categoryFilter === 'all') return true;
    return g.category.toLowerCase().replace(/\s+/g, '') === categoryFilter.toLowerCase().replace(/\s+/g, '');
  });

  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const averageCompliance = Math.round(
    goals.reduce((acc, curr) => acc + (curr.status === 'completed' ? 100 : curr.impactPercentage), 0) / (goals.length || 1)
  );

  const handleToggleStatus = (id: string) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        return {
          ...g,
          status: g.status === 'completed' ? 'active' : 'completed'
        };
      }
      return g;
    }));
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: InterventionGoal = {
      id: `G-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      impactPercentage: newImpact,
      status: 'active',
      evidenceGrade: 'B (Observational)',
      notes: newNotes
    };

    setGoals([newGoal, ...goals]);
    setNewTitle('');
    setNewNotes('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Target size={16} />
              Intervention Management
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Personalized Treatment & Lifestyle Planner
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Track clinical regimens, nutritional interventions, and daily therapeutic protocols.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onExportSummary && (
              <button
                onClick={onExportSummary}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
              >
                <Download size={14} />
                Doctor Consultation Summary
              </button>
            )}
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus size={14} />
              {isAdding ? 'Cancel' : 'Add Intervention'}
            </button>
          </div>
        </div>

        {/* Vital Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 block">Active Interventions</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeCount} <span className="text-xs font-normal text-slate-400">active items</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 block">Completed / Checked</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {completedCount} <span className="text-xs font-normal text-slate-400">goals achieved</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 block">Adherence & Protocol Score</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {averageCompliance}% <span className="text-xs font-normal text-slate-400">compliance rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Goal Modal / Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddGoal}
            className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 shadow-sm space-y-4 overflow-hidden"
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-indigo-600" />
              Add New Medical or Lifestyle Intervention
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Intervention Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Berberine 500mg before dinner, Red Light Therapy..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="Pharmacotherapy">Pharmacotherapy / Rx</option>
                  <option value="Nutrition">Nutrition & Fasting</option>
                  <option value="Physical Activity">Physical Activity</option>
                  <option value="Sleep & Recovery">Sleep & Recovery</option>
                  <option value="Biomarker Target">Biomarker Target</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Adherence Impact ({newImpact}%)
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={newImpact}
                  onChange={(e) => setNewImpact(Number(e.target.value))}
                  className="w-full mt-2 accent-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Details or Dosage Schedule
              </label>
              <input
                type="text"
                placeholder="e.g. Take with food, monitor resting heart rate in the morning..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Save Intervention
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'Pharmacotherapy', 'Nutrition', 'Physical Activity', 'Sleep & Recovery'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Goal Cards List */}
      <div className="space-y-3">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              goal.status === 'completed'
                ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 opacity-75'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleToggleStatus(goal.id)}
                className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  goal.status === 'completed'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                }`}
              >
                {goal.status === 'completed' && <CheckCircle2 size={16} />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    goal.priority === 'high'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
                  }`}>
                    {goal.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {goal.category}
                  </span>
                  {goal.evidenceGrade && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                      Evidence Grade: {goal.evidenceGrade}
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-bold ${
                  goal.status === 'completed'
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {goal.title}
                </h3>

                {goal.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {goal.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Impact Score</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {goal.impactPercentage}%
                </span>
              </div>

              <button
                onClick={() => handleDelete(goal.id)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                title="Remove Goal"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
