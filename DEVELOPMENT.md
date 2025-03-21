# Development

This is a guide to help you get started with the development of the project.

## Requirements

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en/): JavaScript runtime.
- [pnpm](https://pnpm.io/): Package manager. Or any other package manager you prefer (npm, yarn, etc.).
- [Supabase CLI](https://supabase.com/docs/guides/local-development): Database and authentication.
- [Docker](https://www.docker.com/): Containerization tool.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/cin4ed/roamr
cd roamr
pnpm install # or your package manager of choice
```

## 1. Setup the Next.js application

After installing the project dependencies, you can start the Next.js application:

```bash
pnpm dev
```

Copy the Local URL shown in your terminal (e.g. `http://localhost:3000`) and add it to the `.env.local` file as follows, as it will be used in the next steps:

```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## 2. Setup the Supabase local development instance

### 2.1 Get the Discord client ID and secret

By default Roamr offers users the option to sign in using Discord. To enable this feature, you need to create a new application in the [Discord Developer Portal](https://discord.com/developers/applications).

Get the `CLIENT_ID` and `CLIENT_SECRET` from the application and add them to the `.env.local` file as follows:

```bash
SUPABASE_AUTH_DISCORD_CLIENT_ID="your_client_id"
SUPABASE_AUTH_DISCORD_CLIENT_SECRET="your_client_secret"
```

Keep reading as you will need to add redirects URIs to your Discord application.

### 2.2 Run the Supabase local development instance

Run the Supabase local development instance:

```bash
supabase start
```

If everything is working correctly, you will see a message similar to the following in your terminal:

```bash
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: [your_anon_key]
service_role key: ...
   S3 Access Key: ...
   S3 Secret Key: ...
       S3 Region: local
```

Add the corresponding `API URL` and `anon key` to the `.env.local` file as follows:

```bash
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your_anon_key]"
```

Stop the Supabase local development instance:

```bash
supabase stop
```

### 2.3 Add redirects URIs to your Discord application and `config.toml` file.

Go the Discord Developer Portal again and add the given redirects URIs application

```bash
http://localhost:3000/auth/callback
http://localhost:54321/auth/v1/callback
```

These must match the URLs given to you by the Next.js development server and the Supabase local development instance.

> Make sure to use correct ones as `http://localhost:3000` and `http://localhost:54321` can be different on your machine.

You also need to add them to the `config.toml` file:

```toml
[auth]
enabled = true
site_url = "env(NEXT_PUBLIC_SITE_URL)"
additional_redirect_uris = ["http://localhost:3000/auth/callback"] # <- add this here
jwt_expiry = 3600
... # More config options
[auth.external.discord]
enabled = true
client_id = "env(SUPABASE_AUTH_DISCORD_CLIENT_ID)"
client_secret = "env(SUPABASE_AUTH_DISCORD_CLIENT_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback" # <- add this here
```

### 2.4 Start the supabase local development instance again

At this point you `.env.local` file should look like this:

```bash
NEXT_PUBLIC_SITE_URL="your_site_url"
SUPABASE_AUTH_DISCORD_CLIENT_ID="your_client_id"
SUPABASE_AUTH_DISCORD_CLIENT_SECRET="your_client_secret"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

Start the supabase local development instance again:

```bash
supabase start
```
