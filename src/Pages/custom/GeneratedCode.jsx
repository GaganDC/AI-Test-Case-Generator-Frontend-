import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, GitPullRequest } from "lucide-react";
import CodeBlock from "./CodeBlock"; // You’ll need a CodeBlock component

export default function GeneratedCode({ generatedTests, downloadTests, createPullRequest }) {
  return (
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
  );
}
