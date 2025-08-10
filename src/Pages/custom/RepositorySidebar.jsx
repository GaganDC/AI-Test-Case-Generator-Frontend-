import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
export default function RepositorySidebar({ repositories, selectedRepo, selectRepository }) {
 
  return (
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
            {repositories.map((repo) => (
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
  );
}
