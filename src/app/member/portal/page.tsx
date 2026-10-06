'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMemberById, getWorkoutPlanById, daysRemaining, formatDate } from '@/lib/data';
import { Member, WorkoutPlan, DayOfWeek } from '@/lib/types';

const DAY_ORDER: DayOfWeek[] = [
  'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
];

export default function MemberPortalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('member_id');
    if (!id) { router.replace('/member'); return; }
    const m = getMemberById(id);
    if (!m) { router.replace('/member'); return; }
    setMember(m);
    if (m.assignedPlanId) {
      const wp = getWorkoutPlanById(m.assignedPlanId);
      setPlan(wp || null);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('member_id');
    router.push('/member');
  };

  if (!member) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  );

  const days = daysRemaining(member.endDate);
  const isActive = member.status === 'Active';
  const isExpiringSoon = days > 0 && days <= 7;

  // get today's day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
  const todayPlan = plan?.days.find(d => d.day === today);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0d0d0d] border-b border-[#1a1a1a] px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black">
          IRON<span className="text-accent">PEAK</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">{member.name}</span>
          <button onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors font-semibold uppercase tracking-wide">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden text-2xl font-black text-accent border-2 border-accent/30">
            {member.photo
              ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover"/>
              : member.name.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Welcome back</p>
            <h1 className="text-2xl font-black">{member.name}</h1>
          </div>
        </div>

        {/* Status card */}
        <div className={`rounded-2xl p-6 border-2 ${
          !isActive ? 'border-red-500/40 bg-red-500/5' :
          isExpiringSoon ? 'border-orange-500/40 bg-orange-500/5' :
          'border-accent/40 bg-accent/5'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg font-black ${
                  !isActive ? 'text-red-400' : isExpiringSoon ? 'text-orange-400' : 'text-accent'
                }`}>
                  {!isActive ? '❌ Membership Expired' : isExpiringSoon ? '⚠️ Expiring Soon' : '✅ Active Membership'}
                </span>
              </div>
              <p className="text-sm text-gray-400">{member.plan} Plan</p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-black ${
                !isActive ? 'text-red-400' : isExpiringSoon ? 'text-orange-400' : 'text-accent'
              }`}>
                {days > 0 ? days : 0}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Days Remaining</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-600 uppercase tracking-widest mb-0.5">Start Date</div>
              <div className="font-semibold">{formatDate(member.startDate)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase tracking-widest mb-0.5">End Date</div>
              <div className="font-semibold">{formatDate(member.endDate)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase tracking-widest mb-0.5">Phone</div>
              <div className="font-semibold">{member.phone}</div>
            </div>
          </div>

          {!isActive && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-red-300">Your membership has expired. Please visit the front desk to renew.</p>
              <a href="/#pricing" className="inline-block mt-2 text-accent text-sm font-bold hover:underline">
                View Plans →
              </a>
            </div>
          )}
        </div>

        {/* Today's workout highlight */}
        {todayPlan && plan && (
          <div className="bg-[#111] border border-accent/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{todayPlan.icon}</span>
              <div>
                <div className="text-xs text-accent font-bold uppercase tracking-widest">Today — {today}</div>
                <div className="text-xl font-black">{todayPlan.focus}</div>
              </div>
            </div>
            <div className="space-y-2">
              {todayPlan.exercises.map(ex => (
                <div key={ex.id} className="flex items-center justify-between bg-[#0a0a0a] rounded-lg px-4 py-2.5">
                  <span className="text-sm font-semibold">{ex.name}</span>
                  <span className="text-xs text-accent font-bold">{ex.sets} × {ex.reps}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full week plan */}
        {plan ? (
          <div>
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <span>🗓</span> Weekly Workout Plan
              <span className="text-xs font-normal text-gray-500 ml-1">— {plan.name}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DAY_ORDER.map(dayName => {
                const dayPlan = plan.days.find(d => d.day === dayName);
                if (!dayPlan) return null;
                const isToday = dayName === today;
                return (
                  <div key={dayName}
                    className={`rounded-xl border transition-all duration-200 ${
                      isToday ? 'border-accent bg-accent/5' : 'border-[#1a1a1a] bg-[#111]'
                    }`}>
                    <button
                      onClick={() => setExpandedDay(expandedDay === dayName ? null : dayName)}
                      className="w-full flex items-center justify-between p-4 text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{dayPlan.icon}</span>
                        <div>
                          <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-accent' : 'text-gray-400'}`}>
                            {dayName} {isToday && '· Today'}
                          </div>
                          <div className="font-bold text-sm mt-0.5">{dayPlan.focus}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">{dayPlan.exercises.length} exercises</span>
                        <span className={`text-gray-500 text-xs transition-transform duration-200 ${expandedDay === dayName ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>
                    {expandedDay === dayName && (
                      <div className="px-4 pb-4 space-y-2 border-t border-[#1a1a1a] pt-3">
                        {dayPlan.exercises.map(ex => (
                          <div key={ex.id} className="flex items-center justify-between bg-[#0a0a0a] rounded-lg px-3 py-2">
                            <span className="text-sm">{ex.name}</span>
                            <span className="text-xs text-accent font-bold">{ex.sets} × {ex.reps}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🏋️</div>
            <h3 className="font-bold mb-1">No Workout Plan Assigned</h3>
            <p className="text-sm text-gray-500">Ask your trainer at the front desk to assign a weekly workout plan to your account.</p>
          </div>
        )}

        {/* Contact */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">Need help?</div>
            <div className="text-xs text-gray-500 mt-0.5">Contact our team for any queries about your membership</div>
          </div>
          <div className="flex gap-3">
            <a href="tel:+919876543210"
              className="text-sm font-bold text-accent border border-accent/30 px-4 py-2 rounded-lg hover:bg-accent/10 transition-all">
              📞 Call Us
            </a>
            <a href="/#contact"
              className="text-sm font-bold text-gray-400 border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-gray-500 transition-all">
              Contact
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
