import React, { useState } from "react";
import { Bell, Menu, X } from "lucide-react"; // optional icons
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useAuth } from "../contexts/AuthContexts";
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ userData }) => {
    const { user, role, token } = useAuth();

    const navLinks = {
        default: [
            { label: "Features", href: "#key-features" },
            { label: "Testimonials", href: "#user-review" },
            { label: "FAQs", href: "#faq-section" },
            { label: "About Us", href: "#footer" },
        ],
        admin: [
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Users", href: "/admin/users" },
            { label: "Jobs", href: "/admin/jobs" },
            { label: "Companies", href: "/admin/companies" },
        ],
        candidate: [
            { label: "Dashboard", href: "/user/dashboard" },
            { label: "Resume Builder", href: "/user/resume" },
            { label: "Best Resumes", href: "/user/best-resumes" },
            { label: "Jobs", href: "/user/job-search" },
            { label: "Saved Jobs", href: "/user/saved-jobs" },
        ],
        user: [
            { label: "Dashboard", href: "/user/dashboard" },
            { label: "Resume Builder", href: "/user/resume" },
            { label: "Best Resumes", href: "/user/best-resumes" },
            { label: "Jobs", href: "/user/job-search" },
            { label: "Saved Jobs", href: "/user/saved-jobs" },
        ],
        recruiter: [
            { label: "Dashboard", href: "/recruiter/recruiter-analytics" },
            { label: "Post Job", href: "/recruiter/recruiter-postjob" },
            { label: "Candidates", href: "/recruiter/recruiter-candidates" },
        ],
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isLoggedIn = !!user && !!token;
    const navigate = useNavigate();
    const { logout } = useAuth();

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLogout = () => {
        // setShowConfirm(true);
        logout();
        navigate('/');
    };

    const userRole = isLoggedIn ? userData.role : "default";
    // const userRole = "admin"

    return (
        <div className="w-full sticky top-0 z-50 border-b border-gray-200 bg-white/30 backdrop-blur-md shadow-sm">
            <nav className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto sticky top-0 bg-white/30 backdrop-blur-md px-4 md:px-6 lg:px-8 py-3 md:py-4 z-50 ">
                <div className="flex items-center w-full md:w-auto justify-between">
                    <a href="/">
                        <img
                            src={logo}
                            alt="JobFit Logo"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </a>
                    <button className="md:hidden ml-4 text-gray-700 focus:outline-none" onClick={toggleDrawer}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
                <div className="hidden md:flex md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <ul className="flex flex-col md:flex-row items-center text-gray-700 font-medium w-full md:w-auto">
                        {navLinks[userRole]?.map((link) => (
                            <li key={link.href} className="w-full md:w-auto">
                                <a
                                    href={link.href}
                                    className="flex items-center justify-center hover:text-[#9b44fe] hover:bg-gray-100 px-2 md:px-4 py-2 text-center rounded-lg font-medium text-lg md:text-xl transition-colors duration-200 ease-in-out w-full"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {
                        isLoggedIn ?
                            <div className="flex gap-3 items-center">
                                {/* <div className="p-3 rounded-full bg-slate-100 cursor-pointer">
                                    <Bell />
                                </div> */}
                                <div>
                                    <Avatar userData={{
                                        userName: userData.userName,
                                        email: userData.email,
                                        sub: userData.sub,
                                        picture: userData.picture,
                                        role: userData.role
                                    }} />
                                </div>
                            </div>
                            :
                            <button onClick={() => navigate('/auth')} className="relative z-10 w-full md:w-[6.5em] h-[2.3em] m-2 px-4 py-2 bg-black text-white border-none rounded-[0.625em] text-[16px] md:text-[20px] font-bold cursor-pointer overflow-hidden group transition-all duration-300 ease-in-out hover:bg-gray-900 hover:text-black">
                                Login
                                <span className="absolute inset-0 -z-10 transition-transform duration-500 ease-out transform skew-x-[-45deg] scale-x-0 bg-white group-hover:scale-x-100"></span>
                            </button>
                    }
                </div>

                {/* Drawer for mobile */}
                {/* <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-md z-50 md:hidden ${isDrawerOpen ? 'block' : 'hidden'}`}
                    onClick={toggleDrawer}
                >
                    <div className="absolute left-0 right-0 top-0 w-full h-full bg-white/90 backdrop-blur-sm p-4 shadow-lg transform transition-transform duration-300 ease-in-out">
                        <div className="flex justify-between items-center">
                            <a href="/" className="mb-4 block">
                                <img
                                    src={logo}
                                    alt="JobFit Logo"
                                    className="h-8 w-auto object-contain"
                                />
                            </a>
                            <div className="">
                                <button onClick={toggleDrawer} className="text-gray-700 focus:outline-none">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 bg-white/90 backdrop-blur-md">
                            <ul className="space-y-4">
                                {navLinks[userRole]?.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="block px-4 py-2 text-lg font-medium text-gray-700 rounded-lg"
                                            onClick={toggleDrawer}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <button className="relative z-10 w-full h-[2.3em] mt-4 px-4 py-2 bg-black text-white border-none rounded-[0.625em] text-[16px] font-bold cursor-pointer overflow-hidden group transition-all duration-300 ease-in-out hover:bg-gray-900 hover:text-black" onClick={toggleDrawer}>
                                Login
                                <span className="absolute inset-0 -z-10 transition-transform duration-500 ease-out transform skew-x-[-45deg] scale-x-0 bg-white group-hover:scale-x-100"></span>
                            </button>
                        </div>
                    </div>
                </div> */}
                <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={toggleDrawer}
                    style={{ padding: 0 }}
                >
                    <div
                        className="absolute top-0 left-0 w-full max-h-[80vh] bg-white/95 backdrop-blur-md p-6 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
                        style={{ transform: isDrawerOpen ? 'translateY(0)' : 'translateY(-100%)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <a href="/" className="block">
                                <img
                                    src={logo}
                                    alt="JobFit Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </a>
                            <button
                                onClick={toggleDrawer}
                                className="text-gray-700 focus:outline-none hover:bg-gray-100 p-2 rounded-full"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-4">
                            <ul className="space-y-3">
                                {navLinks[userRole]?.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="block px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                            onClick={toggleDrawer}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {isLoggedIn ? (
                                <div className="mt-6 flex items-center justify-between space-x-4">
                                    <div className="flex items-center space-x-3" onClick={() => {
                                        navigate('/user/profile');
                                        toggleDrawer();
                                    }}>
                                        {userData?.picture ? (
                                            <img
                                                src={userData.picture}
                                                alt="User Profile"
                                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) :
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                                                style={{ display: userData?.Picture ? 'none' : 'flex' }}
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>}
                                        <span className="text-lg font-medium text-gray-800 truncate max-w-[150px]">
                                            {userData?.userName || 'User'}
                                        </span>
                                    </div>
                                    <button
                                        className="relative z-10 w-10 h-10 flex items-center justify-center bg-gray-200 text-black rounded-lg cursor-pointer overflow-hidden  transition-all duration-300 ease-in-out"
                                        onClick={() => {
                                            handleLogout();
                                            toggleDrawer();
                                        }}
                                        aria-label="Logout"
                                    >
                                        <FiLogOut className="w-6 h-6" />
                                        <span className="absolute inset-0 -z-10 transition-transform duration-500 ease-out transform skew-x-[-45deg] scale-x-0 bg-white " />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="relative z-10 w-full mt-6 px-6 py-3 bg-black text-white rounded-lg text-lg font-semibold cursor-pointer overflow-hidden group transition-all duration-300 ease-in-out hover:bg-gray-900"
                                    onClick={() => {
                                        navigate('/auth');
                                        toggleDrawer();
                                    }}
                                >
                                    Login
                                    <span className="absolute inset-0 -z-10 transition-transform duration-500 ease-out transform skew-x-[-45deg] scale-x-0 bg-white group-hover:scale-x-100" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

        </div>
    );
};

export default Navbar;

