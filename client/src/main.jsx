import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import AdminAnalytics from './components/AdminAnalytics .jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import RoleSelector from './pages/RoleSelector.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from './pages/AuthForm.jsx';
import ResumeAnalysisReport from './components/ResumeAnalysisReport.jsx';
import AuthProvider from './contexts/AuthContexts.jsx';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="436675208249-cm6q15nhrqrr54eol7vrnaqih1bsr5ot.apps.googleusercontent.com" >
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    </BrowserRouter>
  </GoogleOAuthProvider>,
)
