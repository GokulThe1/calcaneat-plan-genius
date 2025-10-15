import { type User, type UpsertUser, type InsertUser, type CustomerProfile, type InsertCustomerProfile, type Subscription, type InsertSubscription, type Milestone, type InsertMilestone, type Report, type InsertReport, type Consultation, type InsertConsultation, type Order, type InsertOrder, type PaymentSession, type InsertPaymentSession, type Plan, type InsertPlan, type StageProgress, type InsertStageProgress, type Document, type InsertDocument, type DietPlan, type InsertDietPlan, type Address, type InsertAddress, type DeliverySync, type InsertDeliverySync, type Acknowledgement, type InsertAcknowledgement, type StaffActivityLog, type InsertStaffActivityLog, type DeliveryLocation, type InsertDeliveryLocation, users, customerProfiles, milestones, reports, consultations, orders, paymentSessions, subscriptions, mealPlans, notifications, plans, stageProgress, documents, dietPlans, addresses, deliverySync, acknowledgements, staffActivityLog, deliveryLocation } from "@shared/schema";
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
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  createPaymentSession(session: InsertPaymentSession): Promise<PaymentSession>;
  getPaymentSession(id: string): Promise<PaymentSession | undefined>;
  updatePaymentSession(id: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // New Clinical Plan methods
  createPlan(plan: InsertPlan): Promise<Plan>;
  getPlan(id: string): Promise<Plan | undefined>;
  getUserPlan(userId: string): Promise<Plan | undefined>;
  updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | undefined>;
  
  getUserStageProgress(userId: string): Promise<StageProgress[]>;
  createStageProgress(stage: InsertStageProgress): Promise<StageProgress>;
  updateStageProgress(id: string, updates: Partial<StageProgress>): Promise<StageProgress | undefined>;
  
  getUserDocuments(userId: string): Promise<Document[]>;
  getDocumentsByStage(userId: string, stage: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  getUserDietPlan(userId: string): Promise<DietPlan | undefined>;
  createDietPlan(dietPlan: InsertDietPlan): Promise<DietPlan>;
  updateDietPlan(id: string, updates: Partial<DietPlan>): Promise<DietPlan | undefined>;
  
  getUserAddresses(userId: string): Promise<Address[]>;
  getAddress(id: string): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: string, updates: Partial<Address>): Promise<Address | undefined>;
  deleteAddress(id: string): Promise<boolean>;
  
  createDeliverySync(sync: InsertDeliverySync): Promise<DeliverySync>;
  getUserDeliverySyncs(userId: string): Promise<DeliverySync[]>;
  updateDeliverySync(id: string, updates: Partial<DeliverySync>): Promise<DeliverySync | undefined>;
  
  // Acknowledgement methods
  createAcknowledgement(ack: InsertAcknowledgement): Promise<Acknowledgement>;
  getStaffAcknowledgements(staffId: string): Promise<Acknowledgement[]>;
  getCustomerAcknowledgements(customerId: string): Promise<Acknowledgement[]>;
  updateAcknowledgement(id: string, updates: Partial<Acknowledgement>): Promise<Acknowledgement | undefined>;
  getAllAcknowledgements(): Promise<Acknowledgement[]>;
  
  // Staff Activity Log methods
  createStaffActivity(activity: InsertStaffActivityLog): Promise<StaffActivityLog>;
  getStaffActivities(staffId: string): Promise<StaffActivityLog[]>;
  getCustomerActivities(customerId: string): Promise<StaffActivityLog[]>;
  getAllStaffActivities(): Promise<StaffActivityLog[]>;
  
  // Delivery Location methods
  upsertDeliveryLocation(location: InsertDeliveryLocation): Promise<DeliveryLocation>;
  getDeliveryLocation(deliveryPersonId: string): Promise<DeliveryLocation | undefined>;
  getAllDeliveryLocations(): Promise<DeliveryLocation[]>;
  updateDeliveryLocation(deliveryPersonId: string, updates: Partial<DeliveryLocation>): Promise<DeliveryLocation | undefined>;
  
  // Staff assignment methods
  getStaffByRole(role: string): Promise<User[]>;
  getClinicalCustomers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, CustomerProfile>;
  private milestones: Map<string, Milestone>;
  private reports: Map<string, Report>;
  private consultations: Map<string, Consultation>;
  private orders: Map<string, Order>;
  private paymentSessions: Map<string, PaymentSession>;
  private plans: Map<string, Plan>;
  private stageProgress: Map<string, StageProgress>;
  private documents: Map<string, Document>;
  private dietPlans: Map<string, DietPlan>;
  private addresses: Map<string, Address>;
  private deliverySyncs: Map<string, DeliverySync>;
  private acknowledgements: Map<string, Acknowledgement>;
  private staffActivities: Map<string, StaffActivityLog>;
  private deliveryLocations: Map<string, DeliveryLocation>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.milestones = new Map();
    this.reports = new Map();
    this.consultations = new Map();
    this.orders = new Map();
    this.paymentSessions = new Map();
    this.plans = new Map();
    this.stageProgress = new Map();
    this.documents = new Map();
    this.dietPlans = new Map();
    this.addresses = new Map();
    this.deliverySyncs = new Map();
    this.acknowledgements = new Map();
    this.staffActivities = new Map();
    this.deliveryLocations = new Map();
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
      consultationFeePaid: insertConsultation.consultationFeePaid || null,
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

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated: Order = {
      ...order,
      ...data,
      id: order.id, // Preserve ID
      createdAt: order.createdAt // Preserve creation date
    };
    this.orders.set(id, updated);
    return updated;
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

  // Plan methods
  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = randomUUID();
    const plan: Plan = {
      ...insertPlan,
      id,
      type: insertPlan.type || 'Clinical',
      discountAmount: insertPlan.discountAmount || '0',
      consultationFeeCredited: insertPlan.consultationFeeCredited || '0',
      isActive: insertPlan.isActive || false,
      durationDays: insertPlan.durationDays || 30,
      listPrice: insertPlan.listPrice || null,
      finalPayable: insertPlan.finalPayable || null,
      startDate: insertPlan.startDate || null,
      createdAt: new Date(),
    };
    this.plans.set(id, plan);
    return plan;
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async getUserPlan(userId: string): Promise<Plan | undefined> {
    return Array.from(this.plans.values()).find(p => p.userId === userId && p.isActive);
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | undefined> {
    const plan = this.plans.get(id);
    if (!plan) return undefined;
    const updated: Plan = { ...plan, ...updates };
    this.plans.set(id, updated);
    return updated;
  }

  // Stage Progress methods
  async getUserStageProgress(userId: string): Promise<StageProgress[]> {
    return Array.from(this.stageProgress.values()).filter(s => s.userId === userId);
  }

  async createStageProgress(insertStage: InsertStageProgress): Promise<StageProgress> {
    const id = randomUUID();
    const stage: StageProgress = {
      ...insertStage,
      id,
      status: insertStage.status || 'pending',
      updatedAt: new Date(),
    };
    this.stageProgress.set(id, stage);
    return stage;
  }

  async updateStageProgress(id: string, updates: Partial<StageProgress>): Promise<StageProgress | undefined> {
    const stage = this.stageProgress.get(id);
    if (!stage) return undefined;
    const updated: StageProgress = { ...stage, ...updates, updatedAt: new Date() };
    this.stageProgress.set(id, updated);
    return updated;
  }

  // Document methods
  async getUserDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.userId === userId);
  }

  async getDocumentsByStage(userId: string, stage: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      d => d.userId === userId && d.stage === stage
    );
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDoc,
      id,
      stage: insertDoc.stage || null,
      label: insertDoc.label || null,
      uploadedByRole: insertDoc.uploadedByRole || null,
      mimeType: insertDoc.mimeType || null,
      meta: insertDoc.meta || null,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  // Diet Plan methods
  async getUserDietPlan(userId: string): Promise<DietPlan | undefined> {
    return Array.from(this.dietPlans.values()).find(d => d.userId === userId);
  }

  async createDietPlan(insertDietPlan: InsertDietPlan): Promise<DietPlan> {
    const id = randomUUID();
    const dietPlan: DietPlan = {
      ...insertDietPlan,
      id,
      macros: insertDietPlan.macros || null,
      weeklyPlan: insertDietPlan.weeklyPlan || null,
      pdfUrl: insertDietPlan.pdfUrl || null,
      createdAt: new Date(),
    };
    this.dietPlans.set(id, dietPlan);
    return dietPlan;
  }

  async updateDietPlan(id: string, updates: Partial<DietPlan>): Promise<DietPlan | undefined> {
    const dietPlan = this.dietPlans.get(id);
    if (!dietPlan) return undefined;
    const updated: DietPlan = { ...dietPlan, ...updates };
    this.dietPlans.set(id, updated);
    return updated;
  }

  // Address methods
  async getUserAddresses(userId: string): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter(a => a.userId === userId);
  }

  async getAddress(id: string): Promise<Address | undefined> {
    return this.addresses.get(id);
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = randomUUID();
    const address: Address = {
      ...insertAddress,
      id,
      label: insertAddress.label || null,
      line1: insertAddress.line1 || null,
      line2: insertAddress.line2 || null,
      city: insertAddress.city || null,
      state: insertAddress.state || null,
      pincode: insertAddress.pincode || null,
      isDefault: insertAddress.isDefault || false,
      breakfast: insertAddress.breakfast || false,
      lunch: insertAddress.lunch || false,
      dinner: insertAddress.dinner || false,
      createdAt: new Date(),
    };
    this.addresses.set(id, address);
    return address;
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) return undefined;
    const updated: Address = { ...address, ...updates };
    this.addresses.set(id, updated);
    return updated;
  }

  async deleteAddress(id: string): Promise<boolean> {
    return this.addresses.delete(id);
  }

  // Delivery Sync methods
  async createDeliverySync(insertSync: InsertDeliverySync): Promise<DeliverySync> {
    const id = randomUUID();
    const sync: DeliverySync = {
      ...insertSync,
      id,
      planId: insertSync.planId || null,
      payload: insertSync.payload || null,
      status: insertSync.status || 'queued',
      createdAt: new Date(),
    };
    this.deliverySyncs.set(id, sync);
    return sync;
  }

  async getUserDeliverySyncs(userId: string): Promise<DeliverySync[]> {
    return Array.from(this.deliverySyncs.values()).filter(s => s.userId === userId);
  }

  async updateDeliverySync(id: string, updates: Partial<DeliverySync>): Promise<DeliverySync | undefined> {
    const sync = this.deliverySyncs.get(id);
    if (!sync) return undefined;
    const updated: DeliverySync = { ...sync, ...updates };
    this.deliverySyncs.set(id, updated);
    return updated;
  }

  // Acknowledgement methods
  async createAcknowledgement(insertAck: InsertAcknowledgement): Promise<Acknowledgement> {
    const id = randomUUID();
    const ack: Acknowledgement = {
      ...insertAck,
      id,
      status: insertAck.status || 'pending',
      stage: insertAck.stage || null,
      acknowledgedAt: insertAck.acknowledgedAt || null,
      completedAt: insertAck.completedAt || null,
      createdAt: new Date(),
    };
    this.acknowledgements.set(id, ack);
    return ack;
  }

  async getStaffAcknowledgements(staffId: string): Promise<Acknowledgement[]> {
    return Array.from(this.acknowledgements.values()).filter(a => a.staffId === staffId);
  }

  async getCustomerAcknowledgements(customerId: string): Promise<Acknowledgement[]> {
    return Array.from(this.acknowledgements.values()).filter(a => a.customerId === customerId);
  }

  async updateAcknowledgement(id: string, updates: Partial<Acknowledgement>): Promise<Acknowledgement | undefined> {
    const ack = this.acknowledgements.get(id);
    if (!ack) return undefined;
    const updated: Acknowledgement = { ...ack, ...updates };
    this.acknowledgements.set(id, updated);
    return updated;
  }

  async getAllAcknowledgements(): Promise<Acknowledgement[]> {
    return Array.from(this.acknowledgements.values());
  }

  // Staff Activity Log methods
  async createStaffActivity(insertActivity: InsertStaffActivityLog): Promise<StaffActivityLog> {
    const id = randomUUID();
    const activity: StaffActivityLog = {
      ...insertActivity,
      id,
      customerId: insertActivity.customerId || null,
      stage: insertActivity.stage || null,
      description: insertActivity.description || null,
      metadata: insertActivity.metadata || null,
      createdAt: new Date(),
    };
    this.staffActivities.set(id, activity);
    return activity;
  }

  async getStaffActivities(staffId: string): Promise<StaffActivityLog[]> {
    return Array.from(this.staffActivities.values()).filter(a => a.staffId === staffId);
  }

  async getCustomerActivities(customerId: string): Promise<StaffActivityLog[]> {
    return Array.from(this.staffActivities.values()).filter(a => a.customerId === customerId);
  }

  async getAllStaffActivities(): Promise<StaffActivityLog[]> {
    return Array.from(this.staffActivities.values());
  }

  // Delivery Location methods
  async upsertDeliveryLocation(insertLocation: InsertDeliveryLocation): Promise<DeliveryLocation> {
    const existing = Array.from(this.deliveryLocations.values()).find(
      l => l.deliveryPersonId === insertLocation.deliveryPersonId
    );
    
    if (existing) {
      const updated: DeliveryLocation = {
        ...existing,
        ...insertLocation,
        lastUpdated: new Date(),
      };
      this.deliveryLocations.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const location: DeliveryLocation = {
      ...insertLocation,
      id,
      status: insertLocation.status || 'idle',
      lastUpdated: new Date(),
    };
    this.deliveryLocations.set(id, location);
    return location;
  }

  async getDeliveryLocation(deliveryPersonId: string): Promise<DeliveryLocation | undefined> {
    return Array.from(this.deliveryLocations.values()).find(l => l.deliveryPersonId === deliveryPersonId);
  }

  async getAllDeliveryLocations(): Promise<DeliveryLocation[]> {
    return Array.from(this.deliveryLocations.values());
  }

  async updateDeliveryLocation(deliveryPersonId: string, updates: Partial<DeliveryLocation>): Promise<DeliveryLocation | undefined> {
    const location = Array.from(this.deliveryLocations.values()).find(l => l.deliveryPersonId === deliveryPersonId);
    if (!location) return undefined;
    const updated: DeliveryLocation = { ...location, ...updates, lastUpdated: new Date() };
    this.deliveryLocations.set(location.id, updated);
    return updated;
  }

  // Staff assignment methods
  async getStaffByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.role === role);
  }

  async getClinicalCustomers(): Promise<User[]> {
    const clinicalPlanUsers = Array.from(this.plans.values())
      .filter(p => p.type === 'Clinical')
      .map(p => p.userId);
    return Array.from(this.users.values()).filter(u => clinicalPlanUsers.includes(u.id));
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
          
          // Update new clinical plan tables
          await tx.update(plans)
            .set({ userId: newId })
            .where(eq(plans.userId, oldId));
          
          await tx.update(stageProgress)
            .set({ userId: newId })
            .where(eq(stageProgress.userId, oldId));
          
          await tx.update(documents)
            .set({ userId: newId })
            .where(eq(documents.userId, oldId));
          
          await tx.update(dietPlans)
            .set({ userId: newId })
            .where(eq(dietPlans.userId, oldId));
          
          await tx.update(addresses)
            .set({ userId: newId })
            .where(eq(addresses.userId, oldId));
          
          await tx.update(deliverySync)
            .set({ userId: newId })
            .where(eq(deliverySync.userId, oldId));
          
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

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set(data)
      .where(eq(orders.id, id))
      .returning();
    return updated;
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

  // Plan methods
  async createPlan(plan: InsertPlan): Promise<Plan> {
    const [created] = await db.insert(plans).values(plan).returning();
    return created;
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    const result = await db.select().from(plans).where(eq(plans.id, id));
    return result[0];
  }

  async getUserPlan(userId: string): Promise<Plan | undefined> {
    const result = await db.select().from(plans)
      .where(and(eq(plans.userId, userId), eq(plans.isActive, true)));
    return result[0];
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | undefined> {
    const [updated] = await db.update(plans)
      .set(updates)
      .where(eq(plans.id, id))
      .returning();
    return updated;
  }

  // Stage Progress methods
  async getUserStageProgress(userId: string): Promise<StageProgress[]> {
    return await db.select().from(stageProgress).where(eq(stageProgress.userId, userId));
  }

  async createStageProgress(stage: InsertStageProgress): Promise<StageProgress> {
    const [created] = await db.insert(stageProgress).values(stage).returning();
    return created;
  }

  async updateStageProgress(id: string, updates: Partial<StageProgress>): Promise<StageProgress | undefined> {
    const [updated] = await db.update(stageProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(stageProgress.id, id))
      .returning();
    return updated;
  }

  // Document methods
  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async getDocumentsByStage(userId: string, stage: number): Promise<Document[]> {
    return await db.select().from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.stage, stage)));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [created] = await db.insert(documents).values(document).returning();
    return created;
  }

  // Diet Plan methods
  async getUserDietPlan(userId: string): Promise<DietPlan | undefined> {
    const result = await db.select().from(dietPlans).where(eq(dietPlans.userId, userId));
    return result[0];
  }

  async createDietPlan(dietPlan: InsertDietPlan): Promise<DietPlan> {
    const [created] = await db.insert(dietPlans).values(dietPlan).returning();
    return created;
  }

  async updateDietPlan(id: string, updates: Partial<DietPlan>): Promise<DietPlan | undefined> {
    const [updated] = await db.update(dietPlans)
      .set(updates)
      .where(eq(dietPlans.id, id))
      .returning();
    return updated;
  }

  // Address methods
  async getUserAddresses(userId: string): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async getAddress(id: string): Promise<Address | undefined> {
    const result = await db.select().from(addresses).where(eq(addresses.id, id));
    return result[0];
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    const [created] = await db.insert(addresses).values(address).returning();
    return created;
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | undefined> {
    const [updated] = await db.update(addresses)
      .set(updates)
      .where(eq(addresses.id, id))
      .returning();
    return updated;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const result = await db.delete(addresses).where(eq(addresses.id, id)).returning();
    return result.length > 0;
  }

  // Delivery Sync methods
  async createDeliverySync(sync: InsertDeliverySync): Promise<DeliverySync> {
    const [created] = await db.insert(deliverySync).values(sync).returning();
    return created;
  }

  async getUserDeliverySyncs(userId: string): Promise<DeliverySync[]> {
    return await db.select().from(deliverySync).where(eq(deliverySync.userId, userId));
  }

  async updateDeliverySync(id: string, updates: Partial<DeliverySync>): Promise<DeliverySync | undefined> {
    const [updated] = await db.update(deliverySync)
      .set(updates)
      .where(eq(deliverySync.id, id))
      .returning();
    return updated;
  }

  // Acknowledgement methods
  async createAcknowledgement(ack: InsertAcknowledgement): Promise<Acknowledgement> {
    const [created] = await db.insert(acknowledgements).values(ack).returning();
    return created;
  }

  async getStaffAcknowledgements(staffId: string): Promise<Acknowledgement[]> {
    return await db.select().from(acknowledgements).where(eq(acknowledgements.staffId, staffId));
  }

  async getCustomerAcknowledgements(customerId: string): Promise<Acknowledgement[]> {
    return await db.select().from(acknowledgements).where(eq(acknowledgements.customerId, customerId));
  }

  async updateAcknowledgement(id: string, updates: Partial<Acknowledgement>): Promise<Acknowledgement | undefined> {
    const [updated] = await db.update(acknowledgements)
      .set(updates)
      .where(eq(acknowledgements.id, id))
      .returning();
    return updated;
  }

  async getAllAcknowledgements(): Promise<Acknowledgement[]> {
    return await db.select().from(acknowledgements);
  }

  // Staff Activity Log methods
  async createStaffActivity(activity: InsertStaffActivityLog): Promise<StaffActivityLog> {
    const [created] = await db.insert(staffActivityLog).values(activity).returning();
    return created;
  }

  async getStaffActivities(staffId: string): Promise<StaffActivityLog[]> {
    return await db.select().from(staffActivityLog).where(eq(staffActivityLog.staffId, staffId));
  }

  async getCustomerActivities(customerId: string): Promise<StaffActivityLog[]> {
    return await db.select().from(staffActivityLog).where(eq(staffActivityLog.customerId, customerId));
  }

  async getAllStaffActivities(): Promise<StaffActivityLog[]> {
    return await db.select().from(staffActivityLog);
  }

  // Delivery Location methods
  async upsertDeliveryLocation(location: InsertDeliveryLocation): Promise<DeliveryLocation> {
    const existing = await this.getDeliveryLocation(location.deliveryPersonId);
    
    if (existing) {
      const [updated] = await db.update(deliveryLocation)
        .set({ ...location, lastUpdated: new Date() })
        .where(eq(deliveryLocation.deliveryPersonId, location.deliveryPersonId))
        .returning();
      return updated;
    }

    const [created] = await db.insert(deliveryLocation).values(location).returning();
    return created;
  }

  async getDeliveryLocation(deliveryPersonId: string): Promise<DeliveryLocation | undefined> {
    const result = await db.select().from(deliveryLocation)
      .where(eq(deliveryLocation.deliveryPersonId, deliveryPersonId));
    return result[0];
  }

  async getAllDeliveryLocations(): Promise<DeliveryLocation[]> {
    return await db.select().from(deliveryLocation);
  }

  async updateDeliveryLocation(deliveryPersonId: string, updates: Partial<DeliveryLocation>): Promise<DeliveryLocation | undefined> {
    const [updated] = await db.update(deliveryLocation)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(deliveryLocation.deliveryPersonId, deliveryPersonId))
      .returning();
    return updated;
  }

  // Staff assignment methods
  async getStaffByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async getClinicalCustomers(): Promise<User[]> {
    const clinicalPlans = await db.select().from(plans).where(eq(plans.type, 'Clinical'));
    const userIds = clinicalPlans.map(p => p.userId);
    
    if (userIds.length === 0) return [];
    
    return await db.select().from(users).where(
      eq(users.id, userIds[0])
    );
  }
}

// Use Database Storage for production persistence
export const storage = new DbStorage();

// Keep MemStorage available for testing
export const memStorage = new MemStorage();
