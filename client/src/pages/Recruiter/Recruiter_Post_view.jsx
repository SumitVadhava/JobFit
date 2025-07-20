import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recruiter_Post_view = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    experience: "", // Added experience field
    location: "",
    responsibilities: "",
    qualifications: "",
    companyImageUrl: "",
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.responsibilities.trim())
      newErrors.responsibilities = "Responsibilities are required";
    if (!formData.qualifications.trim())
      newErrors.qualifications = "Qualifications are required";
    if (!formData.companyImageUrl.trim())
      newErrors.companyImageUrl = "Company Image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Store form data in localStorage
      const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      storedJobs.push({ ...formData, id: Date.now() }); // Add unique ID using timestamp
      localStorage.setItem("jobs", JSON.stringify(storedJobs));

      console.log("✅ Form Data:", formData);
      toast.success("🎉 Job posted and saved successfully!", {
        position: "top-center",
        autoClose: 2500,
      });

      // Reset form after successful submission
      setFormData({
        jobTitle: "",
        department: "",
        experience: "",
        location: "",
        responsibilities: "",
        qualifications: "",
        companyImageUrl: "",
      });
      setErrors({});
    } else {
      toast.error("⚠ Please fill all required fields.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const errorClass = "text-sm text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-white font-sans">
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
          Post a Job
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-2xl space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Job Title
            </label>
            <input
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              className="w-full mt-2 p-4 border rounded-lg border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {errors.jobTitle && (
              <span className={errorClass}>{errors.jobTitle}</span>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full mt-2 h-14 p-3 border rounded-lg text-base bg-white border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>
            {errors.department && (
              <span className={errorClass}>{errors.department}</span>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Experience
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full mt-2 h-14 p-3 border rounded-lg text-base bg-white border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm"
            >
              <option value="">Select Experience</option>
              <option value="1+year">1+ year</option>
              <option value="2+year">2+ year</option>
              <option value="5+year">5+ year</option>
              <option value="10+year">10+ year</option>
              <option value="20+year">20+ year</option>
            </select>
            {errors.experience && (
              <span className={errorClass}>{errors.experience}</span>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full mt-2 h-14 p-3 border rounded-lg text-base bg-white border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm"
            >
              <option value="">Select Location</option>
              <option value="On-Site">On-Site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.location && (
              <span className={errorClass}>{errors.location}</span>
            )}
          </div>

          {/* Company Image URL */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Company Image URL
            </label>
            <input
              name="companyImageUrl"
              value={formData.companyImageUrl}
              onChange={handleChange}
              placeholder="e.g., https://example.com/company-logo.png"
              className="w-full mt-2 p-4 border rounded-lg border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {errors.companyImageUrl && (
              <span className={errorClass}>{errors.companyImageUrl}</span>
            )}
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Job Responsibilities
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Describe the responsibilities..."
              className="w-full mt-2 p-4 border rounded-lg border-purple-200 min-h-[100px] resize-none focus:ring-2 focus:ring-purple-400 outline-none"
            ></textarea>
            {errors.responsibilities && (
              <span className={errorClass}>{errors.responsibilities}</span>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Qualifications
            </label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="Specify required skills and experience..."
              className="w-full mt-2 p-4 border rounded-lg border-purple-200 min-h-[100px] resize-none focus:ring-2 focus:ring-purple-400 outline-none"
            ></textarea>
            {errors.qualifications && (
              <span className={errorClass}>{errors.qualifications}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full text-base font-semibold hover:opacity-90 shadow-lg transition"
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiter_Post_view;
