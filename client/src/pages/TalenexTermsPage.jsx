import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GridPattern } from "@/components/ui/grid-pattern";
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
    const navigate = useNavigate();

    return (
        <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
                <GridPattern strokeDasharray={"4 5"} width={50} height={50} className="stroke-zinc-500 opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                {/* Back to Home Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-6 mt-8 hover:bg-slate-100 text-md"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-slate-600">
                        Last updated: February 4, 2026
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 leading-relaxed">
                                By accessing and using Talenex ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms & Conditions, please do not use the Platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                Talenex is a skill-swapping platform that facilitates connections between users who wish to exchange skills and knowledge. The Platform provides:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                                <li>User profiles showcasing skills to teach and learn</li>
                                <li>Matching system to connect compatible users</li>
                                <li>Integrated video calling for skill exchange sessions</li>
                                <li>Messaging features for coordination and communication</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
                            <p className="text-slate-600 leading-relaxed mb-3">As a user of Talenex, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                                <li>Provide accurate and truthful information in your profile</li>
                                <li>Maintain the confidentiality of your account credentials</li>
                                <li>Respect other users and engage in professional, courteous behavior</li>
                                <li>Not use the Platform for any illegal or unauthorized purposes</li>
                                <li>Not misrepresent your skills or qualifications</li>
                                <li>Honor your commitments to skill exchange sessions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Skill Exchange Agreement</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Talenex facilitates connections but is not a party to any skill exchange agreements between users. Users are solely responsible for the quality, accuracy, and delivery of skills they teach. The Platform does not guarantee the quality of skills exchanged or the conduct of other users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Prohibited Conduct</h2>
                            <p className="text-slate-600 leading-relaxed mb-3">Users are prohibited from:</p>
                            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                                <li>Harassing, threatening, or intimidating other users</li>
                                <li>Posting or sharing inappropriate, offensive, or illegal content</li>
                                <li>Attempting to gain unauthorized access to the Platform or other users' accounts</li>
                                <li>Using the Platform for commercial solicitation without permission</li>
                                <li>Impersonating another person or entity</li>
                                <li>Interfering with the proper functioning of the Platform</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-slate-600 leading-relaxed">
                                All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of Talenex or its licensors and is protected by copyright and intellectual property laws. Users retain ownership of content they create and share on the Platform but grant Talenex a license to use, display, and distribute such content as necessary to operate the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Privacy and Data Protection</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using Talenex, you consent to the collection and use of your information as described in the Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Talenex is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to direct, indirect, incidental, or consequential damages. We do not guarantee the accuracy, completeness, or reliability of any content or skill exchanges facilitated through the Platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Account Termination</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We reserve the right to suspend or terminate your account at any time for violations of these Terms & Conditions or for any other reason we deem appropriate. You may also delete your account at any time from your profile settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Modifications to Terms</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Talenex reserves the right to modify these Terms & Conditions at any time. We will notify users of significant changes via email or platform notifications. Continued use of the Platform after changes constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
                            <p className="text-slate-600 leading-relaxed">
                                These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Rajkot, Gujarat, India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
                            <p className="text-slate-600 leading-relaxed">
                                If you have any questions about these Terms & Conditions, please contact us at:
                            </p>
                            <div className="mt-3 text-slate-600">
                                <p>Email: talenexcommunity@gmail.com</p>
                                <p>Phone: +91 9265524132 / +91 9978712421</p>
                                <p>Location: Rajkot, Gujarat, India</p>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
