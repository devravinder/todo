import { toAppData, toStoreData, type StoreData } from "./converter";
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

export const readFromStore = async (
  fileHandle: FileSystemFileHandle,
  format: FileFormat
) => {
  const content = await FileHandler.read(fileHandle);

  const storeData = (
    format === "md" ? MarkdownParser.toJson(content) : JSON.parse(content)
  ) as StoreData;

  const appData = toAppData(storeData);

  return appData;
};
