import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzjetwaguhpkqgesuprp.supabase.co';
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_npE2xEF0f21FwmbjbwhvWg_EuHgfO_0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
