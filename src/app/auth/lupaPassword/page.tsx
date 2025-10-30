"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LupaPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!email) {
            alert('Mohon Masukkan Email Anda');
            return;
        }
        setLoading(true);

        setTimeout(() => {
            console.log('Reset Password for:', email);
            setLoading(false);
            sessionStorage.setItem('resetEmail', email);
            router.push('/auth/lupaPassword/verification');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
          href="/auth/login"
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
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div style={{display: 'none'}}>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-4xl font-bold text-[#55B4E5]">Jaja</span>
                <span className="text-4xl font-bold text-[#FBB338]">.id</span>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lupa Password</h1>
            <p className="text-gray-600">Masukkan Email yang telah terdaftar</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Dapatkan Password'}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8">
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="text-[#FBB338] hover:text-[#E5A031] font-medium">
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
            <img 
              src="/images/forgot-password.webp"
              alt="Forgot Password"
              className="w-32 h-32 drop-shadow-2xl"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div style={{display: 'none'}} className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="40" r="15" stroke="#55B4E5" strokeWidth="4" fill="none"/>
                <path d="M30 55 Q30 45 40 45 H60 Q70 45 70 55 V75 H30 V55Z" fill="#55B4E5" opacity="0.3"/>
                <circle cx="50" cy="65" r="8" fill="#FBB338"/>
                <rect x="48" y="65" width="4" height="12" fill="#FBB338"/>
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">Lupa Password?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan kode verifikasi untuk mereset password Anda.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Proses cepat dan aman</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Kode verifikasi via email</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-lg">Keamanan data terjamin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}