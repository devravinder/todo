const MARKDOWN_FILE = "todo.md";
const JSON_FILE = "todo.json";

export type FileHandleResult =
  | {
      handle: FileSystemFileHandle;
    }
  | { message: string };

const getHandle = async (
  fileFormat: FileFormat = "md"
): Promise<FileHandleResult> => {
  try {
    if (!("showDirectoryPicker" in window))
      return { message: "Broser won't support, try chnage seetings" };

    const dirHandle = await window?.showDirectoryPicker();

    let hasTodoMd = false;
    let hasTodoJson = false;

    for await (const [name] of dirHandle.entries()) {
      if (name === MARKDOWN_FILE) hasTodoMd = true;
      if (name === JSON_FILE) hasTodoJson = true;
    }

    if (hasTodoMd || hasTodoJson) {
      const handle = await dirHandle.getFileHandle(
        hasTodoMd ? MARKDOWN_FILE : JSON_FILE,
        {
          create: true,
        }
      );

      return { handle };
    } else {
      const handle = await dirHandle.getFileHandle(
        fileFormat === "md" ? MARKDOWN_FILE : JSON_FILE,
        {
          create: true,
        }
      );
      return { handle };
    }
  } catch (error) {
    const err = error as { name: "AbortError" | string; message: string };
    if (err.name === "AbortError") {
      return { message: "Abortted" };
    }
    return { message: err.message };
  }
};

const write = async (fileHandle: FileSystemFileHandle, content: string) => {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
};

const read = async (fileHandle: FileSystemFileHandle): Promise<string> => {
  const file = await fileHandle.getFile();
  const content = await file.text();
  return content;
};

export const FileHandler = { getHandle, write, read };
