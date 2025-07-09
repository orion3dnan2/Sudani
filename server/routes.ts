import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertServiceSchema, insertJobSchema, insertAnnouncementSchema, insertUserSchema, updateUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ 
          error: "Username already exists",
          message: "اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر"
        });
      }
      
      const user = await storage.createUser(validatedData);
      res.status(201).json({ id: user.id, username: user.username, fullName: user.fullName });
    } catch (error: any) {
      console.error("User creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid user data", 
          details: error.errors,
          message: "تأكد من ملء جميع الحقول المطلوبة بشكل صحيح"
        });
      } else {
        res.status(500).json({ 
          error: "Failed to create user",
          message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى."
        });
      }
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const validatedData = updateUserSchema.parse(req.body);
      
      // Check if username already exists (excluding current user)
      if (validatedData.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ 
            error: "Username already exists",
            message: "اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر"
          });
        }
      }
      
      const updatedUser = await storage.updateUser(userId, validatedData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("User update error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid user data", 
          details: error.errors,
          message: "تأكد من ملء جميع الحقول المطلوبة بشكل صحيح"
        });
      } else {
        res.status(500).json({ 
          error: "Failed to update user",
          message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى."
        });
      }
    }
  });
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      const products = category && category !== "الكل" 
        ? await storage.getProductsByCategory(category as string)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      console.log("Received product data:", req.body);
      const validatedData = insertProductSchema.parse(req.body);
      console.log("Validated product data:", validatedData);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Product creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid product data", 
          details: error.errors,
          message: "تأكد من ملء جميع الحقول المطلوبة بشكل صحيح"
        });
      } else {
        res.status(500).json({ 
          error: "Failed to create product",
          message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى."
        });
      }
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const { category } = req.query;
      const services = category 
        ? await storage.getServicesByCategory(category as string)
        : await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(parseInt(req.params.id));
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      console.log("Received service data:", req.body);
      const validatedData = insertServiceSchema.parse(req.body);
      console.log("Validated service data:", validatedData);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error: any) {
      console.error("Service creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid service data", 
          details: error.errors,
          message: "تأكد من ملء جميع الحقول المطلوبة بشكل صحيح"
        });
      } else {
        res.status(500).json({ 
          error: "Failed to create service",
          message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى."
        });
      }
    }
  });

  // Jobs routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { type } = req.query;
      const jobs = type 
        ? await storage.getJobsByType(type as string)
        : await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ error: "Invalid job data" });
    }
  });

  // Announcements routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const { category } = req.query;
      const announcements = category 
        ? await storage.getAnnouncementsByCategory(category as string)
        : await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.get("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.getAnnouncement(parseInt(req.params.id));
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcement" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Invalid announcement data" });
    }
  });

  // Delete routes for admin
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJob(id);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAnnouncement(id);
      res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Admin statistics endpoint
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const products = await storage.getProducts();
      const services = await storage.getServices();
      const jobs = await storage.getJobs();
      const announcements = await storage.getAnnouncements();
      
      const stats = {
        totalUsers: users.length,
        totalBusinesses: users.filter(u => u.userType === 'business').length,
        totalErrors: 0, // Mock for now
        totalListings: products.length + services.length + jobs.length + announcements.length,
        usersByRole: {
          admin: users.filter(u => u.userType === 'admin').length,
          manager: users.filter(u => u.userType === 'manager').length,
          business: users.filter(u => u.userType === 'business').length,
          user: users.filter(u => u.userType === 'user').length,
        },
        monthlyGrowth: {} // Mock for now
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Admin logs endpoint
  app.get("/api/admin/logs", async (req, res) => {
    try {
      // Mock system logs for now
      const logs = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Database connection timeout',
          userId: 1,
          resolved: false
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          level: 'warning',
          message: 'High memory usage detected',
          resolved: true
        }
      ];
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // Admin backup endpoints
  app.get("/api/admin/backups", async (req, res) => {
    try {
      // Mock backup history for now
      const backups = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          size: '245 MB',
          type: 'full',
          status: 'completed'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          size: '180 MB',
          type: 'full',
          status: 'completed'
        }
      ];
      res.json(backups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch backups" });
    }
  });

  app.post("/api/admin/backup", async (req, res) => {
    try {
      // Mock backup creation
      const backup = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        size: '0 MB',
        type: 'full',
        status: 'in_progress'
      };
      res.status(201).json(backup);
    } catch (error) {
      res.status(500).json({ error: "Failed to create backup" });
    }
  });

  app.put("/api/admin/logs/:id/resolve", async (req, res) => {
    try {
      // Mock log resolution
      res.json({ message: "Log resolved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve log" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
