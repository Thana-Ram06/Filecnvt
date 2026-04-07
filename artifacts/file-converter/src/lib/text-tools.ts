/** Pretty-format a JSON string */
export function formatJson(input: string): string {
  try {
    const parsed = JSON.parse(input.trim());
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    throw new Error(`Invalid JSON: ${(e as Error).message}`);
  }
}

/** Convert a JSON array of objects to CSV */
export function jsonToCsv(input: string): string {
  const parsed = JSON.parse(input.trim());
  if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array of objects.");
  if (parsed.length === 0) return "";

  const headers = Array.from(new Set(parsed.flatMap((row) => Object.keys(row))));
  const escape = (val: unknown) => {
    const str = val == null ? "" : String(val);
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = parsed.map((row) => headers.map((h) => escape(row[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

/** Convert CSV data to a JSON array of objects */
export function csvToJson(input: string): string {
  const lines = input.trim().split("\n").filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row.");

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const vals = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), vals[i]?.trim() ?? ""]));
  });

  return JSON.stringify(rows, null, 2);
}

/** Base64 encode a string (UTF-8 safe) */
export function base64Encode(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    throw new Error("Failed to encode. Make sure the input is valid text.");
  }
}

/** Base64 decode a string (UTF-8 safe) */
export function base64Decode(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input.trim())));
  } catch {
    throw new Error("Invalid Base64 string. Check the input and try again.");
  }
}

/** URL encode a string */
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

/** URL decode a string */
export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error("Invalid URL-encoded string.");
  }
}

type CaseType = "upper" | "lower" | "title" | "camel" | "snake" | "kebab" | "sentence";

/** Convert text between different cases */
export function convertCase(input: string, targetCase: CaseType): string {
  const words = input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  switch (targetCase) {
    case "upper":
      return input.toUpperCase();
    case "lower":
      return input.toLowerCase();
    case "title":
      return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "sentence":
      return words.length === 0 ? "" :
        words[0][0].toUpperCase() + words[0].slice(1).toLowerCase() +
        (words.length > 1 ? " " + words.slice(1).map((w) => w.toLowerCase()).join(" ") : "");
    case "camel":
      return words
        .map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");
    default:
      return input;
  }
}
