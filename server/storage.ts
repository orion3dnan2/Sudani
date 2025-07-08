import { users, products, services, jobs, announcements, type User, type InsertUser, type Product, type InsertProduct, type Service, type InsertService, type Job, type InsertJob, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Service methods
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Job methods
  getJobs(): Promise<Job[]>;
  getJobsByType(type: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Announcement methods
  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByCategory(category: string): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Delete methods (admin only)
  deleteProduct(id: number): Promise<void>;
  deleteService(id: number): Promise<void>;
  deleteJob(id: number): Promise<void>;
  deleteAnnouncement(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.category, category));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  // Job methods
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.isActive, true));
  }

  async getJobsByType(type: string): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.type, type));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  // Announcement methods
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isActive, true));
  }

  async getAnnouncementsByCategory(category: string): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.category, category));
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement || undefined;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(insertAnnouncement)
      .returning();
    return announcement;
  }

  // Delete methods (admin only)
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }
}

// In-memory storage for fallback
class MemoryStorage implements IStorage {
  private users: (User & { id: number })[] = [];
  private products: (Product & { id: number })[] = [];
  private services: (Service & { id: number })[] = [];
  private jobs: (Job & { id: number })[] = [];
  private announcements: (Announcement & { id: number })[] = [];
  private nextId = 1;

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = { ...insertUser, id: this.nextId++ } as User & { id: number };
    this.users.push(user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product = { ...insertProduct, id: this.nextId++ } as Product & { id: number };
    this.products.push(product);
    return product;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return this.services.filter(s => s.category === category);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.find(s => s.id === id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const service = { ...insertService, id: this.nextId++ } as Service & { id: number };
    this.services.push(service);
    return service;
  }

  // Job methods
  async getJobs(): Promise<Job[]> {
    return this.jobs;
  }

  async getJobsByType(type: string): Promise<Job[]> {
    return this.jobs.filter(j => j.type === type);
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.find(j => j.id === id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const job = { ...insertJob, id: this.nextId++ } as Job & { id: number };
    this.jobs.push(job);
    return job;
  }

  // Announcement methods
  async getAnnouncements(): Promise<Announcement[]> {
    return this.announcements;
  }

  async getAnnouncementsByCategory(category: string): Promise<Announcement[]> {
    return this.announcements.filter(a => a.category === category);
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.find(a => a.id === id);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const announcement = { ...insertAnnouncement, id: this.nextId++ } as Announcement & { id: number };
    this.announcements.push(announcement);
    return announcement;
  }

  // Delete methods (admin only)
  async deleteProduct(id: number): Promise<void> {
    this.products = this.products.filter(p => p.id !== id);
  }

  async deleteService(id: number): Promise<void> {
    this.services = this.services.filter(s => s.id !== id);
  }

  async deleteJob(id: number): Promise<void> {
    this.jobs = this.jobs.filter(j => j.id !== id);
  }

  async deleteAnnouncement(id: number): Promise<void> {
    this.announcements = this.announcements.filter(a => a.id !== id);
  }
}

// Use in-memory storage as fallback when database is not available
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemoryStorage();