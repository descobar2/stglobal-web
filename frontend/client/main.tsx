import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./global.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.error("Missing VITE_GOOGLE_CLIENT_ID. Please set VITE_GOOGLE_CLIENT_ID in frontend/.env and restart the dev server.");
} else {
  console.log("VITE_GOOGLE_CLIENT_ID:", clientId);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId ?? ""}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
