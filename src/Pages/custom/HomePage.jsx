import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Github, FileCode, Sparkles, Download, GitPullRequest, Loader2, User, Copy } from "lucide-react";

// Mock data
const mockRepositories = [
  {
    id: 1,
    name: "react-dashboard",
    description: "A modern React dashboard with TypeScript",
    language: "TypeScript",
  },
  {
    id: 2,
    name: "python-api",
    description: "RESTful API built with FastAPI",
    language: "Python",
  },
  {
    id: 3,
    name: "vue-ecommerce",
    description: "E-commerce platform built with Vue.js",
    language: "JavaScript",
  },
  {
    id: 4,
    name: "node-microservice",
    description: "Microservice architecture with Node.js",
    language: "JavaScript",
  },
];

const mockFiles = [
  { name: "UserService.ts", path: "src/services/UserService.ts" },
  { name: "AuthController.ts", path: "src/controllers/AuthController.ts" },
  { name: "DatabaseHelper.ts", path: "src/utils/DatabaseHelper.ts" },
  { name: "ValidationUtils.ts", path: "src/utils/ValidationUtils.ts" },
  { name: "PaymentProcessor.ts", path: "src/services/PaymentProcessor.ts" },
  { name: "EmailService.ts", path: "src/services/EmailService.ts" },
];

const mockTestCases = [
  {
    summary: "User Authentication Flow",
    description: "Test complete user authentication including login, logout, and token validation",
    priority: "high",
  },
  {
    summary: "Payment Processing Edge Cases",
    description: "Test payment processing with invalid cards, network failures, and timeout scenarios",
    priority: "high",
  },
  {
    summary: "Email Service Integration",
    description: "Test email sending functionality with various templates and error handling",
    priority: "medium",
  },
  {
    summary: "Database Connection Pooling",
    description: "Test database connection management under high load conditions",
    priority: "medium",
  },
  {
    summary: "Input Validation Boundary Tests",
    description: "Test input validation with edge cases, malformed data, and security vulnerabilities",
    priority: "low",
  },
];

const mockGeneratedTest = {
  filename: "user_authentication_flow.test.js",
  framework: "Jest",
  content: `import { AuthController } from '../src/controllers/AuthController';

import { UserService } from '../src/services/UserService';

describe('User Authentication Flow', () => {
  let authController;
  let userService;

  beforeEach(() => {
    userService = new UserService();
    authController = new AuthController(userService);
  });

  test('should authenticate user with valid credentials', async () => {
    const mockUser = { 
      id: 1, 
      email: 'test@example.com', 
      password: 'hashedPassword' 
    };
    
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(userService, 'validatePassword').mockResolvedValue(true);

    const result = await authController.login('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  test('should reject authentication with invalid credentials', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

    const result = await authController.login('invalid@example.com', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
    expect(result.token).toBeUndefined();
  });

  test('should handle token validation correctly', async () => {
    const validToken = 'valid-jwt-token';
    const mockUser = { id: 1, email: 'test@example.com' };
    
    jest.spyOn(authController, 'verifyToken').mockResolvedValue(mockUser);

    const result = await authController.validateToken(validToken);

    expect(result.valid).toBe(true);
    expect(result.user).toEqual(mockUser);
  });
});`,
};

// Code Block Component
function CodeBlock({ code, filename }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-mono">{filename}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-96">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </ScrollArea>
      {copied && (
        <div className="absolute top-2 right-12 bg-green-600 text-white px-2 py-1 rounded text-xs">Copied!</div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [generatedTests, setGeneratedTests] = useState([]);
  const [generating, setGenerating] = useState(false);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setSelectedRepo(null);
    setSelectedFiles([]);
    setTestCases([]);
    setGeneratedTests([]);
  };

  const selectRepository = (repo) => {
    setSelectedRepo(repo);
    setSelectedFiles([]);
    setTestCases([]);
    setGeneratedTests([]);
  };

  const generateTestCases = () => {
    if (selectedFiles.length === 0) return;

    setGenerating(true);
    setTimeout(() => {
      setTestCases(mockTestCases);
      setGenerating(false);
    }, 2000);
  };

  const generateTestCode = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedTests((prev) => [...prev, mockGeneratedTest]);
      setGenerating(false);
    }, 3000);
  };

  const downloadTests = () => {
    alert("Tests downloaded! (Demo functionality)");
  };

  const createPullRequest = () => {
    alert("Pull request created! (Demo functionality)");
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Test Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Welcome, Demo User</span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repository Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <span>Repositories</span>
                </CardTitle>
                <CardDescription>Select a repository to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {mockRepositories.map((repo) => (
                      <div
                        key={repo.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRepo?.id === repo.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => selectRepository(repo)}
                      >
                        <div className="font-medium text-sm">{repo.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{repo.description}</div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {repo.language}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* File Selection and Results */}
          <div className="lg:col-span-2">
            {selectedRepo ? (
              <Tabs defaultValue="files" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                  <TabsTrigger value="generated-code">Generated Code</TabsTrigger>
                </TabsList>

                <TabsContent value="files">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileCode className="w-5 h-5" />
                          <span>Code Files</span>
                        </div>
                        <Button
                          onClick={generateTestCases}
                          disabled={selectedFiles.length === 0 || generating}
                          size="sm"
                        >
                          {generating ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          Generate Test Cases
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Select files to generate test cases for ({selectedFiles.length} selected)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          {mockFiles.map((file) => (
                            <div key={file.path} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                              <Checkbox
                                id={file.path}
                                checked={selectedFiles.includes(file.path)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedFiles((prev) => [...prev, file.path]);
                                  } else {
                                    setSelectedFiles((prev) => prev.filter((f) => f !== file.path));
                                  }
                                }}
                              />
                              <label htmlFor={file.path} className="text-sm font-medium cursor-pointer flex-1">
                                {file.name}
                              </label>
                              <Badge variant="outline" className="text-xs">
                                {file.path.split(".").pop()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="test-cases">
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Test Cases</CardTitle>
                      <CardDescription>AI-generated test case suggestions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {testCases.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No test cases generated yet. Select files and click "Generate Test Cases".
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {testCases.map((testCase, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{testCase.summary}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      testCase.priority === "high"
                                        ? "destructive"
                                        : testCase.priority === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                  >
                                    {testCase.priority}
                                  </Badge>
                                  <Button size="sm" onClick={generateTestCode} disabled={generating}>
                                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Code"}
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{testCase.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="generated-code">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Generated Test Code</span>
                        {generatedTests.length > 0 && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={downloadTests}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" onClick={createPullRequest}>
                              <GitPullRequest className="w-4 h-4 mr-2" />
                              Create PR
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription>Ready-to-use test code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {generatedTests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No test code generated yet. Generate test cases first, then click "Generate Code".
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {generatedTests.map((test, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium">{test.filename}</h3>
                                <Badge variant="outline">{test.framework}</Badge>
                              </div>
                              <CodeBlock code={test.content} filename={test.filename} />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Repository</h3>
                    <p className="text-gray-500">Choose a repository from the left sidebar to get started</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}