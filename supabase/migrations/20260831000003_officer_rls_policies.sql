-- ============================================================================
-- Migration: 20260831000003_officer_rls_policies.sql
-- Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
-- Phase: 18 - Officer Authentication & Protected Row Level Security (RLS)
-- Description: Establishes role-based SELECT permissions for authenticated
--              officers to access beneficiary dossiers, livelihood profiles,
--              recommendations, and action plans.
--
-- Security Design Rationale:
-- 1. WHY OFFICER SELECT ACCESS EXISTS:
--    Nodal Welfare Officers, District Mission Managers, and PM-AJAY caseworkers
--    require read access to verify beneficiary profiles, review NSQF-aligned
--    skill recommendations, and formulate convergence action plans.
--
-- 2. WHY app_metadata IS USED (NOT user_metadata):
--    Supabase Auth stores metadata in two locations:
--    - user_metadata: Editable by the user via the client SDK (supabase.auth.updateUser).
--      Relying on user_metadata would introduce privilege escalation vulnerabilities.
--    - app_metadata: Can ONLY be modified by administrators via the Supabase Service
--      Role or custom backend Auth Hooks. Setting `role: "officer"` in app_metadata
--      guarantees tamper-proof cryptographic authorization in the verified JWT.
--
-- 3. WHY PUBLIC SELECT REMAINS DISABLED:
--    Citizen identity and socio-economic vulnerability data are protected under
--    GIGW 3.0 and Indian public service standards. Public anonymous enumeration
--    is strictly prohibited. RLS default-deny remains in effect for anon users.
--
-- 4. WHY CITIZEN INTAKE POLICIES ARE PRESERVED:
--    The citizen intake flow requires anonymous/public INSERT into `beneficiaries`
--    and `livelihood_profiles`. The existing intake INSERT policies
--    (`beneficiaries_intake_insert` and `livelihood_profiles_intake_insert`)
--    remain untouched and fully operational.
--
-- 5. WHY SERVICE-ROLE ACCESS IS NOT EXPOSED:
--    The frontend continues to communicate strictly via the public anon key.
--    The SUPABASE_SERVICE_ROLE_KEY is never exposed to client-side code and
--    remains confined to server-side Edge Functions.
-- ============================================================================

-- Ensure Row Level Security is enabled on all protected operational tables
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livelihood_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. Table: beneficiaries
-- Policy: officer_beneficiaries_select
-- Allows authenticated officers to read beneficiary identity and demographic records.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "officer_beneficiaries_select" ON public.beneficiaries;
CREATE POLICY "officer_beneficiaries_select"
    ON public.beneficiaries
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'officer');

-- ----------------------------------------------------------------------------
-- 2. Table: livelihood_profiles
-- Policy: officer_livelihood_profiles_select
-- Allows authenticated officers to read baseline diagnostic assessments.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "officer_livelihood_profiles_select" ON public.livelihood_profiles;
CREATE POLICY "officer_livelihood_profiles_select"
    ON public.livelihood_profiles
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'officer');

-- ----------------------------------------------------------------------------
-- 3. Table: recommendations
-- Policy: officer_recommendations_select
-- Allows authenticated officers to read NSQF job-role recommendations.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "officer_recommendations_select" ON public.recommendations;
CREATE POLICY "officer_recommendations_select"
    ON public.recommendations
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'officer');

-- ----------------------------------------------------------------------------
-- 4. Table: action_plans
-- Policy: officer_action_plans_select
-- Allows authenticated officers to read convergence action plans and stages.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "officer_action_plans_select" ON public.action_plans;
CREATE POLICY "officer_action_plans_select"
    ON public.action_plans
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'officer');
