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
    
    const user = JSON.parse(localStorage.getItem("githubUser"));

    const handleSignOut = () => {
      localStorage.clear();
      window.location.href = "/login";
    };
    const backendUrl = import.meta.env.VITE_API_URL;//ai-test-case-generator-backend.onrender.com
;
    // ⭐ Fetch files from GitHub when repo is selected
    const selectRepository = async (repo) => {
      setSelectedRepo(repo);
      try {
        const token = localStorage.getItem("authToken");


        const res = await fetch(
          `${backendUrl}/repo-files?owner=${repo.owner.login}&repo=${repo.name}&token=${token}`
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
 
   // Dashboard.jsx
const handleGenerate = async () => {
  setGenerating(true);
  setTestCases([]);
  try {
    const authToken = localStorage.getItem("authToken");
    const selectedFile = selectedFiles[0];
    
    // Detect language by file extension (pass to backend)
    const ext = selectedFile.split('.').pop();
    const language = {
      py: "python",
      js: "javascript",
      java: "java",
      c: "c",
      cpp: "cpp"
    }[ext] || "unknown";

    // Fetch file content (from backend)
    const res = await fetch(
      `${backendUrl}/file-content?owner=${selectedRepo.owner.login}&repo=${selectedRepo.name}&path=${selectedFile}&token=${authToken}`
    );
    if (!res.ok) throw new Error("Failed to fetch file content");
    const fileData = await res.json();

    // Decode base64 content if needed
    let codeContent = fileData.content;
    try {
      // Rough check if the content looks like base64
      if (/^[A-Za-z0-9+/=\r\n]+$/.test(codeContent)) {
        codeContent = atob(codeContent);
      }
    } catch (e) {
      // If decode fails, fallback to original content
      console.warn("Base64 decode failed, using original content");
    }

    console.log("Decoded file content preview:", codeContent.slice(0, 200));

    // Generate test cases (send language & code to backend)
    const response = await fetch(`${backendUrl}/generate-testcases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_content: codeContent,
        language,
        file_name: selectedFile,
      })
    });
    if (!response.ok) throw new Error("Failed to generate test cases");
    const testData = await response.json();
    console.log("Received testcases:", testData.testcases);

    setTestCases([
      {
        summary: selectedFile,
        description: testData.testcases || "No test case generated.",
        priority: "medium"
      }
    ]);
    setActiveTab("test-cases");
  } catch (err) {
    setTestCases([{
      summary: "Error",
      description: err.message,
      priority: "high"
    }]);
    setActiveTab("test-cases");
  } finally {
    setGenerating(false);
  }
};

 


    const handleGenerates = async () => {
  if (!selectedRepo || selectedFiles.length === 0) return;
  setGenerating(true);
  setTestCases([]);
  try {
    const authToken = localStorage.getItem("authToken");
    const filesWithContent = await Promise.all(
      selectedFiles.map(async (path) => {
        const res = await fetch(
          `${backendUrl}/file-content?owner=${selectedRepo.owner.login}&repo=${selectedRepo.name}&path=${path}&token=${authToken}`
        );
        if (!res.ok) {
          console.error(`Error fetching file content for ${path}: ${res.status} ${res.statusText}`);
          throw new Error("Failed to fetch file content from backend");
        }
        const data = await res.json();
        return { path, content: data.content };
      })
    );
    console.log("FilesWithContent:", filesWithContent);

    for (const fileObj of filesWithContent) {
      const response = await fetch(`${backendUrl}/generate-testcases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_content: fileObj.content,
          language: "python",
          prompt: "Generate test cases for the following code:"
        })
      });
      console.log("GenerateTestCases response:", response.status, response.statusText);
      if (!response.ok) {
        const errMsg = await response.text();
        console.error("Error from generate-testcases:", errMsg);
        throw new Error("Failed to generate test cases");
      }
      const data = await response.json();
      console.log("Generated test case for file:", fileObj.path, data);
      setTestCases((prev) => [
        ...prev,
        {
          summary: fileObj.path,
          description: data.testcases,
          priority: "medium"
        }
      ]);
    }
    setActiveTab("test-cases");
  } catch (err) {
    console.error(err);
    alert(`Error generating test cases: ${err.message}`);
  } finally {
    setGenerating(false);
  }
};



    const generateTestCode = async (testCase) => {
  setGenerating(true);
  try {
    const response = await fetch(`${backendUrl}/generate-testcode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary: testCase.summary, description: testCase.description }),
    });
    if (!response.ok) throw new Error("Failed to generate test code");
    const data = await response.json();
    
    setGeneratedTests((prev) => [
      ...prev,
      {
        filename: `${testCase.summary.replace(/\s+/g, "_")}.test.js`,
        framework: "Jest",
        content: data.generatedCode,    // This should be actual test code returned from backend
      },
    ]);
    
    setActiveTab("generated-code"); // Switch to show generated code tab
    
  } catch (error) {
    console.error(error);
  } finally {
    setGenerating(false);
  }
};

    // ⭐ Fix handleDownload
    const handleDownload = () => {
      alert("Downloading test code...");
    };

    // ⭐ Fix handleCreatePR
   const handleCreatePR = async () => {
  try {
    alert("Creating pull request...");
    
    const response = await fetch(`${backendUrl}/create-pr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repo_full_name: "your-username/your-repo",
        branch_name: `autogen-test-${Date.now()}`, // unique branch name
        file_path: generatedTests[0].filename,     // example: first file
        file_content: generatedTests[0].content,
        pr_title: "Add generated test code",
        pr_body: "This PR adds autogenerated test code.",
      }),
    });

    const data = await response.json();

    if (data.prUrl) {
      alert(`Pull request created successfully!\n\nView it here:\n${data.prUrl}`);
    } else {
      alert(`Failed to create PR: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    alert(`Error creating PR: ${error.message}`);
  }
};


    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} handleSignOut={handleSignOut} />
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
