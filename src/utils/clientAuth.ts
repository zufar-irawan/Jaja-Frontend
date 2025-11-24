"use client";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const cookies = document.cookie.split(";");
    const authFlagCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("is-authenticated="),
    );

    const isAuth =
      !!authFlagCookie && authFlagCookie.split("=")[1].trim() === "true";

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

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
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

export function requireAuth(): boolean {
  return isAuthenticated();
}

export function clearClientAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    document.cookie =
      "is-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Client auth cleared");
  } catch (error) {
    console.error("Error clearing client auth:", error);
  }
}
