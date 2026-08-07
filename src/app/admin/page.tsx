"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Check,
  X,
  LogOut,
  Layers,
  Inbox,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_TOOLS } from "@/lib/mockData";
import {
  fetchPendingSubmissions,
  updateSubmissionStatus,
  fetchPendingLinkReports,
  updateLinkReportStatus,
  fetchTools,
  fetchAdminAnalytics,
  AdminAnalyticsData,
  supabase,
} from "@/lib/supabase";
import { Submission, Tool, LinkReport } from "@/types/database";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"submissions" | "tools" | "analytics">("submissions");
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  // Real community tool submissions & analytics fetched from database
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([]);
  const [pendingReports, setPendingReports] = useState<LinkReport[]>([]);
  const [activeTools, setActiveTools] = useState<Tool[]>(MOCK_TOOLS);
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);

  useEffect(() => {
    // Verify admin session via Supabase Auth or local session token
    const verifyAuth = async () => {
      const localSession = localStorage.getItem("crawlers_admin_session");
      
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (user) {
          if (user.email === "subhamkr11012004@gmail.com") {
            localStorage.setItem("crawlers_admin_session", "true");
            setAuthed(true);
            loadDashboardData();
            return;
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profile?.role === "admin") {
            localStorage.setItem("crawlers_admin_session", "true");
            setAuthed(true);
            loadDashboardData();
            return;
          }
        }
      }

      if (localSession === "true") {
        setAuthed(true);
        loadDashboardData();
      } else {
        router.push("/admin/login");
      }
    };

    const loadDashboardData = async () => {
      const realSubmissions = await fetchPendingSubmissions();
      setPendingSubmissions(realSubmissions);
      const realReports = await fetchPendingLinkReports();
      setPendingReports(realReports);
      const toolsFromDb = await fetchTools();
      if (toolsFromDb && toolsFromDb.length > 0) {
        setActiveTools(toolsFromDb);
      }
      const analytics = await fetchAdminAnalytics();
      setAnalyticsData(analytics);
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem("crawlers_admin_session");
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  const handleApproveSubmission = async (id: string) => {
    await updateSubmissionStatus(id, "approved");
    setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRejectSubmission = async (id: string) => {
    await updateSubmissionStatus(id, "rejected");
    setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResolveReport = async (id: string) => {
    await updateLinkReportStatus(id, "resolved");
    setPendingReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDismissReport = async (id: string) => {
    await updateLinkReportStatus(id, "dismissed");
    setPendingReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleToolActive = (id: string) => {
    setActiveTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_active: !t.is_active } : t))
    );
  };

  if (!authed) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 flex-1 w-full space-y-6 font-mono">
      {/* Admin Dashboard Header Card */}
      <div className="rounded-xl border border-navy-800 bg-navy-900/90 p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-accent/10 border border-lime-accent/30 flex items-center justify-center text-lime-accent shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-lime-accent uppercase tracking-wider font-mono font-semibold">
                Admin Console v1.2.0 • Maintainer Mode
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                Directory Control Plane
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950 border border-navy-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse" />
              <span>
                Admin: <strong className="text-slate-100 font-semibold font-mono">subhamkr11012004@gmail.com</strong>
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full bg-navy-950 border border-navy-800 text-xs text-slate-400 hover:text-red-400 hover:border-red-900/60 transition-colors flex items-center gap-1.5 cursor-pointer font-bold shrink-0"
              title="Sign out session"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-navy-850 text-xs">
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-5 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "submissions"
                  ? "bg-lime-accent text-navy-950 font-bold"
                  : "bg-navy-900 text-slate-300 hover:text-lime-accent"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Review Queue ({pendingSubmissions.length + pendingReports.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`px-5 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "tools"
                  ? "bg-lime-accent text-navy-950 font-bold"
                  : "bg-navy-900 text-slate-300 hover:text-lime-accent"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tool Management ({activeTools.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-5 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-lime-accent text-navy-950 font-bold"
                  : "bg-navy-900 text-slate-300 hover:text-lime-accent"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>View Logs Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Submission & Report Review Queue */}
        {activeTab === "submissions" && (
          <div className="space-y-8">
            {/* Reported Broken Links Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-navy-850 pb-2">
                <span className="font-bold text-amber-400">Reported Broken Links & Licensing Alerts</span>
                <span>{pendingReports.length} reports awaiting maintainer action</span>
              </div>

              {pendingReports.length === 0 ? (
                <div className="p-6 rounded border border-navy-800 bg-navy-900/60 text-center space-y-1 text-slate-400">
                  <div className="text-xs font-mono text-slate-400 font-semibold">No Pending Broken Link Reports</div>
                  <p className="text-[11px] font-sans text-slate-500">
                    All user reports have been resolved or dismissed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded border border-amber-500/30 bg-navy-900/90 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-100 text-sm">
                            {report.tools?.name || "Target Tool"}
                          </span>
                          <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">{report.reason}</Badge>
                          <span className="text-[11px] text-slate-500 font-sans">
                            Reported: {new Date(report.reported_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolveReport(report.id)}
                            className="px-3 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent hover:bg-lime-accent hover:text-navy-950 font-bold transition-all text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Resolve Issue
                          </button>
                          <button
                            onClick={() => handleDismissReport(report.id)}
                            className="px-3 py-1 rounded-full bg-navy-950 border border-navy-800 text-slate-400 hover:text-red-400 hover:border-red-900 transition-colors text-xs flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <X className="w-3.5 h-3.5" /> Dismiss
                          </button>
                        </div>
                      </div>
                      {report.tools?.url && (
                        <div className="text-[11px] text-slate-400 font-sans">
                          Target URL: <a href={report.tools.url} target="_blank" rel="noopener noreferrer" className="text-lime-accent hover:underline">{report.tools.url}</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Community Submissions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-navy-850 pb-2">
                <span className="font-bold text-slate-200">Pending Community Tool Submissions</span>
                <span>{pendingSubmissions.length} items awaiting audit</span>
              </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-8 rounded border border-navy-800 bg-navy-900 text-center space-y-2 text-slate-400">
                <Check className="w-8 h-8 text-lime-accent mx-auto" />
                <div className="font-bold text-slate-200">Review Queue Empty</div>
                <p className="text-xs font-sans text-slate-500">
                  All community submissions have been audited and triaged.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded border border-navy-800 bg-navy-900 p-5 space-y-3 border border-navy-800"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-100 text-base">
                          {sub.name}
                        </span>
                        <Badge variant="lime">{sub.pricing_model}</Badge>
                        <span className="text-xs text-slate-500">{sub.category}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Submitted: {sub.submitted_at}
                      </span>
                    </div>

                    <p className="text-xs font-sans text-slate-300">{sub.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-navy-850 text-xs">
                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lime-accent hover:underline flex items-center gap-1"
                      >
                        → {sub.url}
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectSubmission(sub.id)}
                          className="px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800 text-red-300 hover:bg-red-900 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleApproveSubmission(sub.id)}
                          className="px-4 py-1.5 rounded-full bg-lime-accent text-navy-950 font-bold hover:bg-lime-hover transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve &amp; Publish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Tab 2: Tool Management */}
        {activeTab === "tools" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-navy-850 pb-2">
              <span>Active Directory Tools Catalog</span>
              <span>Total: {activeTools.length}</span>
            </div>

            <div className="divide-y divide-navy-850 rounded border border-navy-800 bg-navy-900 overflow-hidden">
              {activeTools.map((t) => (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-navy-900/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                      <span>{t.name}</span>
                      <Badge variant="subtle">[{t.pricing_model}]</Badge>
                      {t.has_api && (
                        <span className="px-1.5 py-0.5 rounded-md bg-lime-accent/10 border border-lime-accent/30 text-[10px] text-lime-accent">
                          API Enabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-sans text-slate-400">{t.description}</p>
                  </div>

                  <button
                    onClick={() => handleToggleToolActive(t.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      t.is_active
                        ? "bg-navy-850 border border-navy-700 text-lime-accent hover:border-red-700 hover:text-red-400"
                        : "bg-red-950/60 border border-red-800 text-red-300 hover:border-lime-accent hover:text-lime-accent"
                    }`}
                  >
                    {t.is_active ? "Active" : "Deactivated"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Analytics (Read-Only Reporting) */}
        {activeTab === "analytics" && (
          <div className="space-y-6 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-navy-850 pb-2">
              <span>Directory Telemetry & Reporting</span>
              <span>Read-Only Audit Mode</span>
            </div>

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-1">
                <div className="text-xs text-slate-400">Total Indexed Tools</div>
                <div className="text-3xl font-bold text-slate-100">
                  {analyticsData?.totalTools || activeTools.length}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Active directory entries in DB
                </div>
              </div>

              <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-1">
                <div className="text-xs text-slate-400">API Endpoint Access</div>
                <div className="text-3xl font-bold text-lime-accent">
                  {analyticsData?.toolsWithApi || 0}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Tools exposing developer APIs
                </div>
              </div>

              <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-1">
                <div className="text-xs text-slate-400">Community Submissions</div>
                <div className="text-3xl font-bold text-emerald-400">
                  {analyticsData?.submissionStats.total || 0}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  {analyticsData?.submissionStats.pending || 0} pending • {analyticsData?.submissionStats.approved || 0} approved
                </div>
              </div>

              <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-1">
                <div className="text-xs text-slate-400">24h View Log Signals</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {Object.values(analyticsData?.trendingData.viewCounts || {}).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Real traffic events from view_logs table
                </div>
              </div>
            </div>

            {/* Category Distribution & Pricing Model Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution Table */}
              <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-4">
                <div className="text-xs text-lime-accent font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Top Taxonomy Categories</span>
                  <span className="text-[10px] text-slate-500 font-normal">Count</span>
                </div>
                {analyticsData?.categoryDistribution && analyticsData.categoryDistribution.length > 0 ? (
                  <div className="space-y-2.5">
                    {analyticsData.categoryDistribution.map((item) => (
                      <div key={item.categoryName} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-sans font-medium">{item.categoryName}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{item.count} tools</span>
                        </div>
                        <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden border border-navy-800">
                          <div
                            className="bg-lime-accent h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (item.count / (analyticsData.totalTools || 1)) * 100 * 5)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-4 text-center">
                    Indexing taxonomy category metrics...
                  </div>
                )}
              </div>

              {/* Pricing Model Distribution & Submissions Triage */}
              <div className="space-y-6">
                <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-4">
                  <div className="text-xs text-lime-accent font-bold uppercase tracking-wider">
                    Pricing Model Breakdown
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-navy-950 border border-navy-850 space-y-1">
                      <div className="text-[10px] text-slate-400">Open-Source</div>
                      <div className="text-xl font-bold text-slate-100">
                        {analyticsData?.pricingBreakdown["open-source"] || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-950 border border-navy-850 space-y-1">
                      <div className="text-[10px] text-slate-400">Freemium</div>
                      <div className="text-xl font-bold text-slate-100">
                        {analyticsData?.pricingBreakdown["freemium"] || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-950 border border-navy-850 space-y-1">
                      <div className="text-[10px] text-slate-400">Free</div>
                      <div className="text-xl font-bold text-slate-100">
                        {analyticsData?.pricingBreakdown["free"] || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-950 border border-navy-850 space-y-1">
                      <div className="text-[10px] text-slate-400">Paid</div>
                      <div className="text-xl font-bold text-slate-100">
                        {analyticsData?.pricingBreakdown["paid"] || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-navy-800 bg-navy-900 p-5 space-y-3">
                  <div className="text-xs text-lime-accent font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>24h View Log Signals</span>
                    <span className="text-[10px] bg-lime-accent/10 text-lime-accent px-2 py-0.5 rounded border border-lime-accent/30">
                      Live Stream
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-navy-950 border border-navy-850 text-xs text-slate-400 space-y-1 font-sans">
                    <div>
                      Tracking active: <strong className="text-slate-200 font-mono">view_logs</strong> table capturing page view events per tool.
                    </div>
                    {analyticsData?.trendingData.tools && analyticsData.trendingData.tools.length > 0 ? (
                      <div className="pt-2 font-mono text-[11px] text-slate-300 space-y-1">
                        {analyticsData.trendingData.tools.map((t) => (
                          <div key={t.id} className="flex justify-between">
                            <span>{t.name}</span>
                            <span className="text-lime-accent">
                              {analyticsData.trendingData.viewCounts[t.id] || 0} views
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 font-mono italic pt-1">
                        0 recorded page views in the last 24h. System ready to register live events.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
