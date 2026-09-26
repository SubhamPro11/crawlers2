import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and Digital Personal Data Protection (DPDP) compliance declaration for Crawlers Directory.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10 font-sans text-slate-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
        <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </Link>
        <span>/</span>
        <span className="text-lime-accent">Privacy Policy</span>
      </div>

      {/* Header */}
      <div className="border-b border-navy-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
          <Shield className="w-3.5 h-3.5" />
          <span>Compliance &amp; Data Governance</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-100">
          Privacy Policy &amp; Data Protection
        </h1>
        <p className="font-mono text-xs text-slate-400">
          Last Updated: September 26, 2026 &middot; Compliant with DPDP Act 2023 (India) &amp; Global Privacy Standards
        </p>
      </div>

      {/* Highlights / Zero-Tracking Badge */}
      <div className="p-4 rounded-xl border border-lime-accent/30 bg-navy-900/80 font-mono text-xs space-y-2">
        <div className="flex items-center gap-2 text-lime-accent font-bold">
          <Lock className="w-4 h-4" /> Zero Third-Party Advertising Trackers
        </div>
        <p className="text-slate-300 font-sans leading-relaxed">
          Crawlers does not use Google Analytics, Meta Pixel, tracking beacons, cross-site profiling cookies, or behavioral advertising scripts. Your reading and browsing activity is never sold or shared with data brokers.
        </p>
      </div>

      {/* Section 1: Overview */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">01.</span> Overview &amp; Data Controller
        </h2>
        <p className="leading-relaxed">
          This Privacy Policy governs the collection, use, and protection of digital personal data by <strong>Crawlers Directory</strong> (&quot;Crawlers&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We operate an independent, human-curated software directory and developer API catalog accessible at <code className="font-mono text-lime-accent">crawlers.dpdns.org</code>.
        </p>
        <p className="leading-relaxed">
          For the purposes of applicable data protection legislation — including India&apos;s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> — the Data Fiduciary / Controller is the maintainer of Crawlers Directory. If you have any inquiries regarding your data, contact our designated privacy channel at <a href="mailto:privacy@crawlers.directory" className="text-lime-accent underline font-mono">privacy@crawlers.directory</a>.
        </p>
      </section>

      {/* Section 2: Data We Collect */}
      <section className="space-y-4">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">02.</span> Digital Personal Data Collected
        </h2>
        <p className="leading-relaxed">
          We strictly practice data minimization. We only collect digital personal data that is demonstrably required to deliver our service:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-lime-accent font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Account &amp; OAuth Identity
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              When authenticating with Google OAuth, we receive your email address, display name, and avatar URL via Supabase Auth to maintain your authenticated session.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-navy-900 border border-navy-800 space-y-2">
            <div className="text-lime-accent font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4" /> Tool Submissions &amp; Reports
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              When submitting software, your provided notification email (optional) and submission text are stored for editorial review. Broken link reports link your user ID to prevent spam.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-navy-900/60 border border-navy-800 font-mono text-xs space-y-1.5">
          <div className="text-slate-200 font-bold flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-400" /> First-Party Directory Telemetry (view_logs)
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            When you view a tool, our system records the tool identifier, timestamp, and source tag (e.g. &quot;web&quot;). <strong>We do not log your IP address, geolocation coordinates, or browser fingerprinting data</strong> in telemetry records.
          </p>
        </div>
      </section>

      {/* Section 3: Legal Basis & Purpose */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">03.</span> Purpose of Processing &amp; Consent
        </h2>
        <p className="leading-relaxed">
          Your personal data is processed strictly based on your affirmative consent or necessary legitimate uses under Section 4 and Section 7 of the DPDP Act:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 leading-relaxed text-sm">
          <li><strong>Authentication &amp; Session Management:</strong> Authenticating directory moderators and contributors.</li>
          <li><strong>Editorial Communication:</strong> Notifying tool submitters about editorial review decisions.</li>
          <li><strong>Platform Integrity &amp; Spam Prevention:</strong> Validating that broken link reports are genuine.</li>
          <li><strong>Aggregated Index Insights:</strong> Calculating public popularity rankings without profiling individual readers.</li>
        </ul>
      </section>

      {/* Section 4: Data Retention & Security */}
      <section className="space-y-3">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">04.</span> Storage, Security &amp; Third-Party Processors
        </h2>
        <p className="leading-relaxed">
          All data is securely stored on enterprise cloud infrastructure provided by <strong>Supabase Inc.</strong>, protected by encrypted SSL/TLS in transit, Row Level Security (RLS) policies at the database layer, and isolated service-role privileges.
        </p>
        <p className="leading-relaxed">
          We retain submission notification emails only for as long as necessary to process the submission. If you request account closure, your profile data is permanently purged.
        </p>
      </section>

      {/* Section 5: DPDP Act Rights */}
      <section className="space-y-4">
        <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-lime-accent">05.</span> Your Rights under India&apos;s DPDP Act, 2023
        </h2>
        <p className="leading-relaxed">
          Under Chapter III of the DPDP Act 2023 (and equivalent international privacy frameworks), you hold enforceable rights as a Data Principal:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-navy-900 border border-navy-800 rounded">
            <strong className="text-lime-accent block mb-1">Right to Access (§11):</strong>
            <span className="font-sans text-slate-300">Request a summary of all digital personal data processed about you.</span>
          </div>
          <div className="p-3 bg-navy-900 border border-navy-800 rounded">
            <strong className="text-lime-accent block mb-1">Right to Correction &amp; Erasure (§12):</strong>
            <span className="font-sans text-slate-300">Request correction of inaccurate data or complete deletion of your records.</span>
          </div>
          <div className="p-3 bg-navy-900 border border-navy-800 rounded">
            <strong className="text-lime-accent block mb-1">Right of Grievance Redressal (§13):</strong>
            <span className="font-sans text-slate-300">Register concerns directly with our Grievance Officer with an expedited resolution timeline.</span>
          </div>
          <div className="p-3 bg-navy-900 border border-navy-800 rounded">
            <strong className="text-lime-accent block mb-1">Right to Nominate (§14):</strong>
            <span className="font-sans text-slate-300">Nominate any other individual to exercise your rights in the event of death or incapacity.</span>
          </div>
        </div>
      </section>

      {/* Section 6: Grievance Officer */}
      <section className="space-y-3 p-6 rounded-xl border border-navy-700 bg-navy-900">
        <h2 className="font-mono text-lg font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-lime-accent" /> Grievance Officer &amp; Redressal
        </h2>
        <p className="text-xs leading-relaxed text-slate-300 font-sans">
          In accordance with the DPDP Act 2023 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, the designated Grievance Officer for Crawlers is:
        </p>
        <div className="font-mono text-xs text-slate-300 space-y-1 bg-navy-950 p-4 rounded border border-navy-800">
          <div><strong>Designation:</strong> Data Protection &amp; Grievance Officer</div>
          <div><strong>Organization:</strong> Crawlers Directory Operations</div>
          <div><strong>Email:</strong> <a href="mailto:grievance@crawlers.directory" className="text-lime-accent underline">grievance@crawlers.directory</a></div>
          <div><strong>Response Timeline:</strong> Within 15 to 30 calendar days of receiving a verifiable complaint.</div>
        </div>
      </section>

      {/* Navigation Return */}
      <div className="pt-6 border-t border-navy-850 flex justify-between items-center text-xs font-mono">
        <Link href="/" className="text-slate-400 hover:text-lime-accent flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <Link href="/terms" className="text-lime-accent hover:underline">
          Read Terms &amp; Conditions &rarr;
        </Link>
      </div>
    </main>
  );
}
