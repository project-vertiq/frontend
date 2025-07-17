import { refreshToken } from "./auth.api";

// Shared refresh promise to prevent multiple simultaneous refreshes
let refreshPromise = null;

/**
 * Helper to fetch with automatic 401 refresh and retry logic.
 * Ensures only one refresh happens at a time and all 401s wait for it.
 */
export async function fetchWithAuthRetry(
  fetchFn,
  accessToken,
  setAccessToken,
  ...args
) {
  try {
    return await fetchFn(accessToken, ...args);
  } catch (err) {
    const status =
      err && typeof err === "object" && "status" in err
        ? err.status
        : undefined;
    const unauthorized =
      status === 401 || (err && err.error === "Unauthorized");
    if (unauthorized) {
      // If a refresh is already in progress, wait for it
      if (!refreshPromise) {
        refreshPromise = refreshToken();
      }
      let newToken;
      try {
        const { accessToken: refreshedToken } = await refreshPromise;
        newToken = refreshedToken;
        setAccessToken(newToken);
      } finally {
        // Clear the promise so future 401s can trigger a new refresh
        refreshPromise = null;
      }
      // Retry original request with new token
      return await fetchFn(newToken, ...args);
    }
    throw err;
  }
}
