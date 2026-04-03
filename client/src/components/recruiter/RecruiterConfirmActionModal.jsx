/* ─────────── Action Config ────────── */
const ACTION_CONFIG = {
  shortlist: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 256 256"
        className="text-green-600"
      >
        <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
      </svg>
    ),
    iconBg: "bg-green-50 border-green-100",
    title: "Shortlist Candidate?",
    description:
      "This candidate will be moved to the shortlisted pool. You can hire or reject them later.",
    confirmLabel: "Yes, Shortlist",
    confirmClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  reject: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 256 256"
        className="text-red-600"
      >
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
      </svg>
    ),
    iconBg: "bg-red-50 border-red-100",
    title: "Reject Candidate?",
    description:
      "This candidate will be marked as rejected. This action reflects your hiring decision.",
    confirmLabel: "Yes, Reject",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  hire: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 256 256"
        className="text-indigo-600"
      >
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    ),
    iconBg: "bg-indigo-50 border-indigo-100",
    title: "Hire Candidate?",
    description:
      "Hiring this candidate will reduce the available openings count for this job posting.",
    confirmLabel: "Yes, Hire",
    confirmClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
};

const RecruiterConfirmActionModal = ({
  isOpen,
  action,
  candidateName,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !action) return null;
  const cfg = ACTION_CONFIG[action] || {};

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${cfg.iconBg}`}
          >
            {cfg.icon}
          </div>

          {/* Title */}
          <h3 className="text-center text-lg font-bold text-gray-900 mb-1">
            {cfg.title}
          </h3>

          {/* Candidate name */}
          {candidateName && (
            <p className="text-center text-sm font-semibold text-[#9c44fe] mb-2">
              {candidateName}
            </p>
          )}

          {/* Description */}
          <p className="text-center text-sm text-gray-500 leading-relaxed">
            {cfg.description}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`min-w-[130px] px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${cfg.confirmClass}`}
            >
              {isLoading ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                  Processing...
                </>
              ) : (
                cfg.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterConfirmActionModal;
