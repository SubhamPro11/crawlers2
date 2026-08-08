import React from "react";
import { StyleGuideClient } from "./StyleGuideClient";

export const metadata = {
  title: "Design System Style Guide",
  description: "Dev-only design system & visual identity component library playground for Crawlers.",
  alternates: {
    canonical: "/style-guide",
  },
};

export default function StyleGuidePage() {
  return <StyleGuideClient />;
}
