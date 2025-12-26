import fs from "fs";
import { MarkdownParser } from "../util/parser.js";
/* 
const md = fs.readFileSync("./todo.md", "utf-8");
const json = MarkdownParser.toJson(md);
fs.writeFileSync("./todo.json", JSON.stringify(json, null, 2));


 */

const json = JSON.parse(fs.readFileSync("./todo.json", "utf-8"))
const md = MarkdownParser.toMarkdown(json)
fs.writeFileSync("./out.md", md);