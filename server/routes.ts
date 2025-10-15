import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertReportSchema, 
  insertOrderSchema,
  insertPlanSchema,
  insertStageProgressSchema,
  insertDocumentSchema,
  insertDietPlanSchema,
  insertAddressSchema,
  insertDeliverySyncSchema
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
  app.post('/api/signup-with-consultation', async (req, res) => {
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
      
      res.json({ 
        success: true, 
        userId: user.id, 
        paymentSessionId: paymentSession.id,
        consultationId: consultation.id,
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

  const httpServer = createServer(app);

  return httpServer;
}
