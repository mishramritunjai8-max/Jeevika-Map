-- ============================================================================
-- Migration: 20260901000001_officer_assessments.sql
-- Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
-- Phase: 19.2 - Officer Assessment Database Persistence
-- Description: Creates the officer_assessments table with strict RLS policies
--              allowing authenticated welfare officers to persist verification
--              status, recommended next action, and audit remarks.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.officer_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('verified', 'pending', 'referred', 'rejected')),
    recommended_next_action TEXT NOT NULL,
    officer_remarks TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_officer_assessments_beneficiary UNIQUE (beneficiary_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_officer_assessments_beneficiary
    ON public.officer_assessments (beneficiary_id);

CREATE INDEX IF NOT EXISTS idx_officer_assessments_officer
    ON public.officer_assessments (officer_id);

-- Automatic updated_at timestamp trigger
DROP TRIGGER IF EXISTS trg_officer_assessments_updated_at ON public.officer_assessments;
CREATE TRIGGER trg_officer_assessments_updated_at
    BEFORE UPDATE ON public.officer_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.officer_assessments ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Authenticated officers only
DROP POLICY IF EXISTS "officer_assessments_select" ON public.officer_assessments;
CREATE POLICY "officer_assessments_select"
    ON public.officer_assessments
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'officer');

-- 2. INSERT Policy: Authenticated officers only, officer_id must equal auth.uid()
DROP POLICY IF EXISTS "officer_assessments_insert" ON public.officer_assessments;
CREATE POLICY "officer_assessments_insert"
    ON public.officer_assessments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
        AND officer_id = auth.uid()
    );

-- 3. UPDATE Policy: Authenticated officers only, officer_id must equal auth.uid()
DROP POLICY IF EXISTS "officer_assessments_update" ON public.officer_assessments;
CREATE POLICY "officer_assessments_update"
    ON public.officer_assessments
    FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
        AND officer_id = auth.uid()
    );
