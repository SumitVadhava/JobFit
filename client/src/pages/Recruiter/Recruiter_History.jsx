import { useState, useEffect } from "react";
import {
  Eye,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Users,
  BookmarkIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  GraduationCap,
  Monitor,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";

// ─── Status Badge Component ─────────────────────────────────────────────────
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

// ─── Workplace Type Badge ────────────────────────────────────────────────────
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

// ─── Stat Card Component ─────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

// ─── Job Card Component ──────────────────────────────────────────────────────
const JobCard = ({ job, onViewDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Company Logo */}
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

            {/* Title & Company */}
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                {job.jobTitle}
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {job.companyName}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit?.(job)}
              className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-700 transition-colors"
              aria-label="Edit job"
              title="Edit job"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(job._id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Delete job"
              title="Delete job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges Row */}
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

      {/* Divider */}
      <div className="border-t border-gray-100 mx-5" />

      {/* Card Body - Details */}
      <div className="p-5 pt-4 space-y-3">
        {/* Info Grid */}
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
            <span>{job.openings || "N/A"} Openings</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
          {job.jobDescription}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onViewDetails?.(job)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
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
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
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
            <StatusBadge status={job.adminReview} />
            <WorkplaceBadge type={job.workPlaceType} />
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
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>OPENINGS</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {job.openings || "Not specified"}
              </p>
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

// ─── Edit Job Modal ────────────────────────────────────────────────────────────
const EditJobModal = ({ job, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        jobTitle: job.jobTitle || "",
        department: job.department || "",
        openings: job.openings || "",
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
      const payload = { ...formData, openings: Number(formData.openings) };
      const res = await api.put(`/jobs/${job._id}`, payload);
      onUpdate(res.data.job);
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Edit className="w-5 h-5 text-purple-600" />
            <span>Edit Job Posting</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <form id="edit-job-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Job Title</label>
              <input required name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Company Info</label>
              <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
              <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Openings</label>
              <input required type="number" name="openings" value={formData.openings} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Workplace Type</label>
              <select required name="workPlaceType" value={formData.workPlaceType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Experience</label>
              <select name="experience" value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="0-1 years">0-1 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="5-6 years">5-6 years</option>
                <option value="7-8 years">7-8 years</option>
                <option value="9-10 years">9-10 years</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Image URL</label>
              <input name="img" value={formData.img} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Job Description</label>
              <textarea required name="jobDescription" value={formData.jobDescription} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg min-h-[80px]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Responsibilities</label>
              <textarea required name="responsibilities" value={formData.responsibilities} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg min-h-[80px]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Qualifications</label>
              <textarea required name="qualifications" value={formData.qualifications} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg min-h-[80px]" />
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button form="edit-job-form" type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors min-w-[120px]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Empty State Component ──────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-5">
      <Briefcase className="w-10 h-10 text-purple-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs posted yet</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
      Start by creating your first job listing to find the perfect candidates.
    </p>
    <button className="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
      <Plus className="w-4 h-4" />
      <span>Post a Job</span>
    </button>
  </div>
);

// ─── Delete Confirmation Modal ─────────────────────────────────────────────
const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onCancel} />

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

// ─── Main Recruiter Panel Component ─────────────────────────────────────────
const Recruiter_History = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWorkplace, setFilterWorkplace] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // ✅ Get user from localStorage
        const userData = localStorage.getItem("user");
        if (!userData) {
          console.log("No user found");
          return;
        }

        const user = JSON.parse(userData);
        // Handle both _id and id properties depending on the user object shape
        const userId = user._id || user.id;

        if (!userId) {
          console.error("Could not find a valid user ID in:", user);
          setLoading(false);
          return;
        }

        // ✅ Get token
        const token = localStorage.getItem("token");

        // ✅ API call (Axios)
        // Since api.js defines baseURL as ".../api", we request "/jobs/..."
        const response = await api.get(`/jobs/recruiter/${userId}`);

        // ✅ Set real data
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || job.adminReview === filterStatus;

    const matchesWorkplace =
      filterWorkplace === "all" || job.workPlaceType === filterWorkplace;

    return matchesSearch && matchesStatus && matchesWorkplace;
  });

  // Stats
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter((j) => j.adminReview === "pending").length;
  const reviewedJobs = jobs.filter((j) => j.adminReview === "reviewed").length;
  const totalOpenings = jobs.reduce((sum, j) => sum + (j.openings || 0), 0);

  // Handlers
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditModalOpen(true);
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
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Stats Row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Briefcase className="w-6 h-6 text-purple-600" />}
            label="Total Jobs"
            value={totalJobs}
            accent="bg-purple-50"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6 text-amber-600" />}
            label="Pending Review"
            value={pendingJobs}
            accent="bg-amber-50"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            label="Reviewed"
            value={reviewedJobs}
            accent="bg-green-50"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            label="Total Openings"
            value={totalOpenings}
            accent="bg-blue-50"
          />
        </div>

        {/* ─── Search & Filter Bar ──────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${showFilters
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  REVIEW STATUS
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Workplace Filter */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  WORKPLACE TYPE
                </label>
                <select
                  value={filterWorkplace}
                  onChange={(e) => setFilterWorkplace(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              {/* Clear */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterWorkplace("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Results Count ────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredJobs.length}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{totalJobs}</span>{" "}
            jobs
          </p>
        </div>

        {/* ─── Loading State ────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading your jobs…</p>
          </div>
        )}

        {/* ─── Empty State ──────────────────────────────────────────── */}
        {!loading && filteredJobs.length === 0 && <EmptyState />}

        {/* ─── Job Cards Grid ───────────────────────────────────────── */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={openDeleteModal}
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

      <EditJobModal
        job={selectedJob}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdateJob}
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
