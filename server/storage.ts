import { type User, type UpsertUser, type InsertUser, type CustomerProfile, type InsertCustomerProfile, type Subscription, type InsertSubscription, type Milestone, type InsertMilestone, type Report, type InsertReport, type Consultation, type InsertConsultation, type Order, type InsertOrder, type PaymentSession, type InsertPaymentSession } from "@shared/schema";
import { randomUUID } from "crypto";

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
  updateMilestone(id: string, status: string): Promise<Milestone | undefined>;
  
  getUserReports(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
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
  private orders: Map<string, Order>;
  private paymentSessions: Map<string, PaymentSession>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.milestones = new Map();
    this.reports = new Map();
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
      stripeSessionId: insertSession.stripeSessionId || null,
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

export const storage = new MemStorage();
