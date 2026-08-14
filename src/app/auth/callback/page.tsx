"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Exchanging OAuth tokens...");
  const rawNext = searchParams.get("next") || "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      if (!supabase) {
        if (mounted) setStatus("Supabase client not configured.");
        setTimeout(() => router.push(next), 1500);
        return;
      }

      // 1. Explicitly exchange PKCE authorization code if present in URL
      const code = searchParams.get("code");
      if (code) {
        try {
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            if (mounted) setStatus(`Auth Exchange Error: ${exchangeError.message}`);
            setTimeout(() => router.push(next), 2500);
            return;
          }

          if (exchangeData?.session) {
            if (mounted) setStatus("Session authenticated! Syncing profile...");
            setTimeout(() => {
              if (mounted) router.push(next);
            }, 500);
            return;
          }
        } catch (err) {
          console.error("Unexpected exchange failure:", err);
        }
      }

      // 2. Fallback check for active session or implicit hash token
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        if (mounted) setStatus(`Auth Exchange Error: ${error.message}`);
        setTimeout(() => router.push(next), 2000);
        return;
      }

      if (data.session) {
        if (mounted) setStatus("Session authenticated! Syncing profile...");
        setTimeout(() => {
          if (mounted) router.push(next);
        }, 500);
      } else {
        // Listen briefly for auth state listener to resolve session
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session && mounted) {
            setStatus("Session authenticated! Syncing profile...");
            listener.subscription.unsubscribe();
            router.push(next);
          }
        });

        setTimeout(() => {
          if (mounted) router.push(next);
        }, 2500);
      }
    };

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [next, router, searchParams]);

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 font-mono text-slate-100">
      <div className="w-full max-w-md p-8 rounded-3xl border border-lime-accent/40 bg-navy-900 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent flex items-center justify-center mx-auto animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
            <Terminal className="w-4 h-4 text-lime-accent" />
            <span>Authenticating Google OAuth</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-950 flex items-center justify-center font-mono text-xs text-slate-400">
          Loading auth callback...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
