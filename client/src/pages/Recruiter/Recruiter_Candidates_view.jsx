import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Users,
  BookmarkIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
  Monitor,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import { motion } from "framer-motion";
import { Paper, Box, Typography } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PeopleIcon from "@mui/icons-material/People";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

/* ─────────────────── Constants ─────────────────── */
const ACCENT = "#9c44fe";
const HISTORY_CARD_COLORS = {
  accent: "#6B46C1",
  amber: "#B45309",
  green: "#15803D",
  blue: "#2563EB",
};
const byPrefixAndName = {
  far: {
    filter: faFilter,
  },
};

const STATUS_OPTIONS = [
  { value: "shortlisted", label: "Shortlisted", color: "green" },
  { value: "hired", label: "Hired", color: "indigo" },
  { value: "rejected", label: "Rejected", color: "red" },
];

const STATUS_STYLES = {
  green: { pill: "bg-green-50 border-green-200 text-green-700", checked: "bg-green-500 border-green-500" },
  indigo: { pill: "bg-indigo-50 border-indigo-200 text-indigo-700", checked: "bg-indigo-500 border-indigo-500" },
  red: { pill: "bg-red-50 border-red-200 text-red-600", checked: "bg-red-500 border-red-500" },
};

/* ─────────────── ATS Score Circle ──────────────── */
const AtsScoreCircle = ({ score = 0, size = 64 }) => {
  const sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;

  const color =
    score >= 80
      ? "#22c55e"
      : score >= 60
        ? "#eab308"
        : score >= 40
          ? "#f97316"
          : "#ef4444";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={sw}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <span className="absolute text-sm font-extrabold" style={{ color }}>
        {score}
      </span>
    </div>
  );
};

/* ──────────────── Stat Card ────────────────────── */
const StatCard = ({ icon, label, value, sub, iconBorder = false }) => (
  <div
    className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg bg-white border-[#9c44fe]/10 hover:border-[#9c44fe]/30
      `}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#9c44fe]/10 ${iconBorder ? "border border-[#9c44fe]/35" : "border border-transparent"}
          `}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-bold uppercase tracking-wider text-gray-400
          `}
      >
        {label}
      </span>
    </div>
    <p
      className={`text-3xl font-extrabold text-gray-900
        `}
    >
      {value}
    </p>
    {sub && <p className={`text-xs mt-1 text-gray-900`}>{sub}</p>}
  </div>
);

const HistoryStatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    style={{ flex: 1, minWidth: 140 }}
  >
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: "1px solid #F1F5F9",
        bgcolor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "all 0.25s ease",
        "&:hover": { borderColor: color, boxShadow: `0 4px 16px ${color}18` },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ fontSize: 22, color }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0F172A",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
);

/* ───────────── Recruiter History Style Job Cards ───────────── */
const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Pending Review",
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

  const style = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};

const WorkplaceBadge = ({ type }) => {
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

  const style = config[type] || config.onsite;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <Monitor className="w-3 h-3" />
      <span>{style.label}</span>
    </span>
  );
};

const RecruiterJobCard = ({ job, onViewApplicants }) => {
  const canEdit = (job.totalCandidates ?? 0) < 1;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.img && !job.img.includes("example.com") ? (
                <img
                  src={job.img}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-purple-600" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                {job.jobTitle}
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                onClick={() => onViewApplicants?.(job, "edit")}
                className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-700 transition-colors"
                aria-label="Edit job"
                title="Edit job"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onViewApplicants?.(job, "delete")}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Delete job"
              title="Delete job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 mt-4">
          <StatusBadge status={job.adminReview} />
          <WorkplaceBadge type={job.workPlaceType} />
          {job.bookmarked && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
              <BookmarkIcon className="w-3 h-3 fill-current" />
              <span>Bookmarked</span>
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 mx-5" />

      <div className="p-5 pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="truncate">{job.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>{job.openings ?? "N/A"} Openings</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 col-span-2">
            <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>{job.totalCandidates ?? 0} Candidates Applied</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
          {job.jobDescription}
        </p>
      </div>

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => onViewApplicants?.(job, "view")}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View Applicants</span>
        </button>
      </div>
    </div>
  );
};

const EditJobModal = ({ job, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        jobTitle: job.jobTitle || "",
        department: job.department || "",
        openings: job.openings ?? "",
        experience: job.experience || "",
        responsibilities: job.responsibilities || "",
        qualifications: job.qualifications || "",
        companyName: job.companyName || "",
        location: job.location || "",
        workPlaceType: job.workPlaceType || "",
        jobDescription: job.jobDescription || "",
        img: job.img || "",
        bookmarked: job.bookmarked || false,
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const normalizedOpenings =
        formData.openings === "" ? NaN : Number(formData.openings);

      if (!Number.isFinite(normalizedOpenings) || normalizedOpenings < 1) {
        toast.error("Minimum opening must be 1");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        openings: normalizedOpenings,
      };

      const res = await api.put(`/jobs/${job._id}`, payload);
      onUpdate(res.data.job);
      toast.success("Job updated successfully");
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Edit className="w-5 h-5 text-purple-600" />
            <span>Edit Job Posting</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <form
            id="edit-job-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Job Title
              </label>
              <input
                required
                name="jobTitle"
                value={formData.jobTitle}ta
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Company Info
              </label>
              <input
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Location
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Openings
              </label>
              <input
                required
                type="number"
                min="1"
                step="1"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Workplace Type
              </label>
              <select
                required
                name="workPlaceType"
                value={formData.workPlaceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="0-1 years">0-1 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="5-6 years">5-6 years</option>
                <option value="7-8 years">7-8 years</option>
                <option value="9-10 years">9-10 years</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Image URL
              </label>
              <input
                name="img"
                value={formData.img}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Job Description
              </label>
              <textarea
                required
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Responsibilities
              </label>
              <textarea
                required
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Qualifications
              </label>
              <textarea
                required
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              />
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            form="edit-job-form"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors min-w-[120px]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
                <span className="inline-flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
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

/* ─────────── Candidate Action Confirm Modal ────────── */
const ACTION_CONFIG = {
  shortlist: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 256 256"
        className="text-green-600"
      >
        <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
      </svg>
    ),
    iconBg: "bg-green-50 border-green-100",
    title: "Shortlist Candidate?",
    description:
      "This candidate will be moved to the shortlisted pool. You can hire or reject them later.",
    confirmLabel: "Yes, Shortlist",
    confirmClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  reject: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 256 256"
        className="text-red-600"
      >
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
      </svg>
    ),
    iconBg: "bg-red-50 border-red-100",
    title: "Reject Candidate?",
    description:
      "This candidate will be marked as rejected. This action reflects your hiring decision.",
    confirmLabel: "Yes, Reject",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  hire: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 256 256"
        className="text-indigo-600"
      >
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    ),
    iconBg: "bg-indigo-50 border-indigo-100",
    title: "Hire Candidate?",
    description:
      "Hiring this candidate will reduce the available openings count for this job posting.",
    confirmLabel: "Yes, Hire",
    confirmClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
};

const ConfirmActionModal = ({
  isOpen,
  action,
  candidateName,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !action) return null;
  const cfg = ACTION_CONFIG[action] || {};

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header accent bar */}
        <div
          className={`h-1.5 rounded-t-2xl ${action === "shortlist"
            ? "bg-green-500"
            : action === "reject"
              ? "bg-red-500"
              : "bg-indigo-500"
            }`}
        />

        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${cfg.iconBg}`}
          >
            {cfg.icon}
          </div>

          {/* Title */}
          <h3 className="text-center text-lg font-bold text-gray-900 mb-1">
            {cfg.title}
          </h3>

          {/* Candidate name */}
          {candidateName && (
            <p className="text-center text-sm font-semibold text-[#9c44fe] mb-2">
              {candidateName}
            </p>
          )}

          {/* Description */}
          <p className="text-center text-sm text-gray-500 leading-relaxed">
            {cfg.description}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`min-w-[130px] px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${cfg.confirmClass}`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                cfg.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── Main Component ─────────────────── */
const CandidatesView = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState(new Set());
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    candidate: null,
  });
  const candidatesPerPage = 6;

  /* ── Fetch Jobs ── */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const userData = localStorage.getItem("user");
        if (!userData) {
          console.log("No user found");
          setJobs([]);
          return;
        }

        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        if (!userId) {
          console.error("Could not find a valid user ID in:", user);
          setJobs([]);
          return;
        }

        const res = await api.get(`/jobs/recruiter/${userId}`);
        const recruiterJobs = res.data.jobs || [];

        const jobsWithCandidateStats = await Promise.all(
          recruiterJobs.map(async (job) => {
            try {
              const candidatesResponse = await api.get(
                `/jobs/${job._id}/candidates`,
              );
              const totalCandidates =
                Number(candidatesResponse?.data?.totalCandidates) || 0;

              return {
                ...job,
                totalCandidates,
              };
            } catch (candidateError) {
              console.error(
                `Error fetching candidates for job ${job._id}:`,
                candidateError,
              );

              return {
                ...job,
                totalCandidates: 0,
              };
            }
          }),
        );

        setJobs(jobsWithCandidateStats);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* ── Fetch Candidates ── */
  const fetchCandidates = useCallback(async (jobId) => {
    try {
      setCandidatesLoading(true);
      const res = await api.get(`/jobs/${jobId}/candidates`);
      const apiCandidates = res.data.candidates || [];

      const normalized = apiCandidates.map((candidate, index) => ({
        _id:
          candidate.applicationId ||
          candidate.candidateId ||
          `${jobId}-candidate-${index}`,
        applicationId: candidate.applicationId,
        candidateId: candidate.candidateId,
        name: candidate.userName,
        email: candidate.email,
        status: candidate.status,
        appliedAt: candidate.appliedAt,
        atsScore: candidate.profile?.atsScore,
        qualifications: candidate.profile?.qualifications,
        experience: candidate.profile?.experience,
        skills: Array.isArray(candidate.profile?.skills)
          ? candidate.profile.skills.map((item) =>
            typeof item === "string" ? item : item?.skillName,
          )
          : candidate.profile?.skills,
        resumeLink: candidate.profile?.resumeLink,
      }));

      setCandidates(normalized);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidates([]);
      toast.error("Failed to load candidates. Please try again.");
    } finally {
      setCandidatesLoading(false);
    }
  }, []);

  const handleEdit = useCallback((job) => {
    if ((job.totalCandidates ?? 0) >= 1) {
      toast.info(
        "This job cannot be edited after at least 1 candidate applies",
      );
      return;
    }

    setEditingJob(job);
    setEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((jobId) => {
    setJobToDelete(jobId);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setJobToDelete(null);
  }, [isDeleting]);

  const handleDelete = useCallback(async (jobId) => {
    setIsDeleting(true);
    try {
      await api.delete(`/jobs/${jobId}`);
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
  }, []);

  const handleUpdateJob = useCallback((updatedJob) => {
    const normalizedUpdatedJob = {
      ...updatedJob,
      openings: Number(updatedJob.openings) || 0,
    };

    setJobs((prev) =>
      prev.map((j) =>
        j._id === normalizedUpdatedJob._id
          ? { ...j, ...normalizedUpdatedJob }
          : j,
      ),
    );

    setSelectedJob((prev) =>
      prev?._id === normalizedUpdatedJob._id
        ? { ...prev, ...normalizedUpdatedJob }
        : prev,
    );
  }, []);

  const handleJobAction = useCallback(
    (job, action = "view") => {
      if (action === "edit") {
        handleEdit(job);
        return;
      }

      if (action === "delete") {
        openDeleteModal(job._id);
        return;
      }

      setSelectedJob(job);
      setSearchQuery("");
      setCurrentPage(1);
      setExpandedCandidate(null);
      fetchCandidates(job._id);
    },
    [fetchCandidates, handleEdit, openDeleteModal],
  );

  const handleBack = useCallback(() => {
    setSelectedJob(null);
    setCandidates([]);
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleViewResume = useCallback((candidate) => {
    if (!candidate?.resumeLink) {
      toast.info("Resume is not uploaded by user");
      return;
    }

    window.open(candidate.resumeLink, "_blank", "noopener,noreferrer");
  }, []);

  const openConfirmModal = useCallback(
    (candidate, action) => {
      const jobId = selectedJob?._id;
      const candidateStatus = (candidate?.status || "").toLowerCase();

      if (!jobId || !candidate?.applicationId) {
        toast.error("Unable to process candidate action");
        return;
      }

      if (action === "hire" && candidateStatus !== "shortlisted") {
        toast.info("You must shortlist the candidate before hiring");
        return;
      }

      setConfirmModal({ open: true, action, candidate });
    },
    [selectedJob?._id],
  );

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ open: false, action: null, candidate: null });
  }, []);

  const handleCandidateAction = useCallback(
    async (candidate, action) => {
      const jobId = selectedJob?._id;
      const applicationId = candidate?.applicationId;

      if (!jobId || !applicationId) {
        toast.error("Unable to process candidate action");
        return;
      }

      const endpointMap = {
        shortlist: `/jobs/${jobId}/candidates/${applicationId}/shortlist`,
        reject: `/jobs/${jobId}/candidates/${applicationId}/reject`,
        hire: `/jobs/${jobId}/candidates/${applicationId}/hire`,
      };

      const successMessageMap = {
        shortlist: "Candidate shortlisted successfully",
        reject: "Candidate rejected successfully",
        hire: "Candidate hired successfully",
      };

      const endpoint = endpointMap[action];
      if (!endpoint) return;

      const loadingKey = `${applicationId}:${action}`;
      setActionLoadingKey(loadingKey);
      closeConfirmModal();

      try {
        const res = await api.patch(endpoint);
        toast.success(res?.data?.message || successMessageMap[action]);

        if (action === "hire") {
          const openingsLeft = res?.data?.data?.openingsLeft;
          if (Number.isFinite(openingsLeft)) {
            setSelectedJob((prev) =>
              prev ? { ...prev, openings: openingsLeft } : prev,
            );
            setJobs((prev) =>
              prev.map((j) =>
                j._id === jobId ? { ...j, openings: openingsLeft } : j,
              ),
            );
          }
        }

        await fetchCandidates(jobId);
      } catch (error) {
        console.error(`Failed to ${action} candidate:`, error);
        toast.error(
          error?.response?.data?.message || `Failed to ${action} candidate`,
        );
      } finally {
        setActionLoadingKey("");
      }
    },
    [fetchCandidates, selectedJob?._id, closeConfirmModal],
  );

  /* ── Filter & Sort Candidates ── */
  const filtered = candidates.filter(
    (c) =>
      (searchQuery === "" ||
        (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.qualifications || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (statusFilters.size === 0 ||
        statusFilters.has((c.status || "").toLowerCase())),
  );

  const totalPages = Math.ceil(filtered.length / candidatesPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage,
  );

  /* ── Stats ── */
  const candidatesWithScore = candidates.filter(
    (c) => typeof c.atsScore === "number" && Number.isFinite(c.atsScore),
  );

  const avgScore =
    candidatesWithScore.length > 0
      ? Math.round(
        candidatesWithScore.reduce((sum, c) => sum + c.atsScore, 0) /
        candidatesWithScore.length,
      )
      : 0;
  const topScore =
    candidatesWithScore.length > 0
      ? Math.max(...candidatesWithScore.map((c) => c.atsScore))
      : 0;
  const highScoreCount = candidatesWithScore.filter(
    (c) => c.atsScore >= 80,
  ).length;

  /* ── Filter Jobs ── */
  const filteredJobs = jobs.filter(
    (j) =>
      jobSearch === "" ||
      j.jobTitle?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.department?.toLowerCase().includes(jobSearch.toLowerCase()),
  );

  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter((j) => j.adminReview === "pending").length;
  const reviewedJobs = jobs.filter((j) => j.adminReview === "reviewed").length;
  const totalOpenings = jobs.reduce(
    (sum, j) => sum + (Number(j.openings) || 0),
    0,
  );

  /* ═══════════════ LOADING ═══════════════ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 border-4 rounded-full animate-spin"
            style={{ borderColor: "#f3e8ff", borderTopColor: ACCENT }}
          />
          <p className="text-base font-medium text-gray-400 animate-pulse">
            Loading your job posts…
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════ CANDIDATES VIEW ═══════════════ */
  if (selectedJob) {
    return (
      <div className="min-h-screen bg-[#faf8ff]">
        <ToastContainer />

        {/* ── Confirm Action Modal ── */}
        <ConfirmActionModal
          isOpen={confirmModal.open}
          action={confirmModal.action}
          candidateName={confirmModal.candidate?.name}
          onCancel={closeConfirmModal}
          onConfirm={() =>
            handleCandidateAction(confirmModal.candidate, confirmModal.action)
          }
          isLoading={actionLoadingKey !== ""}
        />

        {/* ── Sticky Header ── */}
        <div className="bg-white/90 backdrop-blur-md border-b border-[#9c44fe]/10 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            {/* Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="group p-2.5 rounded-xl border border-gray-300 text-gray-900 hover:bg-gray-100 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="transition-transform group-hover:-translate-x-0.5"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                </svg>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {/* Mini logo */}
                  <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden border-2 border-[#9c44fe]/20">
                    <img
                      src={selectedJob.img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold" style="background:${ACCENT}">${selectedJob.companyName?.charAt(0) || "J"}</div>`;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {selectedJob.jobTitle}
                    </h1>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedJob.companyName} · {selectedJob.location} ·{" "}
                      {selectedJob.department}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#111827",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.07,195.63a8,8,0,1,0,13.86,8C27.21,186.38,50.44,172,84,172s56.79,14.38,67.07,31.63a8,8,0,1,0,13.86-8A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z" />
                </svg>
                {candidates.length} Applicant
                {candidates.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-3 mt-4">
              {/* Search bar */}
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search candidates…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9c44fe]/25 focus:border-[#9c44fe]/40 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Checkbox filter pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mr-1">
                  <FontAwesomeIcon icon={byPrefixAndName.far["filter"]} className="text-[#9c44fe] text-sm" />
                  Filter {"    "}
                </span>

                {STATUS_OPTIONS.map(({ value, label, color }) => {
                  const isChecked = statusFilters.has(value);
                  const s = STATUS_STYLES[color];
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setStatusFilters((prev) => {
                          const next = new Set(prev);
                          if (next.has(value)) next.delete(value);
                          else next.add(value);
                          return next;
                        });
                        setCurrentPage(1);
                      }}
                      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 select-none ${isChecked
                        ? `${s.pill} shadow-md scale-[1.04]`
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:shadow-sm"
                        }`}
                    >
                      {/* Custom checkbox tick */}
                      <span
                        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isChecked ? s.checked : "border-gray-300 bg-white"
                          }`}
                      >
                        {isChecked && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {label}
                    </button>
                  );
                })}

                {/* Clear button — only visible when filters active */}
                {statusFilters.size > 0 && (
                  <button
                    type="button"
                    onClick={() => { setStatusFilters(new Set()); setCurrentPage(1); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-dashed border-gray-300 text-sm font-medium text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ── Stats Row ── */}
          {!candidatesLoading && candidates.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                accent
                iconBorder
                label="Total"
                value={candidates.length}
                sub="applicants"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={ACCENT}
                    viewBox="0 0 256 256"
                  >
                    <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.07,195.63a8,8,0,1,0,13.86,8C27.21,186.38,50.44,172,84,172s56.79,14.38,67.07,31.63a8,8,0,1,0,13.86-8A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33C228.79,186.38,205.56,172,172,172a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
                  </svg>
                }
              />
              <StatCard
                label="Avg Score"
                value={avgScore}
                sub="out of 100"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={ACCENT}
                    viewBox="0 0 256 256"
                  >
                    <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8v40a8,8,0,0,1-16,0V91.31l-58.34,58.35a8,8,0,0,1-11.32,0L96,123.31,40,179.31V200H224A8,8,0,0,1,232,208Z" />
                  </svg>
                }
              />
              <StatCard
                label="Top Score"
                value={topScore}
                sub="highest match"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={ACCENT}
                    viewBox="0 0 256 256"
                  >
                    <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,30.5,0l23.21,55.36L226.92,91A16.46,16.46,0,0,1,234.29,114.85Z" />
                  </svg>
                }
              />
              <StatCard
                label="Strong Fit"
                value={highScoreCount}
                sub="score ≥ 80"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={ACCENT}
                    viewBox="0 0 256 256"
                  >
                    <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                  </svg>
                }
              />
            </div>
          )}

          {/* ── Candidates ── */}
          {candidatesLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
                style={{ borderColor: "#f3e8ff", borderTopColor: ACCENT }}
              />
              <p className="text-gray-400 text-sm">Loading candidates…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#9c44fe]/10 p-16 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: `${ACCENT}12` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill={ACCENT}
                  viewBox="0 0 256 256"
                >
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.07,195.63a8,8,0,1,0,13.86,8C27.21,186.38,50.44,172,84,172s56.79,14.38,67.07,31.63a8,8,0,1,0,13.86-8A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery ? "No Matching Candidates" : "No Applications Yet"}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "No one has applied for this position yet. Share the listing to attract talent."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginated.map((c, i) => {
                  const isExpanded = expandedCandidate === c._id;
                  const candidateStatus = (c.status || "").toLowerCase();
                  const isShortlisted = candidateStatus === "shortlisted";
                  const isHired = candidateStatus === "hired";
                  const isRejected = candidateStatus === "rejected";
                  const initials = (c.name || "?")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={c._id || i}
                      className="bg-white rounded-2xl border border-[#9c44fe]/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#9c44fe]/8 hover:border-[#9c44fe]/25"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-4 sm:gap-5">
                          {/* Avatar */}
                          <div
                            className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${ACCENT}, #7c3aed)`,
                              boxShadow: `0 4px 14px ${ACCENT}30`,
                            }}
                          >
                            {initials}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-bold text-gray-900 truncate">
                                  {c.name || "Unknown Candidate"}
                                </h3>
                                {c.email && (
                                  <p className="text-sm text-gray-400 mt-0.5 truncate">
                                    {c.email}
                                  </p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  {c.status && (
                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                      {c.status}
                                    </span>
                                  )}
                                  {c.appliedAt && (
                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                      Applied{" "}
                                      {new Date(
                                        c.appliedAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                  {!c.resumeLink && (
                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                      Candidate has not uploaded resume
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Score */}
                              <div className="shrink-0 flex flex-col items-center">
                                {typeof c.atsScore === "number" &&
                                  Number.isFinite(c.atsScore) ? (
                                  <>
                                    <AtsScoreCircle
                                      score={c.atsScore}
                                      size={60}
                                    />
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                                      ATS
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-200">
                                    ATS N/A
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Qualifications Preview */}
                            {c.qualifications && (
                              <div
                                className="mt-4 p-4 rounded-xl border"
                                style={{
                                  backgroundColor: `${ACCENT}06`,
                                  borderColor: `${ACCENT}12`,
                                }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    fill="#111827"
                                    viewBox="0 0 256 256"
                                  >
                                    <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.74,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12Z" />
                                  </svg>
                                  <span
                                    className="text-xs font-bold uppercase tracking-wider"
                                    style={{ color: "#111827" }}
                                  >
                                    Qualifications
                                  </span>
                                </div>
                                <p
                                  className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}
                                >
                                  {c.qualifications}
                                </p>
                              </div>
                            )}

                            {/* Expanded Details */}
                            <div
                              className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded
                                ? "max-h-[400px] opacity-100 mt-4"
                                : "max-h-0 opacity-0 mt-0"
                                }`}
                            >
                              <div className="space-y-3">
                                {c.experience && (
                                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="#6b7280"
                                      viewBox="0 0 256 256"
                                      className="mt-0.5 shrink-0"
                                    >
                                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
                                    </svg>
                                    <div>
                                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Experience
                                      </span>
                                      <p className="text-sm text-gray-700 mt-0.5">
                                        {c.experience}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {c.skills && (
                                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="#6b7280"
                                      viewBox="0 0 256 256"
                                      className="mt-0.5 shrink-0"
                                    >
                                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
                                    </svg>
                                    <div>
                                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Skills
                                      </span>

                                      <div className="flex flex-wrap gap-2">
                                        {(Array.isArray(c.skills)
                                          ? c.skills
                                          : c.skills.split(",")
                                        ).map((skill, si) => (
                                          <span
                                            key={si}
                                            className="text-xs font-medium px-3 py-1.5 rounded-full border"
                                            style={{
                                              color: ACCENT,
                                              backgroundColor: `${ACCENT}08`,
                                              borderColor: `${ACCENT}20`,
                                            }}
                                          >
                                            {skill.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                              {c.resumeLink && (
                                <button
                                  onClick={() => handleViewResume(c)}
                                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
                                  style={{
                                    background: "#111827",
                                    boxShadow:
                                      "0 4px 14px rgba(17, 24, 39, 0.35)",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                  >
                                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                                  </svg>
                                  View Resume
                                </button>
                              )}

                              {!isShortlisted && !isHired && !isRejected && (
                                <>
                                  <button
                                    onClick={() =>
                                      openConfirmModal(c, "shortlist")
                                    }
                                    disabled={
                                      actionLoadingKey ===
                                      `${c.applicationId}:shortlist`
                                    }
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-green-600 border border-green-200 bg-white hover:bg-green-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                    >
                                      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                                    </svg>
                                    {actionLoadingKey ===
                                      `${c.applicationId}:shortlist`
                                      ? "Shortlisting..."
                                      : "Shortlist"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      openConfirmModal(c, "reject")
                                    }
                                    disabled={
                                      actionLoadingKey ===
                                      `${c.applicationId}:reject`
                                    }
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                    >
                                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                                    </svg>
                                    {actionLoadingKey ===
                                      `${c.applicationId}:reject`
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>
                                </>
                              )}

                              {isShortlisted && (
                                <>
                                  <span className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                                    Shortlisted
                                  </span>

                                  <button
                                    onClick={() =>
                                      openConfirmModal(c, "reject")
                                    }
                                    disabled={
                                      actionLoadingKey ===
                                      `${c.applicationId}:reject`
                                    }
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                    >
                                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                                    </svg>
                                    {actionLoadingKey ===
                                      `${c.applicationId}:reject`
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>

                                  <button
                                    onClick={() => openConfirmModal(c, "hire")}
                                    disabled={
                                      actionLoadingKey ===
                                      `${c.applicationId}:hire`
                                    }
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                    >
                                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                                    </svg>
                                    {actionLoadingKey ===
                                      `${c.applicationId}:hire`
                                      ? "Hiring..."
                                      : "Hire"}
                                  </button>
                                </>
                              )}

                              {isHired && (
                                <span className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Hired
                                </span>
                              )}

                              {isRejected && (
                                <span className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-50 text-red-700 border border-red-200">
                                  Rejected
                                </span>
                              )}

                              <button
                                onClick={() =>
                                  setExpandedCandidate(
                                    isExpanded ? null : c._id,
                                  )
                                }
                                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 ml-auto ${isExpanded
                                  ? "text-[#9c44fe] bg-[#9c44fe]/5 border-[#9c44fe]/20"
                                  : "text-gray-400 bg-white border-gray-200 hover:border-gray-300 hover:text-gray-600"
                                  }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
                                >
                                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                                </svg>
                                {isExpanded ? "Less" : "More"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl text-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300"
                        style={
                          currentPage === p
                            ? {
                              background: ACCENT,
                              color: "white",
                              boxShadow: `0 4px 14px ${ACCENT}40`,
                            }
                            : { color: "#9ca3af" }
                        }
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl text-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                    </svg>
                  </button>
                </div>
              )}

              {filtered.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Showing {(currentPage - 1) * candidatesPerPage + 1}–
                  {Math.min(currentPage * candidatesPerPage, filtered.length)}{" "}
                  of {filtered.length} candidates
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════ JOBS GRID VIEW ═══════════════ */
  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#9c44fe]/10 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                Candidates
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Job count badge */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#111827"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
                </svg>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#111827" }}
                >
                  {jobs.length} Job{jobs.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <HistoryStatCard
              label="Total Jobs"
              value={totalJobs}
              icon={WorkIcon}
              color={HISTORY_CARD_COLORS.accent}
              delay={0}
            />
            <HistoryStatCard
              label="Pending Review"
              value={pendingJobs}
              icon={ErrorOutlineIcon}
              color={HISTORY_CARD_COLORS.amber}
              delay={0.1}
            />
            <HistoryStatCard
              label="Reviewed"
              value={reviewedJobs}
              icon={CheckCircleOutlineIcon}
              color={HISTORY_CARD_COLORS.green}
              delay={0.2}
            />
            <HistoryStatCard
              label="Total Openings"
              value={totalOpenings}
              icon={PeopleIcon}
              color={HISTORY_CARD_COLORS.blue}
              delay={0.3}
            />
          </div>

          {/* Search */}
          <div className="relative mt-4 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs by title, company, department…"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#9c44fe]/10 p-16 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${ACCENT}10` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill={ACCENT}
                viewBox="0 0 256 256"
              >
                <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {jobSearch ? "No Matching Jobs" : "No Jobs Posted Yet"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {jobSearch
                ? "Try a different search term."
                : "Post your first job to start receiving applications."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <RecruiterJobCard
                key={job._id}
                job={job}
                onViewApplicants={handleJobAction}
              />
            ))}
          </div>
        )}
      </div>

      <EditJobModal
        job={editingJob}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingJob(null);
        }}
        onUpdate={handleUpdateJob}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={() => jobToDelete && handleDelete(jobToDelete)}
        isDeleting={isDeleting}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CandidatesView;
