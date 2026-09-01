import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface OfficerAuthContextType {
  session: Session | null;
  user: User | null;
  isOfficer: boolean;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

export const OfficerAuthContext = createContext<OfficerAuthContextType | undefined>(undefined);
