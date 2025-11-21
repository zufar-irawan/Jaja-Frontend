"use client"

// Client-side auth utility for checking authentication status
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
        return false
    }

    // Check for auth token in cookies
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie =>
        cookie.trim().startsWith('auth-token=')
    )

    return !!authCookie && authCookie.split('=')[1].trim() !== ''
}

// Get auth token from cookies
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') {
        return null
    }

    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie =>
        cookie.trim().startsWith('auth-token=')
    )

    if (authCookie) {
        return authCookie.split('=')[1].trim()
    }

    return null
}

// Check if user is authenticated and show login alert if not
export function requireAuth(): boolean {
    return isAuthenticated()
}
