/**
 * Background sync queue.
 * Reads pending SQLite records and pushes them to the REST API.
 * Retries on failure with exponential back-off.
 * Shows "Saved Locally" state — never error banners — while offline.
 *
 * TODO (Epic 3 - Offline Sync): implement queue, retry logic, conflict resolution via timestamps.
 */
