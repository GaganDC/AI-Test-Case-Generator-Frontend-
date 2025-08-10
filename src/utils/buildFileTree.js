// utils/buildFileTree.js
export function buildFileTree(files) {
  const root = [];

  const getFolder = (parts, currentLevel) => {
    if (parts.length === 0) return currentLevel;

    const folderName = parts[0];
    let folder = currentLevel.find(
      (item) => item.type === "folder" && item.name === folderName
    );

    if (!folder) {
      folder = { name: folderName, type: "folder", children: [] };
      currentLevel.push(folder);
    }

    return getFolder(parts.slice(1), folder.children);
  };

  files.forEach((file) => {
    const parts = file.path.split("/");

    if (parts.length === 1) {
      // Top-level file
      root.push({ name: file.name, type: "file", path: file.path });
    } else {
      // Nested file
      const fileName = parts.pop();
      const folderLevel = getFolder(parts, root);
      folderLevel.push({ name: fileName, type: "file", path: file.path });
    }
  });

  return root;
}
