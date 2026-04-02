import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { RecruiterSkeletonPostedJobsPage } from "../../components/recruiter/RecruiterSkeletons";

const Recruiter_Posted_Jobs_view = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/recruiter/jobs");
      setJobs(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load posted jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/recruiter/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      setDeleteConfirm(null);
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const getWorkplaceLabel = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "remote":
        return "Remote";
      case "onsite":
        return "On-site";
      case "hybrid":
        return "Hybrid";
      default:
        return type;
    }
  };

  const getWorkplaceConfig = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "remote":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "hybrid":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
        };
      case "onsite":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500",
        };
    }
  };

  const getDepartmentGradient = (dept) => {
    const d = dept?.toLowerCase() || "";
    if (d.includes("tech") || d.includes("engineer"))
      return "from-blue-500 to-indigo-600";
    if (d.includes("data") || d.includes("analyt"))
      return "from-cyan-500 to-blue-600";
    if (d.includes("product")) return "from-violet-500 to-purple-600";
    if (d.includes("design")) return "from-pink-500 to-rose-600";
    if (d.includes("market")) return "from-green-500 to-emerald-600";
    if (d.includes("financ")) return "from-teal-500 to-green-600";
    if (d.includes("health")) return "from-red-500 to-orange-600";
    if (d.includes("human") || d.includes("hr"))
      return "from-yellow-500 to-amber-600";
    return "from-gray-500 to-gray-600";
  };

  const getDepartmentBadge = (dept) => {
    const d = dept?.toLowerCase() || "";
    if (d.includes("tech") || d.includes("engineer"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (d.includes("data") || d.includes("analyt"))
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    if (d.includes("product"))
      return "bg-violet-50 text-violet-700 border-violet-200";
    if (d.includes("design"))
      return "bg-pink-50 text-pink-700 border-pink-200";
    if (d.includes("market"))
      return "bg-green-50 text-green-700 border-green-200";
    if (d.includes("financ"))
      return "bg-teal-50 text-teal-700 border-teal-200";
    if (d.includes("health"))
      return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.jobTitle?.toLowerCase().includes(q) ||
      job.companyName?.toLowerCase().includes(q) ||
      job.department?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <RecruiterSkeletonPostedJobsPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Posted Jobs
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} posted
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
              <input
                type="text"
                placeholder="Search posted jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Jobs",
              value: jobs.length,
              color: "from-purple-500 to-indigo-600",
              bg: "bg-purple-50",
            },
            {
              label: "Remote",
              value: jobs.filter(
                (j) => String(j.workPlaceType || "").toLowerCase() === "remote",
              ).length,
              color: "from-emerald-500 to-green-600",
              bg: "bg-emerald-50",
            },
            {
              label: "On-site",
              value: jobs.filter(
                (j) => String(j.workPlaceType || "").toLowerCase() === "onsite",
              ).length,
              color: "from-blue-500 to-indigo-600",
              bg: "bg-blue-50",
            },
            {
              label: "Hybrid",
              value: jobs.filter(
                (j) => String(j.workPlaceType || "").toLowerCase() === "hybrid",
              ).length,
              color: "from-amber-500 to-orange-600",
              bg: "bg-amber-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-4 border border-gray-100`}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className={`text-2xl font-bold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="text-purple-400 -rotate-6"
              >
                <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery ? "No matching jobs" : "No jobs posted yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Try adjusting your search query."
                : "Start posting jobs to see them listed here."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredJobs.map((job, index) => {
              const workplaceConfig = getWorkplaceConfig(job.workPlaceType);
              const isExpanded = expandedJob === job._id;
              const isHovered = hoveredJob === job._id;

              return (
                <div
                  key={job._id}
                  className="group bg-white rounded-3xl border border-gray-300 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-400"
                  onMouseEnter={() => setHoveredJob(job._id)}
                  onMouseLeave={() => setHoveredJob(null)}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="p-6 sm:p-7">
                    {/* Header Row */}
                    <div className="flex gap-4 sm:gap-5">
                      {/* Logo */}
                      <div className="shrink-0">
                        <div
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                            isHovered
                              ? "border-gray-200 shadow-lg scale-105"
                              : "border-gray-100 shadow-md"
                          }`}
                        >
                          {job.img ? (
                            <img
                              src={job.img}
                              alt={job.companyName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${getDepartmentGradient(
                                    job.department
                                  )} text-white font-bold text-xl sm:text-2xl">
                                    ${job.companyName?.charAt(0) || "J"}
                                  </div>`;
                              }}
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getDepartmentGradient(
                                job.department
                              )} text-white font-bold text-xl sm:text-2xl`}
                            >
                              {job.companyName?.charAt(0) || "J"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`text-lg sm:text-xl font-bold text-gray-900 truncate transition-colors duration-300 ${
                                isHovered ? "text-purple-700" : ""
                              }`}
                            >
                              {job.jobTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                              <span className="text-sm font-semibold text-gray-700">
                                {job.companyName}
                              </span>
                              <span className="hidden sm:inline text-gray-300">
                                ·
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="text-gray-400"
                                >
                                  <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                                </svg>
                                {job.location}
                              </span>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${workplaceConfig.bg} ${workplaceConfig.text} ${workplaceConfig.border}`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${workplaceConfig.dot}`}
                                />
                                {getWorkplaceLabel(job.workPlaceType)}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="text-gray-400"
                                >
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                                </svg>
                                {job.experience}
                              </span>
                              <span
                                className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${getDepartmentBadge(
                                  job.department
                                )}`}
                              >
                                {job.department}
                              </span>
                              {job.bookmarked && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                  >
                                    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z" />
                                  </svg>
                                  Saved
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="shrink-0 flex items-center gap-2">
                            {deleteConfirm === job._id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(job._id)}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                title="Delete job"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                >
                                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description preview */}
                    <div className="mt-4 ml-[80px] sm:ml-[100px]">
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {job.jobDescription}
                      </p>
                    </div>

                    {/* Expandable Details */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ml-[80px] sm:ml-[100px] ${
                        isExpanded
                          ? "max-h-[600px] opacity-100 mt-5"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <div className="border-t border-dashed border-gray-200 pt-5 space-y-4">
                        {/* Responsibilities */}
                        <div className="flex gap-3">
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="text-blue-600"
                            >
                              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5">
                              Responsibilities
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {job.responsibilities}
                            </p>
                          </div>
                        </div>

                        {/* Qualifications */}
                        <div className="flex gap-3">
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="text-purple-600"
                            >
                              <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.74,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.27l76.24,40.66a8,8,0,0,0,7.52,0L176,143.79v46.89C166.4,196,149.85,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM128,165.06,20.36,107.6V96l107.64,57.4a8,8,0,0,0,7.52,0L243.64,96v11.6Z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5">
                              Qualifications
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {job.qualifications}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-5 ml-[80px] sm:ml-[100px]">
                      <button
                        onClick={() =>
                          setExpandedJob(isExpanded ? null : job._id)
                        }
                        className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border transition-all duration-300 ${
                          isExpanded
                            ? "text-purple-700 bg-purple-50 border-purple-200 shadow-sm"
                            : "text-gray-600 bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className={`transition-transform duration-500 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                        </svg>
                        {isExpanded ? "Show Less" : "View Details"}
                      </button>

                      <span className="hidden sm:inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="text-gray-300"
                        >
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                        </svg>
                        Posted recently
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruiter_Posted_Jobs_view;
