# Application-SportTracker Foundation

This plan covers the initialization and scaffolding of the **Application-SportTracker** project based on Epic 1, Story 1.1: Project Scaffolding & Design System Foundation.

## User Review Required

> [!IMPORTANT]
> Please review the infrastructure commands and the specific versions (e.g., Spring Boot 3.5.0, Java 25, and Expo) to assure they match your local environment before we execute them.

## Proposed Changes

We will work entirely inside the `/Users/alshimysth/Projets/SportTracker/Application-SportTracker` directory to separate the application source code from the planning and mockup artifacts. 

### 1. Mobile Client Integration (mobile-client)

We will initialize the mobile application using the Expo default template and integrate NativeWind for Tailwind styling.

#### [NEW] `mobile-client` project scaffolding
- Run `npx create-expo-app@latest mobile-client --template default`
- Install NativeWind and its dependencies: `nativewind tailwindcss react-native-reanimated react-native-safe-area-context`
- Initialize Tailwind configuration: `npx tailwindcss init`

#### [MODIFY] `mobile-client/tailwind.config.js`
- Configure the theme to include the dual-theme token system from the UX Specification.
- Define custom color paths to handle **Alpine Pure (Light)** and **Midnight Peak (Dark)** themes.
  - Base Backgrounds: `#FFFFFF` (Light), `#0F172A` (Dark)
  - Card Backgrounds: `#F8F9FA` (Light), `#1E293B` (Dark)
  - Headers: `#1C3F60` (Light)
  - Accent/Primary: `#FF6B4A` (Coral), `#22C55E` (Green)
  - Data Emphasis: `#0369A1` (Light Blue), `#38BDF8` (Dark Cyan)
- Configure typography scale to use `Inter`.

#### [MODIFY] `mobile-client/app/_layout.tsx` (and related routing structure)
- Assure file-based routing builds correctly and load custom fonts like `Inter`.

### 2. Backend API Scaffolding (backend-api)

We will generate a Spring Boot 3 application using the Spring Initializr API.

#### [NEW] `backend-api` project scaffolding
- Perform a cURL request to Spring Initializr downloading `backend.zip` with the following parameters:
  - Spring Boot Version: `3.5.0`
  - Java Version: `25`
  - Dependencies: `web, data-jpa, postgresql, data-redis, security, actuator, validation`
  - Package Name: `com.sporttracker.api`
- Extract locally into the `backend-api/` directory.

#### [NEW] `backend-api/src/main/java/com/sporttracker/api/` directories
Establish the initial feature-slice structural footprint defined in the architecture document:
- `config/`
- `common/`
- `auth/`

### 3. Docker and Deployment Footprint

#### [NEW] `backend-api/docker-compose.yml`
- Setup local PostgreSQL and Redis container orchestration for development.

## Open Questions

> [!WARNING]
> Do you have `java` (version 21) or `maven` currently installed on your macOS system in case we need to build and verify the backend APIs locally?
> Do you have a specific database user/password preference for the `docker-compose.yml`, or should I proceed with default secure credentials (e.g., `postgres` / `postgres`)?

## Verification Plan

### Automated Tests
- Build and lint the `mobile-client` to ensure Expo and NativeWind successfully resolve Tailwind classes without errors.
- Run Native testing scripts if present via `npm test`.
- Compile the Spring Boot application using `./mvnw clean install -DskipTests` ensuring all dependencies are functionally fetched.

### Manual Verification
- Start the `docker-compose.yml` to verify PostgreSQL and Redis successfully initialize locally.
- Review `tailwind.config.js` to confirm that all necessary hex values match the UX-DR1 requirements precisely.
