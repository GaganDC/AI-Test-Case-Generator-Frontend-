import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const called = useRef(false); // prevent duplicate calls

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    if (code) {
      fetch(`https://ai-test-case-generator-backend.onrender.com/github/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.access_token) {
            setError("No access token received");
            return;
          }

          console.log("🔑 Access Token:", data.access_token);
          console.log("✅ GitHub User:", data.user);
          console.log("📦 GitHub Repositories:", data.repos);

          // ✅ Store using the SAME key that handleGenerate expects
          localStorage.setItem("authToken", data.access_token);
          localStorage.setItem("githubUser", JSON.stringify(data.user));
          localStorage.setItem("repos", JSON.stringify(data.repos));

          // Redirect to dashboard
          navigate("/dashboard", { replace: true });
        })
        .catch((err) => {
          console.error("GitHub OAuth Error:", err);
          setError("Failed to sign in with GitHub");
        });
    } else {
      setError("No OAuth code found in URL");
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p className="text-lg font-semibold">⚠️ Login Failed</p>
        <p>{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-500 underline"
        >
          Go back to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p>Signing you in with GitHub...</p>
      </div>
    </div>
  );
}
