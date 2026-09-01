import React, { useEffect, useState, useMemo } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { OfficerAuthContext } from './officerAuthContextDef';

export const OfficerAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(() =>
    isSupabaseConfigured()
  );

  const [authError, setAuthError] = useState<string | null>(null);

  // Officer authorization is based ONLY on app_metadata.role.
  // user_metadata is intentionally not used for authorization.
  const isOfficer = useMemo(() => {
    return user?.app_metadata?.role === 'officer';
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    // If Supabase is not configured, the initial loading state
    // is already false because it was initialized from
    // isSupabaseConfigured().
    if (!isSupabaseConfigured()) {
      return;
    }

    // ------------------------------------------------------------
    // 1. INITIAL SESSION LOAD
    // ------------------------------------------------------------
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        // ----------------------------------------------------------
        // SAFE AUTH DIAGNOSTIC
        // Logs only email + app_metadata.
        // No password, access token, refresh token, or API key.
        // ----------------------------------------------------------
        console.log('[OFFICER AUTH DEBUG]', {
          email: initialSession?.user?.email,
          app_metadata: initialSession?.user?.app_metadata,
          role: initialSession?.user?.app_metadata?.role,
        });

        if (error) {
          console.error(
            '[OfficerAuth] Error loading initial session:',
            error.message
          );
        }

        if (!isMounted) {
          return;
        }

        if (initialSession?.user) {
          const role = initialSession.user.app_metadata?.role;

          if (role === 'officer') {
            setSession(initialSession);
            setUser(initialSession.user);
            setAuthError(null);
          } else {
            console.warn(
              '[OfficerAuth] Authenticated user does not possess officer role.'
            );

            setSession(null);
            setUser(null);

            await supabase.auth.signOut();
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error(
          '[OfficerAuth] Unexpected error in initializeAuth:',
          err
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // ------------------------------------------------------------
    // 2. AUTH STATE CHANGE LISTENER
    // ------------------------------------------------------------
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) {
          return;
        }

        console.log('[OFFICER AUTH EVENT]', {
          event,
          email: newSession?.user?.email,
          app_metadata: newSession?.user?.app_metadata,
          role: newSession?.user?.app_metadata?.role,
        });

        if (
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        ) {
          if (newSession?.user) {
            const role = newSession.user.app_metadata?.role;

            if (role === 'officer') {
              setSession(newSession);
              setUser(newSession.user);
              setAuthError(null);
            } else {
              setSession(null);
              setUser(null);

              setAuthError(
                'Access Denied: Your account does not have the officer role (app_metadata.role must be "officer").'
              );

              await supabase.auth.signOut();
            }
          } else {
            setSession(null);
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setAuthError(null);
        }

        setLoading(false);
      }
    );

    // ------------------------------------------------------------
    // 3. CLEANUP
    // ------------------------------------------------------------
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------------------
  // OFFICER SIGN IN
  // --------------------------------------------------------------
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        const msg =
          'Supabase credentials are not configured in environment.';

        setAuthError(msg);
        setLoading(false);

        return {
          success: false,
          error: msg,
        };
      }

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        setAuthError(error.message);
        setLoading(false);

        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        const role = data.user.app_metadata?.role;

        // ----------------------------------------------------------
        // Officer authorization
        // ----------------------------------------------------------
        if (role === 'officer') {
          setSession(data.session);
          setUser(data.user);
          setAuthError(null);
          setLoading(false);

          console.log('[OFFICER LOGIN DEBUG]', {
            email: data.user.email,
            app_metadata: data.user.app_metadata,
            role: data.user.app_metadata?.role,
          });

          return {
            success: true,
          };
        }

        // ----------------------------------------------------------
        // Authenticated but NOT an officer
        // ----------------------------------------------------------
        await supabase.auth.signOut();

        const denyMsg =
          'Access Denied: Your account is not authorized as a Welfare Officer (app_metadata.role must be "officer").';

        setAuthError(denyMsg);
        setSession(null);
        setUser(null);
        setLoading(false);

        return {
          success: false,
          error: denyMsg,
        };
      }

      setLoading(false);

      return {
        success: false,
        error: 'Authentication failed. Please try again.',
      };
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during sign in.';

      setAuthError(errorMsg);
      setLoading(false);

      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  // --------------------------------------------------------------
  // OFFICER SIGN OUT
  // --------------------------------------------------------------
  const signOut = async () => {
    setLoading(true);

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[OfficerAuth] Error signing out:', err);
    } finally {
      setSession(null);
      setUser(null);
      setAuthError(null);
      setLoading(false);
    }
  };

  // --------------------------------------------------------------
  // CLEAR AUTH ERROR
  // --------------------------------------------------------------
  const clearAuthError = () => {
    setAuthError(null);
  };

  // --------------------------------------------------------------
  // CONTEXT PROVIDER
  // --------------------------------------------------------------
  return (
    <OfficerAuthContext.Provider
      value={{
        session,
        user,
        isOfficer,
        loading,
        authError,
        signIn,
        signOut,
        clearAuthError,
      }}
    >
      {children}
    </OfficerAuthContext.Provider>
  );
};