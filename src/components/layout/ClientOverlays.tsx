"use client";

import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () => import("@/components/terminal/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

const ShortcutOverlay = dynamic(
  () => import("@/components/terminal/ShortcutOverlay").then((m) => m.ShortcutOverlay),
  { ssr: false }
);

const CompareTray = dynamic(
  () => import("@/components/compare/CompareTray").then((m) => m.CompareTray),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <CommandPalette />
      <ShortcutOverlay />
      <CompareTray />
    </>
  );
}
