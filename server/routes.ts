import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { 
  insertReportSchema, 
  insertOrderSchema,
  insertPlanSchema,
  insertStageProgressSchema,
  insertDocumentSchema,
  insertDietPlanSchema,
  insertAddressSchema,
  insertDeliverySyncSchema,
  insertAcknowledgementSchema,
  insertStaffActivityLogSchema,
  insertDeliveryLocationSchema
} from "@shared/schema";
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

const isConsultant: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || (user.role !== 'clinical' && user.role !== 'admin')) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

const isNutritionist: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || (user.role !== 'nutritionist' && user.role !== 'clinical' && user.role !== 'admin')) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

const isLabTechnician: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || (user.role !== 'lab_technician' && user.role !== 'clinical' && user.role !== 'admin')) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

const isChef: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userId = req.user.claims.sub;
  const user = await storage.getUser(userId);
  
  if (!user || (user.role !== 'chef' && user.role !== 'kitchen' && user.role !== 'admin')) {
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

  app.get('/api/user/consultations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const consultations = await storage.getUserConsultations(userId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.get('/api/user/milestones', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const milestones = await storage.getUserMilestones(userId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.get('/api/user/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reports = await storage.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getCustomerProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
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
        consultationDate: data.consultationDate,
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

  // Complete signup with consultation (unauthenticated - new users)
  app.post('/api/signup-with-consultation', async (req: any, res) => {
    try {
      console.log("Received signup data:", JSON.stringify(req.body, null, 2));
      
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        characterType: z.string(),
        characterImage: z.string().optional(),
        consultationDate: z.string(),
        consultationTime: z.string(),
        doctorName: z.string(),
        planType: z.string(),
      });
      
      const data = schema.parse(req.body);
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      // Create user
      const user = await storage.createUser({
        email: data.email,
        firstName,
        lastName,
        phone: data.phone,
        characterType: data.characterType,
        characterImageUrl: data.characterImage || null,
        role: 'customer',
      });
      
      // Create consultation
      const consultation = await storage.createConsultation({
        userId: user.id,
        doctorName: data.doctorName,
        scheduledDate: data.consultationDate,
        scheduledTime: data.consultationTime,
        meetingType: 'clinical',
        status: 'scheduled',
      });
      
      // Create payment session
      const paymentSession = await storage.createPaymentSession({
        userId: user.id,
        consultationDate: data.consultationDate,
        planType: data.planType,
        amount: 199900, // ₹1,999 in paise
        status: 'pending',
        paymentMethod: 'dummy',
      });

      // Create plan with pricing breakdown
      const PLAN_PRICES: Record<string, number> = {
        'clinical': 9999,
        'ai': 5999,
      };
      const CONSULTATION_FEE = 1999;
      const planPrice = PLAN_PRICES[data.planType.toLowerCase()] || 9999;
      
      await storage.createPlan({
        userId: user.id,
        type: data.planType,
        listPrice: planPrice.toString(),
        consultationFeeCredited: CONSULTATION_FEE.toString(),
        finalPayable: (planPrice - CONSULTATION_FEE).toString(),
        isActive: false, // Will be activated after payment
        durationDays: 30,
      });
      
      // Initialize milestones
      const milestoneNames = [
        'Physician Consultation',
        'Test Collection',
        'Discussion',
        'Diet Chart',
        'Meal Delivery'
      ];
      
      for (let i = 0; i < milestoneNames.length; i++) {
        await storage.createMilestone({
          userId: user.id,
          name: milestoneNames[i],
          status: i === 0 ? 'in_progress' : 'locked',
          order: i + 1,
        });
      }

      // Auto-login: Create session for the new user
      // Match the structure expected by Passport serialization (see replitAuth.ts)
      const sessionUser = {
        claims: { 
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        },
        access_token: 'auto-login-token',
        refresh_token: null, // No refresh token for auto-login sessions
        expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
        isAutoLogin: true, // Flag to identify auto-login sessions
      };

      req.login(sessionUser, (err: any) => {
        if (err) {
          console.error("Auto-login failed:", err);
          // Still return success even if auto-login fails
          return res.json({ 
            success: true, 
            userId: user.id, 
            paymentSessionId: paymentSession.id,
            consultationId: consultation.id,
            autoLoginFailed: true,
          });
        }

        res.json({ 
          success: true, 
          userId: user.id, 
          paymentSessionId: paymentSession.id,
          consultationId: consultation.id,
          autoLogin: true,
        });
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid signup data", errors: error.errors });
      }
      console.error("Error completing signup:", error);
      res.status(500).json({ message: "Error completing signup: " + error.message });
    }
  });

  // Complete dummy payment (unauthenticated - before login)
  app.post('/api/payment/complete-dummy', async (req, res) => {
    try {
      const schema = z.object({
        paymentSessionId: z.string(),
        userId: z.string(),
      });
      
      const { paymentSessionId, userId } = schema.parse(req.body);
      
      const session = await storage.getPaymentSession(paymentSessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Payment session not found" });
      }
      
      if (session.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Update payment session status
      await storage.updatePaymentSession(paymentSessionId, { 
        status: 'completed',
        completedAt: new Date(),
      });
      
      res.json({ success: true, message: "Payment completed successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      console.error("Error completing payment:", error);
      res.status(500).json({ message: "Error completing payment: " + error.message });
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

      // Persist Razorpay order ID to the payment session
      await storage.updatePaymentSession(sessionId, { razorpayOrderId: order.id });

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

      const userId = req.user.claims.sub;

      // Validate session ownership and status
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

      // Verify the order ID matches the session's stored order ID
      if (!session.razorpayOrderId || session.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({ message: "Order ID mismatch - payment not authorized for this session" });
      }

      // Verify payment signature
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

  // ==================== PLANS ROUTES ====================
  
  // Get user's active plan
  app.get('/api/user/plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plan = await storage.getUserPlan(userId);
      res.json(plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  });

  // Create a new plan for user
  app.post('/api/plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const planData = insertPlanSchema.parse({ ...req.body, userId });
      const plan = await storage.createPlan(planData);
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      console.error("Error creating plan:", error);
      res.status(500).json({ message: "Failed to create plan" });
    }
  });

  // Update plan
  app.patch('/api/plans/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plan = await storage.getPlan(req.params.id);
      
      if (!plan || plan.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updated = await storage.updatePlan(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ message: "Failed to update plan" });
    }
  });

  // ==================== STAGE PROGRESS ROUTES ====================
  
  // Get user's stage progress
  app.get('/api/user/stages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stages = await storage.getUserStageProgress(userId);
      res.json(stages);
    } catch (error) {
      console.error("Error fetching stages:", error);
      res.status(500).json({ message: "Failed to fetch stages" });
    }
  });

  // Update stage status (admin/consultant only)
  app.patch('/api/stages/:id', isAuthenticated, isConsultant, async (req: any, res) => {
    try {
      const statusSchema = z.object({ 
        status: z.enum(['pending', 'in_progress', 'completed', 'failed']) 
      });
      const { status } = statusSchema.parse(req.body);
      const stage = await storage.updateStageProgress(req.params.id, { status });
      
      if (!stage) {
        return res.status(404).json({ message: "Stage not found" });
      }
      
      res.json(stage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status value", errors: error.errors });
      }
      console.error("Error updating stage:", error);
      res.status(500).json({ message: "Failed to update stage" });
    }
  });

  // ==================== DOCUMENTS ROUTES ====================
  
  // Get user's documents
  app.get('/api/user/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Upload document (consultant/admin only)
  app.post('/api/documents', isAuthenticated, isConsultant, async (req: any, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Get all documents for a user (admin view)
  app.get('/api/admin/documents/:userId', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const documents = await storage.getUserDocuments(req.params.userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get documents by stage and user (admin view)
  app.get('/api/admin/documents/:userId/:stage', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const documents = await storage.getDocumentsByStage(req.params.userId, parseInt(req.params.stage));
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // ==================== DIET PLANS ROUTES ====================
  
  // Get user's diet plan
  app.get('/api/user/diet-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dietPlan = await storage.getUserDietPlan(userId);
      res.json(dietPlan);
    } catch (error) {
      console.error("Error fetching diet plan:", error);
      res.status(500).json({ message: "Failed to fetch diet plan" });
    }
  });

  // Create diet plan (nutritionist/admin only)
  app.post('/api/diet-plans', isAuthenticated, isNutritionist, async (req: any, res) => {
    try {
      const dietPlanData = insertDietPlanSchema.parse(req.body);
      const dietPlan = await storage.createDietPlan(dietPlanData);
      res.json(dietPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid diet plan data", errors: error.errors });
      }
      console.error("Error creating diet plan:", error);
      res.status(500).json({ message: "Failed to create diet plan" });
    }
  });

  // Update diet plan
  app.patch('/api/diet-plans/:id', isAuthenticated, isNutritionist, async (req: any, res) => {
    try {
      const dietPlan = await storage.updateDietPlan(req.params.id, req.body);
      if (!dietPlan) {
        return res.status(404).json({ message: "Diet plan not found" });
      }
      res.json(dietPlan);
    } catch (error) {
      console.error("Error updating diet plan:", error);
      res.status(500).json({ message: "Failed to update diet plan" });
    }
  });

  // ==================== ADDRESSES ROUTES ====================
  
  // Get user's addresses
  app.get('/api/user/addresses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });

  // Create address
  app.post('/api/addresses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addressData = insertAddressSchema.parse({ ...req.body, userId });
      const address = await storage.createAddress(addressData);
      res.json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid address data", errors: error.errors });
      }
      console.error("Error creating address:", error);
      res.status(500).json({ message: "Failed to create address" });
    }
  });

  // Update address
  app.patch('/api/addresses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const address = await storage.getAddress(req.params.id);
      
      if (!address || address.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updated = await storage.updateAddress(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });

  // Delete address
  app.delete('/api/addresses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const address = await storage.getAddress(req.params.id);
      
      if (!address || address.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteAddress(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  // ==================== DELIVERY SYNC ROUTES ====================
  
  // Create delivery sync (admin only)
  app.post('/api/delivery-sync', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const syncData = insertDeliverySyncSchema.parse(req.body);
      const sync = await storage.createDeliverySync(syncData);
      res.json(sync);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sync data", errors: error.errors });
      }
      console.error("Error creating delivery sync:", error);
      res.status(500).json({ message: "Failed to create delivery sync" });
    }
  });

  // Get user's delivery sync status
  app.get('/api/user/delivery-sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const syncs = await storage.getUserDeliverySyncs(userId);
      res.json(syncs);
    } catch (error) {
      console.error("Error fetching delivery syncs:", error);
      res.status(500).json({ message: "Failed to fetch delivery syncs" });
    }
  });

  // Update delivery sync status (admin only)
  app.patch('/api/delivery-sync/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const statusSchema = z.object({ 
        status: z.enum(['queued', 'processing', 'completed', 'failed']) 
      });
      const { status } = statusSchema.parse(req.body);
      const sync = await storage.updateDeliverySync(req.params.id, { status });
      
      if (!sync) {
        return res.status(404).json({ message: "Delivery sync not found" });
      }
      
      res.json(sync);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status value", errors: error.errors });
      }
      console.error("Error updating delivery sync:", error);
      res.status(500).json({ message: "Failed to update delivery sync" });
    }
  });

  // ==================== OBJECT STORAGE ROUTES ====================
  // Referenced from javascript_object_storage integration
  
  // Get presigned URL for file upload (authenticated users)
  app.post('/api/objects/upload', isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Download private objects with ACL check
  app.get('/objects/:objectPath(*)', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Create document record after upload (admin/clinical only)
  app.post('/api/admin/documents', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const uploaderId = req.user.claims.sub;
      const objectStorageService = new ObjectStorageService();
      
      // The document owner should be the patient (userId in body), not the uploader
      const documentOwnerId = req.body.userId;
      if (!documentOwnerId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      // Normalize the uploaded file URL and set ACL policy with patient as owner
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileUrl,
        {
          owner: documentOwnerId,
          visibility: "private"
        }
      );
      
      // Create document record in database
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        fileUrl: objectPath,
        uploadedBy: uploaderId
      });
      
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // ========================================
  // CONSULTANT ROUTES (Doctor Panel)
  // ========================================
  
  // Get assigned Clinical customers for consultant
  app.get('/api/consultant/customers', isAuthenticated, isConsultant, async (req: any, res) => {
    try {
      const customers = await storage.getClinicalCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching consultant customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Upload consultation report (Stage 1) or approval report (Stage 3)
  app.post('/api/consultant/upload-report', isAuthenticated, isConsultant, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      
      const objectStorageService = new ObjectStorageService();
      
      // Set ACL with patient as owner
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(req.body.url, {
        owner: req.body.userId,
        visibility: "private"
      });
      
      // Validate and create document
      const documentData = insertDocumentSchema.parse({
        userId: req.body.userId,
        stage: req.body.stage,
        label: req.body.label,
        url: objectPath,
        uploadedByRole: 'consultant'
      });
      
      const document = await storage.createDocument(documentData);
      
      // Log activity
      const activityData = insertStaffActivityLogSchema.parse({
        staffId,
        customerId: req.body.userId,
        actionType: 'report_upload',
        stage: req.body.stage,
        description: `Uploaded ${req.body.label} for stage ${req.body.stage}`,
        metadata: { documentId: document.id }
      });
      await storage.createStaffActivity(activityData);
      
      // Update stage progress to completed
      const stageProgresses = await storage.getUserStageProgress(req.body.userId);
      const stageProgress = stageProgresses.find(s => s.stage === req.body.stage);
      if (stageProgress) {
        await storage.updateStageProgress(stageProgress.id, { status: 'completed' });
      }
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error uploading consultant report:", error);
      res.status(500).json({ message: "Failed to upload report" });
    }
  });

  // ========================================
  // LAB TECHNICIAN ROUTES
  // ========================================
  
  // Get assigned Clinical customers for lab technician
  app.get('/api/lab/customers', isAuthenticated, isLabTechnician, async (req: any, res) => {
    try {
      const customers = await storage.getClinicalCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching lab customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Upload test report (Stage 2)
  app.post('/api/lab/upload-report', isAuthenticated, isLabTechnician, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      
      const objectStorageService = new ObjectStorageService();
      
      // Set ACL with patient as owner
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(req.body.url, {
        owner: req.body.userId,
        visibility: "private"
      });
      
      // Validate and create document for stage 2
      const documentData = insertDocumentSchema.parse({
        userId: req.body.userId,
        stage: 2,
        label: req.body.label,
        url: objectPath,
        uploadedByRole: 'lab_technician'
      });
      
      const document = await storage.createDocument(documentData);
      
      // Log activity
      const activityData = insertStaffActivityLogSchema.parse({
        staffId,
        customerId: req.body.userId,
        actionType: 'test_upload',
        stage: 2,
        description: `Uploaded test report: ${req.body.label}`,
        metadata: { documentId: document.id }
      });
      await storage.createStaffActivity(activityData);
      
      // Update stage 2 progress to completed
      const stageProgresses = await storage.getUserStageProgress(req.body.userId);
      const stageProgress = stageProgresses.find(s => s.stage === 2);
      if (stageProgress) {
        await storage.updateStageProgress(stageProgress.id, { status: 'completed' });
      }
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error uploading lab report:", error);
      res.status(500).json({ message: "Failed to upload report" });
    }
  });

  // ========================================
  // NUTRITIONIST ROUTES
  // ========================================
  
  // Get Clinical customers ready for diet chart (stage 3 completed)
  app.get('/api/nutritionist/customers', isAuthenticated, isNutritionist, async (req: any, res) => {
    try {
      const customers = await storage.getClinicalCustomers();
      
      // Filter customers where stage 3 is completed
      const customersWithProgress = await Promise.all(
        customers.map(async (customer) => {
          const stageProgress = await storage.getUserStageProgress(customer.id);
          const stage3 = stageProgress.find(s => s.stage === 3);
          return {
            ...customer,
            stage3Status: stage3?.status || 'pending'
          };
        })
      );
      
      res.json(customersWithProgress.filter(c => c.stage3Status === 'completed'));
    } catch (error) {
      console.error("Error fetching nutritionist customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Upload diet chart (Stage 4)
  app.post('/api/nutritionist/upload-diet-chart', isAuthenticated, isNutritionist, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      
      const objectStorageService = new ObjectStorageService();
      
      // Set ACL with patient as owner
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(req.body.url, {
        owner: req.body.userId,
        visibility: "private"
      });
      
      // Validate and create diet plan document
      const documentData = insertDocumentSchema.parse({
        userId: req.body.userId,
        stage: 4,
        label: req.body.label,
        url: objectPath,
        uploadedByRole: 'nutritionist'
      });
      
      const document = await storage.createDocument(documentData);
      
      // Create/update diet plan entry
      const existingDietPlan = await storage.getUserDietPlan(req.body.userId);
      if (existingDietPlan) {
        await storage.updateDietPlan(existingDietPlan.id, {
          pdfUrl: objectPath,
          macros: req.body.macros,
          weeklyPlan: req.body.weeklyPlan
        });
      } else {
        const dietPlanData = insertDietPlanSchema.parse({
          userId: req.body.userId,
          pdfUrl: objectPath,
          macros: req.body.macros,
          weeklyPlan: req.body.weeklyPlan
        });
        await storage.createDietPlan(dietPlanData);
      }
      
      // Log activity
      const activityData = insertStaffActivityLogSchema.parse({
        staffId,
        customerId: req.body.userId,
        actionType: 'diet_chart_upload',
        stage: 4,
        description: `Uploaded diet chart: ${req.body.label}`,
        metadata: { documentId: document.id }
      });
      await storage.createStaffActivity(activityData);
      
      // Update stage 4 progress to completed
      const stageProgresses = await storage.getUserStageProgress(req.body.userId);
      const stageProgress = stageProgresses.find(s => s.stage === 4);
      if (stageProgress) {
        await storage.updateStageProgress(stageProgress.id, { status: 'completed' });
      }
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error uploading diet chart:", error);
      res.status(500).json({ message: "Failed to upload diet chart" });
    }
  });

  // ========================================
  // CHEF ROUTES
  // ========================================
  
  // Get all active plans (both Clinical and AI)
  app.get('/api/chef/active-plans', isAuthenticated, isChef, async (req: any, res) => {
    try {
      // Get all users with active plans
      const allCustomers = await storage.getCustomers();
      
      const activePlans = await Promise.all(
        allCustomers.map(async (customer) => {
          const plan = await storage.getUserPlan(customer.id);
          const addresses = await storage.getUserAddresses(customer.id);
          const dietPlan = await storage.getUserDietPlan(customer.id);
          
          return {
            customer,
            plan,
            addresses,
            dietPlan
          };
        })
      );
      
      // Filter only active plans
      res.json(activePlans.filter(p => p.plan?.isActive));
    } catch (error) {
      console.error("Error fetching active plans:", error);
      res.status(500).json({ message: "Failed to fetch active plans" });
    }
  });

  // Mark meal as prepared
  app.post('/api/chef/mark-prepared', isAuthenticated, isChef, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      
      // Validate and log activity
      const activityData = insertStaffActivityLogSchema.parse({
        staffId,
        customerId: req.body.userId,
        actionType: 'meal_prepared',
        description: `Marked ${req.body.mealType} as prepared for ${req.body.date}`,
        metadata: { mealType: req.body.mealType, date: req.body.date }
      });
      
      await storage.createStaffActivity(activityData);
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error marking meal as prepared:", error);
      res.status(500).json({ message: "Failed to mark meal as prepared" });
    }
  });

  // ========================================
  // DELIVERY ROUTES
  // ========================================
  
  // Get assigned deliveries
  app.get('/api/delivery/assigned', isAuthenticated, isDelivery, async (req: any, res) => {
    try {
      const deliveryPersonId = req.user.claims.sub;
      
      // Get orders assigned to this delivery person (both prepared and in_transit)
      const preparedOrders = await storage.getOrdersByStatus('prepared');
      const inTransitOrders = await storage.getOrdersByStatus('in_transit');
      const allOrders = [...preparedOrders, ...inTransitOrders];
      const assignedOrders = allOrders.filter(o => o.assignedDeliveryPersonId === deliveryPersonId);
      
      res.json(assignedOrders);
    } catch (error) {
      console.error("Error fetching assigned deliveries:", error);
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  // Update delivery status
  app.patch('/api/delivery/status/:orderId', isAuthenticated, isDelivery, async (req: any, res) => {
    try {
      const { orderId } = req.params;
      const deliveryPersonId = req.user.claims.sub;
      
      const order = await storage.updateOrderStatus(orderId, req.body.status);
      
      if (order && req.body.status === 'delivered') {
        const activityData = insertStaffActivityLogSchema.parse({
          staffId: deliveryPersonId,
          customerId: order.userId,
          actionType: 'delivery_completed',
          description: `Delivered order ${orderId}`,
          metadata: { orderId, deliveredAt: new Date() }
        });
        await storage.createStaffActivity(activityData);
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error updating delivery status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Update delivery location (GPS tracking)
  app.post('/api/delivery/location', isAuthenticated, isDelivery, async (req: any, res) => {
    try {
      const deliveryPersonId = req.user.claims.sub;
      
      const locationData = insertDeliveryLocationSchema.parse({
        deliveryPersonId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        status: req.body.status || 'on_duty'
      });
      
      const location = await storage.upsertDeliveryLocation(locationData);
      
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      console.error("Error updating delivery location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // ========================================
  // ACKNOWLEDGEMENT ROUTES (All Clinical Staff)
  // ========================================
  
  // Create acknowledgement
  app.post('/api/acknowledgements', isAuthenticated, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      
      const ackData = insertAcknowledgementSchema.parse({
        staffId,
        customerId: req.body.customerId,
        taskType: req.body.taskType,
        stage: req.body.stage,
        status: req.body.status || 'pending',
        acknowledgedAt: new Date()
      });
      
      const ack = await storage.createAcknowledgement(ackData);
      
      // Log activity
      const activityData = insertStaffActivityLogSchema.parse({
        staffId,
        customerId: ackData.customerId,
        actionType: 'task_acknowledged',
        stage: ackData.stage,
        description: `Acknowledged task: ${ackData.taskType}`,
        metadata: { acknowledgementId: ack.id }
      });
      
      await storage.createStaffActivity(activityData);
      
      res.json(ack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid acknowledgement data", errors: error.errors });
      }
      console.error("Error creating acknowledgement:", error);
      res.status(500).json({ message: "Failed to create acknowledgement" });
    }
  });

  // Update acknowledgement status
  app.patch('/api/acknowledgements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      const { id } = req.params;
      
      // Validate status field
      const statusSchema = z.enum(['pending', 'acknowledged', 'completed']);
      const status = statusSchema.parse(req.body.status);
      
      const updates: { status: 'pending' | 'acknowledged' | 'completed'; acknowledgedAt?: Date } = {
        status
      };
      
      // Set acknowledgedAt only when status becomes 'acknowledged' or 'completed'
      if (status === 'acknowledged' || status === 'completed') {
        updates.acknowledgedAt = new Date();
      }
      
      const ack = await storage.updateAcknowledgement(id, updates);
      
      if (!ack) {
        return res.status(404).json({ message: "Acknowledgement not found" });
      }
      
      // Log activity
      const activityData = insertStaffActivityLogSchema.parse({
        staffId,
        customerId: ack.customerId,
        actionType: 'task_acknowledged',
        stage: ack.stage,
        description: `Updated task status: ${ack.taskType} to ${status}`,
        metadata: { acknowledgementId: ack.id, status }
      });
      await storage.createStaffActivity(activityData);
      
      res.json(ack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error updating acknowledgement:", error);
      res.status(500).json({ message: "Failed to update acknowledgement" });
    }
  });

  // Get staff acknowledgements
  app.get('/api/acknowledgements/staff', isAuthenticated, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      const acknowledgements = await storage.getStaffAcknowledgements(staffId);
      res.json(acknowledgements);
    } catch (error) {
      console.error("Error fetching acknowledgements:", error);
      res.status(500).json({ message: "Failed to fetch acknowledgements" });
    }
  });

  // Get all acknowledgements (admin only)
  app.get('/api/admin/acknowledgements', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const acknowledgements = await storage.getAllAcknowledgements();
      res.json(acknowledgements);
    } catch (error) {
      console.error("Error fetching all acknowledgements:", error);
      res.status(500).json({ message: "Failed to fetch acknowledgements" });
    }
  });

  // ========================================
  // STAFF ACTIVITY LOG ROUTES
  // ========================================
  
  // Get staff activities (own activities)
  app.get('/api/activities/staff', isAuthenticated, async (req: any, res) => {
    try {
      const staffId = req.user.claims.sub;
      const activities = await storage.getStaffActivities(staffId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching staff activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Get all staff activities (admin only)
  app.get('/api/admin/activities', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const activities = await storage.getAllStaffActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching all activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Get customer activities (admin only)
  app.get('/api/admin/activities/:customerId', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { customerId } = req.params;
      const activities = await storage.getCustomerActivities(customerId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching customer activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // ========================================
  // ADMIN - DELIVERY TRACKING ROUTES
  // ========================================
  
  // Get all delivery locations (admin only)
  app.get('/api/admin/delivery-locations', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const locations = await storage.getAllDeliveryLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching delivery locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Get staff by role (admin only)
  app.get('/api/admin/staff/:role', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { role } = req.params;
      const staff = await storage.getStaffByRole(role);
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff by role:", error);
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
