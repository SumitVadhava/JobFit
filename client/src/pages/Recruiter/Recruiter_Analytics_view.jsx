import React, { useRef, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

const Recruiter_Analytics_view = () => {
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(478); // Default width

  // Data for charts
  const jobPostedData = [
    { month: "Jan", jobs: 12 },
    { month: "Feb", jobs: 8 },
    { month: "Mar", jobs: 15 },
    { month: "Apr", jobs: 10 },
    { month: "May", jobs: 18 },
    { month: "Jun", jobs: 20 },
  ];

  const userVisitedData = [
    { month: "Jan", visits: 120 },
    { month: "Feb", visits: 90 },
    { month: "Mar", visits: 150 },
    { month: "Apr", visits: 110 },
    { month: "May", visits: 180 },
    { month: "Jun", visits: 200 },
  ];

  // Handle responsive chart width
  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        setChartWidth(Math.min(containerWidth, 960)); // Cap at max content width
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  return (
    <div
      className="relative flex min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 justify-center py-5">
          <div
            ref={chartContainerRef}
            className="layout-content-container flex flex-col w-full max-w-[960px] flex-1"
          >
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 p-4 animate-fadeIn">
              <div className="flex min-w-[288px] flex-col gap-3">
                <h1 className="text-[#131118] text-[32px] font-bold leading-tight tracking-tight sm:text-[28px]">
                  Recruitment Analytics
                </h1>
                <p className="text-[#6e6388] text-sm font-normal leading-normal">
                  Track and analyze your recruitment performance
                </p>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="flex flex-wrap gap-4 p-4 animate-fadeIn">
              <Card title="Total Applicants" value="1,250" />
              <Card title="Top ATS Score" value="78%" />
              <Card
                title="Required Skills"
                value="Project Management, Communication, Leadership"
              />
            </div>

            {/* Application Trends Section */}
            <Section title="Job Posted Analytics">
              <div className="flex min-w-[288px] flex-1 flex-col gap-2 rounded-lg border border-[#dedce5] p-4 sm:p-6 bg-white">
                <p className="text-[#131118] text-base font-medium leading-normal">
                  Job Posted by You
                </p>
                <p className="text-[#131118] text-[32px] font-bold leading-tight truncate sm:text-[28px]">
                  {jobPostedData[jobPostedData.length - 1].jobs}
                </p>
                <div className="flex gap-1">
                  <p className="text-[#6e6388] text-base font-normal leading-normal">
                    Last 6 Months
                  </p>
                </div>
                <div className="min-h-[180px] w-full">
                  <LineChart
                    width={chartWidth - 32}
                    height={148}
                    data={jobPostedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid stroke="#dedce5" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fill: "#6e6388",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    />
                    <YAxis tick={{ fill: "#6e6388", fontSize: 13 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      stroke="#9d45ff" // Updated color
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </div>
              </div>
            </Section>

            {/* User Visited Section */}
            <Section title="User Visited Analytics">
              <div className="flex min-w-[288px] flex-1 flex-col gap-2 rounded-lg border border-[#dedce5] p-4 sm:p-6 bg-white">
                <p className="text-[#131118] text-base font-medium leading-normal">
                  User Visited Count
                </p>
                <p className="text-[#131118] text-[32px] font-bold leading-tight truncate sm:text-[28px]">
                  {userVisitedData[userVisitedData.length - 1].visits}
                </p>
                <div className="flex gap-1">
                  <p className="text-[#6e6388] text-base font-normal leading-normal">
                    Last 6 Months
                  </p>
                </div>
                <div className="min-h-[180px] w-full">
                  <LineChart
                    width={chartWidth - 32}
                    height={148}
                    data={userVisitedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid stroke="#dedce5" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fill: "#6e6388",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    />
                    <YAxis tick={{ fill: "#6e6388", fontSize: 13 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#a557fe" // Updated color
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </div>
              </div>
            </Section>

            {/* Candidate Qualifications Section */}
            {/* <Section title="Candidate Qualifications">
              <div className="flex min-w-[288px] flex-1 flex-col gap-2 rounded-lg border border-[#dedce5] p-4 sm:p-6 bg-white">
                <p className="text-[#131118] text-base font-medium leading-normal">
                  Common Skills
                </p>
                <p className="text-[#131118] text-[32px] font-bold leading-tight truncate sm:text-[28px]">
                  +10%
                </p>
                <div className="flex gap-1">
                  <p className="text-[#6e6388] text-base font-normal leading-normal">
                    This Quarter
                  </p>
                  <p className="text-[#078845] text-base font-medium leading-normal">
                    +10%
                  </p>
                </div>
                <div className="min-h-[200px] w-full">
                  <BarChart
                    width={chartWidth - 32}
                    height={200} // Increased height for more skills
                    data={candidateQualificationsData}
                    layout="vertical"
                    margin={{ top: 20, right: 40, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid stroke="#dedce5" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: "#6e6388", fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <YAxis
                      dataKey="skill"
                      type="category"
                      tick={{
                        fill: "#6e6388",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                      width={140} // Increased for longer skill names
                    />
                    <Tooltip />
                    <Bar
                      dataKey="percentage"
                      fill="#6e6388"
                      barSize={20} // Adjusted for proper spacing between horizontal bars
                    >
                      <LabelList
                        dataKey="percentage"
                        position="right"
                        formatter={(value) => `${value}%`}
                        style={{
                          fill: "#131118",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      />
                    </Bar>
                  </BarChart>
                </div>
              </div>
            </Section> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="px-4 pt-5 pb-3 animate-fadeIn">
    <h2 className="text-[#131118] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 sm:text-[20px]">
      {title}
    </h2>
    <div className="flex flex-wrap gap-4 py-3">{children}</div>
  </div>
);

const Card = ({ title, value }) => (
  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 sm:p-6 bg-[#f1f0f4] shadow-sm transition-transform hover:scale-[1.02] duration-200">
    <p className="text-[#131118] text-base font-medium leading-normal">
      {title}
    </p>
    <p className="text-[#131118] text-2xl font-bold leading-tight sm:text-xl">
      {value}
    </p>
  </div>
);

export default Recruiter_Analytics_view;
