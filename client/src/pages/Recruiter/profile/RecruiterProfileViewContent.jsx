import React from "react";
import {
  BadgeInfo,
  BriefcaseBusiness,
  Camera,
  Check,
  Globe,
  Heart,
  Linkedin,
  MapPin,
  Pencil,
  Save,
  Share2,
  TriangleAlert,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const Icon = ({ icon: IconComp, size = 16, className = "" }) => (
  <IconComp size={size} className={`shrink-0 ${className}`.trim()} />
);

const ACCENT = {
  blue: { headerBg: "from-blue-50 to-white", iconBg: "bg-blue-50 text-blue-600 border-blue-100" },
  indigo: { headerBg: "from-indigo-50 to-white", iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  violet: { headerBg: "from-violet-50 to-white", iconBg: "bg-violet-50 text-violet-600 border-violet-100" },
  emerald: { headerBg: "from-emerald-50 to-white", iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
};

const Section = ({ icon, label, accent = "blue", children }) => {
  const a = ACCENT[accent];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r ${a.headerBg}`}>
        <span className={`flex items-center justify-center w-8 h-8 rounded-xl border ${a.iconBg} shadow-sm`}>
          <Icon icon={icon} size={16} />
        </span>
        <h2 className="text-base font-semibold text-slate-800 tracking-tight">{label}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

const RecruiterProfileViewContent = ({
  data,
  editing,
  saving,
  saved,
  shared,
  uploading,
  gallery,
  deleting,
  deleteModalOpen,
  deleteConfirmText,
  setDeleteConfirmText,
  galleryImages,
  isOwnProfile,
  set,
  startEditing,
  cancelEditing,
  handleSave,
  handleDelete,
  handleShare,
  handleUpload,
  setGallery,
  setDeleteModalOpen,
}) => {
  const displayName = (data.userName || data.name || "").trim();
  const deleteTarget = (displayName || data.company || "DELETE PROFILE").trim();
  const deleteMatches = deleteConfirmText.trim() === deleteTarget;

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-poppins">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-16">
          <div className="animate-[fadeUp_0.45s_ease_both] bg-white border border-slate-200 rounded-2xl shadow-lg px-6 py-5 relative z-10 flex flex-wrap items-center gap-5">
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200 shrink-0 ${editing ? "cursor-pointer" : ""}`}
              onClick={() => editing && setGallery(true)}
            >
              <img src={data.profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {editing && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera size={22} className="shrink-0" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="text-2xl font-bold text-slate-900 bg-blue-50 border-b-2 border-blue-500 rounded-t-lg px-2 py-1 w-full outline-none"
                    value={data.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Full Name"
                  />
                  {data.email && (
                    <div className="px-2 mt-1">
                      <span className="text-sm text-slate-400 font-medium inline-flex items-center gap-1.5">
                        <Check size={12} className="shrink-0" /> {data.email}
                        <span className="text-[10px] uppercase text-slate-300 tracking-wider">Immutable</span>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{displayName}</h1>
                  {data.email && <p className="text-sm text-slate-500 font-medium mt-1">{data.email}</p>}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <Check size={12} className="shrink-0" /> Saved
                </span>
              )}
              {shared && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                  <Check size={12} className="shrink-0" /> Copied!
                </span>
              )}

              {editing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-all hover:-translate-y-px shadow-md shadow-blue-200 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                          <span>Saving...</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={14} className="shrink-0" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all hover:-translate-y-px"
                  >
                    <Share2 size={14} className="shrink-0" /> Share
                  </button>
                  {isOwnProfile && (
                    <button
                      onClick={startEditing}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-all hover:-translate-y-px shadow-md"
                    >
                      <Pencil size={14} className="shrink-0" /> Edit Profile
                    </button>
                  )}
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        setDeleteConfirmText("");
                        setDeleteModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} className="shrink-0" /> Delete Profile
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">
            <div className="flex flex-col gap-4">
              <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:100ms]">
                <Section icon={BadgeInfo} label="About Me" accent="blue">
                  {editing ? (
                    <textarea
                      rows={6}
                      className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 outline-none resize-vertical transition-all"
                      value={data.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Write your professional bio as a recruiter…"
                    />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {data.description || <em className="text-slate-400">No bio provided.</em>}
                    </p>
                  )}
                </Section>
              </div>

              <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:180ms]">
                <Section icon={BriefcaseBusiness} label="Professional Details" accent="indigo">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company Information</h4>
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <BriefcaseBusiness size={18} className="shrink-0" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Organization</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.company}
                                onChange={(e) => set("company", e.target.value)}
                                placeholder="Company Name"
                              />
                            ) : (
                              <p className="text-sm font-bold text-slate-800">{data.company || "Not set"}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <BriefcaseBusiness size={18} className="shrink-0" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Job Title / Position</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.position}
                                onChange={(e) => set("position", e.target.value)}
                                placeholder="e.g. VP Engineering, Senior Recruiter"
                              />
                            ) : (
                              <p className="text-sm font-bold text-slate-800">{data.position || "Not set"}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <Globe size={18} className="shrink-0" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Website</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.website}
                                onChange={(e) => set("website", e.target.value)}
                                placeholder="https://..."
                              />
                            ) : data.website ? (
                              <a
                                href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {data.website}
                                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            ) : (
                              <p className="text-sm font-bold text-slate-800">Not set</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location & Social</h4>
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                            <MapPin size={18} className="shrink-0" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Location</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-slate-800 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.location}
                                onChange={(e) => set("location", e.target.value)}
                                placeholder="City, Country"
                              />
                            ) : (
                              <p className="text-sm font-bold text-slate-800">{data.location || "Not set"}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <Linkedin size={18} className="shrink-0" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">LinkedIn Profile</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.linkedIn}
                                onChange={(e) => set("linkedIn", e.target.value)}
                                placeholder="linkedin.com/in/..."
                              />
                            ) : data.linkedIn ? (
                              <a
                                href={data.linkedIn.startsWith("http") ? data.linkedIn : `https://${data.linkedIn}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Profile
                                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            ) : (
                              <p className="text-sm font-bold text-slate-800">Not set</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            </div>

            <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:500ms] flex flex-col gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6 border-b border-slate-100 pb-2">Hiring Performance</p>

                <div className="flex flex-col gap-6 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shadow-inner">
                      <Heart size={20} className="shrink-0" />
                    </div>
                    <div>
                      {editing ? (
                        <input
                          type="number"
                          min="0"
                          className="w-20 text-sm font-bold text-slate-900 bg-violet-50/50 border border-slate-200 rounded px-2 outline-none"
                          value={data.teamSize}
                          onChange={(e) => set("teamSize", Math.max(0, Number(e.target.value)))}
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 leading-none">{data.teamSize || 0}</p>
                      )}
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Team Size</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    "Helping world-class talent find their perfect corporate fit."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {gallery && (
          <div
            className="animate-[fadeIn_0.2s_ease_both] fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setGallery(false)}
          >
            <div
              className="animate-[slideUp_0.25s_ease_both] bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Choose Profile Picture</h2>
                <button
                  onClick={() => setGallery(false)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
                >
                  <X size={13} className="shrink-0" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      set("profilePicture", img);
                      setGallery(false);
                    }}
                    className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                      data.profilePicture === img ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {data.profilePicture === img && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <Check size={16} className="shrink-0" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all text-slate-400 hover:text-blue-500">
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                {uploading ? (
                  <span className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Uploading...
                  </span>
                ) : (
                  <>
                    <Upload size={22} className="shrink-0" />
                    <span className="text-xs font-semibold">Upload image</span>
                    <span className="text-xs text-slate-400">PNG or JPG · max 5 MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div
            className="animate-[fadeIn_0.2s_ease_both] fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => !deleting && setDeleteModalOpen(false)}
          >
            <div
              className="animate-[slideUp_0.25s_ease_both] w-full max-w-lg overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-600 shadow-sm">
                    <TriangleAlert size={20} className="shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Delete recruiter profile?</h3>
                    <p className="text-sm text-slate-500">This is permanent and will remove your recruiter profile data.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-6 py-5">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-900">
                  Type <span className="font-bold">{deleteTarget}</span> to confirm deletion.
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Confirmation</span>
                  <input
                    autoFocus
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && deleteMatches && !deleting) {
                        handleDelete();
                      }
                    }}
                    placeholder={deleteTarget}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                  />
                </label>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!deleting) {
                        setDeleteModalOpen(false);
                        setDeleteConfirmText("");
                      }
                    }}
                    disabled={deleting}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!deleteMatches || deleting}
                    className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                  >
                    {deleting ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-white/90 animate-pulse" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} className="shrink-0" /> Delete Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecruiterProfileViewContent;
