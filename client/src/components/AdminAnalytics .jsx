import React from "react";
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

const AdminAnalytics = () => {
  // Sample data for charts
  const userActivityData = [
    { month: "Jan", activity: 50 },
    { month: "Feb", activity: 70 },
    { month: "Mar", activity: 60 },
    { month: "Apr", activity: 90 },
    { month: "May", activity: 80 },
    { month: "Jun", activity: 110 },
    { month: "Jul", activity: 120 },
  ];

  const jobPostingsData = [
    { industry: "Tech", count: 10 },
    { industry: "Healthcare", count: 30 },
    { industry: "Finance", count: 80 },
    { industry: "Retail", count: 50 },
    { industry: "Education", count: 90 },
    { industry: "Manufacturing", count: 40 },
    { industry: "Other", count: 20 },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#4a3c6e] to-white flex flex-col font-inter"
      style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}
    >
      <ToastContainer />

      <div className="flex flex-1 justify-center py-5 px-4 sm:px-10 lg:px-40">
        <div className="flex flex-col max-w-[960px] w-full animate-fadeIn">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <h2 className="text-[#4a3c6e] text-3xl sm:text-4xl font-bold tracking-tight">
              Analytics
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 p-4">
            {[
              { label: "Total Job Seekers", value: "12,345" },
              { label: "Total Recruiters", value: "678" },
              { label: "Total Jobs", value: "9,012" },
              { label: "Resumes Evaluated", value: "5,678" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-gradient-to-br from-white to-[#e8eaf6] shadow-lg hover:shadow-[0_8px_24px_rgba(74,60,110,0.3)] hover:-translate-y-1 transition-all duration-300"
              >
                <p className="text-[#4a3c6e] text-base font-medium">
                  {item.label}
                </p>
                <p className="text-[#4a3c6e] text-2xl font-bold tracking-tight">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <h2 className="text-[#4a3c6e] text-xl sm:text-2xl font-bold tracking-tight px-4 py-3">
            Platform Usage
          </h2>
          <div className="flex flex-wrap gap-4 px-4 py-6">
            {/* User Activity Over Time */}
            <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-xl border border-[#d1c4e9] p-6 bg-gradient-to-br from-white to-[#e8eaf6] shadow-lg hover:shadow-[0_8px_24px_rgba(74,60,110,0.3)] hover:-translate-y-1 transition-all duration-300">
              <p className="text-[#4a3c6e] text-base font-medium">
                User Activity Over Time
              </p>
              <p className="text-[#4a3c6e] text-3xl font-bold tracking-tight">
                +15%
              </p>
              <div className="flex gap-2">
                <p className="text-[#6e6388] text-base">Last 30 Days</p>
                <p className="text-[#078838] text-base font-medium">+15%</p>
              </div>
              <div className="min-h-[180px] sm:min-h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userActivityData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis dataKey="month" stroke="#6e6388" fontSize={12} />
                    <YAxis stroke="#6e6388" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#d1c4e9",
                        color: "#4a3c6e",
                      }}
                      cursor={{ fill: "#e8eaf6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activity"
                      stroke="#6e6388"
                      strokeWidth={3}
                      fill="url(#lineGradient)"
                      dot={false}
                    />
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#e8eaf6" />
                        <stop
                          offset="100%"
                          stopColor="#e8eaf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Job Postings by Industry */}
            <div className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-xl border border-[#d1c4e9] p-6 bg-gradient-to-br from-white to-[#e8eaf6] shadow-lg hover:shadow-[0_8px_24px_rgba(74,60,110,0.3)] hover:-translate-y-1 transition-all duration-300">
              <p className="text-[#4a3c6e] text-base font-medium">
                Job Postings by Industry
              </p>
              <p className="text-[#4a3c6e] text-3xl font-bold tracking-tight">
                +8%
              </p>
              <div className="flex gap-2">
                <p className="text-[#6e6388] text-base">Last Quarter</p>
                <p className="text-[#078838] text-base font-medium">+8%</p>
              </div>
              <div className="min-h-[180px] sm:min-h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={jobPostingsData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis dataKey="industry" stroke="#6e6388" fontSize={12} />
                    <YAxis stroke="#6e6388" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#d1c4e9",
                        color: "#4a3c6e",
                      }}
                      cursor={{ fill: "#e8eaf6" }}
                    />
                    <Bar dataKey="count" fill="#6e6388" radius={[4, 4, 0, 0]}>
                      <LabelList
                        dataKey="count"
                        position="top"
                        formatter={(value) => `${value}%`}
                        style={{
                          fill: "#4a3c6e",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                        className="text-xs sm:text-sm"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
};

export default AdminAnalytics;