"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/utils/authService";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telepon: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.telepon || !formData.password) {
      setError("Semua field harus diisi");
      return false;
    }

    if (formData.password.length < 5) {
      setError("Password minimal 5 karakter");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }

    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.telepon)) {
      setError("Nomor telepon harus 10-13 digit angka");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        alert("Registrasi berhasil! Silakan login dengan akun Anda.");
        router.push("/auth/login");
      } else {
        setError(result.message || "Registrasi gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister(e as any);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#55B4E5] to-[#4A9FD0] items-center justify-center p-12 relative overflow-hidden">
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
            <img
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

          <h2 className="text-4xl font-bold mb-4">Mulai Petualangan Hobi</h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan penggemar hobi lainnya. Jual, beli, dan
            temukan barang impian Anda!
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Daftar gratis dan mudah</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Akses ke ribuan produk hobi</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Jual barang hobi Anda dengan aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar</h1>
            <p className="text-gray-600">Isikan dengan lengkap</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* First Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Depan
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan nama depan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
                disabled={loading}
                autoComplete="given-name"
              />
            </div>

            {/* Last Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Belakang
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan nama belakang"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
                disabled={loading}
                autoComplete="family-name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="08123456789"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
                disabled={loading}
                autoComplete="tel"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan password Anda"
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

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  atau daftar dengan
                </span>
              </div>
            </div>

            {/* Google Register */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
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
    </div>
  );
}