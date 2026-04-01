import { useState, useEffect } from "react";
import { Edit, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/api";

const RecruiterEditJobModal = ({ job, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        jobTitle: job.jobTitle || "",
        department: job.department || "",
        openings: job.openings ?? "",
        experience: job.experience || "",
        responsibilities: job.responsibilities || "",
        qualifications: job.qualifications || "",
        companyName: job.companyName || "",
        location: job.location || "",
        workPlaceType: job.workPlaceType || "",
        jobDescription: job.jobDescription || "",
        img: job.img || "",
        bookmarked: job.bookmarked || false,
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const normalizedOpenings =
        formData.openings === "" ? NaN : Number(formData.openings);

      if (!Number.isFinite(normalizedOpenings) || normalizedOpenings < 1) {
        toast.error("Minimum opening must be 1");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        openings: normalizedOpenings,
      };

      const res = await api.put(`/jobs/${job._id}`, payload);
      onUpdate(res.data.job);
      toast.success("Job updated successfully");
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Edit className="w-5 h-5 text-purple-600" />
            <span>Edit Job Posting</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <form
            id="edit-job-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Job Title
              </label>
              <input
                required
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Company Info
              </label>
              <input
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Location
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Openings
              </label>
              <input
                required
                type="number"
                min="1"
                step="1"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Workplace Type
              </label>
              <select
                required
                name="workPlaceType"
                value={formData.workPlaceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="onsite">On-Site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="0-1 years">0-1 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="5-6 years">5-6 years</option>
                <option value="7-8 years">7-8 years</option>
                <option value="9-10 years">9-10 years</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Image URL
              </label>
              <input
                name="img"
                value={formData.img}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Job Description
              </label>
              <textarea
                required
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Responsibilities
              </label>
              <textarea
                required
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Qualifications
              </label>
              <textarea
                required
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
              />
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            form="edit-job-form"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors min-w-[120px]"
          >
            {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                  <span>Saving...</span>
                </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterEditJobModal;
