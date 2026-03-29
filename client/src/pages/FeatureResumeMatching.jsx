import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Cpu, Target, CheckCircle, BarChart2 } from "lucide-react";

const FeatureResumeMatching = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Resume &amp; Job Matching</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Our AI engine extracts key information from your resume and intelligently matches you to the most relevant opportunities — scored out of 100 using industry-standard ATS logic.
          </p>
        </div>

        {/* How it works cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: <FileText size={22} className="text-purple-600" />, title: "Upload Resume", desc: "Upload your resume as a PDF. We parse it instantly to extract name, skills, education, and experience." },
            { icon: <Cpu size={22} className="text-purple-600" />, title: "AI Extraction", desc: "Our NLP engine analyses your resume content and structures it into a machine-readable candidate profile." },
            { icon: <Target size={22} className="text-purple-600" />, title: "Smart Matching", desc: "We compare your extracted profile against live job descriptions and rank results by relevance score." },
          ].map((c) => (
            <div key={c.title} className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center mb-4 shadow-sm">{c.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mb-10" />

        {/* ATS Score Explanation */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your ATS Score</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          The ATS score is calculated out of 100 and reflects how well your resume aligns with a specific job description. It considers:
        </p>
        <div className="space-y-3 mb-12">
          {[
            { label: "Keyword Matching", pct: "35%", desc: "Overlap between your resume keywords and the job description" },
            { label: "Skills Alignment", pct: "30%", desc: "How well your listed skills match required and preferred skills" },
            { label: "Experience Relevance", pct: "20%", desc: "Years and domain of experience relative to the role" },
            { label: "Education Fit", pct: "15%", desc: "Degree level and field relative to job requirements" },
          ].map((f) => (
            <div key={f.label} className="border border-gray-100 rounded-2xl p-5 bg-gray-50 flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl bg-white border border-purple-100 text-purple-600 font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">{f.pct}</div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{f.label}</h4>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="border border-purple-100 bg-purple-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Instant resume parsing (PDF support)", "ATS score out of 100 per job", "Side-by-side skills gap analysis", "Keyword recommendations", "Job match ranking by relevance", "Recruiter visibility based on score"].map((b) => (
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

export default FeatureResumeMatching;
