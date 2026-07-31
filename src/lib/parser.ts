/**
 * Extracts unique variable names from mustache placeholders in a template.
 * Example: "Translate {{text}} into {{language}}" -> ["text", "language"]
 */
export function extractVariables(template: string): string[] {
  if (!template) return [];

  // Matches pattern {{variable_name}} or {{ variable_name }}
  const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template)) !== null) {
    if (match[1]) {
      matches.add(match[1].trim());
    }
  }

  return Array.from(matches);
}

/**
 * Replaces {{variable}} placeholders with actual user-provided values.
 * Example: template = "Hello {{name}}", values = { name: "Alice" } -> "Hello Alice"
 */
export function hydrateTemplate(template: string, values: Record<string, string>): string {
  if (!template) return '';

  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, varName) => {
    const trimmed = varName.trim();
    return values[trimmed] !== undefined ? values[trimmed] : `{{${trimmed}}}`;
  });
}
