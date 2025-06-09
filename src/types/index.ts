export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  status: GoalStatus;
  created_at: string;
  completed_at?: string;
  reminder_date?: string;
}

export type GoalCategory =
  | "adventure"
  | "health"
  | "career"
  | "personal"
  | "travel"
  | "other";

export type GoalStatus = "not_started" | "in_progress" | "completed";

export interface TravelLocation {
  id: string;
  user_id: string;
  country_code: string;
  status: TravelStatus;
  visited_date?: string;
  created_at: string;
}

export type TravelStatus = "visited" | "want_to_visit";
