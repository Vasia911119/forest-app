declare namespace NodeJS {
    interface ProcessEnv {
      /** URL для підключення до Supabase */
      NEXT_PUBLIC_SUPABASE_URL: string;
      /** Публічний ключ для анонімного доступу до Supabase */
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      /** Секретний ключ для сервісного доступу до Supabase */
      SUPABASE_SERVICE_ROLE_KEY: string;
    }
  }