import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/AuthContexts.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="400262025320-uej02dbe3n3o4msl6l0iam4sms84umil.apps.googleusercontent.com">
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
