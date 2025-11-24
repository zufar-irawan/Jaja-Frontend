"use client";

export function isAuthenticated(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

<<<<<<< HEAD
  try {
    const cookies = document.cookie.split(";");
    const authFlagCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("is-authenticated="),
    );
=======
    try {
        // Since the auth-token cookie is httpOnly, we can't read it directly
        // Instead, we'll check if there's a non-httpOnly flag cookie that indicates authentication
        const cookies = document.cookie.split(";");
        const authFlagCookie = cookies.find((cookie) =>
            cookie.trim().startsWith("is-authenticated="),
        );
>>>>>>> 41b0625b10ff53c28f1532812dbdeb41887239e2

        const isAuth =
            !!authFlagCookie && authFlagCookie.split("=")[1].trim() === "true";

<<<<<<< HEAD
    console.log("Auth Check:", {
      allCookies: document.cookie,
      authFlagCookie,
      isAuthenticated: isAuth,
    });
=======
        // Debug logging (can be removed in production)
        console.log("Auth Check:", {
            allCookies: document.cookie,
            authFlagCookie,
            isAuthenticated: isAuth,
        });
>>>>>>> 41b0625b10ff53c28f1532812dbdeb41887239e2

        return isAuth;
    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    }
}

export function getAuthToken(): string | null {
<<<<<<< HEAD
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
=======
    if (typeof window === "undefined") {
        return null;
>>>>>>> 41b0625b10ff53c28f1532812dbdeb41887239e2
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

export function requireAuth(): boolean {
    return isAuthenticated();
}

export function clearClientAuth(): void {
    if (typeof window === "undefined") {
        return;
    }

<<<<<<< HEAD
  try {
    document.cookie =
      "is-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Client auth cleared");
  } catch (error) {
    console.error("Error clearing client auth:", error);
  }
=======
    try {
        // Delete the is-authenticated cookie by setting it to expire
        document.cookie =
            "is-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("Client auth cleared");
    } catch (error) {
        console.error("Error clearing client auth:", error);
    }
>>>>>>> 41b0625b10ff53c28f1532812dbdeb41887239e2
}
