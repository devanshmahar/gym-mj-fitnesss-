'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getWorkoutPlans, saveWorkoutPlan, deleteWorkoutPlan, generateId, DEFAULT_WORKOUT_PLAN
} from '@/lib/data';
import { WorkoutPlan, DayPlan, Exercise, DayOfWeek } from '@/lib/types';

const DAY_COLORS: Record<DayOfWeek, string> = {
  Monday:    'border-blue-500/40 hover:border-blue-400',
  Tuesday:   'border-purple-500/40 hover:border-purple-400',
  Wednesday: 'border-yellow-500/40 hover:border-yellow-400',
  Thursday:  'border-red-500/40 hover:border-red-400',
  Friday:    'border-green-500/40 hover:border-green-400',
  Saturday:  'border-orange-500/40 hover:border-orange-400',
  Sunday:    'border-gray-500/40 hover:border-gray-400',
};

function ExerciseRow({
  ex, onUpdate, onDelete
}: { ex: Exercise; onUpdate: (updated: Exercise) => void; onDelete: () => void }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center text-sm">
      <input className="col-span-5 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-white text-xs focus:border-accent focus:outline-none"
        value={ex.name} placeholder="Exercise name"
        onChange={e => onUpdate({...ex, name: e.target.value})}/>
      <input className="col-span-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-white text-xs focus:border-accent focus:outline-none text-center"
        value={ex.sets} type="number" placeholder="Sets" min={1}
        onChange={e => onUpdate({...ex, sets: +e.target.value})}/>
      <input className="col-span-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-white text-xs focus:border-accent focus:outline-none"
        value={ex.reps} placeholder="Reps"
        onChange={e => onUpdate({...ex, reps: e.target.value})}/>
      <button onClick={onDelete}
        className="col-span-2 text-red-400 hover:text-red-300 text-xs font-bold text-center">✕</button>
    </div>
  );
}

function DayCard({ day, onUpdate }: { day: DayPlan; onUpdate: (d: DayPlan) => void }) {
  const [expanded, setExpanded] = useState(false);

  const addExercise = () => onUpdate({
    ...day,
    exercises: [...day.exercises, { id: generateId(), name: '', sets: 3, reps: '10-12' }]
  });

  const updateEx = (idx: number, ex: Exercise) => {
    const exercises = [...day.exercises];
    exercises[idx] = ex;
    onUpdate({ ...day, exercises });
  };

  const deleteEx = (idx: number) => {
    onUpdate({ ...day, exercises: day.exercises.filter((_, i) => i !== idx) });
  };

  return (
    <div className={`bg-[#111] border-2 rounded-xl transition-all duration-200 ${DAY_COLORS[day.day]}`}>
      {/* Header */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{day.icon}</span>
          <div>
            <div className="font-black text-sm uppercase tracking-wide">{day.day}</div>
            <div className="text-xs text-gray-400 mt-0.5">{day.focus}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{day.exercises.length} exercises</span>
          <span className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-[#1a1a1a] pt-4">
          {/* Focus edit */}
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-xs focus:border-accent focus:outline-none"
              value={day.focus} placeholder="Day focus (e.g. Chest & Triceps)"
              onChange={e => onUpdate({...day, focus: e.target.value})}/>
            <input
              className="w-14 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-center text-sm focus:border-accent focus:outline-none"
              value={day.icon} placeholder="🏋️"
              onChange={e => onUpdate({...day, icon: e.target.value})}/>
          </div>

          {/* Column headers */}
          {day.exercises.length > 0 && (
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 uppercase tracking-widest px-0.5">
              <div className="col-span-5">Exercise</div>
              <div className="col-span-2 text-center">Sets</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-2 text-center">Del</div>
            </div>
          )}

          {day.exercises.map((ex, i) => (
            <ExerciseRow key={ex.id} ex={ex}
              onUpdate={updated => updateEx(i, updated)}
              onDelete={() => deleteEx(i)}/>
          ))}

          <button onClick={addExercise}
            className="text-xs text-accent hover:underline font-semibold mt-2">
            + Add Exercise
          </button>
        </div>
      )}
    </div>
  );
}

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [editing, setEditing] = useState<WorkoutPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [showNewPlan, setShowNewPlan] = useState(false);

  useEffect(() => {
    const p = getWorkoutPlans();
    setPlans(p);
    if (p.length > 0 && !selectedId) {
      setSelectedId(p[0].id);
      setEditing(JSON.parse(JSON.stringify(p[0])));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPlan = (id: string) => {
    const p = plans.find(p => p.id === id);
    if (p) { setSelectedId(id); setEditing(JSON.parse(JSON.stringify(p))); setSaved(false); }
  };

  const updateDay = (idx: number, day: DayPlan) => {
    if (!editing) return;
    const days = [...editing.days];
    days[idx] = day;
    setEditing({...editing, days});
    setSaved(false);
  };

  const handleSave = () => {
    if (!editing) return;
    saveWorkoutPlan(editing);
    setPlans(getWorkoutPlans());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNewPlan = () => {
    if (!newPlanName.trim()) return;
    const plan: WorkoutPlan = {
      ...DEFAULT_WORKOUT_PLAN,
      id: generateId(),
      name: newPlanName.trim(),
      createdAt: new Date().toISOString(),
    };
    saveWorkoutPlan(plan);
    const updated = getWorkoutPlans();
    setPlans(updated);
    setSelectedId(plan.id);
    setEditing(JSON.parse(JSON.stringify(plan)));
    setNewPlanName('');
    setShowNewPlan(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this workout plan?')) return;
    deleteWorkoutPlan(id);
    const updated = getWorkoutPlans();
    setPlans(updated);
    if (selectedId === id) {
      if (updated.length > 0) { setSelectedId(updated[0].id); setEditing(JSON.parse(JSON.stringify(updated[0]))); }
      else { setSelectedId(''); setEditing(null); }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Workout Plans</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage weekly workout schedules for your members</p>
        </div>
        <button onClick={() => setShowNewPlan(true)}
          className="inline-flex items-center gap-2 bg-accent text-black px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#2de010] transition-all btn-glow">
          + New Plan
        </button>
      </div>

      {/* Plan selector */}
      {plans.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {plans.map(p => (
            <div key={p.id} className={`flex items-center gap-1 rounded-full border text-sm font-semibold transition-all ${
              selectedId === p.id ? 'bg-accent text-black border-accent' : 'bg-[#111] border-[#2a2a2a] text-gray-400 hover:border-accent hover:text-accent'
            }`}>
              <button onClick={() => selectPlan(p.id)} className="px-4 py-1.5">{p.name}</button>
              {selectedId !== p.id && (
                <button onClick={() => handleDelete(p.id)}
                  className="pr-3 text-xs opacity-50 hover:opacity-100 hover:text-red-400 transition-all">✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Plan editor */}
      {editing ? (
        <div className="space-y-4">
          {/* Plan name */}
          <div className="flex items-center gap-4">
            <input
              className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent focus:outline-none font-bold"
              value={editing.name}
              onChange={e => { setEditing({...editing, name: e.target.value}); setSaved(false); }}
              placeholder="Plan name"/>
            <button onClick={handleSave}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                saved ? 'bg-green-500 text-white' : 'bg-accent text-black hover:bg-[#2de010] btn-glow'
              }`}>
              {saved ? '✓ Saved!' : 'Save Plan'}
            </button>
            <button onClick={() => handleDelete(selectedId)}
              className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all">
              Delete
            </button>
          </div>

          {/* Day cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {editing.days.map((day, i) => (
              <DayCard key={day.day} day={day} onUpdate={d => updateDay(i, d)}/>
            ))}
          </div>

          <div className="text-xs text-gray-600">
            💡 Click any day card to expand and edit exercises. Assign this plan to members from the{' '}
            <Link href="/admin/members" className="text-accent hover:underline">Members page</Link>.
          </div>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🏋️</div>
          <h3 className="text-xl font-bold mb-2">No Workout Plans Yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first workout plan to assign to members.</p>
          <button onClick={() => setShowNewPlan(true)}
            className="bg-accent text-black px-6 py-2.5 rounded-lg font-bold uppercase tracking-wide hover:bg-[#2de010] transition-all">
            Create First Plan
          </button>
        </div>
      )}

      {/* New plan modal */}
      {showNewPlan && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-black mb-4">New Workout Plan</h3>
            <input
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none mb-4"
              value={newPlanName} onChange={e => setNewPlanName(e.target.value)}
              placeholder="e.g. Beginner 8-Week Plan" autoFocus
              onKeyDown={e => e.key === 'Enter' && handleNewPlan()}/>
            <div className="flex gap-3">
              <button onClick={() => setShowNewPlan(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#2a2a2a] text-sm font-bold text-gray-400">Cancel</button>
              <button onClick={handleNewPlan}
                className="flex-1 py-2.5 rounded-lg bg-accent text-black text-sm font-black hover:bg-[#2de010] transition-all">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
