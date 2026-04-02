import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import WorkIcon from "@mui/icons-material/Work";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PeopleIcon from "@mui/icons-material/People";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* ── Recruiter Components ── */
import {
  ACCENT,
  HISTORY_CARD_COLORS,
  byPrefixAndName,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "../../components/recruiter/RecruiterConstants";
import { RecruiterStatCard, RecruiterHistoryStatCard } from "../../components/recruiter/RecruiterStatCard";
import RecruiterJobCard from "../../components/recruiter/RecruiterJobCard";
import RecruiterEditJobModal from "../../components/recruiter/RecruiterEditJobModal";
import RecruiterDeleteConfirmModal from "../../components/recruiter/RecruiterDeleteConfirmModal";
import RecruiterConfirmActionModal from "../../components/recruiter/RecruiterConfirmActionModal";
import RecruiterCandidateCard from "../../components/recruiter/RecruiterCandidateCard";
import RecruiterPagination from "../../components/recruiter/RecruiterPagination";
import {
  RecruiterSkeletonCandidatesPage,
  RecruiterSkeletonCandidateCard,
} from "../../components/recruiter/RecruiterSkeletons";

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

  /* ── Filter Jobs (exclude fully filled — those belong in History) ── */
  const activeJobs = jobs.filter((j) => Number(j.openings) !== 0);

  const filteredJobs = activeJobs.filter(
    (j) =>
      jobSearch === "" ||
      j.jobTitle?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.department?.toLowerCase().includes(jobSearch.toLowerCase()),
  );

  const totalJobs = activeJobs.length;
  const pendingJobs = activeJobs.filter((j) => j.adminReview === "pending").length;
  const reviewedJobs = activeJobs.filter((j) => j.adminReview === "reviewed").length;
  const totalOpenings = activeJobs.reduce(
    (sum, j) => sum + (Number(j.openings) || 0),
    0,
  );

  /* ═══════════════ LOADING ═══════════════ */
  if (loading) {
    return <RecruiterSkeletonCandidatesPage />;
  }

  /* ═══════════════ CANDIDATES VIEW ═══════════════ */
  if (selectedJob) {
    return (
      <div className="min-h-screen bg-white">
        <ToastContainer />

        {/* ── Confirm Action Modal ── */}
        <RecruiterConfirmActionModal
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
              <RecruiterStatCard
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
              <RecruiterStatCard
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
              <RecruiterStatCard
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
              <RecruiterStatCard
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
            <div className="grid grid-cols-1 gap-4">
              <RecruiterSkeletonCandidateCard />
              <RecruiterSkeletonCandidateCard />
              <RecruiterSkeletonCandidateCard />
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
                {paginated.map((c, i) => (
                  <RecruiterCandidateCard
                    key={c._id || i}
                    candidate={c}
                    index={i}
                    isExpanded={expandedCandidate === c._id}
                    onToggleExpand={() =>
                      setExpandedCandidate(
                        expandedCandidate === c._id ? null : c._id,
                      )
                    }
                    onViewResume={handleViewResume}
                    onAction={openConfirmModal}
                    actionLoadingKey={actionLoadingKey}
                  />
                ))}
              </div>

              <RecruiterPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={candidatesPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════ JOBS GRID VIEW ═══════════════ */
  return (
    <div className="min-h-screen bg-white">
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
            <RecruiterHistoryStatCard
              label="Total Jobs"
              value={totalJobs}
              icon={WorkIcon}
              color={HISTORY_CARD_COLORS.accent}
              delay={0}
            />
            <RecruiterHistoryStatCard
              label="Pending Review"
              value={pendingJobs}
              icon={ErrorOutlineIcon}
              color={HISTORY_CARD_COLORS.amber}
              delay={0.1}
            />
            <RecruiterHistoryStatCard
              label="Reviewed"
              value={reviewedJobs}
              icon={CheckCircleOutlineIcon}
              color={HISTORY_CARD_COLORS.green}
              delay={0.2}
            />
            <RecruiterHistoryStatCard
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

      <RecruiterEditJobModal
        job={editingJob}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingJob(null);
        }}
        onUpdate={handleUpdateJob}
      />

      <RecruiterDeleteConfirmModal
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
