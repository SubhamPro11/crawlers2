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

export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LinkReport {
  id: string;
  tool_id: string;
  reason?: string | null;
  reporter_ip?: string | null;
  status: "pending" | "resolved" | "dismissed";
  reported_at: string;
}
