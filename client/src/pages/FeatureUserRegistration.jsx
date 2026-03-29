import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Briefcase, Settings, CheckCircle } from "lucide-react";

const FeatureUserRegistration = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">User Registration &amp; Profiles</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            JobFit supports three distinct user roles — Job Seekers, Recruiters, and Admins — each with their own tailored profile, dashboard, and capabilities.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: <User size={22} className="text-purple-600" />, role: "Job Seeker", desc: "Create a profile, upload your resume, set job preferences, and apply for roles that match your skills." },
            { icon: <Briefcase size={22} className="text-purple-600" />, role: "Recruiter", desc: "Post jobs, manage applications, run ATS scoring on candidates and access a talent pool." },
            { icon: <Settings size={22} className="text-purple-600" />, role: "Admin", desc: "Oversee all users, manage platform content, and monitor overall activity and analytics." },
          ].map((r) => (
            <div key={r.role} className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center mb-4 shadow-sm">{r.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{r.role}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mb-10" />

        {/* Steps */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How Registration Works</h2>
        <div className="space-y-4 mb-12">
          {[
            { step: "1", title: "Sign Up", desc: "Register using your email address or continue with Google OAuth for a seamless one-click signup." },
            { step: "2", title: "Choose Your Role", desc: "Select whether you're a Job Seeker or Recruiter. Each role unlocks a specific set of features and dashboard views." },
            { step: "3", title: "Build Your Profile", desc: "Fill in your personal details, skills, work experience, and education. Job seekers can upload a resume PDF directly." },
            { step: "4", title: "Set Preferences", desc: "Specify job type, location, industry, and salary expectations so JobFit can serve you the most relevant matches." },
            { step: "5", title: "Start Using JobFit", desc: "Explore job listings, apply to roles, or post jobs and start receiving applications — all from your personalised dashboard." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start border border-gray-100 rounded-2xl p-5 bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{s.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="border border-purple-100 bg-purple-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Fast sign-up with Google OAuth", "Role-based dashboards and permissions", "Secure password hashing", "Profile visibility controls", "Real-time application status tracking", "Resume upload & ATS processing"].map((b) => (
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

export default FeatureUserRegistration;
