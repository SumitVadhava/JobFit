import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
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
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";



// ─── Extracted Outside to prevent remount on every render ─────────────────────
const InputWrapper = ({
  children,
  label,
  icon: Icon,
  error,
  isFocused,
  isFilled,
  required = true,
}) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
      <Icon
        size={16}
        className={`transition-colors duration-200 ${isFocused ? "text-black" : "text-gray-900"
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
    {isFilled && !error && (
      <div className="absolute top-0 right-0 mt-0.5">
        <CheckCircle2 size={14} className="text-green-400" />
      </div>
    )}
  </div>
);

// ─── Helper: dynamic class builders ──────────────────────────────────────────
const getInputClass = (hasError, isFocused, isFilled) =>
  `w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-300
   bg-white transition-all duration-300 outline-none
   ${hasError
    ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100"
    : isFocused
      ? "border-purple-400 ring-4 ring-purple-100 bg-white shadow-sm"
      : isFilled
        ? "border-purple-200 bg-purple-50/20"
        : "border-gray-200 hover:border-purple-300"
  }`;

const getSelectClass = (hasError, isFocused, isFilled) =>
  `w-full px-4 py-3 rounded-xl border-2 text-sm bg-white appearance-none cursor-pointer
   transition-all duration-300 outline-none
   ${hasError
    ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100 text-gray-800"
    : isFocused
      ? "border-purple-400 ring-4 ring-purple-100 shadow-sm text-gray-800"
      : isFilled
        ? "border-purple-200 bg-purple-50/20 text-gray-800"
        : "border-gray-200 hover:border-purple-300 text-gray-400"
  }`;

const getTextareaClass = (hasError, isFocused, isFilled) =>
  `w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-300
   bg-white transition-all duration-300 outline-none resize-none
   ${hasError
    ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100"
    : isFocused
      ? "border-purple-400 ring-4 ring-purple-100 bg-white shadow-sm"
      : isFilled
        ? "border-purple-200 bg-purple-50/20"
        : "border-gray-200 hover:border-purple-300"
  }`;

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ step, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-bold text-sm">
      {step}
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
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
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleFocus = useCallback((name) => {
    setFocusedField(name);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

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
    if (!formData.openings) {
      newErrors.openings = "Openings is required";
    } else {
      const openingsValue = Number(formData.openings);
      if (!Number.isFinite(openingsValue) || openingsValue < 1) {
        newErrors.openings = "Minimum opening must be 1";
      }
    }
    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validate();

    if (isValid) {
      setIsSubmitting(true);
      try {
        const responsibilities = formData.responsibilities
          .split("\n")
          .map((item) => item.replace(/^[-•\s]+/, "").trim())
          .filter(Boolean);
        const qualifications = formData.qualifications
          .split("\n")
          .map((item) => item.replace(/^[-•\s]+/, "").trim())
          .filter(Boolean);

        const payload = new FormData();
        payload.append("jobTitle", formData.jobTitle.trim());
        payload.append("companyName", formData.companyName.trim());
        payload.append("location", formData.location.trim());
        payload.append("openings", String(parseInt(formData.openings, 10)));
        payload.append("jobDescription", formData.jobDescription.trim());
        payload.append("department", formData.department.trim());
        payload.append("experience", formData.experience.trim());
        payload.append("responsibilities", JSON.stringify(responsibilities.length ? responsibilities : [formData.responsibilities.trim()]));
        payload.append("qualifications", JSON.stringify(qualifications.length ? qualifications : [formData.qualifications.trim()]));
        payload.append("workPlaceType", formData.workPlaceType.trim());

        if (logoFile) {
          payload.append("img", logoFile);
        } else if (formData.img.trim()) {
          payload.append("img", formData.img.trim());
        }

        const response = await api.post('/recruiter/jobs', payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          validateStatus: (status) => status >= 200 && status < 500,
        });

        if (response.status !== 201 || response.data?.error) {
          throw new Error(
            response.data?.message || "Unexpected response while posting job."
          );
        }

        console.log("Job Post Response:", response.data);
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
        });
        setLogoFile(null);
        setErrors({});
      } catch (error) {
        console.error("Error posting job:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Please try again later.";
        toast.error(
          "Failed to post job. " + errorMessage,
          { position: "top-center", autoClose: 3000 }
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstErrorMessage =
        validationErrors.openings ||
        Object.values(validationErrors)[0] ||
        "Please fill all required fields.";

      toast.error(firstErrorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const filledCount = Object.values(formData).filter(
    (v) => v && v.toString().trim() !== ""
  ).length;
  const totalFields = Object.keys(formData).length;
  const progressPercent = Math.round((filledCount / totalFields) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/50">
      

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center mb-10">

          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Create a New Job Post
          </h1>


          {/* Progress */}
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

        {/* ── Form Card ────────────────────────────────────────────────── */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-100/50 overflow-hidden">
          {/* ── Section 1: Basic Info ──────────────────────────────────── */}
          <div className="p-6 sm:p-8 border-b border-purple-50">
            <SectionHeader
              step={1}
              title="Basic Information"
              subtitle="Job title, company, and location details"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title */}
              <InputWrapper
                label="Job Title"
                icon={Briefcase}
                error={errors.jobTitle}
                isFocused={focusedField === "jobTitle"}
                isFilled={!!formData.jobTitle}
              >
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  onFocus={() => handleFocus("jobTitle")}
                  onBlur={handleBlur}
                  placeholder="e.g., Senior Software Engineer"
                  className={getInputClass(
                    !!errors.jobTitle,
                    focusedField === "jobTitle",
                    !!formData.jobTitle
                  )}
                />
              </InputWrapper>

              {/* Company Name */}
              <InputWrapper
                label="Company Name"
                icon={Building2}
                error={errors.companyName}
                isFocused={focusedField === "companyName"}
                isFilled={!!formData.companyName}
              >
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("companyName")}
                  onBlur={handleBlur}
                  placeholder="e.g., Tech Corp Inc."
                  className={getInputClass(
                    !!errors.companyName,
                    focusedField === "companyName",
                    !!formData.companyName
                  )}
                />
              </InputWrapper>

              {/* Department */}
              <InputWrapper
                label="Department"
                icon={Layers}
                error={errors.department}
                isFocused={focusedField === "department"}
                isFilled={!!formData.department}
              >
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onFocus={() => handleFocus("department")}
                    onBlur={handleBlur}
                    className={getSelectClass(
                      !!errors.department,
                      focusedField === "department",
                      !!formData.department
                    )}
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
                icon={Clock}
                error={errors.experience}
                isFocused={focusedField === "experience"}
                isFilled={!!formData.experience}
              >
                <div className="relative">
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    onFocus={() => handleFocus("experience")}
                    onBlur={handleBlur}
                    className={getSelectClass(
                      !!errors.experience,
                      focusedField === "experience",
                      !!formData.experience
                    )}
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
                icon={MapPin}
                error={errors.location}
                isFocused={focusedField === "location"}
                isFilled={!!formData.location}
              >
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onFocus={() => handleFocus("location")}
                  onBlur={handleBlur}
                  placeholder="e.g., San Francisco, CA"
                  className={getInputClass(
                    !!errors.location,
                    focusedField === "location",
                    !!formData.location
                  )}
                />
              </InputWrapper>

              {/* Work Place Type */}
              <InputWrapper
                label="Work Place Type"
                icon={Building2}
                error={errors.workPlaceType}
                isFocused={focusedField === "workPlaceType"}
                isFilled={!!formData.workPlaceType}
              >
                <div className="relative">
                  <select
                    name="workPlaceType"
                    value={formData.workPlaceType}
                    onChange={handleChange}
                    onFocus={() => handleFocus("workPlaceType")}
                    onBlur={handleBlur}
                    className={getSelectClass(
                      !!errors.workPlaceType,
                      focusedField === "workPlaceType",
                      !!formData.workPlaceType
                    )}
                  >
                    <option value="">Select Work Place Type</option>
                    <option value="On-site">On-Site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
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
                icon={Users}
                error={errors.openings}
                isFocused={focusedField === "openings"}
                isFilled={!!formData.openings}
              >
                <input
                  name="openings"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.openings}
                  onChange={handleChange}
                  onFocus={() => handleFocus("openings")}
                  onBlur={handleBlur}
                  placeholder="e.g., 5"
                  className={getInputClass(
                    !!errors.openings,
                    focusedField === "openings",
                    !!formData.openings
                  )}
                />
              </InputWrapper>

              {/* Image Upload */}
              <InputWrapper
                label="Company Logo"
                icon={Image}
                error={errors.img}
                isFocused={focusedField === "img"}
                isFilled={!!formData.img}
              >
                <input
                  key={formData.img ? "has-file" : "empty"}
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file type
                      const validTypes = ["image/jpeg", "image/png", "image/webp"];
                      if (!validTypes.includes(file.type)) {
                        setErrors((prev) => ({
                          ...prev,
                          img: "Only JPG, PNG, and WEBP formats are allowed.",
                        }));
                        setFormData((prev) => ({ ...prev, img: "" }));
                        setLogoFile(null);
                        return;
                      }

                      setLogoFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData((prev) => ({ ...prev, img: reader.result }));
                        setErrors((prev) => ({ ...prev, img: "" }));
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setFormData((prev) => ({ ...prev, img: "" }));
                      setLogoFile(null);
                    }
                  }}
                  onFocus={() => handleFocus("img")}
                  onBlur={handleBlur}
                  className={
                    getInputClass(
                      !!errors.img,
                      focusedField === "img",
                      !!formData.img
                    ) + " file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  }
                />
              </InputWrapper>
            </div>
          </div>

          {/* ── Section 2: Job Details ─────────────────────────────────── */}
          <div className="p-6 sm:p-8 border-b border-purple-50">
            <SectionHeader
              step={2}
              title="Job Description"
              subtitle="Describe the role and what you're looking for"
            />

            <div className="space-y-5">
              {/* Job Description */}
              <InputWrapper
                label="Job Description"
                icon={FileText}
                error={errors.jobDescription}
                isFocused={focusedField === "jobDescription"}
                isFilled={!!formData.jobDescription}
              >
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  onFocus={() => handleFocus("jobDescription")}
                  onBlur={handleBlur}
                  placeholder="Provide a detailed overview of the role, team, and what a typical day looks like..."
                  rows={4}
                  className={getTextareaClass(
                    !!errors.jobDescription,
                    focusedField === "jobDescription",
                    !!formData.jobDescription
                  )}
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
                icon={ListChecks}
                error={errors.responsibilities}
                isFocused={focusedField === "responsibilities"}
                isFilled={!!formData.responsibilities}
              >
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  onFocus={() => handleFocus("responsibilities")}
                  onBlur={handleBlur}
                  placeholder={`• Lead development of core platform features\n• Collaborate with cross-functional teams\n• Mentor junior developers`}
                  rows={4}
                  className={getTextareaClass(
                    !!errors.responsibilities,
                    focusedField === "responsibilities",
                    !!formData.responsibilities
                  )}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-300">
                    {formData.responsibilities.length} characters
                  </span>
                </div>
              </InputWrapper>
            </div>
          </div>

          {/* ── Section 3: Qualifications ──────────────────────────────── */}
          <div className="p-6 sm:p-8 border-b border-purple-50">
            <SectionHeader
              step={3}
              title="Qualifications"
              subtitle="Required skills, education, and experience"
            />

            <InputWrapper
              label="Required Qualifications"
              icon={GraduationCap}
              error={errors.qualifications}
              isFocused={focusedField === "qualifications"}
              isFilled={!!formData.qualifications}
            >
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                onFocus={() => handleFocus("qualifications")}
                onBlur={handleBlur}
                placeholder={`• Bachelor's degree in Computer Science or related field\n• 3+ years experience with React & Node.js\n• Strong problem-solving skills`}
                rows={4}
                className={getTextareaClass(
                  !!errors.qualifications,
                  focusedField === "qualifications",
                  !!formData.qualifications
                )}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-300">
                  {formData.qualifications.length} characters
                </span>
              </div>
            </InputWrapper>
          </div>

          {/* ── Submit Section ─────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50/50 to-violet-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                {filledCount === totalFields ? (
                  <span className="text-green-600 font-medium">
                    ✓ All fields completed — ready to publish!
                  </span>
                ) : (
                  <span>
                    {totalFields - filledCount} field
                    {totalFields - filledCount !== 1 ? "s" : ""} remaining
                  </span>
                )}
              </p>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl
                  text-sm font-bold text-white
                  bg-gradient-to-r from-purple-600 via-purple-600 to-violet-600
                  shadow-lg shadow-purple-300/40
                  transition-all duration-300 ease-out
                  ${isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.02] active:scale-[0.98]"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                      <span>Publishing...</span>
                    </span>
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

                {!isSubmitting && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By publishing, this job will be visible to all candidates on the
          platform.
        </p>
      </div>
    </div>
  );
};

export default Recruiter_Post_view;