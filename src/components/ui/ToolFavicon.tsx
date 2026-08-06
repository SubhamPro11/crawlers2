"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";

interface ToolFaviconProps {
  url: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Renders the real favicon for a tool's URL using Google's favicon service.
 * Falls back to a styled Globe icon on error.
 * This is the "authentic imagery" approach — real logos, not generic placeholders.
 */
export const ToolFavicon: React.FC<ToolFaviconProps> = ({
  url,
  name,
  size = 18,
  className = "",
}) => {
  const [failed, setFailed] = useState(false);

  // Extract domain for Google's favicon API
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    // Invalid URL — show fallback
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-navy-850 border border-navy-800 shrink-0 ${className}`}
        style={{ width: size + 6, height: size + 6 }}
        title={name}
      >
        <Globe className="text-slate-500" style={{ width: size - 2, height: size - 2 }} />
      </span>
    );
  }

  if (failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-navy-850 border border-navy-800 shrink-0 ${className}`}
        style={{ width: size + 6, height: size + 6 }}
        title={name}
      >
        <Globe className="text-slate-500" style={{ width: size - 2, height: size - 2 }} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded bg-navy-850 border border-navy-800 shrink-0 overflow-hidden ${className}`}
      style={{ width: size + 6, height: size + 6 }}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`}
        alt={`${name} icon`}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="rounded-sm"
      />
    </span>
  );
};
