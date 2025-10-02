import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password"),
  role: text("role").notNull().default('customer'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  age: integer("age"),
  gender: text("gender"),
  weight: integer("weight"),
  height: integer("height"),
  goal: text("goal"),
  activityLevel: text("activity_level"),
  healthConcerns: text("health_concerns").array(),
  medications: boolean("medications"),
  dietaryPreference: text("dietary_preference"),
  allergies: text("allergies").array(),
  mealsPerDay: text("meals_per_day"),
  flavorPreference: text("flavor_preference"),
  wakeUpTime: text("wake_up_time"),
  sleepTime: text("sleep_time"),
  lateNightEating: boolean("late_night_eating"),
  alcoholConsumption: text("alcohol_consumption"),
  waterIntake: text("water_intake"),
  snacksAndDesserts: boolean("snacks_and_desserts"),
  dailyBudget: integer("daily_budget"),
  resultsTimeline: text("results_timeline"),
  quizAnswers: jsonb("quiz_answers"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planType: text("plan_type").notNull(),
  status: text("status").notNull().default('active'),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  price: integer("price").notNull(),
  billingCycle: text("billing_cycle").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  status: text("status").notNull().default('locked'),
  completedAt: timestamp("completed_at"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  reportType: text("report_type").notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url"),
  summary: text("summary"),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  consultantId: varchar("consultant_id").references(() => users.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default('scheduled'),
  notes: text("notes"),
  meetingType: text("meeting_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  meals: jsonb("meals").notNull(),
  totalCalories: integer("total_calories"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const meals = pgTable("meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  mealType: text("meal_type").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fats: integer("fats").notNull(),
  ingredients: text("ingredients").array(),
  allergens: text("allergens").array(),
  dietaryTags: text("dietary_tags").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mealPlanId: varchar("meal_plan_id").references(() => mealPlans.id),
  deliveryDate: timestamp("delivery_date").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  status: text("status").notNull().default('pending'),
  assignedDeliveryPersonId: varchar("assigned_delivery_person_id").references(() => users.id),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type CustomerProfile = typeof customerProfiles.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;

export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Meal = typeof meals.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
