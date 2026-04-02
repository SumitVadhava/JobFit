/* ══════════════════════════════════════════════════════════════
   Recruiter Profile View
═══════════════════════════════════════════════════════════════ */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className="shrink-0">
    <path d={d} />
  </svg>
);

const ICONS = {
  edit: "M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.32,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l12.68-12.69L204.69,96Z",
  save: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-192,64a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,256q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l64-192A16,16,0,0,0,227.32,28.68ZM158.46,233.15l-37-78.23L153.37,123A8,8,0,0,0,142.05,111.7l-31.91,31.92L31.91,106.6Z",
  camera: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z",
  check: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
  about: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z",
  share: "M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,65.89,8,8,0,0,1-15.49-4A104,104,0,0,1,165,96H204.69L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z",
  brief: "M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z",
  pin: "M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"
};

const ACCENT = {
  blue: { headerBg: "from-blue-50 to-white", iconBg: "bg-blue-50 text-blue-600 border-blue-100" },
  indigo: { headerBg: "from-indigo-50 to-white", iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
};

const Section = ({ icon, label, accent = "blue", children }) => {
  const a = ACCENT[accent] || ACCENT.blue;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r ${a.headerBg}`}>
        <span className={`flex items-center justify-center w-8 h-8 rounded-xl border ${a.iconBg} shadow-sm`}>
          <Ic d={ICONS[icon]} size={16} />
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
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/recruiter-profile");
        const profile = response.data?.profile;

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
    if (data.img?.trim() && !profilePhotoFile) payload.img = data.img.trim();

    let formData = null;
    if (profilePhotoFile) {
      formData = new FormData();
      formData.append('profilePhoto', profilePhotoFile);
      Object.keys(payload).forEach(key => {
        formData.append(key, JSON.stringify(payload[key]));
      });
    }

    try {
      const config = formData ? {
        headers: { 'Content-Type': 'application/json' }
      } : {};

      const response = await api.put("/recruiter-profile", formData || payload, config);

      const updatedProfile = response.data?.profile;

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
      setProfilePhotoFile(null); // Clear the file after save
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
      setProfilePhotoFile(file);
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
        <ToastContainer />

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
                    <Ic d={ICONS.camera} size={28} />
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
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
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
                    <Ic d={ICONS.check} size={12} /> Saved
                  </span>
                )}

                {editing ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => { setEditing(false); setProfilePhotoFile(null); }}
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
                          <Ic d={ICONS.save} size={14} /> <span>Save</span>
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
                      <Ic d={ICONS.share} size={14} /> {shared ? "Copied!" : "Share"}
                    </button>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-all hover:-translate-y-px shadow-md"
                    >
                      <Ic d={ICONS.edit} size={14} /> Edit
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm-16,176H163.63V141.2c0-14.77-5.18-24.84-18.15-24.84-9.88,0-15.77,6.8-18.42,13.38a24,24,0,0,0-1.18,8.8v61.46H91.1S91.56,92,91.1,80h34.78v14.49S133,83.9,150.1,80c20.31-4.66,49.9,8,49.9,56.12ZM59.34,200H24.56V80H59.34ZM41.95,66.19c-11.83,0-21.56-9.5-21.56-21.19A21.46,21.46,0,0,1,41.95,23.31C53.79,23.31,63.26,32.81,63.26,45A21.46,21.46,0,0,1,41.95,66.19Z" />
                            </svg>
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
