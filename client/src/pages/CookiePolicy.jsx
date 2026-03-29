import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const cookieTypes = [
  {
    name: "Strictly Necessary",
    description:
      "These cookies are essential for the platform to function. They enable core features like authentication, session management, and security. You cannot opt out of these.",
    examples: "Session token, CSRF token",
  },
  {
    name: "Performance & Analytics",
    description:
      "These cookies help us understand how visitors interact with JobFit by collecting anonymous usage data. This allows us to improve our services over time.",
    examples: "Page visit counts, feature usage",
  },
  {
    name: "Functional",
    description:
      "These cookies remember your preferences and settings to provide a more personalised experience, such as remembering your login state or theme preference.",
    examples: "Theme preference, language setting",
  },
  {
    name: "Third-Party",
    description:
      "Some features on JobFit rely on third-party services (e.g., Google OAuth) that may set their own cookies. These are governed by the respective third party's cookie policy.",
    examples: "Google login session",
  },
];

const CookiePolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 mt-2 text-gray-600 hover:text-purple-700 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Legal
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Cookie Policy</h1>
          <p className="text-gray-500 text-lg">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            JobFit uses cookies and similar technologies to provide, protect, and improve our
            platform. This Cookie Policy explains what cookies are, which ones we use, and how
            you can control them.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What are Cookies?</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Cookies are small text files stored on your device by your browser when you visit a
              website. They help the site remember information about your visit, making your next
              visit easier and the site more useful to you.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 pt-2">Types of Cookies We Use</h2>

          {cookieTypes.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">{c.description}</p>
              <p className="text-xs text-gray-400">
                <span className="font-medium text-gray-500">Examples: </span>
                {c.examples}
              </p>
            </div>
          ))}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Managing Cookies</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              You can control and delete cookies through your browser settings. Please note that
              disabling strictly necessary cookies may affect the functionality of JobFit. For
              guidance on managing cookies, visit{" "}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                aboutcookies.org
              </a>
              .
            </p>
          </div>

          {/* Contact block matching Privacy/Terms style */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mt-4">
            <p className="text-gray-600 text-sm">
              Questions about our cookie practices? Contact us at{" "}
              <a href="mailto:jobfits024@gmail.com" className="text-purple-600 hover:underline font-medium">
                jobfits024@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
