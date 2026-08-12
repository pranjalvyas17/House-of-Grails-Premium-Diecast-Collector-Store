import "server-only";
import { mkdir, readFile, rename, unlink, writeFile } from "fs/promises";
import path from "path";

/**
 * Canonical development persistence layer. ONE JSON file per resource under
 * /data — read/written server-side only, shared by both the admin panel and
 * the storefront through the service layer above this module. Nothing else
 * in the app should touch these files directly.
 *
 * TODO(backend): this is the single seam a future developer replaces. Swap
 * `createJsonRepository` for a repository backed by a real database
 * (Postgres/MySQL/Mongo/whatever) that implements the same interface
 * (getAll/getById/insert/update/remove/replaceAll) — nothing in the 8
 * services, the Server Actions, or any UI needs to change.
 */

const DATA_DIR = path.join(process.cwd(), "data");

// Per-file write queue so concurrent mutations to the same resource never
// interleave (e.g. two admins editing different products at once). Each
// file gets its own promise chain; writes wait their turn, reads don't.
const fileLocks = new Map<string, Promise<unknown>>();

async function withFileLock<T>(filePath: string, fn: () => Promise<T>): Promise<T> {
  const previous = fileLocks.get(filePath) ?? Promise.resolve();
  const run = previous.then(fn, fn);
  // Swallow rejections in the chain itself (they still propagate to the
  // caller via `run`) so one failed write doesn't wedge the queue forever.
  fileLocks.set(filePath, run.catch(() => undefined));
  return run;
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, seed: () => T | Promise<T>): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // First run for this resource — initialise from the seed catalogue
      // and persist it, so the NEXT read (and every subsequent server
      // start) sees the same data instead of reseeding.
      const initial = await seed();
      await writeJsonFile(filePath, initial);
      return initial;
    }
    throw err;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  // Unique per call (pid + timestamp + random) — Next.js spreads static
  // generation across several worker *processes*, each with its own copy
  // of `fileLocks`, so the in-memory queue below only dedupes writes within
  // a single process. Concurrent renames from separate processes onto the
  // same destination can still race, and unlike POSIX, Windows sometimes
  // surfaces that race as EPERM/EBUSY instead of silently serialising it —
  // retry past those instead of failing the whole build.
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");

  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await rename(tmpPath, filePath);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if ((code !== "EPERM" && code !== "EBUSY") || attempt === maxAttempts) {
        await unlink(tmpPath).catch(() => undefined);
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 25 * attempt));
    }
  }
}

export interface JsonRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  insert(item: T): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
  /** Bulk replace (used for reordering, where the whole array is the unit of change). */
  replaceAll(items: T[]): Promise<T[]>;
}

/** Repository over a JSON array file, keyed by `getId(item)` (defaults to `.id`). */
export function createJsonRepository<T extends object>(
  fileName: string,
  seed: () => T[] | Promise<T[]>,
  getId: (item: T) => string = (item) => (item as { id: string }).id
): JsonRepository<T> {
  const filePath = path.join(DATA_DIR, fileName);

  return {
    async getAll() {
      return readJsonFile<T[]>(filePath, seed);
    },

    async getById(id) {
      const all = await readJsonFile<T[]>(filePath, seed);
      return all.find((item) => getId(item) === id) ?? null;
    },

    async insert(item) {
      return withFileLock(filePath, async () => {
        const all = await readJsonFile<T[]>(filePath, seed);
        const next = [item, ...all];
        await writeJsonFile(filePath, next);
        return item;
      });
    },

    async update(id, patch) {
      return withFileLock(filePath, async () => {
        const all = await readJsonFile<T[]>(filePath, seed);
        let updated: T | null = null;
        const next = all.map((item) => {
          if (getId(item) !== id) return item;
          updated = { ...item, ...patch };
          return updated;
        });
        if (updated) await writeJsonFile(filePath, next);
        return updated;
      });
    },

    async remove(id) {
      return withFileLock(filePath, async () => {
        const all = await readJsonFile<T[]>(filePath, seed);
        const next = all.filter((item) => getId(item) !== id);
        const removed = next.length < all.length;
        if (removed) await writeJsonFile(filePath, next);
        return removed;
      });
    },

    async replaceAll(items) {
      return withFileLock(filePath, async () => {
        await writeJsonFile(filePath, items);
        return items;
      });
    },
  };
}

export interface JsonSingleton<T> {
  get(): Promise<T>;
  update(patch: Partial<T>): Promise<T>;
}

/** Repository over a JSON object file holding exactly one record (homepage config, site settings). */
export function createJsonSingleton<T extends object>(
  fileName: string,
  seed: () => T | Promise<T>
): JsonSingleton<T> {
  const filePath = path.join(DATA_DIR, fileName);

  return {
    async get() {
      return readJsonFile<T>(filePath, seed);
    },

    async update(patch) {
      return withFileLock(filePath, async () => {
        const current = await readJsonFile<T>(filePath, seed);
        const next = { ...current, ...patch };
        await writeJsonFile(filePath, next);
        return next;
      });
    },
  };
}

export async function deleteDataFile(fileName: string): Promise<void> {
  const filePath = path.join(DATA_DIR, fileName);
  await unlink(filePath).catch(() => undefined);
}
