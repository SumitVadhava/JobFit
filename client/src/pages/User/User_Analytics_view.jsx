import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  CircleDot,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const ACCENT = "#9c44fe";
const ACCENT_LIGHT = "rgba(156,68,254,0.07)";
const ACCENT_BORDER = "rgba(156,68,254,0.18)";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Group resumes by "Mon 'YY" and compute avg score + count per month */
const buildAtsHistory = (resumes, atsHistoryData = []) => {
  const allScores = [];

  if (resumes && resumes.length > 0) {
    resumes.forEach((r) => {
      allScores.push({
        score: r.atsScore || 0,
        date: new Date(r.createdAt || r.resumeDate || Date.now())
      });
    });
  }

  if (atsHistoryData && atsHistoryData.length > 0) {
    atsHistoryData.forEach((item) => {
      allScores.push({
        score: item.score || 0,
        date: new Date(item.analyzedAt || Date.now())
      });
    });
  }

  if (allScores.length === 0) return [];

  // Sort newest first
  const sorted = allScores.sort((a, b) => b.date - a.date);

  // Return the raw list formatted for the timeline
  return sorted.slice(0, 15).map((item, i) => {
    // Determine trend vs the previous item (which is older, so index i+1)
    let trend = null;
    if (i < sorted.length - 1) {
      const prev = sorted[i + 1].score;
      if (item.score > prev) trend = 'up';
      else if (item.score < prev) trend = 'down';
      else trend = 'same';
    }
    return {
      id: i,
      score: Math.round(item.score),
      date: item.date,
      dateStr: item.date.toLocaleString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      trend
    };
  });
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
  const [rawAtsHistory, setRawAtsHistory] = useState([]);

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

        const [profileRes, savedRes, appliedRes, resumeRes, atsHistoryRes] = await Promise.all([
          api.get("/profile").catch(() => null),
          api.get("/user/savedJobs").catch(() => null),
          api.get("/user/applied-companies").catch(() => null),
          userId
            ? api.get(`/resume/${userId}`).catch(() => null)
            : Promise.resolve(null),
          api.get("/atshistory").catch(() => null),
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

        // ATS History from ATS analyzer
        const atsData = atsHistoryRes?.data?.history || [];
        setRawAtsHistory(atsData);

        // Build ATS history from both resume data and ATS raw data
        setAtsHistory(buildAtsHistory(normalised, atsData));
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
    const resumeScores = resumes.map((r) => r.atsScore || 0);
    const historyScores = rawAtsHistory.map((item) => item.score || 0);
    const allScores = [...resumeScores, ...historyScores];

    if (allScores.length === 0) return profile?.atsScore ?? 0;
    return Math.max(...allScores);
  }, [resumes, rawAtsHistory, profile]);

  const latestAtsScore = React.useMemo(() => {
    if (atsHistory.length === 0) return bestAtsScore;
    return atsHistory[0].score; // Newest is 0th thanks to sorting
  }, [atsHistory, bestAtsScore]);

  const totalAtsCount = resumes.length + rawAtsHistory.length;
  const skillsCount = profile?.skills?.length ?? 0;
  const softSkillsCount = profile?.softSkills?.length ?? 0;
  const totalSkillsCount = skillsCount + softSkillsCount;
  const appliedCount = applications.length;

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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
              <CircleDot size={12} className="text-emerald-500" />
              Live updates
            </span>
          </motion.div>

          {/* ── Profile Completion ──────────────────────────────────────────── */}
          <ProfileProgress completion={profileCompletion} />

          {/* ── Stat Cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Bookmark} label="Saved Jobs" value={savedJobsCount} delay={0} />
            <StatCard icon={Briefcase} label="Applied" value={appliedCount} delay={0.08} />
            <StatCard icon={Code2} label="Skills" value={totalSkillsCount} delay={0.16} />
            <StatCard icon={Star} label="Best ATS" value={`${bestAtsScore}%`} delay={0.24} />
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

            {/* Timeline View */}
            {atsHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <FileText size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No resume data yet</p>
                <p className="text-xs mt-1 text-gray-300">
                  Upload a resume and run ATS analysis to see your score history here.
                </p>
              </div>
            ) : (
              <div className="relative pl-2 mt-2 max-h-[300px] overflow-y-auto pr-3" style={{ scrollbarWidth: 'thin' }}>
                {/* Vertical Line */}
                <div className="absolute left-[26px] top-4 bottom-4 w-px bg-gray-200" />

                <div className="space-y-4 pt-1">
                  {atsHistory.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (i * 0.05) }}
                      className="relative flex items-start gap-4"
                    >
                      {/* Circle indicator */}
                      <div
                        className="relative z-10 w-11 h-11 rounded-full flex shrink-0 items-center justify-center text-white text-xs font-black border-4 border-white shadow-sm"
                        style={{ background: item.score >= 75 ? '#16a34a' : item.score >= 50 ? '#eab308' : '#ef4444' }}
                      >
                        {item.score}%
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 mb-1 hover:shadow-sm hover:border-purple-200 transition-all duration-300">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-800">
                            {item.score >= 75 ? "Excellent Match" : item.score >= 50 ? "Average Match" : "Needs Work"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-gray-500">
                            Tested on {item.dateStr}
                          </p>
                          {item.trend === 'up' && (
                            <span className="flex items-center text-[10px] text-green-700 font-bold bg-green-100/80 px-1.5 py-0.5 rounded">
                              <TrendingUp size={11} className="mr-1" /> Improved
                            </span>
                          )}
                          {item.trend === 'down' && (
                            <span className="flex items-center text-[10px] text-red-700 font-bold bg-red-100/80 px-1.5 py-0.5 rounded">
                              <Activity size={11} className="mr-1" /> Declined
                            </span>
                          )}
                          {item.trend === 'same' && (
                            <span className="flex items-center text-[10px] text-gray-500 font-bold bg-gray-200/60 px-1.5 py-0.5 rounded">
                              <Activity size={11} className="mr-1" /> No Change
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
                    applied: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
                    shortlisted: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
                    rejected: { bg: "#fff1f2", text: "#dc2626", border: "#fecdd3" },
                    accepted: { bg: "#faf5ff", text: ACCENT, border: ACCENT_BORDER },
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
                      {/* <span className="text-xs text-gray-300 shrink-0">
                        {timeAgo(app.appliedAt)}
                      </span> */}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Status breakdown mini strip */}
            {appliedCount > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-4 gap-2">
                {[
                  { label: "Applied", key: "applied", color: "#16a34a" },
                  { label: "Shortlisted", key: "shortlisted", color: "#2563eb" },
                  { label: "Rejected", key: "rejected", color: "#dc2626" },
                  { label: "Accepted", key: "accepted", color: ACCENT },
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

        </div>
      </main>
    </div>
  );
}

export default UserAnalytics;