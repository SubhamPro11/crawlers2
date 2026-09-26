import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, Info } from "lucide-react";

export const metadata = {
  title: "Cookies Policy",
  description: "Cookies and local storage transparency policy for Crawlers Directory.",
};

export default function CookiesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10 font-sans text-slate-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
        <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </Link>
        <span>/</span>
        <span className="text-lime-accent">Cookies Policy</span>
      </div>

      {/* Header */}
      <div className="border-b border-navy-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
          <Cookie className="w-3.5 h-3.5" />
          <span>Storage &amp; Session Transparency</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-100">
          Cookies &amp; Local Storage Policy
        </h1>
        <p className="font-mono text-xs text-slate-400">
          Effective Date: September 26, 2026 &middot; Version 1.26
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl border border-lime-accent/30 bg-navy-900/80 font-mono text-xs space-y-2">
        <div className="flex items-center gap-2 text-lime-accent font-bold">
          <ShieldCheck className="w-4 h-4" /> Strictly Essential Storage Only
        </div>
        <p className="text-slate-300 font-sans leading-relaxed">
          Crawlers employs strictly essential browser cookies and local storage tokens. We do <strong>NOT</strong> use cross-site advertising cookies, behavioral tracking beacons, or third-party marketing pixels.
        </p>
      </div>

      {/* Section 1: What Are Cookies */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">01.</span> What Are Cookies &amp; Local Storage?
        </h2>
        <p className="leading-relaxed">
          Cookies are small data files placed on your computer or mobile device by a web server. <strong>Local Storage</strong> is a modern web standard that allows websites to store key-value data directly in your browser without transmitting it with every HTTP request.
        </p>
      </section>

      {/* Section 2: Storage Inventory */}
      <section className="space-y-4">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">02.</span> Exact Storage Inventory on Crawlers
        </h2>
        <p className="leading-relaxed">
          The following table itemizes every cookie and local storage key utilized across Crawlers:
        </p>

        <div className="overflow-x-auto border border-navy-800 rounded-xl bg-navy-900">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950 border-b border-navy-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Name / Key</th>
                <th className="p-3.5">Mechanism</th>
                <th className="p-3.5">Type &amp; Duration</th>
                <th className="p-3.5">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-sans text-slate-300">
              <tr>
                <td className="p-3.5 font-mono text-lime-accent font-semibold">sb-*-auth-token</td>
                <td className="p-3.5 font-mono text-xs text-slate-400">HTTP Cookie</td>
                <td className="p-3.5 text-xs">Strictly Necessary (Session / Persistent)</td>
                <td className="p-3.5 text-xs">Maintains authenticated session state when you sign in via Google OAuth. Handled securely by Supabase.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono text-lime-accent font-semibold">crawlers_compare_queue</td>
                <td className="p-3.5 font-mono text-xs text-slate-400">Browser localStorage</td>
                <td className="p-3.5 text-xs">Functional (Persistent until cleared)</td>
                <td className="p-3.5 text-xs">Remembers software tools you added to the side-by-side comparison tray on <code>/compare</code>. Stored only in your browser.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono text-lime-accent font-semibold">crawlers_consent_dismissed</td>
                <td className="p-3.5 font-mono text-xs text-slate-400">Browser localStorage</td>
                <td className="p-3.5 text-xs">Functional (Persistent)</td>
                <td className="p-3.5 text-xs">Stores whether you have acknowledged our privacy and cookie transparency banner so it does not reappear.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Third-Party Cookies */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">03.</span> Third-Party Cookies &amp; Pixels
        </h2>
        <p className="leading-relaxed">
          We do not allow advertising networks or third-party tracking services to place cookies on your browser through our service.
        </p>
        <div className="p-4 rounded-lg bg-navy-900 border border-navy-800 text-xs font-mono space-y-1 text-slate-300">
          <div className="text-slate-100 font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" /> Note on Outbound Links
          </div>
          <p className="font-sans leading-relaxed text-slate-400">
            Crawlers links out to hundreds of independent third-party software websites. When you click an external link to visit a tool, that external site operates under its own distinct cookie and privacy policy.
          </p>
        </div>
      </section>

      {/* Section 4: How to Manage */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">04.</span> Managing &amp; Clearing Storage
        </h2>
        <p className="leading-relaxed">
          You can clear or block cookies and local storage at any time through your browser settings:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 leading-relaxed text-sm">
          <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-party cookies &gt; See all site data.</li>
          <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data &gt; Clear Data.</li>
          <li><strong>Safari:</strong> Settings &gt; Privacy &gt; Manage Website Data.</li>
        </ul>
        <p className="leading-relaxed text-xs text-slate-400 font-mono">
          Note: Disabling cookies will prevent signing into the admin panel or user contribution features.
        </p>
      </section>

      {/* Return Links */}
      <div className="pt-6 border-t border-navy-850 flex justify-between items-center text-xs font-mono">
        <Link href="/" className="text-slate-400 hover:text-lime-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <Link href="/privacy" className="text-lime-accent hover:underline">
          Read Privacy Policy &rarr;
        </Link>
      </div>
    </main>
  );
}
