/* ══════════════════════════════════════════════════════════════
   Recruiter Profile View
═══════════════════════════════════════════════════════════════ */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import api from "../../api/api";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness,
  Camera,
  Check,
  ExternalLink,
  Info,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Send,
  Share2,
} from "lucide-react";
const ICONS = {
  edit: Pencil,
  save: Send,
  camera: Camera,
  check: Check,
  about: Info,
  share: Share2,
  brief: BriefcaseBusiness,
  pin: MapPin,
  mail: Mail,
  external: ExternalLink,
  linkedin: Linkedin,
};

const ACCENT = {
  blue: { headerBg: "from-blue-50 to-white", iconBg: "bg-blue-50 text-blue-600 border-blue-100" },
  indigo: { headerBg: "from-indigo-50 to-white", iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
};

const Section = ({ icon, label, accent = "blue", children }) => {
  const a = ACCENT[accent] || ACCENT.blue;
  const Icon = ICONS[icon] || Info;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r ${a.headerBg}`}>
        <span className={`flex items-center justify-center w-8 h-8 rounded-xl border ${a.iconBg} shadow-sm`}>
          <Icon size={16} strokeWidth={2.2} className="shrink-0" />
        </span>
        <h2 className="text-base font-semibold text-slate-800 tracking-tight">{label}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

const Recruiter_Profile_view = ({ userProp }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [data, setData] = useState({
    name: "",
    userName: "",
    email: "",
    img: "",
    company: "",
    position: "",
    description: "",
    website: "",
    location: "",
    linkedIn: "",
    jobsPosted: 0,
    candidatesHired: 0,
    teamSize: 0,
  });

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/recruiter/profile");
        const profile = response.data?.data || response.data?.profile;

        const userName = userProp?.userName || user?.userName || user?.name || "";
        const userEmail = userProp?.email || user?.email || "";
        const userPicture = userProp?.picture || user?.picture || "";

        if (profile) {
          setData({
            name: profile.name || userName,
            userName: profile.userName || userName,
            email: profile.email || userEmail,
            img: profile.img || userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || userName || "User")}&background=0f172a&color=fff&size=200`,
            company: profile.company || "",
            position: profile.position || "",
            description: profile.description || "",
            website: profile.website || "",
            location: profile.location || "",
            linkedIn: profile.linkedIn || "",
            jobsPosted: profile.jobsPosted || 0,
            candidatesHired: profile.candidatesHired || 0,
            teamSize: profile.teamSize || 0,
          });
        } else {
          setData({
            name: userName,
            userName: userName,
            email: userEmail,
            img: userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=0f172a&color=fff&size=200`,
            company: "",
            position: "",
            description: "",
            website: "",
            location: "",
            linkedIn: "",
            jobsPosted: 0,
            candidatesHired: 0,
            teamSize: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching recruiter profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userProp]);

  const setField = (f, v) => setData(p => ({ ...p, [f]: v }));

  const handleShare = async () => {
    const userId = user?.id || user?._id || "";
    const profileUrl = `${window.location.origin}/recruiter/profile/${userId}`;
    const shareData = {
      title: `${data.name} — Recruiter Profile`,
      text: `Connect with ${data.name}, ${data.position} at ${data.company} via JobFit.`,
      url: profileUrl,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { }
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    }
  };

  const handleSave = async () => {
    if (!data.name.trim()) return toast.error("Name is required");
    setUploading(true);
    setSaving(true);

    const payload = {
      name: data.name.trim(),
      userName: data.userName.trim(),
      company: data.company.trim(),
      position: data.position.trim(),
      description: data.description.trim(),
      website: data.website.trim(),
      location: data.location.trim(),
      linkedIn: data.linkedIn.trim(),
      teamSize: Number(data.teamSize) || 0,
    };
    if (data.img?.trim()) payload.img = data.img.trim();

    try {
      const response = await api.patch("/recruiter/profile", payload);

      const updatedProfile = response.data?.data || response.data?.profile;

      // Update global auth state to reflect changes
      const picToSync = updatedProfile?.img || data.img;
      if (updateUser) {
        updateUser({
          userName: data.name,
          picture: picToSync,
          img: picToSync
        });
      }

      setEditing(false);
      setSaved(true);
      toast.success("Profile saved successfully!", { position: "top-center", autoClose: 2000 });
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving profile:", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      toast.error(`Error saving profile: ${serverMsg}`);
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = ev => { setField("img", ev.target.result); };
      r.onerror = () => { alert("Upload failed."); };
      r.readAsDataURL(file);
    } else { alert("Invalid image."); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <p className="text-lg font-medium text-gray-600 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .anim-up  { animation: fadeUp .45s ease both; }
        .anim-in  { animation: fadeIn .2s ease both; }
        .d100 { animation-delay:100ms; }
        .d180 { animation-delay:180ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-poppins pb-12">
        

        {/* ── Main Container ─────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-16">

          {/* ── Header Card ────────────────────────────────────── */}
          <div className="anim-up bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200 shrink-0 ${editing ? "cursor-pointer" : ""}`}
              >
                <img src={data.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=0f172a&color=fff&size=200`} alt="Profile" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {editing && (
                  <label className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer text-white">
                    <Camera size={28} strokeWidth={2.2} className="shrink-0" />
                    <span className="text-xs mt-1.5 font-semibold">Change</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                )}
              </div>

              {/* Identity & Content */}
              <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left">
                {editing ? (
                  <div className="w-full max-w-sm space-y-2">
                    <input
                      className="text-2xl font-bold text-slate-900 bg-blue-50 border-b-2 border-blue-500 rounded-t-lg px-3 py-1.5 w-full outline-none"
                      value={data.name}
                      onChange={e => setField("name", e.target.value)}
                      placeholder="Full Name"
                    />
                    <input
                      className="text-sm font-medium text-slate-700 bg-blue-50 border-b-2 border-blue-500 rounded-t-lg px-3 py-1.5 w-full outline-none"
                      value={data.position}
                      onChange={e => setField("position", e.target.value)}
                      placeholder="Job Title / Position"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{data.name}</h1>
                    <p className="text-base font-semibold text-blue-600 mt-1">
                      {data.position || <span className="text-slate-400 italic">Position not set</span>}
                      {data.company && <span className="text-slate-500"> at {data.company}</span>}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                      <Mail size={16} strokeWidth={2.2} className="shrink-0" />
                      {data.email}
                    </p>
                  </>
                )}

                {/* Recruiter Stats Section */}
                <div className="flex gap-6 mt-6 pt-5 w-full border-t border-slate-100 justify-center sm:justify-start">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-black text-slate-800">{data.jobsPosted}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Jobs Posted</div>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-black text-slate-800">{data.candidatesHired}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Hired</div>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
                    {editing ? (
                      <input
                        type="number"
                        className="text-2xl font-black text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-2 w-20 text-center sm:text-left outline-none"
                        value={data.teamSize}
                        onChange={e => setField("teamSize", e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    ) : (
                      <div className="text-2xl font-black text-slate-800">{data.teamSize}</div>
                    )}
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Team Size</div>
                  </div>
                </div>

              </div>

              {/* Actions Corner */}
              <div className="flex items-center gap-2 flex-wrap shrink-0 absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto">
                {saved && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <Check size={12} strokeWidth={2.4} className="shrink-0" /> Saved
                  </span>
                )}

                {editing ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => { setEditing(false); }}
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-all hover:-translate-y-px shadow-md shadow-blue-200 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} strokeWidth={2.4} className="shrink-0" /> <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all hover:-translate-y-px"
                    >
                      <Share2 size={14} strokeWidth={2.4} className="shrink-0" /> {shared ? "Copied!" : "Share"}
                    </button>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-all hover:-translate-y-px shadow-md"
                    >
                      <Pencil size={14} strokeWidth={2.4} className="shrink-0" /> Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Content Sections ─────────────────────────────────── */}
          <div className="mt-6 flex flex-col gap-5">

            {/* Professional Info */}
            <div className="anim-up d100">
              <Section icon="brief" label="Professional Details" accent="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Company</label>
                    {editing ? (
                      <input
                        className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition-all"
                        value={data.company}
                        onChange={e => setField("company", e.target.value)}
                        placeholder="e.g. Google, Tech Innovators"
                      />
                    ) : (
                      <p className="text-sm text-slate-800 font-medium">{data.company || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Username</label>
                    {editing ? (
                      <input
                        className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition-all"
                        value={data.userName}
                        onChange={e => setField("userName", e.target.value)}
                        placeholder="e.g. john_doe"
                      />
                    ) : (
                      <p className="text-sm text-slate-800 font-medium">{data.userName || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
                    {editing ? (
                      <input
                        className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition-all"
                        value={data.location}
                        onChange={e => setField("location", e.target.value)}
                        placeholder="City, Country"
                      />
                    ) : (
                      <p className="text-sm text-slate-800 font-medium">{data.location || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Website</label>
                    {editing ? (
                      <input
                        className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition-all"
                        value={data.website}
                        onChange={e => setField("website", e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {data.website ? (
                          <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 w-max">
                            {data.website}
                            <ExternalLink size={12} strokeWidth={2.2} className="shrink-0" />
                          </a>
                        ) : "—"}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">LinkedIn Profile</label>
                    {editing ? (
                      <input
                        className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition-all"
                        value={data.linkedIn}
                        onChange={e => setField("linkedIn", e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {data.linkedIn ? (
                          <a href={data.linkedIn.startsWith('http') ? data.linkedIn : `https://${data.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] hover:underline flex items-center gap-1 w-max">
                            <Linkedin size={14} strokeWidth={2.2} className="shrink-0" />
                            {data.linkedIn}
                          </a>
                        ) : "—"}
                      </p>
                    )}
                  </div>
                </div>
              </Section>
            </div>

            {/* About / Description */}
            <div className="anim-up d180">
              <Section icon="about" label="About" accent="indigo">
                {editing ? (
                  <textarea
                    rows={6}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 outline-none resize-vertical transition-all"
                    value={data.description}
                    onChange={e => setField("description", e.target.value)}
                    placeholder="Describe your role, your company, and what kind of candidates you're looking for..."
                  />
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {data.description || <em className="text-slate-400">No profile description provided.</em>}
                  </p>
                )}
              </Section>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Recruiter_Profile_view;
