export function capitalize(s: string): string {
  if (!s) {
    return s;
  }
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}
