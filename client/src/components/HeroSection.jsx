// import React, { useState } from "react";
// import { HandPlatter, Menu, X } from "lucide-react"; 
// import KeyFeatures from "./KeyFeature";
// import UserReviewSection from "./UserReviewSection";
// import FAQSection from "./FAQSection";
// import { useNavigate } from "react-router-dom";

// const HeroSection = () => {
//     const role = "recruiter";
//     const navigate = useNavigate();

//     const handleGetStarted = () => {
//         if(role === 'user'){
//             navigate('/user/dashboard');
//         }else if(role === 'admin'){
//             navigate('/admin/dashboard');
//         }
//         else if(role === 'recruiter'){
//             navigate('/recruiter/recruiter-analytics');
//         }
//     }

//     return (
//         <section className="bg-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

//                     {/* Left Side */}
//                     <div>
//                         <h1 className="text-4xl font-bold text-black mb-4 leading-tight">
//                             Resonate with the <br /> visitor&apos;s problem
//                         </h1>
//                         <p className="text-gray-700 mb-8">
//                             Describe exactly what your product or service does to solve this problem.
//                             <br />
//                             Avoid using verbose words or phrases.
//                         </p>
//                         <div className="flex gap-4">
//                             <button onClick={handleGetStarted} className="bg-black text-white px-6 py-2 rounded">
//                                 Get started
//                             </button>
//                             <button className="border border-black text-black px-6 py-2 rounded">
//                                 Learn more
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right Side - Placeholder Image */}
//                     <div className="w-full h-64 md:h-80 bg-gray-300 flex items-center justify-center">
//                         <span className="text-gray-500 text-sm">Image Placeholder</span>
//                     </div>

//                 </div>
//             </div>
//             <KeyFeatures />
//             <UserReviewSection />
//             <FAQSection />
//         </section>
//     );
// }

// export default HeroSection;



import React, { useState, useEffect } from "react";
import Skeleton from "./Skeleton";
import KeyFeatures from "./KeyFeature";
import UserReviewSection from "./UserReviewSection";
import FAQSection from "./FAQSection";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import PortfolioGif from "../assets/Portfolio.gif";
import { useAuth } from "../contexts/AuthContexts";

const HeroSection = () => {
    const [loading, setLoading] = useState(false); // default: not loading
    const { role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Detect slow connection
        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
        if (
            connection &&
            ["slow-2g", "2g", "3g"].includes(connection.effectiveType)
        ) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);

    const handleGetStarted = () => {
        if (role === "recruiter") {
            navigate("/recruiter/recruiter-analytics");
        }else if(role === 'candidate') {
            navigate("/user/dashboard");
        }
        else if(role === 'admin') {
            navigate("/admin/dashboard")
        }
    };

    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Left Side */}
                    <div>
                        {loading ? (
                            <>
                                <Skeleton className="h-10 w-3/4 mb-4" />
                                <Skeleton className="h-6 w-2/3 mb-8" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-32 rounded" />
                                    <Skeleton className="h-10 w-32 rounded" />
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold text-purple-800 mb-4 leading-tight">
                                    Resonate with the <br /> visitor's problem
                                </h1>
                                <p className="text-gray-700 mb-8">
                                    Describe exactly what your product or service does to solve
                                    this problem.
                                    <br />
                                    Avoid using verbose words or phrases.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleGetStarted}
                                        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-800"
                                    >
                                        Get started
                                    </button>
                                    <button  className="border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-100"  onClick={() => window.open('http://www.youtube.com/@JobFit-1.0', '_blank')}>
                                        Watch Video
                                    </button> 
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side - Portfolio.gif fills container */} 
                    <div className="w-full h-full md:h-80 bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
                        {loading ? (
                            <Skeleton className="h-48 w-48 rounded" />
                        ) : (
                            <img
                                src={PortfolioGif}
                                className="w-full h-full object-fill"
                                alt="Portfolio Animation"
                            />
                        )}
                    </div>
                </div>
            </div>
            {loading ? (
                <>
                    {/* Key Features Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mb-16">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-xl shadow-md max-w-sm"
                            >
                                <Skeleton className="h-48 w-full mb-6 rounded-lg" />
                                <Skeleton className="h-6 w-2/3 mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-6" />
                                <Skeleton className="h-10 w-32 mx-auto rounded-lg" />
                            </div>
                        ))}
                    </div>
                    {/* User Reviews Skeleton */}
                    <div className="relative overflow-hidden max-w-5xl mx-auto mb-16">
                        <div className="flex gap-8 px-6">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-96 bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4"
                                >
                                    <div className="flex items-center mb-4 gap-2">
                                        {[...Array(5)].map((_, j) => (
                                            <Skeleton key={j} className="w-5 h-5 rounded" />
                                        ))}
                                    </div>
                                    <Skeleton className="h-4 w-full mb-4" />
                                    <Skeleton className="h-4 w-2/3 mb-2" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* FAQ Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
                        {[...Array(2)].map((_, colIdx) => (
                            <div key={colIdx} className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg border p-4">
                                        <Skeleton className="h-6 w-2/3 mb-2" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Footer Skeleton */}
                    <div className="bg-gray-100 border-t border-gray-200 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                            <div className="space-y-6">
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-6 w-24 mb-2" />
                                <div className="flex space-x-3">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                </div>
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i}>
                                    <div className="space-y-3">
                                        {[...Array(4)].map((_, j) => (
                                            <Skeleton key={j} className="h-4 w-32" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                            <Skeleton className="h-4 w-48 mb-2" />
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <KeyFeatures />
                    </div>

                    <div>
                        <UserReviewSection />
                    </div>

                    <div>
                        <FAQSection />
                    </div>
                    <div id="footer">
                        <Footer />
                    </div>
                </>
            )}
        </section>
    );
};

export default HeroSection;
