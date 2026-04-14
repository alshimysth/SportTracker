---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - Application/docs/sport-tracker-vision-produit.docx
workflowType: 'prd'
documentCounts:
  briefCount: 1
  researchCount: 0
    brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: mobile_app
  domain: Health & Fitness
  complexity: Medium
  projectContext: greenfield
---

# Product Requirements Document - Application

**Author:** Alshimysth
**Date:** 2026-03-23

## Executive Summary

Sport Tracker is a single mobile application unifying tracking for all sports with a unique adaptive interface for each discipline. It solves the fragmentation problem for multidisciplinary athletes who currently must juggle generic trackers like Strava alongside specialized apps for climbing or weightlifting. By providing targeted metrics per sport—such as grades for climbing, splits for running, and set logging for fitness—it delivers specialized utility within a unified, cross-sport scheduling and social ecosystem.

### What Makes This Special

Sport Tracker differentiates itself through its adaptive UX, universally covering diverse sports while maintaining deep, discipline-specific metric tracking. The core insight is that active individuals are rarely mono-disciplinary; providing them a single platform eliminates app fatigue and creates a uniquely holistic view of their fitness journey.

## Project Classification

- **Project Type:** Mobile Application + Backend API
- **Domain:** Health & Fitness
- **Complexity:** Medium
- **Context:** Greenfield

## Success Criteria

### User Success
- **Frictionless Tracking:** Users can log a climbing session, a run, and a gym workout with interfaces perfectly tailored to each sport, without needing workarounds.
- **Holistic View:** Users can see their complete physical workload and progression across all disciplines in a single unified dashboard and calendar.
- **Social Engagement:** Users actively interact with peers across different sports via kudos and comments on a unified activity feed.

### Business Success
- **MVP Adoption:** Reach an initial user base of a few hundred early adopters (multisport athletes) to validate the core value proposition.
- **Retention:** High active usage spanning multiple sports per user (indicating the app successfully replaces their fragmented toolset).
- **Scalability Foundation:** Validate the monetization strategy once core engagement is proven.

### Technical Success
- **Cross-Platform Delivery:** Seamless deployment of the React Native (Expo) app to both iOS and Android via EAS.
- **Backend Performance:** The Spring Boot/PostgreSQL backend efficiently handles concurrent tracking and feed queries for the initial user base on the target VPS.
- **Extensible Architecture:** The hybrid data model (universal fields + JSONB) successfully allows adding new sports without schema migrations.

### Measurable Outcomes
- **Launch:** MVP released on App Store and Google Play.
- **Engagement:** Average user tracks at least 2 different types of sports per month.
- **Performance:** Feed API response times remain under 200ms.

## Product Scope & Phased Development

### Phase 1: MVP Strategy
**MVP Approach:** Experience MVP. The goal is to prove that an adaptive, context-switching UI combined with a unified effort dashboard provides a vastly superior experience compared to juggling separate apps.
**Resource Requirements:** Lean squad (1-2 Mobile Developers, 1 Backend Engineer, 1 UI/UX Designer).

**Must-Have MVP Capabilities:**
- **Core Sports:** Dedicated UX for exactly 3 distinct disciplines (Running, Climbing, Weightlifting) to prove the concept without bloating development.
- **User Authentication & Identity:** Profiles and basic settings.
- **Offline-First Tracking:** Local SQLite caching with background sync.
- **Unified Dashboard:** Cross-sport calendar and basic effort aggregation.
- **Social Features:** Activity feed, following, kudos, and comments.

### Phase 2: Growth
- **New Sports:** Expansion to 10+ new sports (Cycling, Swimming, Tennis, etc.).
- **Advanced Analytics:** Fatigue vs. Fitness tracking.
- **Health Sync:** Integration with Apple HealthKit and Google Health Connect.
- **Generative AI:** AI-driven personalized training plans based on historical cross-sport data.

### Phase 3: Vision & Expansion
- **Smartwatch Ecosystem:** Apple Watch / Wear OS companion apps.
- **Creator Economy:** Marketplace for coaches and influencers to sell training plans.
- **Advanced Integrations:** Strava/Garmin two-way sync and AI parsing of external training plans (text/audio).

### Risk Mitigation Strategy
- **Technical Risks:** Managing a hybrid database model can lead to unstructured "JSONB spaghetti".
  *Mitigation:* Enforce strict data contracts via TypeScript interfaces on the frontend and Java POJOs on the backend before JSONB serialization. 
- **Market Risks:** Athletes are deeply entrenched in specialized apps (e.g., Strava).
  *Mitigation:* Target the "Hybrid Athlete" specifically—the user who currently feels the acute pain of trying to aggregate their climbing and running data manually.
- **Resource Risks:** Building "multiple apps in one" for the MVP could cause severe scope creep and delay launch.
  *Mitigation:* Strictly limit the MVP to the 3 initial sports. Resist adding more sports until the core adaptive architecture is proven in production.

## User Journeys

### 1. Dimitri's Multisport Weekend (Primary User - Success Path)
- **Situation:** Dimitri climbs indoors on Friday and runs a 10k on Sunday. He's tired of using two different apps and manually comparing his cross-training load.
- **Action:** He opens Sport Tracker at the climbing gym. The interface adapts instantly to climbing mode. He logs 5 routes. On Sunday, he switches to running mode and tracks his 10k via GPS.
- **Climax:** After his run, he opens the unified dashboard. He sees a beautiful, combined summary of his weekend's effort. A friend sees his run on the social feed and leaves a kudos.
- **Resolution:** Dimitri feels understood as an athlete and finally uninstalls his fragmented tracking apps.

### 2. Sarah the Outdoor Climber (Primary User - Edge Case/Offline)
- **Situation:** Sarah is bouldering outdoors at Fontainebleau with zero cell reception. She wants to record her ascents accurately without waiting until she gets home.
- **Action:** She opens Sport Tracker. The app functions entirely offline, seamlessly logging her attempts and sends to local storage.
- **Climax:** Hours later, when she returns to a café with Wi-Fi, the app automatically detects the connection and quietly syncs her session to the backend.
- **Resolution:** Sarah reviews her updated stats on the cloud with zero data loss and no manual "force sync" hassle.

### 3. Alex the Community Manager (Admin/Operations User)
- **Situation:** As the user base grows, the social feed occasionally receives spam or inappropriate comments.
- **Action:** Alex logs into the Sport Tracker admin portal.
- **Climax:** He reviews a list of user-flagged comments, securely deletes a spam post with one click, and suspends the offending account.
- **Resolution:** The community remains a positive, encouraging space for athletes.

### 4. Leo's Training Plateau (Growth/Phase 2 User)
- **Situation:** Leo is plateauing and wants a structured plan that balances climbing with weightlifting, but can't afford a customized coach.
- **Action:** He clicks "Generate Plan" and inputs his goals and current fatigue levels.
- **Climax:** The AI analyzes his historical data across both sports and generates a targeted 4-week schedule directly into his unified calendar.
- **Resolution:** Leo simply opens his app every day to see exactly what he needs to do to improve.

## System Architecture & Technical Constraints

### Project-Type Overview
Sport Tracker operates as a dual-component system: a cross-platform mobile application (React Native/Expo) demanding heavy hardware integration (GPS, health sensors) and offline capability, supported by a high-concurrency Backend API (Java 25/Spring Boot) managing a hybrid, multi-sport data model.

### 1. Mobile Client (Frontend)
- **Platform & Framework:** Expo (React Native) targeting iOS and Android, leveraging EAS Build and OTA updates.
- **Device Permissions:** Background/Foreground location (`expo-location`), HealthKit/Google Connect read/write access, and Push Notifications.
- **Offline Reliability:** Local persistence using `expo-sqlite` and MMKV. Enforces optimistic UI updates with a robust background queue to push activities to the backend upon reconnection.

### 2. Backend Infrastructure (API)
- **Core Architecture:** Modular Monolith built on Spring Boot 3.x, cleanly separating domains (Identity, Activities, Social, AI).
- **Concurrency & Performance:** Leveraging Java 25 Virtual Threads to efficiently handle high-concurrency background offline syncs and maintain persistent WebSocket connections without thread starvation.
- **API Design:** RESTful endpoints for standard CRUD operations and WebSockets for real-time social interactions.

### 3. Data Layer & Caching
- **Hybrid Database Model:** PostgreSQL utilizing a dual strategy:
  1. Standard relational tables for fixed data (Users, Auth, Generic Activity Headers).
  2. `JSONB` columns for unstructured, sport-specific metrics (e.g., granular climbing grades vs. running splits) avoiding infinite schema migrations.
- **AI & Caching Readiness:** `pgvector` enabled in Postgres for the Phase 2 AI plan generation. Redis implemented for caching high-read traffic.

### 4. Security, Privacy & Compliance
- **Authentication:** Spring Security combined with stateless JWT tokens. Support for OAuth2 (Sign in with Apple / Google).
- **Store & Health Policies:** Strict adherence to App Store/Play Store health and background location guidelines. Data must be used exclusively for app functionality (explicit consent required, no selling of health data).
- **Privacy Standards (GDPR/CCPA):** Standard user data privacy, right-to-deletion, and clear opt-in for continuous location tracking.

## Functional Requirements

### Authentication & Identity Management
- **FR1:** Users can create an account using email/password.
- **FR2:** Users can authenticate using third-party providers (Apple, Google OAuth2).
- **FR3:** Users can update their profile information (display name, bio, profile picture).
- **FR4:** Users can configure their primary sports and preferred measurement units.
- **FR5:** Users can permanently delete their account and associated data.

### Activity Tracking & Contextual UI
- **FR6:** Users can manually select from the 3 MVP-supported sports (Running, Climbing, Weightlifting) to begin a tracking session.
- **FR7:** The system displays a completely tailored data-entry and tracking interface specific to the selected sport.
- **FR8:** Users can record granular metrics specific to climbing (e.g., grade system, attempts, flash/sends).
- **FR9:** Users can record GPS path, distance, and pace data for running activities.
- **FR10:** Users can manually retroactively log a past activity without active real-time tracking.
- **FR11:** Users can edit the details of a completed activity (e.g., correcting an inaccurate grade or distance).
- **FR12:** Users can delete an activity from their history.

### Data Sync & Offline Management
- **FR13:** Users can start, interact with, and save activity tracking sessions entirely offline without internet connectivity.
- **FR14:** The system automatically synchronizes locally saved activities to the backend when a stable network connection is restored.
- **FR15:** The system resolves data synchronization conflicts automatically using timestamp reconciliation without user intervention.

### Effort & Analytics Dashboard
- **FR16:** Users can view a unified calendar displaying all logged activities across all sports.
- **FR17:** Users can view an aggregated summary of their weekly and monthly cross-sport training effort.
- **FR18:** Users can filter their historical feed and statistics by specific sport, date range, or activity type.

### Social & Community Interaction
- **FR19:** Users can search for and follow other athletes' profiles.
- **FR20:** Users can view a reverse-chronological social feed of activities from the athletes they follow.
- **FR21:** Users can leave "Kudos" on other users' activities.
- **FR22:** Users can read, post, and delete comments on activities.
- **FR23:** Users can share a visual summary of their activity to external platforms (e.g., Instagram Stories).
- **FR24:** Users can configure and receive push notifications for social interactions (new followers, kudos, comments).

### Moderation & Administration
- **FR25:** Users can flag inappropriate comments or activities on the social feed.
- **FR26:** Administrators can view and manage flagged content via an administrative capability/portal.
- **FR27:** Administrators can delete violating content from the system.
- **FR28:** Administrators can issue warnings or suspend user accounts.

## Non-Functional Requirements

### Performance & Battery
- **NFR1 (UI Responsiveness):** The active tracking interface (e.g., live timer, heart rate rendering) must render at a minimum of 60fps with zero perceived blocking on the main UI thread.
- **NFR2 (Battery Efficiency):** Continuous background GPS and sensor tracking must consume no more than 8% battery capacity per hour on a standard mid-range or flagship device (e.g., iPhone 13 / Pixel 6).
- **NFR3 (Cold Start):** Time to Interactive (TTI) from a cold app launch must be under 2.5 seconds to ensure users can start tracking immediately without frustration.

### Reliability & Offline Availability
- **NFR4 (Data Persistence):** 100% of in-progress tracked activity data must survive an unexpected app crash, OOM kill, or OS-level termination without data loss.
- **NFR5 (Sync Resilience):** The background sync queue must successfully retry and upload 99.9% of cached offline activities within 24 hours of regaining stable network connectivity.

### Security & Privacy
- **NFR6 (Data Encryption):** All sensitive user data—specifically precise GPS polyline paths and continuous heart rate data—must be encrypted in transit via TLS 1.3 and encrypted at rest on the backend database.
- **NFR7 (API Authorization):** Private accounts and "followers-only" activities must strictly enforce backend authorization, ensuring no data leaks via IDOR (Insecure Direct Object Reference) vulnerabilities.

### Scalability
- **NFR8 (Sync Throughput):** The Java 25 backend must support a minimum of 500 concurrent activity data syncs per second (which typically cluster at the end of weekends or races) with a p95 response time under 300ms.
