/* 
Note:- 
1. Headings will be converted as keys (sub-heading as nested keys)
2. properties should be key-value or list
   1. if nested property is required make a sub-heading
   2. after key delimiter space is mandatory
      - eg:
          1. assignedTo: ravinder -> valid
          2. assignedTo:ravinder -> invalid
*/

type JSONObject = {
  [key: string]: string | string[] | JSONObject;
};

const HEADER_REGEX = /^(#{1,6})\s+(.*)$/;
const PROPERTY_PREFIX = "- ";
const PROPERTY_DELIMITER = ": ";

// Creates or gets nested object reference
const getOrCreateDeepRef = (
  root: JSONObject,
  headingStack: string[]
): JSONObject => {
  return headingStack.reduce<JSONObject>((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key] as JSONObject;
  }, root);
};

const getRef = (root: JSONObject, headingStack: string[]): JSONObject => {
  return headingStack.reduce<JSONObject>((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key] as JSONObject;
  }, root);
};

export const toJson = (md: string): JSONObject => {
  const lines = md
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const root: JSONObject = {};
  let headingStack: string[] = [];
  let currentRef: JSONObject | string[] | null = null;

  for (const line of lines) {
    const headerMatch = line.match(HEADER_REGEX);

    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();

      headingStack[level - 1] = title;
      headingStack = headingStack.slice(0, level);

      currentRef = getOrCreateDeepRef(root, headingStack);
    } else if (line.startsWith(PROPERTY_PREFIX)) {
      const [key, value] = line
        .replace(PROPERTY_PREFIX, "")
        .split(PROPERTY_DELIMITER);

      if (value !== undefined) {
        (currentRef as JSONObject)[key] = value;
      } else {
        if (!Array.isArray(currentRef)) {
          const parentPath = headingStack.slice(0, -1);
          const lastKey = headingStack.at(-1)!;

          const parentRef = getRef(root, parentPath);
          parentRef[lastKey] = [];
          currentRef = parentRef[lastKey] as string[];
        }

        (currentRef as string[]).push(key);
      }
    }
  }

  return root;
};

// Utility to sort keys
const keys = (obj: JSONObject): string[] => {
  const stringValues: string[] = [];
  const arrayValues: string[] = [];
  const objectValues: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      arrayValues.push(key);
    } else if (value !== null && typeof value === "object") {
      objectValues.push(key);
    } else {
      stringValues.push(key);
    }
  }

  return [...stringValues, ...arrayValues, ...objectValues];
};

export const toMarkdown = (
  obj: JSONObject,
  depth: number = 1
): string => {
  let md = "";

  for (const key of keys(obj)) {
    const value = obj[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      md += `\n${"#".repeat(depth)} ${key}\n`;

      const firstValue = Object.values(value)[0];
      if (Array.isArray(value) || typeof firstValue === "string") {
        md += `\n`;
      }

      md += toMarkdown(value, depth + 1);
    } else if (value) {
      const isIndex = Number.isInteger(Number(key));
      md += `- ${isIndex ? "" : key + ": "}${value}\n`;
    }
  }

  return md;
};

/**
 * Markdown Parser Utility
 */
export const MarkdownParser = {
  toJson,
  toMarkdown,
};
