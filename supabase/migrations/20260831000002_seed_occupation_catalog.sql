-- ==============================================================================
-- Migration: 20260831000002_seed_occupation_catalog.sql
-- Platform: Jeevika Map (PM-AJAY Livelihood Convergence Platform)
--
-- Purpose:
-- Authoritative seed data for occupation_catalog.
-- Contains ONLY records whose required fields were independently verified
-- against authoritative NCVET / National Qualifications Register (NQR)
-- or official Sector Skill Council documentation.
--
-- Strict Zero-Fabrication Rule:
-- Partially verified, unverified, or deactivated roles are strictly excluded.
--
-- Idempotency:
-- Safe for repeated execution via ON CONFLICT (qp_nos_code) DO UPDATE.
-- ID column relies on table default (gen_random_uuid()).
-- ==============================================================================

INSERT INTO occupation_catalog (
    qp_nos_code,
    job_role,
    sector_skill_council,
    nsqf_level,
    notional_hours,
    rpl_allowed,
    entry_qualification_minimum,
    description,
    source_reference,
    source_last_verified_at,
    is_active
)
VALUES
(
    'SGJ/Q0101',
    'Solar PV Installer (Suryamitra)',
    'Skill Council for Green Jobs',
    4,
    300,
    true,
    'Class 10th pass + ITI (2 years) in relevant trade / Diploma or Class 12th pass (Science)',
    'Carries out site survey, installs, tests, commissions, and maintains standalone and grid-connected solar photovoltaic systems, agricultural solar pumps, and inverters while ensuring electrical and site safety standards.',
    'Skill Council for Green Jobs (SCGJ) Qualification Pack SGJ/Q0101; MNRE/NISE Suryamitra Skill Development Programme',
    '2026-08-31T00:00:00Z',
    true
),
(
    'TSC/Q7303',
    'Two Shaft Handloom Weaver',
    'Textile Sector Skill Council',
    4,
    330,
    true,
    'Basic literacy and numeracy (preference for Class 9th) or traditional handloom weaving experience',
    'Operates two shaft handlooms to weave plain fabrics and simple variations using cotton, wool, or silk yarns. Carries out pre-weaving setup, warp/weft tensioning, and fabric quality inspection.',
    'NCVET National Qualifications Register (NQR) - File Ref: QG-03-TX-03347-2024-V2-TSC',
    '2026-08-31T00:00:00Z',
    true
),
(
    'AGR/Q1201',
    'Organic Grower',
    'Agriculture Skill Council of India',
    4,
    390,
    true,
    'Class 10th pass with 3 years relevant farming experience or Class 12th pass (Science/Agriculture)',
    'Performs organic farm planning, soil health management using bio-fertilizers and composts, integrated pest and disease management using botanical extracts, and adheres to organic certification standards and NPOP guidelines.',
    'Agriculture Skill Council of India (ASCI) Qualification Pack AGR/Q1201 (Valid till 18-Feb-2028)',
    '2026-08-31T00:00:00Z',
    true
)
ON CONFLICT (qp_nos_code) DO UPDATE SET
    job_role = EXCLUDED.job_role,
    sector_skill_council = EXCLUDED.sector_skill_council,
    nsqf_level = EXCLUDED.nsqf_level,
    notional_hours = EXCLUDED.notional_hours,
    rpl_allowed = EXCLUDED.rpl_allowed,
    entry_qualification_minimum = EXCLUDED.entry_qualification_minimum,
    description = EXCLUDED.description,
    source_reference = EXCLUDED.source_reference,
    source_last_verified_at = EXCLUDED.source_last_verified_at,
    is_active = EXCLUDED.is_active,
    updated_at = now();
