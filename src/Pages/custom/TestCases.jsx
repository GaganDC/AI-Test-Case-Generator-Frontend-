import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TestCases({ testCases, onGenerateCode, generating }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Test Cases</CardTitle>
        <CardDescription>AI-generated test case suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        {testCases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No test cases generated yet. Select files and click "Generate Test
            Cases".
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
                    <Button
                      size="sm"
                      onClick={() => onGenerateCode(testCase)}
                      disabled={generating}
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Generate Code"
                      )}
                    </Button>
                  </div>
                </div>
                <pre
                  className="text-sm text-gray-600 bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap"
                  style={{ maxHeight: "400px", fontFamily: "monospace" }}
                >
                  {testCase.description}
                </pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
