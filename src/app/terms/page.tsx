import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions of Use and DMCA takedown procedures for Crawlers Directory.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10 font-sans text-slate-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
        <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </Link>
        <span>/</span>
        <span className="text-lime-accent">Terms &amp; Conditions</span>
      </div>

      {/* Header */}
      <div className="border-b border-navy-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-100">
          Terms &amp; Conditions of Use
        </h1>
        <p className="font-mono text-xs text-slate-400">
          Effective Date: September 26, 2026 &middot; Version 1.26
        </p>
      </div>

      {/* Section 1: Acceptance */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">01.</span> Acceptance of Terms
        </h2>
        <p className="leading-relaxed">
          By accessing, browsing, submitting content to, or utilizing any portion of <strong>Crawlers Directory</strong> (&quot;Crawlers&quot; or &quot;the Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions (&quot;Terms&quot;) and our <Link href="/privacy" className="text-lime-accent underline font-mono">Privacy Policy</Link>. If you do not agree to these Terms, you must discontinue using the Service immediately.
        </p>
      </section>

      {/* Section 2: Nature of the Service */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">02.</span> Nature of the Directory &amp; Free Service
        </h2>
        <p className="leading-relaxed">
          Crawlers is an independent, human-curated reference catalog and developer indexing service. We provide direct hyperlinks, descriptions, pricing classification, and API registries for third-party artificial intelligence and developer tools.
        </p>
        <div className="p-4 rounded-lg bg-navy-900 border border-navy-800 text-xs font-mono space-y-1.5">
          <div className="text-lime-accent font-bold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> 100% Free Public Catalog
          </div>
          <p className="text-slate-300 font-sans leading-relaxed">
            Crawlers does not sell software licenses, subscription memberships, or paid directory placements. All indexing is performed free of charge. No monetary payment is required to use this directory.
          </p>
        </div>
      </section>

      {/* Section 3: Third-Party Tools & API Disclaimer */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">03.</span> Third-Party Software &amp; API Disclaimers
        </h2>
        <p className="leading-relaxed">
          The software tools, endpoints, documentation, and external websites listed on Crawlers are created, owned, and maintained entirely by independent third parties:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 leading-relaxed text-sm">
          <li><strong>No Endorsement or Affiliation:</strong> Inclusion of any tool, library, or API endpoint on Crawlers does not constitute endorsement, warranty, or partnership.</li>
          <li><strong>Pricing &amp; Feature Changes:</strong> Third-party providers frequently update pricing tiers, terms of service, and feature availability. Crawlers does not guarantee continuous accuracy of third-party pricing designations.</li>
          <li><strong>API Credentials &amp; Usage:</strong> The sample API endpoints and curl snippets provided on the <code>/api</code> registry are reference material. Users must obtain their own credentials from third-party providers and abide by provider terms. Crawlers does not broker or proxy API calls.</li>
        </ul>
      </section>

      {/* Section 4: User Submissions & Content Licensing */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">04.</span> Community Submissions &amp; Intellectual Property
        </h2>
        <p className="leading-relaxed">
          When submitting software or suggested revisions via the <code>/submit</code> page or reporting broken links:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 leading-relaxed text-sm">
          <li>You warrant that all information submitted is factual and that you have the right to share the requested URLs and descriptions.</li>
          <li>You grant Crawlers a worldwide, non-exclusive, royalty-free, perpetual license to display, edit, summarize, and categorize the submission in the public directory.</li>
          <li>We reserve the unilateral right to reject, modify, reclassify, or remove any submission that does not satisfy our editorial guidelines or that contains malicious or deceptive links.</li>
        </ul>
      </section>

      {/* Section 5: Trademark Notice & Fair Use */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">05.</span> Trademarks &amp; Fair Use
        </h2>
        <p className="leading-relaxed">
          All brand names, product titles, logos, and trademarks displayed on Crawlers are the property of their respective trademark holders. Their display is solely for descriptive identification and nominative fair use to identify the software to developers.
        </p>
      </section>

      {/* Section 6: Copyright & DMCA Takedown Procedure */}
      <section className="space-y-3 p-6 rounded-xl border border-navy-700 bg-navy-900">
        <h2 className="font-mono text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Takedown &amp; Removal Requests (DMCA / Fair Use)
        </h2>
        <p className="text-xs leading-relaxed text-slate-300 font-sans">
          If you are a copyright owner or authorized representative and believe that any listing on Crawlers infringes upon your copyright or trademark, or if you are a software creator requesting listing removal:
        </p>
        <div className="font-mono text-xs text-slate-300 space-y-1 bg-navy-950 p-4 rounded border border-navy-800">
          <div><strong>Send Notices to:</strong> <a href="mailto:takedown@crawlers.directory" className="text-lime-accent underline">takedown@crawlers.directory</a></div>
          <div><strong>Include:</strong> The specific URL on Crawlers, proof of ownership or authorization, and desired action (removal or update).</div>
          <div><strong>Processing SLA:</strong> Legitimate removal and modification requests are handled within 48 business hours.</div>
        </div>
      </section>

      {/* Section 7: Limitation of Liability */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">07.</span> Limitation of Liability
        </h2>
        <p className="leading-relaxed text-xs uppercase tracking-wider text-slate-400 font-mono">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
        </p>
        <p className="leading-relaxed text-sm">
          CRAWLERS AND ITS MAINTAINERS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. UNDER NO CIRCUMSTANCES SHALL CRAWLERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR ACCESS TO OR USE OF ANY THIRD-PARTY TOOL, API OUTAGE, DATA LOSS, OR SYSTEM DAMAGE INCURRED VIA EXTERNAL WEBSITES.
        </p>
      </section>

      {/* Section 8: Governing Law */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">08.</span> Governing Law &amp; Jurisdiction
        </h2>
        <p className="leading-relaxed">
          These Terms and any dispute arising out of or related to them shall be governed by and construed in accordance with the substantive laws of India, without regard to conflict of law principles. Any legal suit or action arising out of these Terms shall be instituted exclusively in the competent courts having jurisdiction over the maintainer&apos;s principal place of operation in India.
        </p>
      </section>

      {/* Return Links */}
      <div className="pt-6 border-t border-navy-850 flex justify-between items-center text-xs font-mono">
        <Link href="/" className="text-slate-400 hover:text-lime-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <Link href="/cookies" className="text-lime-accent hover:underline">
          Read Cookies Policy &rarr;
        </Link>
      </div>
    </main>
  );
}
