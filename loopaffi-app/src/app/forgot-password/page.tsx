"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Infinity, Loader2, Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "verify-email" | "reset-password" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>("verify-email");

  // Form state
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl =
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/v1";

  // ── Step 1: Verifikasi email ────────────────────────────────────────────────
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Kita coba reset dengan password dummy untuk mengecek apakah email ada di DB.
      // Backend akan return error "email tidak ditemukan" jika email tidak terdaftar,
      // atau error "password minimal 6 karakter" jika email valid (karena dummy "x").
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: "x" }),
      });

      const result = await response.json();

      // Jika backend return "email tidak ditemukan" → email salah
      if (result.message && result.message.toLowerCase().includes("tidak ditemukan")) {
        setError("Email tidak terdaftar. Periksa kembali alamat email Anda.");
        return;
      }

      // Email valid (backend return error password atau sukses) → lanjut ke step 2
      setStep("reset-password");
    } catch {
      setError("Gagal terhubung ke server. Pastikan backend sudah menyala.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Reset password ──────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setStep("done");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setError(result.message || "Gagal mengubah password.");
      }
    } catch {
      setError("Gagal terhubung ke server. Pastikan backend sudah menyala.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step indicator ──────────────────────────────────────────────────────────
  const steps = [
    { id: "verify-email", label: "Verifikasi Email" },
    { id: "reset-password", label: "Ganti Password" },
  ];
  const currentStepIndex = step === "done" ? 2 : steps.findIndex((s) => s.id === step);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200 mb-4">
              <Infinity className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-950">Lupa Password</h1>
            <p className="text-sm text-slate-500 text-center mt-1">
              {step === "verify-email" && "Masukkan email akun Anda untuk verifikasi"}
              {step === "reset-password" && "Email terverifikasi. Buat password baru Anda"}
              {step === "done" && "Password berhasil diubah!"}
            </p>
          </div>

          {/* Step Indicator */}
          {step !== "done" && (
            <div className="flex items-center gap-2 mb-7">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                        i < currentStepIndex
                          ? "bg-green-500 text-white"
                          : i === currentStepIndex
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {i < currentStepIndex ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        i === currentStepIndex ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-1 transition-all duration-300 ${
                        i < currentStepIndex ? "bg-green-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Step 1: Verifikasi Email ── */}
          {step === "verify-email" && (
            <form onSubmit={handleVerifyEmail} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Alamat Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Masukkan email yang terdaftar di akun Anda
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Verifikasi Email"
                )}
              </Button>
            </form>
          )}

          {/* ── Step 2: Reset Password ── */}
          {step === "reset-password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Email verified badge */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-xs text-green-700 font-medium">{email}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                  Password Baru
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setStep("verify-email"); setError(""); }}
                  className="h-11 px-4 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Ubah Password"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* ── Step 3: Done ── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Password Berhasil Diubah!</p>
                <p className="text-sm text-slate-500 mt-1">
                  Anda akan diarahkan ke halaman login...
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                <div className="bg-red-500 h-1 rounded-full animate-[progress_2.5s_linear_forwards]" />
              </div>
            </div>
          )}

          {/* Back to login */}
          {step !== "done" && (
            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="text-red-600 hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}