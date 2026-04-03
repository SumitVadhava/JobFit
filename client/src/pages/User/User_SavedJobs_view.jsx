import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api"; // Ensure this path is correct
import ButtonLogo from "../../assets/button_logo.png";
import { Briefcase } from "lucide-react";

// Helper functions for styling - Updated to handle lowercase backend data
const getWorkplaceConfig = (workplace) => {
  // Normalize string to handle "onsite", "On-site", "remote", etc.
  const normalized = workplace?.toLowerCase().replace('-', '') || "remote";

  const configs = {
    remote: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-blue-500">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        </svg>
      ),
      dot: "bg-green-500",
    },
    hybrid: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-purple-500">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM128,40a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V48A8,8,0,0,0,128,40Zm0,176a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V216A8,8,0,0,0,128,176Z" />
        </svg>
      ),
      dot: "bg-yellow-500",
    },
    onsite: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-green-500">
          <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
        </svg>
      ),
      dot: "bg-green-500",
    },
  };
  return configs[normalized] || configs.remote;
};

const getDepartmentColor = (department) => {
  const normalized = department?.toLowerCase() || "";
  if (normalized.includes("tech")) return "from-blue-500 to-blue-600";
  if (normalized.includes("data")) return "from-purple-500 to-purple-600";
  if (normalized.includes("product")) return "from-indigo-500 to-indigo-600";
  if (normalized.includes("design")) return "from-pink-500 to-pink-600";
  if (normalized.includes("market")) return "from-red-500 to-red-600";
  if (normalized.includes("financ")) return "from-green-500 to-green-600";
  if (normalized.includes("health")) return "from-teal-500 to-teal-600";
  return "from-gray-500 to-gray-600";
};

const getDepartmentBadge = (department) => {
  const normalized = department?.toLowerCase() || "";
  if (normalized.includes("tech")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (normalized.includes("data")) return "bg-purple-50 text-purple-700 border-purple-200";
  if (normalized.includes("product")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (normalized.includes("design")) return "bg-pink-50 text-pink-700 border-pink-200";
  if (normalized.includes("market")) return "bg-red-50 text-red-700 border-red-200";
  if (normalized.includes("financ")) return "bg-green-50 text-green-700 border-green-200";
  if (normalized.includes("health")) return "bg-teal-50 text-teal-700 border-teal-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "applied": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", label: "Applied", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg> };
    case "shortlisted": return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500", label: "Shortlisted", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> };
    case "hired": return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500", label: "Hired", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> };
    case "rejected": return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", label: "Rejected", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> };
    default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500", label: "Applied", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> };
  }
};

const SavedJobs = () => {
  const navigate = useNavigate();
  // --- STATE ---
  const [savedJobs, setSavedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Tracks initial fetch
  const [filters, setFilters] = useState({
    Location: [],
    Industry: [],
    "Experience Level": [],
    "Salary Range": [],
    Workplace: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applyingJobs, setApplyingJobs] = useState(new Set());
  const jobsPerPage = 3;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // --- FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const [response, appliedJobsResponse] = await Promise.all([
          api.get(`/candidate/saved-jobs`),
          api.get("/candidate/applied-jobs").catch(() => ({ data: { data: [] } }))
        ]);

        const apps = appliedJobsResponse.data.data || [];
        const appliedJobsMap = {};
        apps.forEach(app => {
          const jobId = app.jobId?._id || app.jobId || app._id;
          appliedJobsMap[jobId] = app.status || "applied";
        });
        setAppliedJobs(appliedJobsMap);

        // Data comes in response.data.data
        const savedJobsList = response.data.data || [];

        // If backend populates jobId, job.jobId is the job object.
        const mappedJobs = savedJobsList.map(job => {
          const jobData = typeof job.jobId === 'object' && job.jobId !== null ? job.jobId : job;
          return {
            ...jobData,
            _id: jobData._id || jobData.jobId,
            bookmarked: true
          };
        }).filter(item => item._id);

        setSavedJobs(mappedJobs);

        const initialBookmarks = mappedJobs.reduce((acc, job) => {
          acc[job._id] = true;
          return acc;
        }, {});
        setBookmarkedJobs(initialBookmarks);

      } catch (error) {
        if (error.response && error.response.status === 404) {
          // If 404, it means no saved jobs were found for this user
          setSavedJobs([]);
          setBookmarkedJobs({});
        } else {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to load saved jobs.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty array ensures this runs only once when the page loads

  const handleApplyJob = async (jobId) => {
    try {
      setApplyingJobs(prev => new Set([...prev, jobId]));

      const profileRes = await api.get("/candidate/profile").catch(() => null);
      const profile = profileRes?.data?.data || profileRes?.data?.profile;

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      const isComplete = profile &&
        (profile.name || profile.userName || user?.userName || user?.name) &&
        (profile.email || user?.email) &&
        profile.img &&
        (profile.resumeLink || profile.resumelink) &&
        profile.description &&
        profile.experience &&
        profile.education && profile.education.length > 0 &&
        profile.skills && profile.skills.length > 0 &&
        profile.softSkills && profile.softSkills.length > 0;

      if (!isComplete) {
        toast.error(
          "Please fill all details in profile",
          { position: "top-center", autoClose: 3000 }
        );
        setApplyingJobs(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        setTimeout(() => {
          navigate("/user/profile");
        }, 1500);
        return;
      }

      await api.post(`/candidate/job/apply`, { jobId });

      setAppliedJobs(prev => ({ ...prev, [jobId]: "applied" }));
      toast.success("Applied for job successfully!", { position: "top-center", autoClose: 2000 });

    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("You have already applied for this job.", { position: "top-center", autoClose: 2000 });
        setAppliedJobs(prev => ({ ...prev, [jobId]: "applied" }));
      } else {
        toast.error("Failed to apply for job. Please try again.", { position: "top-center", autoClose: 2000 });
      }
    } finally {
      setApplyingJobs(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  // --- HANDLERS ---
  const handleBookMarkClick = async (jobId) => {
    const jobToUpdate = savedJobs.find((job) => job._id === jobId);
    if (!jobToUpdate) return;

    // Optimistic UI Update — remove from list immediately
    setBookmarkedJobs((prev) => ({
      ...prev,
      [jobId]: false,
    }));
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

    try {
      // Persist to backend using DELETE /api/jobs/:id/unsave
      await api.patch(`/candidate/saved-jobs/${jobId}`, { saved: false });

      toast.success("Job removed from saved jobs", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating bookmark:", error);
      // Revert on error — add job back
      setBookmarkedJobs((prev) => ({
        ...prev,
        [jobId]: true,
      }));
      setSavedJobs((prevJobs) => [...prevJobs, jobToUpdate]);
      toast.error("Failed to remove job from saved", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const removeFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== option),
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      Location: [],
      Industry: [],
      "Experience Level": [],
      "Salary Range": [],
      Workplace: [],
    });
    setCurrentPage(1);
  };

  // --- FILTERING LOGIC ---
  const filteredJobs = savedJobs.filter((job) => {
    return (
      (filters.Location.length === 0 || filters.Location.includes(job.location)) &&
      (filters.Industry.length === 0 || filters.Industry.includes(job.department)) &&
      (filters["Experience Level"].length === 0 || filters["Experience Level"].includes(job.experience)) &&
      // Fallback to empty string for salary if it doesn't exist in the DB
      (filters["Salary Range"].length === 0 || filters["Salary Range"].includes(job.salary || "")) &&
      // Handle case sensitivity for workplace type (e.g. "onsite" vs "On-site")
      (filters.Workplace.length === 0 || filters.Workplace.some(w => w.toLowerCase().replace('-', '') === job.workPlaceType?.toLowerCase().replace('-', '')))
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
              <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-lg mb-6"></div>

              {/* Filter Skeleton Tags */}
              <div className="flex gap-2 mb-6">
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>

              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative bg-white rounded-3xl border border-gray-100 p-5">
                  <div className="flex gap-5">
                    <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-2xl shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="flex gap-2">
                        <div className="w-20 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="w-20 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="w-24 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="w-full h-4 bg-gray-200 animate-pulse rounded-md"></div>
                    <div className="w-5/6 h-4 bg-gray-200 animate-pulse rounded-md"></div>
                  </div>
                  <div className="mt-6 flex justify-between items-center pt-5 border-t border-gray-100">
                    <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md"></div>
                    <div className="flex gap-3">
                      <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-xl"></div>
                      <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Saved Jobs</h2>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(filters).flatMap(([category, options]) =>
                options.map((option) => (
                  <div key={`${category}-${option}`} className="flex items-center bg-gray-200 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full">
                    <span>{option}</span>
                    <button onClick={() => removeFilter(category, option)} className="ml-2 text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Empty State */}
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
                  No bookmarked jobs found
                </h3>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  You haven't explicitly saved any jobs yet. Browse around and click the bookmark icon to save jobs here!
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M197.67,186.37a8,8,0,0,1,0,11.29C196.58,198.73,170.82,224,128,224c-37.39,0-64.53-22.4-80-39.85V208a8,8,0,0,1-16,0V160a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H55.44C67.76,183.35,93,208,128,208c36,0,58.14-21.46,58.36-21.68A8,8,0,0,1,197.67,186.37ZM216,40a8,8,0,0,0-8,8V72.05C194.55,55.47,167.4,32,128,32,85.18,32,59.42,57.27,58.34,58.34a8,8,0,0,0,11.3,11.34C69.86,69.46,92,48,128,48c35,0,60.24,24.65,72.56,40H168a8,8,0,0,0,0,16h48a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Z" />
                  </svg>
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedJobs.map((job, index) => {
                  const workplaceConfig = getWorkplaceConfig(job.workPlaceType);
                  const isExpanded = expandedJob === job._id;
                  const isHovered = hoveredJob === job._id;
                  const isBookmarked = bookmarkedJobs[job._id];

                  return (
                    <div
                      key={job._id}
                      className="group relative bg-white rounded-3xl border border-gray-300 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-400"
                      onMouseEnter={() => setHoveredJob(job._id)}
                      onMouseLeave={() => setHoveredJob(null)}
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >


                      <div className="p-4 sm:p-5">
                        {/* ── Status row if applied ── */}
                        {appliedJobs[job._id] && (
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusConfig(appliedJobs[job._id]).bg} ${getStatusConfig(appliedJobs[job._id]).text} ${getStatusConfig(appliedJobs[job._id]).border}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(appliedJobs[job._id]).dot}`}
                              />
                              {getStatusConfig(appliedJobs[job._id]).label}
                            </span>
                          </div>
                        )}

                        {/* Header: Logo + Info + Bookmark */}
                        <div className="flex gap-4 sm:gap-5">
                          {/* Company Logo - SMALLER */}
                          <div className="shrink-0">
                            <div
                              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-500 ${isHovered
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
                                  e.target.parentElement.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${getDepartmentColor(
                                    job.department
                                  )} text-white font-bold text-2xl sm:text-3xl">
                                                          ${job.companyName.charAt(0)}
                                                        </div>`;
                                }}
                              />
                              {/* Status dot */}
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
                                  className={`text-lg sm:text-xl font-bold text-gray-900 truncate transition-colors duration-300 ${isHovered ? "text-blue-700" : ""
                                    }`}
                                >
                                  {job.jobTitle}
                                </h3>

                                {/* Company & Location */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                                    {job.companyName}
                                  </span>
                                  <span className="hidden sm:inline text-gray-300 text-lg">
                                    ·
                                  </span>
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
                                  {/* Workplace Badge */}
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${workplaceConfig.bg} ${workplaceConfig.text} ${workplaceConfig.border}`}
                                  >
                                    {workplaceConfig.icon}
                                    {job.workPlaceType}
                                  </span>

                                  {/* Experience Badge */}
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">

                                    <Briefcase size={15} />
                                    {job.experience}
                                  </span>

                                  {/* Department Badge */}
                                  <span
                                    className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${getDepartmentBadge(
                                      job.department
                                    )}`}
                                  >
                                    {job.department}
                                  </span>
                                </div>
                              </div>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => handleBookMarkClick(job._id)}
                                className={`shrink-0 p-3 rounded-2xl transition-all duration-300 ${isBookmarked
                                    ? "text-blue-600 bg-blue-50 shadow-md shadow-blue-100 hover:bg-blue-100 scale-110"
                                    : "text-gray-300 hover:text-gray-500 hover:bg-gray-50"
                                  }`}
                                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 256 256"
                                  fill="currentColor"
                                  className={`transition-transform duration-300 ${isBookmarked ? "scale-110" : ""}`}
                                >
                                  {isBookmarked ? (
                                    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z" />
                                  ) : (
                                    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z" />
                                  )}
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-5">
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {job.jobDescription}
                          </p>
                        </div>

                        {/* Expandable Details */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded
                            ? "max-h-[600px] opacity-100 mt-6"
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
                                  {job.responsibilities}
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
                                  {job.qualifications}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-3">
                            {/* Apply Button */}
                            <button
                              onClick={() => {
                                if (!appliedJobs[job._id] && !applyingJobs.has(job._id)) {
                                  handleApplyJob(job._id);
                                }
                              }}
                              disabled={!!appliedJobs[job._id] || applyingJobs.has(job._id)}
                              className={`group/btn relative inline-flex items-center gap-2.5 text-sm font-semibold px-7 py-3 rounded-2xl transition-all duration-300 shadow-md active:scale-[0.97]
                              ${!appliedJobs[job._id]
                                  ? "bg-gray-900 hover:bg-gray-800 text-white hover:shadow-xl hover:shadow-gray-900/25"
                                  : appliedJobs[job._id] === "rejected"
                                    ? "bg-red-600 text-white cursor-not-allowed hover:shadow-none shadow-none"
                                    : appliedJobs[job._id] === "shortlisted"
                                      ? "bg-purple-600 text-white cursor-not-allowed hover:shadow-none shadow-none"
                                      : appliedJobs[job._id] === "hired"
                                        ? "bg-green-600 text-white cursor-not-allowed hover:shadow-none shadow-none"
                                        : "bg-blue-600 text-white cursor-not-allowed hover:shadow-none shadow-none"
                                }
                              ${applyingJobs.has(job._id) ? "opacity-75 cursor-wait" : ""}
                            `}
                            >
                              {applyingJobs.has(job._id) ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Applying...
                                </>
                              ) : appliedJobs[job._id] ? (
                                <>
                                  {getStatusConfig(appliedJobs[job._id]).icon}
                                  <span className="capitalize">{appliedJobs[job._id]}</span>
                                </>
                              ) : (
                                <>
                                  <img src={ButtonLogo} className="w-6 group-hover/btn:-translate-y-0.5 transition-transform duration-300" alt="" />
                                  Apply Now
                                </>
                              )}
                            </button>

                            {/* View Details Toggle */}
                            <button
                              onClick={() =>
                                setExpandedJob(isExpanded ? null : job._id)
                              }
                              className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-2xl border transition-all duration-300 ${isExpanded
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
                                className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""
                                  }`}
                              >
                                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                              </svg>
                              {isExpanded ? "Show Less" : "View Details"}
                            </button>
                          </div>

                        </div>
                      </div>        </div>
                  );
                })}
              </div>
            )}


            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-blue-200 text-gray-900" : "bg-gray-200 text-gray-600 hover:bg-blue-100"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;