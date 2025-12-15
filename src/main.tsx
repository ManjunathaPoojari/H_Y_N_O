
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "332384405083-l7bic8ahlm07tigh6k0rpqme0915ikog.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
