import { Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import logo from "../../../public/generated-image.png"
export default function Header({ user, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  console.log(user);


  return (
    <header className="flex justify-between items-center p-4 border-b bg-white">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <img src={logo} className="h-12 w-auto" alt="AI Test Case Generator Logo" /> AI Test-Case Generator
      </h1>
      <div className="flex items-center gap-4">
        {/* Avatar + Welcome */}
        {user?.avatar_url && (
          <img
            src={user.avatar_url}
            alt="User avatar"
            className="w-8 h-8 rounded-full border"
          />
        )}
        <span className="text-sm text-gray-600"> Welcome, {user?.name || "Demo User"}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
