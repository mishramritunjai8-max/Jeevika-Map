import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { BeneficiaryFormData } from '../types/mapping';
import type {
  BeneficiaryInsert,
  LivelihoodProfile,
  LivelihoodProfileInsert,
} from '../types/database';
import { getActiveOccupations } from './occupationCatalogService';
import { matchProfileToOccupations, type MatchResult } from './recommendationEngine';
import { enqueueCitizenIntake } from './offline/offlineQueueService';

export interface SubmissionResponse {
  success: boolean;
  beneficiaryId?: string;
  livelihoodProfileId?: string;
  recommendations: MatchResult[];
  actionPlan?: {
    id?: string;
    potential_support_category?: string;
    recommended_enterprise_model?: string;
    nearest_training_center_type?: string;
    implementation_stage?: string;
    officer_notes?: string;
  };
  isOffline?: boolean;
  error?: string;
}

/**
 * Standard RFC4122 v4 UUID generator safe for browser environments
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Converts UI experience string key to an INTEGER meeting the
 * DB constraint: CHECK (years_experience >= 0 AND years_experience <= 70)
 */
export const mapYearsExperienceToNumber = (val: string): number => {
  if (val === 'less_than_1') return 0;
  if (val === '1_to_3_years') return 2;
  if (val === '4_to_7_years') return 5;
  if (val === '8_plus_years') return 8;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : Math.min(70, Math.max(0, parsed));
};

/**
 * Constructs the typed Beneficiary database payload
 */
export const createBeneficiaryPayload = (
  beneficiaryId: string,
  formData: BeneficiaryFormData
): BeneficiaryInsert & { id: string } => {
  const ageNum = parseInt(formData.basicInfo.age, 10) || 25;
  return {
    id: beneficiaryId,
    full_name: formData.basicInfo.fullName.trim(),
    age: ageNum,
    gender: formData.basicInfo.gender as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    caste_category: (formData.basicInfo.casteCategory || 'scheduled_caste') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    contact_number: formData.basicInfo.contactNumber ? formData.basicInfo.contactNumber.trim() : null,
    state: (formData.location.state || 'Uttar Pradesh').trim(),
    district: formData.location.district.trim(),
    block: formData.location.block ? formData.location.block.trim() : null,
    gram_panchayat: formData.location.gramPanchayat ? formData.location.gramPanchayat.trim() : null,
    area_type: formData.location.areaType || 'rural',
  };
};

/**
 * Constructs the typed LivelihoodProfile database payload
 */
export const createLivelihoodProfilePayload = (
  profileId: string,
  beneficiaryId: string,
  formData: BeneficiaryFormData
): LivelihoodProfileInsert & { id: string } => {
  return {
    id: profileId,
    beneficiary_id: beneficiaryId,
    primary_skill: formData.existingSkills.primarySkill.trim(),
    secondary_skills: formData.existingSkills.secondarySkills || [],
    tool_proficiency: formData.existingSkills.toolProficiency || 'manual_traditional',
    rpl_interest: formData.existingSkills.rplInterest ?? true,
    years_experience: mapYearsExperienceToNumber(formData.workExperience.yearsExperience),
    current_trade: formData.workExperience.currentTrade ? formData.workExperience.currentTrade.trim() : null,
    monthly_income_range: (formData.workExperience.monthlyIncomeRange as any) || null, // eslint-disable-line @typescript-eslint/no-explicit-any
    is_seasonal: formData.workExperience.isSeasonal ?? false,
    formal_education_level: (formData.education.formalLevel || 'middle_class_8') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    can_read_write_vernacular: formData.education.canReadWriteVernacular ?? true,
    smartphone_usage: formData.education.smartphoneUsage || 'basic_calls',
    mobility_range: (formData.constraints.mobilityRange || 'within_block') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    caregiver_responsibilities: formData.constraints.caregiverResponsibilities ?? false,
    financial_constraint: formData.constraints.financialConstraint || 'can_attend_stipended_training',
    employment_preference: (formData.aspirations.employmentPreference || 'micro_enterprise') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    target_monthly_income: formData.aspirations.targetMonthlyIncome || null,
    seeks_toolkit_support: formData.aspirations.needsToolkitFinancing ?? true,
    additional_voice_note: formData.aspirations.additionalVoiceNote ? formData.aspirations.additionalVoiceNote.trim() : null,
    status: 'submitted',
  };
};

/**
 * Formulates a local convergence action plan for offline feedback
 */
export const createLocalActionPlan = (
  formData: BeneficiaryFormData,
  primaryRecId?: string
) => {
  let potentialCategory = 'pm_ajay_skill_training';
  if (formData.aspirations.needsToolkitFinancing) {
    potentialCategory = 'pm_ajay_toolkit_assistance';
  } else if (formData.aspirations.employmentPreference === 'shg_cooperative') {
    potentialCategory = 'shg_cfc_incubation';
  } else if (formData.aspirations.employmentPreference === 'wage_employment') {
    potentialCategory = 'wage_placement_facilitation';
  }

  let enterpriseModel = 'individual_micro_enterprise';
  if (formData.aspirations.employmentPreference === 'shg_cooperative') {
    enterpriseModel = 'shg_producer_group';
  } else if (formData.aspirations.employmentPreference === 'wage_employment') {
    enterpriseModel = 'wage_employment';
  } else if (formData.aspirations.employmentPreference === 'home_based_production') {
    enterpriseModel = 'home_based_jobwork';
  }

  return {
    id: `local-act-${generateUUID().slice(0, 8)}`,
    recommendation_id: primaryRecId || null,
    potential_support_category: potentialCategory,
    recommended_enterprise_model: enterpriseModel,
    nearest_training_center_type: 'District ITI / Weavers Service Centre / PMKK Hub',
    implementation_stage: 'pathway_formulated',
    officer_notes: 'Offline assessment formulated via local NCVET NSQF alignment. Stored in sync queue for automatic server persistence when internet returns.',
  };
};

/**
 * Determines if an error is a transient network/connection failure
 */
export const isNetworkError = (error: unknown): boolean => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return true;
  }
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('fetch failed') ||
    msg.includes('timeout') ||
    msg.includes('Network connection') ||
    msg.includes('Network timeout') ||
    msg.includes('AbortError')
  );
};

/**
 * Submits the beneficiary and livelihood profile.
 *
 * ONLINE FLOW:
 * 1. Insert into beneficiaries table with client-generated UUID (omits .select()).
 * 2. Insert into livelihood_profiles table referencing beneficiary_id (omits .select()).
 * 3. Invoke deployed Supabase Edge Function: generate-recommendations.
 *
 * OFFLINE / NETWORK FAILURE FLOW:
 * 1. Generate / preserve client-side UUIDs.
 * 2. Store complete submission in IndexedDB sync_queue.
 * 3. Run client-side recommendation engine (matchProfileToOccupations) using cached catalog.
 * 4. Return successful local response for immediate /profile viewing and seamless background sync.
 */
export const submitLivelihoodMapping = async (
  formData: BeneficiaryFormData
): Promise<SubmissionResponse> => {
  console.log('[Submission] Submission flow initiated.');

  // Validate age constraint (14 - 100)
  const ageNum = parseInt(formData.basicInfo.age, 10);
  if (isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
    console.warn('[Submission] Age validation failed:', formData.basicInfo.age);
    return {
      success: false,
      recommendations: [],
      error: 'Invalid age: Must be between 14 and 100 as per PM-AJAY criteria.',
    };
  }

  // Pre-generate authoritative client-side UUIDs
  const beneficiaryId = generateUUID();
  const profileId = generateUUID();

  // Helper to execute offline fallback and enqueue
  const handleOfflineSubmission = async (
    beneficiaryAlreadyInserted = false,
    profileAlreadyInserted = false
  ): Promise<SubmissionResponse> => {
    console.log('[Submission] Processing as offline submission with Sync Queue...');
    try {
      await enqueueCitizenIntake({
        beneficiaryId,
        profileId,
        formData,
        beneficiaryInserted: beneficiaryAlreadyInserted,
        profileInserted: profileAlreadyInserted,
      });

      const { data: catalog } = await getActiveOccupations();
      const localProfileModel: LivelihoodProfile = {
        id: profileId,
        beneficiary_id: beneficiaryId,
        primary_skill: formData.existingSkills.primarySkill,
        secondary_skills: formData.existingSkills.secondarySkills || [],
        tool_proficiency: formData.existingSkills.toolProficiency || 'manual_traditional',
        rpl_interest: formData.existingSkills.rplInterest ?? true,
        years_experience: mapYearsExperienceToNumber(formData.workExperience.yearsExperience),
        current_trade: formData.workExperience.currentTrade || null,
        monthly_income_range: (formData.workExperience.monthlyIncomeRange as any) || null, // eslint-disable-line @typescript-eslint/no-explicit-any
        is_seasonal: formData.workExperience.isSeasonal ?? false,
        formal_education_level: (formData.education.formalLevel || 'middle_class_8') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        can_read_write_vernacular: formData.education.canReadWriteVernacular ?? true,
        smartphone_usage: formData.education.smartphoneUsage || 'basic_calls',
        mobility_range: (formData.constraints.mobilityRange || 'within_block') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        caregiver_responsibilities: formData.constraints.caregiverResponsibilities ?? false,
        financial_constraint: formData.constraints.financialConstraint || 'can_attend_stipended_training',
        employment_preference: (formData.aspirations.employmentPreference || 'micro_enterprise') as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        target_monthly_income: formData.aspirations.targetMonthlyIncome || null,
        seeks_toolkit_support: formData.aspirations.needsToolkitFinancing ?? true,
        additional_voice_note: formData.aspirations.additionalVoiceNote || null,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const recs = matchProfileToOccupations(localProfileModel, catalog, {
        district: formData.location.district,
        state: formData.location.state,
      });

      const actionPlan = createLocalActionPlan(formData, recs[0]?.occupation?.id);

      return {
        success: true,
        isOffline: true,
        beneficiaryId,
        livelihoodProfileId: profileId,
        recommendations: recs,
        actionPlan,
      };
    } catch (queueErr) {
      console.error('[Submission] Failed to enqueue offline intake:', queueErr);
      return {
        success: false,
        recommendations: [],
        error: 'Offline storage failed. Please ensure storage permissions are granted.',
      };
    }
  };

  // --------------------------------------------------------------------------
  // Condition 1: Device is explicitly OFFLINE or Supabase is unconfigured
  // --------------------------------------------------------------------------
  if ((typeof navigator !== 'undefined' && !navigator.onLine) || !isSupabaseConfigured()) {
    return await handleOfflineSubmission();
  }

  // --------------------------------------------------------------------------
  // Condition 2: Device is ONLINE — Execute Supabase intake sequence
  // --------------------------------------------------------------------------
  let benInserted = false;
  let profInserted = false;

  const beneficiaryPayload = createBeneficiaryPayload(beneficiaryId, formData);
  const profilePayload = createLivelihoodProfilePayload(profileId, beneficiaryId, formData);

  // STEP 1: Insert Beneficiary Record
  try {
    console.log('[Submission] Beneficiary insert attempted with ID:', beneficiaryId);
    const { error: benError } = await supabase
      .from('beneficiaries')
      .insert([beneficiaryPayload]);

    if (benError) {
      console.error('[Submission] Beneficiary insert error:', benError);
      if (isNetworkError(benError)) {
        return await handleOfflineSubmission(false, false);
      }
      return {
        success: false,
        recommendations: [],
        error: 'Unable to register beneficiary: ' + (benError.message || 'Intake rejected.'),
      };
    }
    benInserted = true;
    console.log('[Submission] Beneficiary insert succeeded with ID:', beneficiaryId);
  } catch (err) {
    console.error('[Submission] Network exception during beneficiary insert:', err);
    if (isNetworkError(err)) {
      return await handleOfflineSubmission(false, false);
    }
    return {
      success: false,
      recommendations: [],
      error: 'Network connection issue while submitting beneficiary details.',
    };
  }

  // STEP 2: Insert Livelihood Profile Record
  try {
    console.log('[Submission] Livelihood profile insert attempted with ID:', profileId);
    const { error: profError } = await supabase
      .from('livelihood_profiles')
      .insert([profilePayload]);

    if (profError) {
      console.error('[Submission] Livelihood profile insert error:', profError);
      if (isNetworkError(profError)) {
        return await handleOfflineSubmission(benInserted, false);
      }
      return {
        success: false,
        beneficiaryId,
        recommendations: [],
        error: 'Beneficiary registered, but failed to save livelihood profile: ' + (profError.message || 'Intake rejected.'),
      };
    }
    profInserted = true;
    console.log('[Submission] Livelihood profile insert succeeded with ID:', profileId);
  } catch (err) {
    console.error('[Submission] Network exception during livelihood profile insert:', err);
    if (isNetworkError(err)) {
      return await handleOfflineSubmission(benInserted, false);
    }
    return {
      success: false,
      beneficiaryId,
      recommendations: [],
      error: 'Network connection issue while saving livelihood profile.',
    };
  }

  // STEP 3: Invoke Deployed Edge Function (generate-recommendations)
  try {
    console.log('[Submission] Edge Function generate-recommendations invocation attempted for Profile ID:', profileId);
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
      'generate-recommendations',
      {
        body: {
          livelihood_profile_id: profileId,
        },
      }
    );

    if (edgeError) {
      console.warn('[Submission] Edge Function invocation failed, queueing for background recovery:', edgeError);
      if (isNetworkError(edgeError)) {
        return await handleOfflineSubmission(benInserted, profInserted);
      }
      return {
        success: false,
        beneficiaryId,
        livelihoodProfileId: profileId,
        recommendations: [],
        error: 'Server recommendation engine error: ' + (edgeError.message || 'Generation failed.'),
      };
    }

    if (!edgeData || !edgeData.success || !Array.isArray(edgeData.recommendations) || edgeData.recommendations.length === 0) {
      console.warn('[Submission] Edge Function returned empty payload, calculating local recommendations:', edgeData);
      // Fall back gracefully to local matching so user is not blocked
      const { data: catalog } = await getActiveOccupations();
      const localProfileModel: LivelihoodProfile = {
        ...profilePayload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const recs = matchProfileToOccupations(localProfileModel, catalog, {
        district: formData.location.district,
        state: formData.location.state,
      });
      const actionPlan = createLocalActionPlan(formData, recs[0]?.occupation?.id);

      return {
        success: true,
        beneficiaryId,
        livelihoodProfileId: profileId,
        recommendations: recs,
        actionPlan,
      };
    }

    console.log(
      '[Submission] Edge Function invocation succeeded. Recommendations:',
      edgeData.recommendations.length,
      'Action plan generated:',
      Boolean(edgeData.action_plan)
    );

    return {
      success: true,
      beneficiaryId,
      livelihoodProfileId: profileId,
      recommendations: edgeData.recommendations,
      actionPlan: edgeData.action_plan,
    };
  } catch (err) {
    console.error('[Submission] Network error during Edge Function invocation:', err);
    return await handleOfflineSubmission(benInserted, profInserted);
  }
};

