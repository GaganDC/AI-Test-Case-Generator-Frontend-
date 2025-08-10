import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileCode, Loader2, Sparkles } from "lucide-react";
import { buildFileTree } from "@/utils/buildFileTree";
import FileTree from "./FileTree/FileTree";

export default function FileSelection({
  files = [],
  selectedFiles,
  onToggleFile,
  onGenerate,
  generating,
}) {
  // Convert flat list of files into folder tree
  const fileTree = buildFileTree(files);
  console.log("✅ onGenerate prop:", onGenerate);
console.log("✅ selectedFiles:", selectedFiles);



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5" />
            <span>Code Files</span>
          </div>
          <Button
            onClick={onGenerate}
            disabled={selectedFiles.length === 0 || generating}
            size="sm"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> Generate Test Cases
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Select files to generate test cases for ({selectedFiles.length}{" "}
          selected)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {fileTree && fileTree.length > 0 ? (
            <FileTree
              files={fileTree}
              selectedFiles={selectedFiles}
              onToggleFile={onToggleFile}
            />
          ) : (
            <p className="text-sm text-gray-500">No files to display.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
