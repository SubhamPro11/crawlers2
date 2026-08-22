-- Migration: 20260822000000_fix_supabase_linter_warnings.sql
-- Description: Fix Supabase database linter warnings (overly permissive RLS policies & SECURITY DEFINER permissions)

-- ==============================================================================
-- 1. FIX PERMISSIVE RLS POLICIES ON TAXONOMY & TOOL CATALOG TABLES
-- ==============================================================================

-- Clean up any overly permissive ALL policies
DROP POLICY IF EXISTS "Allow public all on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public all on sections" ON public.sections;
DROP POLICY IF EXISTS "Allow public all on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow public all on tool_tags" ON public.tool_tags;
DROP POLICY IF EXISTS "Allow public all on tools" ON public.tools;

-- Ensure explicit SELECT policies (Public read-only)
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access on sections" ON public.sections;
CREATE POLICY "Allow public read access on sections"
  ON public.sections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access on tags" ON public.tags;
CREATE POLICY "Allow public read access on tags"
  ON public.tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access on tool_tags" ON public.tool_tags;
CREATE POLICY "Allow public read access on tool_tags"
  ON public.tool_tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access on active tools" ON public.tools;
CREATE POLICY "Allow public read access on active tools"
  ON public.tools FOR SELECT
  USING (is_active = true);

-- Add Admin mutation policies
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage sections" ON public.sections;
CREATE POLICY "Admins can manage sections"
  ON public.sections FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
CREATE POLICY "Admins can manage tags"
  ON public.tags FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage tool_tags" ON public.tool_tags;
CREATE POLICY "Admins can manage tool_tags"
  ON public.tool_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage tools" ON public.tools;
CREATE POLICY "Admins can manage tools"
  ON public.tools FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ==============================================================================
-- 2. FIX PERMISSIVE RLS POLICIES ON LINK REPORTS TABLE
-- ==============================================================================

DROP POLICY IF EXISTS "Allow authenticated users to insert reports" ON public.link_reports;
DROP POLICY IF EXISTS "Allow updating link reports" ON public.link_reports;
DROP POLICY IF EXISTS "Allow authenticated users to insert link reports" ON public.link_reports;
DROP POLICY IF EXISTS "Admins full management access on link_reports" ON public.link_reports;

CREATE POLICY "Allow authenticated users to insert link reports"
  ON public.link_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (reporter_id IS NULL OR reporter_id = auth.uid())
    AND status = 'pending'
  );

CREATE POLICY "Admins can view link_reports"
  ON public.link_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can update link_reports"
  ON public.link_reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can delete link_reports"
  ON public.link_reports FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ==============================================================================
-- 3. FIX PERMISSIVE RLS POLICIES ON PROFILES TABLE
-- ==============================================================================

DROP POLICY IF EXISTS "Admins full management access on profiles" ON public.profiles;
CREATE POLICY "Admins full management access on profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ==============================================================================
-- 4. FIX SUBMISSIONS & VIEW_LOGS INSERT WITH CHECK POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Allow public insert on submissions" ON public.submissions;
CREATE POLICY "Allow public insert on submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (
    name IS NOT NULL
    AND length(trim(name)) > 0
    AND url IS NOT NULL
    AND length(trim(url)) > 0
    AND status = 'pending'
  );

DROP POLICY IF EXISTS "Allow public insert on view_logs" ON public.view_logs;
CREATE POLICY "Allow public insert on view_logs"
  ON public.view_logs FOR INSERT
  WITH CHECK (tool_id IS NOT NULL);

-- ==============================================================================
-- 5. REVOKE REST API EXECUTION ON SECURITY DEFINER UTILITY FUNCTIONS
-- ==============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc
    JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    WHERE pg_namespace.nspname = 'public' AND pg_proc.proname = 'rls_auto_enable'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  END IF;
END $$;
