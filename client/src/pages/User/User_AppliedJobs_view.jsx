import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import ButtonLogo from "../../assets/button_logo.png";
import { Briefcase } from "lucide-react";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ Status: [] });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const jobsPerPage = 5;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const [savedJobsResponse, appliedJobsResponse] = await Promise.all([
          api.get("/user/savedJobs").catch(() => ({ data: { savedJobs: [] } })),
          api
            .get("/user/applied-companies")
            .catch(() => ({ data: { applications: [], appliedJobs: [] } })),
        ]);

        const savedJobsIds = new Set(
          (savedJobsResponse.data.savedJobs || []).map((saved) => saved.jobId)
        );

        const apps =
          appliedJobsResponse.data.applications ||
          appliedJobsResponse.data.appliedJobs ||
          [];

        const formattedJobs = apps.map((app) => {
          const jobData =
            app.jobId && typeof app.jobId === "object" ? app.jobId : app;
          return {
            ...jobData,
            _id: jobData._id || app._id,
            jobTitle: jobData.jobTitle || app.jobTitle,
            companyName: jobData.companyName || app.companyName,
            location: jobData.location || app.location,
            department: jobData.department || app.department || "",
            experience: jobData.experience || app.experience || "",
            workPlaceType:
              jobData.workPlaceType === "onsite"
                ? "On-site"
                : jobData.workPlaceType === "remote"
                ? "Remote"
                : jobData.workPlaceType === "hybrid"
                ? "Hybrid"
                : jobData.workPlaceType || "",
            jobDescription:
              jobData.jobDescription || app.jobDescription || "",
            responsibilities:
              jobData.responsibilities || app.responsibilities || "",
            qualifications: jobData.qualifications || app.qualifications || "",
            img:
              jobData.img ||
              app.img ||
              "https://via.placeholder.com/150?text=Company+Logo",
            bookmarked: savedJobsIds.has(jobData._id || app._id),
            applicationStatus: app.status || "applied",
            appliedAt: app.appliedAt || app.createdAt,
          };
        });

        setJobs(formattedJobs);

        const initialBookmarks = {};
        formattedJobs.forEach((job) => {
          initialBookmarks[job._id] = job.bookmarked;
        });
        setBookmarkedJobs(initialBookmarks);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ─── Helper: workplace badge config ─── */
  const getWorkplaceConfig = (type) => {
    switch (type) {
      case "Remote":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.56,87.56,0,0,1-7.47,35.63L181.71,139.2a16,16,0,0,0-9.19-9.19L148.24,117.5a16,16,0,0,0-13.31.52L120,126.83V112a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v16a16,16,0,0,0,16,16h16v24a16,16,0,0,0,7.12,13.31l28.56,19A16,16,0,0,0,148.84,184l13.71-10.28A87.58,87.58,0,0,1,128,216,88,88,0,1,1,216,128Z" />
            </svg>
          ),
        };
      case "Hybrid":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32l-64,44.8A16,16,0,0,0,48,76.39V208H32a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM64,76.39,128,32V208H64ZM88,112a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,48a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,160Z" />
            </svg>
          ),
        };
      case "On-site":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500",
          icon: null,
        };
    }
  };

  /* ─── Helper: department gradient (for logo fallback) ─── */
  const getDepartmentColor = (dept) => {
    const colors = {
      Product: "from-violet-500 to-purple-600",
      Engineering: "from-blue-500 to-indigo-600",
      Analytics: "from-cyan-500 to-blue-600",
      Design: "from-pink-500 to-rose-600",
      Marketing: "from-green-500 to-emerald-600",
      "Human Resources": "from-yellow-500 to-amber-600",
      Finance: "from-green-500 to-teal-600",
      Operations: "from-orange-500 to-amber-600",
    };
    return colors[dept] || "from-gray-500 to-gray-600";
  };

  /* ─── Helper: department badge colors ─── */
  const getDepartmentBadge = (dept) => {
    const badges = {
      Product: "bg-violet-100 text-violet-700 border-violet-200",
      Engineering: "bg-blue-100 text-blue-700 border-blue-200",
      Analytics: "bg-cyan-100 text-cyan-700 border-cyan-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
      Marketing: "bg-green-100 text-green-700 border-green-200",
      "Human Resources": "bg-yellow-100 text-yellow-700 border-yellow-200",
      Finance: "bg-green-100 text-green-700 border-green-200",
      Operations: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return badges[dept] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  /* ─── Helper: application status badge ─── */
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "shortlisted":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
          label: "Shortlisted",
        };
      case "accepted":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          dot: "bg-green-500",
          label: "Accepted",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500",
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          dot: "bg-purple-500",
          label: "Applied",
        };
    }
  };

  /* ─── Bookmark handler ─── */
  const handleBookMarkClick = async (jobId) => {
    const jobToUpdate = jobs.find((job) => job._id === jobId);
    if (!jobToUpdate) return;

    const newBookmarkState = !bookmarkedJobs[jobId];

    setBookmarkedJobs((prev) => ({ ...prev, [jobId]: newBookmarkState }));
    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId ? { ...job, bookmarked: newBookmarkState } : job
      )
    );

    try {
      if (newBookmarkState) {
        await api.post(`/jobs/${jobId}/save`);
      } else {
        await api.delete(`/jobs/${jobId}/unsave`);
      }
      toast.success(
        newBookmarkState ? "Job saved successfully!" : "Job removed from saved",
        { position: "top-center", autoClose: 2000 }
      );
    } catch (err) {
      console.error("Error updating bookmark:", err);
      setBookmarkedJobs((prev) => ({ ...prev, [jobId]: !newBookmarkState }));
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, bookmarked: !newBookmarkState } : job
        )
      );
      toast.error("Failed to update bookmark status", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  /* ─── Filter handlers ─── */
  const handleFilterChange = (category, option) => {
    setFilters((prev) => {
      const updated = prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option];
      return { ...prev, [category]: updated };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ Status: [] });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const removeFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== option),
    }));
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).flat().length;

  const filterOptions = {
    Status: ["applied", "shortlisted", "rejected", "accepted"],
  };

  /* ─── Filtering & pagination ─── */
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      (job.jobTitle || "").toLowerCase().includes(q) ||
      (job.companyName || "").toLowerCase().includes(q) ||
      (job.department || "").toLowerCase().includes(q) ||
      (job.location || "").toLowerCase().includes(q);

    return (
      matchesSearch &&
      (filters.Status.length === 0 ||
        filters.Status.includes(job.applicationStatus?.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  /* ─── Error / Loading states ─── */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 border-4 rounded-full animate-spin"
            style={{ borderColor: "#f3e8ff", borderTopColor: "#9c44fe" }}
          />
          <p className="text-base font-medium text-gray-400 animate-pulse">
            Loading your applied jobs...
          </p>
        </div>
      </div>
    );
  }

  /* ─── Main render ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-['Inter',sans-serif]">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Applied Jobs
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "application" : "applications"}{" "}
                found
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-96">
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
                placeholder="Search jobs, companies, locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
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

      {/* ── Body: Sidebar + Main ── */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">

        {/* ── Filter Sidebar ── */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-gray-700"
                    >
                      <path d="M200,136a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H192A8,8,0,0,1,200,136Zm32-56H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Zm-80,96H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Filters
                    </h2>
                    {activeFilterCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  <button
                    className="lg:hidden text-sm text-blue-600 font-medium hover:text-blue-700"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    {isFilterOpen ? "Hide" : "Show"}
                  </button>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                    Clear all filters
                  </button>
                )}
              </div>

              <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
                <div className="p-5 space-y-6">
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-500">
                          {/* Status icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                          </svg>
                        </span>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          {category}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={filters[category].includes(option)}
                                onChange={() =>
                                  handleFilterChange(category, option)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                {filters[category].includes(option) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="white"
                                    viewBox="0 0 256 256"
                                  >
                                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors capitalize">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">
          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(filters).flatMap(([category, options]) =>
                options.map((option) => (
                  <button
                    key={`${category}-${option}`}
                    onClick={() => removeFilter(category, option)}
                    className="group flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium pl-3 pr-2 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <span className="capitalize">{option}</span>
                    <svg
                      className="text-blue-400 group-hover:text-blue-600 transition-colors"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ── Job Cards ── */}
          {paginatedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="text-gray-400 -rotate-6"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No applications found
              </h3>
              <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                {jobs.length === 0
                  ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                  : "No applications match your current filters. Try removing some filters."}
              </p>
              {jobs.length === 0 ? (
                <button
                  onClick={() => navigate("/user/job-search")}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  Browse Jobs
                </button>
              ) : (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedJobs.map((job, index) => {
                const workplaceConfig = getWorkplaceConfig(job.workPlaceType);
                const statusConfig = getStatusConfig(job.applicationStatus);
                const isExpanded = expandedJob === job._id;
                const isHovered = hoveredJob === job._id;
                const isBookmarked = bookmarkedJobs[job._id];

                return (
                  <div
                    key={job._id}
                    className="group relative bg-white rounded-3xl border border-gray-300 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-400"
                    onMouseEnter={() => setHoveredJob(job._id)}
                    onMouseLeave={() => setHoveredJob(null)}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="p-4 sm:p-5">

                      {/* ── Status + Date row ── */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                          />
                          {statusConfig.label}
                        </span>
                        {job.appliedAt && (
                          <span className="text-xs text-gray-400 font-medium">
                            Applied{" "}
                            {new Date(job.appliedAt).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            )}
                          </span>
                        )}
                      </div>

                      {/* ── Header: Logo + Info + Bookmark ── */}
                      <div className="flex gap-4 sm:gap-5">

                        {/* Company Logo */}
                        <div className="shrink-0">
                          <div
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                              isHovered
                                ? "border-gray-200 shadow-xl scale-105 rotate-1"
                                : "border-gray-100 shadow-md"
                            }`}
                          >
                            <img
                              src={job.img}
                              alt={job.companyName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${getDepartmentColor(
                                  job.department
                                )} text-white font-bold text-2xl sm:text-3xl">${(
                                  job.companyName || "?"
                                ).charAt(0)}</div>`;
                              }}
                            />
                            {/* Workplace dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <div
                                className={`w-3 h-3 rounded-full ${workplaceConfig.dot}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">

                              {/* Job Title */}
                              <h3
                                className={`text-lg sm:text-xl font-bold text-gray-900 truncate transition-colors duration-300 ${
                                  isHovered ? "text-blue-700" : ""
                                }`}
                              >
                                {job.jobTitle}
                              </h3>

                              {/* Company & Location */}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                <span className="text-sm sm:text-base font-semibold text-gray-700">
                                  {job.companyName}
                                </span>
                                <span className="hidden sm:inline text-gray-300 text-lg">·</span>
                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
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
                                {/* Workplace */}
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${workplaceConfig.bg} ${workplaceConfig.text} ${workplaceConfig.border}`}
                                >
                                  {workplaceConfig.icon}
                                  {job.workPlaceType}
                                </span>

                                {/* Experience */}
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                                  <Briefcase size={13} />
                                  {job.experience || "Not specified"}
                                </span>

                                {/* Department */}
                                {job.department && (
                                  <span
                                    className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${getDepartmentBadge(
                                      job.department
                                    )}`}
                                  >
                                    {job.department}
                                  </span>
                                )}
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>

                      {/* ── Job Description preview ── */}
                      <div className="mt-5">
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                          {job.jobDescription}
                        </p>
                      </div>

                      {/* ── Expandable Details ── */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          isExpanded
                            ? "max-h-[700px] opacity-100 mt-6"
                            : "max-h-0 opacity-0 mt-0"
                        }`}
                      >
                        <div className="border-t border-dashed border-gray-200 pt-6 space-y-5">

                          {/* Responsibilities */}
                          <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="text-blue-600"
                              >
                                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">
                                Responsibilities
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {job.responsibilities || "No responsibilities listed"}
                              </p>
                            </div>
                          </div>

                          {/* Qualifications */}
                          <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="text-purple-600"
                              >
                                <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.74,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.27l76.24,40.66a8,8,0,0,0,7.52,0L176,143.79v46.89C166.4,196,149.85,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM128,165.06,20.36,107.6V96l107.64,57.4a8,8,0,0,0,7.52,0L243.64,96v11.6Z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">
                                Qualifications
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {job.qualifications || "No qualifications listed"}
                              </p>
                            </div>
                          </div>

                          {/* Applied At */}
                          {job.appliedAt && (
                            <div className="flex gap-4">
                              <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="text-green-600"
                                >
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-120.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,138.34l42.34-42.35A8,8,0,0,1,173.66,107.31Z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">
                                  Application Date
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Applied on{" "}
                                  <span className="font-semibold text-gray-900">
                                    {new Date(job.appliedAt).toLocaleDateString(
                                      "en-IN",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Actions Row ── */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          {/* View Details Toggle */}
                          <button
                            onClick={() =>
                              setExpandedJob(isExpanded ? null : job._id)
                            }
                            className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-2xl border transition-all duration-300 ${
                              isExpanded
                                ? "text-blue-700 bg-blue-50 border-blue-200 shadow-sm shadow-blue-100"
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
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                        : "text-gray-500 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

          {filteredJobs.length > 0 && (
            <p className="text-center text-xs text-gray-400 mt-4 mb-8">
              Showing {(currentPage - 1) * jobsPerPage + 1}–
              {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length} applications
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AppliedJobs;