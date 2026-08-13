"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";

interface ToolFaviconProps {
  url: string;
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}

/**
 * Renders the real thumbnail / logo / favicon for a tool.
 * Sourced from logoUrl or Google's 128px favicon service.
 * Falls back to an authentic icon glyph when no image is available.
 */
export const ToolFavicon: React.FC<ToolFaviconProps> = ({
  url,
  name,
  logoUrl,
  size = 24,
  className = "",
}) => {
  const [failed, setFailed] = useState(false);

  // Fallback icon glyph element
  const renderFallback = () => {
    const initial = name ? name.trim().charAt(0).toUpperCase() : "?";
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md bg-navy-850 border border-navy-800 shrink-0 font-mono font-bold text-lime-accent text-xs ${className}`}
        style={{ width: size, height: size }}
        title={name}
      >
        {initial !== "?" ? initial : <Globe className="w-3.5 h-3.5 text-slate-500" />}
      </span>
    );
  };

  if (failed) {
    return renderFallback();
  }

  // Determine image source
  let imgSrc = logoUrl || "";

  if (!imgSrc) {
    try {
      const domain = new URL(url).hostname;
      imgSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return renderFallback();
    }
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-navy-950 shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="rounded-sm object-contain w-full h-full"
      />
    </span>
  );
};
