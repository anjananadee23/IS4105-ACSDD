import { asc, eq, inArray } from "drizzle-orm";

import { db } from "./client";
import { products } from "./schema";

export function listProducts() {
  return db.select().from(products).orderBy(asc(products.name));
}

export function findProductBySlug(slug: string) {
  return db.query.products.findFirst({ where: eq(products.slug, slug) });
}

export function findProductsByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return db.select().from(products).where(inArray(products.id, ids));
}
