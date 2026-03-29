import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

const TermsOfService = () => {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-500 text-lg">Last updated: March 2026</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using JobFit ("the Platform"), you accept and agree to be bound by the terms
              and provisions of this agreement. If you do not agree to these Terms &amp; Conditions, please
              do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              JobFit is an AI-powered job-matching and recruitment platform that connects candidates with
              employers. The Platform provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Candidate profiles showcasing skills, experience, and education</li>
              <li>AI-powered ATS resume scoring and feedback</li>
              <li>Job listings and smart job matching based on candidate profiles</li>
              <li>Recruiter tools for posting jobs and discovering candidates</li>
              <li>Application tracking for both candidates and recruiters</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">As a user of JobFit, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Provide accurate and truthful information in your profile and applications</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Respect other users and engage in professional, courteous behaviour</li>
              <li>Not use the Platform for any illegal or unauthorised purposes</li>
              <li>Not misrepresent your skills, qualifications, or experience</li>
              <li>Honor commitments made to employers or candidates through the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Recruiter Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed">
              Recruiters using JobFit agree to post only genuine job opportunities, accurately represent
              their company and the roles offered, and treat all candidate applications with fairness and
              respect. JobFit facilitates connections but is not a party to any employment agreements
              between recruiters and candidates. The Platform does not guarantee hiring outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Conduct</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Users are prohibited from:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Posting or sharing inappropriate, offensive, or illegal content</li>
              <li>Attempting to gain unauthorised access to the Platform or other users' accounts</li>
              <li>Using the Platform for commercial solicitation without permission</li>
              <li>Impersonating another person or entity</li>
              <li>Scraping, crawling, or data-mining the Platform without prior written consent</li>
              <li>Interfering with the proper functioning of the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Platform, including but not limited to text, graphics, logos, ATS algorithms,
              and software, is the property of JobFit or its licensors and is protected by copyright and
              intellectual property laws. Users retain ownership of content they create and upload (e.g.,
              resumes) but grant JobFit a licence to use, display, and process such content as necessary to
              operate the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by
              our{" "}
              <a href="/privacy-policy" className="text-purple-600 hover:underline">
                Privacy Policy
              </a>
              . By using JobFit, you consent to the collection and use of your information as described in
              the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              JobFit is provided "as is" without warranties of any kind. We are not liable for any damages
              arising from your use of the Platform, including but not limited to direct, indirect, incidental,
              or consequential damages. We do not guarantee the accuracy of ATS scores, job match rankings,
              or any employment outcomes facilitated through the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Account Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these
              Terms &amp; Conditions or for any other reason we deem appropriate. You may also delete your
              account at any time from your profile settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              JobFit reserves the right to modify these Terms &amp; Conditions at any time. We will notify
              users of significant changes via email or platform notifications. Continued use of the Platform
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the
              courts in Ahmedabad, Gujarat, India.
            </p>
          </section>

          {/* Contact Block */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms &amp; Conditions, please contact us:
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
                  <MapPin className="w-5 h-5 text-purple-600" />
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

export default TermsOfService;
