"use client";
import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calendar, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { VitalRecord } from '../types';

const INITIAL_VITALS: VitalRecord[] = [
  { date: 'May 01', activityScore: 78, sleepHours: 7.2, restingHeartRate: 58, stressIndex: 28, hrv: 62, complianceRate: 85 },
  { date: 'May 02', activityScore: 82, sleepHours: 7.8, restingHeartRate: 56, stressIndex: 22, hrv: 68, complianceRate: 90 },
  { date: 'May 03', activityScore: 85, sleepHours: 8.0, restingHeartRate: 55, stressIndex: 20, hrv: 72, complianceRate: 95 },
  { date: 'May 04', activityScore: 80, sleepHours: 6.9, restingHeartRate: 59, stressIndex: 32, hrv: 58, complianceRate: 80 },
  { date: 'May 05', activityScore: 88, sleepHours: 8.2, restingHeartRate: 54, stressIndex: 18, hrv: 75, complianceRate: 95 },
  { date: 'May 06', activityScore: 91, sleepHours: 8.4, restingHeartRate: 53, stressIndex: 16, hrv: 80, complianceRate: 100 },
  { date: 'May 07', activityScore: 89, sleepHours: 7.9, restingHeartRate: 54, stressIndex: 19, hrv: 76, complianceRate: 95 }
];

export function HealthVitalsDashboard() {
  const [vitalsData, setVitalsData] = useState<VitalRecord[]>(INITIAL_VITALS);
  const [selectedMetric, setSelectedMetric] = useState<'activityScore' | 'sleepHours' | 'restingHeartRate' | 'hrv' | 'stressIndex'>('activityScore');
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);

  // Form states
  const [logActivity, setLogActivity] = useState(85);
  const [logSleep, setLogSleep] = useState(7.8);
  const [logRHR, setLogRHR] = useState(55);
  const [logHRV, setLogHRV] = useState(70);

  const latest = vitalsData[vitalsData.length - 1];

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newRecord: VitalRecord = {
      date: dateStr,
      activityScore: logActivity,
      sleepHours: logSleep,
      restingHeartRate: logRHR,
      stressIndex: Math.max(10, Math.round(100 - logHRV)),
      hrv: logHRV,
      complianceRate: 90
    };

    setVitalsData([...vitalsData, newRecord]);
    setIsLoggingModalOpen(false);
  };

  const metricConfigs = {
    activityScore: {
      label: 'Vitality & Activity Index',
      color: '#4f46e5',
      unit: '/ 100',
      description: 'Composite score evaluating movement, metabolic exertion, and physical readiness.'
    },
    sleepHours: {
      label: 'Sleep Duration & Architecture',
      color: '#0ea5e9',
      unit: 'hrs',
      description: 'Total restorative sleep synced with circadian rhythms.'
    },
    restingHeartRate: {
      label: 'Resting Heart Rate (RHR)',
      color: '#10b981',
      unit: 'bpm',
      description: 'Basal resting cardiovascular rate during nocturnal recovery.'
    },
    hrv: {
      label: 'Heart Rate Variability (HRV)',
      color: '#8b5cf6',
      unit: 'ms',
      description: 'Key indicator of autonomic nervous system resilience and parasympathetic tone.'
    },
    stressIndex: {
      label: 'Physiological Stress Index',
      color: '#f59e0b',
      unit: '/ 100',
      description: 'Calculated physiological strain marker.'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Activity size={16} />
              Biometric & Health Telemetry
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Continuous Vitality & Recovery Tracking
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live biometric signals, nocturnal recovery trends, and autonomic stability metrics.
            </p>
          </div>

          <button
            onClick={() => setIsLoggingModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start md:self-auto"
          >
            <Plus size={15} />
            Log Daily Vitals
          </button>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div
            onClick={() => setSelectedMetric('activityScore')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'activityScore'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Vitality Index</span>
              <Activity size={14} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {latest.activityScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              +5% this week (Optimal)
            </div>
          </div>

          <div
            onClick={() => setSelectedMetric('sleepHours')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'sleepHours'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Restorative Sleep</span>
              <Moon size={14} className="text-sky-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {latest.sleepHours} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              +45 mins deep sleep
            </div>
          </div>

          <div
            onClick={() => setSelectedMetric('restingHeartRate')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'restingHeartRate'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Resting Heart Rate</span>
              <Heart size={14} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {latest.restingHeartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingDown size={12} />
              -2 bpm (Cardio conditioning)
            </div>
          </div>

          <div
            onClick={() => setSelectedMetric('hrv')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'hrv'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Autonomic HRV</span>
              <Zap size={14} className="text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {latest.hrv} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
              <ShieldCheck size={12} />
              Strong parasympathetic tone
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {metricConfigs[selectedMetric].label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {metricConfigs[selectedMetric].description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Timeline: Last 7 Days</span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vitalsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfigs[selectedMetric].color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metricConfigs[selectedMetric].color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={metricConfigs[selectedMetric].color}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#vitalGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Log Modal */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-indigo-600" />
              Log Daily Health Vitals
            </h3>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vitality & Energy Score (0 - 100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={logActivity}
                  onChange={(e) => setLogActivity(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hours of Sleep
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="16"
                  value={logSleep}
                  onChange={(e) => setLogSleep(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resting HR (bpm)
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="140"
                    value={logRHR}
                    onChange={(e) => setLogRHR(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HRV (ms)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={logHRV}
                    onChange={(e) => setLogHRV(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLoggingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
