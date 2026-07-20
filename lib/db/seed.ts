import { pathToFileURL } from "node:url";

import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { seedProducts } from "./products";
import { products } from "./schema";
import type * as schema from "./schema";

export async function seedDatabase(database: BetterSQLite3Database<typeof schema>) {
  const createdAt = new Date().toISOString();

  await database
    .insert(products)
    .values(seedProducts.map((product) => ({ ...product, createdAt })))
    .onConflictDoNothing();
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const { db, sqlite } = await import("./client");
  await seedDatabase(db);
  const result = sqlite.prepare("SELECT COUNT(*) AS count FROM products").get() as { count: number };
  console.log(`CeylonCart database ready with ${result.count} products.`);
  sqlite.close();
}
