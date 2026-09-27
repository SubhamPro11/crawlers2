"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Code2, PlusCircle, ArrowLeftRight, Menu, X, History, Shuffle } from "lucide-react";
import { NavbarUserMenu } from "./NavbarUserMenu";

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-lime-accent/10 border border-lime-accent/30 flex items-center justify-center text-lime-accent group-hover:bg-lime-accent group-hover:text-navy-950 transition-all">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-tight text-slate-100 group-hover:text-lime-accent transition-colors">
              Crawlers
            </span>
            <span className="font-mono text-[10px] text-slate-400 tracking-wider">
              AI Tools Directory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 font-mono text-xs text-slate-300">
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-navy-800 text-slate-400 hover:text-lime-accent hover:border-lime-accent/40 transition-colors"
            title="Open Command Palette"
            aria-label="Open Command Palette (Cmd+K)"
          >
            <span className="text-[10px]">⌘K CLI</span>
          </button>

          <Link href="/tools" className="nav-link hover:text-lime-accent transition-colors font-bold">
            All Tools
          </Link>
          <Link href="/stacks" className="nav-link hover:text-lime-accent transition-colors">
            Stacks
          </Link>
          <Link href="/trending" className="nav-link hover:text-lime-accent transition-colors">
            Trending
          </Link>
          <Link href="/api" className="nav-link flex items-center gap-1 hover:text-lime-accent transition-colors">
            <Code2 className="w-3.5 h-3.5" aria-hidden="true" /> API
          </Link>
          <Link href="/compare" className="nav-link flex items-center gap-1 hover:text-lime-accent transition-colors">
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" /> Compare
          </Link>
          <Link href="/random" className="nav-link flex items-center gap-1 hover:text-lime-accent transition-colors" title="Surprise me with a random tool">
            <Shuffle className="w-3.5 h-3.5 text-lime-accent" aria-hidden="true" /> Random
          </Link>
          <Link
            href="/submit"
            className="btn-press flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-lime-accent text-navy-950 font-semibold hover:bg-lime-hover transition-colors ml-1"
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" /> Submit
          </Link>
          <NavbarUserMenu />
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-navy-850 cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-navy-850 bg-navy-900 px-4 py-4 space-y-3 font-mono text-sm">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block text-slate-300 hover:text-lime-accent py-1"
          >
            Home
          </Link>
          <Link
            href="/#sections"
            onClick={() => setMobileOpen(false)}
            className="block text-slate-300 hover:text-lime-accent py-1"
          >
            &gt; taxonomy
          </Link>
          <Link
            href="/api"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-slate-300 hover:text-lime-accent py-1"
          >
            <Code2 className="w-4 h-4" /> API Registry
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-slate-300 hover:text-lime-accent py-1"
          >
            <ArrowLeftRight className="w-4 h-4" /> Compare
          </Link>
          <Link
            href="/random"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-slate-300 hover:text-lime-accent py-1"
          >
            <Shuffle className="w-4 h-4 text-lime-accent" /> Random Tool
          </Link>
          <Link
            href="/changelog"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-slate-300 hover:text-lime-accent py-1"
          >
            <History className="w-4 h-4" /> Changelog
          </Link>
          <Link
            href="/style-guide"
            onClick={() => setMobileOpen(false)}
            className="block text-slate-400 hover:text-slate-200 py-1"
          >
            Style Guide
          </Link>
          <div className="pt-2 border-t border-navy-800 flex flex-col gap-2">
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full bg-lime-accent text-navy-950 font-bold"
            >
              <PlusCircle className="w-4 h-4" /> Submit Tool
            </Link>
            <div className="flex justify-center pt-1">
              <NavbarUserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
