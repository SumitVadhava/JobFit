import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import api from "../../api/api";
import { RecruiterSkeletonProfilePage } from "../../components/recruiter/RecruiterSkeletons";
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

/* ── Helpers & Constants ─────────────────────────────────────── */
const createFallbackProfile = ({ name = "", email = "", picture = "" } = {}) => ({
  profileId: null,
  name,
  userName: name,
  email,
  position: "",
  company: "",
  description: "",
  location: "",
  website: "",
  linkedIn: "",
  jobsPosted: 0,
  candidatesHired: 0,
  teamSize: 0,
  profilePicture:
    picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=6B46C1&color=fff&size=200`,
});

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (value._id) return String(value._id);
  }
  return String(value);
};

const mapProfileToState = (profile, userName, userEmail, userPicture) => {
  const displayName = profile?.userName || profile?.name || userName || "";
  return {
    profileId: profile?._id || null,
    name: displayName,
    userName: displayName,
    email: profile?.email || userEmail || "",
    position: profile?.position || "",
    company: profile?.company || "",
    description: profile?.description || "",
    location: profile?.location || "",
    website: profile?.website || "",
    linkedIn: profile?.linkedIn || "",
    jobsPosted: profile?.jobsPosted || 0,
    candidatesHired: profile?.candidatesHired || 0,
    teamSize: profile?.teamSize || 0,
    profilePicture:
      profile?.img ||
      userPicture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "User")}&background=6B46C1&color=fff&size=200`,
  };
};

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

/* ── Main Component ─────────────────────────────────────────── */
const Recruiter_Profile_view = ({ userProp }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const currentUserId = normalizeId(user?._id || user?.id || "");
  const [profileOwnerId, setProfileOwnerId] = useState(currentUserId);
  const [profileExists, setProfileExists] = useState(false);
  const [data, setData] = useState(() =>
    createFallbackProfile({
      name: userProp?.userName || user?.userName || user?.name || "",
      email: userProp?.email || user?.email || "",
      picture: userProp?.picture || user?.picture || "",
    })
  );

  const [editing, setEditing] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(null);
  const [gallery, setGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const galleryImages = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=0f172a&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=2563eb&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=7c3aed&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=059669&color=fff&size=200`,
  ];

  const isOwnProfile = !paramId || (!!currentUserId && currentUserId === profileOwnerId);

  const set = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const clearRecruiterSessionAndRedirect = () => {
    localStorage.clear();
    logout();
    navigate("/login", { replace: true });
  };

  const mapStateToApi = (includeEmail = false) => {
    const normalizedTeamSize = Number.isFinite(Number(data.teamSize))
      ? Math.max(0, Number(data.teamSize))
      : 0;

    const payload = {
      userName: (data.name || "").trim(),
      img: (data.profilePicture || "").trim(),
      company: (data.company || "").trim(),
      position: (data.position || "").trim(),
      description: (data.description || "").trim(),
      location: (data.location || "").trim(),
      website: (data.website || "").trim(),
      linkedIn: (data.linkedIn || "").trim(),
      teamSize: normalizedTeamSize,
    };

    if (includeEmail && data.email) {
      payload.email = data.email.trim();
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    return payload;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        let profile = null;
        try {
          const response = !paramId
            ? await api.get("/recruiter/profile")
            : await api.get(`/recruiter/profile/${paramId}`);
          profile = response.data?.data || response.data?.profile || null;
        } catch (e) {
          if (e.response?.status !== 404) {
            console.error("Error fetching profile:", e);
          }
        }

        const userName = !paramId
          ? userProp?.userName || user?.userName || user?.name || ""
          : profile?.userName || profile?.name || profile?.user?.userName || profile?.user?.name || "";
        const userEmail = !paramId
          ? userProp?.email || user?.email || ""
          : profile?.email || profile?.user?.email || "";
        const userPicture = !paramId
          ? userProp?.picture || user?.picture || ""
          : profile?.img || profile?.user?.picture || "";

        if (profile) {
          setData(mapProfileToState(profile, userName, userEmail, userPicture));
          setProfileOwnerId(normalizeId(profile.user?._id || profile.user || currentUserId || ""));
          setProfileExists(true);
        } else if (!paramId) {
          setData(createFallbackProfile({ name: userName, email: userEmail, picture: userPicture }));
          setProfileOwnerId(currentUserId || "");
          setProfileExists(false);
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (!paramId) {
          const userName = userProp?.userName || user?.userName || user?.name || "";
          const userEmail = userProp?.email || user?.email || "";
          const userPicture = userProp?.picture || user?.picture || "";
          setData(createFallbackProfile({ name: userName, email: userEmail, picture: userPicture }));
          setProfileOwnerId(currentUserId || "");
          setProfileExists(false);
        } else {
          setError("Profile not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [paramId, currentUserId, user?.userName, user?.email, user?.picture, userProp]);

  useEffect(() => {
    if (userProp && !paramId) {
      setData((prev) => ({
        ...prev,
        name: userProp.userName || prev.name,
        userName: userProp.userName || prev.userName,
        email: userProp.email || prev.email,
        profilePicture: userProp.picture || prev.profilePicture,
      }));
    }
  }, [userProp, paramId]);

  const startEditing = () => {
    setEditSnapshot({ ...data });
    setEditing(true);
  };

  const cancelEditing = () => {
    if (editSnapshot) setData(editSnapshot);
    setEditSnapshot(null);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!data.name.trim()) return alert("Name is required");

    const payload = mapStateToApi(!profileExists);

    setSaving(true);
    try {
      let response;
      let updatedProfile;

      if (profileExists) {
        response = await api.patch("/recruiter/profile", payload);
        updatedProfile = response.data?.data || response.data?.profile;
      } else {
        response = await api.post("/recruiter/profile", payload);
        updatedProfile = response.data?.data || response.data?.profile;
        setProfileExists(true);
      }

      const picToSync = updatedProfile?.img || data.profilePicture;
      updateUser({
        userName: data.name,
        picture: picToSync,
        img: picToSync,
      });

      if (updatedProfile) {
        setData((prev) => ({
          ...prev,
          ...mapProfileToState(updatedProfile, data.name, data.email, picToSync),
        }));
        setProfileOwnerId(normalizeId(updatedProfile.user?._id || updatedProfile.user || currentUserId || ""));
      }

      setEditing(false);
      setEditSnapshot(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving profile:", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;

      if (err.response?.status === 404 && profileExists) {
        try {
          const createPayload = mapStateToApi(true);
          const createResponse = await api.post("/recruiter/profile", createPayload);
          const createdProfile = createResponse.data?.data || createResponse.data?.profile;

          if (createdProfile) {
            setData((prev) => ({
              ...prev,
              ...mapProfileToState(createdProfile, data.name, data.email, data.profilePicture),
            }));
            setProfileOwnerId(normalizeId(createdProfile.user?._id || createdProfile.user || currentUserId || ""));
            setProfileExists(true);
          }

          setEditing(false);
          setEditSnapshot(null);
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        } catch (createErr) {
          console.error("Error creating profile:", createErr);
          const createMsg =
            createErr.response?.data?.message || createErr.response?.data?.error || createErr.message;
          alert(`Failed to save profile: ${createMsg}`);
        }
      } else {
        alert(`Failed to save profile.\n\nServer error: ${serverMsg}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!profileExists) {
      clearRecruiterSessionAndRedirect();
      return;
    }

    setDeleting(true);
    try {
      await api.delete("/recruiter/profile");
      clearRecruiterSessionAndRedirect();
    } catch (err) {
      console.error("Error deleting profile:", err);
      if (err.response?.status === 404) {
        clearRecruiterSessionAndRedirect();
      } else {
        alert(err.response?.data?.message || "Failed to delete recruiter profile.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    const shareId = data.profileId || paramId || currentUserId || "";
    const profileName = (data.userName || data.name || "Recruiter Profile").trim();
    const profileUrl = shareId
      ? `${window.location.origin}/recruiter/profile/${shareId}`
      : `${window.location.origin}/recruiter/profile`;
    const shareData = {
      title: `${profileName} — Recruiter Profile`,
      text: `Connect with ${profileName}, ${data.position} at ${data.company} via JobFit.`,
      url: profileUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // no-op
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    }
  };

  const handleUpload = (e) => {
    setUploading(true);
    const file = e.target.files[0];

    if (file?.type.startsWith("image/")) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        set("profilePicture", ev.target.result);
        setGallery(false);
        setUploading(false);
      };
      reader.onerror = () => {
        alert("Upload failed.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Invalid image.");
      setUploading(false);
    }
  };

  const displayName = (data.userName || data.name || "").trim();
  const deleteTarget = (displayName || data.company || "DELETE PROFILE").trim();
  const deleteMatches = deleteConfirmText.trim() === deleteTarget;

  const handleImgError = (e) => {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "User")}&background=6B46C1&color=fff&size=200`;
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  if (loading) return <RecruiterSkeletonProfilePage />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-poppins anim-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-16">
          <div className="animate-[fadeUp_0.45s_ease_both] bg-white border border-slate-200 rounded-2xl shadow-lg px-6 py-5 relative z-10 flex flex-wrap items-center gap-5">
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200 shrink-0 ${editing ? "cursor-pointer" : ""}`}
              onClick={() => editing && setGallery(true)}
            >
              <img
                src={data.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={handleImgError}
              />
              {editing && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera size={22} className="shrink-0 text-white" />
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
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg anim-up">
                  <Check size={12} className="shrink-0" /> Saved
                </span>
              )}
              {shared && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg anim-up">
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
                    <>
                      <button
                        onClick={startEditing}
                        className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-all hover:-translate-y-px shadow-md"
                      >
                        <Pencil size={14} className="shrink-0" /> Edit Profile
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmText("");
                          setDeleteModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} className="shrink-0" /> Delete Profile
                      </button>
                    </>
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
                    className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${data.profilePicture === img ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-blue-300"
                      }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={handleImgError}
                    />
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-600 shadow-sm transition-transform hover:scale-105">
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
                  Type <span className="font-bold select-none whitespace-nowrap">{deleteTarget}</span> to confirm deletion.
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
                    autoComplete="off"
                    placeholder={deleteTarget}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100 shadow-inner"
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
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:hidden"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!deleteMatches || deleting}
                    className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-700 hover:shadow-rose-500/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-rose-300"
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
        <style>{`
          .anim-in { animation: fadeIn 0.2s ease both; }
          .anim-up { animation: fadeUp 0.45s ease both; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </>
  );
};

export default Recruiter_Profile_view;
