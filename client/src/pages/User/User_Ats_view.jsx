// import React from "react";
// import { useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// function ScoreCard({ title, value, description }) {
//   return (
//     <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg p-6 border border-purple-200 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//       <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//       <p className="text-[#6B46C1] text-[32px] font-bold tracking-tight truncate">
//         {value}
//       </p>
//       <p className="text-[#A78BFA] text-base font-normal">Current</p>
//       <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
//         <div
//           className="border-[#A78BFA] bg-[#E9D5FF] border-t-2 w-full"
//           style={{ height: `${value}` }}
//         ></div>
//         <p className="text-[#A78BFA] text-[13px] font-bold tracking-tight">
//           {title.split(" ")[0]}
//         </p>
//       </div>
//     </div>
//   );
// }

// function ImprovementTip({ icon, title, subtitle, description }) {
//   return (
//     <div className="flex gap-4 bg-white px-4 py-3">
//       <div className="text-[#6B46C1] flex items-center justify-center rounded-lg bg-purple-100 shrink-0 w-12 h-12">
//         {icon}
//       </div>
//       <div className="flex flex-1 flex-col justify-center">
//         <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//         <p className="text-[#A78BFA] text-sm font-normal">{subtitle}</p>
//         <p className="text-[#A78BFA] text-sm font-normal">{description}</p>
//       </div>
//     </div>
//   );
// }

// function AtsScreenBrackDown({ atsData }) {
//   // Add loading state and null check
//   if (!atsData || !atsData.analysis) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-[#6B46C1] text-xl">Loading analysis data...</p>
//       </div>
//     );
//   }

//   // Safe destructuring with default values
//   const {
//     analysis: {
//       ai_output = '',
//       result = {
//         ATSScore: 0,
//         KeywordMatch: 0,
//         SkillMatch: 0,
//         ExperienceAndEducationMatch: 0,
//         FormattingQuality: 0
//       }
//     } = {}
//   } = atsData;

//   const {
//     ATSScore,
//     KeywordMatch,
//     SkillMatch,
//     ExperienceAndEducationMatch,
//     FormattingQuality
//   } = result;

//   const userActivityData = [
//     { month: "Jan", activity: 50 },
//     { month: "Feb", activity: 70 },
//     { month: "Mar", activity: 60 },
//     { month: "Apr", activity: 90 },
//     { month: "May", activity: 80 },
//     { month: "Jun", activity: 110 },
//     { month: "Jul", activity: 120 },
//   ];

//   const jobPostingsData = [
//     { industry: "Tech", count: 10 },
//     { industry: "Healthcare", count: 30 },
//     { industry: "Finance", count: 80 },
//     { industry: "Retail", count: 50 },
//     { industry: "Education", count: 90 },
//     { industry: "Manufacturing", count: 40 },
//     { industry: "Other", count: 20 },
//   ];

//   const handleLineClick = (data) => {
//     if (data && data.activePayload && data.activePayload[0]) {
//       const { month, activity } = data.activePayload[0].payload;
//       toast.info(Activity in `${month}: ${activity}`, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "light",
//         style: {
//           backgroundColor: "#FFFFFF",
//           color: "#6B46C1",
//           border: "1px solid #E9D5FF",
//         },
//       });
//     }
//   };

//   const extractList = (text, startMarker, endMarker) => {
//     if (typeof text !== "string") return [];
//     const section = text.split(startMarker)[1]?.split(endMarker)[0] || "";
//     return section
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line.startsWith("-"))
//       .map((line) => line.replace(/^-\s*/, ""))
//   };

//   // Helper to parse missing keywords
//   const parseMissingKeywords = (text) => {
//     if (!Array.isArray(text)) return [];
//     return text
//       .map((line) => {
//         const match = line.match(
//           /(.+?) \(type: (.+?), years required: (.+?), context: "(.+?)"\)/
//         );
//         if (!match) return null;
//         const [, keyword, type, years, context] = match;
//         return { keyword, type, years, context };
//       })
//       .filter(Boolean);
//   };

//   const matchedKeywords = extractList(ai_output, "Matched Keywords:", "Missing Keywords:");
//   const missingKeywordLines = extractList(ai_output, "Missing Keywords:", "Improvement Tips:");
//   const missingKeywords = parseMissingKeywords(missingKeywordLines);
//   const improvementTips = extractList(ai_output, "Improvement Tips:", "Feedback Report:");
//   const feedback = typeof ai_output === "string" && ai_output.includes("Feedback Report:")
//     ? ai_output.split("Feedback Report:")[1].trim()
//     : "";



//   return (
//     <div>
//       <div className="flex justify-center py-6 px-4 sm:px-10 lg:px-40">
//         <div className="flex flex-col max-w-[960px] w-full animate-fadeIn space-y-8">
//           <ToastContainer />

//           {/* Header */}
//           <div className="flex flex-wrap justify-between gap-3 px-4">
//             <div className="flex min-w-[280px] flex-col gap-2">
//               <p className="text-[#6B46C1] text-4xl sm:text-4xl font-bold tracking-tight">
//                 ATS Score Breakdown
//               </p>
//               <p className="text-[#A78BFA] text-sm sm:text-base font-medium">
//                 Here's a detailed look at how your resume performs against the job description.
//               </p>
//             </div>
//           </div>

//           {/* Overall Score */}
//           <div className="px-4 space-y-4">
//             <h2 className="text-[#6B46C1] text-2xl sm:text-3xl font-semibold">
//               Overall Score
//             </h2>
//             <div className="flex flex-col gap-3">
//               <div className="flex justify-between items-center">
//                 <p className="text-[#6B46C1] font-medium text-base sm:text-lg">ATS Score</p>
//                 <p className="text-[#6B46C1] text-sm sm:text-base">{ATSScore}%</p>
//               </div>
//               <div className="w-full bg-[#E9D5FF] h-3 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-[#6B46C1] transition-all duration-700 ease-out"
//                   style={{ width: `${ATSScore}%` }}
//                 ></div>
//               </div>
//               <p className="text-[#A78BFA] text-sm font-normal">
//                 Your resume is well-optimized for ATS. Consider refining specific areas for even better performance.
//               </p>
//             </div>
//           </div>

//           {/* Category Scores */}
//           <div className="px-4 space-y-4">
//             <h2 className="text-[#6B46C1] text-2xl sm:text-3xl font-semibold">
//               Category Scores
//             </h2>
//             <div className="flex flex-wrap gap-4">
//               <ScoreCard title="Keyword Match" value={`${KeywordMatch}%`} />
//               <ScoreCard title="Skill Match" value={`${SkillMatch}%`} />
//               <ScoreCard title="Experience & Education Match" value={`${ExperienceAndEducationMatch}%`} />
//               <ScoreCard title="Formatting Quality" value={`${FormattingQuality}%`} />
//             </div>
//           </div>

//           {/* Matched Keywords */}
//           <section className="px-4 space-y-2">
//             <h2 className="text-2xl font-semibold text-[#6B46C1]">Matched Keywords</h2>
//             <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
//               {matchedKeywords.map((kw, i) => (
//                 <li className="text-lg" key={i}>{kw} </li>
//               ))}
//             </ul>
//           </section>

//           {/* Missing Keywords */}
//           <section className="px-4 space-y-4">
//             <h2 className="text-2xl font-semibold text-red-500">Missing Keywords</h2>
//             <div className="space-y-3">
//               {missingKeywords.map((item, i) => (
//                 <div key={i} className="border p-4 rounded bg-red-50 shadow-sm space-y-1">
//                   <p className="text-md font-medium text-gray-800">
//                     {item.keyword}{" "}
//                     <span className="text-base text-gray-500">
//                       ({item.type}, {item.years} years)
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600 italic">Context: {item.context}</p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Improvement Tips */}
//           <section className="px-4 space-y-2">
//             <h2 className="text-2xl font-semibold text-[#6B46C1]">Improvement Tips</h2>
//             <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
//               {improvementTips.map((tip, i) => (
//                 <li className="text-base" key={i}>{tip}</li>
//               ))}
//             </ul>
//           </section>

//           {/* Feedback */}
//           <section className="px-4 space-y-2 pb-10">
//             <h2 className="text-2xl font-semibold text-[#6B46C1]">Feedback Report</h2>
//             <p className="whitespace-pre-line text-gray-700 text-base">{feedback}</p>
//           </section>
//         </div>

//         {/* Fade In Animation */}
//         <style jsx>{`
//       @keyframes fadeIn {
//         0% {
//           opacity: 0;
//           transform: translateY(30px) scale(0.98);
//         }
//         100% {
//           opacity: 1;
//           transform: translateY(0) scale(1);
//         }
//       }
//       .animate-fadeIn {
//         animation: fadeIn 0.8s ease-out forwards;
//       }
//     `}</style>
//       </div>
//     </div>
//   );
// }

// /* <div className="flex px-4 py-3 justify-end">
//           <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#6B46C1] text-white text-sm font-bold hover:bg-[#A78BFA] transition-colors">
//             <span className="truncate">Apply Changes</span>
//           </button>
//         </div>
//         <h2 className="text-[#6B46C1] text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
//           Platform Usage
//         </h2>
//         <div className="flex flex-wrap gap-4 px-4 py-6">
//           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//             <p className="text-[#6B46C1] text-base font-medium">
//               User Activity Over Time
//             </p>
//             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
//               +15%
//             </p>
//             <div className="flex gap-1">
//               <p className="text-[#A78BFA] text-base font-normal">
//                 Last 30 Days
//               </p>
//               <p className="text-[#059669] text-base font-medium">+15%</p>
//             </div>
//             <div className="flex min-h-[160px] sm:min-h-[180px] flex-1 flex-col gap-8 py-4">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={userActivityData}
//                   margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
//                   onClick={handleLineClick}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <XAxis dataKey="month" stroke="#A78BFA" fontSize={12} />
//                   <YAxis stroke="#A78BFA" fontSize={12} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#FFFFFF",
//                       borderColor: "#E9D5FF",
//                       color: "#6B46C1",
//                     }}
//                     cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
//                     animationDuration={300}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="activity"
//                     stroke="#6B46C1"
//                     strokeWidth={3}
//                     fill="url(#lineGradient)"
//                     dot={{
//                       r: 5,
//                       fill: "#6B46C1",
//                       stroke: "#FFFFFF",
//                       strokeWidth: 2,
//                     }}
//                     activeDot={{
//                       r: 8,
//                       fill: "#A78BFA",
//                       stroke: "#FFFFFF",
//                       strokeWidth: 2,
//                     }}
//                     animationDuration={1200}
//                     animationEasing="ease-in-out"
//                   />
//                   <defs>
//                     <linearGradient
//                       id="lineGradient"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="0%" stopColor="#E9D5FF" />
//                       <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                 </LineChart>
//               </ResponsiveContainer>
//               <div className="flex justify-around">
//                 {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
//                   (month) => (
//                     <p
//                       key={month}
//                       className="text-[#A78BFA] text-[12px] sm:text-[13px] font-bold tracking-tight"
//                     >
//                       {month}
//                     </p>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//             <p className="text-[#6B46C1] text-base font-medium">
//               Job Postings by Industry
//             </p>
//             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
//               +8%
//             </p>
//             <div className="flex gap-1">
//               <p className="text-[#A78BFA] text-base font-normal">
//                 Last Quarter
//               </p>
//               <p className="text-[#059669] text-base font-medium">+8%</p>
//             </div>
//             <div className="min-h-[160px] sm:min-h-[180px] mt-4">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={jobPostingsData}
//                   margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
//                 >
//                   <XAxis dataKey="industry" stroke="#A78BFA" fontSize={12} />
//                   <YAxis stroke="#A78BFA" fontSize={12} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#FFFFFF",
//                       borderColor: "#E9D5FF",
//                       color: "#6B46C1",
//                     }}
//                     cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
//                     animationDuration={300}
//                   />
//                   <Bar
//                     dataKey="count"
//                     fill="#6B46C1"
//                     radius={[4, 4, 0, 0]}
//                     animationDuration={1200}
//                     animationEasing="ease-in-out"
//                   >
//                     <LabelList
//                       dataKey="count"
//                       position="top"
//                       formatter={(value) => `${value}%`}
//                       style={{
//                         fill: "#6B46C1",
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                       }}
//                       className="text-xs sm:text-sm"
//                     />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AtsScreenBrackDown;
// //         </h2>
// //         <div className="flex flex-wrap gap-4 px-4 py-6">
// //           <ScoreCard title="Keyword Match" value="80%" />
// //           <ScoreCard title="Skill Match" value="70%" />
// //           <ScoreCard title="Experience & Education Match" value="75%" />
// //           <ScoreCard title="Formatting Quality" value="85%" />
// //         </div>
// //         <h2 className="text-[#6B46C1] text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
// //           Improvement Tips
// //         </h2>
// //         <div className="flex flex-col gap-2">
// //           <ImprovementTip
// //             icon={
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 width="24"
// //                 height="24"
// //                 fill="currentColor"
// //                 viewBox="0 0 256 256"
// //               >
// //                 <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
// //               </svg>
// //             }
// //             title="Keyword Match"
// //             subtitle="Keywords: Project Management, Agile, Scrum, Leadership"
// //             description="Ensure all relevant keywords from the job description are included in your resume, especially in the skills and experience sections."
// //           />
// //           <ImprovementTip
// //             icon={
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 width="24"
// //                 height="24"
// //                 fill="currentColor"
// //                 viewBox="0 0 256 256"
// //               >
// //                 <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,0,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"></path>
// //               </svg>
// //             }
// //             title="Skill Match"
// //             subtitle="Skills: Communication, Problem-Solving, Teamwork, Time Management"
// //             description="Highlight your core skills that align with the job requirements. Use action verbs to describe how you've applied these skills."
// //           />
// //           <ImprovementTip
// //             icon={
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 width="24"
// //                 height="24"
// //                 fill="currentColor"
// //                 viewBox="0 0 256 256"
// //               >
// //                 <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
// //               </svg>
// //             }
// //             title="Experience & Education Match"
// //             subtitle="Experience: 5+ years in project management, led cross-functional teams"
// //             description="Clearly outline your work experience and educational background. Ensure dates, job titles, and company names are accurate and consistent."
// //           />
// //           <ImprovementTip
// //             icon={
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 width="24"
// //                 height="24"
// //                 fill="currentColor"
// //                 viewBox="0 0 256 256"
// //               >
// //                 <path d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z"></path>
// //               </svg>
// //             }
// //             title="Formatting Quality"
// //             subtitle="Format: Use a standard resume template, ensure consistent spacing and margins"
// //             description="Maintain a clean and professional format. Use bullet points, clear headings, and appropriate font sizes. Avoid excessive use of graphics or colors."
// //           />
// //         </div>
// //         <div className="flex px-4 py-3 justify-end">
// //           <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#6B46C1] text-white text-sm font-bold hover:bg-[#A78BFA] transition-colors">
// //             <span className="truncate">Apply Changes</span>
// //           </button>
// //         </div>
// //         <h2 className="text-[#6B46C1] text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
// //           Platform Usage
// //         </h2>
// //         <div className="flex flex-wrap gap-4 px-4 py-6">
// //           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
// //             <p className="text-[#6B46C1] text-base font-medium">
// //               User Activity Over Time
// //             </p>
// //             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
// //               +15%
// //             </p>
// //             <div className="flex gap-1">
// //               <p className="text-[#A78BFA] text-base font-normal">
// //                 Last 30 Days
// //               </p>
// //               <p className="text-[#059669] text-base font-medium">+15%</p>
// //             </div>
// //             <div className="flex min-h-[160px] sm:min-h-[180px] flex-1 flex-col gap-8 py-4">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart
// //                   data={userActivityData}
// //                   margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
// //                   onClick={handleLineClick}
// //                   style={{ cursor: "pointer" }}
// //                 >
// //                   <XAxis dataKey="month" stroke="#A78BFA" fontSize={12} />
// //                   <YAxis stroke="#A78BFA" fontSize={12} />
// //                   <Tooltip
// //                     contentStyle={{
// //                       backgroundColor: "#FFFFFF",
// //                       borderColor: "#E9D5FF",
// //                       color: "#6B46C1",
// //                     }}
// //                     cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
// //                     animationDuration={300}
// //                   />
// //                   <Line
// //                     type="monotone"
// //                     dataKey="activity"
// //                     stroke="#6B46C1"
// //                     strokeWidth={3}
// //                     fill="url(#lineGradient)"
// //                     dot={{
// //                       r: 5,
// //                       fill: "#6B46C1",
// //                       stroke: "#FFFFFF",
// //                       strokeWidth: 2,
// //                     }}
// //                     activeDot={{
// //                       r: 8,
// //                       fill: "#A78BFA",
// //                       stroke: "#FFFFFF",
// //                       strokeWidth: 2,
// //                     }}
// //                     animationDuration={1200}
// //                     animationEasing="ease-in-out"
// //                   />
// //                   <defs>
// //                     <linearGradient
// //                       id="lineGradient"
// //                       x1="0"
// //                       y1="0"
// //                       x2="0"
// //                       y2="1"
// //                     >
// //                       <stop offset="0%" stopColor="#E9D5FF" />
// //                       <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0} />
// //                     </linearGradient>
// //                   </defs>
// //                 </LineChart>
// //               </ResponsiveContainer>
// //               <div className="flex justify-around">
// //                 {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
// //                   (month) => (
// //                     <p
// //                       key={month}
// //                       className="text-[#A78BFA] text-[12px] sm:text-[13px] font-bold tracking-tight"
// //                     >
// //                       {month}
// //                     </p>
// //                   )
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
// //             <p className="text-[#6B46C1] text-base font-medium">
// //               Job Postings by Industry
// //             </p>
// //             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
// //               +8%
// //             </p>
// //             <div className="flex gap-1">
// //               <p className="text-[#A78BFA] text-base font-normal">
// //                 Last Quarter
// //               </p>
// //               <p className="text-[#059669] text-base font-medium">+8%</p>
// //             </div>
// //             <div className="min-h-[160px] sm:min-h-[180px] mt-4">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart
// //                   data={jobPostingsData}
// //                   margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
// //                 >
// //                   <XAxis dataKey="industry" stroke="#A78BFA" fontSize={12} />
// //                   <YAxis stroke="#A78BFA" fontSize={12} />
// //                   <Tooltip
// //                     contentStyle={{
// //                       backgroundColor: "#FFFFFF",
// //                       borderColor: "#E9D5FF",
// //                       color: "#6B46C1",
// //                     }}
// //                     cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
// //                     animationDuration={300}
// //                   />
// //                   <Bar
// //                     dataKey="count"
// //                     fill="#6B46C1"
// //                     radius={[4, 4, 0, 0]}
// //                     animationDuration={1200}
// //                     animationEasing="ease-in-out"
// //                   >
// //                     <LabelList
// //                       dataKey="count"
// //                       position="top"
// //                       formatter={(value) => `${value}%`}
// //                       style={{
// //                         fill: "#6B46C1",
// //                         fontSize: "12px",
// //                         fontWeight: "bold",
// //                       }}
// //                       className="text-xs sm:text-sm"
// //                     />
// //                   </Bar>
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <style jsx>{`
// //         @keyframes fadeIn {
// //           0% {
// //             opacity: 0;
// //             transform: translateY(30px) scale(0.98);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: translateY(0) scale(1);
// //           }
// //         }
// //         .animate-fadeIn {
// //           animation: fadeIn 0.8s ease-out forwards;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }


// // export default AtsScreenBrackDown;


// import React from "react";
// import { useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// function ScoreCard({ title, value, description }) {
//   return (
//     <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg p-6 border border-purple-200 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//       <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//       <p className="text-[#6B46C1] text-[32px] font-bold tracking-tight truncate">
//         {value}
//       </p>
//       <p className="text-[#A78BFA] text-base font-normal">Current</p>
//       <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
//         <div
//           className="border-[#A78BFA] bg-[#E9D5FF] border-t-2 w-full"
//           style={{ height: `${value}` }}
//         ></div>
//         <p className="text-[#A78BFA] text-[13px] font-bold tracking-tight">
//           {title.split(" ")[0]}
//         </p>
//       </div>
//     </div>
//   );
// }

// function ImprovementTip({ icon, title, subtitle, description }) {
//   return (
//     <div className="flex gap-4 bg-white px-4 py-3">
//       <div className="text-[#6B46C1] flex items-center justify-center rounded-lg bg-purple-100 shrink-0 w-12 h-12">
//         {icon}
//       </div>
//       <div className="flex flex-1 flex-col justify-center">
//         <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//         <p className="text-[#A78BFA] text-sm font-normal">{subtitle}</p>
//         <p className="text-[#A78BFA] text-sm font-normal">{description}</p>
//       </div>
//     </div>
//   );
// }

// function AtsScreenBrackDown({ atsData }) {
//   // Add loading state and null check
//   if (!atsData || !atsData.analysis) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-[#6B46C1] text-xl">Loading analysis data...</p>
//       </div>
//     );
//   }

//   // Safe destructuring with default values
//   const {
//     analysis: {
//       ai_output = '',
//       result = {
//         ATSScore: 0,
//         KeywordMatch: 0,
// //           <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#6B46C1] text-white text-sm font-bold hover:bg-[#A78BFA] transition-colors">
// //             <span className="truncate">Apply Changes</span>
// //           </button>
// //         </div>
// //         <h2 className="text-[#6B46C1] text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
// //           Platform Usage
// //         </h2>
// //         <div className="flex flex-wrap gap-4 px-4 py-6">
// //           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
// //             <p className="text-[#6B46C1] text-base font-medium">
// //               User Activity Over Time
// //             </p>
// //             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
// //               +15%
// //             </p>
// //             <div className="flex gap-1">
// //               <p className="text-[#A78BFA] text-base font-normal">
// //                 Last 30 Days
// //               </p>
// //               <p className="text-[#059669] text-base font-medium">+15%</p>
// //             </div>
// //             <div className="flex min-h-[160px] sm:min-h-[180px] flex-1 flex-col gap-8 py-4">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart
// //                   data={userActivityData}
// //                   margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
// //                   onClick={handleLineClick}
// //                   style={{ cursor: "pointer" }}
// //                 >
// //                   <XAxis dataKey="month" stroke="#A78BFA" fontSize={12} />
// //                   <YAxis stroke="#A78BFA" fontSize={12} />
// //                   <Tooltip
// //                     contentStyle={{
// //                       backgroundColor: "#FFFFFF",
// //                       borderColor: "#E9D5FF",
// //                       color: "#6B46C1",
// //                     }}
// //                     cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
// //                     animationDuration={300}
// //                   />
// //                   <Line
// //                     type="monotone"
// //                     dataKey="activity"
// //                     stroke="#6B46C1"
// //                     strokeWidth={3}
// //                     fill="url(#lineGradient)"
// //                     dot={{
// //                       r: 5,
// //                       fill: "#6B46C1",
// //                       stroke: "#FFFFFF",
// //                       strokeWidth: 2,
// //                     }}
// //                     activeDot={{
// //                       r: 8,
// //                       fill: "#A78BFA",
// //                       stroke: "#FFFFFF",
// //                       strokeWidth: 2,
// //                     }}
// //                     animationDuration={1200}
// //                     animationEasing="ease-in-out"
// //                   />
// //                   <defs>
// //                     <linearGradient
// //                       id="lineGradient"
// //                       x1="0"
// //                       y1="0"
// //                       x2="0"
// //                       y2="1"
// //                     >
// //                       <stop offset="0%" stopColor="#E9D5FF" />
// //                       <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0} />
// //                     </linearGradient>
// //                   </defs>
// //                 </LineChart>
// //               </ResponsiveContainer>
// //               <div className="flex justify-around">
// //                 {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
// //                   (month) => (
// //                     <p
// //                       key={month}
// //                       className="text-[#A78BFA] text-[12px] sm:text-[13px] font-bold tracking-tight"
// //                     >
// //                       {month}
// //                     </p>
// //                   )
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
// //             <p className="text-[#6B46C1] text-base font-medium">
// //               Job Postings by Industry
// //             </p>
// //             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
// //               +8%
// //             </p>
// //             <div className="flex gap-1">
// //               <p className="text-[#A78BFA] text-base font-normal">
// //                 Last Quarter
// //               </p>
// //               <p className="text-[#059669] text-base font-medium">+8%</p>
// //             </div>
// //             <div className="min-h-[160px] sm:min-h-[180px] mt-4">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart
// //                   data={jobPostingsData}
// //                   margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
// //                 >
// //                   <XAxis dataKey="industry" stroke="#A78BFA" fontSize={12} />
// //                   <YAxis stroke="#A78BFA" fontSize={12} />
// //                   <Tooltip
// //                     contentStyle={{
// //                       backgroundColor: "#FFFFFF",
// //                       borderColor: "#E9D5FF",
// //                       color: "#6B46C1",
// //                     }}
// //                     cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
// //                     animationDuration={300}
// //                   />
// //                   <Bar
// //                     dataKey="count"
// //                     fill="#6B46C1"
// //                     radius={[4, 4, 0, 0]}
// //                     animationDuration={1200}
// //                     animationEasing="ease-in-out"
// //                   >
// //                     <LabelList
// //                       dataKey="count"
// //                       position="top"
// //                       formatter={(value) => `${value}%`}
// //                       style={{
// //                         fill: "#6B46C1",
// //                         fontSize: "12px",
// //                         fontWeight: "bold",
// //                       }}
// //                       className="text-xs sm:text-sm"
// //                     />
// //                   </Bar>
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <style jsx>{`
// //         @keyframes fadeIn {
// //           0% {
// //             opacity: 0;
// //             transform: translateY(30px) scale(0.98);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: translateY(0) scale(1);
// //           }
// //         }
// //         .animate-fadeIn {
// //           animation: fadeIn 0.8s ease-out forwards;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }


// // export default AtsScreenBrackDown;






// import React from "react";
// import { useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// function ScoreCard({ title, value, description }) {
//   return (
//     <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg p-6 border border-purple-200 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//       <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//       <p className="text-[#6B46C1] text-[32px] font-bold tracking-tight truncate">
//         {value}
//       </p>
//       <p className="text-[#A78BFA] text-base font-normal">Current</p>
//       <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
//         <div
//           className="border-[#A78BFA] bg-[#E9D5FF] border-t-2 w-full"
//           style={{ height: `${value}` }}
//         ></div>
//         <p className="text-[#A78BFA] text-[13px] font-bold tracking-tight">
//           {title.split(" ")[0]}
//         </p>
//       </div>
//     </div>
//   );
// }

// function ImprovementTip({ icon, title, subtitle, description }) {
//   return (
//     <div className="flex gap-4 bg-white px-4 py-3">
//       <div className="text-[#6B46C1] flex items-center justify-center rounded-lg bg-purple-100 shrink-0 w-12 h-12">
//         {icon}
//       </div>
//       <div className="flex flex-1 flex-col justify-center">
//         <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//         <p className="text-[#A78BFA] text-sm font-normal">{subtitle}</p>
//         <p className="text-[#A78BFA] text-sm font-normal">{description}</p>
//       </div>
//     </div>
//   );
// }

// function AtsScreenBrackDown({ atsData }) {
//   // Add loading state and null check
//   if (!atsData || !atsData.analysis) {
//     console.warn("atsData or atsData.analysis is missing:", atsData);
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-[#6B46C1] text-xl">Loading analysis data...</p>
//       </div>
//     );
//   }

//   // Safe destructuring with default values
//   const {
//     analysis: {
//       ai_output = "",
//       result = {
//         "ATS Score": 0,
//         "Keyword Match": 0,
//         "Skill Match": 0,
//         "Experience and Education Match": 0,
//         "Formatting Quality": 0,
//       },
//     } = {},
//   } = atsData;

//   // Destructure result with aliases to match received keys
//   const {
//     "ATS Score": ATSScore = 0,
//     "Keyword Match": KeywordMatch = 0,
//     "Skill Match": SkillMatch = 0,
//     "Experience and Education Match": ExperienceAndEducationMatch = 0,
//     "Formatting Quality": FormattingQuality = 0,
//   } = result || {};

//   // Log for debugging
//   console.log("Parsed ATS Data:", {
//     ATSScore,
//     KeywordMatch,
//     SkillMatch,
//     ExperienceAndEducationMatch,
//     FormattingQuality,
//     ai_output,
//   });

//   const userActivityData = [
//     { month: "Jan", activity: 50 },
//     { month: "Feb", activity: 70 },
//     { month: "Mar", activity: 60 },
//     { month: "Apr", activity: 90 },
//     { month: "May", activity: 80 },
//     { month: "Jun", activity: 110 },
//     { month: "Jul", activity: 120 },
//   ];

//   const jobPostingsData = [
//     { industry: "Tech", count: 10 },
//     { industry: "Healthcare", count: 30 },
//     { industry: "Finance", count: 80 },
//     { industry: "Retail", count: 50 },
//     { industry: "Education", count: 90 },
//     { industry: "Manufacturing", count: 40 },
//     { industry: "Other", count: 20 },
//   ];

//   const handleLineClick = (data) => {
//     if (data && data.activePayload && data.activePayload[0]) {
//       const { month, activity } = data.activePayload[0].payload;
//       toast.info(`Activity in ${month}: ${activity}`, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "light",
//         style: {
//           backgroundColor: "#FFFFFF",
//           color: "#6B46C1",
//           border: "1px solid #E9D5FF",
//         },
//       });
//     }
//   };

//   const extractList = (text, startMarker, endMarker) => {
//     if (typeof text !== "string") {
//       console.warn(`Expected string for ai_output, received: ${typeof text}`);
//       return [];
//     }
//     const section = text.split(startMarker)[1]?.split(endMarker)[0] || "";
//     return section
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line.startsWith("-"))
//       .map((line) => line.replace(/^-\s*/, ""));
//   };

//   // Helper to parse missing keywords
//   const parseMissingKeywords = (text) => {
//     if (!Array.isArray(text)) {
//       console.warn(`Expected array for missing keywords, received: ${typeof text}`);
//       return [];
//     }
//     return text
//       .map((line) => {
//         if (typeof line !== "string") return null;
//         const match = line.match(
//           /(.+?) \(type: (.+?), years required: (.+?), context: "(.+?)"\)/
//         );
//         if (!match) return null;
//         const [, keyword, type, years, context] = match;
//         return { keyword, type, years, context };
//       })
//       .filter(Boolean);
//   };

//   const matchedKeywords = extractList(ai_output, "Matched Keywords:", "Missing Keywords:");
//   const missingKeywordLines = extractList(ai_output, "Missing Keywords:", "Improvement Tips:");
//   const missingKeywords = parseMissingKeywords(missingKeywordLines);
//   const improvementTips = extractList(ai_output, "Improvement Tips:", "Feedback Report:");
//   const feedback =
//     typeof ai_output === "string" && ai_output.includes("Feedback Report:")
//       ? ai_output.split("Feedback Report:")[1]?.trim() || ""
//       : "";

//   return (
//     <div>
//       <div className="flex justify-center py-6 px-4 sm:px-10 lg:px-40">
//         <div className="flex flex-col max-w-[960px] w-full animate-fadeIn space-y-8">
//           <ToastContainer />

//           {/* Header */}
//           <div className="flex flex-wrap justify-between gap-3 px-4">
//             <div className="flex min-w-[280px] flex-col gap-2">
//               <p className="text-[#6B46C1] text-4xl sm:text-4xl font-bold tracking-tight">
//                 ATS Score Breakdown
//               </p>
//               <p className="text-[#A78BFA] text-sm sm:text-base font-medium">
//                 Here's a detailed look at how your resume performs against the job description.
//               </p>
//             </div>
//             <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#6B46C1] text-white text-sm font-bold hover:bg-[#A78BFA] transition-colors">
//               <span className="truncate">Apply Changes</span>
//             </button>
//           </div>

//           {/* Overall Score */}
//           <div className="px-4 space-y-4">
//             <h2 className="text-[#6B46C1] text-2xl sm:text-3xl font-semibold">
//               Overall Score
//             </h2>
//             <div className="flex flex-col gap-3">
//               <div className="flex justify-between items-center">
//                 <p className="text-[#6B46C1] font-medium text-base sm:text-lg">ATS Score</p>
//                 <p className="text-[#6B46C1] text-sm sm:text-base">{ATSScore}%</p>
//               </div>
//               <div className="w-full bg-[#E9D5FF] h-3 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-[#6B46C1] transition-all duration-700 ease-out"
//                   style={{ width: `${ATSScore}%` }}
//                 ></div>
//               </div>
//               <p className="text-[#A78BFA] text-sm font-normal">
//                 Your resume is well-optimized for ATS. Consider refining specific areas for even better performance.
//               </p>
//             </div>
//           </div>

//           {/* Category Scores */}
//           <div className="px-4 space-y-4">
//             <h2 className="text-[#6B46C1] text-2xl sm:text-3xl font-semibold">
//               Category Scores
//             </h2>
//             <div className="flex flex-wrap gap-4">
//               <ScoreCard title="Keyword Match" value={`${KeywordMatch}%`} />
//               <ScoreCard title="Skill Match" value={`${SkillMatch}%`} />
//               <ScoreCard title="Experience & Education Match" value={`${ExperienceAndEducationMatch}%`} />
//               <ScoreCard title="Formatting Quality" value={`${FormattingQuality}%`} />
//             </div>
//           </div>

//           {/* Matched Keywords */}
//           <section className="px-4 space-y-2">
//             <h2 className="text-2xl font-semibold text-[#6B46C1]">Matched Keywords</h2>
//             {matchedKeywords.length > 0 ? (
//               <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
//                 {matchedKeywords.map((kw, i) => (
//                   <li className="text-lg" key={i}>{kw}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-700 text-sm">No matched keywords found.</p>
//             )}
//           </section>

//           {/* Missing Keywords */}
//           <section className="px-4 space-y-4">
//             <h2 className="text-2xl font-semibold text-red-500">Missing Keywords</h2>
//             {missingKeywords.length > 0 ? (
//               <div className="space-y-3">
//                 {missingKeywords.map((item, i) => (
//                   <div key={i} className="border p-4 rounded bg-red-50 shadow-sm space-y-1">
//                     <p className="text-md font-medium text-gray-800">
//                       {item.keyword}{" "}
//                       <span className="text-base text-gray-500">
//                         ({item.type}, {item.years} years)
//                       </span>
//                     </p>
//                     <p className="text-sm text-gray-600 italic">Context: {item.context}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-700 text-sm">No missing keywords found.</p>
//             )}
//           </section>

//           {/* Improvement Tips */}
//           <section className="px-4 space-y-4">
//             <h2 className="text-2xl font-semibold text-[#6B46C1]">Improvement Tips</h2>
//             {improvementTips.length > 0 ? (
//               <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
//                 {improvementTips.map((tip, i) => (
//                   <li className="text-base" key={i}>{tip}</li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 <ImprovementTip
//                   icon={
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       fill="currentColor"
//                       viewBox="0 0 256 256"
//                     >
//                       <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
//                     </svg>
//                   }
//                   title="Keyword Match"
//                   subtitle="Keywords: Project Management, Agile, Scrum, Leadership"
//                   description="Ensure all relevant keywords from the job description are included in your resume, especially in the skills and experience sections."
//                 />
//                 <ImprovementTip
//                   icon={
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       fill="currentColor"
//                       viewBox="0 0 256 256"
//                     >
//                       <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,0,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"></path>
//                     </svg>
//                   }
//                   title="Skill Match"
//                   subtitle="Skills: Communication, Problem-Solving, Teamwork, Time Management"
//                   description="Highlight your core skills that align with the job requirements. Use action verbs to describe how you've applied these skills."
//                 />
//                 <ImprovementTip
//                   icon={
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       fill="currentColor"
//                       viewBox="0 0 256 256"
//                     >
//                       <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
//                     </svg>
//                   }
//                   title="Experience & Education Match"
//                   subtitle="Experience: 5+ years in project management, led cross-functional teams"
//                   description="Clearly outline your work experience and educational background. Ensure dates, job titles, and company names are accurate and consistent."
//                 />
//                 <ImprovementTip
//                   icon={
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       fill="currentColor"
//                       viewBox="0 0 256 256"
//                     >
//                       <path d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z"></path>
//                     </svg>
//                   }
//                   title="Formatting Quality"
//                   subtitle="Format: Use a standard resume template, ensure consistent spacing and margins"
//                   description="Maintain a clean and professional format. Use bullet points, clear headings, and appropriate font sizes. Avoid excessive use of graphics or colors."
//                 />
//               </div>
//             )}
//           </section>

//           {/* Feedback */}
//           <section className="px-4 space-y-2 pb-10">
//             <h2 className="text-2xl font-semibold text-[#6B46C1]">Feedback Report</h2>
//             <p className="whitespace-pre-line text-gray-700 text-base">
//               {feedback || "No feedback available."}
//             </p>
//           </section>

//           {/* Platform Usage */}
//           <section className="px-4 space-y-4">
//             <h2 className="text-[#6B46C1] text-[22px] font-bold tracking-tight">
//               Platform Usage
//             </h2>
//             <div className="flex flex-wrap gap-4 py-6">
//               <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-[#6B46C1] text-base font-medium">
//                   User Activity Over Time
//                 </p>
//                 <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
//                   +15%
//                 </p>
//                 <div className="flex gap-1">
//                   <p className="text-[#A78BFA] text-base font-normal">
//                     Last 30 Days
//                   </p>
//                   <p className="text-[#059669] text-base font-medium">+15%</p>
//                 </div>
//                 <div className="flex min-h-[160px] sm:min-h-[180px] flex-1 flex-col gap-8 py-4">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart
//                       data={userActivityData}
//                       margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
//                       onClick={handleLineClick}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <XAxis dataKey="month" stroke="#A78BFA" fontSize={12} />
//                       <YAxis stroke="#A78BFA" fontSize={12} />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#FFFFFF",
//                           borderColor: "#E9D5FF",
//                           color: "#6B46C1",
//                         }}
//                         cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
//                         animationDuration={300}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="activity"
//                         stroke="#6B46C1"
//                         strokeWidth={3}
//                         fill="url(#lineGradient)"
//                         dot={{
//                           r: 5,
//                           fill: "#6B46C1",
//                           stroke: "#FFFFFF",
//                           strokeWidth: 2,
//                         }}
//                         activeDot={{
//                           r: 8,
//                           fill: "#A78BFA",
//                           stroke: "#FFFFFF",
//                           strokeWidth: 2,
//                         }}
//                         animationDuration={1200}
//                         animationEasing="ease-in-out"
//                       />
//                       <defs>
//                         <linearGradient
//                           id="lineGradient"
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop offset="0%" stopColor="#E9D5FF" />
//                           <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0} />
//                         </linearGradient>
//                       </defs>
//                     </LineChart>
//                   </ResponsiveContainer>
//                   <div className="flex justify-around">
//                     {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
//                       (month) => (
//                         <p
//                           key={month}
//                           className="text-[#A78BFA] text-[12px] sm:text-[13px] font-bold tracking-tight"
//                         >
//                           {month}
//                         </p>
//                       )
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-[#6B46C1] text-base font-medium">
//                   Job Postings by Industry
//                 </p>
//                 <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
//                   +8%
//                 </p>
//                 <div className="flex gap-1">
//                   <p className="text-[#A78BFA] text-base font-normal">
//                     Last Quarter
//                   </p>
//                   <p className="text-[#059669] text-base font-medium">+8%</p>
//                 </div>
//                 <div className="min-h-[160px] sm:min-h-[180px] mt-4">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={jobPostingsData}
//                       margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
//                     >
//                       <XAxis dataKey="industry" stroke="#A78BFA" fontSize={12} />
//                       <YAxis stroke="#A78BFA" fontSize={12} />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#FFFFFF",
//                           borderColor: "#E9D5FF",
//                           color: "#6B46C1",
//                         }}
//                         cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
//                         animationDuration={300}
//                       />
//                       <Bar
//                         dataKey="count"
//                         fill="#6B46C1"
//                         radius={[4, 4, 0, 0]}
//                         animationDuration={1200}
//                         animationEasing="ease-in-out"
//                       >
//                         <LabelList
//                           dataKey="count"
//                           position="top"
//                           formatter={(value) => `${value}%`}
//                           style={{
//                             fill: "#6B46C1",
//                             fontSize: "12px",
//                             fontWeight: "bold",
//                           }}
//                           className="text-xs sm:text-sm"
//                         />
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* Fade In Animation */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           0% {
//             opacity: 0;
//             transform: translateY(30px) scale(0.98);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.8s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default AtsScreenBrackDown;


import React from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function ScoreCard({ title, value, description }) {
  return (
    <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg p-6 border border-purple-200 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
      <p className="text-[#6B46C1] text-base font-medium">{title}</p>
      <p className="text-[#6B46C1] text-[32px] font-bold tracking-tight truncate">
        {value}
      </p>
      <p className="text-[#A78BFA] text-base font-normal">Current</p>
      <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
        <div
          className="border-[#A78BFA] bg-[#E9D5FF] border-t-2 w-full"
          style={{ height: `${value}` }}
        ></div>
        <p className="text-[#A78BFA] text-[13px] font-bold tracking-tight">
          {title.split(" ")[0]}
        </p>
      </div>
    </div>
  );
}

function ImprovementTip({ icon, title, subtitle, description }) {
  return (
    <div className="flex gap-4 bg-white px-4 py-3">
      <div className="text-[#6B46C1] flex items-center justify-center rounded-lg bg-purple-100 shrink-0 w-12 h-12">
        {icon}
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[#6B46C1] text-base font-medium">{title}</p>
        <p className="text-[#A78BFA] text-sm font-normal">{subtitle}</p>
        <p className="text-[#A78BFA] text-sm font-normal">{description}</p>
      </div>
    </div>
  );
}

function AtsScreenBrackDown({ atsData }) {
  // Add loading state and null check
  if (!atsData || !atsData.analysis) {
    console.warn("atsData or atsData.analysis is missing:", atsData);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#6B46C1] text-xl">Loading analysis data...</p>
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

  return (
    <div>
      <div className="flex justify-center py-6 px-4 sm:px-10 lg:px-40">
        <div className="flex flex-col max-w-[960px] w-full animate-fadeIn space-y-8">
          <ToastContainer />

          {/* Header */}
          <div className="flex flex-wrap justify-between gap-3 px-4">
            <div className="flex min-w-[280px] flex-col gap-2">
              <p className="text-[#6B46C1] text-4xl sm:text-4xl font-bold tracking-tight">
                ATS Score Breakdown
              </p>
              <p className="text-[#A78BFA] text-sm sm:text-base font-medium">
                Here's a detailed look at how your resume performs against the job description.
              </p>
            </div>
            {/* <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#6B46C1] text-white text-sm font-bold hover:bg-[#A78BFA] transition-colors">
              <span className="truncate">Apply Changes</span>
            </button> */}
          </div>

          {/* Overall Score */}
          <div className="px-4 space-y-4">
            <h2 className="text-[#6B46C1] text-2xl sm:text-3xl font-semibold">
              Overall Score
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-[#6B46C1] font-medium text-base sm:text-lg">ATS Score</p>
                <p className="text-[#6B46C1] text-sm sm:text-base">{ATSScore}%</p>
              </div>
              <div className="w-full bg-[#E9D5FF] h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6B46C1] transition-all duration-700 ease-out"
                  style={{ width: `${ATSScore}%` }}
                ></div>
              </div>
              <p className="text-[#A78BFA] text-sm font-normal">
                Your resume is well-optimized for ATS. Consider refining specific areas for even better performance.
              </p>
            </div>
          </div>

          {/* Category Scores */}
          <div className="px-4 space-y-4">
            <h2 className="text-[#6B46C1] text-2xl sm:text-3xl font-semibold">
              Category Scores
            </h2>
            <div className="flex flex-wrap gap-4">
              <ScoreCard title="Keyword Match" value={`${KeywordMatch}%`} />
              <ScoreCard title="Skill Match" value={`${SkillMatch}%`} />
              <ScoreCard title="Experience & Education Match" value={`${ExperienceAndEducationMatch}%`} />
              <ScoreCard title="Formatting Quality" value={`${FormattingQuality}%`} />
            </div>
          </div>

          {/* Improvement Tips */}
          <section className="px-4 space-y-4">
            <h2 className="text-2xl font-semibold text-[#6B46C1]">Improvement Tips</h2>
            {improvementTips.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {improvementTips.map((tip, i) => (
                  <li className="text-base" key={i}>{tip}</li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col gap-2">
                <ImprovementTip
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  }
                  title="Keyword Match"
                  subtitle="Keywords: Project Management, Agile, Scrum, Leadership"
                  description="Ensure all relevant keywords from the job description are included in your resume, especially in the skills and experience sections."
                />
                <ImprovementTip
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,0,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"></path>
                    </svg>
                  }
                  title="Skill Match"
                  subtitle="Skills: Communication, Problem-Solving, Teamwork, Time Management"
                  description="Highlight your core skills that align with the job requirements. Use action verbs to describe how you've applied these skills."
                />
                <ImprovementTip
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
                    </svg>
                  }
                  title="Experience & Education Match"
                  subtitle="Experience: 5+ years in project management, led cross-functional teams"
                  description="Clearly outline your work experience and educational background. Ensure dates, job titles, and company names are accurate and consistent."
                />
                <ImprovementTip
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z"></path>
                    </svg>
                  }
                  title="Formatting Quality"
                  subtitle="Format: Use a standard resume template, ensure consistent spacing and margins"
                  description="Maintain a clean and professional format. Use bullet points, clear headings, and appropriate font sizes. Avoid excessive use of graphics or colors."
                />
              </div>
            )}
          </section>

          {/* Feedback */}
          <section className="px-4 space-y-2 pb-10">
            <h2 className="text-2xl font-semibold text-[#6B46C1]">Feedback Report</h2>
            <p className="whitespace-pre-line text-gray-700 text-base">
              {feedback || "No feedback available."}
            </p>
          </section>
        </div>
      </div>

      {/* Fade In Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AtsScreenBrackDown;