export function extractVariables(template: string): string[] {
  const found = template.match(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g) ?? [];
  return Array.from(new Set(found.map((m) => m.replace(/[{}\s]/g, ''))));
}
