import { describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { seedProducts } from "../products";
import * as schema from "../schema";
import { orderItems, orders, products } from "../schema";
import { seedDatabase } from "../seed";
import { listCategories, listProducts } from "../product-repository";

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
      expect(product.imageUrl).toBe(`/img/${product.slug}.png`);
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

  describe("product repository search and filter", () => {
    it("can list all categories", async () => {
      const categories = await listCategories();
      expect(categories).toContain("Pantry");
      expect(categories).toContain("Home");
      expect(categories).toContain("Tea");
      expect(categories).toContain("Accessories");
      expect(categories).toContain("Crafts");
      expect(categories).toContain("Coffee");
    });

    it("can filter products by category", async () => {
      const pantryProducts = await listProducts({ category: "Pantry" });
      expect(pantryProducts.length).toBeGreaterThan(0);
      for (const p of pantryProducts) {
        expect(p.category).toBe("Pantry");
      }
    });

    it("can search products by name/description case-insensitively", async () => {
      const cinnamonProducts = await listProducts({ q: "cinnamon" });
      expect(cinnamonProducts.length).toBeGreaterThan(0);
      for (const p of cinnamonProducts) {
        const matches =
          p.name.toLowerCase().includes("cinnamon") ||
          p.description.toLowerCase().includes("cinnamon");
        expect(matches).toBe(true);
      }
    });

    it("can combine category filter and search query", async () => {
      const results = await listProducts({ category: "Pantry", q: "cinnamon" });
      expect(results.length).toBe(1);
      expect(results[0].id).toBe("prod-cinnamon");
    });
  });
  it("reseeds without violating the order/order-item foreign keys once an order exists", async () => {
    const sqlite = new Database(":memory:");
    sqlite.pragma("foreign_keys = ON");
    const database = drizzle(sqlite, { schema });

    migrate(database, { migrationsFolder: "./drizzle" });
    await seedDatabase(database);

    const now = new Date().toISOString();
    const product = seedProducts[0];
    await database.insert(orders).values({
      id: "order-1",
      orderNumber: "CC-2026-000001",
      customerName: "Test Buyer",
      email: "buyer@example.com",
      phone: "0770000000",
      addressLine1: "1 Test Rd",
      city: "Colombo",
      subtotalCents: product.priceCents,
      deliveryCents: 50000,
      totalCents: product.priceCents + 50000,
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
    });
    await database.insert(orderItems).values({
      id: "order-item-1",
      orderId: "order-1",
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.imageUrl,
      unitPriceCents: product.priceCents,
      quantity: 1,
      lineTotalCents: product.priceCents,
    });

    await expect(seedDatabase(database)).resolves.not.toThrow();

    const [result] = await database.select({ value: count() }).from(products);
    expect(result.value).toBe(12);
    sqlite.close();
  });
});

