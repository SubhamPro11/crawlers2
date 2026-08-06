"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Grid, Code2, ArrowLeftRight, Shuffle, PlusCircle } from "lucide-react";

export const MacOSDock: React.FC = () => {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 macos-dock rounded-2xl px-3 py-2 flex items-center gap-2.5 transition-all">
      <Link
        href="/"
        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-navy-850/80 border border-navy-700/60 hover:bg-lime-accent hover:border-lime-accent hover:text-navy-950 text-slate-300 transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 shadow-md"
        title="Terminal Home ($ /)"
      >
        <Terminal className="w-4 h-4" />
        <span className="absolute -top-8 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-[10px] text-lime-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          $ home
        </span>
      </Link>

      <Link
        href="/#sections"
        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-navy-850/80 border border-navy-700/60 hover:bg-lime-accent hover:border-lime-accent hover:text-navy-950 text-slate-300 transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 shadow-md"
        title="Taxonomy Index"
      >
        <Grid className="w-4 h-4" />
        <span className="absolute -top-8 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-[10px] text-lime-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          $ taxonomy
        </span>
      </Link>

      <Link
        href="/api"
        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-navy-850/80 border border-navy-700/60 hover:bg-lime-accent hover:border-lime-accent hover:text-navy-950 text-slate-300 transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 shadow-md"
        title="API Registry"
      >
        <Code2 className="w-4 h-4" />
        <span className="absolute -top-8 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-[10px] text-lime-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          $ api
        </span>
      </Link>

      <div className="w-[1px] h-6 bg-navy-800 my-auto" />

      <Link
        href="/compare"
        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-navy-850/80 border border-navy-700/60 hover:bg-cyan-400 hover:border-cyan-400 hover:text-navy-950 text-slate-300 transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 shadow-md"
        title="Compare Matrix"
      >
        <ArrowLeftRight className="w-4 h-4" />
        <span className="absolute -top-8 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-[10px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          $ compare
        </span>
      </Link>

      <Link
        href="/random"
        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-navy-850/80 border border-navy-700/60 hover:bg-amber-400 hover:border-amber-400 hover:text-navy-950 text-slate-300 transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 shadow-md"
        title="Random Tool"
      >
        <Shuffle className="w-4 h-4" />
        <span className="absolute -top-8 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-[10px] text-amber-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          $ surprise me
        </span>
      </Link>

      <Link
        href="/submit"
        className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-lime-accent text-navy-950 font-bold hover:bg-lime-hover transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 shadow-md"
        title="Submit Tool"
      >
        <PlusCircle className="w-4 h-4" />
        <span className="absolute -top-8 px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-[10px] text-lime-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          $ submit
        </span>
      </Link>
    </nav>
  );
};
