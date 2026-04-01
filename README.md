# SportTracker

A high-performance cross-platform application unifying tracking for all sports with a unique adaptive interface per discipline. Designed for the multidisciplinary athlete who is tired of juggling separate apps for climbing, running, and weightlifting.

## Architecture

This is a **monorepo** containing two projects:

```
SportTracker/
├── mobile-client/   # React Native (Expo 54) — iOS & Android
└── backend-api/     # Spring Boot 3.5 / Java 25 — REST API
```

### Stack

| Layer | Technology |
|---|---|
| Mobile | Expo 54 · React Native · Expo Router · NativeWind v4 (Tailwind CSS) |
| State | Zustand v5 · TanStack Query v5 |
| Backend | Spring Boot 3.5 · Java 25 · Virtual Threads |
| Database | PostgreSQL 16 (Relational + JSONB) · Flyway migrations |
| Cache | Redis 7 |
| Auth | Spring Security · JWT · OAuth2 (Apple, Google) |
| Offline | expo-sqlite · Background sync queue |
| CI/CD | GitHub Actions (backend) · EAS (mobile) |
| Dev infra | Docker Compose |

### Design System

Dual-theme: **Alpine Pure** (light) and **Midnight Peak** (dark), configured as semantic tokens in `tailwind.config.js`.

| Token | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#0F172A` |
| Surface | `#F8F9FA` | `#1E293B` |
| Header | `#1C3F60` | — |
| Primary (Coral) | `#FF6B4A` | `#FF6B4A` |
| Success (Green) | `#22C55E` | `#22C55E` |
| Data emphasis | `#0369A1` | `#38BDF8` |

---

## Getting Started

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| Java (Liberica JDK) | 25 LTS | `brew install --cask liberica-jdk25` |
| Docker Desktop | ≥ 26 | [docker.com](https://www.docker.com/products/docker-desktop) |
| Xcode | Latest | App Store |
| Watchman | Latest | `brew install watchman` |
| CocoaPods | Latest | `sudo gem install cocoapods` |

### 1. Start local infrastructure

```bash
cd backend-api
docker compose up -d
```

This starts **PostgreSQL 16** on port `5432` and **Redis 7** on port `6379`.

### 2. Run the backend

```bash
cd backend-api
./mvnw spring-boot:run
```

API available at `http://localhost:8080`. Swagger UI at `http://localhost:8080/swagger-ui.html`.

### 3. Run the mobile client

```bash
cd mobile-client
npm install
npx expo start
```

Press `i` for iOS Simulator, `a` for Android emulator.

---

## Project Structure

### Mobile Client (`mobile-client/`)

```
src/
├── app/                    # Expo Router file-based routes
│   ├── (auth)/             # Login, Register screens
│   ├── (tabs)/             # Dashboard, Feed, Profile
│   └── tracking/           # Active sport tracking interfaces
├── components/
│   ├── ui/                 # Atomic design — dumb presentational components
│   └── features/           # Complex domain components (e.g. ClimbingGradePicker)
├── lib/
│   ├── api.ts              # Axios instance with JWT interceptors
│   ├── db.ts               # expo-sqlite initialisation
│   └── sync.ts             # Background sync queue
├── store/                  # Zustand stores
├── hooks/                  # TanStack Query hooks
└── types/                  # TypeScript interfaces (must mirror Java POJOs)
```

### Backend API (`backend-api/`)

```
src/main/java/com/sporttracker/api/
├── config/        # Security, Redis, OpenAPI configuration
├── common/        # Global exception handler (RFC 7807)
├── auth/          # Registration, Login, JWT — UserEntity, AuthService, AuthController
├── activity/      # Tracking endpoints + JSONB sport-specific models
├── dashboard/     # Aggregation & effort queries
├── social/        # Feed, Kudos, Comments, WebSockets
└── moderation/    # Admin reporting endpoints
```

---

## Development Guidelines

### Conventions

| Concern | Rule |
|---|---|
| DB tables/columns | `snake_case` |
| API endpoints | `kebab-case` plural (`/api/v1/user-profiles`) |
| JSON payloads | `camelCase` |
| Java classes | `PascalCase` |
| React components | `PascalCase` |
| Hooks / utils | `camelCase` |
| Dates | ISO 8601 (`2026-04-01T18:00:00Z`) |
| API errors | RFC 7807 Problem Details |

### Git Workflow

- **Never commit directly to `main`** — all work goes on feature branches
- Branch naming: `feat/auth`, `feat/tracking`, `fix/sync-conflict`
- Commit format: Conventional Commits — `feat(auth):`, `fix(sync):`, `chore(deps):`
- Open a PR for every story and ensure CI passes before merging

### Testing

```bash
# Backend — unit + integration tests
cd backend-api && ./mvnw test

# Backend — style check
cd backend-api && ./mvnw spotless:check

# Mobile — Jest tests
cd mobile-client && npm test

# Mobile — TypeScript check
cd mobile-client && npx tsc --noEmit

# Mobile — lint
cd mobile-client && npm run lint
```

---

## Phased Roadmap

| Phase | Scope |
|---|---|
| **MVP** | Running · Climbing · Weightlifting · Auth · Offline-first sync · Social feed |
| **Growth** | 10+ sports · Advanced analytics · Apple HealthKit / Google Health Connect · AI training plans |
| **Vision** | Apple Watch / Wear OS · Creator marketplace · Strava/Garmin two-way sync |

---

## Contributing

1. Fork and clone the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Ensure tests and lint pass before opening a PR
4. Reference the Epic/Story in your PR description
