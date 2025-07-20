// import React, { useEffect } from "react";
// const Recruiter_CandidateProfile_view = () => {
//   const userData = {
//     name: "Sophia Bennett",
//     role: "Senior Software Engineer",
//     appliedDaysAgo: 2,
//     resumeSummary:
//       "Sophia Bennett is a highly skilled Senior Software Engineer with over 8 years of experience in developing and implementing scalable and efficient software solutions...",
//     experience: [
//       {
//         title: "Senior Software Engineer",
//         date: "2018 - Present",
//         company: "Tech Innovators Inc.",
//       },
//       {
//         title: "Software Engineer",
//         date: "2016 - 2018",
//         company: "CodeCrafters LLC",
//       },
//     ],
//     education: [
//       {
//         degree: "Bachelor of Science in Computer Science",
//         date: "2012 - 2016",
//         institution: "University of Technology",
//       },
//     ],
//     skills: [
//       "Java",
//       "Python",
//       "JavaScript",
//       "Full-Stack Development",
//       "Agile Methodologies",
//     ],
//     atsScore: 92,
//   };
//   console.log(JSON.stringify(userData, null, 2));

//   return (
//     <div className="relative min-h-screen flex flex-col bg-grey-50 transition-all duration-300 ease-in-out">
//       <div className="container mx-auto flex grow flex-col px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-1 justify-center py-6 lg:py-8">
//           <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6">
//             {/* Main Content */}
//             <div className="flex-1 space-y-6">
//               {/* Header Section */}
//               <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
//                 <div className="flex flex-col gap-2">
//                   <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                     Candidate Profile
//                   </h1>
//                   <p className="text-gray-600 text-sm sm:text-base">
//                     Review the candidate's profile and resume.
//                   </p>
//                 </div>
//               </div>

//               {/* Profile Info */}
//               <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
//                 <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
//                   <div
//                     className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32"
//                     style={{
//                       backgroundImage:
//                         'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2dCLbbGFOs0LhlrrKsiG9NmWgnXeF7EPgMbKaUwyNyAfBO91eGWUlFNoy-bZFbgjsZc67nwF717JD7w2x8PZJkTMomMbQqhF07IjGfRNoQbo792dHDGL7YkWkrX9pDhZMpdcqPNpbAMeKQhUq4vf6c6NBahSYvJEhBu0WMdaBTJIvmbQuSOcCiZklTKF6El1ySBqn9MxnJOaMBFgfLL4DRCgnenfL4WuwLYja-Tmk0BpcDlG0um3FjgWtmtNbUd5s9R0qZAwzhA")',
//                     }}
//                   ></div>
//                   <div className="flex flex-col justify-center text-center sm:text-left">
//                     <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//                       Sophia Bennett
//                     </h2>
//                     <p className="text-gray-600 text-sm sm:text-base">
//                       Senior Software Engineer
//                     </p>
//                     <p className="text-gray-600 text-sm sm:text-base">
//                       Applied 2 days ago
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Resume Section */}
//               <Section title="Resume">
//                 <p className="text-gray-700 text-sm sm:text-base">
//                   Sophia Bennett is a highly skilled Senior Software Engineer
//                   with over 8 years of experience in developing and implementing
//                   scalable and efficient software solutions...
//                 </p>
//               </Section>

//               {/* Experience Section */}
//               <Section title="Experience">
//                 <Experience
//                   title="Senior Software Engineer"
//                   date="2018 - Present"
//                   company="Tech Innovators Inc."
//                 />
//                 <Experience
//                   title="Software Engineer"
//                   date="2016 - 2018"
//                   company="CodeCrafters LLC"
//                 />
//               </Section>

//               {/* Education Section */}
//               <Section title="Education">
//                 <Experience
//                   title="Bachelor of Science in Computer Science"
//                   date="2012 - 2016"
//                   company="University of Technology"
//                 />
//               </Section>

//               {/* Skills Section */}
//               <Section title="Skills">
//                 <div className="flex flex-wrap gap-2">
//                   {[
//                     "Java",
//                     "Python",
//                     "JavaScript",
//                     "Full-Stack Development",
//                     "Agile Methodologies",
//                   ].map((skill) => (
//                     <SkillBadge key={skill} label={skill} />
//                   ))}
//                 </div>
//               </Section>
//             </div>

//             {/* Sidebar */}
//             <div className="w-full lg:w-96 space-y-6">
//               <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
//                 <Card title="ATS Score" value="92" />
//               </div>
//               <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
//                 <h3 className="text-lg font-bold text-gray-900 pb-3">
//                   Feedback
//                 </h3>
//                 <textarea
//                   placeholder="Enter your feedback here"
//                   className="w-full min-h-36 rounded-lg border border-gray-300 p-4 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//                 ></textarea>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button className="flex-1 h-10 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition duration-200">
//                   Submit Feedback
//                 </button>
//                 <button className="flex-1 h-10 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200">
//                   Shortlist Candidate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Section = ({ title, children }) => (
//   <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
//     <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pb-3">
//       {title}
//     </h2>
//     <div>{children}</div>
//   </div>
// );

// const Experience = ({ title, date, company }) => (
//   <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-3 transition-transform hover:scale-[1.02] duration-200">
//     <p className="text-base font-semibold text-gray-900">{title}</p>
//     <p className="text-gray-600 text-sm">{date}</p>
//     <p className="text-gray-600 text-sm">{company}</p>
//   </div>
// );

// const SkillBadge = ({ label }) => (
//   <div className="h-8 flex items-center justify-center bg-gray-100 px-4 rounded-lg shadow-sm text-sm font-semibold text-gray-900 hover:bg-purple-100 transition duration-200">
//     {label}
//   </div>
// );

// const Card = ({ title, value }) => (
//   <div className="p-6 bg-gray-50 rounded-lg shadow-sm text-center">
//     <p className="text-base font-semibold text-gray-900">{title}</p>
//     <p className="text-2xl font-bold text-purple-600">{value}</p>
//   </div>
// );

// export default Recruiter_CandidateProfile_view;
