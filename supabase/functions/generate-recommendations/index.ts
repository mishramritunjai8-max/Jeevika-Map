// ==============================================================================
// Supabase Edge Function: generate-recommendations
// Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
//
// Purpose:
// Secure, server-side, zero-fabrication recommendation engine.
// Evaluates a verified livelihood_profile against active NSQF records in
// occupation_catalog, inserts persistent recommendation records, and formulates
// a preliminary action_plan convergence pathway.
//
// Security Requirements:
// - Uses server-side SUPABASE_SERVICE_ROLE_KEY read strictly from Deno.env.
// - Service role credentials NEVER touch client-side code.
// - Zero occupation fabrication: every recommendation references an existing
//   occupation_catalog.id.
// - Respects partial unique index idx_recommendations_single_primary.
// ==============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Standard CORS headers for preflight and API responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// UUID v4 format validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface RequestPayload {
  livelihood_profile_id: string;
}

interface OccupationRecord {
  id: string;
  qp_nos_code: string;
  job_role: string;
  sector_skill_council: string;
  nsqf_level: number;
  notional_hours: number;
  rpl_allowed: boolean;
  entry_qualification_minimum: string;
  description: string;
  is_active: boolean;
}

interface LivelihoodProfileRecord {
  id: string;
  beneficiary_id: string;
  primary_skill: string;
  secondary_skills: string[];
  tool_proficiency: string;
  rpl_interest: boolean;
  years_experience: number;
  current_trade: string | null;
  monthly_income_range: string | null;
  is_seasonal: boolean;
  formal_education_level: string;
  can_read_write_vernacular: boolean;
  smartphone_usage: string;
  mobility_range: string;
  caregiver_responsibilities: boolean;
  financial_constraint: string;
  employment_preference: string;
  target_monthly_income: string | null;
  seeks_toolkit_support: boolean;
  additional_voice_note: string | null;
  status: string;
  beneficiaries?: {
    district?: string;
    state?: string;
  } | null;
}

interface EvaluatedMatch {
  livelihood_profile_id: string;
  occupation_id: string;
  match_score: number;
  matched_skills: string[];
  skill_gaps: string[];
  location_relevance: string;
  constraint_fit: string;
  rationale: string;
  is_primary: boolean;
  catalog_record: OccupationRecord;
}

/**
 * Server-side Deterministic Matching Engine
 * Reuses the verified scoring rules from the frontend service layer.
 * Produces a transparent 0-100 heuristic match_score without fabricating credentials.
 */
function evaluateMatches(
  profile: LivelihoodProfileRecord,
  catalog: OccupationRecord[],
  locationContext?: { district?: string; state?: string }
): EvaluatedMatch[] {
  if (!catalog || catalog.length === 0) {
    return [];
  }

  const primarySkillLower = (profile.primary_skill || '').toLowerCase();
  const currentTradeLower = (profile.current_trade || '').toLowerCase();
  const districtName = locationContext?.district || 'District Cluster';

  const scored: EvaluatedMatch[] = catalog.map((occ) => {
    let score = 0;
    const matchedSkills: string[] = [];
    const skillGaps: string[] = [];
    const occRoleLower = occ.job_role.toLowerCase();
    const occDescLower = occ.description.toLowerCase();
    const occSectorLower = occ.sector_skill_council.toLowerCase();

    // Signal 1: Primary Skill Alignment (Weight: up to 35 pts)
    const primaryKeywords = primarySkillLower.split(/[\s,+/]+/).filter((k) => k.length > 2);
    let matchedKeywordCount = 0;
    for (const kw of primaryKeywords) {
      if (occRoleLower.includes(kw) || occDescLower.includes(kw)) {
        matchedKeywordCount++;
        matchedSkills.push(kw);
      }
    }

    if (matchedKeywordCount > 0) {
      score += Math.min(35, 20 + matchedKeywordCount * 5);
    } else if (
      (primarySkillLower.includes('बुनाई') || primarySkillLower.includes('weaver') || primarySkillLower.includes('handloom')) &&
      occSectorLower.includes('textile')
    ) {
      score += 30;
      matchedSkills.push('Handloom / Weaving Heritage');
    } else if (
      (primarySkillLower.includes('सोलर') || primarySkillLower.includes('सौर') || primarySkillLower.includes('solar') || primarySkillLower.includes('पंप')) &&
      occSectorLower.includes('green jobs')
    ) {
      score += 32;
      matchedSkills.push('Solar & Green Tech Diagnostics');
    } else if (
      (primarySkillLower.includes('खाद्य') || primarySkillLower.includes('अनाज') || primarySkillLower.includes('agro') || primarySkillLower.includes('food')) &&
      occSectorLower.includes('food')
    ) {
      score += 30;
      matchedSkills.push('Agro & Food Grain Grading');
    } else if (
      (primarySkillLower.includes('विद्युत') || primarySkillLower.includes('बिजली') || primarySkillLower.includes('electric')) &&
      occSectorLower.includes('power')
    ) {
      score += 30;
      matchedSkills.push('Electrical Wiring & Safety');
    } else if (
      (primarySkillLower.includes('राजमिस्त्री') || primarySkillLower.includes('निर्माण') || primarySkillLower.includes('mason')) &&
      occSectorLower.includes('construction')
    ) {
      score += 30;
      matchedSkills.push('Masonry & Structural Construction');
    } else if (
      (primarySkillLower.includes('चर्म') || primarySkillLower.includes('चमड़ा') || primarySkillLower.includes('leather')) &&
      occSectorLower.includes('leather')
    ) {
      score += 30;
      matchedSkills.push('Artisanal Leatherworking');
    } else {
      score += 8;
      skillGaps.push(`Domain foundation in ${occ.sector_skill_council}`);
    }

    // Signal 2: Current Trade Experience (Weight: up to 15 pts)
    if (currentTradeLower && (occRoleLower.includes(currentTradeLower) || occDescLower.includes(currentTradeLower))) {
      score += 15;
      matchedSkills.push('Practical daily trade exposure');
    } else if (profile.years_experience >= 4) {
      score += 12;
      matchedSkills.push(`Over ${profile.years_experience} years informal trade tenure`);
    } else if (profile.years_experience >= 1) {
      score += 8;
    }

    // Signal 3: Tool Proficiency Compatibility (Weight: up to 15 pts)
    if (profile.tool_proficiency === 'power_tools' || profile.tool_proficiency === 'basic_machinery') {
      score += 15;
      matchedSkills.push('Power tools & mechanized machinery operation');
    } else if (profile.tool_proficiency === 'manual_traditional') {
      score += 10;
      skillGaps.push('Machine calibration & electrical safety protocol');
    }

    // Signal 4: RPL Eligibility (Weight: up to 15 pts)
    if (profile.rpl_interest && occ.rpl_allowed && profile.years_experience >= 2) {
      score += 15;
      matchedSkills.push(`Fast-Track RPL Eligible (NCVET ${occ.notional_hours}h Bridge)`);
    } else if (occ.rpl_allowed) {
      score += 10;
    } else {
      skillGaps.push('Standard qualification pack fresh enrollment');
    }

    // Signal 5: Education Compatibility (Weight: up to 10 pts)
    if (occ.nsqf_level <= 4) {
      score += 10;
    } else if (profile.formal_education_level === 'secondary_class_10' || profile.formal_education_level === 'higher_secondary_class_12') {
      score += 10;
    } else {
      score += 5;
      skillGaps.push(`Formal schooling bridge for NSQF Level ${occ.nsqf_level}`);
    }

    // Signal 6: Mobility & Scheduling Fit (Weight: up to 10 pts)
    if (profile.mobility_range === 'within_district' || profile.mobility_range === 'nearby_districts') {
      score += 10;
    } else {
      score += 8;
    }

    // Bound score between 25 and 98 to keep heuristic honest
    const finalScore = Math.min(98, Math.max(25, Math.round(score)));

    const locationRelevance = `${districtName} cluster demonstrates practical ODOP and enterprise linkage for ${occ.sector_skill_council} trades.`;
    const constraintFit = profile.caregiver_responsibilities
      ? 'Suitable for decentralized or local cluster scheduling with home-based enterprise potential.'
      : 'Compatible with full-day workshop attendance and district training center access.';
    const rationale = `Evaluated against candidate primary trade competence, ${profile.years_experience} years hands-on experience, and eligibility for NSQF Level ${occ.nsqf_level} under NCVET guidelines.`;

    return {
      livelihood_profile_id: profile.id,
      occupation_id: occ.id,
      match_score: finalScore,
      matched_skills: matchedSkills.length > 0 ? matchedSkills : ['Informal trade aptitude'],
      skill_gaps: skillGaps.length > 0 ? skillGaps : ['Digital invoicing & quality standardization'],
      location_relevance: locationRelevance,
      constraint_fit: constraintFit,
      rationale,
      is_primary: false,
      catalog_record: occ,
    };
  });

  // Sort descending by match_score
  scored.sort((a, b) => b.match_score - a.match_score);

  // Mark top match as primary
  if (scored.length > 0) {
    scored[0].is_primary = true;
  }

  // Return top 3 recommendations
  return scored.slice(0, 3);
}

/**
 * Main Deno HTTP Server Handler
 */
Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Parse & validate JSON body
  let body: RequestPayload;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON request body.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const profileId = body?.livelihood_profile_id;
  if (!profileId || typeof profileId !== 'string' || !UUID_REGEX.test(profileId)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Missing or invalid livelihood_profile_id format. Expected UUID.',
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Read server-side service credentials from Edge Function environment
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[generate-recommendations] Server environment missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Edge Function environment configuration error. Required server secrets not found.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create privileged server-side Supabase client (bypasses RLS strictly within this secure sandbox)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    // ------------------------------------------------------------------------
    // STEP 1: Fetch Livelihood Profile by ID
    // ------------------------------------------------------------------------
    const { data: profile, error: profileError } = await supabase
      .from('livelihood_profiles')
      .select('*, beneficiaries(district, state)')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      console.warn(`[generate-recommendations] Profile not found: ${profileId}`, profileError?.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Livelihood profile not found with ID: ${profileId}`,
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ------------------------------------------------------------------------
    // STEP 2: Fetch Active Occupation Catalog Records
    // ------------------------------------------------------------------------
    const { data: catalog, error: catalogError } = await supabase
      .from('occupation_catalog')
      .select('*')
      .eq('is_active', true);

    if (catalogError || !catalog || catalog.length === 0) {
      console.error('[generate-recommendations] Failed to fetch active occupation_catalog:', catalogError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No active NSQF occupations available in reference catalog.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ------------------------------------------------------------------------
    // STEP 3: Run Deterministic Matching Engine
    // ------------------------------------------------------------------------
    const topMatches = evaluateMatches(profile as LivelihoodProfileRecord, catalog as OccupationRecord[], {
      district: profile.beneficiaries?.district,
      state: profile.beneficiaries?.state,
    });

    if (topMatches.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unable to match profile against current occupational catalog.',
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ------------------------------------------------------------------------
    // STEP 4: Idempotency Management (Server-side clean replacement)
    // Delete any previous action_plans and recommendations for this profile
    // before inserting the fresh set.
    // Note: While PostgREST does not provide raw multi-statement BEGIN...COMMIT
    // transactions over REST, deleting prior children before re-insertion prevents
    // duplicates and preserves the partial unique index on is_primary.
    // ------------------------------------------------------------------------
    const { error: deletePlanError } = await supabase
      .from('action_plans')
      .delete()
      .eq('livelihood_profile_id', profileId);

    if (deletePlanError) {
      console.warn('[generate-recommendations] Error clearing old action plans:', deletePlanError.message);
    }

    const { error: deleteRecsError } = await supabase
      .from('recommendations')
      .delete()
      .eq('livelihood_profile_id', profileId);

    if (deleteRecsError) {
      console.warn('[generate-recommendations] Error clearing old recommendations:', deleteRecsError.message);
    }

    // ------------------------------------------------------------------------
    // STEP 5: Insert Verified Recommendations into Database
    // ------------------------------------------------------------------------
    const recommendationsPayload = topMatches.map((m) => ({
      livelihood_profile_id: m.livelihood_profile_id,
      occupation_id: m.occupation_id,
      match_score: m.match_score,
      matched_skills: m.matched_skills,
      skill_gaps: m.skill_gaps,
      location_relevance: m.location_relevance,
      constraint_fit: m.constraint_fit,
      rationale: m.rationale,
      is_primary: m.is_primary,
    }));

    const { data: insertedRecs, error: insertRecError } = await supabase
      .from('recommendations')
      .insert(recommendationsPayload)
      .select('*, occupation:occupation_catalog(*)');

    if (insertRecError || !insertedRecs) {
      console.error('[generate-recommendations] Insert recommendations error:', insertRecError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database error saving generated recommendations.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ------------------------------------------------------------------------
    // STEP 6: Generate & Insert Primary Action Plan
    // ------------------------------------------------------------------------
    const primaryInserted = insertedRecs.find((r: any) => r.is_primary) || insertedRecs[0]; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Map potential support category based on candidate constraints & preferences
    let potentialCategory: string = 'pm_ajay_skill_training';
    if (profile.seeks_toolkit_support) {
      potentialCategory = 'pm_ajay_toolkit_assistance';
    } else if (profile.employment_preference === 'shg_cooperative') {
      potentialCategory = 'shg_cfc_incubation';
    } else if (profile.employment_preference === 'wage_employment') {
      potentialCategory = 'wage_placement_facilitation';
    }

    // Map enterprise model
    let enterpriseModel: string = 'individual_micro_enterprise';
    if (profile.employment_preference === 'shg_cooperative') {
      enterpriseModel = 'shg_producer_group';
    } else if (profile.employment_preference === 'wage_employment') {
      enterpriseModel = 'wage_employment';
    } else if (profile.employment_preference === 'home_based_production') {
      enterpriseModel = 'home_based_jobwork';
    }

    const actionPlanPayload = {
      livelihood_profile_id: profileId,
      recommendation_id: primaryInserted.id,
      potential_support_category: potentialCategory,
      recommended_enterprise_model: enterpriseModel,
      nearest_training_center_type: 'District ITI / Weavers Service Centre / PMKK Hub',
      implementation_stage: 'pathway_formulated',
      officer_notes: 'Preliminary convergence assessment formulated via NCVET NSQF alignment. Subject to physical document verification and district committee review.',
    };

    const { data: insertedPlan, error: planError } = await supabase
      .from('action_plans')
      .insert([actionPlanPayload])
      .select()
      .single();

    if (planError) {
      console.warn('[generate-recommendations] Action plan creation note:', planError.message);
    }

    // ------------------------------------------------------------------------
    // STEP 7: Return Clean Success Response
    // ------------------------------------------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        livelihood_profile_id: profileId,
        recommendations: insertedRecs,
        action_plan: insertedPlan || actionPlanPayload,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('[generate-recommendations] Uncaught handler exception:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An internal server error occurred while processing recommendations.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
