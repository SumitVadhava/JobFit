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
//   const jobsPerPage = 5;

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
//       likes: 12,
//       dislikes: 2,
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
//       likes: 15,
//       dislikes: 3,
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
//       likes: 8,
//       dislikes: 1,
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
//       likes: 10,
//       dislikes: 2,
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
//       likes: 6,
//       dislikes: 1,
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
//       likes: 9,
//       dislikes: 2,
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
//       likes: 11,
//       dislikes: 1,
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
//       likes: 14,
//       dislikes: 2,
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
//     setCurrentPage(1); // Reset to first page when filters change
//   };

//   const clearFilters = () => {
//     setFilters({
//       Location: [],
//       Industry: [],
//       "Experience Level": [],
//       "Salary Range": [],
//       Workplace: [],
//     });
//     setCurrentPage(1); // Reset to first page when filters are cleared
//   };

//   const removeFilter = (category, option) => {
//     setFilters((prev) => ({
//       ...prev,
//       [category]: prev[category].filter((item) => item !== option),
//     }));
//     setCurrentPage(1); // Reset to first page when a filter is removed
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
//                       <p className="text-gray-600 text-base font-normal">
//                         Bookmark
//                       </p>
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
//                       // style={{ backgroundImage: url(`${job.image}`) }}
//                     />
//                   </div>
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     <div className="flex items-center gap-2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="currentColor"
//                         className="text-gray-600"
//                         viewBox="0 0 256 256"
//                       >
//                         <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
//                       </svg>
//                       <span className="text-gray-600 text-base font-normal">
//                         {job.likes}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="currentColor"
//                         className="text-gray-600"
//                         viewBox="0 0 256 256"
//                       >
//                         <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
//                       </svg>
//                       <span className="text-gray-600 text-base font-normal">
//                         {job.dislikes}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="currentColor"
//                         className="text-gray-600"
//                         viewBox="0 0 256 256"
//                       >
//                         <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z" />
//                       </svg>
//                       <span className="text-gray-600 text-base font-normal">
//                         {job.bookmarks}
//                       </span>
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
//                       className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                         currentPage === page
//                           ? "bg-blue-200 text-gray-900"
//                           : "bg-gray-200 text-gray-600 hover:bg-blue-100"
//                       }`}
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


import React, { useState } from "react";

const JobSearch = () => {
  const [filters, setFilters] = useState({
    Location: [],
    Industry: [],
    "Experience Level": [],
    "Salary Range": [],
    Workplace: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const jobsPerPage = 5;

  const handleBookMarkClick = (jobTitle) => {
    setBookmarkedJobs((prev) => ({
      ...prev,
      [jobTitle]: !prev[jobTitle],
    }));
  };

  const filterOptions = {
    Location: [
      "Remote",
      "New York, NY",
      "San Francisco, CA",
      "Los Angeles, CA",
      "Chicago, IL",
      "Boston, MA",
      "Austin, TX",
    ],
    Industry: [
      "Technology",
      "Data Analysis",
      "Product Management",
      "Design",
      "Marketing",
      "Finance",
      "Healthcare",
    ],
    "Experience Level": ["Entry-Level", "Mid-Level", "Senior-Level"],
    "Salary Range": [
      "$50,000 - $75,000",
      "$75,001 - $100,000",
      "$100,001 - $150,000",
      "$150,000+",
    ],
    Workplace: ["Remote", "On-site", "Hybrid"],
  };

  const jobs = [
    {
      title: "Software Engineer",
      company: "Tech Innovators Inc.",
      location: "Remote",
      industry: "Technology",
      experience: "Mid-Level",
      salary: "$100,001 - $150,000",
      workplace: "Remote",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjoiB3PjAn-QaEEtnfRZaFVO8DvB9GB3_9hjcl_CSJMNGYoMGFV4JCSLThd50SfW7jt-aes9nDcyH9GoXsWELUQweR2OqW5CzCyfahImof66plIXKzb2UUVlI6gxUSYpHEYTUmNBGoSyX0RO0PnQbDaczy5Tboh1DkdQHDYfGpFeRODqw631iQZY2FLvnu9upFnMEqK26FR_eD-Godek711C9FjoyedrGHIn8hsyIqFfQ2ux_y5PgqQEYyMKeDbzWrqbreVU0U6vA",
      bookmarks: 5,
    },
    {
      title: "Data Analyst",
      company: "Data Insights Corp.",
      location: "New York, NY",
      industry: "Data Analysis",
      experience: "Entry-Level",
      salary: "$75,001 - $100,000",
      workplace: "Hybrid",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdHr2dIHzUrXQKvxa5qoqpRwRUmoTOvODzHq_ZVacljfVYvWonKVZs8kPdOmoVdgjBJcHxDPTV3inXvpHe-er_uG18rrFhPjNgswYo0NHWVooMETM6d1iVBzuAUCzsDve6849-V9dPpzNPJrxDLjpy-C0UbzWjYVybhVcmqHrplm8Kjsem74Cqe73hYfOspEJakf1dcrBuFiQ_4v9gkuKLuYI1kQSVss_f5NPCBhkr3RhWRXVMGHsl4zdI5txyEebrYZglMk5jl18",
      bookmarks: 7,
    },
    {
      title: "Product Manager",
      company: "Product Visionaries LLC",
      location: "San Francisco, CA",
      industry: "Product Management",
      experience: "Senior-Level",
      salary: "$150,000+",
      workplace: "On-site",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATGWR7sacwmMrCLEpsWGT8lLi0btg3z8D3J3zNmXhT58fyBpcPjTMzbK7FO44tpAmQftpH7JIYjiO92dLRGqHJ4ZuoYhd4kQwLA5m3n1ozsU37YJLuAyxH8mZUGGIGDupiHQifecugvb1efXXLSK0r4vqxDTvYkxELoN-vdL_24Qk0B9_ZyqdTUeb9NhQ936QgoT5MhGSUogU-7nJL9BnVluII926zzdkZQlthEkbEFwsUJRbRUaCL-Q6PGL0G4OLouAjnXLfb86k",
      bookmarks: 3,
    },
    {
      title: "UX/UI Designer",
      company: "Design Dynamics Co.",
      location: "Los Angeles, CA",
      industry: "Design",
      experience: "Mid-Level",
      salary: "$100,001 - $150,000",
      workplace: "Hybrid",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDwvK8Sp1ZrFrW09a7iwLmCyRqT05Apy7Lhg0ix9WfR2B_-cqPGWUAGVdOcbYfcn667Q_Jx48AURukPjtpTjAxiXvWA21PvfK6MlokA1_4TqEtGzPzlfULQbmn6nfH_1Ux7z_lrIwWrrNe81S_vquHEOWphlrmOIOGo_45V295xkn7ryAla-TvEsLo5MBOmWmalrnEc_HqYQ0aBMx7Z1rtH6y7bVfnI_G6YCfSFfaGAfxBtJEbwBEikzbfh8Ql0yRJkznN8GHBHQRY",
      bookmarks: 4,
    },
    {
      title: "Marketing Specialist",
      company: "Marketing Masters Ltd.",
      location: "Chicago, IL",
      industry: "Marketing",
      experience: "Entry-Level",
      salary: "$50,000 - $75,000",
      workplace: "On-site",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBdKyLhbRdPv_aFL1E9PygqFEEEvoTtMuFUjLeuEZ38lVOmOlK06Tq6MdgyM5EfaEEk4Nz3jAl0_UzWSVA7y6ZBB6QAivHFmsdTHLldXQwfCsWkvnwk5Pie7EjNViu-dWcGjErkHE5DmqopgC7MWApXUCWLJZrUtr4uOpMK1CJear9anoIYidNMmRYpk8LWl3906VVeBjWGA4Hhl9Yd4KPlG7ZiKJ0mtzKSwk901eBkN_WNlbUvv3ZrFtLJpjFcWy4nt-vvxUrb7M4",
      bookmarks: 2,
    },
    {
      title: "Financial Analyst",
      company: "Finance Pros Inc.",
      location: "Boston, MA",
      industry: "Finance",
      experience: "Mid-Level",
      salary: "$75,001 - $100,000",
      workplace: "Hybrid",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjoiB3PjAn-QaEEtnfRZaFVO8DvB9GB3_9hjcl_CSJMNGYoMGFV4JCSLThd50SfW7jt-aes9nDcyH9GoXsWELUQweR2OqW5CzCyfahImof66plIXKzb2UUVlI6gxUSYpHEYTUmNBGoSyX0RO0PnQbDaczy5Tboh1DkdQHDYfGpFeRODqw631iQZY2FLvnu9upFnMEqK26FR_eD-Godek711C9FjoyedrGHIn8hsyIqFfQ2ux_y5PgqQEYyMKeDbzWrqbreVU0U6vA",
      bookmarks: 4,
    },
    {
      title: "Healthcare Administrator",
      company: "HealthCare Solutions",
      location: "Austin, TX",
      industry: "Healthcare",
      experience: "Senior-Level",
      salary: "$150,000+",
      workplace: "On-site",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdHr2dIHzUrXQKvxa5qoqpRwRUmoTOvODzHq_ZVacljfVYvWonKVZs8kPdOmoVdgjBJcHxDPTV3inXvpHe-er_uG18rrFhPjNgswYo0NHWVooMETM6d1iVBzuAUCzsDve6849-V9dPpzNPJrxDLjpy-C0UbzWjYVybhVcmqHrplm8Kjsem74Cqe73hYfOspEJakf1dcrBuFiQ_4v9gkuKLuYI1kQSVss_f5NPCBhkr3RhWRXVMGHsl4zdI5txyEebrYZglMk5jl18",
      bookmarks: 3,
    },
    {
      title: "Full Stack Developer",
      company: "CodeCrafters Ltd.",
      location: "Remote",
      industry: "Technology",
      experience: "Mid-Level",
      salary: "$100,001 - $150,000",
      workplace: "Remote",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATGWR7sacwmMrCLEpsWGT8lLi0btg3z8D3J3zNmXhT58fyBpcPjTMzbK7FO44tpAmQftpH7JIYjiO92dLRGqHJ4ZuoYhd4kQwLA5m3n1ozsU37YJLuAyxH8mZUGGIGDupiHQifecugvb1efXXLSK0r4vqxDTvYkxELoN-vdL_24Qk0B9_ZyqdTUeb9NhQ936QgoT5MhGSUogU-7nJL9BnVluII926zzdkZQlthEkbEFwsUJRbRUaCL-Q6PGL0G4OLouAjnXLfb86k",
      bookmarks: 6,
    },
  ];

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
      Industry: [],
      "Experience Level": [],
      "Salary Range": [],
      Workplace: [],
    });
    setCurrentPage(1);
  };

  const removeFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== option),
    }));
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (filters.Location.length === 0 ||
        filters.Location.includes(job.location)) &&
      (filters.Industry.length === 0 ||
        filters.Industry.includes(job.industry)) &&
      (filters["Experience Level"].length === 0 ||
        filters["Experience Level"].includes(job.experience)) &&
      (filters["Salary Range"].length === 0 ||
        filters["Salary Range"].includes(job.salary)) &&
      (filters.Workplace.length === 0 ||
        filters.Workplace.includes(job.workplace))
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-white font-poppins">
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Filter Section */}
        <div className="w-full lg:w-80 bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Filter</h2>
            <button
              className="lg:hidden text-blue-500 font-medium"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          <p className="text-gray-600 text-base font-normal mb-4">
            {Object.values(filters).flat().length} filters applied
          </p>
          <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
            <button
              onClick={clearFilters}
              className="w-full bg-blue-100 text-gray-900 font-semibold py-2 rounded-full hover:bg-blue-200 transition-colors mb-6"
            >
              Clear Filters
            </button>

            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {category}
                </h3>
                {options.map((option) => (
                  <label key={option} className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      checked={filters[category].includes(option)}
                      onChange={() => handleFilterChange(category, option)}
                      className="h-5 w-5 rounded-md appearance-none border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:items-center checked:after:justify-center checked:after:h-full checked:after:w-full focus:ring-0 focus:outline-none transition-colors cursor-pointer"
                    />
                    <span className="text-gray-900 text-base font-normal">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ))}

            <button className="w-full bg-blue-200 text-gray-900 font-semibold py-2 rounded-full hover:bg-blue-300 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recommended Jobs
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(filters).flatMap(([category, options]) =>
                options.map((option) => (
                  <div
                    key={`${category}-${option}`}
                    className="flex items-center bg-gray-200 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full"
                  >
                    <span>{option}</span>
                    <button
                      onClick={() => removeFilter(category, option)}
                      className="ml-2 text-gray-600 hover:text-gray-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {paginatedJobs.length === 0 ? (
              <p className="text-gray-600 text-base font-normal">
                No jobs match the selected filters.
              </p>
            ) : (
              paginatedJobs.map((job, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex flex-col sm:flex-row gap-4 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      {/* <p className="text-gray-600 text-base font-normal">
                        Bookmark
                      </p> */}
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-base font-normal mb-4">
                        {job.company} | {job.location}
                      </p>
                      <button className="flex items-center gap-2 bg-gray-200 text-gray-900 text-sm font-medium py-1.5 px-3 rounded-full hover:bg-gray-300 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
                        </svg>
                        Apply
                      </button>
                    </div>
                    <div
                      className="w-full sm:w-1/3 h-40 bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url(${job.image})` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        onClick={() => handleBookMarkClick(job.title)}
                        viewBox="0 0 256 256"
                        className={`cursor-pointer transition-all duration-200 ${bookmarkedJobs[job.title]
                            ? "text-purple-600 scale-110 drop-shadow-md"
                            : "text-gray-600"
                          }`}
                      >
                        {bookmarkedJobs[job.title] ? (
                          // Filled Bookmark
                          <path
                            fill="currentColor"
                            d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"
                          />
                        ) : (
                          // Outline Bookmark
                          <path
                            fill="currentColor"
                            d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"
                          />
                        )}
                      </svg>

                      {/* <span className="text-gray-600 text-base font-normal">
                        {job.bookmarks}
                      </span> */}
                    </div>
                  </div>

                </div>

              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentPage === page
                        ? "bg-blue-200 text-gray-900"
                        : "bg-gray-200 text-gray-600 hover:bg-blue-100"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
