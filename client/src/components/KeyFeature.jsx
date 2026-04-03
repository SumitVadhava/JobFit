import React from "react";
// import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import Profile from "../assets/profile.gif";
import JobOffer from "../assets/jobOffer.gif";
import Data_Extraction from "../assets/Data_extraction.gif";

const companies = [
  { name: "Google", logo: "/assets/company-logos/google.svg" },
  { name: "Microsoft", logo: "/assets/company-logos/microsoft.svg" },
  { name: "Apple", logo: "/assets/company-logos/apple.svg" },
  { name: "Meta", logo: "/assets/company-logos/meta.png" },
  { name: "Amazon", logo: "/assets/company-logos/amazon.png" },
  { name: "IBM", logo: "/assets/company-logos/ibm.svg" },
  { name: "Tesla", logo: "/assets/company-logos/tesla.png" },
  { name: "Adobe", logo: "/assets/company-logos/adobe.png" },
  { name: "Netflix", logo: "/assets/company-logos/netflix.jpg" },
  { name: "Nvidia", logo: "/assets/company-logos/nvidia.png" },
  { name: "Intel", logo: "/assets/company-logos/intel.jpg" },
  { name: "Oracle", logo: "/assets/company-logos/oracle.png" },
];

const KeyFeatures = () => {
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto py-16">
      <div className="container mx-auto px-4">
        <section className="py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Popular Hiring Ecosystem
              </h2>
              <p className="text-gray-600 text-lg">
                Logos are served from local assets for safer and more reliable
                loading.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="px-4 py-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    loading="lazy"
                    className="h-10 w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="key-features">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {/* Card 1 */}
            <Link
              to="/features/user-registration"
              className="group bg-white p-6 rounded-xl shadow-md border border-transparent hover:border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer block"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={Profile}
                  className="w-full transition-transform duration-400 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                User Registration &amp; Profiles
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sign up via email, create profiles with personal info,
                job/hiring preferences for job seekers, recruiters, and admins.
              </p>
              <span className="inline-block bg-purple-700 text-white px-6 py-2 rounded-lg font-medium group-hover:bg-purple-600 group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all duration-200">
                Learn More
              </span>
            </Link>

            {/* Card 2 */}
            <Link
              to="/features/resume-matching"
              className="group bg-white p-6 rounded-xl shadow-md border border-transparent hover:border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer block"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={JobOffer}
                  className="w-full transition-transform duration-400 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                Resume &amp; Job Matching
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload resumes/PDFs, extract skills/experience, match with job
                descriptions, and calculate ATS scores (out of 100).
              </p>
              <span className="inline-block bg-purple-700 text-white px-6 py-2 rounded-lg font-medium group-hover:bg-purple-600 group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all duration-200">
                Learn More
              </span>
            </Link>

            {/* Card 3 */}
            <Link
              to="/features/ats-analytics"
              id="user-review"
              className="group bg-white p-6 rounded-xl shadow-md border border-transparent hover:border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer block"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={Data_Extraction}
                  className="w-full transition-transform duration-400 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                ATS Score Analytics
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Track ATS scores over time, view breakdowns (keywords, skills),
                and get actionable feedback to improve resumes.
              </p>
              <span className="inline-block bg-purple-700 text-white px-6 py-2 rounded-lg font-medium group-hover:bg-purple-600 group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all duration-200">
                Learn More
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default KeyFeatures;
