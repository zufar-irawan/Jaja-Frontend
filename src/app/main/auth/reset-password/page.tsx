"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { resetPassword } from "@/utils/authService";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate password strength (0-4)
  const calculatePasswordStrength = () => {
    let strength = 0;
    if (password.length >= 5) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = calculatePasswordStrength();
    if (strength === 0) return { bg: "bg-gray-300", text: "text-gray-500", label: "" };
    if (strength === 1) return { bg: "bg-red-500", text: "text-red-600", label: "Password sangat lemah" };
    if (strength === 2) return { bg: "bg-orange-500", text: "text-orange-600", label: "Password lemah" };
    if (strength === 3) return { bg: "bg-yellow-500", text: "text-yellow-600", label: "Password sedang" };
    return { bg: "bg-green-500", text: "text-green-600", label: "Password kuat" };
  };

  useEffect(() => {
    // Get token and email from URL parameters
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (!urlToken || !urlEmail) {
      setError("Link reset password tidak valid. Silakan minta link baru.");
      return;
    }

    setToken(urlToken);
    setEmail(urlEmail);
  }, [searchParams]);

  const validatePassword = () => {
    if (!password) {
      setError("Password tidak boleh kosong");
      return false;
    }

    if (password.length < 5) {
      setError("Password minimal 5 karakter");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        token: token,
        email: email,
        newPassword: password,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/main/auth/login");
        }, 3000);
      } else {
        setError(
          result.message ||
            "Gagal mengubah password. Token mungkin tidak valid atau sudah kadaluarsa."
        );
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#55B4E5] to-[#4A9FD0] p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Password Berhasil Diubah!
          </h2>
          <p className="text-gray-600 mb-6">
            Password Anda telah berhasil direset. Anda akan diarahkan ke halaman login dalam beberapa detik...
          </p>
          <button
            onClick={() => router.push("/main/auth/login")}
            className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#55B4E5] to-[#4A9FD0] p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Link Tidak Valid
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Link reset password tidak valid. Silakan minta link baru."}
          </p>
          <button
            onClick={() => router.push("/main/auth/lupaPassword")}
            className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg"
          >
            Minta Link Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/images/logo.webp"
              alt="Jaja.id Logo"
              className="h-16 mb-2"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                  e.currentTarget.nextElementSibling.style.display = "flex";
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
              Reset Password
            </h1>
            <p className="text-gray-600">
              Buat password baru untuk{" "}
              <span className="font-semibold text-[#55B4E5]">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition pr-12"
                  disabled={loading}
                  autoComplete="new-password"
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi password baru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition pr-12"
                  disabled={loading}
                  autoComplete="new-password"
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

            {/* Show Password Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 text-[#55B4E5] border-gray-300 rounded focus:ring-[#55B4E5]"
                disabled={loading}
              />
              <label
                htmlFor="showPass"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                Lihat Password
              </label>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 font-medium">Kekuatan Password:</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = calculatePasswordStrength();
                    const isActive = strength >= level;
                    let bgColor = "bg-gray-300";

                    if (isActive) {
                      if (strength === 1) bgColor = "bg-red-500";
                      else if (strength === 2) bgColor = "bg-orange-500";
                      else if (strength === 3) bgColor = "bg-yellow-500";
                      else if (strength === 4) bgColor = "bg-green-500";
                    }

                    return (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded transition-all duration-300 ${bgColor}`}
                      ></div>
                    );
                  })}
                </div>
                {getPasswordStrengthColor().label && (
                  <div className={`text-xs font-semibold ${getPasswordStrengthColor().text}`}>
                    {getPasswordStrengthColor().label}
                  </div>
                )}
                {/*<div className="text-xs text-gray-500 space-y-1">
                  <div className={password.length >= 5 ? "text-green-600 font-medium" : ""}>
                    {password.length >= 5 ? "✓" : "○"} Minimal 5 karakter
                  </div>
                  <div className={password.length >= 8 ? "text-green-600 font-medium" : ""}>
                    {password.length >= 8 ? "✓" : "○"} Minimal 8 karakter (lebih baik)
                  </div>
                  <div className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-600 font-medium" : ""}>
                    {/[A-Z]/.test(password) && /[a-z]/.test(password) ? "✓" : "○"} Kombinasi huruf besar & kecil
                  </div>
                  <div className={/\d/.test(password) ? "text-green-600 font-medium" : ""}>
                    {/\d/.test(password) ? "✓" : "○"} Mengandung angka
                  </div>
                </div>*/}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Menyimpan...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8">
            Ingat password Anda?{" "}
            <a
              href="/main/auth/login"
              className="text-[#FBB338] hover:text-[#E5A031] font-medium"
            >
              Login di sini
            </a>
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
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <img
                src="/svg/lock_icon.svg"
                alt="Lock Icon"
                className="w-20 h-20"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2355B4E5'%3E%3Cpath d='M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V20h-2v-2.277A1.993 1.993 0 0 1 10 16c0-1.103.897-2 2-2s2 .897 2 2a1.993 1.993 0 0 1-1 1.723z'/%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">Buat Password Baru</h2>
          <p className="text-xl text-blue-100 mb-8">
            Pastikan password baru Anda kuat dan mudah diingat. Gunakan kombinasi huruf besar, kecil, dan angka untuk keamanan maksimal.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Minimal 5 karakter</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Kombinasi huruf dan angka</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Aman dan terenkripsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
