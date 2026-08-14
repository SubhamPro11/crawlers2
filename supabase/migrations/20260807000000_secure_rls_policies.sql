-- Migration: 20260807000000_secure_rls_policies.sql
-- Description: Add missing RLS policies for submissions and link_reports tables

-- 1. Ensure link_reports table exists
CREATE TABLE IF NOT EXISTS public.link_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
    reason TEXT NOT NULL DEFAULT '404 Link Broken / Site Down',
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reporter_ip TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_link_reports_tool_id ON public.link_reports(tool_id);
CREATE INDEX IF NOT EXISTS idx_link_reports_status ON public.link_reports(status);

-- 2. Submissions Table: Add Admin SELECT and DELETE policies
DROP POLICY IF EXISTS "Admins can view submissions" ON public.submissions;
CREATE POLICY "Admins can view submissions"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete submissions" ON public.submissions;
CREATE POLICY "Admins can delete submissions"
  ON public.submissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. Link Reports Table: Enable RLS and Configure Policies
ALTER TABLE public.link_reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to submit link reports
DROP POLICY IF EXISTS "Allow authenticated users to insert link reports" ON public.link_reports;
CREATE POLICY "Allow authenticated users to insert link reports"
  ON public.link_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access on link_reports" ON public.link_reports;
CREATE POLICY "Allow service role full access on link_reports"
  ON public.link_reports FOR ALL
  TO service_role
  USING (true);

-- Admins full access (SELECT, UPDATE, DELETE) on link reports
DROP POLICY IF EXISTS "Admins full management access on link_reports" ON public.link_reports;
CREATE POLICY "Admins full management access on link_reports"
  ON public.link_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
