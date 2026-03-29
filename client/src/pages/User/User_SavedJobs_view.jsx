// import { Divider } from "@mui/material";
// import React, { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Define jobs array before the component
// const initialJobs = [
//   {
//     title: "Software Engineer",
//     company: "Tech Innovators Inc.",
//     location: "Remote",
//     industry: "Technology",
//     experience: "Mid-Level",
//     salary: "$100,001 - $150,000",
//     workplace: "Remote",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuCjoiB3PjAn-QaEEtnfRZaFVO8DvB9GB3_9hjcl_CSJMNGYoMGFV4JCSLThd50SfW7jt-aes9nDcyH9GoXsWELUQweR2OqW5CzCyfahImof66plIXKzb2UUVlI6gxUSYpHEYTUmNBGoSyX0RO0PnQbDaczy5Tboh1DkdQHDYfGpFeRODqw631iQZY2FLvnu9upFnMEqK26FR_eD-Godek711C9FjoyedrGHIn8hsyIqFfQ2ux_y5PgqQEYyMKeDbzWrqbreVU0U6vA",
//     bookmarks: 5,
//   },
//   {
//     title: "Data Analyst",
//     company: "Data Insights Corp.",
//     location: "New York, NY",
//     industry: "Data Analysis",
//     experience: "Entry-Level",
//     salary: "$75,001 - $100,000",
//     workplace: "Hybrid",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuDdHr2dIHzUrXQKvxa5qoqpRwRUmoTOvODzHq_ZVacljfVYvWonKVZs8kPdOmoVdgjBJcHxDPTV3inXvpHe-er_uG18rrFhPjNgswYo0NHWVooMETM6d1iVBzuAUCzsDve6849-V9dPpzNPJrxDLjpy-C0UbzWjYVybhVcmqHrplm8Kjsem74Cqe73hYfOspEJakf1dcrBuFiQ_4v9gkuKLuYI1kQSVss_f5NPCBhkr3RhWRXVMGHsl4zdI5txyEebrYZglMk5jl18",
//     bookmarks: 7,
//   },
//   {
//     title: "Product Manager",
//     company: "Product Visionaries LLC",
//     location: "San Francisco, CA",
//     industry: "Product Management",
//     experience: "Senior-Level",
//     salary: "$150,000+",
//     workplace: "On-site",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuATGWR7sacwmMrCLEpsWGT8lLi0btg3z8D3J3zNmXhT58fyBpcPjTMzbK7FO44tpAmQftpH7JIYjiO92dLRGqHJ4ZuoYhd4kQwLA5m3n1ozsU37YJLuAyxH8mZUGGIGDupiHQifecugvb1efXXLSK0r4vqxDTvYkxELoN-vdL_24Qk0B9_ZyqdTUeb9NhQ936QgoT5MhGSUogU-7nJL9BnVluII926zzdkZQlthEkbEFwsUJRbRUaCL-Q6PGL0G4OLouAjnXLfb86k",
//     bookmarks: 3,
//   },
//   {
//     title: "UX/UI Designer",
//     company: "Design Dynamics Co.",
//     location: "Los Angeles, CA",
//     industry: "Design",
//     experience: "Mid-Level",
//     salary: "$100,001 - $150,000",
//     workplace: "Hybrid",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuDwvK8Sp1ZrFrW09a7iwLmCyRqT05Apy7Lhg0ix9WfR2B_-cqPGWUAGVdOcbYfcn667Q_Jx48AURukPjtpTjAxiXvWA21PvfK6MlokA1_4TqEtGzPzlfULQbmn6nfH_1Ux7z_lrIwWrrNe81S_vquHEOWphlrmOIOGo_45V295xkn7ryAla-TvEsLo5MBOmWmalrnEc_HqYQ0aBMx7Z1rtH6y7bVfnI_G6YCfSFfaGAfxBtJEbwBEikzbfh8Ql0yRJkznN8GHBHQRY",
//     bookmarks: 4,
//   },
//   {
//     title: "Marketing Specialist",
//     company: "Marketing Masters Ltd.",
//     location: "Chicago, IL",
//     industry: "Marketing",
//     experience: "Entry-Level",
//     salary: "$50,000 - $75,000",
//     workplace: "On-site",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuBdKyLhbRdPv_aFL1E9PygqFEEEvoTtMuFUjLeuEZ38lVOmOlK06Tq6MdgyM5EfaEEk4Nz3jAl0_UzWSVA7y6ZBB6QAivHFmsdTHLldXQwfCsWkvnwk5Pie7EjNViu-dWcGjErkHE5DmqopgC7MWApXUCWLJZrUtr4uOpMK1CJear9anoIYidNMmRYpk8LWl3906VVeBjWGA4Hhl9Yd4KPlG7ZiKJ0mtzKSwk901eBkN_WNlbUvv3ZrFtLJpjFcWy4nt-vvxUrb7M4",
//     bookmarks: 2,
//   },
//   {
//     title: "Financial Analyst",
//     company: "Finance Pros Inc.",
//     location: "Boston, MA",
//     industry: "Finance",
//     experience: "Mid-Level",
//     salary: "$75,001 - $100,000",
//     workplace: "Hybrid",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuCjoiB3PjAn-QaEEtnfRZaFVO8DvB9GB3_9hjcl_CSJMNGYoMGFV4JCSLThd50SfW7jt-aes9nDcyH9GoXsWELUQweR2OqW5CzCyfahImof66plIXKzb2UUVlI6gxUSYpHEYTUmNBGoSyX0RO0PnQbDaczy5Tboh1DkdQHDYfGpFeRODqw631iQZY2FLvnu9upFnMEqK26FR_eD-Godek711C9FjoyedrGHIn8hsyIqFfQ2ux_y5PgqQEYyMKeDbzWrqbreVU0U6vA",
//     bookmarks: 4,
//   },
//   {
//     title: "Healthcare Administrator",
//     company: "HealthCare Solutions",
//     location: "Austin, TX",
//     industry: "Healthcare",
//     experience: "Senior-Level",
//     salary: "$150,000+",
//     workplace: "On-site",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuDdHr2dIHzUrXQKvxa5qoqpRwRUmoTOvODzHq_ZVacljfVYvWonKVZs8kPdOmoVdgjBJcHxDPTV3inXvpHe-er_uG18rrFhPjNgswYo0NHWVooMETM6d1iVBzuAUCzsDve6849-V9dPpzNPJrxDLjpy-C0UbzWjYVybhVcmqHrplm8Kjsem74Cqe73hYfOspEJakf1dcrBuFiQ_4v9gkuKLuYI1kQSVss_f5NPCBhkr3RhWRXVMGHsl4zdI5txyEebrYZglMk5jl18",
//     bookmarks: 3,
//   },
//   {
//     title: "Full Stack Developer",
//     company: "CodeCrafters Ltd.",
//     location: "Remote",
//     industry: "Technology",
//     experience: "Mid-Level",
//     salary: "$100,001 - $150,000",
//     workplace: "Remote",
//     image:
//       "https://lh3.googleusercontent.com/aida-public/AB6AXuATGWR7sacwmMrCLEpsWGT8lLi0btg3z8D3J3zNmXhT58fyBpcPjTMzbK7FO44tpAmQftpH7JIYjiO92dLRGqHJ4ZuoYhd4kQwLA5m3n1ozsU37YJLuAyxH8mZUGGIGDupiHQifecugvb1efXXLSK0r4vqxDTvYkxELoN-vdL_24Qk0B9_ZyqdTUeb9NhQ936QgoT5MhGSUogU-7nJL9BnVluII926zzdkZQlthEkbEFwsUJRbRUaCL-Q6PGL0G4OLouAjnXLfb86k",
//     bookmarks: 6,
//   },
// ];

// const SavedJobs = () => {
//   const [filters, setFilters] = useState({
//     Location: [],
//     Industry: [],
//     "Experience Level": [],
//     "Salary Range": [],
//     Workplace: [],
//   });
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bookmarkedJobs, setBookmarkedJobs] = useState({});
//   const [savedJobs, setSavedJobs] = useState(initialJobs); // Now using initialJobs
//   const jobsPerPage = 5;

//   const handleBookMarkClick = (jobTitle) => {
//     // Remove the job from savedJobs when unbookmarked
//     setSavedJobs((prevJobs) => prevJobs.filter((job) => job.title !== jobTitle));
//     setBookmarkedJobs((prev) => ({
//       ...prev,
//       [jobTitle]: !prev[jobTitle],
//     }));

//     toast.success("Job removed from saved jobs", {
//       position: "top-center",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   };

//   const filterOptions = {
//     Location: [
//       "Remote",
//       "New York, NY",
//       "San Francisco, CA",
//       "Los Angeles, CA",
//       "Chicago, IL",
//       "Boston, MA",
//       "Austin, TX",
//     ],
//     Industry: [
//       "Technology",
//       "Data Analysis",
//       "Product Management",
//       "Design",
//       "Marketing",
//       "Finance",
//       "Healthcare",
//     ],
//     "Experience Level": ["Entry-Level", "Mid-Level", "Senior-Level"],
//     "Salary Range": [
//       "$50,000 - $75,000",
//       "$75,001 - $100,000",
//       "$100,001 - $150,000",
//       "$150,000+",
//     ],
//     Workplace: ["Remote", "On-site", "Hybrid"],
//   };

//   const handleFilterChange = (category, option) => {
//     setFilters((prev) => {
//       const updatedCategory = prev[category].includes(option)
//         ? prev[category].filter((item) => item !== option)
//         : [...prev[category], option];
//       return { ...prev, [category]: updatedCategory };
//     });
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setFilters({
//       Location: [],
//       Industry: [],
//       "Experience Level": [],
//       "Salary Range": [],
//       Workplace: [],
//     });
//     setCurrentPage(1);
//   };

//   const removeFilter = (category, option) => {
//     setFilters((prev) => ({
//       ...prev,
//       [category]: prev[category].filter((item) => item !== option),
//     }));
//     setCurrentPage(1);
//   };

//   const filteredJobs = savedJobs.filter((job) => {
//     return (
//       (filters.Location.length === 0 ||
//         filters.Location.includes(job.location)) &&
//       (filters.Industry.length === 0 ||
//         filters.Industry.includes(job.industry)) &&
//       (filters["Experience Level"].length === 0 ||
//         filters["Experience Level"].includes(job.experience)) &&
//       (filters["Salary Range"].length === 0 ||
//         filters["Salary Range"].includes(job.salary)) &&
//       (filters.Workplace.length === 0 ||
//         filters.Workplace.includes(job.workplace))
//     );
//   });

//   const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
//   const paginatedJobs = filteredJobs.slice(
//     (currentPage - 1) * jobsPerPage,
//     currentPage * jobsPerPage
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-white font-poppins">
//       <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
//         {/* Jobs Section */}
//         <div className="flex-1">
//           <div className="bg-white rounded-2xl p-6 shadow-xl">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Saved Jobs
//             </h2>
//             <div className="flex flex-wrap gap-2 mb-6">
//               {Object.entries(filters).flatMap(([category, options]) =>
//                 options.map((option) => (
//                   <div
//                     key={`${category}-${option}`}
//                     className="flex items-center bg-gray-200 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full"
//                   >
//                     <span>{option}</span>
//                     <button
//                       onClick={() => removeFilter(category, option)}
//                       className="ml-2 text-gray-600 hover:text-gray-900"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         viewBox="0 0 256 256"
//                       >
//                         <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
//                       </svg>
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             {paginatedJobs.length === 0 ? (
//               <div className="text-center py-10">
//                 <p className="text-gray-600 text-lg font-medium">
//                   No saved jobs found
//                 </p>
//                 <p className="text-gray-400 mt-2">
//                   Jobs you save will appear here
//                 </p>
//               </div>
//             ) : (
//               paginatedJobs.map((job, index) => (
//                 <div key={index} className="mb-6 last:mb-0">
//                   <div className="flex flex-col sm:flex-row gap-4 rounded-xl p-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex-1">
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {job.title}
//                       </h3>
//                       <p className="text-gray-600 text-base font-normal mb-4">
//                         {job.company} | {job.location}
//                       </p>
//                       <button className="flex items-center gap-2 bg-gray-200 text-gray-900 text-sm font-medium py-1.5 px-3 rounded-full hover:bg-gray-300 transition-colors">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="18"
//                           height="18"
//                           fill="currentColor"
//                           viewBox="0 0 256 256"
//                         >
//                           <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
//                         </svg>
//                         Apply
//                       </button>
//                     </div>
//                     <div
//                       className="w-full sm:w-1/3 h-40 bg-cover bg-center rounded-xl"
//                       style={{ backgroundImage: `url(${job.image})` }}
//                     />
//                   </div>
//                   <div className="flex flex-wrap gap-4 pb-5 pl-3 mt-2">
//                     <div className="flex items-center gap-2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="30"
//                         height="30"
//                         onClick={() => handleBookMarkClick(job.title)}
//                         viewBox="0 0 256 256"
//                         className={`cursor-pointer transition-all duration-200 ${bookmarkedJobs[job.title]
//                           ? "text-gray-600"
//                           : "text-purple-600 scale-110 drop-shadow-md"
//                           }`}
//                       >
//                         {bookmarkedJobs[job.title] ? (
//                           // Filled Bookmark
//                           <path
//                             fill="currentColor"
//                             d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"
//                           />
//                         ) : (
//                           // Outline Bookmark

//                           <path
//                             fill="currentColor"
//                             d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"
//                           />
//                         )}
//                       </svg>
//                     </div>
//                   </div>
//                   {index < paginatedJobs.length - 1 && (
//                     <Divider className="mt-2" />
//                   )}
//                 </div>
//               ))
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center gap-2 mt-6">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPage === page
//                         ? "bg-blue-200 text-gray-900"
//                         : "bg-gray-200 text-gray-600 hover:bg-blue-100"
//                         }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SavedJobs;




import { Divider } from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api"; // Ensure this path is correct

// Helper functions for styling - Updated to handle lowercase backend data
const getWorkplaceConfig = (workplace) => {
  // Normalize string to handle "onsite", "On-site", "remote", etc.
  const normalized = workplace?.toLowerCase().replace('-', '') || "remote";

  const configs = {
    remote: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-blue-500">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        </svg>
      ),
      dot: "bg-green-500",
    },
    hybrid: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-purple-500">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM128,40a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V48A8,8,0,0,0,128,40Zm0,176a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V216A8,8,0,0,0,128,176Z" />
        </svg>
      ),
      dot: "bg-yellow-500",
    },
    onsite: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-green-500">
          <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
        </svg>
      ),
      dot: "bg-green-500",
    },
  };
  return configs[normalized] || configs.remote;
};

const getDepartmentColor = (department) => {
  const normalized = department?.toLowerCase() || "";
  if (normalized.includes("tech")) return "from-blue-500 to-blue-600";
  if (normalized.includes("data")) return "from-purple-500 to-purple-600";
  if (normalized.includes("product")) return "from-indigo-500 to-indigo-600";
  if (normalized.includes("design")) return "from-pink-500 to-pink-600";
  if (normalized.includes("market")) return "from-red-500 to-red-600";
  if (normalized.includes("financ")) return "from-green-500 to-green-600";
  if (normalized.includes("health")) return "from-teal-500 to-teal-600";
  return "from-gray-500 to-gray-600";
};

const getDepartmentBadge = (department) => {
  const normalized = department?.toLowerCase() || "";
  if (normalized.includes("tech")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (normalized.includes("data")) return "bg-purple-50 text-purple-700 border-purple-200";
  if (normalized.includes("product")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (normalized.includes("design")) return "bg-pink-50 text-pink-700 border-pink-200";
  if (normalized.includes("market")) return "bg-red-50 text-red-700 border-red-200";
  if (normalized.includes("financ")) return "bg-green-50 text-green-700 border-green-200";
  if (normalized.includes("health")) return "bg-teal-50 text-teal-700 border-teal-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

const SavedJobs = () => {
  // --- STATE ---
  const [savedJobs, setSavedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Tracks initial fetch
  const [filters, setFilters] = useState({
    Location: [],
    Industry: [],
    "Experience Level": [],
    "Salary Range": [],
    Workplace: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const jobsPerPage = 3;

  // --- FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/jobs");

        // Only show jobs where bookmarked === true
        const allJobs = response.data.jobs || [];
        const bookmarkedOnly = allJobs.filter((job) => job.bookmarked === true);
        setSavedJobs(bookmarkedOnly);

        // All jobs shown here are bookmarked
        const initialBookmarks = bookmarkedOnly.reduce((acc, job) => {
          acc[job._id] = true;
          return acc;
        }, {});
        setBookmarkedJobs(initialBookmarks);

      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load saved jobs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty array ensures this runs only once when the page loads

  // --- HANDLERS ---
  const handleBookMarkClick = async (jobId) => {
    const jobToUpdate = savedJobs.find((job) => job._id === jobId);
    if (!jobToUpdate) return;

    // Optimistic UI Update — remove from list immediately
    setBookmarkedJobs((prev) => ({
      ...prev,
      [jobId]: false,
    }));
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

    try {
      // Persist to backend using PUT /api/jobs/:id with bookmarked: false
      await api.put(`/jobs/${jobId}`, {
        jobTitle: jobToUpdate.jobTitle,
        department: jobToUpdate.department,
        experience: jobToUpdate.experience,
        responsibilities: jobToUpdate.responsibilities,
        qualifications: jobToUpdate.qualifications,
        companyName: jobToUpdate.companyName,
        location: jobToUpdate.location,
        workPlaceType: jobToUpdate.workPlaceType,
        jobDescription: jobToUpdate.jobDescription,
        img: jobToUpdate.img,
        bookmarked: false,
      });

      toast.success("Job removed from saved jobs", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating bookmark:", error);
      // Revert on error — add job back
      setBookmarkedJobs((prev) => ({
        ...prev,
        [jobId]: true,
      }));
      setSavedJobs((prevJobs) => [...prevJobs, jobToUpdate]);
      toast.error("Failed to remove job from saved", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const removeFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== option),
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      Location: [],
      Industry: [],
      "Experience Level": [],
      "Salary Range": [],
      Workplace: [],
    });
    setCurrentPage(1);
  };

  // --- FILTERING LOGIC ---
  const filteredJobs = savedJobs.filter((job) => {
    return (
      (filters.Location.length === 0 || filters.Location.includes(job.location)) &&
      (filters.Industry.length === 0 || filters.Industry.includes(job.department)) &&
      (filters["Experience Level"].length === 0 || filters["Experience Level"].includes(job.experience)) &&
      // Fallback to empty string for salary if it doesn't exist in the DB
      (filters["Salary Range"].length === 0 || filters["Salary Range"].includes(job.salary || "")) &&
      // Handle case sensitivity for workplace type (e.g. "onsite" vs "On-site")
      (filters.Workplace.length === 0 || filters.Workplace.some(w => w.toLowerCase().replace('-', '') === job.workPlaceType?.toLowerCase().replace('-', '')))
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your saved jobs...</p>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Saved Jobs</h2>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(filters).flatMap(([category, options]) =>
                options.map((option) => (
                  <div key={`${category}-${option}`} className="flex items-center bg-gray-200 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full">
                    <span>{option}</span>
                    <button onClick={() => removeFilter(category, option)} className="ml-2 text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Empty State */}
            {paginatedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="text-gray-400 -rotate-6"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No matching jobs
                </h3>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  We couldn't find any jobs matching your criteria. Try broadening
                  your search or removing some filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M197.67,186.37a8,8,0,0,1,0,11.29C196.58,198.73,170.82,224,128,224c-37.39,0-64.53-22.4-80-39.85V208a8,8,0,0,1-16,0V160a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H55.44C67.76,183.35,93,208,128,208c36,0,58.14-21.46,58.36-21.68A8,8,0,0,1,197.67,186.37ZM216,40a8,8,0,0,0-8,8V72.05C194.55,55.47,167.4,32,128,32,85.18,32,59.42,57.27,58.34,58.34a8,8,0,0,0,11.3,11.34C69.86,69.46,92,48,128,48c35,0,60.24,24.65,72.56,40H168a8,8,0,0,0,0,16h48a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Z" />
                  </svg>
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedJobs.map((job, index) => {
                  const workplaceConfig = getWorkplaceConfig(job.workPlaceType);
                  const isExpanded = expandedJob === job._id;
                  const isHovered = hoveredJob === job._id;
                  const isBookmarked = bookmarkedJobs[job._id];

                  return (
                    <div
                      key={job._id}
                      className="group relative bg-white rounded-3xl border border-gray-300 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-400"
                      onMouseEnter={() => setHoveredJob(job._id)}
                      onMouseLeave={() => setHoveredJob(null)}
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >


                      <div className="p-7 sm:p-8">
                        {/* Header: Logo + Info + Bookmark */}
                        <div className="flex gap-5 sm:gap-6">
                          {/* Company Logo - BIGGER */}
                          <div className="shrink-0">
                            <div
                              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all duration-500 ${isHovered
                                ? "border-gray-200 shadow-xl scale-105 rotate-1"
                                : "border-gray-100 shadow-md"
                                }`}
                            >
                              <img
                                src={job.img}
                                alt={job.companyName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${getDepartmentColor(
                                    job.department
                                  )} text-white font-bold text-2xl sm:text-3xl">
                          ${job.companyName.charAt(0)}
                        </div>`;
                                }}
                              />
                              {/* Status dot */}
                              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div
                                  className={`w-3 h-3 rounded-full ${workplaceConfig.dot}`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                {/* Job Title */}
                                <h3
                                  className={`text-xl sm:text-2xl font-bold text-gray-900 truncate transition-colors duration-300 ${isHovered ? "text-blue-700" : ""
                                    }`}
                                >
                                  {job.jobTitle}
                                </h3>

                                {/* Company & Location */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                                    {job.companyName}
                                  </span>
                                  <span className="hidden sm:inline text-gray-300 text-lg">
                                    ·
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="text-gray-400"
                                    >
                                      <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                                    </svg>
                                    {job.location}
                                  </span>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                  {/* Workplace Badge */}
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${workplaceConfig.bg} ${workplaceConfig.text} ${workplaceConfig.border}`}
                                  >
                                    {workplaceConfig.icon}
                                    {job.workPlaceType}
                                  </span>

                                  {/* Experience Badge */}
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      fill="currentColor"
                                      viewBox="0 0 256 256"
                                      className="text-gray-400"
                                    >
                                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                                    </svg>
                                    {job.experience}
                                  </span>

                                  {/* Department Badge */}
                                  <span
                                    className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${getDepartmentBadge(
                                      job.department
                                    )}`}
                                  >
                                    {job.department}
                                  </span>
                                </div>
                              </div>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => handleBookMarkClick(job._id)}
                                className={`shrink-0 p-3 rounded-2xl transition-all duration-300 ${isBookmarked
                                  ? "text-blue-600 bg-blue-50 shadow-md shadow-blue-100 hover:bg-blue-100 scale-110"
                                  : "text-gray-300 hover:text-gray-500 hover:bg-gray-50"
                                  }`}
                                aria-label={
                                  isBookmarked
                                    ? "Remove bookmark"
                                    : "Add bookmark"
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 256 256"
                                  fill="currentColor"
                                  className={`transition-transform duration-300 ${isBookmarked ? "scale-110" : ""
                                    }`}
                                >
                                  {isBookmarked ? (
                                    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z" />
                                  ) : (
                                    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z" />
                                  )}
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-5 ml-[100px] sm:ml-[120px]">
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {job.jobDescription}
                          </p>
                        </div>

                        {/* Expandable Details */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ml-[100px] sm:ml-[120px] ${isExpanded
                            ? "max-h-[600px] opacity-100 mt-6"
                            : "max-h-0 opacity-0 mt-0"
                            }`}
                        >
                          <div className="border-t border-dashed border-gray-200 pt-6 space-y-5">
                            {/* Responsibilities */}
                            <div className="flex gap-4">
                              <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="text-blue-600"
                                >
                                  <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">
                                  Responsibilities
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {job.responsibilities}
                                </p>
                              </div>
                            </div>

                            {/* Qualifications */}
                            <div className="flex gap-4">
                              <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                  className="text-purple-600"
                                >
                                  <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.74,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.27l76.24,40.66a8,8,0,0,0,7.52,0L176,143.79v46.89C166.4,196,149.85,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM128,165.06,20.36,107.6V96l107.64,57.4a8,8,0,0,0,7.52,0L243.64,96v11.6Z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">
                                  Qualifications
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {job.qualifications}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between mt-6 ml-[100px] sm:ml-[120px]">
                          <div className="flex items-center gap-3">
                            {/* Apply Button */}
                            <button
                            className="group/btn relative inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-7 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-gray-900/25 active:scale-[0.97]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="17"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                            >
                              <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,13-9.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.32-11.32L107.1,137.58,23.91,98.12l.14,0L215.94,40Z" />
                            </svg>
                            Apply Now
                          </button>

                            {/* View Details Toggle */}
                            <button
                              onClick={() =>
                                setExpandedJob(isExpanded ? null : job._id)
                              }
                              className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-2xl border transition-all duration-300 ${isExpanded
                                ? "text-blue-700 bg-blue-50 border-blue-200 shadow-sm shadow-blue-100"
                                : "text-gray-600 bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""
                                  }`}
                              >
                                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                              </svg>
                              {isExpanded ? "Show Less" : "View Details"}
                            </button>
                          </div>

                          {/* Time posted */}
                          <span className="hidden sm:inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="text-gray-300"
                            >
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                            </svg>
                            Posted recently
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}


            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-blue-200 text-gray-900" : "bg-gray-200 text-gray-600 hover:bg-blue-100"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;