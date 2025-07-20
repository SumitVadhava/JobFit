import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
  Award,
  MapPin,
  GraduationCap,
  Briefcase,
  ChevronDown,
} from "lucide-react";

// Sample data
const dummyCandidates = [
  {
    name: "Jane Doe",
    score: 85,
    experience: 3,
    skills: ["React", "Tailwind"],
    education: "B.Tech",
    location: "New York",
    status: "Available",
  },
  {
    name: "John Smith",
    score: 78,
    experience: 5,
    skills: ["Node.js", "Express"],
    education: "MCA",
    location: "San Francisco",
    status: "Interviewed",
  },
  {
    name: "Sara Lee",
    score: 92,
    experience: 4,
    skills: ["React", "Node.js"],
    education: "B.Sc",
    location: "Austin",
    status: "Available",
  },
  {
    name: "Michael Brown",
    score: 88,
    experience: 2,
    skills: ["JavaScript", "React"],
    education: "BCA",
    location: "Chicago",
    status: "Hired",
  },
  {
    name: "Emily Clark",
    score: 90,
    experience: 6,
    skills: ["Java", "Spring"],
    education: "M.Tech",
    location: "Boston",
    status: "Available",
  },
  {
    name: "Alice Johnson",
    score: 81,
    experience: 4,
    skills: ["Angular", "TypeScript"],
    education: "B.Tech",
    location: "Seattle",
    status: "Interviewed",
  },
  {
    name: "Robert Miles",
    score: 76,
    experience: 3,
    skills: ["Vue.js", "Pinia"],
    education: "MCA",
    location: "Denver",
    status: "Available",
  },
  {
    name: "Lucy Carter",
    score: 95,
    experience: 7,
    skills: ["React", "Node.js", "GraphQL"],
    education: "Ph.D",
    location: "Los Angeles",
    status: "Hired",
  },
  {
    name: "Kevin White",
    score: 83,
    experience: 5,
    skills: ["Python", "Django"],
    education: "B.Sc",
    location: "Miami",
    status: "Available",
  },
  {
    name: "Nina Roy",
    score: 89,
    experience: 2,
    skills: ["Flutter", "Dart"],
    education: "BCA",
    location: "Portland",
    status: "Interviewed",
  },
  ...Array.from({ length: 50 }, (_, i) => ({
    name: `Candidate ${i + 11}`,
    score: 70 + (i % 30),
    experience: (i % 6) + 1,
    skills: ["React", "Node.js"],
    education: ["B.Tech", "MCA", "B.Sc", "M.Tech", "Ph.D"][i % 5],
    location: ["New York", "San Francisco", "Austin", "Chicago", "Boston"][
      i % 5
    ],
    status: ["Available", "Interviewed", "Hired"][i % 3],
  })),
];

const getUniqueValues = (array, key) => {
  const values = array.flatMap((item) =>
    key === "skills" ? item[key] : [item[key]]
  );
  return [...new Set(values)];
};

const statusColors = {
  Available: {
    bg: "bg-green-50",
    color: "text-green-700",
    border: "border-green-200",
  },
  Interviewed: {
    bg: "bg-blue-50",
    color: "text-blue-700",
    border: "border-blue-200",
  },
  Hired: {
    bg: "bg-purple-50",
    color: "text-purple-700",
    border: "border-purple-200",
  },
};

const CandidatesView = () => {
  const [filters, setFilters] = useState({
    score: 0,
    experience: 0,
    skills: "",
    education: "",
    location: "",
    status: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const candidatesPerPage = 10;

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSliderChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      score: 0,
      experience: 0,
      skills: "",
      education: "",
      location: "",
      status: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredCandidates = dummyCandidates.filter((c) => {
    return (
      c.score >= filters.score &&
      c.experience >= filters.experience &&
      (!filters.skills || c.skills.includes(filters.skills)) &&
      (!filters.education || c.education === filters.education) &&
      (!filters.location || c.location === filters.location) &&
      (!filters.status || c.status === filters.status) &&
      (!filters.search ||
        c.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const indexOfLast = currentPage * candidatesPerPage;
  const indexOfFirst = indexOfLast - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  const Slider = ({ value, onChange, min = 0, max = 100, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #6B46C1 0%, #6B46C1 ${
              (value / max) * 100
            }%, #E5E7EB ${(value / max) * 100}%, #E5E7EB 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}</span>
          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
            {value}
          </span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );

  const Select = ({ value, onChange, options, placeholder, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-purple-200 rounded-lg shadow-sm hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-4 h-4 text-purple-600" />}
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-700"
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-700"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
        />
      </div>

      {/* Score Slider */}
      <Slider
        value={filters.score}
        onChange={(value) => handleSliderChange("score", value)}
        min={0}
        max={100}
        label="Minimum ATS Score"
      />

      {/* Experience Slider */}
      <Slider
        value={filters.experience}
        onChange={(value) => handleSliderChange("experience", value)}
        min={0}
        max={10}
        label="Minimum Experience (years)"
      />

      {/* Skills Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <Select
          value={filters.skills}
          onChange={(value) => handleFilterChange("skills", value)}
          options={getUniqueValues(dummyCandidates, "skills")}
          placeholder="Select skills"
          icon={Briefcase}
        />
      </div>

      {/* Education Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education
        </label>
        <Select
          value={filters.education}
          onChange={(value) => handleFilterChange("education", value)}
          options={getUniqueValues(dummyCandidates, "education")}
          placeholder="Select education"
          icon={GraduationCap}
        />
      </div>

      {/* Location Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <Select
          value={filters.location}
          onChange={(value) => handleFilterChange("location", value)}
          options={getUniqueValues(dummyCandidates, "location")}
          placeholder="Select location"
          icon={MapPin}
        />
      </div>

      {/* Status Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <Select
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          options={getUniqueValues(dummyCandidates, "status")}
          placeholder="Select status"
          icon={Users}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleClearFilters}
          className="flex-1 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium"
        >
          Clear
        </button>
        <button
          onClick={isMobile ? toggleFilterDrawer : undefined}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Mobile Filter Toggle */}
        <div className="flex justify-end mb-4 lg:hidden">
          <button
            onClick={toggleFilterDrawer}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            <Filter className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 xl:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <FilterSection />
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={toggleFilterDrawer}
              ></div>
              <div className="fixed top-0 left-0 right-0 bg-white rounded-b-xl shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-purple-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Filters
                      </h2>
                    </div>
                    <button
                      onClick={toggleFilterDrawer}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-6 max-h-96 overflow-y-auto">
                    <FilterSection isMobile={true} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Candidates for Software Engineer
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Showing {indexOfFirst + 1} -{" "}
                {Math.min(indexOfLast, filteredCandidates.length)} of{" "}
                {filteredCandidates.length} candidates
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {[
                        "Candidate",
                        "ATS Score",
                        "Experience",
                        "Skills",
                        "Education",
                        "Location",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentCandidates.map((candidate, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-purple-50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {candidate.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`font-semibold ${
                              candidate.score >= 90
                                ? "text-green-600"
                                : candidate.score >= 80
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {candidate.score}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {candidate.experience} yrs
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-gray-700">
                            {candidate.skills.join(", ")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {candidate.education}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {candidate.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              statusColors[candidate.status].bg
                            } ${statusColors[candidate.status].color} ${
                              statusColors[candidate.status].border
                            }`}
                          >
                            {candidate.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all duration-200 transform group-hover:scale-105">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {currentCandidates.map((candidate, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {candidate.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span
                          className={`font-semibold ${
                            candidate.score >= 90
                              ? "text-green-600"
                              : candidate.score >= 80
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          <Award className="w-4 h-4 inline mr-1" />
                          {candidate.score}
                        </span>
                        <span className="text-gray-600">
                          <Briefcase className="w-4 h-4 inline mr-1" />
                          {candidate.experience} yrs
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        statusColors[candidate.status].bg
                      } ${statusColors[candidate.status].color} ${
                        statusColors[candidate.status].border
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                      {candidate.education}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {candidate.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Skills:</span>{" "}
                      {candidate.skills.join(", ")}
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  First
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    if (page > totalPages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6b46c1;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6b46c1;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CandidatesView;
