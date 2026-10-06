'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMembers, getDashboardStats, daysRemaining, formatDate } from '@/lib/data';
import { Member } from '@/lib/types';

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className={`bg-[#111] border rounded-xl p-6 flex items-center gap-4 ${color}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, expiringThisWeek: 0 });

  useEffect(() => {
    const m = getMembers();
    setMembers(m);
    setStats(getDashboardStats());
  }, []);

  const expiringSoon = members.filter(m => {
    const d = daysRemaining(m.endDate);
    return d > 0 && d <= 7;
  });

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of gym membership data</p>
        </div>
        <Link href="/admin/members/add"
          className="bg-accent text-black px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#2de010] transition-all btn-glow">
          + Add Member
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Members" value={stats.total} icon="👥" color="border-[#2a2a2a]"/>
        <StatCard label="Active Members" value={stats.active} icon="✅" color="border-green-500/30"/>
        <StatCard label="Expiring This Week" value={stats.expiringThisWeek} icon="⚠️" color="border-orange-500/30"/>
        <StatCard label="Expired" value={stats.expired} icon="❌" color="border-red-500/30"/>
      </div>

      {/* Expiring Alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {expiringSoon.length}
            </span>
            <h3 className="font-bold text-orange-400 uppercase tracking-wide text-sm">
              Memberships Expiring Within 7 Days
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiringSoon.map(m => (
              <Link key={m.id} href={`/admin/members/${m.id}/edit`}
                className="bg-[#111] rounded-lg p-3 flex items-center justify-between hover:border-orange-400 border border-[#2a2a2a] transition-all group">
                <div>
                  <div className="font-bold text-sm group-hover:text-orange-400 transition-colors">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.phone} · {m.plan}</div>
                </div>
                <span className="badge-warning text-xs px-2 py-0.5 rounded-full font-bold">
                  {daysRemaining(m.endDate)}d left
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Members */}
      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <h2 className="font-bold">Recent Members</h2>
          <Link href="/admin/members" className="text-xs text-accent hover:underline">View all →</Link>
        </div>
        {recentMembers.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-semibold">No members yet</p>
            <Link href="/admin/members/add" className="text-accent text-sm hover:underline mt-2 inline-block">Add your first member →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0d0d0d] text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  {['Name','Phone','Plan','Status','Days Left','Start Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {recentMembers.map(m => {
                  const days = daysRemaining(m.endDate);
                  return (
                    <tr key={m.id} className="table-row-hover transition-colors">
                      <td className="px-6 py-4 font-semibold">{m.name}</td>
                      <td className="px-6 py-4 text-gray-400">{m.phone}</td>
                      <td className="px-6 py-4 text-gray-400">{m.plan}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${days <= 7 && days > 0 ? 'text-orange-400' : days <= 0 ? 'text-red-400' : 'text-white'}`}>
                          {days > 0 ? `${days}d` : 'Expired'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(m.startDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
