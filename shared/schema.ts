import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tailors = pgTable("tailors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  profileImage: text("profile_image"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  totalOrders: integer("total_orders").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  tailorId: integer("tailor_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // agbada, ankara, dashiki, kaftan
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: text("images").array(),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
  isTrending: boolean("is_trending").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  chest: decimal("chest", { precision: 4, scale: 1 }),
  waist: decimal("waist", { precision: 4, scale: 1 }),
  hip: decimal("hip", { precision: 4, scale: 1 }),
  shoulderWidth: decimal("shoulder_width", { precision: 4, scale: 1 }),
  armLength: decimal("arm_length", { precision: 4, scale: 1 }),
  height: decimal("height", { precision: 4, scale: 1 }),
  weight: decimal("weight", { precision: 4, scale: 1 }),
  units: text("units").default("inches"), // inches or cm
  createdAt: timestamp("created_at").defaultNow(),
});

export const stylePreferences = pgTable("style_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  occasions: text("occasions").array(), // professional, traditional, casual, special
  preferredColors: text("preferred_colors").array(),
  bodyType: text("body_type"),
  stylePersonality: text("style_personality"), // classic, trendy, bold, minimal
  budgetRange: text("budget_range"), // budget, mid-range, premium
  completedAt: timestamp("completed_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tailorId: integer("tailor_id").notNull(),
  designId: integer("design_id").notNull(),
  customizations: jsonb("customizations"),
  measurements: jsonb("measurements"),
  deliveryAddress: text("delivery_address").notNull(),
  phone: text("phone").notNull(),
  preferredDeliveryDate: timestamp("preferred_delivery_date"),
  specialInstructions: text("special_instructions"),
  designPrice: decimal("design_price", { precision: 10, scale: 2 }).notNull(),
  customizationFee: decimal("customization_fee", { precision: 10, scale: 2 }).default("0"),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, confirmed, in_progress, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tailorId: integer("tailor_id").notNull(),
  orderId: integer("order_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTailorSchema = createInsertSchema(tailors).omit({
  id: true,
  rating: true,
  totalReviews: true,
  totalOrders: true,
  revenue: true,
  isVerified: true,
  createdAt: true,
});

export const insertDesignSchema = createInsertSchema(designs).omit({
  id: true,
  isActive: true,
  isTrending: true,
  createdAt: true,
});

export const insertMeasurementSchema = createInsertSchema(measurements).omit({
  id: true,
  createdAt: true,
});

export const insertStylePreferenceSchema = createInsertSchema(stylePreferences).omit({
  id: true,
  completedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tailor = typeof tailors.$inferSelect;
export type InsertTailor = z.infer<typeof insertTailorSchema>;

export type Design = typeof designs.$inferSelect;
export type InsertDesign = z.infer<typeof insertDesignSchema>;

export type Measurement = typeof measurements.$inferSelect;
export type InsertMeasurement = z.infer<typeof insertMeasurementSchema>;

export type StylePreference = typeof stylePreferences.$inferSelect;
export type InsertStylePreference = z.infer<typeof insertStylePreferenceSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Extended types for API responses
export type DesignWithTailor = Design & {
  tailor: Tailor;
};

export type OrderWithDetails = Order & {
  design: Design;
  tailor: Tailor;
  user: User;
};

export type TailorWithStats = Tailor & {
  designs: Design[];
  recentOrders: OrderWithDetails[];
};
