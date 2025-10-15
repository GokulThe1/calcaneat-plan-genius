-- Add missing values to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'clinical';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lab_technician';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'nutritionist';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'chef';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'kitchen';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'delivery';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';