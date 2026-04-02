import { useGoogleOneTapLogin } from '@react-oauth/google'
import api from '../api/api'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'

const GoogleOneTapLogin = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user && !!token;

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (isLoggedIn) return;

      try {
        const { credential } = credentialResponse;
        
        const response = await api.post("/auth/google-login", { 
          id_token: credential,
          role: "candidate" // default role for one-tap
        });

        if (response.data.error) {
          toast.error(response.data.message || "Google Login Failed");
          return;
        }

        const { token: generatedToken } = response.data.data;
        login(generatedToken);

        const decodedToken = jwtDecode(generatedToken);
        const userRole = decodedToken.role;

        toast.success("Google Login Successful!");
        
        setTimeout(() => {
          if (userRole === "admin") navigate("/admin/dashboard");
          else if (userRole === "recruiter") navigate("/recruiter/dashboard");
          else navigate("/candidate/dashboard");
        }, 1200);

      } catch (err) {
        console.error("One tap login failed:", err);
      }
    },
    onError: () => {
      console.log("One Tap Login Failed");
    },
  });

  return null;
};

export default GoogleOneTapLogin
