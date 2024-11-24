import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // URL โปรเจกต์
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Anon Key

export const supabase = createClient(supabaseUrl as string, supabaseKey as string);
