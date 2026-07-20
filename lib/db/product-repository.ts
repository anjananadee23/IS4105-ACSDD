import { and, asc, eq, inArray, like, or } from "drizzle-orm";

import { db } from "./client";
import { products } from "./schema";

export function listProducts(options?: { category?: string; q?: string }) {
  const query = db.select().from(products);
  const conditions = [];

  if (options?.category && options.category !== "All") {
    conditions.push(eq(products.category, options.category));
  }

  if (options?.q) {
    const searchPattern = `%${options.q}%`;
    conditions.push(
      or(
        like(products.name, searchPattern),
        like(products.description, searchPattern)
      )
    );
  }

  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(asc(products.name));
  }

  return query.orderBy(asc(products.name));
}

export async function listCategories() {
  const results = await db
    .selectDistinct({ category: products.category })
    .from(products);
  return results.map((r) => r.category).sort();
}

export function findProductBySlug(slug: string) {
  return db.query.products.findFirst({ where: eq(products.slug, slug) });
}

export function findProductsByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(products).where(inArray(products.id, ids));
}
