// src/components/LoginPage.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sparkles, Github } from "lucide-react";

export default function LoginPage() {

  const backendUrl = import.meta.env.VITE_API_URL;
  const handleGitHubLogin = () => {
    window.location.href = `${backendUrl}/github/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">AI Test Case Generator</CardTitle>
          <CardDescription>
            Generate intelligent test cases for your GitHub repositories using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGitHubLogin}
            className="w-full bg-black hover:bg-gray-900 text-white"
            size="lg"
          >
            <Github className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            * This is a UI demo – no actual authentication required
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
