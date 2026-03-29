import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, UserCheck, Mail, Database } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-lg">Last updated: March 2026</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to JobFit. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our AI-powered job-matching platform. Please read this policy carefully to understand
              our practices regarding your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>Account Information:</strong> Name, email address, password, and profile picture</li>
              <li><strong>Profile Data:</strong> Skills, experience, education, resume, bio, and job preferences</li>
              <li><strong>Resume Data:</strong> Uploaded resume files processed for ATS scoring and job matching</li>
              <li><strong>Contact Information:</strong> When you reach out via our support form or email</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, job searches performed, time spent on the platform</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Create and manage your account</li>
              <li>Match you with relevant job opportunities based on your skills and preferences</li>
              <li>Calculate your ATS score and provide resume feedback</li>
              <li>Send you notifications about new jobs, applications, and platform updates</li>
              <li>Improve and personalise your experience on the platform</li>
              <li>Analyse usage patterns to enhance our services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We may share your information in the following circumstances:</p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.1 With Recruiters</h3>
            <p className="text-gray-600 leading-relaxed ml-4 mb-3">
              Your profile (name, skills, experience, education) is shared with recruiters only when you apply
              for a job or enable public profile visibility.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.2 Service Providers</h3>
            <p className="text-gray-600 leading-relaxed ml-4 mb-3">
              We may share data with third-party service providers who help us operate the platform (e.g., cloud
              hosting, analytics, email services). These providers are contractually obligated to protect your data.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.3 Legal Requirements</h3>
            <p className="text-gray-600 leading-relaxed ml-4 mb-3">
              We may disclose your information if required by law, court order, or to protect the rights, property,
              or safety of JobFit, our users, or others.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.4 Business Transfers</h3>
            <p className="text-gray-600 leading-relaxed ml-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to
              the acquiring entity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal data, including encryption,
              secure servers, hashed passwords, and access controls. However, no method of transmission over the
              internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information in your profile</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (account-related emails may still be sent)</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:jobfits024@gmail.com" className="text-purple-600 hover:underline">
                jobfits024@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyse usage, and personalise
              content. You can control cookie preferences through your browser settings, but disabling cookies
              may affect platform functionality. See our{" "}
              <a href="/cookie-policy" className="text-purple-600 hover:underline">Cookie Policy</a> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform may contain links to third-party websites or services. We are not responsible for the
              privacy practices of these external sites. We encourage you to review their privacy policies before
              providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              JobFit is not intended for users under the age of 16. We do not knowingly collect personal
              information from children. If we become aware that we have collected data from a user under 16,
              we will take steps to delete such information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal data for as long as your account is active or as needed to provide services.
              If you delete your account, we will delete or anonymise your data within a reasonable timeframe,
              except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via
              email or platform notifications. Your continued use of JobFit after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          {/* Contact Block */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal
              data, please contact us:
            </p>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href="mailto:jobfits024@gmail.com" className="text-purple-600 hover:underline text-sm">
                      jobfits024@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-500 text-sm">Ahmedabad, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
