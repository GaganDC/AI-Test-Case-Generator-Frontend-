import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";

function FileNode({ node, selectedFiles, onToggleFile }) {
  const [open, setOpen] = useState(false);

  if (node.type === "file") {
    return (
      <div className="flex items-center space-x-2 pl-4">
        <Checkbox
          id={node.path}
          checked={selectedFiles.includes(node.path)}
          onCheckedChange={(checked) => onToggleFile(node.path, checked)}
        />
        <File className="w-4 h-4 text-gray-500" />
        <label htmlFor={node.path} className="cursor-pointer">{node.name}</label>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Folder className="w-4 h-4 text-yellow-500" />
        <span>{node.name}</span>
      </div>
      {open && (
        <div className="ml-4">
          {node.children.map((child) => (
            <FileNode
              key={child.path}
              node={child}
              selectedFiles={selectedFiles}
              onToggleFile={onToggleFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ files, selectedFiles, onToggleFile }) {
  return (
    <div className="space-y-1">
      {files.map((node) => (
        <FileNode
          key={node.path || node.name}
          node={node}
          selectedFiles={selectedFiles}
          onToggleFile={onToggleFile}
        />
      ))}
    </div>
  );
}
