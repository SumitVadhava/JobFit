import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import GoogleOneTapLogin from './components/GoogleOneTapLogin'
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
import { useAuth } from './contexts/AuthContexts'
import User_Best_Resume_view from './pages/User/User_Best_Resume_view'
import Recruiter_CandidateProfile_view from './pages/User/Recruiter_CandidateProfile_view'
import { ToastContainer } from 'react-toastify'
import Recruiter_Posted_Jobs_view from './pages/Recruiter/Recruiter_Posted_Jobs_view'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './pages/Unauthorized'
import ApplyJob from './pages/User/User_ApplyJob_view'




function App() {
  const { user, token, role } = useAuth();
  const isLoggedIn = !!user && !!token;
  // const [selectedResume, setSelectedResume] = useState(null);

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
        userName: user.userName || user.name, // Add fallback to user.name
        email: user.email,
        sub: user._id || "", // Add user ID
        picture: user.picture || "", // Add default picture
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
          path='/user/dashboard'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <UserAnalytics />
            </ProtectedRoute>} />
        <Route
          path='/user/ats'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <AtsScreenBrackDown atsData={atsData} />
            </ProtectedRoute>} />
        <Route
          path='/user/job-search'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <JobSearch />
            </ProtectedRoute>} />
        <Route
          path='/user/resume'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <Resumes atsData={atsData} setAtsData={setAtsData} />
            </ProtectedRoute>} />
        <Route
          path='/user/saved-jobs'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <SavedJobs />
            </ProtectedRoute>} />
        <Route
          path='/user/best-resumes'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <User_Best_Resume_view />
            </ProtectedRoute>} />
        <Route
          path='/user/profile'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <Recruiter_CandidateProfile_view userProp={userProp} />
            </ProtectedRoute>} />

        <Route
          path='/user/apply/:jobId'
          element={
            <ProtectedRoute
              allowedRoles={['candidate']}
            >
              <ApplyJob />
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
          path="/recruiter/recruiter-analytics"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Analytics_view />
            </ProtectedRoute>} />
        <Route
          path="/recruiter/recruiter-postjob"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Post_view />
            </ProtectedRoute>} />
        <Route
          path="/recruiter/recruiter-candidates"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Candidates_view />
            </ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/recruiter/recruiter-postedjobs"
          element={
            <ProtectedRoute
              allowedRoles={['recruiter']}
            >
              <Recruiter_Posted_Jobs_view />
            </ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
      </Routes>
      {/* <GoogleOneTapLogin /> */}
    </>
  )
}

export default App

