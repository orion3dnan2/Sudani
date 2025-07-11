import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  email: text("email"),
  userType: text("user_type").default("user"), // admin, developer, manager, business, user
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 3 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  whatsappPhone: text("whatsapp_phone"),
  sellerId: integer("seller_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  imageUrl: text("image_url"),
  ownerId: integer("owner_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // full-time, part-time, remote
  salary: text("salary"),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  posterId: integer("poster_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // events, sale, rental, services
  price: decimal("price", { precision: 10, scale: 3 }),
  phone: text("phone"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  isApproved: boolean("is_approved").default(false),
  posterId: integer("poster_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // error, warning, info
  message: text("message").notNull(),
  userId: integer("user_id").references(() => users.id),
  action: text("action"),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  phone: true,
  email: true,
  userType: true,
});

export const updateUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  phone: true,
  email: true,
  userType: true,
}).partial();

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  whatsappPhone: true,
}).extend({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  category: z.string().min(1, "فئة المنتج مطلوبة"),
  price: z.string().min(1, "السعر مطلوب").transform((val) => val.toString()),
}).refine(
  (data) => data.whatsappPhone && data.whatsappPhone.length >= 8,
  {
    message: "رقم الواتساب مطلوب ويجب أن يكون على الأقل 8 أرقام",
    path: ["whatsappPhone"],
  }
);

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  category: true,
  phone: true,
  address: true,
  imageUrl: true,
}).extend({
  name: z.string().min(1, "اسم الخدمة مطلوب"),
  category: z.string().min(1, "فئة الخدمة مطلوبة"),
  phone: z.string().min(8, "رقم الهاتف مطلوب ويجب أن يكون على الأقل 8 أرقام"),
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  description: true,
  company: true,
  location: true,
  type: true,
  salary: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  description: true,
  category: true,
  price: true,
  phone: true,
  imageUrl: true,
}).extend({
  price: z.string().optional().transform((val) => val || null),
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).pick({
  level: true,
  message: true,
  userId: true,
  action: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
