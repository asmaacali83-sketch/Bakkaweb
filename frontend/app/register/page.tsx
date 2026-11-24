"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get("password") || "");
    if (password !== form.get("confirmPassword")) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/backend/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          password,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to create your account");
      formElement.reset();
      router.push("/student");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create your account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eff4fb] px-4 py-8 sm:px-8 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_14%_12%,rgba(244,161,26,.17),transparent_30%),radial-gradient(ellipse_at_90%_88%,rgba(29,93,186,.14),transparent_32%)]" />
      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_35px_90px_rgba(16,45,91,.16)] lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#0d2f68_0%,#154c9d_58%,#1d5dba_100%)] p-8 text-white sm:p-10 lg:min-h-[690px] lg:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#123c82] shadow-lg shadow-blue-950/20">
              <GraduationCap size={30} />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">Bakka</p>
              <p className="mt-1 text-sm font-medium text-blue-100">Training Center</p>
            </div>
          </div>
          <div className="relative mt-10">
            <p className="mb-4 inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Student registration
            </p>
            <h1 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Start your learning journey.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100">
              Create a student account to access your courses, schedule, progress, and certificates.
            </p>
          </div>
          <p className="mt-8 flex items-center gap-2 border-t border-white/15 pt-5 text-xs text-blue-100">
            <ShieldCheck size={16} className="text-amber-300" />
            Your account will only receive student access.
          </p>
        </div>

        <div className="flex items-center p-7 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1d5dba]">Join Bakka</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">All fields are required to set up your student profile.</p>

            <form method="post" className="mt-7 space-y-4" onSubmit={handleSubmit} aria-label="Create student account">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  maxLength={160}
                  required
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d5dba] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  required
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d5dba] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                    className="h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d5dba] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="At least 12 characters"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-slate-400 transition hover:text-[#123c82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1d5dba]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  required
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d5dba] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Re-enter your password"
                />
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Use at least 12 characters. Staff and admin accounts are created by authorized administrators.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#123c82] font-bold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-[#1d5dba] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create student account"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </form>

            <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/" className="font-bold text-[#1d5dba] hover:text-[#123c82]">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
