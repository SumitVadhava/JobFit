import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recruiter_CandidateProfile_view = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const userData = {
    name: "Sophia Bennett",
    role: "Senior Software Engineer",
    appliedDaysAgo: 2,
    resumeSummary:
      "Sophia Bennett is a highly skilled Senior Software Engineer with over 8 years of experience in developing and implementing scalable and efficient software solutions. Passionate about building robust backend architectures and mentoring junior developers.",
    experience: [
      {
        title: "Senior Software Engineer",
        date: "2018 - Present",
        company: "Tech Innovators Inc.",
        description: "Led a team of 5 engineers to revamp the core microservices architecture, reducing latency by 40%."
      },
      {
        title: "Software Engineer",
        date: "2016 - 2018",
        company: "CodeCrafters LLC",
        description: "Developed features for a high-traffic SaaS platform and integrated third-party payment gateways."
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        date: "2012 - 2016",
        institution: "University of Technology",
      },
    ],
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "React",
      "Node.js",
      "AWS",
      "Microservices",
      "Agile Methodologies",
    ],
    atsScore: 92,
    profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2dCLbbGFOs0LhlrrKsiG9NmWgnXeF7EPgMbKaUwyNyAfBO91eGWUlFNoy-bZFbgjsZc67nwF717JD7w2x8PZJkTMomMbQqhF07IjGfRNoQbo792dHDGL7YkWkrX9pDhZMpdcqPNpbAMeKQhUq4vf6c6NBahSYvJEhBu0WMdaBTJIvmbQuSOcCiZklTKF6El1ySBqn9MxnJOaMBFgfLL4DRCgnenfL4WuwLYja-Tmk0BpcDlG0um3FjgWtmtNbUd5s9R0qZAwzhA"
  };

  const handleShortlist = () => {
    toast.success(`${userData.name} has been shortlisted!`);
  };

  const handleSubmitFeedback = () => {
    if (!feedback) {
      toast.error("Please enter some feedback first.");
      return;
    }
    toast.info("Feedback submitted successfully.");
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-['Inter',sans-serif] pb-12">
      <ToastContainer />
      
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
            </svg>
            Back to Candidates
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Candidate Details */}
          <div className="flex-1 space-y-8">
            
            {/* Header / Profile Hero Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0">
                  <img 
                    src={userData.profileImage} 
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 pt-2">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                      <p className="text-lg text-blue-600 font-medium mt-1">{userData.role}</p>
                      
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 justify-center sm:justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                        </svg>
                        Applied {userData.appliedDaysAgo} days ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About / Summary Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-500" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
                </svg>
                Professional Summary
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {userData.resumeSummary}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-500" viewBox="0 0 256 256">
                  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
                </svg>
                Experience
              </h2>
              <div className="space-y-6">
                {userData.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-blue-100 hover:border-blue-400 transition-colors">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 font-medium">
                      <span>{exp.company}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-500">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-500" viewBox="0 0 256 256">
                  <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87V168a8,8,0,0,0,16,0V126.41l39.76,21.2A88.16,88.16,0,0,0,80,216a8,8,0,0,0,16,0,72,72,0,0,1,144,0,8,8,0,0,0,16,0,88.16,88.16,0,0,0-7.76-68.39L251.76,103.06A8,8,0,0,0,251.76,88.94ZM128,42l106.88,57L128,155.94,21.12,99Z" />
                </svg>
                Education
              </h2>
              <div className="space-y-6">
                {userData.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 hover:border-indigo-400 transition-colors">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 font-medium">
                      <span>{edu.institution}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-500">{edu.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn" style={{ animationDelay: '400ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-500" viewBox="0 0 256 256">
                  <path d="M224,115.55V208a16,16,0,0,1-16,16H163.09A119.83,119.83,0,0,1,128,240a120.24,120.24,0,0,1-35.09-5.18h0A119.83,119.83,0,0,1,92.91,224H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,7.24-13.38L120.59,48.61a16,16,0,0,1,14.82,0l81.35,53.56A16,16,0,0,1,224,115.55Z" />
                </svg>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-colors">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Actions & Feedback */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            
            {/* ATS Score Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10 flex flex-col items-center">
                <p className="text-blue-100 font-semibold mb-2 uppercase tracking-wider text-sm">ATS Match Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black">{userData.atsScore}</span>
                  <span className="text-2xl font-bold opacity-70">%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3 mt-6 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-green-300 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${userData.atsScore}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-4 text-center text-blue-50 font-medium">
                  Strong candidate match for this role based on skills and experience.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 mb-2">Actions</h3>
              <button 
                onClick={handleShortlist}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="group-hover:scale-110 transition-transform">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                </svg>
                Shortlist Candidate
              </button>
              <button 
                className="w-full py-3.5 px-4 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 font-semibold rounded-2xl transition-all border border-gray-200 hover:border-red-200 flex items-center justify-center gap-2 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="group-hover:scale-110 transition-transform">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
                Reject Candidate
              </button>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-gray-500" viewBox="0 0 256 256">
                  <path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM88,144a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h0A8,8,0,0,1,88,144Zm48,0a8,8,0,0,1-8,8h0a8,8,0,0,1,0-16h0A8,8,0,0,1,136,144Zm48,0a8,8,0,0,1-8,8h0a8,8,0,0,1,0-16h0A8,8,0,0,1,184,144Z" />
                </svg>
                Evaluation Notes
              </h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about this candidate..."
                className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              ></textarea>
              <button 
                onClick={handleSubmitFeedback}
                className="w-full mt-4 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-192,64a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,256q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l64-192A16,16,0,0,0,227.32,28.68ZM158.46,233.15l-37-78.23L153.37,123A8,8,0,0,0,142.05,111.7l-31.91,31.92L31.91,106.6Z" />
                </svg>
                Save Notes
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiter_CandidateProfile_view;
