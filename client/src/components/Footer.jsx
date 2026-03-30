import React from "react";
import { Link } from "react-router-dom";
import JobFitLogo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Divider & Main Content Wrapper */}
        <div className="border-t border-gray-200 py-12">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
            {/* Brand and Social Links */}
            <div className="space-y-7">
              <div className="flex items-center space-x-2">
                <img src={JobFitLogo} alt="JobFit Logo" className="h-8" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-black mb-4">
                  Connect with us
                </h3>
                <div className="flex space-x-4 items-center">
                  <a
                    href="https://www.instagram.com/jobfit_official/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:opacity-70 hover:scale-110 transition-all text-[22px]"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a
                    href="https://x.com/JobFit_Official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:opacity-70 hover:scale-110 transition-all text-[22px]"
                  >
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jobfit-organization-5344663b3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0077B5] hover:opacity-70 hover:scale-110 transition-all text-[22px]"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 1 */}
            <div>
              <ul className="space-y-7 mt-1 lg:mt-0">
                <li>
                  <Link
                    to="/about"
                    className="text-black hover:text-purple-600 transition-colors text-[16px]"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-black hover:text-purple-600 transition-colors text-[16px]"
                  >
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - FAQ/Privacy */}
            <div>
              <ul className="space-y-7 mt-1 lg:mt-0">
                <li>
                  <a
                    href="#faq-section"
                    className="text-black hover:text-purple-600 transition-colors text-[16px]"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-black hover:text-purple-600 transition-colors text-[16px]"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Terms/Cookie */}
            <div>
              <ul className="space-y-7 mt-1 lg:mt-0">
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-black hover:text-purple-600 transition-colors text-[16px]"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie-policy"
                    className="text-black hover:text-purple-600 transition-colors text-[16px]"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section (Divider 2) */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-7 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <p className="text-gray-500 hover:text-purple-700 transition-colors text-sm">
                  © 2026 JobFit. All rights reserved.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;