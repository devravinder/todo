import type { FileError } from "../hooks/state-hooks/useProject";

const MARKDOWN_FILE = "todo.md";
const JSON_FILE = "todo.json";

export type FileHandleResult =
  | {
      handle: FileSystemFileHandle;
    }
  | { message: FileError };

const getHandle = async (
  fileFormat: FileFormat = "md"
): Promise<FileHandleResult> => {
  try {
    if (!("showDirectoryPicker" in window))
      return { message: "BrowserNotSupports" };

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
      return { message: "AbortError" };
    }
    return { message: err.message as FileError };
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
