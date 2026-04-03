import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
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
import AdminTestimonials from './pages/Admin/AdminTestimonials';
import Recruiter_Analytics_view from './pages/Recruiter/Recruiter_Analytics_view';
import Recruiter_Post_view from './pages/Recruiter/Recruiter_Post_view';
import Recruiter_Candidates_view from './pages/Recruiter/Recruiter_Candidates_view';
import Recruiter_History from './pages/Recruiter/Recruiter_History';
import { useAuth } from './contexts/AuthContexts'
import User_Best_Resume_view from './pages/User/User_Best_Resume_view'
import { ToastContainer } from 'react-toastify'
import Recruiter_Posted_Jobs_view from './pages/Recruiter/Recruiter_Posted_Jobs_view'
import ProtectedRoute from './components/ProtectedRoute'
import AboutUs from './pages/AboutUs'
import ContactSupport from './pages/ContactSupport'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import FeatureUserRegistration from './pages/FeatureUserRegistration'
import FeatureResumeMatching from './pages/FeatureResumeMatching'
import FeatureATSAnalytics from './pages/FeatureATSAnalytics'
import Recruiter_Profile_view from './pages/Recruiter/Recruiter_Profile_view'
import Candidate_Profile_View from './pages/User/Candidate_Profile_View'
import AppliedJobs from './pages/User/User_AppliedJobs_view'
import ErrorPage from './pages/ErrorPage'




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

  const location = useLocation();
  const isErrorPage = location.pathname.startsWith('/error/');


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
      {!isErrorPage && <Navbar userData={userProp} />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
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
          path='/candidate/applied-jobs'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <AppliedJobs />
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
              allowedRoles={['candidate']}
            >
              <Candidate_Profile_View userProp={userProp} />
            </ProtectedRoute>} />
        {/* Public route — shared profile viewable without login */}
        <Route
          path='/candidate/profile/:id'
          element={<Candidate_Profile_View userProp={userProp} />}
        />


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
          path='/admin/testimonials'
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            >
              <AdminTestimonials />
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
        <Route
          path='/recruiter/profile/:id'
          element={<Recruiter_Profile_view />}
        />



        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/features/user-registration" element={<FeatureUserRegistration />} />
        <Route path="/features/resume-matching" element={<FeatureResumeMatching />} />
        <Route path="/features/ats-analytics" element={<FeatureATSAnalytics />} />

        {/* ─── Error pages ─── */}
        {/* Navigate programmatically: navigate('/error/403'), navigate('/error/404'), etc. */}
        <Route path="/error/:code" element={<ErrorPage />} />

        {/* Catch-all — redirect to /error/404 so Navbar is hidden */}
        <Route path="*" element={<Navigate to="/error/404" replace />} />
      </Routes>
    </>
  )
}

export default App