// import React from "react";
// import Marquee from "react-fast-marquee";

// const KeyFeatures = () => {
//   // Company logos data
//   const companies = [
//     {
//       name: "Google",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
//     },
//     {
//       name: "Microsoft",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
//     },
//     {
//       name: "Apple",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
//     },
//     {
//       name: "Meta",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
//     },
//     {
//       name: "Amazon",
//       logo: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-Logo.png",
//     },
//     {
//       name: "IBM",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
//     },
//     {
//       name: "Tesla",
//       logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
//     },
//     {
//       name: "Adobe",
//       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNPRQuLPpKrjO5bdFPgVGRoAbysq635o6ZQ&s",
//     },
//     {
//       name: "Netflix",
//       logo: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940",
//     },
//     {
//       name: "Nvidia",
//       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPSt8IAZHIwQXUj8owif7VyiELZvOi0w1pA&s",
//     },
//     {
//       name: "Intel",
//       logo: "https://cdn.mos.cms.futurecdn.net/MKBZhC5Dz7u76BeTtkgW3a-1200-80.jpg",
//     },
//     {
//       name: "Oracle",
//       logo: "https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo-1.png",
//     },
//   ];

//   // Second set of company logos (different companies)
//   //   const additionalCompanies = [
//   //     {
//   //       name: "Tesla",
//   //       logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
//   //     },
//   //     {
//   //       name: "Adobe",
//   //       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNPRQuLPpKrjO5bdFPgVGRoAbysq635o6ZQ&s",
//   //     },
//   //     {
//   //       name: "Netflix",
//   //       logo: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940",
//   //     },
//   //     {
//   //       name: "Nvidia",
//   //       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPSt8IAZHIwQXUj8owif7VyiELZvOi0w1pA&s",
//   //     },
//   //     {
//   //       name: "Intel",
//   //       logo: "https://cdn.mos.cms.futurecdn.net/MKBZhC5Dz7u76BeTtkgW3a-1200-80.jpg",
//   //     },
//   //     {
//   //       name: "Oracle",
//   //       logo: "https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo-1.png",
//   //     },
//   //   ];

//   return (
//     <div className="min-h-screen bg-white max-w-7xl mx-auto py-16">
//       <div className="container mx-auto px-4">
//         {/* Trusted Companies Section with Professional Marquee */}
//         <section className="py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16">
//           <div className="container mx-auto px-6">
//             <div className="text-center mb-12">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//                 Trusted by Industry Leaders
//               </h2>
//               <p className="text-gray-600 text-lg">
//                 Join thousands of companies that trust our platform
//               </p>
//             </div>

//             {/* Custom Marquee Container */}
//             <div className="relative overflow-hidden">
//               {" "}
//               {/* Hide scrollbar */}
//               {/* Gradient overlays for smooth fade effect */}
//               <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
//               <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
//               <Marquee
//                 gradient={true}
//                 gradientColor={[244, 63, 94]} // Attractive pinkish gradient
//                 gradientWidth={100}
//                 speed={50}
//                 pauseOnHover={true}
//                 style={{ width: "100%", height: "auto" }} // Ensures full width without overflow
//               >
//                 {companies.map((company) => (
//                   <div
//                     key={company.name}
//                     className="flex-shrink-0 mx-8 px-6 py-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group"
//                   >
//                     <img
//                       src={company.logo}
//                       alt={company.name}
//                       className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                 ))}
//                 {/* {additionalCompanies.map((company) => (
//                   <div
//                     key={company.name}
//                     className="flex-shrink-0 mx-8 px-6 py-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group"
//                   >
//                     <img
//                       src={company.logo}
//                       alt={company.name}
//                       className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                 ))} */}
//               </Marquee>
//             </div>
//           </div>
//         </section>

//         {/* Key Features Section */}
//         <section>
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Key Features
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto"></div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
//             <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
//               <div className="h-48 bg-gray-100 mb-6 flex items-center justify-center text-gray-500 rounded-lg">
//                 [Feature 1 Image Placeholder]
//               </div>
//               <h3 className="text-xl font-semibold text-purple-800 mb-4">
//                 User Registration & Profiles
//               </h3>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 Sign up via email, create profiles with personal info,
//                 job/hiring preferences for job seekers, recruiters, and admins.
//               </p>
//               <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 font-medium">
//                 Learn More
//               </button>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
//               <div className="h-48 bg-gray-100 mb-6 flex items-center justify-center text-gray-500 rounded-lg">
//                 [Feature 2 Image Placeholder]
//               </div>
//               <h3 className="text-xl font-semibold text-purple-800 mb-4">
//                 Resume & Job Matching
//               </h3>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 Upload resumes/PDFs, extract skills/experience, match with job
//                 descriptions, and calculate ATS scores (out of 100).
//               </p>
//               <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 font-medium">
//                 Learn More
//               </button>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
//               <div className="h-48 bg-gray-100 mb-6 flex items-center justify-center text-gray-500 rounded-lg">
//                 [Feature 3 Image Placeholder]
//               </div>
//               <h3 className="text-xl font-semibold text-purple-800 mb-4">
//                 ATS Score Analytics
//               </h3>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 Track ATS scores over time, view breakdowns (keywords, skills),
//                 and get actionable feedback to improve resumes.
//               </p>
//               <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 font-medium">
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default KeyFeatures;


import React from "react";
import Marquee from "react-fast-marquee";
import Profile from "../assets/profile.gif";
import JobOffer from "../assets/jobOffer.gif";
import Data_Extraction from "../assets/Data_extraction.gif";
const KeyFeatures = () => {
  // Company logos data
  const companies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
    },
    {
      name: "Amazon",
      logo: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-Logo.png",
    },
    {
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    },
    {
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    },
    {
      name: "Adobe",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNPRQuLPpKrjO5bdFPgVGRoAbysq635o6ZQ&s",
    },
    {
      name: "Netflix",
      logo: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940",
    },
    {
      name: "Nvidia",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPSt8IAZHIwQXUj8owif7VyiELZvOi0w1pA&s",
    },
    {
      name: "Intel",
      logo: "https://cdn.mos.cms.futurecdn.net/MKBZhC5Dz7u76BeTtkgW3a-1200-80.jpg",
    },
    {
      name: "Oracle",
      logo: "https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo-1.png",
    },
  ];

  // Second set of company logos (different companies)
  //   const additionalCompanies = [
  //     {
  //       name: "Tesla",
  //       logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
  //     },
  //     {
  //       name: "Adobe",
  //       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNPRQuLPpKrjO5bdFPgVGRoAbysq635o6ZQ&s",
  //     },
  //     {
  //       name: "Netflix",
  //       logo: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940",
  //     },
  //     {
  //       name: "Nvidia",
  //       logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPSt8IAZHIwQXUj8owif7VyiELZvOi0w1pA&s",
  //     },
  //     {
  //       name: "Intel",
  //       logo: "https://cdn.mos.cms.futurecdn.net/MKBZhC5Dz7u76BeTtkgW3a-1200-80.jpg",
  //     },
  //     {
  //       name: "Oracle",
  //       logo: "https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo-1.png",
  //     },
  //   ];

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto py-16">
      <div className="container mx-auto px-4">
        {/* Trusted Companies Section with Professional Marquee */}
        <section className="py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Trusted by Industry Leaders
              </h2>
              <p className="text-gray-600 text-lg">
                Join thousands of companies that trust our platform
              </p>
            </div>

            <div className="relative overflow-hidden">
              {" "}
              <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              <Marquee
                gradient={true}
                gradientColor={[244, 63, 94]} // Attractive pinkish gradient
                gradientWidth={100}
                speed={50}
                pauseOnHover={true}
                style={{ width: "100%", height: "auto" }} // Ensures full width without overflow
              >
                {companies.map((company) => (
                  <div
                    key={company.name}
                    className="flex-shrink-0 mx-8 px-6 py-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
              <img src={Profile} />
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                User Registration & Profiles
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sign up via email, create profiles with personal info,
                job/hiring preferences for job seekers, recruiters, and admins.
              </p>
              <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 font-medium">
                Learn More
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
              <img src={JobOffer} />
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Resume & Job Matching
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload resumes/PDFs, extract skills/experience, match with job
                descriptions, and calculate ATS scores (out of 100).
              </p>
              <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 font-medium">
                Learn More
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
              <img src={Data_Extraction} />
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                ATS Score Analytics
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Track ATS scores over time, view breakdowns (keywords, skills),
                and get actionable feedback to improve resumes.
              </p>
              <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default KeyFeatures;
