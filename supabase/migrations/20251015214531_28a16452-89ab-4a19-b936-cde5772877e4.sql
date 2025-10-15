-- Addresses table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT,
  line1 TEXT,
  line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  breakfast BOOLEAN DEFAULT FALSE,
  lunch BOOLEAN DEFAULT FALSE,
  dinner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
CREATE POLICY "Users can manage their own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id);

-- Meals table (public catalog)
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  meal_type TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fats INTEGER NOT NULL,
  ingredients TEXT[],
  allergens TEXT[],
  dietary_tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active meals" ON public.meals;
CREATE POLICY "Anyone can view active meals"
  ON public.meals FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Chefs can manage meals" ON public.meals;
CREATE POLICY "Chefs can manage meals"
  ON public.meals FOR ALL
  USING (
    public.has_role(auth.uid(), 'chef') OR
    public.has_role(auth.uid(), 'kitchen') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Meal plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  meals JSONB NOT NULL,
  total_calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own meal plans" ON public.meal_plans;
CREATE POLICY "Users can view their own meal plans"
  ON public.meal_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kitchen staff can view all meal plans" ON public.meal_plans;
CREATE POLICY "Kitchen staff can view all meal plans"
  ON public.meal_plans FOR SELECT
  USING (
    public.has_role(auth.uid(), 'chef') OR
    public.has_role(auth.uid(), 'kitchen') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Kitchen staff can insert meal plans" ON public.meal_plans;
CREATE POLICY "Kitchen staff can insert meal plans"
  ON public.meal_plans FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'chef') OR
    public.has_role(auth.uid(), 'kitchen') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_plan_id UUID REFERENCES public.meal_plans(id),
  delivery_date TIMESTAMPTZ NOT NULL,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_delivery_person_id UUID REFERENCES auth.users(id),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Kitchen can view and update orders" ON public.orders;
CREATE POLICY "Kitchen can view and update orders"
  ON public.orders FOR ALL
  USING (
    public.has_role(auth.uid(), 'chef') OR
    public.has_role(auth.uid(), 'kitchen') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Delivery can view assigned orders" ON public.orders;
CREATE POLICY "Delivery can view assigned orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = assigned_delivery_person_id OR
    public.has_role(auth.uid(), 'delivery') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Delivery can update assigned orders" ON public.orders;
CREATE POLICY "Delivery can update assigned orders"
  ON public.orders FOR UPDATE
  USING (
    auth.uid() = assigned_delivery_person_id OR
    public.has_role(auth.uid(), 'delivery') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Payment sessions table
CREATE TABLE IF NOT EXISTS public.payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultation_date TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'dummy',
  razorpay_order_id TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payment sessions" ON public.payment_sessions;
CREATE POLICY "Users can view their own payment sessions"
  ON public.payment_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create payment sessions" ON public.payment_sessions;
CREATE POLICY "Users can create payment sessions"
  ON public.payment_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can view all payment sessions" ON public.payment_sessions;
CREATE POLICY "Admin can view all payment sessions"
  ON public.payment_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT,
  summary TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Lab technicians can create reports" ON public.reports;
CREATE POLICY "Lab technicians can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Staff can view all reports" ON public.reports;
CREATE POLICY "Staff can view all reports"
  ON public.reports FOR SELECT
  USING (
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked',
  completed_at TIMESTAMPTZ,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own milestones" ON public.milestones;
CREATE POLICY "Users can view their own milestones"
  ON public.milestones FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage milestones" ON public.milestones;
CREATE POLICY "Admin can manage milestones"
  ON public.milestones FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for reports updated_at
DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();