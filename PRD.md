# Duragon - D&D Web Platform PRD

A lightweight web platform for playing Dungeons & Dragons remotely with friends.

## Product Overview

Duragon enables small groups of friends to play D&D remotely by providing:
- Character sheet creation and management
- Transparent dice rolling shared in real-time
- Rooms for organizing game sessions

Players use external tools (Discord, etc.) for voice/video while Duragon handles the tabletop mechanics.

## Core User Problems

### Player Perspective
- **Character management**: Need a persistent, editable character sheet accessible from any device
- **Dice rolling**: Need transparent rolls visible to all players to maintain trust
- **Session continuity**: Need character state (HP, resources) to persist between sessions

### DM Perspective
- **Visibility**: Need to see player character stats (HP, AC) at a glance
- **Roll verification**: Need to see all dice rolls with individual die results
- **Session management**: Need to organize players into rooms/campaigns

## MVP Scope

### In Scope (Priority Order)

1. **Authentication**
   - Email/password sign up and sign in
   - User profiles with display names

2. **Character Sheets**
   - Create/edit/delete characters
   - Edition-agnostic flexible schema (supports 5e, 3.5e, Pathfinder, homebrew)
   - Core stats always visible: HP (current/max/temp), AC, level
   - Custom fields via JSON editor for edition-specific data
   - Real-time sync across devices

3. **Dice Rolling**
   - Standard notation: `2d6`, `1d20+5`
   - Keep/drop: `2d20kh1` (advantage), `2d20kl1` (disadvantage), `4d6dl1`
   - Full transparency: show every individual die result
   - Roll labels: "Attack Roll", "Perception Check"
   - Real-time broadcast to all room members
   - Persistent roll history

4. **Rooms**
   - Create rooms with invite codes
   - Join via invite code
   - Member list with online/offline presence
   - Assign characters to rooms

### Out of Scope (Future)
- Virtual tabletop with maps and tokens
- Initiative tracker
- Campaign management and notes
- Built-in voice/video chat
- Official D&D content or compendiums
- Public room discovery or marketplace
- Mobile native apps

## Constraints

- **Small private groups**: Designed for friends, not public matchmaking
- **No copyrighted content**: Users bring their own D&D data
- **External A/V**: Voice/video handled by Discord or similar
- **Correctness over polish**: Functional and reliable beats pretty

## Technical Architecture

### Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **Database**: PostgreSQL via Supabase
- **Real-time**: Supabase Realtime (WebSocket-based)

### Project Structure

```
duragon/
├── apps/
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── character/  # Character sheet components
│       │   │   ├── dice/       # Dice rolling components
│       │   │   ├── room/       # Room/session components
│       │   │   ├── ui/         # Shared UI primitives
│       │   │   └── layout/     # Layout components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utilities, Supabase client
│       │   ├── pages/          # Page components
│       │   ├── stores/         # Zustand stores
│       │   └── types/          # TypeScript definitions
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared types and utilities
│       └── src/
│           ├── dice/           # Dice parsing and rolling logic
│           └── validation/     # Zod schemas
│
├── supabase/
│   └── migrations/             # Database migrations
│
├── package.json                # Root workspace config
└── pnpm-workspace.yaml
```

## Database Schema

### Tables

**profiles** - Extended user data
- `id` (UUID, references auth.users)
- `display_name` (TEXT)
- `avatar_url` (TEXT, nullable)

**rooms** - Game sessions
- `id` (UUID)
- `name` (TEXT)
- `owner_id` (UUID, references profiles)
- `invite_code` (TEXT, unique, auto-generated)
- `settings` (JSONB)

**room_members** - Room membership
- `id` (UUID)
- `room_id` (UUID, references rooms)
- `user_id` (UUID, references profiles)
- `role` (TEXT: 'owner', 'dm', 'player')

**characters** - Edition-agnostic character sheets
- `id` (UUID)
- `owner_id` (UUID, references profiles)
- `room_id` (UUID, nullable, references rooms)
- `name` (TEXT)
- `system` (TEXT: '5e', '3.5', 'pathfinder', 'custom')
- `core_stats` (JSONB: `{level, hp: {current, max, temp}, ac}`)
- `sheet_data` (JSONB: edition-specific data, user-controlled)
- `portrait_url` (TEXT, nullable)
- `is_public` (BOOLEAN)

**dice_rolls** - Roll history
- `id` (UUID)
- `room_id` (UUID, references rooms)
- `user_id` (UUID, references profiles)
- `character_id` (UUID, nullable, references characters)
- `expression` (TEXT: '2d20kh1+5')
- `label` (TEXT, nullable: 'Attack Roll')
- `individual_rolls` (INTEGER[]: [18, 7])
- `modifier` (INTEGER)
- `total` (INTEGER)
- `roll_metadata` (JSONB: {advantage: true, dropped: [7]})

### Row Level Security
- Users can only see/edit their own characters
- Room members can see public characters in their room
- Room members can see all dice rolls in their room
- Only room owners can modify room settings

### Real-time Subscriptions
- `dice_rolls`: New rolls broadcast to room members
- `characters`: HP/stat changes sync in real-time
- `room_members`: Presence tracking for online status

## Core Components

### Character System

**CharacterSheet** - Main container
- Fetches character data with real-time subscription
- Auto-saves changes (debounced 500ms)
- Displays core_stats prominently
- Renders sheet_data as editable JSON tree

**CharacterStats** - Core stats display
- HP tracker with current/max/temp
- AC display
- Level display
- Inline editing

**CharacterEditor** - Flexible data editor
- JSON tree view for sheet_data
- Add/remove/edit fields
- Type-aware inputs (numbers, strings, arrays, objects)

### Dice System

**DiceRoller** - Main interface
- Expression input with validation
- Preset quick-roll buttons
- Roll history feed

**Dice Parser** - Expression parsing
- Supports: `NdS`, `NdS+M`, `NdSkh/klN`, `NdSdh/dlN`
- Examples: `1d20`, `2d6+3`, `2d20kh1`, `4d6dl1`

**Roll Execution**
- Cryptographically random (crypto.getRandomValues)
- Returns individual die results for transparency
- Calculates kept/dropped dice for advantage/disadvantage

### Room System

**RoomView** - Main room container
- Sidebar with member list
- Dice roller panel
- Character list for room

**Presence Tracking**
- Supabase Realtime presence
- Online/offline indicators
- Last seen timestamps

## Implementation Phases

### Phase 1: Project Setup
- Initialize monorepo with pnpm workspaces
- Configure Vite, TypeScript, Tailwind
- Set up Supabase client
- Create base UI components

**Files**: `package.json`, `pnpm-workspace.yaml`, `apps/web/*`, `supabase/config.toml`

### Phase 2: Database & Auth
- Create database migrations with full schema
- Implement RLS policies
- Build auth hooks and flows
- Create layout components

**Files**: `supabase/migrations/001_initial_schema.sql`, `useAuth.ts`, `AppLayout.tsx`

### Phase 3: Character Sheets
- Build character CRUD operations
- Implement real-time subscriptions
- Create CharacterSheet component tree
- Build CharacterEditor for flexible data

**Files**: `useCharacter.ts`, `CharacterSheet.tsx`, `CharacterEditor.tsx`, `CharacterStats.tsx`

### Phase 4: Dice Rolling
- Implement dice parser in shared package
- Build roller with crypto random
- Create DiceRoller UI components
- Implement real-time roll broadcasting

**Files**: `packages/shared/src/dice/*`, `useDiceRolls.ts`, `DiceRoller.tsx`, `DiceHistory.tsx`

### Phase 5: Rooms & Real-time
- Build room CRUD and invite system
- Implement presence tracking
- Create RoomView layout
- Wire up all real-time features

**Files**: `useRoom.ts`, `useRoomMembers.ts`, `RoomView.tsx`, `MemberList.tsx`

### Phase 6: Polish & Testing
- Error handling and toast notifications
- Loading states and skeletons
- Unit tests for dice logic
- Integration tests for hooks
- E2E tests for critical flows

**Files**: `ErrorBoundary.tsx`, `Toast.tsx`, `*.test.ts`, `e2e/*.spec.ts`

## Verification Plan

### Unit Tests
- Dice expression parsing (all notation variants)
- Dice rolling (ranges, keep/drop logic)
- Validation schemas

### Integration Tests
- Character CRUD with Supabase
- Real-time subscriptions
- Auth flows

### E2E Tests (Playwright)
- Sign up / sign in flow
- Create and edit character
- Join room via invite code
- Roll dice and verify history
- Multi-user real-time sync

### Manual Testing Checklist
- [ ] Authentication flows (sign up, sign in, sign out)
- [ ] Character CRUD and real-time sync
- [ ] All dice notation variants
- [ ] Room creation and joining
- [ ] Online presence indicators
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Mobile responsive layout

## Critical Files

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | Database schema with RLS |
| `packages/shared/src/dice/roller.ts` | Core dice rolling logic |
| `apps/web/src/hooks/useCharacter.ts` | Character data + real-time |
| `apps/web/src/hooks/useDiceRolls.ts` | Dice roll subscriptions |
| `apps/web/src/components/character/CharacterSheet.tsx` | Main character UI |
| `apps/web/src/components/dice/DiceRoller.tsx` | Main dice UI |
| `apps/web/src/components/room/RoomView.tsx` | Room container |

## Success Metrics

MVP is complete when a group can:
1. Create accounts and profiles
2. Create characters with custom stats
3. Create a room and share invite code
4. Join room and see each other online
5. Roll dice with results visible to all
6. Track HP changes in real-time
7. Resume session with all data persisted
