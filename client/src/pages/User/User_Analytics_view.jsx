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
  FileText,
  Building2,
  Clock,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const ACCENT       = "#9c44fe";
const ACCENT_LIGHT  = "rgba(156,68,254,0.07)";
const ACCENT_BORDER = "rgba(156,68,254,0.18)";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Group resumes by "Mon 'YY" and compute avg score + count per month */
const buildAtsHistory = (resumes) => {
  if (!resumes || resumes.length === 0) return [];

  // Sort oldest → newest so the chart reads left-to-right chronologically
  const sorted = [...resumes].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  const monthMap = {};
  sorted.forEach((resume) => {
    const date = new Date(resume.createdAt || Date.now());
    const key = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (!monthMap[key]) monthMap[key] = { scores: [], count: 0 };
    monthMap[key].scores.push(resume.atsScore || 0);
    monthMap[key].count += 1;
  });

  return Object.entries(monthMap)
    .slice(-8) // show at most the last 8 months
    .map(([month, { scores, count }]) => ({
      month,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count,
    }));
};

/** Format a date as relative "Xd ago / Xh ago / Xm ago" */
const timeAgo = (dateStr) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="flex-1 min-w-[140px]"
  >
    <div
      className="p-5 rounded-2xl border bg-white flex items-center gap-4 transition-all duration-300"
      style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
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
        <p className="text-2xl font-black text-black mt-0.5 leading-none">{value}</p>
      </div>
    </div>
  </motion.div>
);

// ─── Profile Progress Bar ─────────────────────────────────────────────────────
const ProfileProgress = ({ completion }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.45 }}
    className="bg-white rounded-2xl border p-5"
    style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} style={{ color: ACCENT }} />
        <span className="text-sm font-bold text-black">Profile Completion</span>
      </div>
      <span className="text-sm font-black" style={{ color: ACCENT }}>
        {completion}%
      </span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="h-2.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${ACCENT}, #bf7ffe)` }}
        initial={{ width: 0 }}
        animate={{ width: `${completion}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.55 }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-2">
      {completion < 100
        ? `${100 - completion}% left — complete your profile to improve job matches.`
        : "Your profile is fully complete! Great job."}
    </p>
  </motion.div>
);

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm shadow-lg border"
        style={{ background: "#fff", borderColor: ACCENT_BORDER, minWidth: 150 }}
      >
        <p className="font-semibold text-gray-500 text-xs mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="font-bold" style={{ color: entry.color }}>
            {entry.name === "score"
              ? `ATS Score: ${entry.value}%`
              : `Resumes: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
function UserAnalytics() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);

  // From /api/profile
  const [profile, setProfile] = useState(null);

  // From /api/resume/:userId
  const [resumes, setResumes] = useState([]);

  // From /api/user/savedJobs
  const [savedJobsCount, setSavedJobsCount] = useState(0);

  // From /api/user/applied-companies
  const [applications, setApplications] = useState([]);

  // Derived
  const [atsHistory, setAtsHistory] = useState([]);
  const [activeAtsLine, setActiveAtsLine] = useState("score");

  // User from localStorage
  const user = React.useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );
  const userId = user._id || user.id;

  // ── Fetch all data ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [profileRes, savedRes, appliedRes, resumeRes] = await Promise.all([
          api.get("/profile").catch(() => null),
          api.get("/user/savedJobs").catch(() => null),
          api.get("/user/applied-companies").catch(() => null),
          userId
            ? api.get(`/resume/${userId}`).catch(() => null)
            : Promise.resolve(null),
        ]);

        // Profile
        const prof = profileRes?.data?.profile || {};
        setProfile(prof);

        // Saved jobs
        setSavedJobsCount(savedRes?.data?.totalSavedJobs ?? 0);

        // Applied jobs
        const apps =
          appliedRes?.data?.applications ||
          appliedRes?.data?.appliedJobs ||
          [];
        setApplications(apps);

        // Resumes — array of { _id, resumeName, resumeDate, atsScore, createdAt }
        const resumeList =
          resumeRes?.data?.resumes ||
          resumeRes?.data ||
          [];
        const normalised = Array.isArray(resumeList) ? resumeList : [];
        setResumes(normalised);

        // Build ATS history from real resume data
        setAtsHistory(buildAtsHistory(normalised));
      } catch (err) {
        console.error("Analytics fetch error:", err);
        toast.error("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  // ── Derived metrics ────────────────────────────────────────────────────────
  const profileCompletion = React.useMemo(() => {
    if (!profile && !user) return 0;
    const checks = [
      !!user?.userName,
      !!user?.email,
      (profile?.skills?.length ?? 0) > 0,
      !!(profile?.resumeLink || profile?.resumelink),
      !!profile?.img,
      !!(profile?.experience && profile.experience !== "0-2 years"),
      (profile?.education?.length ?? 0) > 0,
      !!profile?.description,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, user]);

  const bestAtsScore = React.useMemo(() => {
    if (resumes.length === 0) return profile?.atsScore ?? 0;
    return Math.max(...resumes.map((r) => r.atsScore || 0));
  }, [resumes, profile]);

  const latestAtsScore = React.useMemo(() => {
    if (atsHistory.length === 0) return bestAtsScore;
    return atsHistory[atsHistory.length - 1].score;
  }, [atsHistory, bestAtsScore]);

  const totalAtsCount = resumes.length;
  const skillsCount   = profile?.skills?.length ?? 0;
  const appliedCount  = applications.length;

  // Application status breakdown
  const statusBreakdown = React.useMemo(() => {
    const counts = { applied: 0, shortlisted: 0, rejected: 0, accepted: 0 };
    applications.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });
    return counts;
  }, [applications]);

  // Recent 5 applications (sorted newest first)
  const recentApplications = React.useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0))
        .slice(0, 5),
    [applications]
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 border-4 rounded-full animate-spin"
            style={{ borderColor: "#f3e8ff", borderTopColor: ACCENT }}
          />
          <p className="text-base font-medium text-gray-400 animate-pulse">
            Loading your analytics...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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

          {/* ── Header ─────────────────────────────────────────────────────── */}
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
                — here's your real-time performance overview.
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

          {/* ── Profile Completion ──────────────────────────────────────────── */}
          <ProfileProgress completion={profileCompletion} />

          {/* ── Stat Cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Bookmark}  label="Saved Jobs"  value={savedJobsCount}           delay={0}    />
            <StatCard icon={Briefcase} label="Applied"     value={appliedCount}              delay={0.08} />
            <StatCard icon={Code2}     label="Skills"      value={skillsCount}               delay={0.16} />
            <StatCard icon={Star}      label="Best ATS"    value={`${bestAtsScore}%`}        delay={0.24} />
          </div>

          {/* ── ATS History Graph ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
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
                  Resume submissions · score trend over time (live from your account)
                </p>
              </div>

              {/* Stats chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                  style={{ borderColor: ACCENT_BORDER, color: ACCENT, background: ACCENT_LIGHT }}
                >
                  Latest Score: {latestAtsScore}%
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  {totalAtsCount} resume{totalAtsCount !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-1 mb-4">
              {[
                { key: "score", label: "Score %" },
                { key: "count", label: "Count" },
                { key: "both",  label: "Both"    },
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

            {/* Chart or empty state */}
            {atsHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <FileText size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No resume data yet</p>
                <p className="text-xs mt-1 text-gray-300">
                  Upload a resume and run ATS analysis to see your score history here.
                </p>
              </div>
            ) : (
              <>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={atsHistory}
                      margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={ACCENT}   stopOpacity={0.22} />
                          <stop offset="100%" stopColor={ACCENT}   stopOpacity={0}    />
                        </linearGradient>
                        <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#22d3ee" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0}    />
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
                      <Tooltip content={<ChartTooltip />} />

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
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ background: ACCENT }}
                    />
                    ATS Score (%)
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <span className="w-3 h-3 rounded-full inline-block bg-cyan-400" />
                    Resume Count
                  </span>
                </div>
              </>
            )}
          </motion.div>

          {/* ── Recent Applications ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="bg-white rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: "#F1F5F9", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <Clock size={16} style={{ color: ACCENT }} />
                Recent Applications
              </h3>
              <span className="text-xs text-gray-400">
                {appliedCount} total
              </span>
            </div>

            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Briefcase size={36} className="mb-3 opacity-25" />
                <p className="text-sm font-medium">No applications yet</p>
                <p className="text-xs mt-1 text-gray-300">
                  Start applying to jobs to track your progress here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app, i) => {
                  const statusColor = {
                    applied:     { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
                    shortlisted: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
                    rejected:    { bg: "#fff1f2", text: "#dc2626", border: "#fecdd3" },
                    accepted:    { bg: "#faf5ff", text: ACCENT,   border: ACCENT_BORDER },
                  }[app.status] || { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" };

                  return (
                    <motion.div
                      key={app.applicationId || i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.45 + i * 0.07 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      {/* Company logo / fallback */}
                      {app.img ? (
                        <img
                          src={app.img}
                          alt={app.companyName}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ background: ACCENT }}
                        >
                          {(app.companyName || "?").charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">
                          {app.jobTitle || "Unknown Role"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                          <Building2 size={11} />
                          {app.companyName || "—"}
                          {app.location && ` · ${app.location}`}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span
                        className="hidden sm:inline text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 capitalize"
                        style={{
                          background: statusColor.bg,
                          color: statusColor.text,
                          borderColor: statusColor.border,
                        }}
                      >
                        {app.status || "applied"}
                      </span>

                      {/* Time */}
                      <span className="text-xs text-gray-300 shrink-0">
                        {timeAgo(app.appliedAt)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Status breakdown mini strip */}
            {appliedCount > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-4 gap-2">
                {[
                  { label: "Applied",     key: "applied",     color: "#16a34a" },
                  { label: "Shortlisted", key: "shortlisted", color: "#2563eb" },
                  { label: "Rejected",    key: "rejected",    color: "#dc2626" },
                  { label: "Accepted",    key: "accepted",    color: ACCENT     },
                ].map(({ label, key, color }) => (
                  <div key={key} className="text-center">
                    <p className="text-lg font-black" style={{ color }}>
                      {statusBreakdown[key]}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Profile Snapshot ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.52 }}
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
                { label: "Profile Score",    value: `${profileCompletion}%`  },
                { label: "Best ATS",         value: `${bestAtsScore}%`       },
                { label: "Jobs Saved",        value: savedJobsCount           },
                { label: "Total Resumes",     value: totalAtsCount            },
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

            {/* Skills chips */}
            {profile?.skills?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Your Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.slice(0, 14).map((s, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{
                        borderColor: ACCENT_BORDER,
                        color: ACCENT,
                        background: ACCENT_LIGHT,
                      }}
                    >
                      {s.skillName || s}
                    </span>
                  ))}
                  {profile.skills.length > 14 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                      +{profile.skills.length - 14} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default UserAnalytics;