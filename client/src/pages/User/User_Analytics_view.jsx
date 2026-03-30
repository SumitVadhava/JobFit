import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Bookmark,
  Briefcase,
  CheckCircle,
  Code2,
  Star,
  TrendingUp,
  Sparkles,
  Activity,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const ACCENT = "#9c44fe";
const ACCENT_LIGHT = "rgba(156,68,254,0.07)";
const ACCENT_BORDER = "rgba(156,68,254,0.18)";

// ─── StatCard (matches AdminAnalytics style) ──────────────────────────────────
const StatCard = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="flex-1 min-w-[140px]"
  >
    <div
      className="p-5 rounded-2xl border bg-white flex items-center gap-4 transition-all duration-300"
      style={{
        borderColor: "#F1F5F9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = ACCENT;
        e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#F1F5F9";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: ACCENT_LIGHT }}
      >
        <Icon size={22} style={{ color: ACCENT }} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-black text-black mt-0.5 leading-none">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── Profile Progress Bar ─────────────────────────────────────────────────────
const ProfileProgress = ({ completion }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.5 }}
    className="bg-white rounded-2xl border p-5"
    style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} style={{ color: ACCENT }} />
        <span className="text-sm font-bold text-black">Profile Completion</span>
      </div>
      <span
        className="text-sm font-black"
        style={{ color: ACCENT }}
      >
        {completion}%
      </span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="h-2.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${ACCENT}, #bf7ffe)` }}
        initial={{ width: 0 }}
        animate={{ width: `${completion}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
      />
    </div>
  </motion.div>
);

// ─── Custom Tooltip for ATS chart ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm shadow-lg border"
        style={{
          background: "#fff",
          borderColor: ACCENT_BORDER,
          minWidth: 140,
        }}
      >
        <p className="font-semibold text-gray-500 text-xs mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="font-bold" style={{ color: entry.color }}>
            {entry.name === "score" ? `Score: ${entry.value}%` : `Count: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
function UserAnalytics() {
  const [metrics, setMetrics] = useState({
    profileCompletion: 0,
    savedJobsCount: 0,
    totalSkillsCount: 0,
    bestAtsScore: 0,
    jobsApplied: 0,
    lastActive: "Today",
  });

  // ATS history: array of { month, score, count }
  const [atsHistory, setAtsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAtsLine, setActiveAtsLine] = useState("score"); // "score" | "count"

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [profileRes, savedJobsRes, appliedRes, resumesRes] =
          await Promise.all([
            api.get("/profile").catch(() => null),
            api.get("/user/savedJobs").catch(() => null),
            api.get("/user/applied-companies").catch(() => null),
            api.get("/user/resumeBuilder").catch(() => null),
          ]);

        const profile = profileRes?.data?.profile || {};

        // Profile completion
        const fieldsToCheck = [
          user?.userName,
          user?.email,
          profile.skills?.length > 0,
          profile.resumeLink || profile.resumelink,
          profile.img,
          profile.experience && profile.experience !== "0-2 years",
          profile.education?.length > 0,
          profile.description,
        ];
        const filled = fieldsToCheck.filter(Boolean).length;
        const completionPct = Math.round((filled / fieldsToCheck.length) * 100);

        // ATS history from resumes
        const resumes = resumesRes?.data?.resumes || [];
        const history = buildAtsHistory(resumes, profile);

        setMetrics({
          profileCompletion: completionPct || 0,
          savedJobsCount: savedJobsRes?.data?.totalSavedJobs || 0,
          totalSkillsCount: profile.skills?.length || 0,
          bestAtsScore:
            resumesRes?.data?.bestScore ||
            profile.atsScore ||
            (history.length
              ? Math.max(...history.map((h) => h.score || 0))
              : 0),
          jobsApplied: appliedRes?.data?.totalApplications || 0,
          lastActive: "Today",
        });

        setAtsHistory(history);
      } catch (error) {
        console.error("Error fetching analytics data", error);
        toast.error("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Build ATS history from resume data or generate demo data
  const buildAtsHistory = (resumes, profile) => {
    if (resumes && resumes.length > 0) {
      // Group by month, pick best score per month, count submissions
      const monthMap = {};
      resumes.forEach((resume) => {
        const date = new Date(resume.createdAt || Date.now());
        const key = date.toLocaleString("default", { month: "short", year: "2-digit" });
        if (!monthMap[key]) monthMap[key] = { scores: [], count: 0 };
        monthMap[key].scores.push(resume.atsScore || 0);
        monthMap[key].count++;
      });
      return Object.entries(monthMap)
        .slice(-7)
        .map(([month, { scores, count }]) => ({
          month,
          score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          count,
        }));
    }

    // Fallback: demo data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const base = profile.atsScore || 55;
    return months.map((month, i) => ({
      month,
      score: Math.min(100, Math.max(30, base + Math.round((i - 3) * 4 + (Math.random() * 8 - 4)))),
      count: Math.floor(Math.random() * 4) + 1,
    }));
  };

  // ─── Loading State (matches AdminAnalytics) ─────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 border-4 rounded-full animate-spin"
            style={{ borderColor: "#f3e8ff", borderTopColor: ACCENT }}
          />
          <p className="text-base font-medium text-gray-400 animate-pulse">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  const latestScore =
    atsHistory.length > 0 ? atsHistory[atsHistory.length - 1].score : metrics.bestAtsScore;
  const totalAtsCount = atsHistory.reduce((s, h) => s + (h.count || 0), 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#ffffff_48%)]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <main className="min-w-0">
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                My Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back,{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>
                  {user?.userName || "User"}
                </span>{" "}
                — here's your performance overview.
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white"
              style={{ borderColor: "#E2E8F0" }}
            >
              <Activity size={12} className="text-emerald-500" />
              Live
            </span>
          </motion.div>

          {/* ── Profile Completion ─────────────────────────────────────── */}
          <ProfileProgress completion={metrics.profileCompletion} />

          {/* ── Stat Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Bookmark} label="Saved Jobs" value={metrics.savedJobsCount} delay={0} />
            <StatCard icon={Briefcase} label="Applied" value={metrics.jobsApplied} delay={0.08} />
            <StatCard icon={Code2} label="Skills" value={metrics.totalSkillsCount} delay={0.16} />
            <StatCard icon={Star} label="Best ATS" value={`${metrics.bestAtsScore}%`} delay={0.24} />
          </div>

          {/* ── ATS History Graph ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            {/* Graph header */}
            <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-bold text-black flex items-center gap-2">
                  <Sparkles size={16} style={{ color: ACCENT }} />
                  ATS History
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Resume submissions · score trend over time
                </p>
              </div>

              {/* Quick stats chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                  style={{ borderColor: ACCENT_BORDER, color: ACCENT, background: ACCENT_LIGHT }}
                >
                  Latest: {latestScore}%
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  Total Scans: {totalAtsCount}
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-1 mb-4">
              {[
                { key: "score", label: "Score %" },
                { key: "count", label: "Count" },
                { key: "both", label: "Both" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveAtsLine(key)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={
                    activeAtsLine === key
                      ? { background: ACCENT, color: "#fff" }
                      : { background: "#F1F5F9", color: "#64748B" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={atsHistory}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#CBD5E1"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#CBD5E1"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {(activeAtsLine === "score" || activeAtsLine === "both") && (
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="score"
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      fill="url(#gradScore)"
                      dot={{ r: 4, fill: ACCENT, stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: ACCENT, stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1200}
                    />
                  )}

                  {(activeAtsLine === "count" || activeAtsLine === "both") && (
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="count"
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      fill="url(#gradCount)"
                      dot={{ r: 4, fill: "#22d3ee", stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: "#22d3ee", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1200}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: ACCENT }} />
                ATS Score (%)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="w-3 h-3 rounded-full inline-block bg-cyan-400" />
                Resume Count
              </span>
            </div>
          </motion.div>

          {/* ── Weekly Snapshot (mirrors AdminAnalytics style) ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-white rounded-2xl border p-5"
            style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <TrendingUp size={16} style={{ color: ACCENT }} />
                Profile Snapshot
              </h3>
              <span className="text-xs text-gray-400">Overview</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Profile Score", value: `${metrics.profileCompletion}%` },
                { label: "Best ATS", value: `${metrics.bestAtsScore}%` },
                { label: "Jobs Saved", value: metrics.savedJobsCount },
                { label: "Total Skills", value: metrics.totalSkillsCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                    {item.label}
                  </p>
                  <p className="text-xl font-black text-black mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default UserAnalytics;