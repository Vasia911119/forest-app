import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Створює клієнт Supabase для серверного коду
 * @throws {Error} Якщо відсутні необхідні змінні середовища
 */
export const createClient = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Для серверного коду
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Відсутні необхідні змінні середовища Supabase');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Для серверного коду
    },
  });
};