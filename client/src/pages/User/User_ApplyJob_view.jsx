import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContexts";
import ButtonLogo from "../../assets/button_logo.png";
import Skeleton from "../../components/Skeleton";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${jobId}`);
        console.log(response.data);

        setJob(response.data.job);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    const checkStatus = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}/application-status`);
        if (res.data.applied) setHasApplied(true);
      } catch { /* endpoint may not exist */ }
    };
    fetchJob();
    checkStatus();
  }, [jobId]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };
  const validateAndSetFile = (file) => {
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOC, or DOCX file.", { position: "top-center", autoClose: 3000 });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.", { position: "top-center", autoClose: 3000 });
      return;
    }
    setResumeFile(file);
  };
  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (resumeFile) formData.append("resume", resumeFile);
      await api.post(`/jobs/${jobId}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHasApplied(true);
      toast.success("Application submitted successfully!", { position: "top-center", autoClose: 2000 });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit application.";
      if (msg.toLowerCase().includes("already")) {
        setHasApplied(true);
        toast.info("You have already applied for this job.", { position: "top-center", autoClose: 2000 });
      } else {
        toast.error(msg, { position: "top-center", autoClose: 3000 });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getWorkplaceLabel = (type) => {
    if (!type) return type;
    switch (type.toLowerCase()) {
      case "remote": return "Remote";
      case "onsite": return "On-site";
      case "hybrid": return "Hybrid";
      default: return type;
    }
  };
  const getWorkplaceConfig = (type) => {
    switch (getWorkplaceLabel(type)) {
      case "Remote": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
      case "Hybrid": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
      case "On-site": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
      default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  // Parse a text block into bullet points (split by newline, period-separated sentences, or commas)
  const toBulletPoints = (text) => {
    if (!text) return [];
    const lines = text
      .split(/[\n\r]+|(?<=\.)\s+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2);
    return lines.length > 0 ? lines : [text];
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-['Inter',sans-serif]">
        <ToastContainer />
        
        {/* Top Bar Skeleton */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-24 rounded-lg" />
              <div className="h-5 w-px bg-gray-200" />
              <Skeleton variant="circle" className="h-8 w-8" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton variant="title" className="h-5 w-40" />
                <Skeleton variant="text" className="h-3 w-32 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            <Skeleton variant="image" className="h-64 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton variant="title" className="h-8 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-4/5" />
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <Skeleton variant="title" className="h-6 w-1/3" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="flex gap-3">
              <Skeleton variant="button" className="h-10 w-24" />
              <Skeleton variant="button" className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-[85vh] bg-white">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "This job may have been removed or is no longer available."}</p>
          <button onClick={() => navigate("/user/job-search")} className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const wpConfig = getWorkplaceConfig(job.workPlaceType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-['Inter',sans-serif]">
      <ToastContainer />

      {/* ─── Sticky Top Bar ─── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors group">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="h-5 w-px bg-gray-200" />
            {job.img && !imgError ? (
              <img src={job.img} alt={job.companyName} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" onError={() => setImgError(true)} />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-purple-600">{job.companyName?.charAt(0)}</span>
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{job.jobTitle}</h1>
              <p className="text-xs text-gray-400 truncate hidden sm:block">{job.companyName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Single Column Content ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ═══ Company & Job Header ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Company Logo */}
            {job.img && !imgError ? (
              <img
                src={job.img}
                alt={job.companyName}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm shrink-0"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl font-bold text-purple-600">
                  {job.companyName?.charAt(0)}
                </span>
              </div>
            )}

            {/* Job Info */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 leading-tight mb-2">
                {job.jobTitle}
              </h2>
              <p className="text-base text-gray-500 font-medium mb-5">
                {job.companyName}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 256 256" className="text-gray-400">
                    <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
                  </svg>
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100 text-sm text-purple-600 font-medium">
                  {job.department}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 font-medium">
                  {job.experience}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${wpConfig.bg} ${wpConfig.text} ${wpConfig.border}`}>
                  {getWorkplaceLabel(job.workPlaceType)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Job Details — Bullet Points ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 mb-8">

          {/* Description */}
          <div className="mb-8">
            <h3 className="flex items-center gap-3 text-base font-bold text-gray-900 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256" className="text-blue-600">
                  <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,144H32V64H224V192ZM48,104A8,8,0,0,1,56,96H200a8,8,0,0,1,0,16H56A8,8,0,0,1,48,104Zm0,32a8,8,0,0,1,8-8H200a8,8,0,0,1,0,16H56A8,8,0,0,1,48,136Zm0,32a8,8,0,0,1,8-8H168a8,8,0,0,1,0,16H56A8,8,0,0,1,48,168Z" />
                </svg>
              </div>
              Job Description
            </h3>
            <ul className="space-y-2.5 ml-11">
              {toBulletPoints(job.jobDescription).map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.88rem] text-gray-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="mb-8 pt-7 border-t border-gray-100">
              <h3 className="flex items-center gap-3 text-base font-bold text-gray-900 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256" className="text-green-600">
                    <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                  </svg>
                </div>
                Responsibilities
              </h3>
              <ul className="space-y-2.5 ml-11">
                {toBulletPoints(job.responsibilities).map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.88rem] text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && (
            <div className="pt-7 border-t border-gray-100">
              <h3 className="flex items-center gap-3 text-base font-bold text-gray-900 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256" className="text-purple-600">
                    <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.74,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12Z" />
                  </svg>
                </div>
                Qualifications
              </h3>
              <ul className="space-y-2.5 ml-11">
                {toBulletPoints(job.qualifications).map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.88rem] text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ═══ Application Form ═══ */}
        {hasApplied ? (
          <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-8 sm:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-5 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-sm text-gray-500 mb-7 leading-relaxed max-w-md mx-auto">
              You have successfully applied for this position. The recruiter will review your application and get back to you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate("/user/job-search")} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-0.5">
                Browse More Jobs
              </button>
              <button onClick={() => navigate("/user/dashboard")} className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 transition-all duration-300">
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Submit Your Application</h3>
                  <p className="text-sm text-gray-400">
                    Applying as <span className="font-medium text-purple-600">{user?.email}</span>
                  </p>
                </div>
                {/* Applicant avatar */}
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-purple-600">
                    {(user?.userName || user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                    Resume <span className="text-gray-400 font-normal">(PDF, DOC, DOCX)</span>
                  </label>
                  {resumeFile ? (
                    <div className="flex items-center gap-3 p-4 bg-purple-50/60 border border-purple-200 rounded-xl h-[calc(100%-2rem)]">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-purple-600">
                          <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{resumeFile.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(resumeFile.size)}</p>
                      </div>
                      <button type="button" onClick={removeFile} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${isDragging ? "border-purple-400 bg-purple-50/50" : "border-gray-200 bg-gray-50/50 hover:border-purple-300 hover:bg-purple-50/30"
                        }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDragging ? "bg-purple-100" : "bg-gray-100"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className={isDragging ? "text-purple-600" : "text-gray-400"}>
                          <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        Drop file or <span className="text-purple-600 font-semibold">browse</span>
                      </p>
                      <p className="text-xs text-gray-400">Max 5MB</p>
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileSelect} />
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                    Cover Letter <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the recruiter why you're a great fit..."
                    maxLength={2000}
                    rows={5}
                    className="w-full p-4 text-sm text-gray-800 bg-gray-50/80 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1.5 text-right">{coverLetter.length}/2000</p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="group w-full sm:w-auto mt-8 relative px-10 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md shadow-gray-200/50 hover:shadow-lg hover:shadow-gray-300/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2.5">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="transition-transform duration-300 group-hover:-translate-y-0.5 -rotate-45 mt-1">
                      <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,13-9.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.32-11.32L107.1,137.58,23.91,98.12l.14,0L215.94,40Z" />
                    </svg> */}
                    <img src={ButtonLogo} className="w-6 group-hover:-translate-y-0.5" alt="" />
                    Submit Application
                  </span>
                )}
                <span className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
