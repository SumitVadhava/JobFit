import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import JobFitLogo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand and Social Links */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img src={JobFitLogo} alt="JobFit Logo" className="h-8" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-black mb-4">
                Connect with us
              </h3>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-blue-500 hover:text-purple-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-pink-500 hover:text-purple-700 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-blue-700 hover:text-purple-900 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 1 - About */}
          <div>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  For Employers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Sitemap
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-500 transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - Help */}
          <div>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Help center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#faq-section"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Report issue
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-purple-600 transition-colors"
                >
                  Trust & safety
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            {/* Copyright and Legal */}
            <div className="flex items-center space-x-4">
              <p className="text-black 500 hover:text-purple-700 transition-colors">
                © 2025 JobFit Pro. All rights reserved.
              </p>
            </div>
            {/* Partner Services */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Our services
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="text-purple-700 dark:text-purple-700 px-1 font-bold text-lg">
                        Resume
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 font-medium">
                        <span className="text-blue-700 dark:text-blue-400">
                          ATS
                        </span>
                        Score
                      </div>
                      <div className="text-purple-700 dark:text-purple-400 font-bold">
                        Job
                        <span className="text-grayx-700 dark:text-gray-300">
                          Match
                        </span>
                      </div>
                      <div className="text-blue-700 dark:text-blue-400 font-bold">
                        Hire
                        <span className="text-gray-700 dark:text-gray-300">
                          Pro
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
