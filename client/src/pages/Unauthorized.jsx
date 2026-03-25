import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export default function Unauthorized() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "recruiter") navigate("/recruiter/recruiter-analytics");
    else if (role === "candidate") navigate("/user/dashboard");
    else navigate("/");
  };

  return (
    <div className="relative flex min-h-[88vh] items-center justify-center bg-white overflow-hidden px-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-30" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg animate-fadeIn">
        {/* Shield icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50 scale-150" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center border border-purple-200/50 shadow-lg shadow-purple-100/50">
              <svg
                className="w-14 h-14 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="inline-block text-8xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-purple-800 bg-clip-text text-transparent tracking-tight">
            403
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Access Denied
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-base md:text-lg mb-3 leading-relaxed max-w-md mx-auto">
          You don't have permission to access this page.
        </p>

        {user && (
          <p className="text-sm text-gray-400 mb-8">
            Signed in as <span className="font-medium text-purple-600">{user.email}</span>
            {role && (
              <>
                {" "}with role{" "}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                  {role}
                </span>
              </>
            )}
          </p>
        )}

        {!user && <div className="mb-8" />}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-300" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-200" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <button
              onClick={handleGoToDashboard}
              className="group relative w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </button>
          ) : (
            <Link
              to="/login"
              className="group relative w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-0.5 text-center overflow-hidden"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </Link>
          )}

          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
