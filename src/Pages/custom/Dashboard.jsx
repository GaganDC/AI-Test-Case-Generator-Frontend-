import { useState } from "react";
import Header from "./Header";
import RepositorySidebar from "./RepositorySidebar";
import FileSelection from "./FileSelection";
import TestCases from "./TestCases";
import GeneratedCode from "./GeneratedCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [allRepoFiles, setAllRepoFiles] = useState([]); // ✅ store ALL files from repo
  const [selectedFiles, setSelectedFiles] = useState([]); // ✅ store only checked files
  const [testCases, setTestCases] = useState([]);
  const [generatedTests, setGeneratedTests] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generatedTestCases, setGeneratedTestCases] = useState([]);

  const repositories = JSON.parse(localStorage.getItem("repos")) || [];

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ⭐ Fetch files from GitHub when repo is selected
  const selectRepository = async (repo) => {
    setSelectedRepo(repo);
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `https://ai-test-case-generator-backend.onrender.com/repo-files?owner=${repo.owner.login}&repo=${repo.name}&token=${token}`
      );

      if (!res.ok) throw new Error("Failed to fetch repo files from backend");

      const files = await res.json();
      console.log("📂 Repo Files:", files);
      setAllRepoFiles(files); // ✅ keep the full list here
      setSelectedFiles([]); // logs the array once
    } catch (err) {
      console.error(err);
      setSelectedFiles([]);
    }
  };

  const [activeTab, setActiveTab] = useState("files"); // ✅ Track tab
const handleGenerate = async () => {
  let authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("⚠ No auth token found — cannot generate test cases");
    return;
  }
  if (!selectedRepo) {
    console.error("⚠ No repository selected!");
    return;
  }

  setGenerating(true);
  setTestCases([]);

  try {
    const payload = {
      token: authToken,
      owner: selectedRepo.owner.login,
      repo: selectedRepo.name,
      files: selectedFiles
    };

    console.log("📤 Sending to backend:", payload);

    const response = await fetch("https://ai-test-case-generator-backend.onrender.com/generate-testcases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate test cases: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const formattedCases = (data.testcases || []).map((tc) => ({
      summary: tc.file || "Untitled Test Case",
      description: tc.testContent || "",
      priority: "medium"
    }));

    setTestCases(formattedCases);
    setActiveTab("test-cases");
  } catch (error) {
    console.error("Error generating test cases:", error);
    alert(`Error: ${error.message}`);
  } finally {
    setGenerating(false);
  }
};



  const generateTestCode = (testCase) => {
    setGenerating(true);

    // Call backend to get generated code for this specific test case
    setTimeout(() => {
      setGeneratedTests((prev) => [
        ...prev,
        {
          filename: `${testCase.summary.replace(/\s+/g, "_")}.test.js`,
          framework: "Jest",
          content: `test('${testCase.summary}', () => { /* ${testCase.description} */ })`,
        },
      ]);
      setGenerating(false);
    }, 1000);
  };

  // ⭐ Fix handleDownload
  const handleDownload = () => {
    alert("Downloading test code...");
  };

  // ⭐ Fix handleCreatePR
  const handleCreatePR = () => {
    alert("Creating pull request...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <RepositorySidebar
              repositories={repositories}
              selectedRepo={selectedRepo}
              selectRepository={selectRepository} // ⭐ Updated
            />
          </div>

          <div className="lg:col-span-2">
            {selectedRepo ? (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <TabsList>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                  <TabsTrigger value="generated-code">
                    Generated Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="files">
                  <FileSelection
                    files={allRepoFiles}
                    selectedFiles={selectedFiles}
                    onToggleFile={(filePath, checked) => {
                      setSelectedFiles((prev) =>
                        checked
                          ? [...prev, filePath]
                          : prev.filter((p) => p !== filePath)
                      );
                    }}
                    onGenerate={handleGenerate}
                    generating={generating}
                  />
                </TabsContent>

                <TabsContent value="test-cases">
                  <TestCases
                    testCases={testCases}
                    generating={generating}
                    onGenerateCode={(testCase) => generateTestCode(testCase)}
                  />
                </TabsContent>

                <TabsContent value="generated-code">
                  <GeneratedCode
                    generatedTests={generatedTests}
                    downloadTests={handleDownload}
                    createPullRequest={handleCreatePR}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="p-8 text-center">
                Select a repository to begin.
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
