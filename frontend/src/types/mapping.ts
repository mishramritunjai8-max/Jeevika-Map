export type GenderType = 'female' | 'male' | 'transgender' | 'other';

export type CasteCategoryType =
  | 'scheduled_caste'
  | 'scheduled_tribe'
  | 'other_backward_class'
  | 'general';

export type EducationLevelType =
  | 'no_formal_education'
  | 'primary_class_5'
  | 'middle_class_8'
  | 'secondary_class_10'
  | 'higher_secondary_class_12'
  | 'diploma_iti'
  | 'graduate_above';

export type MobilityRangeType =
  | 'within_village'
  | 'within_block'
  | 'within_district'
  | 'nearby_districts'
  | 'anywhere_in_state';

export type EmploymentPreferenceType =
  | 'micro_enterprise'
  | 'wage_employment'
  | 'shg_cooperative'
  | 'home_based_production';

export interface BasicInfoState {
  fullName: string;
  age: string;
  gender: GenderType | '';
  casteCategory: CasteCategoryType | '';
  contactNumber: string;
}

export interface ExistingSkillsState {
  primarySkill: string;
  secondarySkills: string[];
  traditionalCraft: string;
  toolProficiency: 'manual_traditional' | 'power_tools' | 'basic_machinery' | 'none';
  rplInterest: boolean;
}

export interface WorkExperienceState {
  yearsExperience: string;
  currentTrade: string;
  monthlyIncomeRange: string;
  isSeasonal: boolean;
  activeMonthsPerYear: string;
}

export interface LivelihoodInterestsState {
  targetSectors: string[];
  preferredWorkType: 'manufacturing_craft' | 'services_repair' | 'agriculture_allied' | 'renewable_green';
  trainingInterest: boolean;
}

export interface EducationState {
  formalLevel: EducationLevelType | '';
  canReadWriteVernacular: boolean;
  canReadWriteEnglish: boolean;
  basicMathComfort: boolean;
  smartphoneUsage: 'regular' | 'basic_calls' | 'no_phone';
}

export interface LocationState {
  state: string;
  district: string;
  block: string;
  gramPanchayat: string;
  areaType: 'rural' | 'semi_urban' | 'urban';
}

export interface ConstraintsState {
  mobilityRange: MobilityRangeType | '';
  caregiverResponsibilities: boolean;
  workingHoursPerDay: string;
  financialConstraint: 'needs_immediate_daily_wage' | 'can_attend_stipended_training' | 'can_invest_time';
}

export interface AspirationsState {
  employmentPreference: EmploymentPreferenceType | '';
  targetMonthlyIncome: string;
  needsToolkitFinancing: boolean;
  interestInGroupEnterprise: boolean;
  additionalVoiceNote: string;
}

export interface BeneficiaryFormData {
  basicInfo: BasicInfoState;
  existingSkills: ExistingSkillsState;
  workExperience: WorkExperienceState;
  livelihoodInterests: LivelihoodInterestsState;
  education: EducationState;
  location: LocationState;
  constraints: ConstraintsState;
  aspirations: AspirationsState;
}

export const INITIAL_BENEFICIARY_DATA: BeneficiaryFormData = {
  basicInfo: {
    fullName: '',
    age: '',
    gender: '',
    casteCategory: 'scheduled_caste',
    contactNumber: '',
  },
  existingSkills: {
    primarySkill: '',
    secondarySkills: [],
    traditionalCraft: '',
    toolProficiency: 'manual_traditional',
    rplInterest: true,
  },
  workExperience: {
    yearsExperience: '',
    currentTrade: '',
    monthlyIncomeRange: '',
    isSeasonal: false,
    activeMonthsPerYear: '12',
  },
  livelihoodInterests: {
    targetSectors: [],
    preferredWorkType: 'manufacturing_craft',
    trainingInterest: true,
  },
  education: {
    formalLevel: '',
    canReadWriteVernacular: true,
    canReadWriteEnglish: false,
    basicMathComfort: true,
    smartphoneUsage: 'basic_calls',
  },
  location: {
    state: 'Uttar Pradesh',
    district: '',
    block: '',
    gramPanchayat: '',
    areaType: 'rural',
  },
  constraints: {
    mobilityRange: 'within_block',
    caregiverResponsibilities: false,
    workingHoursPerDay: '8',
    financialConstraint: 'can_attend_stipended_training',
  },
  aspirations: {
    employmentPreference: 'micro_enterprise',
    targetMonthlyIncome: '₹20,000 – ₹25,000',
    needsToolkitFinancing: true,
    interestInGroupEnterprise: true,
    additionalVoiceNote: '',
  },
};
