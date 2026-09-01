import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if credentials are properly configured (not empty and not placeholder defaults)
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabasePublishableKey) {
    return false;
  }
  if (
    supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' ||
    supabasePublishableKey === 'YOUR_SUPABASE_PUBLISHABLE_KEY'
  ) {
    return false;
  }
  try {
    const url = new URL(supabaseUrl);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (clientInstance) {
    return clientInstance;
  }

  if (!isSupabaseConfigured()) {
    console.warn(
      '[Jeevika Map / Supabase] Environment variables VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY are missing or unconfigured. Please configure them in frontend/.env.'
    );
    // Initialize with fallback to prevent application initialization crashes
    clientInstance = createClient(
      'https://placeholder-project.supabase.co',
      'placeholder-public-anon-key'
    );
    return clientInstance;
  }

  console.log('[Supabase Config] Environment validation:');
  console.log('  VITE_SUPABASE_URL loaded:', Boolean(supabaseUrl));
  console.log('  VITE_SUPABASE_PUBLISHABLE_KEY loaded:', Boolean(supabasePublishableKey));
  console.log('  isSupabaseConfigured:', isSupabaseConfigured());

  clientInstance = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return clientInstance;
};

// Singleton export
export const supabase = getSupabaseClient();
