import fs from "fs";
import { MarkdownParser } from "../util/MarkdownParser";

/**
 * Convert Markdown → JSON
 */
export const toJson = (
  from: string = "./todo.md",
  to: string = "./out.json"
): void => {
  const md = fs.readFileSync(from, "utf-8");
  const json = MarkdownParser.toJson(md);

  fs.writeFileSync(to, JSON.stringify(json, null, 2));
};

/**
 * Convert JSON → Markdown
 */
export const toMd = (
  from: string = "./todo.json",
  to: string = "./out.md"
): void => {
  const json = JSON.parse(fs.readFileSync(from, "utf-8"));
  const md = MarkdownParser.toMarkdown(json);

  fs.writeFileSync(to, md);
};

// Example usage
// toMd("./todo.json", "./out.md");
toJson("./todo.md", "./out.json");
