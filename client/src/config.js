const PRODUCTION_API = "https://chat-app-5suh.onrender.com";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD ? PRODUCTION_API : "http://localhost:5000");
