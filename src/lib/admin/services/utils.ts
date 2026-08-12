/**
 * Shared helpers for the service layer. Every service persists to
 * /data/*.json via src/lib/server/jsonStore.ts; a backend developer
 * replacing the JSON repository with a real database only needs to
 * preserve each service method's async signature and return shape —
 * nothing in the UI layer talks to storage directly.
 */

let counter = 0;

/** Swap for your database's own id generation (uuid, cuid, autoincrement...). */
export function genId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function matchesQuery(haystack: Array<string | number | null | undefined>, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return haystack.some((field) => String(field ?? "").toLowerCase().includes(q));
}
