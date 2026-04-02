import RecruiterAtsScoreCircle from "./RecruiterAtsScoreCircle";
import { ACCENT } from "./RecruiterConstants";

const RecruiterCandidateCard = ({
  candidate: c,
  index: i,
  isExpanded,
  onToggleExpand,
  onViewResume,
  onAction,          // (candidate, action) => void
  actionLoadingKey,
}) => {
  const candidateStatus = (c.status || "").toLowerCase();
  const isShortlisted = candidateStatus === "shortlisted";
  const isHired = candidateStatus === "hired";
  const isRejected = candidateStatus === "rejected";
  const candidateAvatar = c.picture || c.avatar || c.avatarUrl || c.profilePicture || "";
  const initials = (c.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="bg-white rounded-2xl border border-[#9c44fe]/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#9c44fe]/8 hover:border-[#9c44fe]/25"
      style={{ animationDelay: `${i * 60}ms` }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Avatar */}
          <div
            className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #7c3aed)`,
              boxShadow: `0 4px 14px ${ACCENT}30`,
            }}
          >
            {candidateAvatar ? (
              <img
                src={candidateAvatar}
                alt={c.name || "Candidate"}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              initials
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {c.name || "Unknown Candidate"}
                </h3>
                {c.email && (
                  <p className="text-sm text-gray-400 mt-0.5 truncate">
                    {c.email}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {c.status && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {c.status}
                    </span>
                  )}
                  {c.appliedAt && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                      Applied {new Date(c.appliedAt).toLocaleDateString()}
                    </span>
                  )}
                  {!c.resumeLink && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Candidate has not uploaded resume
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0 flex flex-col items-center">
                {typeof c.atsScore === "number" &&
                  Number.isFinite(c.atsScore) ? (
                  <>
                    <RecruiterAtsScoreCircle score={c.atsScore} size={60} />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                      ATS
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-200">
                    ATS N/A
                  </span>
                )}
              </div>
            </div>

            {/* Qualifications Preview */}
            {c.qualifications && (
              <div
                className="mt-4 p-4 rounded-xl border"
                style={{
                  backgroundColor: `${ACCENT}06`,
                  borderColor: `${ACCENT}12`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#111827"
                    viewBox="0 0 256 256"
                  >
                    <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.74,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12Z" />
                  </svg>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#111827" }}
                  >
                    Qualifications
                  </span>
                </div>
                <p
                  className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}
                >
                  {c.qualifications}
                </p>
              </div>
            )}

            {/* Expanded Details */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded
                ? "max-h-[400px] opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0"
                }`}
            >
              <div className="space-y-3">
                {c.experience && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#6b7280"
                      viewBox="0 0 256 256"
                      className="mt-0.5 shrink-0"
                    >
                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
                    </svg>
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Experience
                      </span>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {c.experience}
                      </p>
                    </div>
                  </div>
                )}
                {c.skills && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#6b7280"
                      viewBox="0 0 256 256"
                      className="mt-0.5 shrink-0"
                    >
                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z" />
                    </svg>
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Skills
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(c.skills)
                          ? c.skills
                          : c.skills.split(",")
                        ).map((skill, si) => (
                          <span
                            key={si}
                            className="text-xs font-medium px-3 py-1.5 rounded-full border"
                            style={{
                              color: ACCENT,
                              backgroundColor: `${ACCENT}08`,
                              borderColor: `${ACCENT}20`,
                            }}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {c.resumeLink && (
                <button
                  onClick={() => onViewResume(c)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: "#111827",
                    boxShadow: "0 4px 14px rgba(17, 24, 39, 0.35)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                  </svg>
                  View Resume
                </button>
              )}

              {!isShortlisted && !isHired && !isRejected && (
                <>
                  <button
                    onClick={() => onAction(c, "shortlist")}
                    disabled={actionLoadingKey === `${c.applicationId}:shortlist`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-green-600 border border-green-200 bg-white hover:bg-green-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                    </svg>
                    {actionLoadingKey === `${c.applicationId}:shortlist`
                      ? "Shortlisting..."
                      : "Shortlist"}
                  </button>

                  <button
                    onClick={() => onAction(c, "reject")}
                    disabled={actionLoadingKey === `${c.applicationId}:reject`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                    {actionLoadingKey === `${c.applicationId}:reject`
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </>
              )}

              {isShortlisted && (
                <>
                  <span className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                    Shortlisted
                  </span>

                  {/* Hire FIRST when shortlisted */}
                  <button
                    onClick={() => onAction(c, "hire")}
                    disabled={actionLoadingKey === `${c.applicationId}:hire`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                    {actionLoadingKey === `${c.applicationId}:hire`
                      ? "Hiring..."
                      : "Hire"}
                  </button>

                  {/* Reject SECOND */}
                  <button
                    onClick={() => onAction(c, "reject")}
                    disabled={actionLoadingKey === `${c.applicationId}:reject`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                    {actionLoadingKey === `${c.applicationId}:reject`
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </>
              )}

              {isHired && (
                <span className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Hired
                </span>
              )}

              {isRejected && (
                <span className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-50 text-red-700 border border-red-200">
                  Rejected
                </span>
              )}

              <button
                onClick={onToggleExpand}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 ml-auto ${isExpanded
                  ? "text-[#9c44fe] bg-[#9c44fe]/5 border-[#9c44fe]/20"
                  : "text-gray-400 bg-white border-gray-200 hover:border-gray-300 hover:text-gray-600"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
                >
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                </svg>
                {isExpanded ? "Less" : "More"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCandidateCard;
