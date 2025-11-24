"use client";

// Client-side auth utility for checking authentication status
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    // Since the auth-token cookie is httpOnly, we can't read it directly
    // Instead, we'll check if there's a non-httpOnly flag cookie that indicates authentication
    const cookies = document.cookie.split(";");
    const authFlagCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("is-authenticated="),
    );

    const isAuth =
      !!authFlagCookie && authFlagCookie.split("=")[1].trim() === "true";

    // Debug logging (can be removed in production)
    console.log("Auth Check:", {
      allCookies: document.cookie,
      authFlagCookie,
      isAuthenticated: isAuth,
    });

    return isAuth;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

// Get auth token from cookies (won't work with httpOnly cookies)
export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Note: This won't work if the cookie is httpOnly
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth-token="),
    );

    if (authCookie) {
      return authCookie.split("=")[1].trim();
    }

    return null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

// Check if user is authenticated and show login alert if not
export function requireAuth(): boolean {
  return isAuthenticated();
}

// Clear client-side auth state (for logout)
export function clearClientAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Delete the is-authenticated cookie by setting it to expire
    document.cookie =
      "is-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Client auth cleared");
  } catch (error) {
    console.error("Error clearing client auth:", error);
  }
}
