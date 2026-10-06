'use client';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  getMemberById, saveMember, calcEndDate, getWorkoutPlans, calcStatus, daysRemaining, formatDate
} from '@/lib/data';
import { MembershipPlan, Member } from '@/lib/types';

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileRef = useRef<HTMLInputElement>(null);

  const [member, setMember] = useState<Member | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', plan: 'Monthly' as MembershipPlan,
    startDate: '', photo: '', assignedPlanId: '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const plans = getWorkoutPlans();

  useEffect(() => {
    const m = getMemberById(id);
    if (!m) { router.push('/admin/members'); return; }
    setMember(m);
    setForm({
      name: m.name, phone: m.phone, plan: m.plan, startDate: m.startDate,
      photo: m.photo || '', assignedPlanId: m.assignedPlanId || '',
    });
  }, [id, router]);

  const endDate = form.startDate ? calcEndDate(form.startDate, form.plan) : '';
  const days = endDate ? daysRemaining(endDate) : 0;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Enter a valid 10-digit phone';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    saveMember({
      id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      plan: form.plan,
      startDate: form.startDate,
      endDate,
      status: calcStatus(endDate),
      photo: form.photo || undefined,
      assignedPlanId: form.assignedPlanId || undefined,
    });
    router.push('/admin/members');
  };

  const fieldCls = (key: string) =>
    `w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-colors ${errors[key] ? 'border-red-500' : 'border-[#2a2a2a] focus:border-accent'}`;

  if (!member) return <div className="text-gray-500 text-center py-20">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/members" className="text-gray-500 hover:text-white transition-colors">←</Link>
        <div>
          <h1 className="text-2xl font-black">Edit Member</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update {member.name}'s information</p>
        </div>
      </div>

      {/* Status banner */}
      <div className={`rounded-xl p-4 mb-6 flex items-center justify-between ${
        member.status === 'Active' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
      }`}>
        <div>
          <span className={`font-black text-sm ${member.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>
            {member.status === 'Active' ? '✅ Active Member' : '❌ Expired Member'}
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            End date: {formatDate(member.endDate)} · {days > 0 ? `${days} days remaining` : 'Expired'}
          </p>
        </div>
        {days <= 7 && days > 0 && (
          <span className="badge-warning text-xs px-3 py-1 rounded-full font-bold">Expiring Soon!</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-dashed border-[#2a2a2a] flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent transition-colors"
            onClick={() => fileRef.current?.click()}>
            {form.photo
              ? <img src={form.photo} alt="Preview" className="w-full h-full object-cover"/>
              : <span className="text-3xl text-accent font-black">{form.name.charAt(0) || '?'}</span>
            }
          </div>
          <div>
            <button type="button" onClick={() => fileRef.current?.click()} className="text-sm font-semibold text-accent hover:underline">
              Change Photo
            </button>
            {form.photo && (
              <button type="button" onClick={() => setForm(f => ({...f, photo: ''}))}
                className="ml-3 text-sm text-red-400 hover:underline">Remove</button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Full Name *</label>
            <input className={fieldCls('name')} type="text" value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Phone Number *</label>
            <input className={fieldCls('phone')} type="tel" value={form.phone}
              onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Plan</label>
              <select className={fieldCls('plan')} value={form.plan}
                onChange={e => setForm(f => ({...f, plan: e.target.value as MembershipPlan}))}>
                <option value="Monthly">Monthly (30 days)</option>
                <option value="Quarterly">Quarterly (90 days)</option>
                <option value="Yearly">Yearly (365 days)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Start Date</label>
              <input className={fieldCls('startDate')} type="date" value={form.startDate}
                onChange={e => setForm(f => ({...f, startDate: e.target.value}))}/>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">New End Date</span>
            <span className="text-accent font-black">{endDate}</span>
          </div>

          {plans.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Workout Plan</label>
              <select className={fieldCls('assignedPlanId')} value={form.assignedPlanId}
                onChange={e => setForm(f => ({...f, assignedPlanId: e.target.value}))}>
                <option value="">— No plan assigned —</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href="/admin/members"
            className="flex-1 py-3 rounded-lg border border-[#2a2a2a] text-sm font-bold text-gray-400 hover:border-gray-500 transition-all text-center">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 rounded-lg bg-accent text-black text-sm font-black uppercase tracking-wider hover:bg-[#2de010] transition-all btn-glow disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
