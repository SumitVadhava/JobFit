import { useState, useEffect } from "react";
import {
  Eye,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Users,
  BookmarkIcon,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  GraduationCap,
  Monitor,
  X,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import RecruiterJobCard from "../../components/recruiter/RecruiterJobCard";
import { RecruiterSkeletonHistoryPage } from "../../components/recruiter/RecruiterSkeletons";

/* ─── Design tokens ─── */
const t = {
  bg: "#F9FAFB",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E9D5FF",
  borderHov: "#C084FC",
  text: "#111827",
  muted: "#6B7280",
  accent: "#6B46C1",
  accentDim: "#F3E8FF",
  green: "#15803D",
  greenDim: "#DCFCE7",
  red: "#DC2626",
  redDim: "#FEE2E2",
  amber: "#B45309",
  amberDim: "#FEF3C7",
  blue: "#2563EB",
};

// ─── Status Badge Component ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toLowerCase();
  const config = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Pending Review",
    },
    risky: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Risky",
    },
    verified: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "Verified",
    },
    reviewed: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "Reviewed",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "Rejected",
    },
  };

  const style = config[normalizedStatus] || config.pending;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};

// ─── Workplace Type Badge ────────────────────────────────────────────────────
const WorkplaceBadge = ({ type }) => {
  const normalizedType = String(type || "").toLowerCase();
  const config = {
    remote: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      label: "Remote",
    },
    hybrid: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Hybrid",
    },
    onsite: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      label: "On-site",
    },
  };

  const style = config[normalizedType] || config.onsite;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <Monitor className="w-3 h-3" />
      <span>{style.label}</span>
    </span>
  );
};

// ─── Job Card Component ──────────────────────────────────────────────────────
const JobCard = ({ job, onViewDetails, onDelete }) => {
  const initials = (job.companyName || "J")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-[#9c44fe]/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#9c44fe]/8 hover:border-[#9c44fe]/25">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-5 flex-col sm:flex-row">
          {/* Avatar */}
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #9c44fe, #7c3aed)`,
                boxShadow: `0 4px 14px #9c44fe30`,
              }}
            >
              {job.img && !job.img.includes("example.com") ? (
                <img
                  src={job.img}
                  alt={initials}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 mt-3 sm:mt-0 w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {job.jobTitle}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5 truncate flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> {job.companyName}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={job.status || job.adminReview} />
                  <WorkplaceBadge type={job.workPlaceType} />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Fully Hired
                  </span>
                  {job.bookmarked && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                      <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                      Bookmarked
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details Preview */}
            <div className="mt-4 p-4 rounded-xl border bg-[#9c44fe]/5 border-[#9c44fe]/10">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="flex items-center space-x-2 text-[13px] text-gray-600">
                  <MapPin className="w-4 h-4 text-[#9c44fe] flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-[13px] text-gray-600">
                  <Briefcase className="w-4 h-4 text-[#9c44fe] flex-shrink-0" />
                  <span className="truncate">{job.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-[13px] text-gray-600">
                  <Clock className="w-4 h-4 text-[#9c44fe] flex-shrink-0" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center space-x-2 text-[13px] text-gray-600">
                  <Users className="w-4 h-4 text-[#9c44fe] flex-shrink-0" />
                  <span>{job.totalCandidates ?? 0} Applications</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Description
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {job.jobDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <button
                onClick={() => onViewDetails?.(job)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
                style={{
                  background: "#111827",
                  boxShadow: "0 4px 14px rgba(17, 24, 39, 0.35)",
                }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>

              <button
                onClick={() => onDelete?.(job._id)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 transition-all duration-300 active:scale-[0.97]"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Job Detail Modal ────────────────────────────────────────────────────────
const JobDetailModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {job.jobTitle}
              </h2>
              <p className="text-sm text-gray-500">{job.companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="overflow-y-auto p-6 space-y-6"
          style={{ maxHeight: "calc(85vh - 140px)" }}
        >
          {/* Status & Badges */}
          <div className="flex items-center flex-wrap gap-2">
            <StatusBadge status={job.status || job.adminReview} />
            <WorkplaceBadge type={job.workPlaceType} />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <BadgeCheck className="w-3.5 h-3.5" />
              Position Filled
            </span>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>LOCATION</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {job.location}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>DEPARTMENT</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {job.department}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>EXPERIENCE</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {job.experience}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>OPENINGS</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-700">
                  Position Filled
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Job Description</span>
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {job.jobDescription}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span>Responsibilities</span>
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {job.responsibilities}
            </p>
          </div>

          {/* Qualifications */}
          <div>
            <h3 className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Qualifications</span>
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {job.qualifications}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Empty State Component ──────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
      <BadgeCheck className="w-10 h-10 text-emerald-300" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">
      No completed jobs yet
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-sm">
      Jobs will appear here once all their positions are filled (openings reach
      0).
    </p>
  </div>
);

// ─── Delete Confirmation Modal ─────────────────────────────────────────────
const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-red-100 bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>

          <h3 className="text-center text-lg font-bold text-gray-900">
            Delete this job posting?
          </h3>
          <p className="mt-2 text-center text-sm text-gray-500">
            This action is permanent and cannot be undone.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="min-w-[120px] px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                  <span>Deleting...</span>
                </span>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Recruiter History Component ─────────────────────────────────────────
const Recruiter_History = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const userData = localStorage.getItem("user");
        if (!userData) {
          console.log("No user found");
          return;
        }

        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        if (!userId) {
          console.error("Could not find a valid user ID in:", user);
          setLoading(false);
          return;
        }

        const response = await api.get("/recruiter/jobs/history");
        const recruiterJobs = response.data?.data || [];

        const jobsWithCandidateStats = await Promise.all(
          recruiterJobs.map(async (job) => {
            try {
              const candidatesResponse = await api.get("/recruiter/applicants", {
                params: { jobId: job._id },
              });
              const totalCandidates =
                Number(candidatesResponse?.data?.data?.length) || 0;
              return { ...job, totalCandidates };
            } catch {
              return { ...job, totalCandidates: 0 };
            }
          }),
        );

        setJobs(jobsWithCandidateStats);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Only completed (fully filled) jobs belong in History
  const completedJobs = jobs.filter((j) => Number(j.openings) === 0);

  // Handlers
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleDelete = async (jobId) => {
    setIsDeleting(true);
    try {
      await api.delete(`/recruiter/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setSelectedJob((prev) => (prev?._id === jobId ? null : prev));
      setDeleteModalOpen(false);
      setJobToDelete(null);
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHistoryCardAction = (job, action = "view") => {
    if (action === "delete") {
      openDeleteModal(job._id);
      return;
    }

    handleViewDetails(job);
  };

  return loading ? (
    <RecruiterSkeletonHistoryPage />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/70 via-white to-purple-50/60">
      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Results Count ─────────────────────────────────────────── */}
        <div className="mb-6 w-fit bg-white rounded-2xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Completed Jobs
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {completedJobs.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Empty State ────────────────────────────────────────────── */}
        {completedJobs.length === 0 && <EmptyState />}

        {/* ─── Job Cards Grid ─────────────────────────────────────────── */}
        {completedJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {completedJobs.map((job) => (
              <RecruiterJobCard
                key={job._id}
                job={job}
                onViewApplicants={handleHistoryCardAction}
                primaryActionLabel="View Details"
                showEditAction={false}
                showDeleteAction={true}
              />
            ))}
          </div>
        )}
      </main>

      {/* ─── Detail Modal ─────────────────────────────────────────────── */}
      <JobDetailModal
        job={selectedJob}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={() => jobToDelete && handleDelete(jobToDelete)}
        isDeleting={isDeleting}
      />

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Recruiter_History;
