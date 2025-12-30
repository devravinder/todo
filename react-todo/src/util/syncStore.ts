import type { FileError } from "../hooks/state-hooks/useProject";
import { defaultConfig } from "./constants";
import {
  toAppData,
  toStoreData,
  type AppData,
  type StoreData,
} from "./converter";
import { FileHandler } from "./FileHandler";
import { MarkdownParser } from "./MarkdownParser";

export const writeToStore = async (
  tasks: Task[],
  config: TodoConfig,
  fileHandle: FileSystemFileHandle,
  format: FileFormat
) => {
  const storeData = toStoreData(tasks, config);

  const content =
    format === "md"
      ? MarkdownParser.toMarkdown(storeData as unknown as JSONObject)
      : JSON.stringify(storeData, null, 2);

  await FileHandler.write(fileHandle, content);
};

export type FileReadResult =
  | {
      data: AppData;
    }
  | { message: FileError };

export const readFromStore = async (
  fileHandle: FileSystemFileHandle,
  format: FileFormat
): Promise<FileReadResult> => {
  try {
    const content = await FileHandler.read(fileHandle);

    if (!content) return { data: { config: defaultConfig, tasks: [] } };

    const storeData = (
      format === "md" ? MarkdownParser.toJson(content) : JSON.parse(content)
    ) as StoreData;

    const data = toAppData(storeData);

    return { data };
  } catch (error) {
    // File might be deleted
    const err = error as { name: "NotFoundError" | string; message: string };
    if (err.name === "NotFoundError") {
      return { message: "NotFoundError" };
    }
    return { message: err.message as FileError };
  }
};
