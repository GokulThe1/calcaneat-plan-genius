import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  characterImageUrl: varchar("character_image_url"),
  characterType: text("character_type"),
  role: text("role").notNull().default('customer'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  doctorName: text("doctor_name"),
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  status: text("status").notNull().default('scheduled'),
  notes: text("notes"),
  meetingType: text("meeting_type").notNull(),
  consultationFeePaid: numeric("consultation_fee_paid"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").default('Clinical'),
  listPrice: numeric("list_price"),
  discountAmount: numeric("discount_amount").default('0'),
  consultationFeeCredited: numeric("consultation_fee_credited").default('0'),
  finalPayable: numeric("final_payable"),
  isActive: boolean("is_active").default(false),
  startDate: text("start_date"),
  durationDays: integer("duration_days").default(30),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stageProgress = pgTable("stage_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stage: integer("stage").notNull(),
  name: text("name").notNull(),
  status: text("status").default('pending'),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stage: integer("stage"),
  label: text("label"),
  uploadedByRole: text("uploaded_by_role"),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dietPlans = pgTable("diet_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  macros: jsonb("macros"),
  weeklyPlan: jsonb("weekly_plan"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  label: text("label"),
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  isDefault: boolean("is_default").default(false),
  breakfast: boolean("breakfast").default(false),
  lunch: boolean("lunch").default(false),
  dinner: boolean("dinner").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliverySync = pgTable("delivery_sync", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").references(() => plans.id),
  payload: jsonb("payload"),
  status: text("status").default('queued'),
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

export const paymentSessions = pgTable("payment_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  consultationDate: text("consultation_date").notNull(),
  planType: text("plan_type").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default('pending'),
  paymentMethod: text("payment_method").default('dummy'),
  razorpayOrderId: text("razorpay_order_id"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default('info'),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const acknowledgements = pgTable("acknowledgements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").notNull().references(() => users.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  taskType: text("task_type").notNull(),
  stage: integer("stage"),
  status: text("status").notNull().default('pending'),
  acknowledgedAt: timestamp("acknowledged_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const staffActivityLog = pgTable("staff_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").notNull().references(() => users.id),
  customerId: varchar("customer_id").references(() => users.id),
  actionType: text("action_type").notNull(),
  stage: integer("stage"),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryLocation = pgTable("delivery_location", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deliveryPersonId: varchar("delivery_person_id").notNull().references(() => users.id),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  status: text("status").notNull().default('idle'),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertPaymentSessionSchema = createInsertSchema(paymentSessions).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
});

export const insertStageProgressSchema = createInsertSchema(stageProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertDietPlanSchema = createInsertSchema(dietPlans).omit({
  id: true,
  createdAt: true,
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true,
});

export const insertDeliverySyncSchema = createInsertSchema(deliverySync).omit({
  id: true,
  createdAt: true,
});

export const insertAcknowledgementSchema = createInsertSchema(acknowledgements).omit({
  id: true,
  createdAt: true,
});

export const insertStaffActivityLogSchema = createInsertSchema(staffActivityLog).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryLocationSchema = createInsertSchema(deliveryLocation).omit({
  id: true,
  lastUpdated: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
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

export type InsertPaymentSession = z.infer<typeof insertPaymentSessionSchema>;
export type PaymentSession = typeof paymentSessions.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

export type InsertStageProgress = z.infer<typeof insertStageProgressSchema>;
export type StageProgress = typeof stageProgress.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertDietPlan = z.infer<typeof insertDietPlanSchema>;
export type DietPlan = typeof dietPlans.$inferSelect;

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addresses.$inferSelect;

export type InsertDeliverySync = z.infer<typeof insertDeliverySyncSchema>;
export type DeliverySync = typeof deliverySync.$inferSelect;

export type InsertAcknowledgement = z.infer<typeof insertAcknowledgementSchema>;
export type Acknowledgement = typeof acknowledgements.$inferSelect;

export type InsertStaffActivityLog = z.infer<typeof insertStaffActivityLogSchema>;
export type StaffActivityLog = typeof staffActivityLog.$inferSelect;

export type InsertDeliveryLocation = z.infer<typeof insertDeliveryLocationSchema>;
export type DeliveryLocation = typeof deliveryLocation.$inferSelect;
