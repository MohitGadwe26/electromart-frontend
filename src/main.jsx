import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Get client ID from environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error("Google Client ID is missing! Please add VITE_GOOGLE_CLIENT_ID to your .env file");
}

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={googleClientId || ""}>
    <App />
  </GoogleOAuthProvider>
);