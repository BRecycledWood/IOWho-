import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Only connect to Supabase when credentials are configured. When they aren't
// (demo mode), `supabase` is still typed as a client but its methods are never
// called — every Supabase code path is guarded by `hasSupabase` in lib/auth.ts.
// This prevents the module from throwing "supabaseUrl is required" at load
// time and crashing the whole app before anything renders.
export const supabase = (supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null) as ReturnType<typeof createClient<Database>>;
