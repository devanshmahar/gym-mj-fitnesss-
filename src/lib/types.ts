// ─── Member Types ──────────────────────────────────────────────────────────
export type MembershipPlan = 'Monthly' | 'Quarterly' | 'Yearly';
export type MemberStatus = 'Active' | 'Expired';

export interface Member {
  id: string;
  name: string;
  phone: string;
  plan: MembershipPlan;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  status: MemberStatus;
  photo?: string;    // base64 or URL
  assignedPlanId?: string;
}

// ─── Workout Plan Types ────────────────────────────────────────────────────
export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g. "10-12" or "failure"
  notes?: string;
}

export interface DayPlan {
  day: DayOfWeek;
  focus: string; // e.g. "Chest & Triceps"
  icon: string;  // emoji icon
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: DayPlan[];
  createdAt: string;
}
