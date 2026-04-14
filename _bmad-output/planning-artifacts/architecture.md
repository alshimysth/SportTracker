---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - "/Users/alshimysth/Projets/SportTracker/Application-SportTracker/_bmad-output/planning-artifacts/prd.md"
workflowType: 'architecture'
project_name: 'Application'
user_name: 'Alshimysth'
date: '2026-03-23T12:08:17-04:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The system requires comprehensive user identity management, highly adaptive tracking UI that handles multiple distinct disciplines (initially 3), robust offline-first syncing capabilities, aggregated performance dashboards, and social community features built-in. Architecturally, this necessitates a modular client application with local robust persistence and a backend capable of handling diverse payload structures seamlessly.

**Non-Functional Requirements:**
- **Performance & Battery:** 60fps UI, fast cold start (<2.5s), and highly efficient background tracking.
- **Reliability:** 100% data persistence on crashes, 99.9% sync success via queueing.
- **Security & Privacy:** TLS 1.3, encrypted DB, GDPR/CCPA adherence.
- **Scalability:** 500 concurrent syncs/sec with sub-300ms p95 latency.

**Scale & Complexity:**
- Primary domain: Mobile Application + Backend API 
- Complexity level: Medium
- Estimated architectural components: Mobile Client, Backend API, SQLite Local Cache, PostgreSQL + Redis Data Layer

### Technical Constraints & Dependencies

- React Native (Expo) required for cross-platform mobile with EAS updates.
- Java 25 / Spring Boot 3.x required for backend APIs.
- PostgreSQL acting as a hybrid database utilizing JSONB for sport-specific metrics.
- Hard platform constraints from App Store/Play Store regarding background location and health data usage.

### Cross-Cutting Concerns Identified

- **Offline-First Synchronization:** Ensuring deterministic conflict resolution via timestamps.
- **Hybrid Data Mapping:** Safely typing JSONB unstructured payloads on the backend and frontend.
- **Security Authorization:** Preventing data leaks in social features (follower-only visibility).
- **Background Resource Management:** Balancing frequent location/sensor readouts with battery life.

## Starter Template Evaluation

### Primary Technology Domain

Mobile Application (Expo/React Native) + Backend API (Spring Boot/Java 25) based on project requirements analysis.

### Starter Options Considered

1. **Mobile App**: `create-expo-app` with Expo Router **and NativeWind (Tailwind CSS)**. This provides file-based routing and a robust utility-first styling system that is highly maintained.
2. **Backend API**: Custom Spring Initializr configuration. Given the specific needs (JSONB, Redis, pgvector), a tailored setup is the most standard approach for Java 25.

### Selected Starter: Expo Router + NativeWind & Spring Initializr

**Rationale for Selection:**
- **Expo Router + NativeWind**: Provides file-based routing and rapid UI development using Tailwind classes. It is the modern standard for React Native applications emphasizing clean, maintainable styling.
- **Spring Initializr**: Generating a custom Spring Boot 3 footprint with exactly the required dependencies ensures we don't start with unnecessary bloat while fully supporting Java 25 Virtual Threads.

**Initialization Command:**

```bash
# Mobile Client Initialization
npx create-expo-app@latest mobile-client --template default
cd mobile-client
# Configure NativeWind (Tailwind integration)
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
npx tailwindcss init

# Backend API Initialization
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,data-redis,security,actuator,validation \
  -d type=maven-project \
  -d javaVersion=25 \
  -d bootVersion=3.5.0 \
  -d name=backend-api \
  -d packageName=com.sporttracker.api \
  -o backend.zip && unzip backend.zip -d backend-api && rm backend.zip
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- Mobile: TypeScript with React Native and Expo SDK API.
- Backend: Java 25 leveraging Virtual Threads and Spring Boot 3.x.

**Styling Solution:**
- Mobile: **Tailwind CSS (via NativeWind)** for rapid, utility-driven UI development.

**Build Tooling:**
- Mobile: Metro Bundler with Expo Application Services (EAS) readiness.
- Backend: Maven for robust dependency management.

**Testing Framework:**
- Mobile: Jest configured for Expo.
- Backend: JUnit 5 and Spring Boot Test out-of-the-box.

**Code Organization:**
- Mobile: `/app` directory for file-based routing, with separate `/components` and `/hooks`.
- Backend: Standard Spring MVC layered architecture (Controllers, Services, Repositories).

**Development Experience:**
- Mobile: Fast refresh with Expo Development Builds and Tailwind JIT compilation.
- Backend: Spring Boot DevTools for rapid restarts.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data models structure and State management approach
- Sync architecture and Conflict resolution

**Important Decisions (Shape Architecture):**
- Infrastructure & Deployment strategy
- Component architecture

**Deferred Decisions (Post-MVP):**
- Generative AI personal plans (deferred to Phase 2 per PRD)
- Smartwatch Ecosystem apps (deferred to Phase 3 per PRD)

### Data Architecture

- **Database:** PostgreSQL (Relational + JSONB unstructured columns)
- **Offline Storage:** SQLite via `expo-sqlite`
- **Migration Approach:** Flyway (v12.1.x) - Industry standard for Spring Boot schema management.
- **Caching Strategy:** Redis - Essential for fast feed retrieval.
- **Data Modeling:** Strict TypeScript interfaces (Frontend) & Java POJOs (Backend) to govern the JSONB payloads.

### Authentication & Security

- **Authentication Method:** JWT + OAuth2 (Apple, Google) - Decided in PRD.
- **Security Middleware:** Spring Security - Standard robust protection.
- **Data Encryption:** TLS 1.3 in transit, AES-256 for PostgreSQL at rest.
- **API Security:** Role-based Endpoint Authorization protecting follower-only visibility.

### API & Communication Patterns

- **API Design:** RESTful CRUD for fixed data + WebSockets for real-time social/sync.
- **API Documentation:** SpringDoc OpenAPI (v2.8.x) - Auto-generates Swagger UI for Spring Boot 3.
- **Error Handling:** RFC 7807 Problem Details via `@ControllerAdvice`.
- **Sync Architecture:** Background event queue with Timestamp-based conflict resolution.

### Frontend Architecture

- **State Management:** Zustand (v5.0.x) for global UI state + TanStack Query (v5.95.x) for async remote server state & caching.
- **Component Architecture:** Atomic Design (Atoms, Molecules, Organisms) to accommodate the highly adaptive multi-sport UI.
- **Routing:** Expo Router (File-based routing) - Decided via Starter template.
- **Styling:** NativeWind (Tailwind CSS) - Decided via Starter template.

### Infrastructure & Deployment

- **Hosting Strategy:** VPS with Docker & Docker Compose - Lean MVP deployment approach.
- **CI/CD Pipeline:** GitHub Actions for API, Expo Application Services (EAS) for Mobile.
- **Monitoring:** Spring Boot Actuator.

### Decision Impact Analysis

**Implementation Sequence:**
1. Backend Database setup (PostgreSQL, Flyway).
2. Backend API scaffolding and Auth core.
3. Mobile React Native boilerplate & Navigation (Expo Router).
4. Local SQLite schema setup & Offline sync queue.
5. Adaptive UI implementation iteratively per sport.

**Cross-Component Dependencies:**
- The JSONB schema strategy heavily relies on strict type definitions strictly modeled between the Java POJOs and Frontend TypeScript interfaces to avoid data corruption.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 key areas where AI agents could make different choices (Naming, Structure, Formats, DB schema formats, Error handling) have been established to ensure deterministic generation.

### Naming Patterns

**Database Naming Conventions:**
- Tables and columns MUST use `snake_case` (e.g., `user_profiles`, `activity_id`).

**API Naming Conventions:**
- Endpoints MUST use `kebab-case` plural nouns (e.g., `/api/v1/user-profiles`).
- JSON payloads MUST use `camelCase` (e.g., `userId`, `displayName`).

**Code Naming Conventions:**
- **Backend (Java):** `PascalCase` for Classes/Records, `camelCase` for methods/variables.
- **Frontend (TypeScript/Expo):** `PascalCase` for React components/files (e.g., `ActivityCard.tsx`), `camelCase` for hooks/utils (e.g., `useActivity.ts`).

### Structure Patterns

**Project Organization:**
- **Backend:** Feature-based slice architecture (e.g., `com.sporttracker.api.activity` containing its own Controller, Service, Repository) to keep domains isolated.
- **Frontend:** `app/` strictly for Expo Router routes, `components/` for shared UI (Atomic Design), `features/` for domain-specific logic.

**File Structure Patterns:**
- Test files MUST be co-located with their implementation (e.g., `UserService.java` next to `UserServiceTest.java`, `Button.tsx` next to `Button.test.tsx`).

### Format Patterns

**API Response Formats:**
- **Success:** Direct JSON payload.
- **Error:** Strict adherence to RFC 7807 Problem Details `{"type": "...", "title": "...", "status": 400, "detail": "..."}`.

**Data Exchange Formats:**
- Dates and Times MUST use ISO 8601 string format (e.g., `2026-03-24T18:51:35Z`).

### Communication Patterns

**Event & State Management Patterns:**
- **Frontend State:** In Zustand, always use immutable updates. 
- **Data Fetching:** TanStack Query keys MUST be structured arrays (e.g., `['activities', 'climbing', { status: 'completed' }]`).

### Process Patterns

**Error Handling Patterns:**
- **Backend:** Global `@ControllerAdvice` catching standard exceptions and mapping to RFC 7807.
- **Frontend:** React Error Boundaries wrapping independent screen sections, with generic fallback UI offering retry functionality.

### Enforcement Guidelines

**All AI Agents MUST:**
- Never map database `snake_case` directly to the frontend; use backend POJO DTOs to enforce `camelCase` serialization.
- Follow the feature-slice organization. Do not create global `controllers/` or `services/` folders on the backend.

**Pattern Examples:**

**Good Examples:**
```java
// Spring Boot (Feature Slice)
package com.sporttracker.api.activity;
public record ActivityDto(String id, String activityType, String startedAt) {}
```

**Anti-Patterns:**
```java
// ANTI-PATTERN: snake_case in Java variables, polluting JSON response shape unpredictably
public class Activity {
    private String activity_type;
}
```

## Project Structure & Boundaries

### Complete Project Directory Structure

**Backend API (Spring Boot 3 / Java 25):**
```text
backend-api/
├── pom.xml
├── docker-compose.yml           # Local PostgreSQL + Redis
├── Dockerfile                   # Prod JRE 21 build
├── src/
│   ├── main/
│   │   ├── java/com/sporttracker/api/
│   │   │   ├── SportTrackerApplication.java
│   │   │   ├── config/              # Security, Redis configs, OpenAPI
│   │   │   ├── common/              # Global exceptions, RFC 7807 handler
│   │   │   ├── auth/                # JWT filters, User Identity
│   │   │   ├── activity/            # Tracking endpoints, JSONB models
│   │   │   ├── dashboard/           # Aggregation & Effort queries
│   │   │   ├── social/              # Feed, Kudos, Comments, Websockets
│   │   │   └── moderation/          # Admin reporting endpoints
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/        # Flyway SQL scripts
│   └── test/
│       └── java/com/sporttracker/api/  # Co-located unit/integration tests
```

**Mobile Client (Expo / React Native / NativeWind):**
```text
mobile-client/
├── package.json
├── app.json                     # Expo config
├── tailwind.config.js           # NativeWind config
├── src/
│   ├── app/                     # Expo Router file-based navigation
│   │   ├── (auth)/              # Login, Register screens
│   │   ├── (tabs)/              # Dashboard, Feed, Profile screens
│   │   ├── tracking/            # Active sport tracking interfaces
│   │   └── _layout.tsx          # Root provider wrappers
│   ├── components/
│   │   ├── ui/                  # Atomic design (Tailwind base components)
│   │   └── features/            # Complex isolated domains (e.g. ClimbingGradePicker)
│   ├── lib/
│   │   ├── api.ts               # Axios/Fetch setup with JWT interceptors
│   │   ├── db.ts                # expo-sqlite initialization
│   │   └── sync.ts              # Background sync queue execution
│   ├── store/                   # Zustand stores (e.g., useAuth)
│   ├── hooks/                   # TanStack Queries/Mutations wrapping API
│   └── types/                   # Shared TS interfaces (MUST sync with Java POJOs)
├── assets/                      # Local images, fonts
└── tests/                       # Jest setups
```

### Architectural Boundaries

**API Boundaries:**
- The backend serves a strict REST API for CRUD, plus a WebSocket endpoint `/ws/social` for real-time feed updates.
- All requests must include JWT in Authorization headers via Axios interceptors.

**Component Boundaries:**
- **UI Atoms (`components/ui`):** Dumb components, pure presentation. No data fetching.
- **Smart Components / Routes (`app/`):** Orchestrate TanStack Query hooks and pass data down to UI atoms.

**Data Boundaries:**
- **Offline-First Contract:** The frontend `tracking/` flow ONLY writes to `expo-sqlite`. It never calls the API directly to save. The `sync.ts` background module is the sole boundary responsible for pushing SQLite payloads to the backend API.

### Requirements to Structure Mapping

**Epic/Feature Mapping:**
- **Auth (FR1-FR5):** `backend/auth/` & `mobile/app/(auth)/`
- **Tracking Adapters (FR6-FR12):** `backend/activity/` & `mobile/app/tracking/`
- **Offline Sync (FR13-FR15):** `mobile/lib/db.ts`, `mobile/lib/sync.ts`
- **Effort Dashboard (FR16-FR18):** `backend/dashboard/` & `mobile/app/(tabs)/dashboard.tsx`
- **Social (FR19-FR24):** `backend/social/` & `mobile/app/(tabs)/feed.tsx`
- **Moderation (FR25-FR28):** `backend/moderation/` (Admin client out of scope for mobile MVP)

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are highly compatible. Spring Boot 3 with Java 25 Virtual Threads is perfectly suited to handle the high concurrency requirements of the background sync queues coming from the Expo mobile clients.

**Pattern Consistency:**
The strict boundary dictating that backend JSONB schemas must be governed by Java POJOs tightly maps to the TypeScript interfaces on the frontend, ensuring data integrity across the stack without breaking the JSONB flexibility.

**Structure Alignment:**
The project structure strictly separates frontend client state from backend server logic, ensuring clean separation of concerns and enabling independent deployment pipelines.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- **Auth, Tracking, Sync, Dashboard, Social, Moderation** all have dedicated architectural homes on both the backend feature slices and frontend routing.

**Functional Requirements Coverage:**
- The 28 FRs from the PRD are fully addressable within the REST/WebSocket and SQLite sync architecture.

**Non-Functional Requirements Coverage:**
- **Performance & Battery:** Addressed via native Expo compilation and efficient Zustand state avoiding unnecessary re-renders.
- **Reliability:** Addressed via the `expo-sqlite` offline-first robust sync queue pattern.
- **Security:** Handled seamlessly by Spring Security and TLS standard configurations.

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions (DBs, frameworks, styling, sync patterns) are completely documented with exact verified versions.

**Structure Completeness:**
A comprehensive directory tree has been established, defining exactly where features, tests, components, and server logic should reside.

**Pattern Completeness:**
Naming conventions, error formats (RFC 7807), and data exchange formats (ISO 8601) are strictly defined, preventing AI agent implementation drift.

### Gap Analysis Results

There are no critical gaps. The architecture completely supports the PRD's MVP scope.
*Nice-to-Have Gap:* E2E testing framework (e.g., Maestro or Detox) for the mobile app wasn't explicitly chosen, but unit/integration tests with Jest cover immediate MVP velocity needs. E2E can be deferred.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH based on validation results and alignment with standard, proven stacks (Spring Boot + React Native).

**Key Strengths:**
- Robust offline-first design explicitly designed to handle network failures cleanly.
- Highly scalable backend utilizing Java 25 virtual threads.
- Adaptable schema design mimicking NoSQL flexibility within robust PostgreSQL boundaries via JSONB.

**Areas for Future Enhancement:**
- Integration of `pgvector` for Phase 2 AI training plan generation.
- Implementation of a dedicated E2E mobile testing framework.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
Initialize the Spring Boot backend via Spring Initializr and the Expo mobile client via `create-expo-app` with NativeWind.
