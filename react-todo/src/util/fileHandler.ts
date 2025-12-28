const MARKDOWN_FILE = "todo.md";
const JSON_FILE = "todo.json";

type FileType = "md" | "json";

export const getFileHandler = async (preferredFileType: FileType = "md") => {
  try {
    if (!("showDirectoryPicker" in window)) alert("Not Supported");

    const dirHandle = await window?.showDirectoryPicker();

    let hasTodoMd = false;
    let hasTodoJson = false;

    for await (const [name] of dirHandle.entries()) {
      if (name === MARKDOWN_FILE) hasTodoMd = true;
      if (name === JSON_FILE) hasTodoJson = true;

      if (hasTodoMd || hasTodoJson) break;
    }

    if (hasTodoMd || hasTodoJson) {
      return dirHandle.getFileHandle(hasTodoMd ? MARKDOWN_FILE : JSON_FILE, {
        create: true,
      });
    } else {
      const fileHandle = await dirHandle.getFileHandle(
        preferredFileType === "md" ? MARKDOWN_FILE : JSON_FILE,
        {
          create: true,
        }
      );
      return fileHandle;
    }

    // Create todo.md
  } catch (err) {
    const error = err as { name?: string };
    if (error?.name === "AbortError") {
      console.log("----");
    } else {
      console.error(error);
    }
  }
};

export const writeToFile = async (
  fileHandle: FileSystemFileHandle,
  content: string
) => {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
};
