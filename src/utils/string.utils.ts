export function sanitizeFilename(name: string, replaceSpaces = true): string {
  if (!name) return "untitled";

  // Replace invalid characters with a dash
  let sanitized = name.replace(/[/\\?%*:|"<>]/g, "-");

  // Optionally replace spaces with underscores
  if (replaceSpaces) {
    sanitized = sanitized.replace(/\s+/g, "_");
  }

  // Trim extra whitespace or dashes
  sanitized = sanitized.trim().replace(/^-+|-+$/g, "");

  // Fallback if the name becomes empty
  return sanitized || "untitled";
}