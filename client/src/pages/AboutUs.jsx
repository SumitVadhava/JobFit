import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Target, Users, Zap, Award } from "lucide-react";

const stats = [
  { label: "Candidates Placed", value: "10,000+" },
  { label: "Partner Companies", value: "500+" },
  { label: "ATS Accuracy", value: "96.33%" },
  { label: "Countries", value: "15+" },
];

const values = [
  {
    icon: <Target size={24} className="text-purple-600" />,
    title: "Precision Matching",
    desc: "We use AI-powered ATS analysis to connect the right talent with the right opportunity — every time.",
  },
  {
    icon: <Users size={24} className="text-purple-600" />,
    title: "Candidate-First",
    desc: "Our platform is built around helping candidates shine, not just filling positions.",
  },
  {
    icon: <Zap size={24} className="text-purple-600" />,
    title: "Speed & Efficiency",
    desc: "From application to offer, we streamline every step of the hiring journey.",
  },
  {
    icon: <Award size={24} className="text-purple-600" />,
    title: "Trusted Quality",
    desc: "Recruiters trust JobFit to deliver pre-screened, high-quality candidates ready to contribute.",
  },
];

const AboutUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-10 text-gray-500 hover:text-purple-700 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Hero */}
        <div className="text-center mb-14">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Connecting Talent with{" "}
            <span className="text-purple-600">Opportunity</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            JobFit was founded with a simple belief — hiring should be smarter,
            faster, and fairer. We built a platform that leverages AI to ensure
            every candidate's resume gets the attention it deserves.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border border-gray-100 rounded-2xl p-6 text-center bg-gray-50"
            >
              <p className="text-3xl font-bold text-purple-600 mb-1">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-14" />

        {/* Values */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            What We Stand For
          </h2>
          <p className="text-gray-400 text-center text-sm mb-8">
            The principles that guide everything we build
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="border border-gray-100 rounded-2xl p-6 flex gap-4 items-start bg-gray-50 hover:border-purple-100 hover:bg-purple-50/30 transition-colors"
              >
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — subtle, not full-bleed */}
        <div className="border border-purple-100 bg-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ready to find your perfect fit?
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Join thousands of candidates and recruiters on JobFit today.
          </p>
          <Link
            to="/login"
            className="inline-block bg-purple-600 text-white font-semibold px-7 py-2.5 rounded-full hover:bg-purple-700 transition-colors text-sm"
          >
            Get Started
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
