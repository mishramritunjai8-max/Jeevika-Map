// ==============================================================================
// Database Entity Types for Jeevika Map Supabase Integration
// Matches the 5 core tables and their exact database column names
// ==============================================================================

export type Gender = 'female' | 'male' | 'transgender' | 'other';

export type CasteCategory =
  | 'scheduled_caste'
  | 'scheduled_tribe'
  | 'other_backward_class'
  | 'general';

export type AreaType = 'rural' | 'semi_urban' | 'urban';

export type ToolProficiency =
  | 'manual_traditional'
  | 'power_tools'
  | 'basic_machinery'
  | 'none';

export type MonthlyIncomeRange =
  | 'under_5k'
  | '5k_to_10k'
  | '10k_to_15k'
  | 'above_15k';

export type FormalEducationLevel =
  | 'no_formal_education'
  | 'primary_class_5'
  | 'middle_class_8'
  | 'secondary_class_10'
  | 'higher_secondary_class_12'
  | 'diploma_iti'
  | 'graduate_above';

export type SmartphoneUsage = 'regular' | 'basic_calls' | 'no_phone';

export type MobilityRange =
  | 'within_village'
  | 'within_block'
  | 'within_district'
  | 'nearby_districts'
  | 'anywhere_in_state';

export type FinancialConstraint =
  | 'needs_immediate_daily_wage'
  | 'can_attend_stipended_training'
  | 'can_invest_time';

export type EmploymentPreference =
  | 'micro_enterprise'
  | 'wage_employment'
  | 'shg_cooperative'
  | 'home_based_production';

export type ProfileStatus = 'draft' | 'submitted' | 'archived';

export type PotentialSupportCategory =
  | 'pm_ajay_skill_training'
  | 'pm_ajay_toolkit_assistance'
  | 'shg_cfc_incubation'
  | 'direct_enterprise_credit_linkage'
  | 'wage_placement_facilitation';

export type RecommendedEnterpriseModel =
  | 'individual_micro_enterprise'
  | 'shg_producer_group'
  | 'wage_employment'
  | 'home_based_jobwork';

export type ImplementationStage =
  | 'pathway_formulated'
  | 'counseling_pending'
  | 'mobilization_scheduled'
  | 'training_enrolled'
  | 'completed';

// ------------------------------------------------------------------------------
// 1. Beneficiary Table
// ------------------------------------------------------------------------------
export interface Beneficiary {
  id: string;
  full_name: string;
  age: number;
  gender: Gender;
  caste_category: CasteCategory;
  contact_number: string | null;
  state: string;
  district: string;
  block: string | null;
  gram_panchayat: string | null;
  area_type: AreaType;
  created_at: string;
  updated_at: string;
}

export type BeneficiaryInsert = Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// ------------------------------------------------------------------------------
// 2. Livelihood Profile Table
// ------------------------------------------------------------------------------
export interface LivelihoodProfile {
  id: string;
  beneficiary_id: string;
  primary_skill: string;
  secondary_skills: string[];
  tool_proficiency: ToolProficiency;
  rpl_interest: boolean;
  years_experience: number;
  current_trade: string | null;
  monthly_income_range: MonthlyIncomeRange | null;
  is_seasonal: boolean;
  formal_education_level: FormalEducationLevel;
  can_read_write_vernacular: boolean;
  smartphone_usage: SmartphoneUsage;
  mobility_range: MobilityRange;
  caregiver_responsibilities: boolean;
  financial_constraint: FinancialConstraint;
  employment_preference: EmploymentPreference;
  target_monthly_income: string | null;
  seeks_toolkit_support: boolean;
  additional_voice_note: string | null;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export type LivelihoodProfileInsert = Omit<LivelihoodProfile, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// ------------------------------------------------------------------------------
// 3. Occupation Catalog Table (Controlled Official NSQF Reference Data)
// ------------------------------------------------------------------------------
export interface OccupationCatalog {
  id: string;
  qp_nos_code: string;
  job_role: string;
  sector_skill_council: string;
  nsqf_level: number;
  notional_hours: number;
  rpl_allowed: boolean;
  entry_qualification_minimum: string;
  description: string;
  source_reference: string | null;
  source_last_verified_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------------------------
// 4. Recommendation Table
// ------------------------------------------------------------------------------
export interface Recommendation {
  id: string;
  livelihood_profile_id: string;
  occupation_id: string;
  match_score: number; // 0-100 heuristic fit index
  matched_skills: string[];
  skill_gaps: string[];
  location_relevance: string;
  constraint_fit: string;
  rationale: string;
  is_primary: boolean;
  created_at: string;
  // Hydrated join property for UI convenience when populated
  occupation?: OccupationCatalog;
}

export type RecommendationInsert = Omit<Recommendation, 'id' | 'created_at' | 'occupation'> & {
  id?: string;
  created_at?: string;
};

// ------------------------------------------------------------------------------
// 5. Action Plan Table
// ------------------------------------------------------------------------------
export interface ActionPlan {
  id: string;
  livelihood_profile_id: string;
  recommendation_id: string | null;
  potential_support_category: PotentialSupportCategory;
  recommended_enterprise_model: RecommendedEnterpriseModel;
  nearest_training_center_type: string | null;
  implementation_stage: ImplementationStage;
  officer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ActionPlanInsert = Omit<ActionPlan, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
