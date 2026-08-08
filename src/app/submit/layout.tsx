import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an AI Tool or API",
  description: "Suggest AI software or developer API endpoints for editorial moderation and directory indexing.",
  alternates: {
    canonical: "/submit",
  },
  openGraph: {
    title: "Submit an AI Tool or API",
    description: "Suggest AI software or developer API endpoints for editorial moderation and directory indexing.",
    url: "https://crawlers.dpdns.org/submit",
    siteName: "Crawlers",
  },
  twitter: {
    card: "summary_large_image",
    site: "@crawlers",
    creator: "@crawlers",
    title: "Submit an AI Tool or API",
    description: "Suggest AI software or developer API endpoints for editorial moderation and directory indexing.",
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
