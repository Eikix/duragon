import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

// Database types will be generated later with `supabase gen types typescript`
// For now, we use a placeholder that can be replaced with generated types
export type Database = Record<string, never>;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
