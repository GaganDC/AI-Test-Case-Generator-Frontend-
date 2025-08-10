import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GitHubCallback from "./Pages/custom/GitHubCallback";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./Pages/custom/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/github/callback" element={<GitHubCallback />} />
         <Route path="/dashboard" element={<Dashboard />} /> 
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
