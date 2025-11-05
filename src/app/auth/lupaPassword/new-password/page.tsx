"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/utils/authService";

export default function NewPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if user has verified
    const verificationToken = sessionStorage.getItem("verificationToken");
    const resetEmail = sessionStorage.getItem("resetEmail");

    if (!verificationToken || !resetEmail) {
      // If not verified, redirect back
      router.push("/auth/lupaPassword");
    } else {
      setEmail(resetEmail);
      setToken(verificationToken);
    }
  }, [router]);

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        newPassword: password
      });

      if (result.success) {
        // Clear session storage
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("verificationToken");

        alert("Password berhasil diubah! Silakan login dengan password baru Anda.");
        router.push("/auth/login");
      } else {
        setError(result.message || "Gagal mengubah password. Token mungkin tidak valid atau sudah kadaluarsa.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/auth/lupaPassword/verification"
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Kembali</span>
          </Link>

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
              New Password
            </h1>
            <p className="text-gray-600">Masukkan password baru</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                <div className="text-xs text-gray-600">Kekuatan Password:</div>
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded transition-colors ${
                      password.length >= 5 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded transition-colors ${
                      password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded transition-colors ${
                      /[A-Z]/.test(password) && /[a-z]/.test(password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded transition-colors ${
                      /\d/.test(password) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
                    ? "Password kuat"
                    : password.length >= 5
                    ? "Password sedang"
                    : "Password lemah"}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8">
            Sudah memiliki akun?{" "}
            <Link
              href="/auth/login"
              className="text-[#FBB338] hover:text-[#E5A031] font-medium"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#55B4E5] to-[#4A9FD0] items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 border-4 border-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="flex justify-center mb-8">
            {/* Ikon SVG */}
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <img
                src="/svg/check_icon.svg"
                alt="Check Icon"
                className="w-20 h-20"
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">Hampir Selesai!</h2>
          <p className="text-xl text-blue-100 mb-8">
            Buat password baru yang kuat untuk akun Anda. Pastikan password
            mudah diingat namun sulit ditebak.
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
              <span className="text-lg">Gunakan huruf besar dan kecil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}