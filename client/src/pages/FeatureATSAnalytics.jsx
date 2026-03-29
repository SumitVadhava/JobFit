import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, List, MessageSquare, CheckCircle } from "lucide-react";

const FeatureATSAnalytics = () => {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-10 text-gray-500 hover:text-purple-700 transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="mb-10">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">Feature</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">ATS Score Analytics</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Go beyond just a number. JobFit's analytics dashboard breaks down your ATS score into actionable insights so you can take targeted steps to improve your resume and land more interviews.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: <TrendingUp size={22} className="text-purple-600" />, title: "Score Tracking", desc: "Monitor how your ATS score changes each time you update your resume or apply to a new role." },
            { icon: <List size={22} className="text-purple-600" />, title: "Detailed Breakdown", desc: "See exactly which keywords, skills, and experience factors are contributing to or pulling down your score." },
            { icon: <MessageSquare size={22} className="text-purple-600" />, title: "Actionable Feedback", desc: "Receive specific suggestions — missing keywords to add, skills to highlight, and formatting improvements." },
          ].map((c) => (
            <div key={c.title} className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center mb-4 shadow-sm">{c.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mb-10" />

        {/* Score ranges */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Your Score Means</h2>
        <div className="space-y-3 mb-12">
          {[
            { range: "80–100", label: "Excellent", color: "bg-green-500", desc: "Your resume is highly aligned. You're very likely to pass automated screening and reach a human reviewer." },
            { range: "60–79", label: "Good", color: "bg-blue-500", desc: "Strong match with some gaps. Addressing missing keywords and skills can push you into the excellent range." },
            { range: "40–59", label: "Average", color: "bg-yellow-500", desc: "Moderate alignment. Your resume may be filtered out. Review the breakdown and make targeted improvements." },
            { range: "0–39", label: "Needs Work", color: "bg-red-500", desc: "Low match. Consider a significant resume revision to align with the job requirements before applying." },
          ].map((r) => (
            <div key={r.range} className="border border-gray-100 rounded-2xl p-5 bg-gray-50 flex gap-4 items-start">
              <div className="flex-shrink-0 text-center">
                <div className={`w-3 h-3 rounded-full ${r.color} mt-1.5`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{r.range}</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{r.label}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="border border-purple-100 bg-purple-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Per-application score breakdown", "Keyword gap analysis", "Skills match percentage", "Suggested resume improvements", "Historical score comparison", "Recruiter-facing score visibility"].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-purple-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureATSAnalytics;
