export function extractTags(input: string): string[] {
  const regex = /#\w+/g;
  const matches = input.match(regex) || [];
  return [...new Set(matches.map(t => t.toLowerCase()))];
}