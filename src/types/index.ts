export type LessonType = 'CONCEPT' | 'EXERCISE' | 'PROJECT';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  supabase_id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  xp: number;
  level: number;
  streak_count: number;
  streak_last_date?: Date | string | null;
  streak_freeze_count: number;
  created_at: Date | string;
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color_hex?: string | null;
  total_units: number;
  total_lessons: number;
  is_published: boolean;
}

export interface Unit {
  id: string;
  track_id: string;
  unit_number: number;
  title: string;
  description: string;
  xp_reward: number;
  is_published: boolean;
}

export interface Lesson {
  id: string;
  unit_id: string;
  lesson_number: number;
  title: string;
  type: LessonType;
  duration_minutes: number;
  content_json: any; // Contains structured content blocks
  starter_code?: string | null;
  solution_code?: string | null;
  test_cases_json?: any; // Contains inputs and expected outputs
  xp_reward: number;
  language: string;
  is_published: boolean;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: ProgressStatus;
  attempts: number;
  code_snapshot?: string | null;
  completed_at?: Date | string | null;
  xp_earned: number;
}

export interface Badge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_emoji: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: Date | string;
}

export interface HintUsage {
  id: string;
  user_id: string;
  lesson_id: string;
  hint_number: number;
  requested_at: Date | string;
  response_text: string;
}

// API Response Types
export interface TracksResponse {
  tracks: Track[];
}

export interface TrackDetailResponse extends Track {
  units: (Unit & {
    lessons: (Lesson & {
      progress?: UserLessonProgress[];
    })[];
  })[];
}

export interface SubmitCodeRequest {
  code: string;
}

export interface SubmitCodeResponse {
  passed: number;
  total: number;
  results: {
    input?: string;
    expected?: string;
    actual?: string;
    passed: boolean;
    error?: string;
  }[];
  xp_earned: number;
  leveled_up: boolean;
  new_level: number;
  new_xp: number;
  streak_count: number;
  new_badges: Badge[];
}

export interface HintRequest {
  code: string;
  error_output?: string;
  hint_number: number;
}

export interface HintResponse {
  hint_number: number;
  hint_text: string;
}

export interface DashboardResponse {
  user: {
    xp: number;
    level: number;
    streak_count: number;
    streak_last_date?: Date | string | null;
    username: string;
    avatar_url?: string | null;
  };
  tracks_progress: {
    track_slug: string;
    track_title: string;
    completed_lessons: number;
    total_lessons: number;
    progress_percentage: number;
    next_lesson?: {
      id: string;
      title: string;
      unit_title: string;
    };
  }[];
  recent_badges: (Badge & { earned_at: string | Date })[];
  weekly_xp: {
    day: string; // "Mon", "Tue", etc.
    xp: number;
  }[];
  leaderboard: {
    rank: number;
    username: string;
    avatar_url?: string | null;
    xp_this_week: number;
  }[];
}
