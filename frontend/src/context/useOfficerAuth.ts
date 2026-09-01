import { useContext } from 'react';
import { OfficerAuthContext, type OfficerAuthContextType } from './officerAuthContextDef';

export const useOfficerAuth = (): OfficerAuthContextType => {
  const context = useContext(OfficerAuthContext);
  if (!context) {
    throw new Error('useOfficerAuth must be used within an OfficerAuthProvider');
  }
  return context;
};
