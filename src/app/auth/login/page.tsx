"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, loginWithGoogle } from "@/utils/authService";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberMe");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem("rememberMe", email);
        } else {
          localStorage.removeItem("rememberMe");
        }

        router.push("/");
        router.refresh();
      } else {
        setError(result.message || "Email atau password salah");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      setError("Gagal mendapatkan credential dari Google");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await loginWithGoogle(credentialResponse.credential);

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.message || "Login dengan Google gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login dengan Google");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Login dengan Google dibatalkan atau gagal");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/logo.webp"
              alt="Jaja.id Logo"
              className="h-16 mb-2"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                  e.currentTarget.nextElementSibling.style.display = "block";
                }
              }}
            />
            <div style={{ display: "none" }}>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-4xl font-bold text-[#55B4E5]">Jaja</span>
                <span className="text-4xl font-bold text-[#FBB338]">.id</span>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Selamat Datang Kembali!
            </h1>
            <p className="text-gray-600">
              Masuk untuk melanjutkan petualangan hobi Anda
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan password Anda"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition pr-12"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 text-[#55B4E5] border-gray-300 rounded focus:ring-[#55B4E5]"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <Link
                href="/auth/lupaPassword"
                className="text-sm text-[#55B4E5] hover:text-[#4A9FD0] font-medium"
              >
                Lupa Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  atau login dengan
                </span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                width="384"
                text="continue_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-8">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="text-[#FBB338] hover:text-[#E5A031] font-medium"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#55B4E5] to-[#4A9FD0] items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 border-4 border-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-lg">
          {/* Verified Badge */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/verified-badge.webp"
              alt="Verified Badge"
              className="w-32 h-32 drop-shadow-2xl"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }
              }}
            />
            <div
              style={{ display: "none" }}
              className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl"
            >
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 10L60 25L77 27L63.5 40L67 57L50 48L33 57L36.5 40L23 27L40 25L50 10Z"
                  fill="#55B4E5"
                  opacity="0.3"
                />
                <path
                  d="M30 55L42 67L70 39"
                  stroke="#FBB338"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">Temukan Hobi Anda</h2>
          <p className="text-xl text-blue-100 mb-8">
            Marketplace terlengkap untuk segala macam hobi Anda. Dari koleksi
            action figure, alat musik, hingga perlengkapan outdoor.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Ribuan produk hobby terlengkap</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Transaksi aman dan terpercaya</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Komunitas penggemar hobby aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
