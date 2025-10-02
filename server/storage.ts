import { type User, type InsertUser, type CustomerProfile, type InsertCustomerProfile, type Subscription, type InsertSubscription, type Milestone, type InsertMilestone, type Report, type InsertReport, type Consultation, type InsertConsultation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCustomerProfile(userId: string): Promise<CustomerProfile | undefined>;
  createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile>;
  updateCustomerProfile(id: string, profile: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined>;
  
  getUserMilestones(userId: string): Promise<Milestone[]>;
  updateMilestone(id: string, status: string): Promise<Milestone | undefined>;
  
  getUserReports(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, CustomerProfile>;
  private milestones: Map<string, Milestone>;
  private reports: Map<string, Report>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.milestones = new Map();
    this.reports = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || 'customer',
      password: insertUser.password || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
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
}

export const storage = new MemStorage();
