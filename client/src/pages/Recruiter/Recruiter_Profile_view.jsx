import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import api from "../../api/api";

/* ── Inline Icon helper ─────────────────────────────────────── */
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className="shrink-0">
    <path d={d} />
  </svg>
);

const ICONS = {
  edit: "M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.32,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l12.68-12.69L204.69,96Z",
  save: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-192,64a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,256q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l64-192A16,16,0,0,0,227.32,28.68ZM158.46,233.15l-37-78.23L153.37,123A8,8,0,0,0,142.05,111.7l-31.91,31.92L31.91,106.6Z",
  camera: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z",
  x: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
  plus: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z",
  clock: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
  upload: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H216V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z",
  share: "M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,65.89,8,8,0,0,1-15.49-4A104,104,0,0,1,165,96H204.69L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z",
  about: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z",
  brief: "M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z",
  grad: "M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87V168a8,8,0,0,0,16,0V126.41l39.76,21.2A88.16,88.16,0,0,0,80,216a8,8,0,0,0,16,0,72,72,0,0,1,144,0,8,8,0,0,0,16,0,88.16,88.16,0,0,0-7.76-68.39L251.76,103.06A8,8,0,0,0,251.76,88.94ZM128,42l106.88,57L128,155.94,21.12,99Z",
  skills: "M224,115.55V208a16,16,0,0,1-16,16H163.09A119.83,119.83,0,0,1,128,240a120.24,120.24,0,0,1-35.09-5.18h0A119.83,119.83,0,0,1,92.91,224H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,7.24-13.38L120.59,48.61a16,16,0,0,1,14.82,0l81.35,53.56A16,16,0,0,1,224,115.55Z",
  lang: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM215.82,120H171.8a183.08,183.08,0,0,0-5.83-48H199.1A88.16,88.16,0,0,1,215.82,120ZM128,40.16a166.75,166.75,0,0,1,27,31.84H101A166.75,166.75,0,0,1,128,40.16ZM89.92,72h32a183.08,183.08,0,0,1,5.83,48H40.2A88.18,88.18,0,0,1,89.92,72ZM40.18,136H83.82a183.08,183.08,0,0,0,5.83,48H56.91A88.16,88.16,0,0,1,40.18,136Zm87.82,79.84a166.75,166.75,0,0,1-27-31.84h54A166.75,166.75,0,0,1,128,215.84Zm43.91-31.84h33.12a183.08,183.08,0,0,1-5.83-48H172A88.18,88.18,0,0,1,171.91,184Z",
  copy: "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z",
  check: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
  loading: "M224,128a96,96,0,0,1-192,0,8,8,0,0,1,8-8h16a80,80,0,0,1,160,0,8,8,0,0,1-8,8Z",
  cpu: "M208,136h-8V120h8a8,8,0,0,0,0-16h-8V96a16,16,0,0,0-16-16H168V72a8,8,0,0,0-16,0V80H136V72a8,8,0,0,0-16,0V80H104V72a8,8,0,0,0-16,0V80H80A16,16,0,0,0,64,96v8H56a8,8,0,0,0,0,16h8v16H56a8,8,0,0,0,0,16h8v8a16,16,0,0,0,16,16h8v8a8,8,0,0,0,16,0v-8h16v8a8,8,0,0,0,16,0v-8h16v8a8,8,0,0,0,16,0v-8h8a16,16,0,0,0,16-16v-8h8a8,8,0,0,0,0-16Zm-24,24H80V96H184v64Zm-56-48H112a8,8,0,0,0,0,16h12v12a8,8,0,0,0,16,0V128h12a8,8,0,0,0,0-16Z",
  heart: "M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94a62,62,0,0,1,116-23.22A62,62,0,0,1,240,94Z",
  globe: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM128,40c11.08,0,25.9,18,34,88-8.1,70-22.92,88-34,88s-25.9-18-34-88C102.1,58,116.92,40,128,40ZM40.2,128c1.38-23.95,11.23-45.54,26.54-61.64C77.41,84.18,85.25,108.21,87.82,120H40.2Zm0,16h47.62c-2.57,11.79-10.41,35.82-21.08,53.64C51.43,181.54,41.58,159.95,40.2,144Zm120.89,53.64c-10.67-17.82-18.51-41.85-21.08-53.64h47.62C186.25,168.05,176.4,189.64,161.09,197.64ZM168.2,120c2.57-11.79,10.41-35.82,21.08-53.64,15.31,16.1,25.16,37.69,26.54,61.64H168.2Z",
  mapPin: "M128,24A80.1,80.1,0,0,0,48,104c0,72,80,128,80,128s80-56,80-128A80.1,80.1,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z",
  linkedin: "M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm-104,160v-64h-24v64H80v-88h32V104h32v80H120Zm36-104a12,12,0,1,1,12,12A12,12,0,0,1,156,84Z",
};

/* ── Section Card ───────────────────────────────────────────── */
const ACCENT = {
  blue: { headerBg: "from-blue-50 to-white", iconBg: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-indigo-500", company: "bg-blue-50 text-blue-700" },
  indigo: { headerBg: "from-indigo-50 to-white", iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100", dot: "bg-indigo-500", company: "bg-indigo-50 text-indigo-700" },
  violet: { headerBg: "from-violet-50 to-white", iconBg: "bg-violet-50 text-violet-600 border-violet-100", dot: "bg-violet-500", company: "bg-violet-50 text-violet-700" },
  emerald: { headerBg: "from-emerald-50 to-white", iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500", company: "bg-emerald-50 text-emerald-700" },
};

const Section = ({ icon, label, accent = "blue", children }) => {
  const a = ACCENT[accent];
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



/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Recruiter_Profile_view = ({ userProp }) => {

  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !paramId || (user && (paramId === user._id || paramId === user.id));

  const emptyProfile = {
    name: "",
    email: "",
    position: "",
    company: "",
    description: "",
    location: "",
    website: "",
    profilePicture: "",
  };

  const initial = {
    name: userProp?.userName || "Sophia Bennett",
    email: userProp?.email || "sophia.bennett@google.com",
    position: "Senior Talent Acquisition Specialist",
    company: "Google Inc.",
    description:
      "Passionate recruiter with 8+ years of experience in hiring top-tier engineering talent. Dedicated to building diverse and inclusive teams at scale.",
    location: "Mountain View, CA",
    website: "https://google.com/careers",
    profilePicture: userProp?.picture || "https://ui-avatars.com/api/?name=Sophia+Bennett&background=0f172a&color=fff&size=200",
  };

  const [data, setData] = useState(initial);

  const [editing, setEditing] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  /* ── Helper to map API response into component state ────── */
  const mapProfileToState = (profile, userName, userEmail, userPicture) => ({
    name: profile?.name || profile?.userName || userName || "",
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
    profilePicture: profile?.img || userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || userName || "User")}&background=0f172a&color=fff&size=200`,
  });

  /* ── Helper to map state back to API shape ────────────── */
  const mapStateToApi = () => {
    const payload = {
      userName: data.name || undefined,
      img: data.profilePicture || undefined,
      description: data.description || undefined,
      company: data.company || undefined,
      position: data.position || undefined,
      website: data.website || undefined,
      location: data.location || undefined,
      linkedIn: data.linkedIn || undefined,
      jobsPosted: data.jobsPosted !== undefined ? data.jobsPosted : undefined,
      candidatesHired: data.candidatesHired !== undefined ? data.candidatesHired : undefined,
      teamSize: data.teamSize !== undefined ? data.teamSize : undefined,
    };
    // Clean up undefined / empty strings for URL validation
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
        delete payload[key];
      }
    });
    return payload;
  };

  /* ── Fetch profile on mount ──────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        let profile = null;
        try {
          if (isOwnProfile) {
            response = await api.get("/recruiter-profile");
          } else {
            response = await api.get(`/recruiter-profile/${paramId}`);
          }
          if (response) profile = response.data.profile;
        } catch (e) {
          // Ignore API error and fallback to dummy data
        }

        // Get user info — for own profile use userProp/auth, for others use populated data
        const userName = isOwnProfile
          ? (userProp?.userName || user?.userName || user?.name || "")
          : (profile?.user?.userName || profile?.user?.name || "User");
        const userEmail = isOwnProfile
          ? (userProp?.email || user?.email || "")
          : (profile?.user?.email || "");
        const userPicture = isOwnProfile
          ? (userProp?.picture || user?.picture || "")
          : (profile?.user?.picture || "");

        if (profile) {
          setData(mapProfileToState(profile, userName, userEmail, userPicture));
        } else if (isOwnProfile) {
          // Fallback to initial dummy data if no profile or backend is disabled
          setData(p => ({ ...initial, name: userName || initial.name, email: userEmail, profilePicture: userPicture || initial.profilePicture }));
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // If profile not found (404), show dummy data or empty state
        if (err.response?.status === 404 && isOwnProfile) {
          setData(initial);
        } else if (!isOwnProfile) {
          setError("Profile not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [paramId, isOwnProfile]);

  useEffect(() => {
    if (userProp) setData(p => ({ ...p, name: userProp.userName || p.name, profilePicture: userProp.picture || p.profilePicture }));
  }, [userProp]);


  const set = (f, v) => setData(p => ({ ...p, [f]: v }));

  const handleSave = async () => {
    if (!data.name.trim()) return alert("Name is required");
    setSaving(true);
    const payload = mapStateToApi();

    let formData = null;
    if (profilePhotoFile) {
      formData = new FormData();
      formData.append('profilePhoto', profilePhotoFile);
      // Add other fields to formData
      Object.keys(payload).forEach(key => {
        if (key !== 'img' && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });
    }

    console.log("Saving profile payload:", formData || JSON.stringify(payload, null, 2));
    try {
      const config = formData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      const response = await api.put("/recruiter-profile", formData || payload, config);

      const updatedProfile = response.data?.profile;
      
      // Update global auth state to reflect changes in Navbar/Avatar
      const picToSync = updatedProfile?.img || data.profilePicture;
      updateUser({
        userName: data.name,
        picture: picToSync,
        img: picToSync
      });

      setEditing(false);
      setSaved(true);
      setProfilePhotoFile(null); // Clear the file after save
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving profile:", err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;

      // If profile doesn't exist yet (404) or conflict (409), try creating it
      if (status === 404 || status === 409) {
        try {
          const createConfig = formData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
          } : {};
          const createPayload = { ...payload, email: data.email || null };
          if (formData) formData.append('email', data.email || '');

          await api.post("/recruiter-profile", formData || createPayload, createConfig);
          setEditing(false);
          setSaved(true);
          setProfilePhotoFile(null);
          setTimeout(() => setSaved(false), 2500);
        } catch (createErr) {
          console.error("Error creating profile:", createErr);
          const createMsg = createErr.response?.data?.error || createErr.response?.data?.message || createErr.message;
          alert(`Failed to save profile: ${createMsg}`);
        }
      } else {
        alert(`Failed to save profile.\n\nServer error: ${serverMsg}`);
      }
    } finally {
      setSaving(false);
    }
  }

  /* Native Share API ─────────────────────────────────────────── */
  const handleShare = async () => {
    const userId = paramId || user?._id || user?.id || "";
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

  const handleUpload = (e) => {
    setUploading(true);
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setProfilePhotoFile(file);
      const r = new FileReader();
      r.onload = ev => { set("profilePicture", ev.target.result); setGallery(false); setUploading(false); };
      r.onerror = () => { alert("Upload failed."); setUploading(false); };
      r.readAsDataURL(file);
    } else { alert("Invalid image."); setUploading(false); }
  };

  /* ── Loading State ────────────────────────────────────────── */
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

  /* ── Error State ──────────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp{ from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
        .anim-up  { animation: fadeUp .45s ease both; }
        .anim-in  { animation: fadeIn .2s ease both; }
        .anim-modal { animation: slideUp .25s ease both; }
        .anim-spin { animation: spin .7s linear infinite; }
        .d100 { animation-delay:100ms; }
        .d180 { animation-delay:180ms; }
        .d260 { animation-delay:260ms; }
        .d340 { animation-delay:340ms; }
        .d420 { animation-delay:420ms; }
        .d500 { animation-delay:500ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-poppins">

        {/* ── Main Container ─────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-16">

          {/* ── Header Card ────────────────────────────────────── */}
          <div className="anim-up bg-white border border-slate-200 rounded-2xl shadow-lg px-6 py-5 relative z-10 flex flex-wrap items-center gap-5">

            {/* Avatar */}
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200 shrink-0 ${editing ? "cursor-pointer" : ""}`}
              onClick={() => editing && setGallery(true)}
            >
              <img src={data.profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {editing && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Ic d={ICONS.camera} size={22} />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="text-2xl font-bold text-slate-900 bg-blue-50 border-b-2 border-blue-500 rounded-t-lg px-2 py-1 w-full outline-none"
                    value={data.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Full Name"
                  />
                  {data.email && (
                    <div className="px-2 mt-1">
                      <span className="text-sm text-slate-400 font-medium inline-flex items-center gap-1.5">
                        <Ic d={ICONS.check} size={12} /> {data.email}
                        <span className="text-[10px] uppercase text-slate-300 tracking-wider">Immutable</span>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{data.name}</h1>
                  {data.email && <p className="text-sm text-slate-500 font-medium mt-1">{data.email}</p>}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <Ic d={ICONS.check} size={12} /> Saved
                </span>
              )}
              {shared && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                  <Ic d={ICONS.check} size={12} /> Copied!
                </span>
              )}

              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
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
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Ic d={ICONS.save} size={14} /> Save Changes
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
                    <Ic d={ICONS.share} size={14} /> Share
                  </button>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-all hover:-translate-y-px shadow-md"
                    >
                      <Ic d={ICONS.edit} size={14} /> Edit Profile
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Content Grid ─────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">

            {/* Left — Sections ──────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* About */}
              <div className="anim-up d100">
                <Section icon="about" label="About Me" accent="blue">
                  {editing ? (
                    <textarea
                      rows={6}
                      className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 outline-none resize-vertical transition-all"
                      value={data.description}
                      onChange={e => set("description", e.target.value)}
                      placeholder="Write your professional bio as a recruiter…"
                    />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {data.description || <em className="text-slate-400">No bio provided.</em>}
                    </p>
                  )}
                </Section>
              </div>

              {/* Professional Details */}
              <div className="anim-up d180">
                <Section icon="brief" label="Professional Details" accent="indigo">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company Information</h4>
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Ic d={ICONS.brief} size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Organization</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.company}
                                onChange={e => set("company", e.target.value)}
                                placeholder="Company Name"
                              />
                            ) : (
                              <p className="text-sm font-bold text-slate-800">{data.company || "Not set"}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <Ic d={ICONS.globe} size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Website</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.website}
                                onChange={e => set("website", e.target.value)}
                                placeholder="https://..."
                              />
                            ) : (
                              <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                {data.website || "Not set"}
                              </a>
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
                            <Ic d={ICONS.mapPin} size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Location</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-slate-800 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.location}
                                onChange={e => set("location", e.target.value)}
                                placeholder="City, Country"
                              />
                            ) : (
                              <p className="text-sm font-bold text-slate-800">{data.location || "Not set"}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <Ic d={ICONS.linkedin} size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">LinkedIn Profile</p>
                            {editing ? (
                              <input
                                className="text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded outline-none w-full"
                                value={data.linkedIn}
                                onChange={e => set("linkedIn", e.target.value)}
                                placeholder="linkedin.com/in/..."
                              />
                            ) : (
                              data.linkedIn ? (
                                <a href={data.linkedIn.startsWith('http') ? data.linkedIn : `https://${data.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                  View Profile
                                </a>
                              ) : (
                                <p className="text-sm font-bold text-slate-800">Not set</p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────── */}
            <div className="anim-up d500 flex flex-col gap-4">

              {/* Recruiter Stats */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6 border-b border-slate-100 pb-2">Hiring Performance</p>
                
                <div className="flex flex-col gap-6 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                      <Ic d={ICONS.brief} size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{data.jobsPosted || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Jobs Posted</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                      <Ic d={ICONS.check} size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{data.candidatesHired || 0}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Candidates Hired</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shadow-inner">
                      <Ic d={ICONS.heart} size={20} />
                    </div>
                    <div>
                      {editing ? (
                        <input
                          type="number"
                          min="0"
                          className="w-20 text-sm font-bold text-slate-900 bg-violet-50/50 border border-slate-200 rounded px-2 outline-none"
                          value={data.teamSize}
                          onChange={e => set("teamSize", Math.max(0, Number(e.target.value)))}
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

        {/* ── Gallery Modal ─────────────────────────────────────── */}
        {gallery && (
          <div
            className="anim-in fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setGallery(false)}
          >
            <div
              className="anim-modal bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Choose Profile Picture</h2>
                <button
                  onClick={() => setGallery(false)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
                >
                  <Ic d={ICONS.x} size={13} />
                </button>
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { set("profilePicture", img); setGallery(false); }}
                    className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${data.profilePicture === img ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-blue-300"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {data.profilePicture === img && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <Ic d={ICONS.check} size={16} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Upload zone */}
              <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all text-slate-400 hover:text-blue-500">
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                {uploading ? (
                  <div className="anim-spin w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full" />
                ) : (
                  <>
                    <Ic d={ICONS.upload} size={22} />
                    <span className="text-xs font-semibold">Upload image</span>
                    <span className="text-xs text-slate-400">PNG or JPG · max 5 MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Recruiter_Profile_view;