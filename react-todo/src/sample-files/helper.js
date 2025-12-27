import fs from "fs";
import { MarkdownParser } from "../util/parser.js";


const toJson=(from="./todo.md" , to="./out.json")=>{
const md = fs.readFileSync(from, "utf-8");
const json = MarkdownParser.toJson(md);
fs.writeFileSync(to, JSON.stringify(json, null, 2));
}


const toMd=(from="./todo.json", to="./out.md")=>{
const json = JSON.parse(fs.readFileSync(from, "utf-8"))
const md = MarkdownParser.toMarkdown(json)
fs.writeFileSync(to, md);
}


// toMd("./todo.json","out.md")
toJson("./todo.md", "out.json")