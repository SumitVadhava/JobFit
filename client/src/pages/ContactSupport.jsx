import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Clock, CheckCircle, MapPin, SendHorizonal, Send } from "lucide-react";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const infoCards = [
    {
      icon: <Mail className="text-purple-600" size={22} />,
      title: "Email Us",
      value: "jobfits024@gmail.com",
      href: "mailto:jobfits024@gmail.com",
    },
    {
      icon: <MessageSquare className="text-purple-600" size={22} />,
      title: "Live Chat",
      value: "Mon–Fri, 9am–6pm IST",
    },
    {
      icon: <Clock className="text-purple-600" size={22} />,
      title: "Response Time",
      value: "Within 24 hours on business days",
    },
    {
      icon: <MapPin className="text-purple-600" size={22} />,
      title: "Location",
      value: "Ahmedabad, Gujarat, India",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

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
            Support
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            How can we <span className="text-purple-600">help you?</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Our support team is ready to assist you. Fill in the form below and
            we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {infoCards.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-start gap-3"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                {c.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                {c.href ? (
                  <a href={c.href} className="text-purple-600 hover:underline text-sm">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-purple-600" size={36} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-500 max-w-sm">
                Thanks for reaching out. Our support team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-purple-600 hover:underline text-sm font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 focus:bg-white transition-colors text-gray-700"
                  >
                    <option value="">Select a topic...</option>
                    <option value="account">Account & Login Issues</option>
                    <option value="resume">Resume & ATS Score</option>
                    <option value="jobs">Jobs & Applications</option>
                    <option value="recruiter">Recruiter / Job Posting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
