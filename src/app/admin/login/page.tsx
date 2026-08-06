"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!supabase) {
      // Mock admin fallback for dev offline testing
      if (email === "subhamkr11012004@gmail.com" && password.length >= 6) {
        localStorage.setItem("crawlers_admin_session", "true");
        router.push("/admin");
        return;
      }
      setError("Invalid credentials or Supabase disconnected.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Verify profile role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "admin" || email === "subhamkr11012004@gmail.com") {
          localStorage.setItem("crawlers_admin_session", "true");
          router.push("/admin");
        } else {
          setError("Access denied: Account does not hold administrator privileges.");
          await supabase.auth.signOut();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded border border-navy-800 bg-navy-900 font-mono space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-lime-accent/10 border border-lime-accent/30 mx-auto flex items-center justify-center text-lime-accent">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Admin Control Plane
              </h1>
              <p className="text-xs text-slate-400 font-sans">
                Gated authentication required. Admin permissions restricted to authorized maintainers.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  $ admin_email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="subhamkr11012004@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  $ master_password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-lime-accent text-navy-950 font-bold hover:bg-lime-hover transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Authenticate Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500 font-sans border-t border-navy-850">
              Session duration: 24h max • RLS Security Active
            </div>
          </div>
      </main>

      <Footer />
    </div>
  );
}
