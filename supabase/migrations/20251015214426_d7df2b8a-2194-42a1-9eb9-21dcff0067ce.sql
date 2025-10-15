-- Customer profiles table
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  age INTEGER,
  gender TEXT,
  weight INTEGER,
  height INTEGER,
  goal TEXT,
  activity_level TEXT,
  health_concerns TEXT[],
  medications BOOLEAN,
  dietary_preference TEXT,
  allergies TEXT[],
  meals_per_day TEXT,
  flavor_preference TEXT,
  wake_up_time TEXT,
  sleep_time TEXT,
  late_night_eating BOOLEAN,
  alcohol_consumption TEXT,
  water_intake TEXT,
  snacks_and_desserts BOOLEAN,
  daily_budget INTEGER,
  results_timeline TEXT,
  quiz_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own customer profile" ON public.customer_profiles;
CREATE POLICY "Users can view their own customer profile"
  ON public.customer_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own customer profile" ON public.customer_profiles;
CREATE POLICY "Users can insert their own customer profile"
  ON public.customer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own customer profile" ON public.customer_profiles;
CREATE POLICY "Users can update their own customer profile"
  ON public.customer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'Clinical',
  list_price NUMERIC,
  discount_amount NUMERIC DEFAULT 0,
  consultation_fee_credited NUMERIC DEFAULT 0,
  final_payable NUMERIC,
  is_active BOOLEAN DEFAULT FALSE,
  start_date TEXT,
  duration_days INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own plans" ON public.plans;
CREATE POLICY "Users can view their own plans"
  ON public.plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own plans" ON public.plans;
CREATE POLICY "Users can insert their own plans"
  ON public.plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view clinical plans" ON public.plans;
CREATE POLICY "Staff can view clinical plans"
  ON public.plans FOR SELECT
  USING (
    type = 'Clinical' AND (
      public.has_role(auth.uid(), 'clinical') OR
      public.has_role(auth.uid(), 'lab_technician') OR
      public.has_role(auth.uid(), 'nutritionist') OR
      public.has_role(auth.uid(), 'admin')
    )
  );

DROP POLICY IF EXISTS "Staff can view all plans" ON public.plans;
CREATE POLICY "Staff can view all plans"
  ON public.plans FOR SELECT
  USING (
    public.has_role(auth.uid(), 'chef') OR
    public.has_role(auth.uid(), 'kitchen') OR
    public.has_role(auth.uid(), 'delivery') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES auth.users(id),
  doctor_name TEXT,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  meeting_type TEXT NOT NULL,
  consultation_fee_paid NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
CREATE POLICY "Users can view their own consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Consultants can view all consultations" ON public.consultations;
CREATE POLICY "Consultants can view all consultations"
  ON public.consultations FOR SELECT
  USING (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Consultants can update consultations" ON public.consultations;
CREATE POLICY "Consultants can update consultations"
  ON public.consultations FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Stage progress table
CREATE TABLE IF NOT EXISTS public.stage_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stage_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own stage progress" ON public.stage_progress;
CREATE POLICY "Users can view their own stage progress"
  ON public.stage_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view all stage progress" ON public.stage_progress;
CREATE POLICY "Staff can view all stage progress"
  ON public.stage_progress FOR SELECT
  USING (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Staff can update stage progress" ON public.stage_progress;
CREATE POLICY "Staff can update stage progress"
  ON public.stage_progress FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Staff can insert stage progress" ON public.stage_progress;
CREATE POLICY "Staff can insert stage progress"
  ON public.stage_progress FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage INTEGER,
  label TEXT,
  uploaded_by_role TEXT,
  url TEXT NOT NULL,
  mime_type TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view clinical documents" ON public.documents;
CREATE POLICY "Staff can view clinical documents"
  ON public.documents FOR SELECT
  USING (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Staff can insert documents" ON public.documents;
CREATE POLICY "Staff can insert documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Diet plans table
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  macros JSONB,
  weekly_plan JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own diet plans" ON public.diet_plans;
CREATE POLICY "Users can view their own diet plans"
  ON public.diet_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Nutritionists can view all diet plans" ON public.diet_plans;
CREATE POLICY "Nutritionists can view all diet plans"
  ON public.diet_plans FOR SELECT
  USING (
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Nutritionists can insert diet plans" ON public.diet_plans;
CREATE POLICY "Nutritionists can insert diet plans"
  ON public.diet_plans FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'nutritionist') OR
    public.has_role(auth.uid(), 'clinical') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Acknowledgements table
CREATE TABLE IF NOT EXISTS public.acknowledgements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  task_type TEXT NOT NULL,
  stage INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  acknowledged_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.acknowledgements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view their own acknowledgements" ON public.acknowledgements;
CREATE POLICY "Staff can view their own acknowledgements"
  ON public.acknowledgements FOR SELECT
  USING (auth.uid() = staff_id);

DROP POLICY IF EXISTS "Admin can view all acknowledgements" ON public.acknowledgements;
CREATE POLICY "Admin can view all acknowledgements"
  ON public.acknowledgements FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Staff can update their acknowledgements" ON public.acknowledgements;
CREATE POLICY "Staff can update their acknowledgements"
  ON public.acknowledgements FOR UPDATE
  USING (auth.uid() = staff_id);

DROP POLICY IF EXISTS "Staff can insert acknowledgements" ON public.acknowledgements;
CREATE POLICY "Staff can insert acknowledgements"
  ON public.acknowledgements FOR INSERT
  WITH CHECK (auth.uid() = staff_id);

-- Staff activity log table
CREATE TABLE IF NOT EXISTS public.staff_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  stage INTEGER,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.staff_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view their own activity" ON public.staff_activity_log;
CREATE POLICY "Staff can view their own activity"
  ON public.staff_activity_log FOR SELECT
  USING (auth.uid() = staff_id);

DROP POLICY IF EXISTS "Admin can view all activity" ON public.staff_activity_log;
CREATE POLICY "Admin can view all activity"
  ON public.staff_activity_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Staff can insert their activity" ON public.staff_activity_log;
CREATE POLICY "Staff can insert their activity"
  ON public.staff_activity_log FOR INSERT
  WITH CHECK (auth.uid() = staff_id);

-- Delivery location table (GPS tracking for delivery persons only)
CREATE TABLE IF NOT EXISTS public.delivery_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_person_id UUID REFERENCES auth.users(id) NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.delivery_location ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Delivery persons can update their location" ON public.delivery_location;
CREATE POLICY "Delivery persons can update their location"
  ON public.delivery_location FOR INSERT
  WITH CHECK (auth.uid() = delivery_person_id);

DROP POLICY IF EXISTS "Delivery persons can view their location" ON public.delivery_location;
CREATE POLICY "Delivery persons can view their location"
  ON public.delivery_location FOR SELECT
  USING (auth.uid() = delivery_person_id);

DROP POLICY IF EXISTS "Admin can view all delivery locations" ON public.delivery_location;
CREATE POLICY "Admin can view all delivery locations"
  ON public.delivery_location FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON public.customer_profiles;
CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_stage_progress_updated_at ON public.stage_progress;
CREATE TRIGGER update_stage_progress_updated_at
  BEFORE UPDATE ON public.stage_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();