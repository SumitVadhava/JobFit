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
        <Route path='/auth' element={<AuthPage userData={userProp} setUserData={setUserProp} isLogin={isLoggedIn} />} />
        <Route path='https://jobfit-delta.vercel.app/user/dashboard' element={<UserAnalytics />} />
        <Route path='/user/ats' element={<AtsScreenBrackDown atsData={atsData} />} />
        <Route path='/user/job-search' element={<JobSearch />} />
        <Route path='/user/resume' element={<Resumes atsData={atsData} setAtsData={setAtsData} />} />
        <Route path='/user/saved-jobs' element={<SavedJobs />} />
        <Route path='/user/best-resumes' element={<User_Best_Resume_view />} />
        <Route path='/user/profile' element={<Recruiter_CandidateProfile_view userProp={userProp} />} />
        <Route path='/admin/dashboard' element={<AdminAnalytics />} />
        <Route path='/admin/users' element={<JobFitUsersTable />} />
        <Route path='/admin/jobs' element={<JobDescription />} />
        <Route path='/admin/companies' element={<Companies />} />
        <Route path="/recruiter/recruiter-analytics" element={<Recruiter_Analytics_view />} />
        <Route path="/recruiter/recruiter-postjob" element={<Recruiter_Post_view />} />
        <Route path="/recruiter/recruiter-candidates" element={<Recruiter_Candidates_view />} />
      </Routes>
      {/* <GoogleOneTapLogin /> */}
    </>
  )
}

export default App

