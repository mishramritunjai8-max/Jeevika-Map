// ==============================================================================
// Types: Jeevika Saathi AI Chatbot
// Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
// ==============================================================================

export interface LivelihoodPathwayData {
  goal?: string;
  relevantSkill?: string;
  nsqfJobRole?: string;
  qpNosCode?: string;
  nsqfLevel?: number;
  schemeSupport?: string;
  opportunity?: string;
  nextStep?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  pathway?: LivelihoodPathwayData;
  quickActions?: string[];
  whyExplanation?: string;
  isFallback?: boolean;
}

export interface ChatRequestPayload {
  message: string;
  history: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  district?: string;
  state?: string;
}

export interface ChatResponsePayload {
  success: boolean;
  reply: string;
  pathway?: LivelihoodPathwayData;
  quickActions?: string[];
  whyExplanation?: string;
  isFallback?: boolean;
  error?: string;
}
