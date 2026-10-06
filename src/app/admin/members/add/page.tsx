'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  saveMember, calcEndDate, generateId, getWorkoutPlans, calcStatus
} from '@/lib/data';
import { MembershipPlan } from '@/lib/types';

export default function AddMemberPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const plans = getWorkoutPlans();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    plan: 'Monthly' as MembershipPlan,
    startDate: new Date().toISOString().split('T')[0],
    photo: '',
    assignedPlanId: '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const endDate = calcEndDate(form.startDate, form.plan);

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
    if (!form.startDate) errs.startDate = 'Start date is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    saveMember({
      id: generateId(),
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

  const field = (key: string) => ({
    className: `w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition-colors ${errors[key] ? 'border-red-500' : 'border-[#2a2a2a] focus:border-accent'}`
  });

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/members" className="text-gray-500 hover:text-white transition-colors">←</Link>
        <div>
          <h1 className="text-2xl font-black">Add New Member</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to register a new member</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo upload */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-dashed border-[#2a2a2a] flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent transition-colors"
            onClick={() => fileRef.current?.click()}>
            {form.photo
              ? <img src={form.photo} alt="Preview" className="w-full h-full object-cover"/>
              : <span className="text-3xl">👤</span>
            }
          </div>
          <div>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-accent hover:underline">
              Upload Photo (optional)
            </button>
            <p className="text-xs text-gray-600 mt-0.5">JPG, PNG up to 5MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Full Name *</label>
            <input {...field('name')} type="text" placeholder="e.g. Rahul Sharma" value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Phone Number *</label>
            <input {...field('phone')} type="tel" placeholder="10-digit mobile number" value={form.phone}
              onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Plan + Start Date in row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Membership Plan *</label>
              <select {...field('plan')} value={form.plan}
                onChange={e => setForm(f => ({...f, plan: e.target.value as MembershipPlan}))}>
                <option value="Monthly">Monthly (30 days)</option>
                <option value="Quarterly">Quarterly (90 days)</option>
                <option value="Yearly">Yearly (365 days)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Start Date *</label>
              <input {...field('startDate')} type="date" value={form.startDate}
                onChange={e => setForm(f => ({...f, startDate: e.target.value}))}/>
              {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
            </div>
          </div>

          {/* End date (auto) */}
          <div className="bg-[#0a0a0a] rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Auto-Calculated End Date</span>
            <span className="text-accent font-black">{endDate}</span>
          </div>

          {/* Workout Plan */}
          {plans.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Assign Workout Plan</label>
              <select {...field('assignedPlanId')} value={form.assignedPlanId}
                onChange={e => setForm(f => ({...f, assignedPlanId: e.target.value}))}>
                <option value="">— No plan assigned —</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/admin/members"
            className="flex-1 py-3 rounded-lg border border-[#2a2a2a] text-sm font-bold text-gray-400 hover:border-gray-500 transition-all text-center">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 rounded-lg bg-accent text-black text-sm font-black uppercase tracking-wider hover:bg-[#2de010] transition-all btn-glow disabled:opacity-50">
            {saving ? 'Saving...' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
