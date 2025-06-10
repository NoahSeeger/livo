export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type GoalCategory =
  | "personal"
  | "career"
  | "health"
  | "travel"
  | "adventure"
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
