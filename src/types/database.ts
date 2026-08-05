export type PricingModel = "free" | "freemium" | "paid" | "open-source";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Section {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  section_id: string;
  name: string;
  slug: string;
  subgroup?: string | null;
  description?: string | null;
  display_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  pricing_model: PricingModel;
  category_id?: string | null;
  logo_url?: string | null;
  has_api: boolean;
  added_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ToolTag {
  tool_id: string;
  tag_id: string;
}

export interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  pricing_model: PricingModel;
  tags: string[];
  submitter_email?: string | null;
  status: SubmissionStatus;
  submitted_at: string;
}

export interface ViewLog {
  id: string;
  tool_id: string;
  user_agent?: string | null;
  referrer?: string | null;
  viewed_at: string;
}
