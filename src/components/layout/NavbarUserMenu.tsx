"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { supabase, signInWithGoogle, signOutUser } from "@/lib/supabase";

export const NavbarUserMenu: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);

  const checkProfileRole = useCallback(async (userId: string, email?: string) => {
    if (email === "subhamkr11012004@gmail.com") {
      setUserRole("admin");
      localStorage.setItem("crawlers_admin_session", "true");
      return;
    }

    if (supabase) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role === "admin") {
        setUserRole("admin");
        localStorage.setItem("crawlers_admin_session", "true");
      } else {
        setUserRole("user");
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    // Get current user session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        checkProfileRole(data.user.id, data.user.email);
      }
      setLoading(false);
    });

    // Listen to Auth State Changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkProfileRole(currentUser.id, currentUser.email);
      } else {
        setUserRole("user");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [checkProfileRole]);

  const handleSignIn = async () => {
    await signInWithGoogle(window.location.pathname);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setUserRole("user");
    window.location.reload();
  };

  if (loading) {
    return <span className="font-mono text-xs text-slate-500">auth_syncing...</span>;
  }

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url;
    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const isAdmin = userRole === "admin" || user.email === "subhamkr11012004@gmail.com";

    return (
      <div className="flex items-center gap-2.5 font-mono text-xs">
        {isAdmin && (
          <Link
            href="/admin"
            className="px-2 py-1 rounded-md bg-lime-accent/10 border border-lime-accent/30 text-lime-accent hover:bg-lime-accent hover:text-navy-950 font-bold transition-all flex items-center gap-1 text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> [ADMIN]
          </Link>
        )}

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-slate-200">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="w-4 h-4 rounded-full" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse" />
          )}
          <span className="truncate max-w-[110px] text-[11px] font-semibold">{displayName}</span>
        </div>

        <button
          onClick={handleSignOut}
          className="p-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-400 hover:text-red-400 hover:border-red-800 transition-colors cursor-pointer"
          title="Sign out session"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-slate-200 hover:text-lime-accent hover:border-lime-accent/50 transition-all font-mono text-xs font-semibold cursor-pointer"
    >
      <LogIn className="w-3.5 h-3.5 text-lime-accent" />
      <span>$ google_login</span>
    </button>
  );
};
