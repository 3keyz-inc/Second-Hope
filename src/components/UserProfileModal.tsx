"use client";
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Target, 
  Bookmark, 
  Calendar, 
  Check, 
  LogOut,
  Sparkles,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function UserProfileModal({ 
  isOpen, 
  onClose,
  onOpenAdmin
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onOpenAdmin?: () => void;
}) {
  const { user, updateProfile, logout, switchRole } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [primaryGoal, setPrimaryGoal] = useState(user?.primaryGoal || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, bio, primaryGoal });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-12 h-12 rounded-2xl border-2 border-indigo-500 object-cover shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.role === 'admin'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                }`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Toggle Bar (Instant Demo Capability) */}
        <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-indigo-950 dark:text-indigo-200">Active Role Mode:</div>
            <div className="text-[11px] text-indigo-700 dark:text-indigo-400">
              Toggle to test User vs Admin access control.
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <button
              onClick={() => switchRole('user')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                user.role === 'user'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              User
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                user.role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Primary Clinical / Health Goal
            </label>
            <input
              type="text"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              placeholder="e.g. Oncology clinical trial search & longevity telemetry"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Professional Bio & Research Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Saved Trials</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {user.savedTrialIds?.length || 0} Bookmarked
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Tracked Biomarkers</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {user.savedBiomarkerIds?.length || 0} Monitored
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>

            <div className="flex items-center gap-2">
              {user.role === 'admin' && onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <ShieldAlert size={14} />
                  Open Admin Portal
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {isSaved ? <Check size={14} className="text-emerald-300" /> : null}
                <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
