import { describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { seedProducts } from "../products";
import * as schema from "../schema";
import { products } from "../schema";
import { seedDatabase } from "../seed";

describe("product seed data", () => {
  it("contains the required 8-12 distinct products", () => {
    expect(seedProducts).toHaveLength(12);
    expect(new Set(seedProducts.map((product) => product.id)).size).toBe(seedProducts.length);
    expect(new Set(seedProducts.map((product) => product.slug)).size).toBe(seedProducts.length);
  });

  it("stores valid prices in integer cents and local image paths", () => {
    for (const product of seedProducts) {
      expect(Number.isInteger(product.priceCents)).toBe(true);
      expect(product.priceCents).toBeGreaterThan(0);
      expect(product.imageUrl).toBe(`/products/${product.slug}.svg`);
    }
  });

  it("migrates a fresh database and can rerun the seed without duplicates", async () => {
    const sqlite = new Database(":memory:");
    sqlite.pragma("foreign_keys = ON");
    const database = drizzle(sqlite, { schema });

    migrate(database, { migrationsFolder: "./drizzle" });
    await seedDatabase(database);
    await seedDatabase(database);

    const [result] = await database.select({ value: count() }).from(products);
    expect(result.value).toBe(12);
    sqlite.close();
  });
});
