'use client';

import { useEffect, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api';

const CATEGORIES = ['', 'AUTH', 'PROFILE', 'PAYMENT', 'ADMIN', 'SUBSCRIPTION', 'SYSTEM'];
const LEVELS     = ['', 'INFO', 'WARNING', 'ERROR'];

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  AUTH:         { icon: '🔐', color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-100'   },
  PROFILE:      { icon: '👤', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  PAYMENT:      { icon: '💳', color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-100' },
  ADMIN:        { icon: '🛠️', color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-100'  },
  SUBSCRIPTION: { icon: '📦', color: 'text-cyan-600',   bg: 'bg-cyan-50 border-cyan-100'    },
  SYSTEM:       { icon: '⚙️', color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-100'    },
};

const LEVEL_META: Record<string, { badge: string }> = {
  INFO:    { badge: 'bg-[#EAF2EE] text-[#1C3B35]' },
  WARNING: { badge: 'bg-amber-100 text-amber-700'  },
  ERROR:   { badge: 'bg-red-100 text-red-700'       },
};

const ACTION_LABEL: Record<string, string> = {
  USER_REGISTERED:       'User Registered',
  USER_LOGIN:            'User Logged In',
  PASSWORD_RESET:        'Password Reset',
  PROFILE_CREATED:       'Profile Created',
  PROFILE_UPDATED:       'Profile Updated',
  PROFILE_DELETED:       'Profile Deleted',
  PAYMENT_APPROVED:      'Payment Approved',
  PAYMENT_REJECTED:      'Payment Rejected',
  ADMIN_USER_CREATED:    'User Created by Admin',
  ADMIN_PASSWORD_CHANGED:'Password Changed by Admin',
  SUBSCRIPTION_EXPIRED:  'Subscription Expired',
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className={`text-2xl font-bold font-poppins ${color}`}>{value.toLocaleString()}</p>
        <p className="text-[12px] text-gray-400 font-poppins">{label}</p>
      </div>
    </div>
  );
}

export default function ActivityLogPage() {
  const [logs,      setLogs]      = useState<any[]>([]);
  const [meta,      setMeta]      = useState({ total: 0, page: 1, limit: 50, pages: 1 });
  const [stats,     setStats]     = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState('');
  const [level,     setLevel]     = useState('');
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);

  const token = typeof window !== 'undefined' ? localStorage.getItem('mn_token') : '';

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (category) params.set('category', category);
    if (level)    params.set('level', level);
    if (search)   params.set('search', search);
    try {
      const r = await fetch(`${API}/admin/activity-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setLogs(d.data ?? []);
      setMeta(d.meta ?? { total: 0, page: 1, limit: 50, pages: 1 });
    } catch { setLogs([]); }
    finally   { setLoading(false); }
  }, [page, category, level, search, token]);

  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/activity-logs/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setStats(d.data);
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => { fetchLogs(); fetchStats(); }, [fetchLogs, fetchStats]);

  // Stats helpers
  const total24h = stats?.recentCount ?? 0;
  const errCount = stats?.byLevel?.find((l: any) => l.level === 'ERROR')?._count?.id ?? 0;
  const warnCount = stats?.byLevel?.find((l: any) => l.level === 'WARNING')?._count?.id ?? 0;

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#121514]">Activity Log</h1>
          <p className="text-gray-400 text-sm mt-0.5">Centralised audit trail of all system events</p>
        </div>
        <button
          onClick={() => { fetchLogs(); fetchStats(); }}
          className="flex items-center gap-2 bg-[#1C3B35] hover:bg-[#15302a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Last 24h Events" value={total24h} icon="⚡" color="text-[#1C3B35]" />
        <StatCard label="Total Events"     value={meta.total} icon="📋" color="text-blue-600" />
        <StatCard label="Warnings"         value={warnCount} icon="⚠️" color="text-amber-600" />
        <StatCard label="Errors"           value={errCount}  icon="🚨" color="text-red-600" />
      </div>

      {/* Category breakdown pills */}
      {stats?.byCategory && (
        <div className="flex flex-wrap gap-2">
          {(stats.byCategory as any[]).map((c: any) => {
            const m = CATEGORY_META[c.category] ?? { icon: '📌', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-100' };
            return (
              <button
                key={c.category}
                onClick={() => { setCategory(c.category === category ? '' : c.category); setPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition ${
                  category === c.category ? 'bg-[#1C3B35] text-white border-[#1C3B35]' : `${m.bg} ${m.color}`
                }`}
              >
                <span>{m.icon}</span> {c.category} <span className="opacity-70">({c._count.id})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Search action, email, entity…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-[#1C3B35] transition"
            />
          </div>
          {/* Category */}
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#1C3B35] appearance-none transition"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
          {/* Level */}
          <select
            value={level}
            onChange={e => { setLevel(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#1C3B35] appearance-none transition"
          >
            {LEVELS.map(l => <option key={l} value={l}>{l || 'All Levels'}</option>)}
          </select>
        </div>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-gray-600">
            {loading ? 'Loading…' : `${meta.total.toLocaleString()} events`}
          </p>
          <p className="text-[12px] text-gray-400">Page {meta.page} of {meta.pages}</p>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-50 rounded w-2/3" />
                </div>
                <div className="h-3 bg-gray-50 rounded w-16" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300">
            <span className="text-5xl mb-3">🗒️</span>
            <p className="font-semibold text-gray-400">No activity logs found</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log: any) => {
              const cat   = CATEGORY_META[log.category] ?? { icon: '📌', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-100' };
              const lvl   = LEVEL_META[log.level]       ?? { badge: 'bg-gray-100 text-gray-600' };
              const label = ACTION_LABEL[log.action] ?? log.action.replace(/_/g, ' ');
              return (
                <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/60 transition group">
                  {/* Category icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 text-sm ${cat.bg}`}>
                    {cat.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#121514]">{label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lvl.badge}`}>{log.level}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color}`}>{log.category}</span>
                    </div>
                    {log.entityLabel && (
                      <p className="text-[12px] text-gray-500 mt-0.5 truncate">
                        <span className="text-gray-300 mr-1">Entity:</span> {log.entityLabel}
                      </p>
                    )}
                    {log.actorEmail && (
                      <p className="text-[12px] text-gray-400 mt-0.5">
                        <span className="text-gray-300 mr-1">By:</span>
                        <span className="font-medium text-[#1C3B35]">{log.actorEmail}</span>
                        {log.actorRole && <span className="ml-1 text-gray-300">({log.actorRole})</span>}
                      </p>
                    )}
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <p className="text-[11px] text-gray-300 mt-0.5 font-mono truncate">
                        {JSON.stringify(log.meta)}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-gray-400">{fmtTime(log.createdAt)}</p>
                    <p className="text-[10px] text-gray-200 mt-0.5">{new Date(log.createdAt).toLocaleTimeString('en-GB', { hour12: false })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition"
            >
              ← Previous
            </button>
            <span className="text-[12px] text-gray-400">Page {page} / {meta.pages}</span>
            <button
              disabled={page >= meta.pages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
