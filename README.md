# Crawlers — AI Tools Directory

A high-performance, human-curated directory of AI tools, API endpoints, and developer resources. Built with Next.js 16 App Router, React 19, Tailwind CSS v4, and Supabase PostgreSQL.

## Stack Overview

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Database**: Supabase (PostgreSQL with Row-Level Security)
- **Hosting Target**: Cloudflare Pages / Edge Runtime
- **Icons**: Lucide React (`lucide-react`)
- **Language**: TypeScript 5 (Strict Mode)

## Project Structure

```
crawlers/
├── src/
│   ├── app/            # Next.js App Router routes & page shells
│   ├── components/     # Reusable UI component library
│   ├── lib/            # Utilities, database clients, and helpers
│   └── types/          # TypeScript domain models and interfaces
├── supabase/
│   └── migrations/     # Supabase SQL migration files
├── brain.md            # Persistent context file & decision log
├── .env.example        # Environment variable template
└── README.md           # Developer guide
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Supabase URL and keys in `.env.local`.

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Quality & Linting Commands

```bash
npm run lint          # Run ESLint check
npm run typecheck     # Verify TypeScript types
npm run format:check  # Check formatting with Prettier
npm run format        # Auto-format all project files
```
