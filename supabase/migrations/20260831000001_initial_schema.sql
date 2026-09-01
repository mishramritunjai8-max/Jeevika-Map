-- ============================================================================
-- Migration: 20260831000001_initial_schema.sql
-- Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
-- Description: Core database architecture for beneficiaries, livelihood profiles,
--              controlled occupation catalog, AI-ranked recommendations, and
--              convergence action plans.
-- Security: Row Level Security (RLS) strictly enforced. Zero public scraping of
--           beneficiary records permitted. No unrestricted USING(true) on citizen data.
-- ============================================================================

-- 1. Extensions & Prerequisite Functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reusable trigger function to automatically manage updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. Table: beneficiaries
-- Purpose: Verified citizen record under PM-AJAY statutory mandate.
-- ============================================================================
CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 14 AND age <= 100),
    gender TEXT NOT NULL CHECK (gender IN ('female', 'male', 'transgender', 'other')),
    caste_category TEXT NOT NULL DEFAULT 'scheduled_caste' CHECK (caste_category IN ('scheduled_caste', 'scheduled_tribe', 'other_backward_class', 'general')),
    contact_number TEXT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT NULL,
    gram_panchayat TEXT NULL,
    area_type TEXT NOT NULL DEFAULT 'rural' CHECK (area_type IN ('rural', 'semi_urban', 'urban')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. Table: livelihood_profiles
-- Purpose: Diagnostic assessment profile capturing 8 diagnostic categories.
-- ============================================================================
CREATE TABLE IF NOT EXISTS livelihood_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    primary_skill TEXT NOT NULL,
    secondary_skills TEXT[] NOT NULL DEFAULT '{}',
    tool_proficiency TEXT NOT NULL CHECK (tool_proficiency IN ('manual_traditional', 'power_tools', 'basic_machinery', 'none')),
    rpl_interest BOOLEAN NOT NULL DEFAULT true,
    years_experience INTEGER NOT NULL DEFAULT 0 CHECK (years_experience >= 0 AND years_experience <= 70),
    current_trade TEXT NULL,
    monthly_income_range TEXT NULL CHECK (monthly_income_range IN ('under_5k', '5k_to_10k', '10k_to_15k', 'above_15k') OR monthly_income_range IS NULL),
    is_seasonal BOOLEAN NOT NULL DEFAULT false,
    formal_education_level TEXT NOT NULL CHECK (formal_education_level IN ('no_formal_education', 'primary_class_5', 'middle_class_8', 'secondary_class_10', 'higher_secondary_class_12', 'diploma_iti', 'graduate_above')),
    can_read_write_vernacular BOOLEAN NOT NULL DEFAULT true,
    smartphone_usage TEXT NOT NULL DEFAULT 'basic_calls' CHECK (smartphone_usage IN ('regular', 'basic_calls', 'no_phone')),
    mobility_range TEXT NOT NULL CHECK (mobility_range IN ('within_village', 'within_block', 'within_district', 'nearby_districts', 'anywhere_in_state')),
    caregiver_responsibilities BOOLEAN NOT NULL DEFAULT false,
    financial_constraint TEXT NOT NULL CHECK (financial_constraint IN ('needs_immediate_daily_wage', 'can_attend_stipended_training', 'can_invest_time')),
    employment_preference TEXT NOT NULL CHECK (employment_preference IN ('micro_enterprise', 'wage_employment', 'shg_cooperative', 'home_based_production')),
    target_monthly_income TEXT NULL,
    seeks_toolkit_support BOOLEAN NOT NULL DEFAULT true,
    additional_voice_note TEXT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. Table: occupation_catalog
-- Purpose: Controlled, verified NSQF reference catalog. Prevents AI fabrication
--          of qualification packs, NSQF levels, or awarding bodies.
-- ============================================================================
CREATE TABLE IF NOT EXISTS occupation_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qp_nos_code TEXT NOT NULL UNIQUE,
    job_role TEXT NOT NULL,
    sector_skill_council TEXT NOT NULL,
    nsqf_level INTEGER NOT NULL CHECK (nsqf_level >= 1 AND nsqf_level <= 8),
    notional_hours INTEGER NOT NULL CHECK (notional_hours > 0),
    rpl_allowed BOOLEAN NOT NULL DEFAULT true,
    entry_qualification_minimum TEXT NOT NULL,
    description TEXT NOT NULL,
    source_reference TEXT NULL,
    source_last_verified_at TIMESTAMPTZ NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. Table: recommendations
-- Purpose: Diagnostic matching linking a livelihood profile to a verified catalog
--          occupation. Uses match_score (0-100 heuristic fit index).
-- ============================================================================
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    livelihood_profile_id UUID NOT NULL REFERENCES livelihood_profiles(id) ON DELETE CASCADE,
    occupation_id UUID NOT NULL REFERENCES occupation_catalog(id) ON DELETE RESTRICT,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    matched_skills TEXT[] NOT NULL DEFAULT '{}',
    skill_gaps TEXT[] NOT NULL DEFAULT '{}',
    location_relevance TEXT NOT NULL,
    constraint_fit TEXT NOT NULL,
    rationale TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. Table: action_plans
-- Purpose: General convergence support pathways without fabricated rupee amounts.
-- ============================================================================
CREATE TABLE IF NOT EXISTS action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    livelihood_profile_id UUID NOT NULL REFERENCES livelihood_profiles(id) ON DELETE CASCADE,
    recommendation_id UUID NULL REFERENCES recommendations(id) ON DELETE SET NULL,
    potential_support_category TEXT NOT NULL CHECK (potential_support_category IN ('pm_ajay_skill_training', 'pm_ajay_toolkit_assistance', 'shg_cfc_incubation', 'direct_enterprise_credit_linkage', 'wage_placement_facilitation')),
    recommended_enterprise_model TEXT NOT NULL CHECK (recommended_enterprise_model IN ('individual_micro_enterprise', 'shg_producer_group', 'wage_employment', 'home_based_jobwork')),
    nearest_training_center_type TEXT NULL,
    implementation_stage TEXT NOT NULL DEFAULT 'pathway_formulated' CHECK (implementation_stage IN ('pathway_formulated', 'counseling_pending', 'mobilization_scheduled', 'training_enrolled', 'completed')),
    officer_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. Indexes & Uniqueness Constraints
-- ============================================================================

-- Partial Unique Index: Exactly one primary recommendation allowed per profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_recommendations_single_primary
    ON recommendations (livelihood_profile_id)
    WHERE is_primary = true;

-- Beneficiary location index
CREATE INDEX IF NOT EXISTS idx_beneficiaries_location
    ON beneficiaries (state, district);

-- Livelihood profile lookups
CREATE INDEX IF NOT EXISTS idx_livelihood_profiles_beneficiary
    ON livelihood_profiles (beneficiary_id);

CREATE INDEX IF NOT EXISTS idx_livelihood_profiles_status
    ON livelihood_profiles (status);

-- Occupation catalog lookups
CREATE INDEX IF NOT EXISTS idx_occupation_catalog_sector
    ON occupation_catalog (sector_skill_council);

CREATE INDEX IF NOT EXISTS idx_occupation_catalog_nsqf
    ON occupation_catalog (nsqf_level);

CREATE INDEX IF NOT EXISTS idx_occupation_catalog_active
    ON occupation_catalog (is_active);

-- Recommendation lookups & ranking
CREATE INDEX IF NOT EXISTS idx_recommendations_profile
    ON recommendations (livelihood_profile_id);

CREATE INDEX IF NOT EXISTS idx_recommendations_occupation
    ON recommendations (occupation_id);

CREATE INDEX IF NOT EXISTS idx_recommendations_match_score
    ON recommendations (match_score DESC);

-- Action plan lookups & stage tracking
CREATE INDEX IF NOT EXISTS idx_action_plans_profile
    ON action_plans (livelihood_profile_id);

CREATE INDEX IF NOT EXISTS idx_action_plans_stage
    ON action_plans (implementation_stage);

-- ============================================================================
-- 8. Automatic updated_at Triggers
-- ============================================================================

DROP TRIGGER IF EXISTS trg_beneficiaries_updated_at ON beneficiaries;
CREATE TRIGGER trg_beneficiaries_updated_at
    BEFORE UPDATE ON beneficiaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_livelihood_profiles_updated_at ON livelihood_profiles;
CREATE TRIGGER trg_livelihood_profiles_updated_at
    BEFORE UPDATE ON livelihood_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_occupation_catalog_updated_at ON occupation_catalog;
CREATE TRIGGER trg_occupation_catalog_updated_at
    BEFORE UPDATE ON occupation_catalog
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_action_plans_updated_at ON action_plans;
CREATE TRIGGER trg_action_plans_updated_at
    BEFORE UPDATE ON action_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. Row Level Security (RLS) Policies
-- Security Mandate:
--   - Default Deny strictly enforced across all tables upon enabling RLS.
--   - occupation_catalog: Public SELECT for active records (anon + authenticated).
--   - beneficiaries & livelihood_profiles: INSERT allowed for intake; NO public SELECT,
--     and NO unrestricted authenticated USING(true) SELECT.
--   - recommendations & action_plans: NOT exposed to anon; access denied until
--     explicit beneficiary/officer authorization is implemented.
--   - NO UPDATE or DELETE policies for beneficiary/profile/recommendation/action_plans.
-- ============================================================================

ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE livelihood_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- 9.1 occupation_catalog: Public Read for Active Records (anon + authenticated)
CREATE POLICY "occupation_catalog_active_select"
    ON occupation_catalog
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- 9.2 beneficiaries: Intake INSERT allowed for anon and authenticated; No SELECT/UPDATE/DELETE
CREATE POLICY "beneficiaries_intake_insert"
    ON beneficiaries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 9.3 livelihood_profiles: Intake INSERT allowed for anon and authenticated; No SELECT/UPDATE/DELETE
CREATE POLICY "livelihood_profiles_intake_insert"
    ON livelihood_profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 9.4 recommendations: Default Deny (No policies created; all operations restricted until auth phase)

-- 9.5 action_plans: Default Deny (No policies created; all operations restricted until auth phase)
