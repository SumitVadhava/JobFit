import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.responsibilities.trim()) newErrors.responsibilities = "Responsibilities are required";
    if (!formData.qualifications.trim()) newErrors.qualifications = "Qualifications are required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.workPlaceType) newErrors.workPlaceType = "Work Place Type is required";
    if (!formData.jobDescription.trim()) newErrors.jobDescription = "Job Description is required";
    if (!formData.img.trim()) newErrors.img = "Image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("https://jobfit-s5v7.onrender.com/api/jobs", formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });

        console.log("Form Data Response:", response.data);
        toast.success("Job posted successfully!", {
          position: "top-center",
          autoClose: 2500,
        });

        // Reset form after successful submission
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
          bookmarked: false,  
        });
        setErrors({});
      } catch (error) {
        console.error("Error posting job:", error);
        toast.error("⚠ Failed to post job. " + (error.response?.data?.message || "Please try again later."), {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
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
                <option value="0-1 years">0-1 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="5-6 years">5-6 years</option>
                <option value="7-8 years">7-8 years</option>
                <option value="9-10 years">9-10 years</option>
              </select>
              {errors.experience && (
                <span className={errorClass}>{errors.experience}</span>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-lg font-medium text-purple-800">
                Company Name
              </label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Tech Corp"
                className="w-full mt-2 p-4 border rounded-lg border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
              />
              {errors.companyName && (
                <span className={errorClass}>{errors.companyName}</span>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-medium text-purple-800">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                className="w-full mt-2 p-4 border rounded-lg border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
              />
              {errors.location && (
                <span className={errorClass}>{errors.location}</span>
              )}
            </div>

            {/* Work Place Type */}
            <div>
              <label className="block text-lg font-medium text-purple-800">
                Work Place Type
              </label>
              <select
                name="workPlaceType"
                value={formData.workPlaceType}
                onChange={handleChange}
                className="w-full mt-2 h-14 p-3 border rounded-lg text-base bg-white border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 shadow-sm"
              >
                <option value="">Select Work Place Type</option>
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.workPlaceType && (
                <span className={errorClass}>{errors.workPlaceType}</span>
              )}
            </div>
            
            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-purple-800">
                Image URL
              </label>
              <input
                name="img"
                value={formData.img}
                onChange={handleChange}
                placeholder="e.g., https://example.com/company-logo.png"
                className="w-full mt-2 p-4 border rounded-lg border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
              />
              {errors.img && (
                <span className={errorClass}>{errors.img}</span>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-lg font-medium text-purple-800">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Detailed description of the job..."
              className="w-full mt-2 p-4 border rounded-lg border-purple-200 min-h-[100px] resize-none focus:ring-2 focus:ring-purple-400 outline-none"
            ></textarea>
            {errors.jobDescription && (
              <span className={errorClass}>{errors.jobDescription}</span>
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
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiter_Post_view;
