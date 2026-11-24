"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ClipboardCheck,
  GraduationCap,
  FileBadge,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  ShieldCheck,
  Settings,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

type DashboardShellProps = {
  role: "Admin" | "Staff" | "Student";
  name: string;
  navigation: string[];
  stats: Array<[string, string, string]>;
};

const iconMap: Record<string, typeof LayoutDashboard> = {
  Dashboard: LayoutDashboard,
  Students: UsersRound,
  Staff: BriefcaseBusiness,
  Courses: BookOpen,
  Batches: BookOpen,
  Enrollments: ClipboardCheck,
  Attendance: ClipboardCheck,
  Certificates: FileBadge,
  Profile: UserRound,
  "My Courses": BookOpen,
  "My Students": UsersRound,
  "My Profile": UserRound,
  Schedule: CalendarDays,
  Progress: Check,
  Reports: ArrowUpRight,
  "Audit Logs": ShieldCheck,
  "My Certificates": FileBadge,
  Settings,
};

const roleCopy = {
  Admin: "Keep center-wide operations organized and on track.",
  Staff: "Your assigned classes and teaching work, all in one place.",
  Student: "Your learning, schedule, and achievements at a glance.",
};

const statIcons = [UsersRound, BriefcaseBusiness, BookOpen, ClipboardCheck];

export default function DashboardShell({
  role,
  name,
  navigation,
  stats,
}: DashboardShellProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [authStatus, setAuthStatus] = useState<"checking" | "ready" | "error">("checking");
  const [identity, setIdentity] = useState<{ email: string; role: string } | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const rolePath = role.toLowerCase();

  useEffect(() => {
    let active = true;
    fetch("/api/backend/health", { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then(() => {
        if (active) setApiStatus("connected");
      })
      .catch(() => {
        if (active) setApiStatus("offline");
      });

    fetch("/api/backend/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/");
          return null;
        }
        if (!response.ok) throw new Error("Unable to verify your account");
        return response.json();
      })
      .then((body) => {
        if (!active || !body) return;
        const account = body.data as { email: string; role: string };
        if (!["admin", "staff", "student"].includes(account.role)) {
          router.replace("/");
          return;
        }
        if (account.role !== rolePath) {
          router.replace(`/${account.role}`);
          return;
        }
        setIdentity(account);
        setAuthStatus("ready");
      })
      .catch(() => {
        if (active) setAuthStatus("error");
      });

    return () => {
      active = false;
    };
  }, [rolePath, router]);

  async function handleSignOut() {
    setLogoutError("");
    setLoggingOut(true);
    try {
      const response = await fetch("/api/backend/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      router.replace("/");
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Could not sign out.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (authStatus === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f3f6fb] px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-100 border-t-[#1d5dba]" />
          <span className="text-sm font-semibold text-slate-600">Verifying your secure workspace...</span>
        </div>
      </div>
    );
  }

  if (authStatus === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f3f6fb] px-6">
        <div role="alert" className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="font-bold text-slate-900">Workspace unavailable</p>
          <p className="mt-2 text-sm text-slate-500">We could not verify your account. Check the API connection and try again.</p>
          <button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-[#123c82] px-4 py-2 text-sm font-bold text-white">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const displayName = identity?.email || name;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f3f6fb] lg:grid lg:grid-cols-[264px_1fr]">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-[#102f66] text-white shadow-2xl shadow-slate-950/20 transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#123c82] shadow-lg shadow-slate-950/10">
              <GraduationCap size={26} />
            </div>
            <div>
              <p className="text-lg font-extrabold leading-none tracking-tight">Bakka</p>
              <p className="mt-1 text-[11px] font-medium tracking-wide text-blue-200">TRAINING CENTER</p>
            </div>
          </div>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-lg text-blue-100 hover:bg-white/10 lg:hidden">
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Workspace</div>
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-2">
          {navigation.map((item) => {
            const Icon = iconMap[item] || LayoutDashboard;
            const active = item === "Dashboard";
            return (
              active ? (
                <Link
                  key={item}
                  href={`/${rolePath}`}
                  aria-current="page"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mb-1 flex h-11 items-center gap-3 rounded-xl bg-[#f4a11a] px-3 text-sm font-bold text-[#102f66] shadow-md shadow-slate-950/10"
                >
                  <Icon size={18} />
                  {item}
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#102f66]" />
                </Link>
              ) : (
                <div
                  key={item}
                  aria-disabled="true"
                  title="This module is not available yet"
                  className="mb-1 flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-blue-100/70"
                >
                  <Icon size={18} />
                  <span className="flex-1">{item}</span>
                  <span className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-200">Soon</span>
                </div>
              )
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/[0.07] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-100">
              <ShieldCheck size={15} className="text-amber-300" />
              Protected workspace
            </div>
            <p className="mt-1.5 pl-[23px] text-[10px] text-blue-200/75">Access verified by your account role</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
          >
            <LogOut size={17} />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
          {logoutError && <p role="alert" className="mt-2 px-2 text-xs text-red-200">{logoutError}</p>}
        </div>
      </aside>

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-[#123c82] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 lg:hidden"
            >
              {mobileMenuOpen ? <PanelLeftClose size={19} /> : <Menu size={19} />}
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1d5dba]">{role} workspace</p>
              <h1 className="mt-0.5 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4">
            <span aria-live="polite" className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-600 sm:flex">
              <span className={`h-2 w-2 rounded-full ${apiStatus === "connected" ? "bg-emerald-500" : apiStatus === "offline" ? "bg-red-500" : "bg-amber-400"}`} />
              {apiStatus === "connected" ? "System online" : apiStatus === "offline" ? "API unavailable" : "Connecting"}
            </span>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(145deg,#eaf1ff,#d6e5ff)] text-xs font-extrabold text-[#123c82] ring-2 ring-white shadow-sm">
                {initials}
              </span>
              <span className="hidden max-w-[190px] text-left sm:block">
                <span className="block truncate text-xs font-bold text-slate-800">{displayName}</span>
                <span className="mt-0.5 block text-[10px] font-medium capitalize text-slate-500">{identity?.role || role}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-9 lg:pt-8">
          <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(112deg,#123c82_0%,#1d5dba_68%,#2d70c8_100%)] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-32 h-72 w-72 rounded-full border-[34px] border-white/[0.07]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full border border-amber-300/20" />
            <div className="relative max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-50">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Bakka Training Center
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome to your workspace
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-[15px]">
                {roleCopy[role]}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-blue-100">
              <ShieldCheck size={16} className="text-amber-300" />
              Signed in securely as {identity?.role}
            </div>
          </section>

          <section aria-label={`${role} statistics`} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(([title, value, caption], index) => {
              const Icon = statIcons[index % statIcons.length];
              return (
                <article key={title} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_3px_14px_rgba(15,35,70,.035)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/[0.06]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-slate-500">{title}</p>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1d5dba] transition group-hover:bg-[#123c82] group-hover:text-white">
                      <Icon size={19} />
                    </span>
                  </div>
                  <p className="mt-3 text-[30px] font-extrabold leading-none tracking-tight text-[#123c82]">{value}</p>
                  <p className="mt-2.5 text-[11px] text-slate-400">{caption}</p>
                </article>
              );
            })}
          </section>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_3px_14px_rgba(15,35,70,.035)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <ClipboardCheck size={19} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent activity</h3>
                  <p className="mt-1 text-xs text-slate-400">Updates from your authorized workspace</p>
                </div>
              </div>
              <div className="mt-5 flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-5 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-300 shadow-sm">
                  <Bell size={19} />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-600">Nothing new yet</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Recent updates will appear here when activity is recorded.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_3px_14px_rgba(15,35,70,.035)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1d5dba]">
                  <CalendarDays size={19} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Schedule</h3>
                  <p className="mt-1 text-xs text-slate-400">Your upcoming sessions and tasks</p>
                </div>
              </div>
              <div className="mt-5 flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-5 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-300 shadow-sm">
                  <CalendarDays size={19} />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-600">No sessions to show</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Your schedule will appear here when sessions are assigned.
                </p>
              </div>
            </section>
          </div>

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200/80 pt-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Bakka Training Center</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-600" />
              Your workspace access is protected
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
