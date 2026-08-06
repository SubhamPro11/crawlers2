"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { insertSubmission } from "@/lib/supabase";
import { PricingModel } from "@/types/database";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    category: "writing-assistants",
    pricing_model: "freemium" as PricingModel,
    tags: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const tagArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const res = await insertSubmission({
      name: formData.name,
      url: formData.url,
      description: formData.description,
      category: formData.category,
      pricing_model: formData.pricing_model,
      tags: tagArray,
      submitter_email: formData.email || undefined,
    });

    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || "Failed to submit tool. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">Submit Tool</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Community Tool Indexing</span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-slate-100">
            Submit an AI Tool or API
          </h1>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Suggest software or developer API endpoints for editorial moderation. Submissions are audited to verify active source URLs, licensing models, and genuine functionality.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-xl border border-lime-accent/40 bg-navy-900 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-lime-accent/10 text-lime-accent flex items-center justify-center mx-auto border border-lime-accent/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Submission Received</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
              Your tool submission for <span className="text-lime-accent font-mono">{formData.name || "Software"}</span> has been queued for editorial review.
            </p>
            <div className="pt-4">
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Tool
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-xl border border-navy-800 bg-navy-900 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-300 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {/* Tool Name */}
            <Input
              label="Tool Name"
              promptPrefix
              placeholder="e.g. Ollama, Cursor, ElevenLabs"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            {/* Official URL */}
            <Input
              label="Official Website or Repository URL"
              placeholder="https://..."
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />

            {/* Category Dropdown */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="block font-medium text-slate-400 uppercase tracking-wider">
                Category
              </label>
              <select
                className="w-full bg-navy-950 border border-navy-700 text-slate-100 rounded px-3 py-2 text-sm font-sans focus:outline-none focus:border-lime-accent"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {TAXONOMY_SEEDS.flatMap((section) =>
                  section.categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {section.name} &gt; {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Pricing Model */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="block font-medium text-slate-400 uppercase tracking-wider">
                Pricing Model
              </label>
              <select
                className="w-full bg-navy-950 border border-navy-700 text-slate-100 rounded px-3 py-2 text-sm font-sans focus:outline-none focus:border-lime-accent"
                value={formData.pricing_model}
                onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value as PricingModel })}
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="open-source">Open Source</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="block font-medium text-slate-400 uppercase tracking-wider">
                Description (Original Wording)
              </label>
              <textarea
                rows={4}
                required
                className="w-full bg-navy-950 border border-navy-700 text-slate-100 rounded p-3 text-sm font-sans placeholder-slate-500 focus:outline-none focus:border-lime-accent"
                placeholder="Describe what the tool accomplishes in original terms (do not paste verbatim promotional copy)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Tags */}
            <Input
              label="Tags (Comma separated)"
              placeholder="cli, local-ai, developer-tool"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />

            {/* Submitter Email */}
            <Input
              label="Your Email (Optional for notification)"
              type="email"
              placeholder="dev@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="pt-4 border-t border-navy-850 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">
                Status: Queued for pending review
              </span>
              <Button type="submit" variant="primary" disabled={submitting} icon={<Send className="w-4 h-4" />}>
                {submitting ? "Submitting..." : "Submit For Review"}
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
