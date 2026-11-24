"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/backend/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to sign in");
      const role = body.data.role as "admin" | "staff" | "student";
      formElement.reset();
      router.push(`/${role}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eff4fb] px-4 py-8 sm:px-8 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_14%_12%,rgba(244,161,26,.17),transparent_30%),radial-gradient(ellipse_at_90%_88%,rgba(29,93,186,.14),transparent_32%)]" />
      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_35px_90px_rgba(16,45,91,.16)] lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative flex min-h-[540px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#0d2f68_0%,#154c9d_58%,#1d5dba_100%)] p-8 text-white sm:p-10 lg:min-h-[690px] lg:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-24 h-80 w-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-40 h-52 w-52 rounded-full border border-amber-300/20" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-20 right-12 h-2 w-24 rotate-[-38deg] rounded-full bg-amber-400/80" />
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#123c82] shadow-lg shadow-blue-950/20">
              <GraduationCap size={30} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">Bakka</p>
              <p className="mt-1 text-sm font-medium text-blue-100">Training Center</p>
            </div>
          </div>
          <div>
            <p className="mb-4 inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-300">
              Learn · Develop · Grow
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[58px]">
              Manage learning. Inspire progress.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
              A connected administration system for students, staff, courses,
              attendance, and certificates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Computer Skills", "English", "Business", "Graphic Design", "AI Skills"].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-white/15 pt-5 text-sm text-blue-100">
            <ShieldCheck size={18} />
            Secure role-based administration
          </div>
        </div>

        <div className="flex items-center p-7 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
              <ShieldCheck size={21} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1d5dba]">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-[34px]">Sign in to Bakka</h2>
            <p className="mt-2 text-sm text-slate-500">
              Access your role-specific workspace.
            </p>
            <form method="post" className="mt-8 space-y-5" onSubmit={handleSubmit} aria-label="Sign in">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="name@bakka.so"
                  className="h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d5dba] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <span className="text-xs font-medium text-slate-400">Keep your account secure</span>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="h-[52px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d5dba] focus:bg-white focus:ring-4 focus:ring-blue-100"
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
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#123c82] font-bold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-[#1d5dba] hover:shadow-blue-900/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} aria-hidden="true" />
              </button>
              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </form>
            <div className="mt-7 flex items-start gap-3 border-t border-slate-100 pt-5">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-5 text-slate-500">
                Your dashboard opens automatically according to your secure account role.
                Contact your administrator if you need access.
              </p>
            </div>
            <p className="mt-5 text-center text-sm text-slate-500">
              New student?{" "}
              <Link href="/register" className="font-bold text-[#1d5dba] hover:text-[#123c82]">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
