# Duragon

A lightweight D&D web platform for remote play with friends. Roll dice, manage characters, and play together in real-time.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **Database**: PostgreSQL via Supabase
- **Monorepo**: npm workspaces

## Project Structure

```
duragon/
├── apps/
│   └── web/                 # React web application
│       └── src/
│           ├── components/
│           │   ├── dice/    # Dice rolling components
│           │   ├── layout/  # App layout, navbar
│           │   └── ui/      # Reusable UI components
│           └── lib/         # Supabase client, utilities
├── packages/
│   └── shared/              # Shared code across apps
│       └── src/
│           └── dice/        # Dice parser and roller
└── supabase/
    ├── migrations/          # Database migrations
    └── config.toml          # Local dev configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (for local Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/duragon.git
cd duragon

# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
# Edit .env with your Supabase credentials
```

### Local Development

```bash
# Start Supabase locally (requires Docker)
npx supabase start

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### Supabase Studio

When running locally, access Supabase Studio at `http://localhost:54323` to manage your database.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Features

### Implemented

- Dice rolling system with full expression parsing (`2d20kh1`, `4d6dl1+2`, etc.)
- Cryptographically secure random rolls
- UI component library (Button, Input, Card, Modal, Toast, etc.)
- Supabase integration with typed client
- User profiles with Row Level Security
- Real-time capable database schema

### Planned

- User authentication (sign up, sign in, sign out)
- Character sheet management
- Room creation and invite codes
- Real-time dice roll sharing
- Character HP/stats tracking
- Presence indicators (online/offline)

## Dice Expression Syntax

| Expression | Description |
|------------|-------------|
| `1d20` | Roll one 20-sided die |
| `2d6+5` | Roll 2d6 and add 5 |
| `2d20kh1` | Roll 2d20, keep highest (advantage) |
| `2d20kl1` | Roll 2d20, keep lowest (disadvantage) |
| `4d6dl1` | Roll 4d6, drop lowest (stat generation) |

## License

MIT
