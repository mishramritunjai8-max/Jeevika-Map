import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { BeneficiaryFormData } from '../types/mapping';
import type {
  BeneficiaryInsert,
  LivelihoodProfile,
  LivelihoodProfileInsert,
} from '../types/database';
import { getActiveOccupations } from './occupationCatalogService';
import { matchProfileToOccupations, type MatchResult } from './recommendationEngine';

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
 * Submits the beneficiary and livelihood profile to Supabase following the
 * strict production sequence:
 * 1. Insert into beneficiaries table with client-generated UUID.
 * 2. Insert into livelihood_profiles table referencing beneficiary_id with client-generated UUID.
 * 3. Invoke deployed Supabase Edge Function: generate-recommendations.
 * 
 * Note on Database RLS:
 * - Public SELECT is strictly denied on beneficiaries and livelihood_profiles for citizen privacy.
 * - By generating valid UUIDs client-side and omitting .select(), inserts execute
 *   without triggering RLS SELECT policy errors.
 * - The Edge Function is the authoritative recommendation engine, executing with
 *   server-side credentials to safely persist recommendations and action_plans.
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

  // Local offline mode fallback if Supabase credentials are not configured
  if (!isSupabaseConfigured()) {
    console.warn('[BeneficiaryService] Running in local offline mode (Supabase unconfigured).');
    const localBeneficiaryId = generateUUID();
    const localProfileId = generateUUID();
    const { data: catalog } = await getActiveOccupations();
    
    const localProfileModel: LivelihoodProfile = {
      id: localProfileId,
      beneficiary_id: localBeneficiaryId,
      primary_skill: formData.existingSkills.primarySkill,
      secondary_skills: formData.existingSkills.secondarySkills || [],
      tool_proficiency: formData.existingSkills.toolProficiency,
      rpl_interest: formData.existingSkills.rplInterest,
      years_experience: mapYearsExperienceToNumber(formData.workExperience.yearsExperience),
      current_trade: formData.workExperience.currentTrade || null,
      monthly_income_range: (formData.workExperience.monthlyIncomeRange as any) || null, // eslint-disable-line @typescript-eslint/no-explicit-any
      is_seasonal: formData.workExperience.isSeasonal,
      formal_education_level: formData.education.formalLevel as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      can_read_write_vernacular: formData.education.canReadWriteVernacular,
      smartphone_usage: formData.education.smartphoneUsage,
      mobility_range: formData.constraints.mobilityRange as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      caregiver_responsibilities: formData.constraints.caregiverResponsibilities,
      financial_constraint: formData.constraints.financialConstraint,
      employment_preference: formData.aspirations.employmentPreference as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      target_monthly_income: formData.aspirations.targetMonthlyIncome || null,
      seeks_toolkit_support: formData.aspirations.needsToolkitFinancing,
      additional_voice_note: formData.aspirations.additionalVoiceNote || null,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const recs = matchProfileToOccupations(localProfileModel, catalog, {
      district: formData.location.district,
      state: formData.location.state,
    });

    return {
      success: true,
      beneficiaryId: localBeneficiaryId,
      livelihoodProfileId: localProfileId,
      recommendations: recs,
    };
  }

  // --------------------------------------------------------------------------
  // STEP 1: Insert Beneficiary Record
  // --------------------------------------------------------------------------
  const beneficiaryId = generateUUID();
  const beneficiaryPayload: BeneficiaryInsert & { id: string } = {
    id: beneficiaryId,
    full_name: formData.basicInfo.fullName.trim(),
    age: ageNum,
    gender: formData.basicInfo.gender as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    caste_category: formData.basicInfo.casteCategory as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    contact_number: formData.basicInfo.contactNumber ? formData.basicInfo.contactNumber.trim() : null,
    state: formData.location.state.trim(),
    district: formData.location.district.trim(),
    block: formData.location.block ? formData.location.block.trim() : null,
    gram_panchayat: formData.location.gramPanchayat ? formData.location.gramPanchayat.trim() : null,
    area_type: formData.location.areaType,
  };

  console.log('[Submission] Beneficiary insert attempted with ID:', beneficiaryId);

  try {
    const { error: benError } = await supabase
      .from('beneficiaries')
      .insert([beneficiaryPayload]);

    if (benError) {
      console.error('[Submission] Beneficiary insert failed:', {
        message: benError.message,
        code: benError.code,
        details: benError.details,
        hint: benError.hint,
      });
      return {
        success: false,
        recommendations: [],
        error: 'Unable to register beneficiary in database: ' + (benError.message || 'Intake rejected.'),
      };
    }

    console.log('[Submission] Beneficiary insert succeeded with ID:', beneficiaryId);
  } catch (err) {
    console.error('[Submission] Network error during beneficiary insert:', err);
    return {
      success: false,
      recommendations: [],
      error: 'Network connection issue while submitting beneficiary details.',
    };
  }

  // --------------------------------------------------------------------------
  // STEP 2: Insert Livelihood Profile Record referencing beneficiaryId
  // --------------------------------------------------------------------------
  const profileId = generateUUID();
  const profilePayload: LivelihoodProfileInsert & { id: string } = {
    id: profileId,
    beneficiary_id: beneficiaryId,
    primary_skill: formData.existingSkills.primarySkill.trim(),
    secondary_skills: formData.existingSkills.secondarySkills || [],
    tool_proficiency: formData.existingSkills.toolProficiency,
    rpl_interest: formData.existingSkills.rplInterest,
    years_experience: mapYearsExperienceToNumber(formData.workExperience.yearsExperience),
    current_trade: formData.workExperience.currentTrade ? formData.workExperience.currentTrade.trim() : null,
    monthly_income_range: (formData.workExperience.monthlyIncomeRange as any) || null, // eslint-disable-line @typescript-eslint/no-explicit-any
    is_seasonal: formData.workExperience.isSeasonal,
    formal_education_level: formData.education.formalLevel as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    can_read_write_vernacular: formData.education.canReadWriteVernacular,
    smartphone_usage: formData.education.smartphoneUsage,
    mobility_range: formData.constraints.mobilityRange as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    caregiver_responsibilities: formData.constraints.caregiverResponsibilities,
    financial_constraint: formData.constraints.financialConstraint,
    employment_preference: formData.aspirations.employmentPreference as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    target_monthly_income: formData.aspirations.targetMonthlyIncome || null,
    seeks_toolkit_support: formData.aspirations.needsToolkitFinancing,
    additional_voice_note: formData.aspirations.additionalVoiceNote ? formData.aspirations.additionalVoiceNote.trim() : null,
    status: 'submitted',
  };

  console.log('[Submission] Livelihood profile insert attempted with ID:', profileId, 'for Beneficiary ID:', beneficiaryId);

  try {
    const { error: profError } = await supabase
      .from('livelihood_profiles')
      .insert([profilePayload]);

    if (profError) {
      console.error('[Submission] Livelihood profile insert failed:', {
        message: profError.message,
        code: profError.code,
        details: profError.details,
        hint: profError.hint,
      });
      return {
        success: false,
        beneficiaryId,
        recommendations: [],
        error: 'Beneficiary registered, but failed to save livelihood profile: ' + (profError.message || 'Intake rejected.'),
      };
    }

    console.log('[Submission] Livelihood profile insert succeeded with ID:', profileId);
  } catch (err) {
    console.error('[Submission] Error during livelihood profile insert:', err);
    return {
      success: false,
      beneficiaryId,
      recommendations: [],
      error: 'Network connection issue while saving livelihood profile.',
    };
  }

  // --------------------------------------------------------------------------
  // STEP 3: Invoke Deployed Edge Function (generate-recommendations)
  // --------------------------------------------------------------------------
  console.log('[Submission] Edge Function generate-recommendations invocation attempted for Profile ID:', profileId);

  try {
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
      'generate-recommendations',
      {
        body: {
          livelihood_profile_id: profileId,
        },
      }
    );

    if (edgeError) {
      console.error('[Submission] Edge Function invocation failed:', {
        message: edgeError.message,
        name: edgeError.name,
      });
      return {
        success: false,
        beneficiaryId,
        livelihoodProfileId: profileId,
        recommendations: [],
        error: 'Server recommendation engine error: ' + (edgeError.message || 'Generation failed.'),
      };
    }

    if (!edgeData || !edgeData.success || !Array.isArray(edgeData.recommendations) || edgeData.recommendations.length === 0) {
      console.error('[Submission] Edge Function returned unsuccessful payload:', edgeData);
      return {
        success: false,
        beneficiaryId,
        livelihoodProfileId: profileId,
        recommendations: [],
        error: edgeData?.error || 'Convergence engine did not generate valid recommendations.',
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
    return {
      success: false,
      beneficiaryId,
      livelihoodProfileId: profileId,
      recommendations: [],
      error: 'Network timeout while contacting convergence recommendation engine.',
    };
  }
};
