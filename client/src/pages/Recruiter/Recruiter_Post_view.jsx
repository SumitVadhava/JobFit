import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Users,
  FileText,
  Image,
  Layers,
  GraduationCap,
  ListChecks,
  Send,
  Loader2,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Recruiter_Post_view = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    experience: "",
    responsibilities: "",
    qualifications: "",
    companyName: "",
    location: "",
    workPlaceType: "",
    jobDescription: "",
    img: "",
    openings: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.responsibilities.trim())
      newErrors.responsibilities = "Responsibilities are required";
    if (!formData.qualifications.trim())
      newErrors.qualifications = "Qualifications are required";
    if (!formData.companyName.trim())
      newErrors.companyName = "Company Name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.workPlaceType)
      newErrors.workPlaceType = "Work Place Type is required";
    if (!formData.jobDescription.trim())
      newErrors.jobDescription = "Job Description is required";
    if (!formData.img.trim()) newErrors.img = "Image URL is required";
    if (!formData.openings) newErrors.openings = "Openings is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const payload = {
          ...formData,
          openings: parseInt(formData.openings, 10),
        };
        const response = await api.post("/jobs", payload);
        console.log("Form Data Response:", response.data);
        toast.success("🎉 Job posted successfully!", {
          position: "top-center",
          autoClose: 2500,
          style: {
            background: "#f0e6ff",
            color: "#6b21a8",
            fontWeight: "600",
          },
        });
        setFormData({
          jobTitle: "",
          department: "",
          experience: "",
          responsibilities: "",
          qualifications: "",
          companyName: "",
          location: "",
          workPlaceType: "",
          jobDescription: "",
          img: "",
          openings: "",
          bookmarked: false,
        });
        setErrors({});
      } catch (error) {
        console.error("Error posting job:", error);
        toast.error(
          "Failed to post job. " +
            (error.response?.data?.message || "Please try again later."),
          {
            position: "top-center",
            autoClose: 3000,
          },
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill all required fields.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const filledCount = Object.values(formData).filter(
    (v) => v && v.toString().trim() !== "",
  ).length;
  const totalFields = Object.keys(formData).length;
  const progressPercent = Math.round((filledCount / totalFields) * 100);

  const InputWrapper = ({
    children,
    label,
    name,
    icon: Icon,
    error,
    required = true,
  }) => (
    <div className="group relative">
      <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
        <Icon
          size={16}
          className={`transition-colors duration-200 ${
            focusedField === name ? "text-purple-500" : "text-purple-400"
          }`}
        />
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 animate-fadeIn">
          <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-500 font-medium">{error}</span>
        </div>
      )}
      {formData[name] && !error && (
        <div className="absolute top-0 right-0 mt-0.5">
          <CheckCircle2 size={14} className="text-green-400" />
        </div>
      )}
    </div>
  );

  const inputBaseClass = (name) =>
    `w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-300
     bg-white transition-all duration-300 outline-none
     ${
       errors[name]
         ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100"
         : focusedField === name
           ? "border-purple-400 ring-4 ring-purple-100 bg-white shadow-sm"
           : formData[name]
             ? "border-purple-200 bg-purple-50/20"
             : "border-gray-200 hover:border-purple-300"
     }`;

  const selectBaseClass = (name) =>
    `w-full px-4 py-3 rounded-xl border-2 text-sm bg-white appearance-none cursor-pointer
     transition-all duration-300 outline-none
     ${
       errors[name]
         ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100 text-gray-800"
         : focusedField === name
           ? "border-purple-400 ring-4 ring-purple-100 shadow-sm text-gray-800"
           : formData[name]
             ? "border-purple-200 bg-purple-50/20 text-gray-800"
             : "border-gray-200 hover:border-purple-300 text-gray-400"
     }`;

  const textareaBaseClass = (name) =>
    `w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-300
     bg-white transition-all duration-300 outline-none resize-none
     ${
       errors[name]
         ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100"
         : focusedField === name
           ? "border-purple-400 ring-4 ring-purple-100 bg-white shadow-sm"
           : formData[name]
             ? "border-purple-200 bg-purple-50/20"
             : "border-gray-200 hover:border-purple-300"
     }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/50">
      <ToastContainer />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Create a New Job Post
          </h1>

          {/* Progress Bar */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-600">
                Completion
              </span>
              <span className="text-xs font-bold text-purple-700">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-100/50 overflow-hidden">
          {/* Section 1: Basic Information */}
          <div className="p-6 sm:p-8 border-b border-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Basic Information
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Job title, company, and location details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title */}
              <InputWrapper
                label="Job Title"
                name="jobTitle"
                icon={Briefcase}
                error={errors.jobTitle}
              >
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("jobTitle")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Senior Software Engineer"
                  className={inputBaseClass("jobTitle")}
                />
              </InputWrapper>

              {/* Company Name */}
              <InputWrapper
                label="Company Name"
                name="companyName"
                icon={Building2}
                error={errors.companyName}
              >
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("companyName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Tech Corp Inc."
                  className={inputBaseClass("companyName")}
                />
              </InputWrapper>

              {/* Department */}
              <InputWrapper
                label="Department"
                name="department"
                icon={Layers}
                error={errors.department}
              >
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("department")}
                    onBlur={() => setFocusedField(null)}
                    className={selectBaseClass("department")}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </InputWrapper>

              {/* Experience */}
              <InputWrapper
                label="Experience Required"
                name="experience"
                icon={Clock}
                error={errors.experience}
              >
                <div className="relative">
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("experience")}
                    onBlur={() => setFocusedField(null)}
                    className={selectBaseClass("experience")}
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="2-4 years">2-4 years</option>
                    <option value="5-6 years">5-6 years</option>
                    <option value="7-8 years">7-8 years</option>
                    <option value="9-10 years">9-10 years</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </InputWrapper>

              {/* Location */}
              <InputWrapper
                label="Location"
                name="location"
                icon={MapPin}
                error={errors.location}
              >
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., San Francisco, CA"
                  className={inputBaseClass("location")}
                />
              </InputWrapper>

              {/* Work Place Type */}
              <InputWrapper
                label="Work Place Type"
                name="workPlaceType"
                icon={Building2}
                error={errors.workPlaceType}
              >
                <div className="relative">
                  <select
                    name="workPlaceType"
                    value={formData.workPlaceType}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("workPlaceType")}
                    onBlur={() => setFocusedField(null)}
                    className={selectBaseClass("workPlaceType")}
                  >
                    <option value="">Select Work Place Type</option>
                    <option value="onsite">On-Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </InputWrapper>

              {/* Openings */}
              <InputWrapper
                label="Number of Openings"
                name="openings"
                icon={Users}
                error={errors.openings}
              >
                <input
                  name="openings"
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("openings")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., 5"
                  className={inputBaseClass("openings")}
                />
              </InputWrapper>

              {/* Image URL */}
              <InputWrapper
                label="Company Logo URL"
                name="img"
                icon={Image}
                error={errors.img}
              >
                <input
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("img")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="https://example.com/logo.png"
                  className={inputBaseClass("img")}
                />
              </InputWrapper>
            </div>
          </div>

          {/* Section 2: Job Details */}
          <div className="p-6 sm:p-8 border-b border-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Job Description
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Describe the role and what you're looking for
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Job Description */}
              <InputWrapper
                label="Job Description"
                name="jobDescription"
                icon={FileText}
                error={errors.jobDescription}
              >
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("jobDescription")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Provide a detailed overview of the role, team, and what a typical day looks like..."
                  rows={4}
                  className={textareaBaseClass("jobDescription")}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-300">
                    {formData.jobDescription.length} characters
                  </span>
                </div>
              </InputWrapper>

              {/* Responsibilities */}
              <InputWrapper
                label="Key Responsibilities"
                name="responsibilities"
                icon={ListChecks}
                error={errors.responsibilities}
              >
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("responsibilities")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="• Lead development of core platform features&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers"
                  rows={4}
                  className={textareaBaseClass("responsibilities")}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-300">
                    {formData.responsibilities.length} characters
                  </span>
                </div>
              </InputWrapper>
            </div>
          </div>

          {/* Section 3: Qualifications */}
          <div className="p-6 sm:p-8 border-b border-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Qualifications
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Required skills, education, and experience
                </p>
              </div>
            </div>

            <InputWrapper
              label="Required Qualifications"
              name="qualifications"
              icon={GraduationCap}
              error={errors.qualifications}
            >
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                onFocus={() => setFocusedField("qualifications")}
                onBlur={() => setFocusedField(null)}
                placeholder="• Bachelor's degree in Computer Science or related field&#10;• 3+ years experience with React & Node.js&#10;• Strong problem-solving skills"
                rows={4}
                className={textareaBaseClass("qualifications")}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-300">
                  {formData.qualifications.length} characters
                </span>
              </div>
            </InputWrapper>
          </div>

          {/* Submit Section */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50/50 to-violet-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500"></div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl
                  text-sm font-bold text-white
                  bg-gradient-to-r from-purple-600 via-purple-600 to-violet-600
                  shadow-lg shadow-purple-300/40
                  transition-all duration-300 ease-out
                  ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.02] active:scale-[0.98]"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                    <span>Publish Job</span>
                  </>
                )}

                {/* Button Shine Effect */}
                {!isSubmitting && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By publishing, this job will be visible to all candidates on the
          platform.
        </p>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Recruiter_Post_view;
