/**
 * expo-sqlite initialisation.
 * The tracking/ flow ONLY writes here. Never calls the API directly.
 * The sync.ts module is the sole boundary that pushes SQLite payloads to the backend.
 *
 * TODO (Epic 3 - Tracking): open the DB, run schema migrations, export helpers.
 */
