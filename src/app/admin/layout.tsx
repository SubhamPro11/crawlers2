import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Control Plane",
  description: "Directory maintainer review and moderation control plane.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
