import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";
import PortfolioGif from "../assets/Portfolio.gif";

const Hero = () => {
    const { role } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (!role || role === "default") {
            navigate("/login");
        } else if (role === "recruiter") {
            navigate("/recruiter/dashboard");
        } else if (role === 'candidate' || role === 'user') {
            navigate("/candidate/dashboard");
        } else if (role === 'admin') {
            navigate("/admin/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Side */}
                <div>
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
                            className="bg-purple-600 text-white flex items-center gap-2 px-6 py-2 rounded transition-all duration-300 hover:bg-purple-800 group"
                        >
                            Get started
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <button 
                            className="border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-100" 
                            onClick={() => window.open('https://www.youtube.com/@JobFit-1.0', '_blank')}
                        >
                            Watch Video
                        </button>
                    </div>
                </div>

                {/* Right Side - Portfolio.gif fills container */}
                <div className="w-full h-full md:h-80 bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
                    <img
                        src={PortfolioGif}
                        className="w-full h-full object-fill"
                        alt="Portfolio Animation"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
