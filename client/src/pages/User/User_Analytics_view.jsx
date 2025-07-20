// import React from "react";
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

// function StatsCard({ title, value }) {
//   return (
//     <div className="flex min-w-[140px] sm:min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-purple-200 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
//       <p className="text-[#6B46C1] text-base font-medium">{title}</p>
//       <p className="text-[#6B46C1] text-xl sm:text-2xl font-bold tracking-tight">
//         {value}
//       </p>
//     </div>
//   );
// }

// function UserAnalytics() {
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

//   return (
//     <div className="flex flex-1 justify-center py-5 px-4 sm:px-10 lg:px-40">
//       <div className="flex flex-col max-w-[960px] w-full animate-fadeIn">
//         <ToastContainer />
//         <div className="flex flex-wrap justify-between gap-3 p-4">
//           <div className="flex min-w-[280px] flex-col gap-3">
//             <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight">
//               Welcome back, Emily!
//             </p>
//             <p className="text-[#A78BFA] text-sm font-normal">
//               Here's a summary of your resume performance.
//             </p>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-4 p-4">
//           <StatsCard title="Latest Score" value="78%" />
//           <StatsCard title="Best Score" value="85%" />
//           <StatsCard title="Total Uploads" value="12" />
//         </div>
//         <div className="flex flex-wrap gap-4 px-4 py-6">
//           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-xl border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
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
//           <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-xl border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
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

// export default UserAnalytics;


import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Divider } from "@mui/material";

function StatsCard({ title, value }) {
  return (
    <div className="flex min-w-[140px] sm:min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-purple-200 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
      <p className="text-[#6B46C1] text-base font-medium">{title}</p>
      <p className="text-[#6B46C1] text-xl sm:text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function UserAnalytics() {
  const websiteVisitData = [
    { month: "Jan", visits: 150 },
    { month: "Feb", visits: 170 },
    { month: "Mar", visits: 160 },
    { month: "Apr", visits: 190 },
    { month: "May", visits: 180 },
    { month: "Jun", visits: 210 },
    { month: "Jul", visits: 220 },
  ];

  const jobApplicationsData = [
    { month: "Jan", applications: 5 },
    { month: "Feb", applications: 8 },
    { month: "Mar", applications: 12 },
    { month: "Apr", applications: 15 },
    { month: "May", applications: 10 },
    { month: "Jun", applications: 20 },
    { month: "Jul", applications: 25 },
  ];

  const handleLineClick = (data, chartType) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload;
      const key = chartType === "visits" ? "visits" : "applications";
      const label = chartType === "visits" ? "Visits" : "Applications";
      toast.info(`${label} in ${payload.month}: ${payload[key]}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          backgroundColor: "#FFFFFF",
          color: "#6B46C1",
          border: "1px solid #E9D5FF",
        },
      });
    }
  };

  return (
    <div className="flex flex-1 justify-center py-5 px-4 sm:px-10 lg:px-40">
      <div className="flex flex-col max-w-[960px] w-full animate-fadeIn">
        <ToastContainer />
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-[280px] flex-col gap-3">
            <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight">
              Welcome back, Emily!
            </p>
            <p className="text-[#A78BFA] text-sm font-normal">
              Here's a summary of your resume performance.
            </p>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="flex flex-wrap gap-4 p-4">
          <StatsCard title="Latest Score" value="78%" />
          <StatsCard title="Best Score" value="85%" />
          <StatsCard title="Total Uploads" value="12" />
        </div>
        <Divider className="my-4" />
        <div className="flex flex-wrap gap-4 px-4 py-6">
          <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-xl border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-[#6B46C1] text-base font-medium">
              Visit Count
            </p>
            <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
              15
            </p>
            <div className="flex gap-1">
              {/* <p className="text-[#A78BFA] text-base font-normal">
                Last 30 Days
              </p> */}
              {/* <p className="text-[#059669] text-base font-medium">+15%</p> */}
            </div>
            <div className="flex min-h-[160px] sm:min-h-[180px] flex-1 flex-col gap-8 py-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={websiteVisitData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  onClick={(data) => handleLineClick(data, "visits")}
                  style={{ cursor: "pointer" }}
                >
                  <XAxis dataKey="month" stroke="#A78BFA" fontSize={12} />
                  <YAxis stroke="#A78BFA" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E9D5FF",
                      color: "#6B46C1",
                    }}
                    cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#6B46C1"
                    strokeWidth={3}
                    fill="url(#lineGradient)"
                    dot={{
                      r: 5,
                      fill: "#6B46C1",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 8,
                      fill: "#A78BFA",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#E9D5FF" />
                      <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-xl border border-purple-200 p-4 sm:p-6 bg-gradient-to-br from-white to-[#E9D5FF] shadow-lg hover:shadow-[0_8px_24px_rgba(107,70,193,0.3)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-[#6B46C1] text-base font-medium">
              Jobs Applied
            </p>
            <p className="text-[#6B46C1] text-2xl sm:text-[32px] font-bold tracking-tight truncate">
              8
            </p>
            <div className="flex gap-1">
              {/* <p className="text-[#A78BFA] text-base font-normal">
                Last 30 Days
              </p>
              <p className="text-[#059669] text-base font-medium">+8%</p> */}
            </div>
            <div className="flex min-h-[160px] sm:min-h-[180px] flex-1 flex-col gap-8 py-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={jobApplicationsData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  onClick={(data) => handleLineClick(data, "applications")}
                  style={{ cursor: "pointer" }}
                >
                  <XAxis dataKey="month" stroke="#A78BFA" fontSize={12} />
                  <YAxis stroke="#A78BFA" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E9D5FF",
                      color: "#6B46C1",
                    }}
                    cursor={{ fill: "#E9D5FF", opacity: 0.3 }}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#6B46C1"
                    strokeWidth={3}
                    fill="url(#lineGradientJobs)"
                    dot={{
                      r: 5,
                      fill: "#6B46C1",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 8,
                      fill: "#A78BFA",
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                  <defs>
                    <linearGradient
                      id="lineGradientJobs"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#E9D5FF" />
                      <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
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

export default UserAnalytics;