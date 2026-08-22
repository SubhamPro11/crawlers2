"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, LogIn, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase, signInWithGoogle } from "@/lib/supabase";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const urlError = searchParams.get("error");
  const urlErrorDesc = searchParams.get("error_description");

  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlErrorDesc || urlError || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (mounted) {
          if (data.user) {
            setIsAuthenticated(true);
            router.replace(next);
          } else {
            setLoading(false);
          }
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [next, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setErrorMessage(null);
    const { error } = await signInWithGoogle(next);
    if (error) {
      console.error("[Login Page] Google sign-in failed:", error);
      setErrorMessage(error);
      setSigningIn(false);
    }
  };


  if (loading || isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 font-mono text-xs text-slate-500">
        <span className="animate-pulse">$ checking_session_state...</span>
      </div>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 font-mono">
      <div className="w-full max-w-md p-8 rounded-2xl border border-navy-800 bg-navy-900 space-y-6 shadow-2xl">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-lime-accent/10 border border-lime-accent/30 mx-auto flex items-center justify-center text-lime-accent">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="text-[10px] text-lime-accent uppercase tracking-wider font-semibold">
            Directory Authentication
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Sign In to Crawlers
          </h1>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Authenticate to access directory management, submit software tools, and report broken endpoints.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-red-200">Authentication Failed</span>
              <span className="text-[11px] font-sans text-red-300 leading-normal block">
                {errorMessage}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full py-3 px-5 rounded-full bg-lime-accent text-navy-950 font-bold hover:bg-lime-hover transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
          >
            {signingIn ? (
              <span>Redirecting to Google...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Feature Badges */}
        <div className="pt-4 border-t border-navy-850 space-y-2 text-[11px] text-slate-400 font-sans">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-lime-accent shrink-0" />
            <span>Secure OAuth 2.0 with Supabase Auth</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encrypted token sessions &amp; RLS policies</span>
          </div>
        </div>

        {/* Return Link */}
        <div className="pt-2 text-center border-t border-navy-850">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-lime-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 font-mono text-xs text-slate-500">
          Loading login...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
