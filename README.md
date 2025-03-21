<p align="center">
    <img src="public/roamr-logo-classic.jpeg"  width="400"/>
</p>

Roamr is a platform built for urban exploration (urbex) enthusiasts, offering a trusted, community-driven map of verified locations worldwide. Users can discover, share, and document hidden places while accessing detailed site information, ratings, and safety insights.

Get a quick look at the project by visiting the [Roamr website](https://roamr.vercel.app/).

## 💻 Project Overview

This repository contains the frontend code for Roamr, built using Next.js. The goal is to create a fast, scalable, and user-friendly experience for exploring urbex locations. The backend and other infrastructure are managed separately.

The project is currently in the early stages of development, and I'm working on it in my free time. If you have any ideas or suggestions, feel free to open an issue or submit a pull request.

## 🌟 Features

### Core Functionality (Available / In Progress)

- 🔑 User Authentication & Authorization – Secure accounts & personalized access. (In Progress)
- 🗺️ Interactive Map – Pan, zoom, and search for worldwide places. (In Progress)
- 📍 Add & Edit Locations – Create and update location markers with details. (In Progress)
- 🔍 Advanced Search – Find locations by name, category, or tags. (In Progress)

### Upcoming Features (Next Up)

- ⭐ Community Ratings & Reviews – Share experiences and insights. (Planned)
- 👤 User Profiles & Achievements – Track contributions and progress. (Planned)
- 🖼️ Photo Galleries – Upload and browse images of locations. (Planned)

### Future Enhancements (Beyond MVP)

- ⚠️ Safety Insights & Warnings – Get hazard details for each location. (Planned)
- ✅ Location Verification & Moderation – Ensure accuracy & reliability. (Planned)
- 📱 Mobile-Friendly Experience – Optimized design for seamless mobile use. (Planned)

## 🛠️ Tech Stack

This project is built using the following technologies:

- [Next.js](https://nextjs.org/): React framework for building web applications.
- [Supabase](https://supabase.com/): Database and authentication.
- [Shadcn UI](https://ui.shadcn.com/): A collection of React components.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework.
- [MapLibre](https://maplibre.org/): Map rendering library.
- [Photon](https://photon.komoot.io/): Geocoding and Reverse Geocoding API.

## 🚀 Getting Started

To run this project locally, you'll need the following tools:

- [Node.js](https://nodejs.org/en/): JavaScript runtime.
- [pnpm](https://pnpm.io/): Package manager. Or any other package manager you prefer.
- [Supabase CLI](https://supabase.com/docs/guides/local-development): Database and authentication.
- [Docker](https://www.docker.com/): Containerization tool.

Let's start by cloning the repository:

```bash
git clone https://github.com/cin4ed/roamr
cd roamr
```

If you are planning to support OAuth, you'll need to setup the OAuth providers in the `supabase/config.toml` file. You can refer to the [Supabase documentation](https://supabase.com/docs/guides/local-development/overview#use-auth-locally) for more information on how to do this.

By default, the project is configured to use the Discord OAuth provider. If you want to disable it, you can set the `enabled` field to `false` in the `supabase/config.toml` file.

If you want to use Discord as the OAuth provider, you'll need to create a new application in the [Discord Developer Portal](https://discord.com/developers/applications).

Get the `CLIENT_ID` and `CLIENT_SECRET` from the application and add them to the `.env.local` file.

```bash
SUPABASE_AUTH_DISCORD_CLIENT_ID=your_client_id
SUPABASE_AUTH_DISCORD_CLIENT_SECRET=your_client_secret
```

## 🤝 Contributing

Contributions are always welcome and appreciated! At this moment I don't have a specific guideline for contributing, but feel free to submit a pull request with your changes and I'll review it as soon as possible.

## 📝 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

## About Prisma

1. Installed Prisma with the `pnpm add prisma --save-dev` command.
2. Ran the `pnpm exec prisma init` command.
3. Prisma schema was created at `prisma/shcmea.prisma`.
4. A new line with `DATABASE_URL="xxxx"` was added to the `.env` file.

- Prototyping: Use `prisma db push` to synchorize your database schema with your Prisma schema file (`schema.prisma`) without generating migrations.
- Production: Use `prisma migrate` to generate migrations.
- `prisma generate` this creates a type-safe client in node_modules.

Prisma gets environment variables from `.env` file, while Next.js get them from `.env.local` when executed with `pnpm run dev`, for prisma to get env vars from `.env.local` we're going to use a tool called

callback supabase discord https://sduopvydpiutfkwveivm.supabase.co/auth/v1/callback
