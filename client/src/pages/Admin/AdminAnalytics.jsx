import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react"

import {
  StatCard,
  EmptyState,
} from "../../components/AdminAnalyticsWidgets";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const AdminAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applicationStats, setApplicationStats] = useState({ applicants: 0, shortlisted: 0, hired: 0 });
  const [userStats, setUserStats] = useState({ candidates: 0, recruiters: 0 });
  const [loading, setLoading] = useState(true);

  // Chart Data
  const [companyData, setCompanyData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch stats from dashboard endpoint (stat cards only)
        const statsRes = await api.get("/admin/dashboard");
        const statsData = statsRes.data.data || {};

        console.log(statsData);

        // Fetch jobs
        const jobsRes = await api.get("/admin/jobs");
        const fetchedJobs = jobsRes.data.data || [];
        const sortedJobs = [...fetchedJobs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setJobs(sortedJobs);

        // Fetch companies
        const companiesRes = await api.get("/admin/companies");
        const fetchedCompanies = companiesRes.data.data || [];
        setCompanies(fetchedCompanies);

        // Set derived stats
        setApplicationStats({
          applicants: statsData.totalApplications || 0,
          shortlisted: statsData.totalShortlisted || 0,
          hired: statsData.totalHired || 0,
        });

        const candCount = statsData.totalCandidates || 0;
        const recCount = statsData.totalRecruiter || 0;
        setUserStats({ candidates: candCount, recruiters: recCount });

        // Prepare Company Distribution Data (Jobs per company)
        const companyJobMap = {};
        fetchedJobs.forEach(job => {
          const cName = job.companyName || "Unknown";
          companyJobMap[cName] = (companyJobMap[cName] || 0) + 1;
        });
        const chartData = Object.keys(companyJobMap).map(name => ({
          name: name.length > 10 ? name.substring(0, 10) + '...' : name,
          jobs: companyJobMap[name]
        })).sort((a, b) => b.jobs - a.jobs).slice(0, 6);
        setCompanyData(chartData);

        // Prepare Role Split Data
        setRoleData([
          { name: 'Candidates', value: candCount, color: '#9c44fe' },
          { name: 'Recruiters', value: recCount, color: '#f59e0b' }
        ]);

      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-200/60 rounded-2xl ${className}`} />
  );

  const JobIcon = ({ src, name, size = "w-12 h-12", textSize = "text-lg" }) => {
    const [error, setError] = useState(false);
    return (
      <div className={`${size} rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors overflow-hidden`}>
        {src && !error ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <span className={`${textSize} font-black text-slate-400 group-hover:text-purple-600`}>
            {name?.charAt(0).toUpperCase() || "?"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[radial-gradient(circle_at_top_left,_#fdfbff_0%,_#ffffff_100%)]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* ─── Header Section ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-1 rounded-full bg-purple-600" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-600">
                System Overview
              </span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Real-time recruitment metrics and system vitals.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Live Updates
            </span>
          </div>
        </div>

        {/* ─── Overview Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : (
            <>
              <StatCard
                label="Companies"
                value={companies.length}
                icon={Building2}
                color="#9c44fe"
                delay={0.1}
              />
              <StatCard
                label="Total Jobs"
                value={jobs.length}
                icon={Briefcase}
                color="#0ea5e9"
                delay={0.2}
              />
              <StatCard
                label="Candidates"
                value={userStats.candidates}
                icon={Users}
                color="#f59e0b"
                delay={0.3}
              />
              <StatCard
                label="Hired"
                value={applicationStats.hired}
                icon={Rocket}
                color="#10b981"
                delay={0.4}
              />
            </>
          )}
        </div>

        {/* ─── Analytics & Insights Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-none">Job Distribution</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">By top contributing companies</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Sparkles size={18} className="text-purple-600" />
              </div>
            </div>

            <div className="h-[300px] w-full">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800 }}
                    />
                    <Bar dataKey="jobs" fill="#9c44fe" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* User Ratio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-black text-slate-900 leading-none">User Ratio</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Candidate vs Recruiter Split</p>
            </div>

            <div className="h-[240px] w-full">
              {loading ? (
                <Skeleton className="w-full h-full rounded-full max-w-[200px] mx-auto" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => <span className="text-xs font-bold text-slate-600 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Registered</span>
                {loading ? (
                  <Skeleton className="w-12 h-5" />
                ) : (
                  <span className="text-sm font-black text-slate-900">{userStats.candidates + userStats.recruiters}</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Recent Activity Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-slate-900">Recent Job Posts</h2>
            </div>

            <div className="space-y-3">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No Jobs Found"
                  subtitle="There are currently no active openings."
                />
              ) : (
                jobs.slice(0, 5).map((job, i) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer"
                  >
                    <JobIcon src={job.img} name={job.companyName} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-slate-900 truncate tracking-tight group-hover:text-purple-700 transition-colors">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{job.companyName}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {job.openings > 0 ? (
                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {job.openings} Openings
                        </span>
                      ) : (
                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                          Filled
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Insights Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white p-6 rounded-[32px] text-slate-950 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-slate-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <Rocket size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-extrabold mb-2 leading-tight tracking-tight">Growth Insights</h2>
            {loading ? (
              <Skeleton className="h-10 w-full mb-8" />
            ) : (
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                Your network has {companies.length} active companies. More recruiters are joining the platform.
              </p>
            )}

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Avg. Applications</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">
                    {loading ? <Skeleton className="w-16 h-8" /> : (jobs.length > 0 ? (applicationStats.applicants / jobs.length).toFixed(1) : "0.0")}
                  </span>
                  {!loading && <span className="text-xs font-semibold text-slate-400">per job</span>}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Shortlist Rate</p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Skeleton className="w-20 h-8" />
                  ) : (
                    <>
                      <span className="text-2xl font-black text-emerald-600">
                        {applicationStats.applicants > 0 ? ((applicationStats.shortlisted / applicationStats.applicants) * 100).toFixed(0) : "0"}%
                      </span>
                      <span className="text-xs font-bold text-emerald-500/80">
                        {applicationStats.shortlisted > 0 ? "+2% vs LY" : "Awaiting data"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
