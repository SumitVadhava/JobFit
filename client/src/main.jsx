import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/AuthContexts.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="436675208249-cm6q15nhrqrr54eol7vrnaqih1bsr5ot.apps.googleusercontent.com">
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
