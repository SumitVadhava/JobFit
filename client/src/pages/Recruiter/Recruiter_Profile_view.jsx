import React from "react";
import { RecruiterSkeletonProfilePage } from "../../components/recruiter/RecruiterSkeletons";
import RecruiterProfileViewContent from "./profile/RecruiterProfileViewContent";
import { useRecruiterProfile } from "./profile/useRecruiterProfile";

const Recruiter_Profile_view = ({ userProp }) => {
  const profile = useRecruiterProfile(userProp);

  if (profile.loading) {
    return <RecruiterSkeletonProfilePage />;
  }

  if (profile.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-4">{profile.error}</p>
          <button
            onClick={() => profile.navigate(-1)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <RecruiterProfileViewContent {...profile} />;
};

export default Recruiter_Profile_view;
