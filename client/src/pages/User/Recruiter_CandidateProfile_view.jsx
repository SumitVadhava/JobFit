import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserImage from '../../assets/user.png'

const Recruiter_CandidateProfile_view = ({ userProp }) => {
  const initialUserData = {
    name: userProp?.userName || "User", // Add fallback value
    resumeSummary: "",
    experience: [],
    education: [],
    skills: [],
    atsScore: 0,
    profilePicture: userProp?.picture || UserImage
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const galleryImages = ["https://via.placeholder.com/150?text=Image+1"];

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...userData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setUserData({ ...userData, experience: updatedExperience });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...userData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setUserData({ ...userData, education: updatedEducation });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...userData.skills];
    updatedSkills[index] = value;
    setUserData({ ...userData, skills: updatedSkills });
  };

  const addSkill = () => {
    setUserData({ ...userData, skills: [...userData.skills, ""] });
  };

  const removeSkill = (index) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setUserData({
      ...userData,
      experience: [
        ...userData.experience,
        { title: "", date: "", company: "" },
      ],
    });
  };

  const addEducation = () => {
    setUserData({
      ...userData,
      education: [
        ...userData.education,
        { degree: "", date: "", institution: "" },
      ],
    });
  };

  const handleSave = () => {
    if (!userData.name.trim()) {
      alert("Name is required");
      return;
    }
    console.log(JSON.stringify(userData, null, 2));
    setIsEditing(false);
  };

  const selectProfilePicture = (imageUrl) => {
    setUserData({ ...userData, profilePicture: imageUrl });
    setIsGalleryOpen(false);
  };

  const handleImageUpload = (event) => {
    setIsUploading(true);
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({ ...userData, profilePicture: e.target.result });
        setIsGalleryOpen(false);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Error reading image file. Please try another image.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (e.g., PNG, JPEG).");
      setIsUploading(false);
    }
  };

  // Add useEffect to update userData when userProp changes
  useEffect(() => {
    if (userProp) {
      setUserData(prev => ({
        ...prev,
        name: userProp.userName || "User",
        profilePicture: userProp.picture || UserImage
      }));
    }
  }, [userProp]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex grow flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 justify-center py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Candidate Profile
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Review and edit the candidate's profile and resume.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-10 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200 px-4"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <div
                    className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32 cursor-pointer hover:opacity-80 transition duration-200"
                    style={{
                      backgroundImage: `url(${ userData.profilePicture })`,
                    }}
                    onClick={() => setIsGalleryOpen(true)}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 rounded-full pointer-events-none">
                      <svg
                        className="w-6 h-6 mt-1 text-white opacity-80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-center sm:text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-xl sm:text-2xl font-bold text-gray-900 border rounded-lg p-2"
                      />
                    ) : (
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {userData.name}
                      </h2>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <Section title="ABOUT ME">
                {isEditing ? (
                  <textarea
                    value={userData.resumeSummary}
                    onChange={(e) =>
                      handleInputChange("resumeSummary", e.target.value)
                    }
                    className="w-full min-h-36 rounded-lg border border-gray-300 p-4 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    placeholder="Enter resume summary"
                  />
                ) : (
                  <p className="text-gray-700 text-sm sm:text-base">
                    {userData.resumeSummary || "No summary provided"}
                  </p>
                )}
              </Section>

              {/* Experience Section */}
              <Section title="Experience">
                {userData.experience.length === 0 && !isEditing ? (
                  <p className="text-gray-700 text-sm sm:text-base">
                    No experience provided
                  </p>
                ) : (
                  userData.experience.map((exp, index) => (
                    <Experience
                      key={index}
                      title={exp.title}
                      date={exp.date}
                      company={exp.company}
                      isEditing={isEditing}
                      onChange={(field, value) =>
                        handleExperienceChange(index, field, value)
                      }
                    />
                  ))
                )}

                {isEditing && (
                  <button
                    onClick={addExperience}
                    className="mt-3 h-8 bg-purple-600 text-white font-semibold rounded-lg px-4 hover:bg-purple-700 transition duration-200"
                  >
                    Add Experience
                  </button>
                )}
              </Section>

              {/* Education Section */}
              <Section title="Education">
                {userData.education.length === 0 && !isEditing ? (
                  <p className="text-gray-700 text-sm sm:text-base">
                    No education provided
                  </p>
                ) : (
                  userData.education.map((edu, index) => (
                    <Experience
                      key={index}
                      title={edu.degree}
                      date={edu.date}
                      company={edu.institution}
                      isEditing={isEditing}
                      onChange={(field, value) =>
                        handleEducationChange(index, field, value)
                      }
                    />
                  ))
                )}
                {isEditing && (
                  <button
                    onClick={addEducation}
                    className="mt-3 h-8 bg-purple-600 text-white font-semibold rounded-lg px-4 hover:bg-purple-700 transition duration-200"
                  >
                    Add Education
                  </button>
                )}
              </Section>

              {/* Skills Section */}
              <Section title="Skills">
                {userData.skills.length === 0 && !isEditing ? (
                  <p className="text-gray-700 text-sm sm:text-base">
                    No skills provided
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <SkillBadge
                        key={index}
                        label={skill}
                        isEditing={isEditing}
                        onChange={(value) => handleSkillChange(index, value)}
                        onRemove={() => removeSkill(index)}
                      />
                    ))}
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={addSkill}
                    className="mt-3 h-8 flex items-center justify-center bg-purple-600 text-white font-semibold rounded-lg px-4 hover:bg-purple-700 transition duration-200"
                  >
                    Add Skill
                  </button>
                )}
              </Section>

              {isEditing && (
                <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
                  <button
                    onClick={handleSave}
                    className="w-full h-10 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-96 space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
                <Card
                  title="ATS Score"
                  value={userData.atsScore}
                  isEditing={isEditing}
                  onChange={(value) =>
                    handleInputChange("atsScore", parseInt(value) || 0)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-[600px] w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Select Profile Picture
              </h2>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-gray-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition duration-200"
                  onClick={() => selectProfilePicture(image)}
                  />
                  {userData.profilePicture === image && (
                    <div className="absolute inset-0 border-4 border-purple-600 rounded-lg"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-gray-900 font-semibold">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border rounded-lg p-2 text-sm"
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-gray-600">Uploading...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pb-3">
      {title}
    </h2>
    <div>{children}</div>
  </div>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Experience = ({ title, date, company, isEditing, onChange }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-3 transition-transform hover:scale-[1.02] duration-200">
    {isEditing ? (
      <>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          className="text-base font-semibold text-gray-900 border rounded-lg p-2 w-full mb-2"
          placeholder="Degree or Job Title"
        />
        <input
          type="text"
          value={date}
          onChange={(e) => onChange("date", e.target.value)}
          className="text-gray-600 text-sm border rounded-lg p-2 w-full mb-2"
          placeholder="Date"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => onChange("company", e.target.value)}
          className="text-gray-600 text-sm border rounded-lg p-2 w-full"
          placeholder="Company or Institution"
        />
      </>
    ) : (
      <>
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="text-gray-600 text-sm">{date}</p>
        <p className="text-gray-600 text-sm">{company}</p>
      </>
    )}
  </div>
);

Experience.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const SkillBadge = ({ label, isEditing, onChange, onRemove }) => (
  <div className="h-8 flex items-center justify-center bg-gray-100 px-4 rounded-lg shadow-sm text-sm font-semibold text-gray-900 hover:bg-purple-100 transition duration-200">
    {isEditing ? (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-semibold text-gray-900 border rounded-lg p-1"
          placeholder="Skill"
        />
        <button onClick={onRemove} className="text-red-600 hover:text-red-800">
          ✕
        </button>
      </div>
    ) : (
      label
    )}
  </div>
);

SkillBadge.propTypes = {
  label: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const Card = ({ title, value, isEditing, onChange }) => (
  <div className="p-6 bg-gray-50 rounded-lg shadow-sm text-center">
    <p className="text-base font-semibold text-gray-900">{title}</p>
    {isEditing ? (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-2xl font-bold text-purple-600 border rounded-lg p-2 mt-2 w-full"
        min="0"
        max="100"
      />
    ) : (
      <p className="text-2xl font-bold text-purple-600">{value}</p>
    )}
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Recruiter_CandidateProfile_view;