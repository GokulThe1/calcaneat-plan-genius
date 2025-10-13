import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertReportSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

const isAdmin: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || (user.role !== 'admin' && user.role !== 'clinical')) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

const isKitchen: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || user.role !== 'kitchen') {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

const isDelivery: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || user.role !== 'delivery') {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/admin/customers', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get('/api/admin/milestones/:userId', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const milestones = await storage.getUserMilestones(req.params.userId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.patch('/api/admin/milestones/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const statusSchema = z.object({ status: z.enum(['locked', 'in_progress', 'completed']) });
      const { status } = statusSchema.parse(req.body);
      const milestone = await storage.updateMilestone(req.params.id, status);
      
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status value", errors: error.errors });
      }
      console.error("Error updating milestone:", error);
      res.status(500).json({ message: "Failed to update milestone" });
    }
  });

  app.get('/api/admin/reports/:userId', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const reports = await storage.getUserReports(req.params.userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/admin/reports', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.post('/api/admin/orders', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/kitchen/orders/:status', isAuthenticated, isKitchen, async (req: any, res) => {
    try {
      const orders = await storage.getOrdersByStatus(req.params.status);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch('/api/kitchen/orders/:id', isAuthenticated, isKitchen, async (req: any, res) => {
    try {
      const statusSchema = z.object({ status: z.enum(['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered']) });
      const { status } = statusSchema.parse(req.body);
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status value", errors: error.errors });
      }
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.get('/api/delivery/orders/:status', isAuthenticated, isDelivery, async (req: any, res) => {
    try {
      const orders = await storage.getOrdersByStatus(req.params.status);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch('/api/delivery/orders/:id', isAuthenticated, isDelivery, async (req: any, res) => {
    try {
      const statusSchema = z.object({ status: z.enum(['ready', 'out_for_delivery', 'delivered']) });
      const { status } = statusSchema.parse(req.body);
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status value", errors: error.errors });
      }
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
