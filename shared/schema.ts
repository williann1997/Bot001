import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  userDiscordId: text("user_discord_id").notNull(),
  boxQuantity: integer("box_quantity").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  userDiscordId: text("user_discord_id").notNull(),
  description: text("description").notNull(),
  deliveryStatus: text("delivery_status").notNull(),
  totalValue: text("total_value").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export const insertFarmSchema = createInsertSchema(farms).omit({
  id: true,
  registeredAt: true,
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  registeredAt: true,
});

export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type Farm = typeof farms.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

// Keep existing user schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
