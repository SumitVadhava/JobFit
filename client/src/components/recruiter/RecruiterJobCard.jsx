import {
  Eye,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Users,
  BookmarkIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { RecruiterStatusBadge, RecruiterWorkplaceBadge } from "./RecruiterBadges";

/* ───────────── Recruiter Job Card ───────────── */
const RecruiterJobCard = ({
  job,
  onViewApplicants,
  primaryActionLabel = "View Applicants",
  showEditAction = true,
  showDeleteAction = true,
}) => {
  const canEdit = (job.totalCandidates ?? 0) < 1;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.img && !job.img.includes("example.com") ? (
                <img
                  src={job.img}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-purple-600" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                {job.jobTitle}
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {showEditAction && canEdit && (
              <button
                onClick={() => onViewApplicants?.(job, "edit")}
                className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-700 transition-colors"
                aria-label="Edit job"
                title="Edit job"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {showDeleteAction && (
              <button
                onClick={() => onViewApplicants?.(job, "delete")}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Delete job"
                title="Delete job"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 mt-4">
          <RecruiterStatusBadge status={job.adminReview} />
          <RecruiterWorkplaceBadge type={job.workPlaceType} />
          {job.bookmarked && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
              <BookmarkIcon className="w-3 h-3 fill-current" />
              <span>Bookmarked</span>
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 mx-5" />

      <div className="p-5 pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="truncate">{job.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>{job.openings ?? "N/A"} Openings</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 col-span-2">
            <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>{job.totalCandidates ?? 0} Candidates Applied</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
          {job.jobDescription}
        </p>
      </div>

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => onViewApplicants?.(job, "view")}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>{primaryActionLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default RecruiterJobCard;
