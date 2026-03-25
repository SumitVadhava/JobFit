// import React, { useState } from "react";

// const JobSearch = () => {
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
//   const jobsPerPage = 5;

//   const handleBookMarkClick = (jobTitle) => {
//     setBookmarkedJobs((prev) => ({
//       ...prev,
//       [jobTitle]: !prev[jobTitle],
//     }));
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

//   const jobs = [
//     {
//       title: "Software Engineer",
//       company: "Tech Innovators Inc.",
//       location: "Remote",
//       industry: "Technology",
//       experience: "Mid-Level",
//       salary: "$100,001 - $150,000",
//       workplace: "Remote",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuCjoiB3PjAn-QaEEtnfRZaFVO8DvB9GB3_9hjcl_CSJMNGYoMGFV4JCSLThd50SfW7jt-aes9nDcyH9GoXsWELUQweR2OqW5CzCyfahImof66plIXKzb2UUVlI6gxUSYpHEYTUmNBGoSyX0RO0PnQbDaczy5Tboh1DkdQHDYfGpFeRODqw631iQZY2FLvnu9upFnMEqK26FR_eD-Godek711C9FjoyedrGHIn8hsyIqFfQ2ux_y5PgqQEYyMKeDbzWrqbreVU0U6vA",
//       bookmarks: 5,
//     },
//     {
//       title: "Data Analyst",
//       company: "Data Insights Corp.",
//       location: "New York, NY",
//       industry: "Data Analysis",
//       experience: "Entry-Level",
//       salary: "$75,001 - $100,000",
//       workplace: "Hybrid",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuDdHr2dIHzUrXQKvxa5qoqpRwRUmoTOvODzHq_ZVacljfVYvWonKVZs8kPdOmoVdgjBJcHxDPTV3inXvpHe-er_uG18rrFhPjNgswYo0NHWVooMETM6d1iVBzuAUCzsDve6849-V9dPpzNPJrxDLjpy-C0UbzWjYVybhVcmqHrplm8Kjsem74Cqe73hYfOspEJakf1dcrBuFiQ_4v9gkuKLuYI1kQSVss_f5NPCBhkr3RhWRXVMGHsl4zdI5txyEebrYZglMk5jl18",
//       bookmarks: 7,
//     },
//     {
//       title: "Product Manager",
//       company: "Product Visionaries LLC",
//       location: "San Francisco, CA",
//       industry: "Product Management",
//       experience: "Senior-Level",
//       salary: "$150,000+",
//       workplace: "On-site",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuATGWR7sacwmMrCLEpsWGT8lLi0btg3z8D3J3zNmXhT58fyBpcPjTMzbK7FO44tpAmQftpH7JIYjiO92dLRGqHJ4ZuoYhd4kQwLA5m3n1ozsU37YJLuAyxH8mZUGGIGDupiHQifecugvb1efXXLSK0r4vqxDTvYkxELoN-vdL_24Qk0B9_ZyqdTUeb9NhQ936QgoT5MhGSUogU-7nJL9BnVluII926zzdkZQlthEkbEFwsUJRbRUaCL-Q6PGL0G4OLouAjnXLfb86k",
//       bookmarks: 3,
//     },
//     {
//       title: "UX/UI Designer",
//       company: "Design Dynamics Co.",
//       location: "Los Angeles, CA",
//       industry: "Design",
//       experience: "Mid-Level",
//       salary: "$100,001 - $150,000",
//       workplace: "Hybrid",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuDwvK8Sp1ZrFrW09a7iwLmCyRqT05Apy7Lhg0ix9WfR2B_-cqPGWUAGVdOcbYfcn667Q_Jx48AURukPjtpTjAxiXvWA21PvfK6MlokA1_4TqEtGzPzlfULQbmn6nfH_1Ux7z_lrIwWrrNe81S_vquHEOWphlrmOIOGo_45V295xkn7ryAla-TvEsLo5MBOmWmalrnEc_HqYQ0aBMx7Z1rtH6y7bVfnI_G6YCfSFfaGAfxBtJEbwBEikzbfh8Ql0yRJkznN8GHBHQRY",
//       bookmarks: 4,
//     },
//     {
//       title: "Marketing Specialist",
//       company: "Marketing Masters Ltd.",
//       location: "Chicago, IL",
//       industry: "Marketing",
//       experience: "Entry-Level",
//       salary: "$50,000 - $75,000",
//       workplace: "On-site",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuBdKyLhbRdPv_aFL1E9PygqFEEEvoTtMuFUjLeuEZ38lVOmOlK06Tq6MdgyM5EfaEEk4Nz3jAl0_UzWSVA7y6ZBB6QAivHFmsdTHLldXQwfCsWkvnwk5Pie7EjNViu-dWcGjErkHE5DmqopgC7MWApXUCWLJZrUtr4uOpMK1CJear9anoIYidNMmRYpk8LWl3906VVeBjWGA4Hhl9Yd4KPlG7ZiKJ0mtzKSwk901eBkN_WNlbUvv3ZrFtLJpjFcWy4nt-vvxUrb7M4",
//       bookmarks: 2,
//     },
//     {
//       title: "Financial Analyst",
//       company: "Finance Pros Inc.",
//       location: "Boston, MA",
//       industry: "Finance",
//       experience: "Mid-Level",
//       salary: "$75,001 - $100,000",
//       workplace: "Hybrid",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuCjoiB3PjAn-QaEEtnfRZaFVO8DvB9GB3_9hjcl_CSJMNGYoMGFV4JCSLThd50SfW7jt-aes9nDcyH9GoXsWELUQweR2OqW5CzCyfahImof66plIXKzb2UUVlI6gxUSYpHEYTUmNBGoSyX0RO0PnQbDaczy5Tboh1DkdQHDYfGpFeRODqw631iQZY2FLvnu9upFnMEqK26FR_eD-Godek711C9FjoyedrGHIn8hsyIqFfQ2ux_y5PgqQEYyMKeDbzWrqbreVU0U6vA",
//       bookmarks: 4,
//     },
//     {
//       title: "Healthcare Administrator",
//       company: "HealthCare Solutions",
//       location: "Austin, TX",
//       industry: "Healthcare",
//       experience: "Senior-Level",
//       salary: "$150,000+",
//       workplace: "On-site",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuDdHr2dIHzUrXQKvxa5qoqpRwRUmoTOvODzHq_ZVacljfVYvWonKVZs8kPdOmoVdgjBJcHxDPTV3inXvpHe-er_uG18rrFhPjNgswYo0NHWVooMETM6d1iVBzuAUCzsDve6849-V9dPpzNPJrxDLjpy-C0UbzWjYVybhVcmqHrplm8Kjsem74Cqe73hYfOspEJakf1dcrBuFiQ_4v9gkuKLuYI1kQSVss_f5NPCBhkr3RhWRXVMGHsl4zdI5txyEebrYZglMk5jl18",
//       bookmarks: 3,
//     },
//     {
//       title: "Full Stack Developer",
//       company: "CodeCrafters Ltd.",
//       location: "Remote",
//       industry: "Technology",
//       experience: "Mid-Level",
//       salary: "$100,001 - $150,000",
//       workplace: "Remote",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuATGWR7sacwmMrCLEpsWGT8lLi0btg3z8D3J3zNmXhT58fyBpcPjTMzbK7FO44tpAmQftpH7JIYjiO92dLRGqHJ4ZuoYhd4kQwLA5m3n1ozsU37YJLuAyxH8mZUGGIGDupiHQifecugvb1efXXLSK0r4vqxDTvYkxELoN-vdL_24Qk0B9_ZyqdTUeb9NhQ936QgoT5MhGSUogU-7nJL9BnVluII926zzdkZQlthEkbEFwsUJRbRUaCL-Q6PGL0G4OLouAjnXLfb86k",
//       bookmarks: 6,
//     },
//   ];

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

//   const filteredJobs = jobs.filter((job) => {
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
//         {/* Filter Section */}
//         <div className="w-full lg:w-80 bg-white rounded-2xl p-6 shadow-xl">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-3xl font-bold text-gray-900">Filter</h2>
//             <button
//               className="lg:hidden text-blue-500 font-medium"
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//             >
//               {isFilterOpen ? "Hide Filters" : "Show Filters"}
//             </button>
//           </div>
//           <p className="text-gray-600 text-base font-normal mb-4">
//             {Object.values(filters).flat().length} filters applied
//           </p>
//           <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
//             <button
//               onClick={clearFilters}
//               className="w-full bg-blue-100 text-gray-900 font-semibold py-2 rounded-full hover:bg-blue-200 transition-colors mb-6"
//             >
//               Clear Filters
//             </button>

//             {Object.entries(filterOptions).map(([category, options]) => (
//               <div key={category} className="mb-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">
//                   {category}
//                 </h3>
//                 {options.map((option) => (
//                   <label key={option} className="flex items-center gap-3 py-2">
//                     <input
//                       type="checkbox"
//                       checked={filters[category].includes(option)}
//                       onChange={() => handleFilterChange(category, option)}
//                       className="h-5 w-5 rounded-md appearance-none border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:items-center checked:after:justify-center checked:after:h-full checked:after:w-full focus:ring-0 focus:outline-none transition-colors cursor-pointer"
//                     />
//                     <span className="text-gray-900 text-base font-normal">
//                       {option}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             ))}

//             <button className="w-full bg-blue-200 text-gray-900 font-semibold py-2 rounded-full hover:bg-blue-300 transition-colors">
//               Apply Filters
//             </button>
//           </div>
//         </div>

//         {/* Jobs Section */}
//         <div className="flex-1">
//           <div className="bg-white rounded-2xl p-6 shadow-xl">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Recommended Jobs
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
//               <p className="text-gray-600 text-base font-normal">
//                 No jobs match the selected filters.
//               </p>
//             ) : (
//               paginatedJobs.map((job, index) => (
//                 <div key={index} className="mb-6 last:mb-0">
//                   <div className="flex flex-col sm:flex-row gap-4 rounded-xl p-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex-1">
//                       {/* <p className="text-gray-600 text-base font-normal">
//                         Bookmark
//                       </p> */}
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
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     <div className="flex items-center gap-2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="30"
//                         height="30"
//                         onClick={() => handleBookMarkClick(job.title)}
//                         viewBox="0 0 256 256"
//                         className={`cursor-pointer transition-all duration-200 ${bookmarkedJobs[job.title]
//                             ? "text-purple-600 scale-110 drop-shadow-md"
//                             : "text-gray-600"
//                           }`}
//                       >
//                         {bookmarkedJobs[job.title] ? (
//                           // Filled Bookmark
//                           <path
//                             fill="currentColor"
//                             d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"
//                           />
//                         ) : (
//                           // Outline Bookmark
//                           <path
//                             fill="currentColor"
//                             d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"
//                           />
//                         )}
//                       </svg>

//                       {/* <span className="text-gray-600 text-base font-normal">
//                         {job.bookmarks}
//                       </span> */}
//                     </div>
//                   </div>

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

// export default JobSearch;



import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    Location: [],
    Department: [],
    Experience: [],
    "Workplace Type": [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data using your custom Axios instance
        const response = await api.get("jobs");

        // Format the API response to match our component structure
        const formattedJobs = response.data.jobs.map(job => ({
          ...job,
          _id: job._id,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          department: job.department,
          experience: job.experience,
          workPlaceType: job.workPlaceType === 'onsite' ? 'On-site' :
            job.workPlaceType === 'remote' ? 'Remote' :
              job.workPlaceType === 'hybrid' ? 'Hybrid' : job.workPlaceType,
          jobDescription: job.jobDescription,
          responsibilities: job.responsibilities,
          qualifications: job.qualifications,
          img: job.img || "https://via.placeholder.com/150?text=Company+Logo",
          bookmarked: job.bookmarked || false
        }));

        setJobs(formattedJobs);

        // Initialize bookmarks based on API response
        const initialBookmarks = {};
        formattedJobs.forEach((job) => {
          initialBookmarks[job._id] = job.bookmarked || false;
        });
        setBookmarkedJobs(initialBookmarks);

      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getWorkplaceConfig = (type) => {
    switch (type) {
      case "Remote":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.56,87.56,0,0,1-7.47,35.63L181.71,139.2a16,16,0,0,0-9.19-9.19L148.24,117.5a16,16,0,0,0-13.31.52L120,126.83V112a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v16a16,16,0,0,0,16,16h16v24a16,16,0,0,0,7.12,13.31l28.56,19A16,16,0,0,0,148.84,184l13.71-10.28A87.58,87.58,0,0,1,128,216,88,88,0,1,1,216,128Z" />
            </svg>
          ),
        };
      case "Hybrid":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
              <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32l-64,44.8A16,16,0,0,0,48,76.39V208H32a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM64,76.39,128,32V208H64ZM88,112a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,48a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,160Z" />
            </svg>
          ),
        };
      case "On-site":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500",
          icon: null,
        };
    }
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      Product: "from-violet-500 to-purple-600",
      Engineering: "from-blue-500 to-indigo-600",
      Analytics: "from-cyan-500 to-blue-600",
      Design: "from-pink-500 to-rose-600",
      Marketing: "from-green-500 to-emerald-600",
      "Human Resources": "from-yellow-500 to-amber-600",
      Finance: "from-green-500 to-teal-600",
      Operations: "from-orange-500 to-amber-600",
    };
    return colors[dept] || "from-gray-500 to-gray-600";
  };

  const getDepartmentBadge = (dept) => {
    const badges = {
      Product: "bg-violet-100 text-violet-700 border-violet-200",
      Engineering: "bg-blue-100 text-blue-700 border-blue-200",
      Analytics: "bg-cyan-100 text-cyan-700 border-cyan-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
      Marketing: "bg-green-100 text-green-700 border-green-200",
      "Human Resources": "bg-yellow-100 text-yellow-700 border-yellow-200",
      Finance: "bg-green-100 text-green-700 border-green-200",
      Operations: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return badges[dept] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Location":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
          </svg>
        );
      case "Department":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
          </svg>
        );
      case "Experience":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
          </svg>
        );
      case "Workplace Type":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32l-64,44.8A16,16,0,0,0,48,76.39V208H32a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM64,76.39,128,32V208H64ZM88,112a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,48a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,160Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleBookMarkClick = async (jobId) => {
    const jobToUpdate = jobs.find((job) => job._id === jobId);
    if (!jobToUpdate) return;

    const newBookmarkState = !bookmarkedJobs[jobId];

    // Optimistic UI update
    setBookmarkedJobs((prev) => ({
      ...prev,
      [jobId]: newBookmarkState,
    }));
    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId ? { ...job, bookmarked: newBookmarkState } : job
      )
    );

    try {
      // Use PUT /api/jobs/:id — send full job data with updated bookmarked flag
      await api.put(`/jobs/${jobId}`, {
        jobTitle: jobToUpdate.jobTitle,
        department: jobToUpdate.department,
        experience: jobToUpdate.experience,
        responsibilities: jobToUpdate.responsibilities,
        qualifications: jobToUpdate.qualifications,
        companyName: jobToUpdate.companyName,
        location: jobToUpdate.location,
        workPlaceType: jobToUpdate.workPlaceType === "On-site" ? "onsite" :
          jobToUpdate.workPlaceType === "Remote" ? "remote" :
            jobToUpdate.workPlaceType === "Hybrid" ? "hybrid" : jobToUpdate.workPlaceType,
        jobDescription: jobToUpdate.jobDescription,
        img: jobToUpdate.img,
        bookmarked: newBookmarkState,
      });

      toast.success(
        newBookmarkState
          ? "Job saved successfully!"
          : "Job removed from saved",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    } catch (err) {
      console.error("Error updating bookmark:", err);
      // Revert on error
      setBookmarkedJobs((prev) => ({
        ...prev,
        [jobId]: !newBookmarkState,
      }));
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? { ...job, bookmarked: !newBookmarkState }
            : job
        )
      );
      toast.error("Failed to update bookmark status", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleFilterChange = (category, option) => {
    setFilters((prev) => {
      const updatedCategory = prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option];
      return { ...prev, [category]: updatedCategory };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      Location: [],
      Department: [],
      Experience: [],
      "Workplace Type": [],
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const removeFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== option),
    }));
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).flat().length;

  // Extract unique filter options from jobs data
  const filterOptions = {
    Location: [...new Set(jobs.map((job) => job.location))],
    Department: [...new Set(jobs.map((job) => job.department))],
    Experience: [...new Set(jobs.map((job) => job.experience))],
    "Workplace Type": [...new Set(jobs.map((job) => job.workPlaceType))],
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSearch &&
      (filters.Location.length === 0 ||
        filters.Location.includes(job.location)) &&
      (filters.Department.length === 0 ||
        filters.Department.includes(job.department)) &&
      (filters.Experience.length === 0 ||
        filters.Experience.includes(job.experience)) &&
      (filters["Workplace Type"].length === 0 ||
        filters["Workplace Type"].includes(job.workPlaceType))
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
          <p className="text-lg font-medium text-gray-600 animate-pulse">
            Finding the best jobs for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-['Inter',sans-serif]">
      <ToastContainer />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Job Search
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "opportunity" : "opportunities"}{" "}
                found
              </p>
            </div>

            <div className="relative w-full sm:w-96">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs, companies, locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-gray-700"
                    >
                      <path d="M200,136a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H192A8,8,0,0,1,200,136Zm32-56H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Zm-80,96H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Filters
                    </h2>
                    {activeFilterCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  <button
                    className="lg:hidden text-sm text-blue-600 font-medium hover:text-blue-700"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    {isFilterOpen ? "Hide" : "Show"}
                  </button>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                    Clear all filters
                  </button>
                )}
              </div>

              <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
                <div className="p-5 space-y-6">
                  {Object.entries(filterOptions).map(
                    ([category, options]) => (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-500">
                            {getCategoryIcon(category)}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            {category}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          {options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={filters[category].includes(option)}
                                  onChange={() =>
                                    handleFilterChange(category, option)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                  {filters[category].includes(option) && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      fill="white"
                                      viewBox="0 0 256 256"
                                    >
                                      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(filters).flatMap(([category, options]) =>
                options.map((option) => (
                  <button
                    key={`${category}-${option}`}
                    onClick={() => removeFilter(category, option)}
                    className="group flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium pl-3 pr-2 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <span>{option}</span>
                    <svg
                      className="text-blue-400 group-hover:text-blue-600 transition-colors"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Job Cards */}
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
            <div className="flex items-center justify-center gap-1 mt-10">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${currentPage === page
                        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                        : "text-gray-500 hover:bg-white hover:shadow-sm"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                </svg>
              </button>
            </div>
          )}

          {filteredJobs.length > 0 && (
            <p className="text-center text-xs text-gray-400 mt-4 mb-8">
              Showing {(currentPage - 1) * jobsPerPage + 1}–
              {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length} jobs
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobSearch;