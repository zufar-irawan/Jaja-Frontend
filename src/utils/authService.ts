"use server";

import api from "./api";
import { cookies } from "next/headers";

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  telepon: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
  user?: {
    id: number;
    nama_lengkap: string;
    email: string;
    role: string;
    toko: any;
  };
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth-jaja/register", data);
    return {
      success: true,
      message:
        response.data.message ||
        "Registrasi berhasil. Silakan cek email untuk verifikasi.",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Registrasi gagal",
    };
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth-jaja/login", data);

    if (response.data.token) {
      const cookieStore = await cookies();
      const userData = response.data.user;

      cookieStore.set("auth-token", response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, 
      });

      cookieStore.set("is-authenticated", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (userData?.role) {
        cookieStore.set("user-role", userData.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      if (userData?.role === "seller" || userData?.toko) {
        cookieStore.set("auth-seller-token", response.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    return {
      success: true,
      message: response.data.message || "Login berhasil",
      data: response.data,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Login gagal",
    };
  }
}

export async function forgotPassword(
  data: ForgotPasswordData,
): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth-jaja/forgot-password", data);
    return {
      success: true,
      message:
        response.data.message ||
        "Link reset password telah dikirim ke email",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Gagal mengirim link reset password",
    };
  }
}

export async function resetPassword(
  data: ResetPasswordData,
): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth-jaja/reset-password", data);
    return {
      success: true,
      message: response.data.message || "Password berhasil direset",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mereset password",
    };
  }
}

export async function loginWithGoogle(
  credential: string,
): Promise<AuthResponse> {
  try {
    const response = await api.get("/auth-jaja/google", {
      params: { token: credential },
    });

    if (response.data.token) {
      const cookieStore = await cookies();
      const userData = response.data.user;

      cookieStore.set("auth-token", response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      cookieStore.set("is-authenticated", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (userData?.role) {
        cookieStore.set("user-role", userData.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      if (userData?.role === "seller" || userData?.toko) {
        cookieStore.set("auth-seller-token", response.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    return {
      success: true,
      message: response.data.message || "Login dengan Google berhasil",
      data: response.data,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    console.error("Google login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login dengan Google gagal",
    };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("auth-seller-token");
  cookieStore.delete("is-authenticated");
  cookieStore.delete("user-role");
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("auth-seller-token");
  cookieStore.delete("is-authenticated");
  cookieStore.delete("user-role");
}

export async function checkAuthStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  return !!token;
}

export async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  const role = cookieStore.get("user-role")?.value;
  return role || null;
}