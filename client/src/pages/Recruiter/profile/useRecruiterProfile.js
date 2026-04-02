import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContexts";
import api from "../../../api/api";

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
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=0f172a&color=fff&size=200`,
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
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "User")}&background=0f172a&color=fff&size=200`,
  };
};

export const useRecruiterProfile = (userProp) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const galleryImages = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=0f172a&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=2563eb&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=7c3aed&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=059669&color=fff&size=200`,
  ];

  const isOwnProfile =
    !paramId ||
    (currentUserId && profileOwnerId === currentUserId) ||
    (data.profileId && normalizeId(paramId) === normalizeId(data.profileId));

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

    setSaving(true);
    try {
      let response;
      let updatedProfile;

      if (profileExists) {
        const payload = mapStateToApi(false);
        response = await api.patch("/recruiter/profile", payload);
        updatedProfile = response.data?.data || response.data?.profile;
      } else {
        const payload = mapStateToApi(true);
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

  return {
    navigate,
    loading,
    error,
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
  };
};
