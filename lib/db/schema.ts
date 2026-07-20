import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  subtotalCents: integer("subtotal_cents").notNull(),
  deliveryCents: integer("delivery_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status", { enum: ["pending_payment", "confirmed", "payment_failed"] })
    .notNull()
    .default("pending_payment"),
  paymentReference: text("payment_reference"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(),
  productSlug: text("product_slug").notNull(),
  imageUrl: text("image_url").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotalCents: integer("line_total_cents").notNull(),
});

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
