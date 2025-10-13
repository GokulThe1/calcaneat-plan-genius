import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertReportSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing required Razorpay secrets: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

  app.post('/api/payment-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const sessionSchema = z.object({
        consultationDate: z.string(),
        planType: z.enum(['clinical', 'ai']),
      });
      const data = sessionSchema.parse(req.body);
      
      // Server-side pricing based on plan type
      const planPricing: Record<string, number> = {
        'clinical': 500000, // ₹5,000 in paise
        'ai': 0, // Free for AI plan
      };
      
      const amount = planPricing[data.planType];
      if (amount === undefined) {
        return res.status(400).json({ message: "Invalid plan type" });
      }
      
      const userId = req.user.claims.sub;
      const session = await storage.createPaymentSession({
        userId,
        consultationDate: new Date(data.consultationDate),
        planType: data.planType,
        amount, // Server-determined amount, not client-provided
        status: 'pending',
      });
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating payment session:", error);
      res.status(500).json({ message: "Failed to create payment session" });
    }
  });

  app.patch('/api/user/character', isAuthenticated, async (req: any, res) => {
    try {
      const characterSchema = z.object({
        characterImageUrl: z.string().optional(),
        characterType: z.string().optional(),
      });
      const data = characterSchema.parse(req.body);
      
      const userId = req.user.claims.sub;
      const user = await storage.updateUser(userId, data);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error updating character:", error);
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  app.post('/api/create-razorpay-order', isAuthenticated, async (req: any, res) => {
    try {
      const paymentSchema = z.object({
        sessionId: z.string(),
      });
      const { sessionId } = paymentSchema.parse(req.body);

      const userId = req.user.claims.sub;
      
      // Fetch payment session to verify ownership and get amount
      const session = await storage.getPaymentSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Payment session not found" });
      }
      
      if (session.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized - session belongs to different user" });
      }
      
      if (session.status === 'completed') {
        return res.status(400).json({ message: "Payment session already completed" });
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(session.amount), // Amount in paise
        currency: "INR",
        receipt: sessionId,
        notes: {
          sessionId,
          userId,
        },
      });

      res.json({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ message: "Error creating payment order: " + error.message });
    }
  });

  app.post('/api/verify-payment', isAuthenticated, async (req: any, res) => {
    try {
      const verifySchema = z.object({
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
        sessionId: z.string(),
      });
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sessionId } = verifySchema.parse(req.body);

      const crypto = await import('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Update payment session status
      await storage.updatePaymentSession(sessionId, { status: 'completed' });

      res.json({ success: true, message: "Payment verified successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Error verifying payment: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
