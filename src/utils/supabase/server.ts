import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = async () => {
  const supabaseUrl = 'https://aawcrghnjzsmklebgdcw.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Anon Key');
  }

  const client = createSupabaseClient(supabaseUrl, supabaseKey, {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
    },
  });

  console.log('Supabase client created successfully');
  return client;
};