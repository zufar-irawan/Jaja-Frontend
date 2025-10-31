"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Verification() {
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from sessionStorage
    const savedEmail = sessionStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // If no email found, redirect back
      router.push("/auth/lupaPassword");
    }

    // Timer countdown
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newPin = pastedData.split("");
      setPin([...newPin, ...Array(6 - newPin.length).fill("")]);
      // Focus on last filled input or last input
      const focusIndex = Math.min(pastedData.length, 5);
      document.getElementById(`pin-${focusIndex}`)?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      console.log("Resend code to:", email);
      setResendTimer(60);
      alert("Kode verifikasi telah dikirim ulang ke email Anda!");
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const pinCode = pin.join("");
    if (pinCode.length !== 6) {
      alert("Mohon masukkan 6 digit PIN lengkap");
      return;
    }

    setLoading(true);

    // Simulasi API call
    setTimeout(() => {
      console.log("PIN:", pinCode);
      setLoading(false);
      // Simpan PIN untuk verifikasi
      sessionStorage.setItem("verificationPin", pinCode);
      // Redirect ke halaman new password
      router.push("/auth/lupaPassword/new-password");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/auth/lupaPassword"
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
              Verification
            </h1>
            <p className="text-gray-600">
              Tolong masukkan 6 digit PIN yang sudah dikirimkan ke email{" "}
              <span className="font-semibold text-[#55B4E5]">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                PIN
              </label>
              <div className="flex gap-3 justify-between" onPaste={handlePaste}>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition"
                  />
                ))}
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Tidak menerima kode?{" "}
                {resendTimer > 0 ? (
                  <span className="text-gray-400">
                    Kirim ulang dalam {resendTimer}s
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-[#55B4E5] hover:text-[#4A9FD0] font-medium"
                  >
                    Kirim Ulang
                  </button>
                )}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#55B4E5] text-white py-3 rounded-lg font-medium hover:bg-[#4A9FD0] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </button>
          </div>

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
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#55B4E5] to-[#4A9FD0] items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 border-4 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="flex justify-center mb-8">
            {/* Ikon lingkaran putih dengan SVG gembok */}
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="25"
                  y="35"
                  width="50"
                  height="40"
                  rx="5"
                  stroke="#55B4E5"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M35 35 V25 Q35 15 50 15 Q65 15 65 25 V35"
                  stroke="#55B4E5"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="50" cy="55" r="8" fill="#FBB338" />
                <path
                  d="M50 63 L50 68"
                  stroke="#FBB338"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">Verifikasi Email</h2>
          <p className="text-xl text-blue-100 mb-8">
            Kami telah mengirimkan kode verifikasi 6 digit ke email Anda.
            Silakan periksa inbox atau folder spam Anda.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <span className="text-lg">Cek email Anda</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <span className="text-lg">Masukkan kode 6 digit</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-[#FBB338] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <span className="text-lg">Buat password baru</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
