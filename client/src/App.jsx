import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import HeroSection from './components/HeroSection'
import AuthPage from './pages/AuthPage'
import UserAnalytics from './pages/User/User_Analytics_view';
import AtsScreenBrackDown from './pages/User/User_Ats_view';
import JobSearch from './pages/User/User_JobSearch_view';
import SavedJobs from './pages/User/User_SavedJobs_view';
import Resumes from './pages/User/User_Resumes_View';
import AdminAnalytics from './pages/Admin/AdminAnalytics';
import JobFitUsersTable from './pages/Admin/JobFitUsersTable';
import JobDescription from './pages/Admin/JobDescription';
import Companies from './pages/Admin/Companies';
import Recruiter_Analytics_view from './pages/Recruiter/Recruiter_Analytics_view';
import Recruiter_Post_view from './pages/Recruiter/Recruiter_Post_view';
import Recruiter_Candidates_view from './pages/Recruiter/Recruiter_Candidates_view';
import Recruiter_History from './pages/Recruiter/Recruiter_History';
import { useAuth } from './contexts/AuthContexts'
import User_Best_Resume_view from './pages/User/User_Best_Resume_view'
import Recruiter_CandidateProfile_view from './pages/User/Recruiter_CandidateProfile_view'
import { ToastContainer } from 'react-toastify'
import Recruiter_Posted_Jobs_view from './pages/Recruiter/Recruiter_Posted_Jobs_view'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './pages/Unauthorized'
import AboutUs from './pages/AboutUs'
import ContactSupport from './pages/ContactSupport'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import FeatureUserRegistration from './pages/FeatureUserRegistration'
import FeatureResumeMatching from './pages/FeatureResumeMatching'
import FeatureATSAnalytics from './pages/FeatureATSAnalytics'
import Recruiter_Profile_view from './pages/Recruiter/Recruiter_Profile_view'




function App() {
  const { user, token, role } = useAuth();
  const isLoggedIn = !!user && !!token;
  const [userProp, setUserProp] = useState({
    userName: "",
    email: "",
    sub: "",
    picture: "",
    role: ""
  })

  useEffect(() => {
    if (isLoggedIn) {
      setUserProp({
        userName: user.userName || user.name,
        email: user.email,
        sub: user._id || "",
        picture: user.picture || "",
        role: role
      });
    }
  }, [isLoggedIn, user, role]);

  const [atsData, setAtsData] = useState(null);


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar userData={userProp} />
      <Routes>
        <Route path='/' element={<HeroSection />} />
        <Route path='/login' element={<AuthPage userData={userProp} setUserData={setUserProp} isLogin={isLoggedIn} />} />

        <Route
          path='/candidate/dashboard'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <UserAnalytics />
            </ProtectedRoute>} />
        <Route
          path='/candidate/ats-analyzer'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <AtsScreenBrackDown atsData={atsData} />
            </ProtectedRoute>} />
        <Route
          path='/candidate/job-search'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <JobSearch />
            </ProtectedRoute>} />
        <Route
          path='/candidate/ats'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <Resumes atsData={atsData} setAtsData={setAtsData} />
            </ProtectedRoute>} />
        <Route
          path='/candidate/saved-jobs'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <SavedJobs />
            </ProtectedRoute>} />
        <Route
          path='/candidate/best-resumes'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <User_Best_Resume_view />
            </ProtectedRoute>} />
        <Route
          path='/candidate/profile'
          element={
            <ProtectedRoute
              allowedRoles={['candidate', 'recruiter']}
            >
              <Recruiter_CandidateProfile_view userProp={userProp} />
            </ProtectedRoute>} />


        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <AdminAnalytics />
            </ProtectedRoute>} />
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <JobFitUsersTable />
            </ProtectedRoute>} />
        <Route
          path='/admin/jobs'
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <JobDescription />
            </ProtectedRoute>} />
        <Route
          path='/admin/companies'
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <Companies />
            </ProtectedRoute>} />


        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Analytics_view />
            </ProtectedRoute>} />
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Post_view />
            </ProtectedRoute>} />
        <Route
          path="/recruiter/candidates"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Candidates_view />
            </ProtectedRoute>} />

        <Route
          path="/recruiter/history"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_History />
            </ProtectedRoute>} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/recruiter/postedjobs"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Posted_Jobs_view />
            </ProtectedRoute>} />

        <Route
          path='/recruiter/profile'
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Profile_view />
            </ProtectedRoute>}
        />



        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/features/user-registration" element={<FeatureUserRegistration />} />
        <Route path="/features/resume-matching" element={<FeatureResumeMatching />} />
        <Route path="/features/ats-analytics" element={<FeatureATSAnalytics />} />
      </Routes>
    </>
  )
}

export default App