declare namespace NodeJS {
  interface ProcessEnv {
    // Site
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SITE_URL: string;

    // Discord OAuth
    SUPABASE_AUTH_DISCORD_CLIENT_ID: string;
    SUPABASE_AUTH_DISCORD_CLIENT_SECRET: string;

    // Google OAuth
    SUPABASE_AUTH_GOOGLE_CLIENT_ID: string;
    SUPABASE_AUTH_GOOGLE_CLIENT_SECRET: string;
  }
}
