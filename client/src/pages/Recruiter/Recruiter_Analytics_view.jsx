import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Briefcase,
  Users,
  Trophy,
  ArrowRight,
  CircleDot,
  Sparkles,
  TrendingUp,
  Clock,
  Building2,
} from "lucide-react";
import api from "../../api/api";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#9c44fe";
const ACCENT_LIGHT = "rgba(156,68,254,0.07)";
const ACCENT_BORDER = "rgba(156,68,254,0.18)";
const PIE_COLORS = [
  "#9c44fe",
  "#7c3aed",
  "#c084fc",
  "#a78bfa",
  "#ddd6fe",
  "#e9d5ff",
];

const formatBackendDateTime = (timestamp) => {
  if (!timestamp || typeof timestamp !== "string") return "Date not available";

  const [datePart, timePartRaw] = timestamp.split("T");
  if (!datePart || !timePartRaw) return timestamp;

  const [year, month, day] = datePart.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = months[(Number(month) || 1) - 1] || month;
  const timePart = timePartRaw.replace("Z", "").split(".")[0];

  return `${day} ${monthName} ${year}, ${timePart}`;
};

// ─── StatCard (matches AdminAnalytics / User Analytics style) ─────────────────
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

// ─── Company Logo ──────────────────────────────────────────────────────────────
const CompanyLogo = ({ src, name, size = "w-11 h-11" }) => {
  const [err, setErr] = useState(false);
  const initial = (name || "J").charAt(0).toUpperCase();
  if (err || !src)
    return (
      <div
        className={`${size} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}
        style={{ background: ACCENT }}
      >
        {initial}
      </div>
    );
  return (
    <div
      className={`${size} rounded-xl overflow-hidden border-2 border-gray-100 shrink-0`}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setErr(true)}
      />
    </div>
  );
};

const CandidateAvatar = ({ src, name, size = "w-10 h-10" }) => {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "?")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (!src || imgError) {
    return (
      <div
        className={`${size} rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0`}
        style={{ background: `linear-gradient(135deg, ${ACCENT}, #7c3aed)` }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Candidate"}
      onError={() => setImgError(true)}
      className={`${size} rounded-xl object-cover border border-gray-200 shrink-0`}
    />
  );
};

// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
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
        <p className="font-semibold text-gray-500 text-xs mb-1 truncate max-w-[160px]">
          {label}
        </p>
        <p className="font-black text-base" style={{ color: ACCENT }}>
          {payload[0].value} applicants
        </p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RecruiterAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [perJobData, setPerJobData] = useState([]); // [{ jobTitle, applicants }]
  const [candidateSummary, setCandidateSummary] = useState({
    totalJobs: 0,
    totalCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  // grab recruiter id from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1) all recruiter jobs
        const jobsRes = await api
          .get(`/jobs/recruiter/${userId}`)
          .catch(() => null);
        const recruiterJobs = jobsRes?.data?.jobs || [];
        setJobs(recruiterJobs);

        // 2) all candidates across recruiter jobs
        const allCandRes = await api
          .get(`/jobs/recruiter/${userId}/candidates`)
          .catch(() => null);
        const totalCandidates = Number(allCandRes?.data?.totalCandidates) || 0;
        const totalJobsFromCandidatesApi =
          Number(allCandRes?.data?.totalJobs) || recruiterJobs.length;
        const candidates =
          allCandRes?.data?.candidates || allCandRes?.data?.applications || [];

        setCandidateSummary({
          totalJobs: totalJobsFromCandidatesApi,
          totalCandidates,
        });
        setAllCandidates(candidates);

        // 3) per-job applicant count from recruiter candidates API response
        if (recruiterJobs.length > 0) {
          const byJob = candidates.reduce((acc, candidate) => {
            const jobId = candidate.jobId;
            if (!jobId) return acc;

            if (!acc[jobId]) {
              const matchedJob = recruiterJobs.find((j) => j._id === jobId);
              acc[jobId] = {
                _id: jobId,
                jobTitle:
                  candidate.jobTitle || matchedJob?.jobTitle || "Untitled Job",
                companyName:
                  candidate.companyName ||
                  matchedJob?.companyName ||
                  "Unknown Company",
                img: matchedJob?.img || "",
                applicants: 0,
              };
            }

            acc[jobId].applicants += 1;
            return acc;
          }, {});

          const jobsWithApplicants = recruiterJobs.map((job) =>
            byJob[job._id]
              ? byJob[job._id]
              : {
                  _id: job._id,
                  jobTitle: job.jobTitle,
                  companyName: job.companyName,
                  img: job.img,
                  applicants: 0,
                },
          );

          setPerJobData(jobsWithApplicants);
        } else {
          setPerJobData([]);
        }
      } catch (err) {
        console.error("Error loading recruiter analytics:", err);
        toast.error("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  // ─── Derived stats ─────────────────────────────────────────────────────────
  const totalJobs = candidateSummary.totalJobs || jobs.length;
  const totalApplications =
    candidateSummary.totalCandidates ||
    perJobData.reduce((s, j) => s + j.applicants, 0);
  const avgPerJob =
    totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;

  const topJob = perJobData.reduce(
    (best, job) => (job.applicants > (best?.applicants ?? -1) ? job : best),
    null,
  );

  // Recent 5 applications — from allCandidates
  const recentApplications = [...allCandidates]
    .sort(
      (a, b) =>
        new Date(b.appliedAt || b.createdAt || 0) -
        new Date(a.appliedAt || a.createdAt || 0),
    )
    .slice(0, 5);

  const pieData = [...perJobData]
    .sort((a, b) => b.applicants - a.applicants)
    .slice(0, 6)
    .map((job) => ({
      name: job.jobTitle,
      applicants: job.applicants,
      _id: job._id,
      companyName: job.companyName,
      img: job.img,
    }));

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 border-4 rounded-full animate-spin"
            style={{ borderColor: "#f3e8ff", borderTopColor: ACCENT }}
          />
          <p className="text-base font-medium text-gray-400 animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

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
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
          {/* ── Header ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Recruitment overview — jobs, applications & top performers.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
              <CircleDot size={12} className="text-emerald-500" />
              Live
            </span>
          </motion.div>

          {/* ── Stat Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={Briefcase}
              label="Total Jobs Posted"
              value={totalJobs}
              delay={0}
            />
            <StatCard
              icon={Users}
              label="Total Applications"
              value={totalApplications}
              delay={0.08}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg. Applications / Job"
              value={avgPerJob}
              delay={0.16}
            />
          </div>

          {/* ── Applications Per Job — Bar Chart ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-2xl border p-5 sm:p-6"
            style={{
              borderColor: "#F1F5F9",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-bold text-black flex items-center gap-2">
                  <Sparkles size={16} style={{ color: ACCENT }} />
                  Applications Per Job
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Number of applicants for each posted job
                </p>
              </div>
              <div
                className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: ACCENT_BORDER,
                  color: ACCENT,
                  background: ACCENT_LIGHT,
                }}
              >
                {totalJobs} jobs
              </div>
            </div>

            {perJobData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <Briefcase size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No job data yet.</p>
                <p className="text-xs mt-1">
                  Post a job to see application stats here.
                </p>
              </div>
            ) : (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={perJobData}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                    barCategoryGap="35%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#F1F5F9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="jobTitle"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tickFormatter={(v) =>
                        v.length > 12 ? v.slice(0, 12) + "…" : v
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<BarTooltip />}
                      cursor={{ fill: `${ACCENT}08` }}
                    />
                    <Bar
                      dataKey="applicants"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={52}
                      animationDuration={1000}
                    >
                      {perJobData.map((entry, i) => (
                        <Cell
                          key={entry._id || i}
                          fill={
                            entry._id === topJob?._id ? ACCENT : `${ACCENT}55`
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* ── Top Performing Job (Pie Chart) ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white rounded-2xl border p-5 sm:p-6"
            style={{
              borderColor: "#F1F5F9",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black flex items-center gap-2">
                <Trophy size={16} style={{ color: ACCENT }} />
                Top Performing Job
              </h2>
              <span className="text-xs text-gray-400">Application share</span>
            </div>

            {topJob && pieData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="applicants"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry._id || index}
                            fill={
                              entry._id === topJob?._id
                                ? ACCENT
                                : PIE_COLORS[index % PIE_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} applicants`,
                          "Applications",
                        ]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={30}
                        formatter={(value) =>
                          value.length > 20 ? `${value.slice(0, 20)}...` : value
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div
                  className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md"
                  style={{
                    borderColor: ACCENT_BORDER,
                    background: ACCENT_LIGHT,
                  }}
                >
                  <CompanyLogo
                    src={topJob.img}
                    name={topJob.companyName}
                    size="w-14 h-14"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-black truncate">
                      {topJob.jobTitle}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Building2 size={11} />
                      {topJob.companyName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-2xl font-black"
                      style={{ color: ACCENT }}
                    >
                      {topJob.applicants}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      applicants
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Trophy size={36} className="mb-3 opacity-25" />
                <p className="text-sm font-medium">No top job yet</p>
              </div>
            )}
          </motion.div>

          {/* ── Recent Applications ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-white rounded-2xl border p-5 sm:p-6"
            style={{
              borderColor: "#F1F5F9",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black flex items-center gap-2">
                <Clock size={16} style={{ color: ACCENT }} />
                Recent Applications
              </h2>
              <span className="text-xs text-gray-400">Latest 5 entries</span>
            </div>

            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Users size={36} className="mb-3 opacity-25" />
                <p className="text-sm font-medium">No applications yet</p>
                <p className="text-xs mt-1 text-gray-300">
                  Applications will appear here once candidates apply.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app, i) => {
                  const candidateName = app.name || app.userName || "Unknown Candidate";

                  const candidateAvatarSrc =
                    app.profileImage ||
                    app.avatar ||
                    app.avatarUrl ||
                    (typeof app.profile === "string" ? app.profile : "") ||
                    app.profile?.avatar ||
                    app.profile?.profilePic ||
                    app.profile?.photo ||
                    app.profile?.img ||
                    app.profile?.url ||
                    "";

                  const applicationTime = app.appliedAt || app.createdAt;

                  const formattedDateTime = formatBackendDateTime(applicationTime);

                  return (
                    <motion.div
                      key={app._id || i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.07 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      {/* Avatar */}
                      <CandidateAvatar src={candidateAvatarSrc} name={candidateName} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">
                          {candidateName}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {app.email || "—"}
                          {app.jobTitle && ` · ${app.jobTitle}`}
                        </p>
                      </div>

                      {/* ATS score badge */}
                      {app.atsScore != null && (
                        <span
                          className="hidden sm:inline text-xs font-bold px-2.5 py-1 rounded-full border shrink-0"
                          style={{
                            color: ACCENT,
                            borderColor: ACCENT_BORDER,
                            background: ACCENT_LIGHT,
                          }}
                        >
                          ATS {app.atsScore}
                        </span>
                      )}

                      {/* Time */}
                      <span className="text-xs text-gray-300 shrink-0">
                        {formattedDateTime}
                      </span>

                      <ArrowRight
                        size={15}
                        className="text-gray-300 shrink-0"
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── Quick Snapshot (4 mini tiles matching admin style) ─────── */}
        </div>
      </main>
    </div>
  );
};

export default RecruiterAnalytics;
