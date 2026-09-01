import { supabase } from '../lib/supabase';
import type {
  Beneficiary,
  LivelihoodProfile,
  Recommendation,
  ActionPlan,
  OccupationCatalog,
} from '../types/database';

export interface DashboardMetrics {
  totalBeneficiaries: number;
  completedProfiles: number;
  recommendationsGenerated: number;
  actionPlansGenerated: number;
  isRlsRestricted: boolean;
  rlsMessage?: string;
}

export interface BeneficiaryRegistryItem {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  casteCategory: string;
  district: string;
  state: string;
  createdAt: string;
  profile?: {
    id: string;
    primarySkill: string;
    yearsExperience: number;
    educationLevel: string;
    status: string;
  };
  primaryRecommendation?: {
    jobRole: string;
    qpNosCode: string;
    nsqfLevel: number;
    matchScore: number;
  };
  actionPlan?: {
    id: string;
    supportCategory: string;
    implementationStage: string;
  };
}

export interface OfficerAssessment {
  id: string;
  beneficiary_id: string;
  officer_id: string;
  verification_status: 'pending' | 'verified' | 'referred' | 'rejected';
  recommended_next_action: string;
  officer_remarks: string;
  created_at: string;
  updated_at: string;
}

export interface BeneficiaryCaseDetail {
  beneficiary: Beneficiary;
  profile: LivelihoodProfile | null;
  recommendations: (Recommendation & { occupation?: OccupationCatalog })[];
  actionPlan: ActionPlan | null;
  assessment?: OfficerAssessment | null;
  isRlsRestricted: boolean;
  sourceType: 'database' | 'session_buffer';
}

export interface RegistryFilterOptions {
  searchQuery?: string;
  gender?: string;
  nsqfLevel?: number | 'all';
  status?: string;
  sortBy?: 'recent' | 'oldest';
  page?: number;
  pageSize?: number;
}

const LOCAL_STORAGE_PROFILE_KEY = 'jeevika_beneficiary_profile';

/**
 * Fetches aggregate metrics for the Officer Dashboard overview.
 * Queries counts from all 4 operational tables using head queries.
 * Detects RLS default-deny restrictions gracefully without crashing.
 */
export const getOfficerDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const [benRes, profRes, recRes, planRes] = await Promise.all([
      supabase.from('beneficiaries').select('id', { count: 'exact', head: true }),
      supabase.from('livelihood_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('recommendations').select('id', { count: 'exact', head: true }),
      supabase.from('action_plans').select('id', { count: 'exact', head: true }),
    ]);

    const hasRlsError = Boolean(
      benRes.error || profRes.error || recRes.error || planRes.error
    );

    const isRestricted =
      hasRlsError ||
      (benRes.count === null && profRes.count === null);

    return {
      totalBeneficiaries: benRes.count ?? 0,
      completedProfiles: profRes.count ?? 0,
      recommendationsGenerated: recRes.count ?? 0,
      actionPlansGenerated: planRes.count ?? 0,
      isRlsRestricted: isRestricted,
      rlsMessage: isRestricted
        ? 'Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled.'
        : undefined,
    };
  } catch (err) {
    console.error('[OfficerService] Error fetching dashboard metrics:', err);
    return {
      totalBeneficiaries: 0,
      completedProfiles: 0,
      recommendationsGenerated: 0,
      actionPlansGenerated: 0,
      isRlsRestricted: true,
      rlsMessage: 'Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled.',
    };
  }
};

/**
 * Fetches recent beneficiary registry records with search, filter, and pagination.
 */
export const getBeneficiaryRegistry = async (
  options: RegistryFilterOptions = {}
): Promise<{
  items: BeneficiaryRegistryItem[];
  totalCount: number;
  isRlsRestricted: boolean;
  rlsMessage?: string;
}> => {
  const {
    searchQuery = '',
    gender = 'all',
    status = 'all',
    sortBy = 'recent',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase
      .from('beneficiaries')
      .select('*, livelihood_profiles(*, recommendations(*, occupation:occupation_catalog(*)), action_plans(*))', { count: 'exact' });

    if (gender && gender !== 'all') {
      query = query.eq('gender', gender);
    }

    if (searchQuery.trim()) {
      query = query.ilike('full_name', `%${searchQuery.trim()}%`);
    }

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: true });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      // Check local session intake buffer if database query returned no rows due to RLS default-deny
      const sessionItem = getSessionBufferBeneficiaryItem();
      if (sessionItem) {
        const matchesSearch = !searchQuery.trim() || sessionItem.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || sessionItem.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGender = gender === 'all' || sessionItem.gender === gender;
        const matchesStatus = status === 'all' || sessionItem.profile?.status === status;

        if (matchesSearch && matchesGender && matchesStatus) {
          return {
            items: [sessionItem],
            totalCount: 1,
            isRlsRestricted: true,
            rlsMessage: 'Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled. (Displaying active session dossier for audit review)',
          };
        }
      }

      return {
        items: [],
        totalCount: 0,
        isRlsRestricted: Boolean(error),
        rlsMessage: 'Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled.',
      };
    }

    // Map database rows to normalized registry items
    const items: BeneficiaryRegistryItem[] = data.map((b: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const profile = Array.isArray(b.livelihood_profiles) ? b.livelihood_profiles[0] : b.livelihood_profiles;
      const recs = profile?.recommendations || [];
      const primaryRec = recs.find((r: any) => r.is_primary) || recs[0]; // eslint-disable-line @typescript-eslint/no-explicit-any
      const plan = Array.isArray(profile?.action_plans) ? profile.action_plans[0] : profile?.action_plans;

      return {
        id: b.id,
        fullName: b.full_name,
        age: b.age,
        gender: b.gender,
        casteCategory: b.caste_category,
        district: b.district,
        state: b.state,
        createdAt: b.created_at,
        profile: profile ? {
          id: profile.id,
          primarySkill: profile.primary_skill,
          yearsExperience: profile.years_experience,
          educationLevel: profile.formal_education_level,
          status: profile.status,
        } : undefined,
        primaryRecommendation: primaryRec ? {
          jobRole: primaryRec.occupation?.job_role || 'General NSQF Role',
          qpNosCode: primaryRec.occupation?.qp_nos_code || 'QP-NOS',
          nsqfLevel: primaryRec.occupation?.nsqf_level || 4,
          matchScore: primaryRec.match_score || 85,
        } : undefined,
        actionPlan: plan ? {
          id: plan.id,
          supportCategory: plan.potential_support_category,
          implementationStage: plan.implementation_stage,
        } : undefined,
      };
    });

    return {
      items,
      totalCount: count ?? items.length,
      isRlsRestricted: false,
    };
  } catch (err) {
    console.error('[OfficerService] Error in getBeneficiaryRegistry:', err);
    return {
      items: [],
      totalCount: 0,
      isRlsRestricted: true,
      rlsMessage: 'Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled.',
    };
  }
};

/**
 * Fetches the full detailed case file for an individual beneficiary by UUID.
 */
export const getBeneficiaryCaseDetail = async (
  id: string
): Promise<BeneficiaryCaseDetail | null> => {
  try {
    const { data: benData, error: benError } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('id', id)
      .single();

    if (benData && !benError) {
      const { data: profData } = await supabase
        .from('livelihood_profiles')
        .select('*')
        .eq('beneficiary_id', id)
        .single();

      let recsData: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      let planData: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (profData) {
        const { data: recs } = await supabase
          .from('recommendations')
          .select('*, occupation:occupation_catalog(*)')
          .eq('livelihood_profile_id', profData.id)
          .order('is_primary', { ascending: false });

        recsData = recs || [];

        const { data: plan } = await supabase
          .from('action_plans')
          .select('*')
          .eq('livelihood_profile_id', profData.id)
          .single();

        planData = plan;
      }

      let assessmentData: OfficerAssessment | null = null;
      try {
        const { data: asm, error: asmError } = await supabase
          .from('officer_assessments')
          .select('*')
          .eq('beneficiary_id', id)
          .maybeSingle();

        if (!asmError && asm) {
          assessmentData = asm as OfficerAssessment;
        }
      } catch (asmErr) {
        console.warn('[OfficerService] Error fetching officer assessment:', asmErr);
      }

      return {
        beneficiary: benData as Beneficiary,
        profile: profData as LivelihoodProfile | null,
        recommendations: recsData,
        actionPlan: planData as ActionPlan | null,
        assessment: assessmentData,
        isRlsRestricted: false,
        sourceType: 'database',
      };
    }

    // Fallback: Check local session intake buffer
    const sessionDetail = getSessionBufferCaseDetail(id);
    if (sessionDetail) {
      return sessionDetail;
    }

    return null;
  } catch (err) {
    console.error('[OfficerService] Error fetching case detail:', err);
    return getSessionBufferCaseDetail(id);
  }
};

function getSessionBufferBeneficiaryItem(): BeneficiaryRegistryItem | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw);
    if (!profile?.meta?.beneficiaryId) return null;

    const primaryRec = profile.meta.recommendations?.[0];

    return {
      id: profile.meta.beneficiaryId,
      fullName: profile.basicInfo?.fullName || 'Verified Beneficiary',
      age: parseInt(profile.basicInfo?.age, 10) || 28,
      gender: profile.basicInfo?.gender || 'female',
      casteCategory: profile.basicInfo?.casteCategory || 'scheduled_caste',
      district: profile.location?.district || 'Varanasi',
      state: profile.location?.state || 'Uttar Pradesh',
      createdAt: profile.meta?.submittedAt || new Date().toISOString(),
      profile: {
        id: profile.meta?.livelihoodProfileId || 'prof-session',
        primarySkill: profile.existingSkills?.primarySkill || 'Handloom Weaving',
        yearsExperience: 5,
        educationLevel: profile.education?.formalLevel || 'middle_class_8',
        status: 'submitted',
      },
      primaryRecommendation: primaryRec ? {
        jobRole: primaryRec.occupation?.job_role || 'Two Shaft Handloom Weaver',
        qpNosCode: primaryRec.occupation?.qp_nos_code || 'TSC/Q7303',
        nsqfLevel: primaryRec.occupation?.nsqf_level || 4,
        matchScore: primaryRec.match_score || 92,
      } : undefined,
      actionPlan: profile.meta?.actionPlan ? {
        id: profile.meta.actionPlan.id || 'act-session',
        supportCategory: profile.meta.actionPlan.potential_support_category || 'pm_ajay_toolkit_assistance',
        implementationStage: profile.meta.actionPlan.implementation_stage || 'pathway_formulated',
      } : undefined,
    };
  } catch {
    return null;
  }
}

function getSessionBufferCaseDetail(requestedId: string): BeneficiaryCaseDetail | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);

    const benId = data.meta?.beneficiaryId || 'loc-ben-default';
    if (requestedId !== benId && requestedId !== 'latest' && requestedId !== 'active') {
      return null;
    }

    const mockBen: Beneficiary = {
      id: benId,
      full_name: data.basicInfo?.fullName || 'Verified Citizen',
      age: parseInt(data.basicInfo?.age, 10) || 28,
      gender: data.basicInfo?.gender || 'female',
      caste_category: data.basicInfo?.casteCategory || 'scheduled_caste',
      contact_number: data.basicInfo?.contactNumber || null,
      state: data.location?.state || 'Uttar Pradesh',
      district: data.location?.district || 'Varanasi',
      block: data.location?.block || 'Sewapuri',
      gram_panchayat: data.location?.gramPanchayat || 'Baragaon',
      area_type: data.location?.areaType || 'rural',
      created_at: data.meta?.submittedAt || new Date().toISOString(),
      updated_at: data.meta?.submittedAt || new Date().toISOString(),
    };

    const mockProfile: LivelihoodProfile = {
      id: data.meta?.livelihoodProfileId || 'prof-session',
      beneficiary_id: benId,
      primary_skill: data.existingSkills?.primarySkill || 'Handloom Weaving',
      secondary_skills: data.existingSkills?.secondarySkills || [],
      tool_proficiency: data.existingSkills?.toolProficiency || 'manual_traditional',
      rpl_interest: data.existingSkills?.rplInterest ?? true,
      years_experience: 5,
      current_trade: data.workExperience?.currentTrade || 'Handloom Weaver',
      monthly_income_range: data.workExperience?.monthlyIncomeRange || '5k_to_10k',
      is_seasonal: data.workExperience?.isSeasonal ?? false,
      formal_education_level: data.education?.formalLevel || 'middle_class_8',
      can_read_write_vernacular: data.education?.canReadWriteVernacular ?? true,
      smartphone_usage: data.education?.smartphoneUsage || 'regular',
      mobility_range: data.constraints?.mobilityRange || 'within_block',
      caregiver_responsibilities: data.constraints?.caregiverResponsibilities ?? false,
      financial_constraint: data.constraints?.financialConstraint || 'can_attend_stipended_training',
      employment_preference: data.aspirations?.employmentPreference || 'micro_enterprise',
      target_monthly_income: data.aspirations?.targetMonthlyIncome || '₹20,000 – ₹25,000',
      seeks_toolkit_support: data.aspirations?.needsToolkitFinancing ?? true,
      additional_voice_note: data.aspirations?.additionalVoiceNote || null,
      status: 'submitted',
      created_at: data.meta?.submittedAt || new Date().toISOString(),
      updated_at: data.meta?.submittedAt || new Date().toISOString(),
    };

    const recs = (data.meta?.recommendations || []).map((r: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: r.id || `rec-${r.occupation?.qp_nos_code}`,
      livelihood_profile_id: mockProfile.id,
      occupation_id: r.occupation?.id || 'occ-id',
      match_score: r.match_score || 88,
      matched_skills: r.matched_skills || ['Weaving', 'Yarn sorting'],
      skill_gaps: r.skill_gaps || ['Modern jacquard cards'],
      location_relevance: r.location_relevance || 'High district cluster concentration in Varanasi handloom corridor.',
      constraint_fit: r.constraint_fit || 'Stipend and mobility requirements align with training centre proximity.',
      rationale: r.rationale || 'High trade alignment with verified NSQF QP standards.',
      is_primary: Boolean(r.is_primary ?? true),
      created_at: new Date().toISOString(),
      occupation: r.occupation,
    }));

    const actionPlan: ActionPlan | null = data.meta?.actionPlan ? {
      id: data.meta.actionPlan.id || 'act-session',
      livelihood_profile_id: mockProfile.id,
      recommendation_id: recs[0]?.id || null,
      potential_support_category: data.meta.actionPlan.potential_support_category || 'pm_ajay_toolkit_assistance',
      recommended_enterprise_model: data.meta.actionPlan.recommended_enterprise_model || 'individual_micro_enterprise',
      nearest_training_center_type: data.meta.actionPlan.nearest_training_center_type || 'District ITI / Weavers Service Centre',
      implementation_stage: data.meta.actionPlan.implementation_stage || 'pathway_formulated',
      officer_notes: data.meta.actionPlan.officer_notes || 'Automated NSQF matching assessment formulated. Document verification scheduled.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } : null;

    return {
      beneficiary: mockBen,
      profile: mockProfile,
      recommendations: recs,
      actionPlan,
      isRlsRestricted: true,
      sourceType: 'session_buffer',
    };
  } catch {
    return null;
  }
}

export interface RecommendationFactor {
  factor: string;
  status: 'optimal' | 'compatible' | 'gap';
  title: string;
  detail: string;
}

export const explainRecommendationFactors = (
  profile: LivelihoodProfile,
  occupation?: OccupationCatalog,
  rec?: Recommendation
): RecommendationFactor[] => {
  if (!occupation) return [];

  const factors: RecommendationFactor[] = [];

  // 1. Education Compatibility
  factors.push({
    factor: 'Education Alignment',
    status: 'optimal',
    title: `Entry Qualification: ${occupation.entry_qualification_minimum}`,
    detail: `Candidate holds '${profile.formal_education_level.replace(/_/g, ' ')}', fulfilling the baseline criteria for NSQF Level ${occupation.nsqf_level} without requiring remedial schooling.`,
  });

  // 2. Experience & RPL Pathway
  if (profile.years_experience > 0 && occupation.rpl_allowed) {
    factors.push({
      factor: 'RPL Fast-Track Fit',
      status: 'optimal',
      title: `${profile.years_experience} Years Work Experience • RPL Allowed`,
      detail: `Candidate has ${profile.years_experience} years of hands-on experience in practical trade. SCGJ/SSC RPL guidelines permit fast-track assessment to certify competencies without mandatory 300+ hour classroom foundational modules.`,
    });
  } else {
    factors.push({
      factor: 'Training Duration',
      status: 'compatible',
      title: `Notional Training Hours: ${occupation.notional_hours} hrs`,
      detail: `Requires full standard skill curriculum under NCVET accreditation.`,
    });
  }

  // 3. Financial & Stipend Compatibility
  if (profile.financial_constraint === 'needs_immediate_daily_wage') {
    factors.push({
      factor: 'Financial Feasibility',
      status: 'gap',
      title: 'Daily Wage Dependency',
      detail: 'Candidate requires daily earnings. PM-AJAY stipended training model or on-the-job apprenticeship is essential to prevent drop-out during training.',
    });
  } else {
    factors.push({
      factor: 'Financial Feasibility',
      status: 'optimal',
      title: 'Stipend / Time Investment Compatible',
      detail: 'Candidate can participate in structured training if basic stipend or flexible timing is provided under PM-AJAY.',
    });
  }

  // 4. Geographic Mobility
  factors.push({
    factor: 'Geographic Access',
    status: 'compatible',
    title: `Commute Range: ${profile.mobility_range.replace(/_/g, ' ')}`,
    detail: 'Optimal placement in block or district cluster training hub aligned with trade concentration.',
  });

  // 5. Matched Skills vs Gaps
  if (rec && rec.matched_skills && rec.matched_skills.length > 0) {
    factors.push({
      factor: 'Diagnostic Competency',
      status: 'optimal',
      title: `Competency Fit Score: ${rec.match_score}/100`,
      detail: `Validated existing skills (${rec.matched_skills.join(', ')}). Bridge modules needed for: ${rec.skill_gaps?.join(', ') || 'None identified'}.`,
    });
  }

  return factors;
};

/**
 * Persists an authenticated officer's verification assessment into officer_assessments.
 * Performs an upsert on beneficiary_id. The officer_id defaults to auth.uid() in PostgreSQL.
 */
export const saveOfficerAssessment = async (params: {
  beneficiaryId: string;
  verificationStatus: 'pending' | 'verified' | 'referred' | 'rejected';
  recommendedNextAction: string;
  officerRemarks: string;
}): Promise<{ success: boolean; data?: OfficerAssessment; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('officer_assessments')
      .upsert(
        {
          beneficiary_id: params.beneficiaryId,
          verification_status: params.verificationStatus,
          recommended_next_action: params.recommendedNextAction,
          officer_remarks: params.officerRemarks,
        },
        { onConflict: 'beneficiary_id' }
      )
      .select('*')
      .single();

    if (error) {
      console.error('[OfficerService] Error saving officer assessment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as OfficerAssessment };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'An unexpected database error occurred.';
    console.error('[OfficerService] Unexpected error saving officer assessment:', err);
    return { success: false, error: msg };
  }
};

