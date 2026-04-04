import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "../../components/Skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// ─── Score helpers ────────────────────────────────────────────────────────────
function getScoreMeta(v) {
  if (v >= 75) return { label: "Excellent", badge: "text-emerald-700 bg-emerald-50 border-emerald-200", bar: "bg-emerald-400", ring: "#10b981" };
  if (v >= 50) return { label: "Good", badge: "text-amber-700 bg-amber-50 border-amber-200", bar: "bg-amber-300", ring: "#ffc155ff" };
  return { label: "Needs Work", badge: "text-red-700 bg-red-50 border-red-200", bar: "bg-red-400", ring: "#ff6a6aff" };
}

// ─── Score Card ───────────────────────────────────────────────────────────────
// Inspired by StatCard in User_Analytics_view.jsx — icon left, value right, bar bottom
function ScoreCard({ title, value }) {
  const num = parseInt(value, 10) || 0;
  const meta = getScoreMeta(num);
  const circ = 2 * Math.PI * 28;
  const offset = circ - (num / 100) * circ;

  return (
    <div className="flex-1 min-w-[200px] bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300">

      {/* Top row: icon + badge */}
      <div className="flex items-center justify-between">
        {/* SVG Ring */}
        <div className="relative w-14 h-14 shrink-0">
          <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r="22" fill="none" stroke="#f3f4f6" strokeWidth="6" />
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke={meta.ring}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-gray-800">{num}</span>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      {/* Score + label */}
      <div>
        <p className="text-3xl font-black text-gray-900 leading-none">
          {num}<span className="text-base font-semibold text-gray-400 ml-0.5">%</span>
        </p>
        <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${meta.bar} transition-all duration-1000`}
          style={{ width: `${num}%` }}
        />
      </div>
    </div>
  );
}

// ─── Improvement Tip Card ─────────────────────────────────────────────────────
function ImprovementTip({ icon, title, subtitle, description }) {
  return (
    <div className="flex gap-4 items-start bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 mb-0.5">{title}</p>
        <p className="text-xs font-semibold text-blue-600 mb-1.5">{subtitle}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Main component – logic untouched ─────────────────────────────────────────
function AtsScreenBrackDown({ atsData }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add loading state and null check
  if (!atsData || !atsData.analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton variant="title" className="h-7 w-48" />
              <Skeleton variant="text" className="h-4 w-64" />
            </div>
          </div>

          {/* Overall Score Card Skeleton */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton variant="circle" className="h-40 w-40 shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton variant="title" className="h-6 w-1/2" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Score Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="title" className="h-5 w-1/2" />
                    <Skeleton variant="text" className="h-3 w-2/3" />
                  </div>
                  <Skeleton variant="circle" className="h-12 w-12 shrink-0" />
                </div>
                <Skeleton className="h-1 w-full rounded-full" />
              </div>
            ))}
          </div>

          {/* Improvement Tips Section Skeleton */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <Skeleton variant="title" className="h-6 w-1/3" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="h-4 w-1/2" />
                    <Skeleton variant="text" className="h-3 w-3/4" />
                    <Skeleton variant="text" className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe destructuring with default values
  const {
    analysis: {
      ai_output = "",
      result = {
        "ATS Score": 0,
        "Keyword Match": 0,
        "Skill Match": 0,
        "Experience and Education Match": 0,
        "Formatting Quality": 0,
      },
    } = {},
  } = atsData;

  // Destructure result with aliases to match received keys
  const {
    "ATS Score": ATSScore = 0,
    "Keyword Match": KeywordMatch = 0,
    "Skill Match": SkillMatch = 0,
    "Experience and Education Match": ExperienceAndEducationMatch = 0,
    "Formatting Quality": FormattingQuality = 0,
  } = result || {};

  // Log for debugging
  console.log("Parsed ATS Data:", {
    ATSScore,
    KeywordMatch,
    SkillMatch,
    ExperienceAndEducationMatch,
    FormattingQuality,
    ai_output,
  });

  const extractList = (text, startMarker, endMarker) => {
    if (typeof text !== "string") {
      console.warn(`Expected string for ai_output, received: ${typeof text}`);
      return [];
    }
    const section = text.split(startMarker)[1]?.split(endMarker)[0] || "";
    return section
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-"))
      .map((line) => line.replace(/^-\s*/, ""));
  };

  const improvementTips = extractList(ai_output, "Improvement Tips:", "Feedback Report:");
  const feedback =
    typeof ai_output === "string" && ai_output.includes("Feedback Report:")
      ? ai_output.split("Feedback Report:")[1]?.trim() || ""
      : "";

  const scoreMeta = getScoreMeta(ATSScore);

  // Overall score ring
  const atsCirc = 2 * Math.PI * 52;
  const atsOffset = atsCirc - (ATSScore / 100) * atsCirc;

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page Header ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              ATS Score Breakdown
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Detailed analysis of how your resume performs against the job description.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-full shadow-sm self-start sm:self-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Analysis Complete
          </span>
        </div>

        {/* ── Overall Score ──────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Score-tier top strip */}
          {/* <div className={`h-1 w-full ${ATSScore >= 75 ? "bg-emerald-500" : ATSScore >= 50 ? "bg-amber-400" : "bg-red-500"}`} /> */}

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Overall Score</h2>
                <p className="text-xs text-gray-400">Your resume's ATS compatibility rating</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-center">
              {/* Big ring */}
              <div className="relative w-[120px] h-[120px] shrink-0">
                <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke={scoreMeta.ring}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={atsCirc}
                    strokeDashoffset={atsOffset}
                    style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-900 leading-none">{ATSScore}</span>
                  <span className="text-xs text-gray-400 font-semibold">/ 100</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">ATS Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-900">{ATSScore}%</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${scoreMeta.badge}`}>
                      {scoreMeta.label}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${scoreMeta.bar} transition-all duration-1000`}
                    style={{ width: `${ATSScore}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Your resume is analysed for keyword relevance, skill match, experience fit, and formatting quality.
                </p>

                {/* Sub-score chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Keywords", v: KeywordMatch },
                    { label: "Skills", v: SkillMatch },
                    { label: "Experience", v: ExperienceAndEducationMatch },
                    { label: "Formatting", v: FormattingQuality },
                  ].map(({ label, v }) => (
                    <span key={label} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                      {label}: <span className="text-gray-900 font-black">{v}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Score Cards ───────────────────────────────── */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" />
            </svg>
          }
          title="Category Scores"
          subtitle="Individual dimension breakdown"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ScoreCard title="Keyword Match" value={`${KeywordMatch}%`} />
            <ScoreCard title="Skill Match" value={`${SkillMatch}%`} />
            <ScoreCard title="Experience & Education" value={`${ExperienceAndEducationMatch}%`} />
            <ScoreCard title="Formatting Quality" value={`${FormattingQuality}%`} />
          </div>
        </SectionCard>

        {/* ── Improvement Tips ──────────────────────────────────── */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Z" />
            </svg>
          }
          title="Improvement Tips"
          subtitle="Actionable suggestions to boost your score"
        >
          {improvementTips.length > 0 ? (
            <div className="space-y-3">
              {improvementTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <ImprovementTip
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>}
                title="Keyword Match"
                subtitle="Keywords: Project Management, Agile, Scrum, Leadership"
                description="Ensure all relevant keywords from the job description are included in your resume, especially in the skills and experience sections."
              />
              <ImprovementTip
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,0,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z" /></svg>}
                title="Skill Match"
                subtitle="Skills: Communication, Problem-Solving, Teamwork, Time Management"
                description="Highlight your core skills that align with the job requirements. Use action verbs to describe how you've applied these skills."
              />
              <ImprovementTip
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z" /></svg>}
                title="Experience & Education Match"
                subtitle="Experience: 5+ years in project management, led cross-functional teams"
                description="Clearly outline your work experience and educational background. Ensure dates, job titles, and company names are accurate and consistent."
              />
              <ImprovementTip
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z" /></svg>}
                title="Formatting Quality"
                subtitle="Format: Use a standard resume template, ensure consistent spacing and margins"
                description="Maintain a clean and professional format. Use bullet points, clear headings, and appropriate font sizes. Avoid excessive use of graphics or colors."
              />
            </div>
          )}
        </SectionCard>

        {/* ── Feedback Report ────────────────────────────────────── */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,48H40a16,16,0,0,0-16,16V208a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,224a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,192H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM216,176H80a8,8,0,0,0-5.23,1.95L40,208V64H216Z" />
            </svg>
          }
          title="Feedback Report"
          subtitle="Detailed AI-generated recommendations"
        >
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <p className="text-sm text-gray-700 leading-loose whitespace-pre-line">
              {feedback || "No feedback available."}
            </p>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}

export default AtsScreenBrackDown;