declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD__ID: string;
    DISCORD_CLIENT_SECRET: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
  }
}
