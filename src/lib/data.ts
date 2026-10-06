import { Member, MembershipPlan, WorkoutPlan, DayOfWeek } from './types';

// ─── Plan Duration (days) ──────────────────────────────────────────────────
export const PLAN_DAYS: Record<MembershipPlan, number> = {
  Monthly: 30,
  Quarterly: 90,
  Yearly: 365,
};

export const PLAN_PRICES: Record<MembershipPlan, number> = {
  Monthly: 1499,
  Quarterly: 3999,
  Yearly: 11999,
};

// ─── Date Helpers ──────────────────────────────────────────────────────────
export function calcEndDate(startDate: string, plan: MembershipPlan): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + PLAN_DAYS[plan]);
  return d.toISOString().split('T')[0];
}

export function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function calcStatus(endDate: string): 'Active' | 'Expired' {
  return daysRemaining(endDate) > 0 ? 'Active' : 'Expired';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── LocalStorage Keys ─────────────────────────────────────────────────────
const MEMBERS_KEY = 'gym_members';
const PLANS_KEY = 'gym_workout_plans';
const AUTH_KEY = 'gym_admin_auth';

function isBrowser() { return typeof window !== 'undefined'; }

// ─── Member CRUD ───────────────────────────────────────────────────────────
export function getMembers(): Member[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) return [];
    const members: Member[] = JSON.parse(raw);
    // auto-update status
    return members.map(m => ({ ...m, status: calcStatus(m.endDate) }));
  } catch { return []; }
}

export function saveMember(member: Member): void {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === member.id);
  if (idx >= 0) members[idx] = member;
  else members.push(member);
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function deleteMember(id: string): void {
  const members = getMembers().filter(m => m.id !== id);
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function getMemberById(id: string): Member | undefined {
  return getMembers().find(m => m.id === id);
}

export function getMemberByPhone(phone: string): Member | undefined {
  return getMembers().find(m => m.phone === phone);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────
export function getDashboardStats() {
  const members = getMembers();
  const now = new Date();
  const sevenDays = new Date(now);
  sevenDays.setDate(sevenDays.getDate() + 7);

  return {
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    expired: members.filter(m => m.status === 'Expired').length,
    expiringThisWeek: members.filter(m => {
      const d = daysRemaining(m.endDate);
      return d > 0 && d <= 7;
    }).length,
  };
}

// ─── Workout Plans CRUD ────────────────────────────────────────────────────
export const DEFAULT_DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

export const DAY_ICONS: Record<DayOfWeek, string> = {
  Monday: '💪',
  Tuesday: '🏋️',
  Wednesday: '🦵',
  Thursday: '🔥',
  Friday: '🧘',
  Saturday: '⚡',
  Sunday: '😴',
};

export const DEFAULT_WORKOUT_PLAN: Omit<WorkoutPlan, 'id' | 'createdAt'> = {
  name: 'Standard Weekly Plan',
  days: [
    { day: 'Monday',    focus: 'Chest & Triceps',   icon: '💪', exercises: [
      { id: '1', name: 'Bench Press',      sets: 4, reps: '8-10' },
      { id: '2', name: 'Incline Dumbbell', sets: 3, reps: '10-12' },
      { id: '3', name: 'Cable Fly',        sets: 3, reps: '12-15' },
      { id: '4', name: 'Tricep Pushdown',  sets: 3, reps: '12-15' },
      { id: '5', name: 'Skull Crushers',   sets: 3, reps: '10-12' },
    ]},
    { day: 'Tuesday',   focus: 'Back & Biceps',     icon: '🏋️', exercises: [
      { id: '6',  name: 'Deadlift',         sets: 4, reps: '6-8'  },
      { id: '7',  name: 'Pull-Ups',         sets: 3, reps: '8-10' },
      { id: '8',  name: 'Seated Row',       sets: 3, reps: '10-12' },
      { id: '9',  name: 'Barbell Curl',     sets: 3, reps: '10-12' },
      { id: '10', name: 'Hammer Curl',      sets: 3, reps: '12-15' },
    ]},
    { day: 'Wednesday', focus: 'Legs',               icon: '🦵', exercises: [
      { id: '11', name: 'Squat',            sets: 4, reps: '8-10' },
      { id: '12', name: 'Leg Press',        sets: 3, reps: '10-12' },
      { id: '13', name: 'Lunges',           sets: 3, reps: '12 each' },
      { id: '14', name: 'Leg Curl',         sets: 3, reps: '12-15' },
      { id: '15', name: 'Calf Raise',       sets: 4, reps: '15-20' },
    ]},
    { day: 'Thursday',  focus: 'Shoulders',          icon: '🔥', exercises: [
      { id: '16', name: 'Overhead Press',   sets: 4, reps: '8-10' },
      { id: '17', name: 'Lateral Raise',    sets: 3, reps: '12-15' },
      { id: '18', name: 'Front Raise',      sets: 3, reps: '12-15' },
      { id: '19', name: 'Face Pulls',       sets: 3, reps: '15-20' },
      { id: '20', name: 'Shrugs',           sets: 3, reps: '12-15' },
    ]},
    { day: 'Friday',    focus: 'Core & Cardio',      icon: '🧘', exercises: [
      { id: '21', name: 'Plank',            sets: 3, reps: '60 sec' },
      { id: '22', name: 'Crunches',         sets: 3, reps: '20'     },
      { id: '23', name: 'Leg Raise',        sets: 3, reps: '15'     },
      { id: '24', name: 'Mountain Climber', sets: 3, reps: '30 sec' },
      { id: '25', name: 'Treadmill Run',    sets: 1, reps: '20 min' },
    ]},
    { day: 'Saturday',  focus: 'Full Body',           icon: '⚡', exercises: [
      { id: '26', name: 'Burpees',          sets: 3, reps: '15'     },
      { id: '27', name: 'Kettlebell Swing', sets: 3, reps: '20'     },
      { id: '28', name: 'Box Jump',         sets: 3, reps: '12'     },
      { id: '29', name: 'Battle Ropes',     sets: 3, reps: '30 sec' },
      { id: '30', name: 'Push-Ups',         sets: 3, reps: 'failure'},
    ]},
    { day: 'Sunday',    focus: 'Rest & Recovery',    icon: '😴', exercises: [
      { id: '31', name: 'Light Stretching', sets: 1, reps: '15 min' },
      { id: '32', name: 'Foam Rolling',     sets: 1, reps: '10 min' },
    ]},
  ],
};

export function getWorkoutPlans(): WorkoutPlan[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) {
      // seed default plan
      const defaultPlan: WorkoutPlan = {
        ...DEFAULT_WORKOUT_PLAN,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(PLANS_KEY, JSON.stringify([defaultPlan]));
      return [defaultPlan];
    }
    return JSON.parse(raw);
  } catch { return []; }
}

export function saveWorkoutPlan(plan: WorkoutPlan): void {
  const plans = getWorkoutPlans();
  const idx = plans.findIndex(p => p.id === plan.id);
  if (idx >= 0) plans[idx] = plan;
  else plans.push(plan);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export function deleteWorkoutPlan(id: string): void {
  const plans = getWorkoutPlans().filter(p => p.id !== id);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export function getWorkoutPlanById(id: string): WorkoutPlan | undefined {
  return getWorkoutPlans().find(p => p.id === id);
}

// ─── Auth ──────────────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { username: 'admin', password: 'gym@2024' };

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}
