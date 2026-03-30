import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";

import {
  ArrowRight,
  Briefcase,
  Building2,
  CircleDot,
  Rocket,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import {
  StatCard,
  EmptyState,
  CompanyLogo,
  ACCENT,
  ACCENT_LIGHT,
  ACCENT_BORDER,
} from "../../components/AdminAnalyticsWidgets";

const AdminAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsRes = await api.get("/admin/jobs");
        const fetchedJobs = jobsRes.data.data || [];
        // Sort by createdAt descending to show most recent first
        const sortedJobs = [...fetchedJobs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setJobs(sortedJobs);
      } catch (err) {
        console.error("Error loading jobs:", err);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const staticStats = {
    applicants: 148,
    shortlisted: 37,
    hired: 16,
  };

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
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Admin Dashboard
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Recruitment overview with static insights and recent openings.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
              <CircleDot size={12} className="text-emerald-500" />
              Live updates
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Jobs"
              value={jobs.length}
              color={ACCENT}
              delay={0}
              icon={Briefcase}
            />
            <StatCard
              label="Applicants"
              value={staticStats.applicants}
              color={ACCENT}
              delay={0.1}
              icon={Users}
            />
            <StatCard
              label="Shortlisted"
              value={staticStats.shortlisted}
              color={ACCENT}
              delay={0.2}
              icon={Star}
            />
            <StatCard
              label="Hired"
              value={staticStats.hired}
              color={ACCENT}
              delay={0.3}
              icon={Rocket}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-black mb-4">Recent Job Posts</h2>

            {jobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase size={36} style={{ color: ACCENT }} />}
                title="No Jobs Yet"
                subtitle="Create your first job post to start attracting candidates."
              />
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 6).map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <CompanyLogo
                      src={job.img}
                      name={job.companyName}
                      size="w-12 h-12"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-black truncate">
                        {job.jobTitle}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Building2 size={12} />
                        {job.companyName} · {job.location}
                      </p>
                    </div>
                    <span
                      className="hidden sm:inline text-xs font-medium px-3 py-1 rounded-full border"
                      style={{
                        color: ACCENT,
                        borderColor: ACCENT_BORDER,
                        backgroundColor: ACCENT_LIGHT,
                      }}
                    >
                      {job.openings || 0} openings
                    </span>
                    <span className="text-gray-300">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
