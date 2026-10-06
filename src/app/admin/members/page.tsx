'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getMembers, deleteMember, daysRemaining, formatDate } from '@/lib/data';
import { Member } from '@/lib/types';

type SortKey = 'name' | 'plan' | 'status' | 'endDate';
type SortDir = 'asc' | 'desc';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Expired'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => setMembers(getMembers()), []);
  useEffect(() => { load(); }, [load]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const confirmDelete = (id: string) => {
    deleteMember(id);
    setDeleteId(null);
    load();
  };

  const filtered = members
    .filter(m => {
      const q = search.toLowerCase();
      const matchesSearch = m.name.toLowerCase().includes(q) || m.phone.includes(q);
      const matchesFilter = filter === 'All' || m.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let av = a[sortKey] as string;
      let bv = b[sortKey] as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className={`ml-1 text-xs ${sortKey === k ? 'text-accent' : 'text-gray-600'}`}>
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {members.length} members</p>
        </div>
        <Link href="/admin/members/add"
          className="inline-flex items-center gap-2 bg-accent text-black px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#2de010] transition-all btn-glow">
          <span>+</span> Add Member
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent focus:outline-none transition-colors"
        />
        <div className="flex gap-2">
          {(['All','Active','Expired'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === f ? 'bg-accent text-black' : 'bg-[#111] border border-[#2a2a2a] text-gray-400 hover:border-accent hover:text-accent'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold">No members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0d0d0d] text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left w-10">#</th>
                  {[
                    { label: 'Name', key: 'name' as SortKey },
                    { label: 'Phone', key: null },
                    { label: 'Plan', key: 'plan' as SortKey },
                    { label: 'Status', key: 'status' as SortKey },
                    { label: 'End Date', key: 'endDate' as SortKey },
                    { label: 'Days Left', key: null },
                    { label: 'Actions', key: null },
                  ].map(h => (
                    <th key={h.label}
                      className={`px-4 py-3 text-left font-semibold ${h.key ? 'cursor-pointer select-none hover:text-white transition-colors' : ''}`}
                      onClick={() => h.key && handleSort(h.key)}>
                      {h.label}{h.key && <SortIcon k={h.key}/>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filtered.map((m, i) => {
                  const days = daysRemaining(m.endDate);
                  const isExpiringSoon = days > 0 && days <= 7;
                  return (
                    <tr key={m.id} className={`table-row-hover transition-colors ${isExpiringSoon ? 'bg-orange-500/5' : ''}`}>
                      <td className="px-4 py-4 text-gray-600 text-xs">{i + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs font-bold text-accent overflow-hidden flex-shrink-0">
                            {m.photo
                              ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover"/>
                              : m.name.charAt(0).toUpperCase()
                            }
                          </div>
                          <div>
                            <div className="font-semibold text-white">{m.name}</div>
                            {isExpiringSoon && <div className="text-xs text-orange-400">⚠ Expiring soon</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400">{m.phone}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          m.plan === 'Monthly' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          m.plan === 'Quarterly' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {m.plan}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs">{formatDate(m.endDate)}</td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold ${
                          days <= 0 ? 'text-red-400' :
                          days <= 7 ? 'text-orange-400' :
                          'text-white'
                        }`}>
                          {days > 0 ? `${days}d` : 'Expired'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/members/${m.id}/edit`}
                            className="text-xs px-3 py-1.5 rounded bg-[#1a1a1a] text-gray-300 hover:bg-accent hover:text-black transition-all font-semibold">
                            Edit
                          </Link>
                          <button onClick={() => setDeleteId(m.id)}
                            className="text-xs px-3 py-1.5 rounded bg-[#1a1a1a] text-red-400 hover:bg-red-500/20 transition-all font-semibold">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-black mb-2">Delete Member?</h3>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone. The member record will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-[#2a2a2a] text-sm font-bold text-gray-400 hover:border-gray-500 transition-all">
                Cancel
              </button>
              <button onClick={() => confirmDelete(deleteId)}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
