import { type User, type UpsertUser, type InsertUser, type CustomerProfile, type InsertCustomerProfile, type Subscription, type InsertSubscription, type Milestone, type InsertMilestone, type Report, type InsertReport, type Consultation, type InsertConsultation, type Order, type InsertOrder, type PaymentSession, type InsertPaymentSession, users, customerProfiles, milestones, reports, consultations, orders, paymentSessions, subscriptions, mealPlans, notifications } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  getCustomers(): Promise<User[]>;
  
  getCustomerProfile(userId: string): Promise<CustomerProfile | undefined>;
  createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile>;
  updateCustomerProfile(id: string, profile: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined>;
  
  getUserMilestones(userId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: string, status: string): Promise<Milestone | undefined>;
  
  getUserReports(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getUserConsultations(userId: string): Promise<Consultation[]>;
  
  getOrdersByStatus(status: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  createPaymentSession(session: InsertPaymentSession): Promise<PaymentSession>;
  getPaymentSession(id: string): Promise<PaymentSession | undefined>;
  updatePaymentSession(id: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, CustomerProfile>;
  private milestones: Map<string, Milestone>;
  private reports: Map<string, Report>;
  private consultations: Map<string, Consultation>;
  private orders: Map<string, Order>;
  private paymentSessions: Map<string, PaymentSession>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.milestones = new Map();
    this.reports = new Map();
    this.consultations = new Map();
    this.orders = new Map();
    this.paymentSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async upsertUser(upsertUser: UpsertUser): Promise<User> {
    const existingUser = upsertUser.id ? this.users.get(upsertUser.id) : undefined;
    const user: User = {
      id: upsertUser.id || randomUUID(),
      email: upsertUser.email || null,
      firstName: upsertUser.firstName || null,
      lastName: upsertUser.lastName || null,
      phone: upsertUser.phone || existingUser?.phone || null,
      profileImageUrl: upsertUser.profileImageUrl || null,
      characterImageUrl: upsertUser.characterImageUrl || existingUser?.characterImageUrl || null,
      characterType: upsertUser.characterType || existingUser?.characterType || null,
      role: upsertUser.role || existingUser?.role || 'customer',
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      characterImageUrl: insertUser.characterImageUrl || null,
      characterType: insertUser.characterType || null,
      role: insertUser.role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getCustomers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'customer'
    );
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createCustomerProfile(insertProfile: InsertCustomerProfile): Promise<CustomerProfile> {
    const id = randomUUID();
    const profile: CustomerProfile = {
      ...insertProfile,
      id,
      age: insertProfile.age || null,
      gender: insertProfile.gender || null,
      weight: insertProfile.weight || null,
      height: insertProfile.height || null,
      goal: insertProfile.goal || null,
      activityLevel: insertProfile.activityLevel || null,
      healthConcerns: insertProfile.healthConcerns || null,
      medications: insertProfile.medications || null,
      dietaryPreference: insertProfile.dietaryPreference || null,
      allergies: insertProfile.allergies || null,
      mealsPerDay: insertProfile.mealsPerDay || null,
      flavorPreference: insertProfile.flavorPreference || null,
      wakeUpTime: insertProfile.wakeUpTime || null,
      sleepTime: insertProfile.sleepTime || null,
      lateNightEating: insertProfile.lateNightEating || null,
      alcoholConsumption: insertProfile.alcoholConsumption || null,
      waterIntake: insertProfile.waterIntake || null,
      snacksAndDesserts: insertProfile.snacksAndDesserts || null,
      dailyBudget: insertProfile.dailyBudget || null,
      resultsTimeline: insertProfile.resultsTimeline || null,
      quizAnswers: insertProfile.quizAnswers || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateCustomerProfile(id: string, updates: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;
    
    const updated: CustomerProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updated);
    return updated;
  }

  async getUserMilestones(userId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).filter(
      (milestone) => milestone.userId === userId,
    ).sort((a, b) => a.order - b.order);
  }

  async updateMilestone(id: string, status: string): Promise<Milestone | undefined> {
    const milestone = this.milestones.get(id);
    if (!milestone) return undefined;
    
    const updated: Milestone = {
      ...milestone,
      status,
      completedAt: status === 'completed' ? new Date() : milestone.completedAt,
    };
    this.milestones.set(id, updated);
    return updated;
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId,
    );
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      ...insertReport,
      id,
      fileUrl: insertReport.fileUrl || null,
      summary: insertReport.summary || null,
      data: insertReport.data || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = randomUUID();
    const milestone: Milestone = {
      ...insertMilestone,
      id,
      status: insertMilestone.status || 'locked',
      completedAt: null,
      createdAt: new Date(),
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      status: insertConsultation.status || 'scheduled',
      doctorName: insertConsultation.doctorName || null,
      consultantId: insertConsultation.consultantId || null,
      notes: insertConsultation.notes || null,
      createdAt: new Date(),
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getUserConsultations(userId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId
    );
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === status
    );
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated: Order = {
      ...order,
      status,
      deliveredAt: status === 'delivered' ? new Date() : order.deliveredAt,
    };
    this.orders.set(id, updated);
    return updated;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      id,
      userId: insertOrder.userId,
      mealPlanId: insertOrder.mealPlanId || null,
      deliveryDate: insertOrder.deliveryDate,
      deliveryAddress: insertOrder.deliveryAddress,
      status: insertOrder.status || 'pending',
      assignedDeliveryPersonId: insertOrder.assignedDeliveryPersonId || null,
      deliveredAt: null,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async createPaymentSession(insertSession: InsertPaymentSession): Promise<PaymentSession> {
    const id = randomUUID();
    const session: PaymentSession = {
      id,
      userId: insertSession.userId,
      consultationDate: insertSession.consultationDate,
      planType: insertSession.planType,
      amount: insertSession.amount,
      status: insertSession.status || 'pending',
      paymentMethod: insertSession.paymentMethod || null,
      razorpayOrderId: null,
      completedAt: null,
      createdAt: new Date(),
    };
    this.paymentSessions.set(id, session);
    return session;
  }

  async getPaymentSession(id: string): Promise<PaymentSession | undefined> {
    return this.paymentSessions.get(id);
  }

  async updatePaymentSession(id: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined> {
    const session = this.paymentSessions.get(id);
    if (!session) return undefined;
    
    const updated: PaymentSession = {
      ...session,
      ...updates,
      completedAt: updates.status === 'completed' ? new Date() : session.completedAt,
    };
    this.paymentSessions.set(id, updated);
    return updated;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }
}

// Database Storage Implementation using Drizzle ORM
export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async upsertUser(upsertUser: UpsertUser): Promise<User> {
    // First check if user exists by ID
    if (upsertUser.id) {
      const existing = await this.getUser(upsertUser.id);
      if (existing) {
        const [updated] = await db.update(users)
          .set({
            email: upsertUser.email || existing.email,
            firstName: upsertUser.firstName || existing.firstName,
            lastName: upsertUser.lastName || existing.lastName,
            phone: upsertUser.phone || existing.phone,
            profileImageUrl: upsertUser.profileImageUrl || existing.profileImageUrl,
            characterImageUrl: upsertUser.characterImageUrl || existing.characterImageUrl,
            characterType: upsertUser.characterType || existing.characterType,
            role: upsertUser.role || existing.role,
            updatedAt: new Date(),
          })
          .where(eq(users.id, upsertUser.id))
          .returning();
        return updated;
      }
    }
    
    // Check if user exists by email (important for Replit Auth login after signup)
    if (upsertUser.email && upsertUser.id) {
      const existingByEmail = await this.getUserByEmail(upsertUser.email);
      if (existingByEmail && existingByEmail.id !== upsertUser.id) {
        // User signed up with email, now logging in with OIDC
        // We need to migrate all data to the OIDC ID
        const oldId = existingByEmail.id;
        const newId = upsertUser.id;
        
        // Use a transaction to ensure atomic migration
        return await db.transaction(async (tx) => {
          // 1. Temporarily clear the email from old user to free up the unique constraint
          await tx.update(users)
            .set({ email: null })
            .where(eq(users.id, oldId));
          
          // 2. Create the new user with OIDC ID and the email
          const [newUser] = await tx.insert(users).values({
            id: newId,
            email: upsertUser.email,
            firstName: upsertUser.firstName || existingByEmail.firstName,
            lastName: upsertUser.lastName || existingByEmail.lastName,
            phone: existingByEmail.phone,
            profileImageUrl: upsertUser.profileImageUrl || existingByEmail.profileImageUrl,
            characterImageUrl: existingByEmail.characterImageUrl,
            characterType: existingByEmail.characterType,
            role: existingByEmail.role,
          }).returning();
          
          // 3. Migrate all related records to use the new OIDC ID
          // Update primary user foreign keys
          await tx.update(consultations)
            .set({ userId: newId })
            .where(eq(consultations.userId, oldId));
          
          await tx.update(milestones)
            .set({ userId: newId })
            .where(eq(milestones.userId, oldId));
          
          await tx.update(paymentSessions)
            .set({ userId: newId })
            .where(eq(paymentSessions.userId, oldId));
          
          await tx.update(customerProfiles)
            .set({ userId: newId })
            .where(eq(customerProfiles.userId, oldId));
          
          await tx.update(reports)
            .set({ userId: newId })
            .where(eq(reports.userId, oldId));
          
          await tx.update(subscriptions)
            .set({ userId: newId })
            .where(eq(subscriptions.userId, oldId));
          
          await tx.update(orders)
            .set({ userId: newId })
            .where(eq(orders.userId, oldId));
          
          await tx.update(mealPlans)
            .set({ userId: newId })
            .where(eq(mealPlans.userId, oldId));
          
          await tx.update(notifications)
            .set({ userId: newId })
            .where(eq(notifications.userId, oldId));
          
          // Update optional user foreign keys (consultantId, assignedDeliveryPersonId)
          await tx.update(consultations)
            .set({ consultantId: newId })
            .where(eq(consultations.consultantId, oldId));
          
          await tx.update(orders)
            .set({ assignedDeliveryPersonId: newId })
            .where(eq(orders.assignedDeliveryPersonId, oldId));
          
          // 4. Finally, delete the old user record (now with null email)
          await tx.delete(users).where(eq(users.id, oldId));
          
          return newUser;
        });
      }
    }
    
    // Create new user if doesn't exist
    const [newUser] = await db.insert(users).values({
      id: upsertUser.id,
      email: upsertUser.email || null,
      firstName: upsertUser.firstName || null,
      lastName: upsertUser.lastName || null,
      phone: upsertUser.phone || null,
      profileImageUrl: upsertUser.profileImageUrl || null,
      characterImageUrl: upsertUser.characterImageUrl || null,
      characterType: upsertUser.characterType || null,
      role: upsertUser.role || 'customer',
    }).returning();
    return newUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCustomers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'customer'));
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> {
    const result = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, userId));
    return result[0];
  }

  async createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile> {
    const [created] = await db.insert(customerProfiles).values(profile).returning();
    return created;
  }

  async updateCustomerProfile(id: string, profile: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined> {
    const [updated] = await db.update(customerProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(customerProfiles.id, id))
      .returning();
    return updated;
  }

  async getUserMilestones(userId: string): Promise<Milestone[]> {
    return await db.select().from(milestones).where(eq(milestones.userId, userId));
  }

  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const [created] = await db.insert(milestones).values(milestone).returning();
    return created;
  }

  async updateMilestone(id: string, status: string): Promise<Milestone | undefined> {
    const [updated] = await db.update(milestones)
      .set({ 
        status, 
        completedAt: status === 'completed' ? new Date() : null 
      })
      .where(eq(milestones.id, id))
      .returning();
    return updated;
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.userId, userId));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [created] = await db.insert(reports).values(report).returning();
    return created;
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [created] = await db.insert(consultations).values(consultation).returning();
    return created;
  }

  async getUserConsultations(userId: string): Promise<Consultation[]> {
    return await db.select().from(consultations).where(eq(consultations.userId, userId));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.status, status));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set({ 
        status,
        deliveredAt: status === 'delivered' ? new Date() : null
      })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async createPaymentSession(session: InsertPaymentSession): Promise<PaymentSession> {
    const [created] = await db.insert(paymentSessions).values(session).returning();
    return created;
  }

  async getPaymentSession(id: string): Promise<PaymentSession | undefined> {
    const result = await db.select().from(paymentSessions).where(eq(paymentSessions.id, id));
    return result[0];
  }

  async updatePaymentSession(id: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined> {
    const [updated] = await db.update(paymentSessions)
      .set(updates)
      .where(eq(paymentSessions.id, id))
      .returning();
    return updated;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }
}

// Use Database Storage for production persistence
export const storage = new DbStorage();

// Keep MemStorage available for testing
export const memStorage = new MemStorage();
