import React, { useState, useEffect, useRef } from "react";
import { Bell, Menu, X } from "lucide-react"; // optional icons
import logo from "../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useAuth } from "../contexts/AuthContexts";
import { FiLogOut } from "react-icons/fi";

const NavShortcutItem = ({
    to,
    label,
    shortcut,
    userRole,
    location,
    onClick,
}) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (to.startsWith("#")) {
            e.preventDefault();
            const targetId = to.substring(1);

            if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                    if (targetId === "home") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                        const element = document.getElementById(targetId);
                        if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }
                }, 100);
            } else {
                if (targetId === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    const element = document.getElementById(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }
            }
        }

        if (onClick) {
            onClick(e);
        }
    };

    return (
        <li
            className="w-full md:w-auto"
            style={{ position: "relative", listStyle: "none" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <NavLink
                to={to}
                onClick={handleClick}
                className={({ isActive }) => {
                    const isActuallyActive =
                        userRole !== "default" && (isActive || location.hash === to);
                    return `flex items-center justify-center px-2 md:px-4 py-2 text-center rounded-lg font-medium text-lg md:text-xl transition-colors duration-200 ease-in-out w-full ${isActuallyActive
                        ? "text-[#9b44fe] bg-gray-100 shadow-sm"
                        : "text-gray-700 hover:text-[#9b44fe] hover:bg-gray-100"
                        }`;
                }}
            >
                {label}
            </NavLink>
            {shortcut && hovered && (
                <span
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginTop: "4px",
                        background: "#1e0a3c",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 100,
                        boxShadow: "0 2px 8px rgba(0,0,0,.18)",
                        letterSpacing: ".03em",
                        opacity: hovered ? 1 : 0,
                        transition: "opacity .15s ease",
                    }}
                >
                    {shortcut}
                    {/* tooltip arrow */}
                    <span
                        style={{
                            position: "absolute",
                            top: "-5px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "5px solid transparent",
                            borderRight: "5px solid transparent",
                            borderBottom: "5px solid #1e0a3c",
                        }}
                    />
                </span>
            )}
        </li>
    );
};

const Navbar = ({ userData }) => {
    const { user, role, token } = useAuth();
    const location = useLocation();

    const navLinks = {
        default: [
            { label: "Home", href: "#home" },
            { label: "Features", href: "#key-features" },
            { label: "Testimonials", href: "#user-review" },
            { label: "FAQs", href: "#faq-section" },
        ],
        admin: [
            { label: "Dashboard", href: "/admin/dashboard", shortcut: "Ctrl + D" },
            { label: "Users", href: "/admin/users", shortcut: "Ctrl + U" },
            { label: "Jobs", href: "/admin/jobs", shortcut: "Ctrl + J" },
            { label: "Companies", href: "/admin/companies", shortcut: "Ctrl + C" },
        ],
        candidate: [
            { label: "Dashboard", href: "/candidate/dashboard", shortcut: "Ctrl + D" },
            { label: "ATS Analyzer", href: "/candidate/ats", shortcut: "Ctrl + AS" },
            {
                label: "Best Resumes",
                href: "/candidate/best-resumes",
                shortcut: "Ctrl + BR",
            },
            { label: "Jobs", href: "/candidate/job-search", shortcut: "Ctrl + J" },
            { label: "Saved Jobs", href: "/candidate/saved-jobs", shortcut: "Ctrl + SJ" },
        ],
        user: [
            { label: "Dashboard", href: "/candidate/dashboard", shortcut: "Ctrl + D" },
            { label: "ATS Analyzer", href: "/candidate/ats", shortcut: "Ctrl + AS" },
            {
                label: "Best Resumes",
                href: "/candidate/best-resumes",
                shortcut: "Ctrl + BR",
            },
            { label: "Jobs", href: "/candidate/job-search", shortcut: "Ctrl + J" },
            { label: "Saved Jobs", href: "/candidate/saved-jobs", shortcut: "Ctrl + SJ" },
        ],
        recruiter: [
            {
                label: "Dashboard",
                href: "/recruiter/dashboard",
                shortcut: "Ctrl + D",
            },
            {
                label: "Post Job",
                href: "/recruiter/post-job",
                shortcut: "Ctrl + PJ",
            },
            {
                label: "Candidates",
                href: "/recruiter/candidates",
                shortcut: "Ctrl + C",
            },
            {
                label: "History",
                href: "/recruiter/history",
                shortcut: "Ctrl + H",
            },
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
        navigate("/");
    };

    const userRole = isLoggedIn ? userData.role : "default";
    // const userRole = "admin"

    /* ── Global keyboard shortcuts ── */
    const pendingKey = useRef(null); // first key of a 2-key sequence
    const seqTimer = useRef(null); // cleanup timer

    useEffect(() => {
        const onKeyDown = (e) => {
            // only fire when Ctrl is held, not inside an input/textarea
            if (!e.ctrlKey) return;
            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (!isLoggedIn) return;

            const key = e.key.toLowerCase();

            if (key === "d") {
                e.preventDefault();
                if (userRole === "admin") navigate("/admin/dashboard");
                else if (userRole === "recruiter")
                    navigate("/recruiter/dashboard");
                else navigate("/candidate/dashboard");
                pendingKey.current = null;
                return;
            }
            if (key === "r" && pendingKey.current !== "b") {
                e.preventDefault();
                if (userRole === "candidate" || userRole === "user")
                    navigate("/candidate/resume");
                pendingKey.current = null;
                return;
            }
            if (
                key === "j" &&
                pendingKey.current !== "s" &&
                pendingKey.current !== "p"
            ) {
                e.preventDefault();
                if (userRole === "admin") navigate("/admin/jobs");
                else if (userRole === "candidate" || userRole === "user")
                    navigate("/candidate/job-search");
                pendingKey.current = null;
                return;
            }
            if (key === "u" && userRole === "admin") {
                e.preventDefault();
                navigate("/admin/users");
                pendingKey.current = null;
                return;
            }
            if (key === "c") {
                e.preventDefault();
                if (userRole === "recruiter")
                    navigate("/recruiter/candidates");
                else if (userRole === "admin") navigate("/admin/companies");
                pendingKey.current = null;
                return;
            }
            if (key === "a") {
                e.preventDefault();
                if (userRole === "recruiter") navigate("/recruiter/profile");
                else navigate("/candidate/profile");
                pendingKey.current = null;
                return;
            }
            if (key === "h" && userRole === "recruiter") {
                e.preventDefault();
                navigate("/recruiter/history");
                pendingKey.current = null;
                return;
            }
            if (key === "l") {
                e.preventDefault();
                window.dispatchEvent(new Event('jobfit:signout-confirm'));
                pendingKey.current = null;
                return;
            }

            // ── two-key sequence starters ─────────────────────
            // Ctrl+B → wait for R  (Best Resumes)
            if (key === "b") {
                e.preventDefault();
                pendingKey.current = "b";
                clearTimeout(seqTimer.current);
                seqTimer.current = setTimeout(() => {
                    pendingKey.current = null;
                }, 600);
                return;
            }
            // Ctrl+S → wait for J  (Saved Jobs)
            if (key === "s") {
                e.preventDefault();
                pendingKey.current = "s";
                clearTimeout(seqTimer.current);
                seqTimer.current = setTimeout(() => {
                    pendingKey.current = null;
                }, 600);
                return;
            }
            // Ctrl+P → wait for J (Post Job)
            if (key === "p" && userRole === "recruiter") {
                e.preventDefault();
                pendingKey.current = "p";
                clearTimeout(seqTimer.current);
                seqTimer.current = setTimeout(() => {
                    pendingKey.current = null;
                }, 600);
                return;
            }

            // ── second key of sequence ────────────────────────
            if (key === "r" && pendingKey.current === "b") {
                e.preventDefault();
                if (userRole === "candidate" || userRole === "user")
                    navigate("/candidate/best-resumes");
                pendingKey.current = null;
                clearTimeout(seqTimer.current);
                return;
            }
            if (key === "j" && pendingKey.current === "s") {
                e.preventDefault();
                if (userRole === "candidate" || userRole === "user")
                    navigate("/candidate/saved-jobs");
                pendingKey.current = null;
                clearTimeout(seqTimer.current);
                return;
            }
            if (key === "j" && pendingKey.current === "p") {
                e.preventDefault();
                if (userRole === "recruiter") navigate("/recruiter/post-job");
                pendingKey.current = null;
                clearTimeout(seqTimer.current);
                return;
            }

            if (key === "a" && pendingKey.current === "s") {
                e.preventDefault();
                if (userRole === "candidate" || userRole === "user") navigate("/candidate/ats");
                pendingKey.current = null;
                clearTimeout(seqTimer.current);
                return;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            clearTimeout(seqTimer.current);
        };
    }, [isLoggedIn, navigate, logout]);

    return (
        <div className="w-full sticky top-0 z-50 border-b border-gray-200 bg-white/30 backdrop-blur-md shadow-sm">
            <nav className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto sticky top-0 bg-white/30 backdrop-blur-md px-4 md:px-6 lg:px-8 py-3 md:py-4 z-50 ">
                <div className="flex items-center w-full md:w-auto justify-between">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="JobFit Logo"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </Link>
                    <button
                        className="md:hidden ml-4 text-gray-700 focus:outline-none"
                        onClick={toggleDrawer}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="hidden md:flex md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <ul className="flex flex-col md:flex-row items-center text-gray-700 font-medium w-full md:w-auto gap-2">
                        {navLinks[userRole]?.map((link) => (
                            <NavShortcutItem
                                key={link.href}
                                to={link.href}
                                label={link.label}
                                shortcut={link.shortcut}
                                userRole={userRole}
                                location={location}
                            />
                        ))}
                    </ul>
                    {isLoggedIn ?
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
                        <button onClick={() => navigate('/login')} className="relative z-10 w-full md:w-[9em] h-[2.3em] m-2 px-4 py-2 bg-black text-white border-none rounded-[0.625em] text-[16px] md:text-[20px] font-bold cursor-pointer overflow-hidden group transition-all duration-300 ease-in-out hover:bg-gray-900 hover:text-black">
                            Get Started
                            <span className="absolute inset-0 -z-10 transition-transform duration-500 ease-out transform skew-x-[-45deg] scale-x-0 bg-white group-hover:scale-x-100"></span>
                        </button>
                    }
                </div>


                <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={toggleDrawer}
                    style={{ padding: 0 }}
                >
                    <div
                        className="absolute top-0 left-0 w-full max-h-[80vh] bg-white/95 backdrop-blur-md p-6 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
                        style={{
                            transform: isDrawerOpen ? "translateY(0)" : "translateY(-100%)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <Link to="/" className="block" onClick={toggleDrawer}>
                                <img
                                    src={logo}
                                    alt="JobFit Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                            <button
                                onClick={toggleDrawer}
                                className="text-gray-700 focus:outline-none hover:bg-gray-100 p-2 rounded-full"
                                aria-label="Close menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-4">
                            <ul className="space-y-3">
                                {navLinks[userRole]?.map((link) => (
                                    <NavShortcutItem
                                        key={link.href}
                                        to={link.href}
                                        label={link.label}
                                        shortcut={link.shortcut}
                                        userRole={userRole}
                                        location={location}
                                        onClick={toggleDrawer}
                                    />
                                ))}
                            </ul>
                            {isLoggedIn ? (
                                <div className="mt-6 flex items-center justify-between space-x-4">
                                    <div
                                        className="flex items-center space-x-3"
                                        onClick={() => {
                                            navigate("/candidate/profile");
                                            toggleDrawer();
                                        }}
                                    >
                                        {userData?.picture ? (
                                            <img
                                                src={userData.picture}
                                                alt="User Profile"
                                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.nextSibling.style.display = "flex";
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                                                style={{ display: userData?.Picture ? "none" : "flex" }}
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
                                            </div>
                                        )}
                                        <span className="text-lg font-medium text-gray-800 truncate max-w-[150px]">
                                            {userData?.userName || "User"}
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
                                        navigate("/login");
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
            </nav >
        </div >
    );
};

export default Navbar;
