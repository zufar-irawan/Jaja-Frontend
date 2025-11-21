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
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await api.post("/main/auth/register", data);
    return {
      success: true,
      message: response.data.message || "Registrasi berhasil",
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
    const response = await api.post("/main/auth/login", data);

    if (response.data.token) {
      const cookieStore = await cookies();
      cookieStore.set("auth-token", response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      message: response.data.message || "Login berhasil",
      data: response.data,
      token: response.data.token,
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
    const response = await api.post("/main/auth/forgot-password", data);
    return {
      success: true,
      message: response.data.message || "Kode verifikasi telah dikirim",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Gagal mengirim kode verifikasi",
    };
  }
}

export async function resetPassword(
  data: ResetPasswordData,
): Promise<AuthResponse> {
  try {
    const response = await api.post("/main/auth/reset-password", data);
    return {
      success: true,
      message: response.data.message || "Password berhasil diubah",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengubah password",
    };
  }
}

export async function loginWithGoogle(
  credential: string,
): Promise<AuthResponse> {
  try {
    const response = await api.post("/main/auth/google", {
      token: credential,
    });

    if (response.data.token) {
      const cookieStore = await cookies();
      cookieStore.set("auth-token", response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      message: response.data.message || "Login dengan Google berhasil",
      data: response.data,
      token: response.data.token,
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
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

export async function checkAuthStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  return !!token;
}
