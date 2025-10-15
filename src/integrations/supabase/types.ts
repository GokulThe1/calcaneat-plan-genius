export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      acknowledgements: {
        Row: {
          acknowledged_at: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          id: string
          staff_id: string
          stage: number | null
          status: string
          task_type: string
        }
        Insert: {
          acknowledged_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          staff_id: string
          stage?: number | null
          status?: string
          task_type: string
        }
        Update: {
          acknowledged_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          staff_id?: string
          stage?: number | null
          status?: string
          task_type?: string
        }
        Relationships: []
      }
      ai_responses: {
        Row: {
          age: number | null
          allergies: string[] | null
          budget_preference: string | null
          cooking_facilities: boolean | null
          created_at: string | null
          daily_meal_count: number | null
          dietary_preference:
            | Database["public"]["Enums"]["dietary_preference"]
            | null
          favorite_meals: string | null
          fitness_goal: Database["public"]["Enums"]["fitness_goal"] | null
          foods_to_avoid: string | null
          gender: string | null
          height: number | null
          id: string
          meal_plan_generated: Json | null
          medical_conditions: string | null
          preferred_cuisine: string | null
          preferred_protein: string | null
          sleep_time: string | null
          updated_at: string | null
          user_id: string
          wake_up_time: string | null
          water_intake: number | null
          weekly_activity: string | null
          weight: number | null
          work_nature: string | null
        }
        Insert: {
          age?: number | null
          allergies?: string[] | null
          budget_preference?: string | null
          cooking_facilities?: boolean | null
          created_at?: string | null
          daily_meal_count?: number | null
          dietary_preference?:
            | Database["public"]["Enums"]["dietary_preference"]
            | null
          favorite_meals?: string | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          foods_to_avoid?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          meal_plan_generated?: Json | null
          medical_conditions?: string | null
          preferred_cuisine?: string | null
          preferred_protein?: string | null
          sleep_time?: string | null
          updated_at?: string | null
          user_id: string
          wake_up_time?: string | null
          water_intake?: number | null
          weekly_activity?: string | null
          weight?: number | null
          work_nature?: string | null
        }
        Update: {
          age?: number | null
          allergies?: string[] | null
          budget_preference?: string | null
          cooking_facilities?: boolean | null
          created_at?: string | null
          daily_meal_count?: number | null
          dietary_preference?:
            | Database["public"]["Enums"]["dietary_preference"]
            | null
          favorite_meals?: string | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          foods_to_avoid?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          meal_plan_generated?: Json | null
          medical_conditions?: string | null
          preferred_cuisine?: string | null
          preferred_protein?: string | null
          sleep_time?: string | null
          updated_at?: string | null
          user_id?: string
          wake_up_time?: string | null
          water_intake?: number | null
          weekly_activity?: string | null
          weight?: number | null
          work_nature?: string | null
        }
        Relationships: []
      }
      clinical_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          current_stage: Database["public"]["Enums"]["clinical_stage"] | null
          doctor_id: string
          id: string
          payment_amount: number | null
          payment_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["clinical_stage"] | null
          doctor_id: string
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["clinical_stage"] | null
          doctor_id?: string
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_bookings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          consultant_id: string | null
          consultation_fee_paid: number | null
          created_at: string | null
          doctor_name: string | null
          id: string
          meeting_type: string
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          user_id: string
        }
        Insert: {
          consultant_id?: string | null
          consultation_fee_paid?: number | null
          created_at?: string | null
          doctor_name?: string | null
          id?: string
          meeting_type: string
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          user_id: string
        }
        Update: {
          consultant_id?: string | null
          consultation_fee_paid?: number | null
          created_at?: string | null
          doctor_name?: string | null
          id?: string
          meeting_type?: string
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          alcohol_consumption: string | null
          allergies: string[] | null
          created_at: string | null
          daily_budget: number | null
          dietary_preference: string | null
          flavor_preference: string | null
          gender: string | null
          goal: string | null
          health_concerns: string[] | null
          height: number | null
          id: string
          late_night_eating: boolean | null
          meals_per_day: string | null
          medications: boolean | null
          quiz_answers: Json | null
          results_timeline: string | null
          sleep_time: string | null
          snacks_and_desserts: boolean | null
          updated_at: string | null
          user_id: string
          wake_up_time: string | null
          water_intake: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          alcohol_consumption?: string | null
          allergies?: string[] | null
          created_at?: string | null
          daily_budget?: number | null
          dietary_preference?: string | null
          flavor_preference?: string | null
          gender?: string | null
          goal?: string | null
          health_concerns?: string[] | null
          height?: number | null
          id?: string
          late_night_eating?: boolean | null
          meals_per_day?: string | null
          medications?: boolean | null
          quiz_answers?: Json | null
          results_timeline?: string | null
          sleep_time?: string | null
          snacks_and_desserts?: boolean | null
          updated_at?: string | null
          user_id: string
          wake_up_time?: string | null
          water_intake?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          alcohol_consumption?: string | null
          allergies?: string[] | null
          created_at?: string | null
          daily_budget?: number | null
          dietary_preference?: string | null
          flavor_preference?: string | null
          gender?: string | null
          goal?: string | null
          health_concerns?: string[] | null
          height?: number | null
          id?: string
          late_night_eating?: boolean | null
          meals_per_day?: string | null
          medications?: boolean | null
          quiz_answers?: Json | null
          results_timeline?: string | null
          sleep_time?: string | null
          snacks_and_desserts?: boolean | null
          updated_at?: string | null
          user_id?: string
          wake_up_time?: string | null
          water_intake?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      delivery_location: {
        Row: {
          delivery_person_id: string
          id: string
          last_updated: string | null
          latitude: number
          longitude: number
          status: string
        }
        Insert: {
          delivery_person_id: string
          id?: string
          last_updated?: string | null
          latitude: number
          longitude: number
          status?: string
        }
        Update: {
          delivery_person_id?: string
          id?: string
          last_updated?: string | null
          latitude?: number
          longitude?: number
          status?: string
        }
        Relationships: []
      }
      diet_plans: {
        Row: {
          created_at: string | null
          id: string
          macros: Json | null
          pdf_url: string | null
          user_id: string
          weekly_plan: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          macros?: Json | null
          pdf_url?: string | null
          user_id: string
          weekly_plan?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          macros?: Json | null
          pdf_url?: string | null
          user_id?: string
          weekly_plan?: Json | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          available: boolean | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          specialization: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          specialization: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          specialization?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          meta: Json | null
          mime_type: string | null
          stage: number | null
          uploaded_by_role: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          meta?: Json | null
          mime_type?: string | null
          stage?: number | null
          uploaded_by_role?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          meta?: Json | null
          mime_type?: string | null
          stage?: number | null
          uploaded_by_role?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          consultation_fee_credited: number | null
          created_at: string | null
          discount_amount: number | null
          duration_days: number | null
          final_payable: number | null
          id: string
          is_active: boolean | null
          list_price: number | null
          start_date: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          consultation_fee_credited?: number | null
          created_at?: string | null
          discount_amount?: number | null
          duration_days?: number | null
          final_payable?: number | null
          id?: string
          is_active?: boolean | null
          list_price?: number | null
          start_date?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          consultation_fee_credited?: number | null
          created_at?: string | null
          discount_amount?: number | null
          duration_days?: number | null
          final_payable?: number | null
          id?: string
          is_active?: boolean | null
          list_price?: number | null
          start_date?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          plan_type: Database["public"]["Enums"]["plan_type"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staff_activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          metadata: Json | null
          staff_id: string
          stage: number | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          staff_id: string
          stage?: number | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          staff_id?: string
          stage?: number | null
        }
        Relationships: []
      }
      stage_progress: {
        Row: {
          id: string
          name: string
          stage: number
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          stage: number
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          stage?: number
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "clinical"
        | "lab_technician"
        | "nutritionist"
        | "chef"
        | "kitchen"
        | "delivery"
        | "customer"
      clinical_stage:
        | "consultation"
        | "test_collection"
        | "discussion"
        | "diet_chart"
        | "meal_delivery"
      dietary_preference: "veg" | "non_veg" | "eggetarian"
      fitness_goal:
        | "weight_loss"
        | "maintenance"
        | "muscle_gain"
        | "general_health"
      plan_type: "clinical" | "ai_assisted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "user",
        "clinical",
        "lab_technician",
        "nutritionist",
        "chef",
        "kitchen",
        "delivery",
        "customer",
      ],
      clinical_stage: [
        "consultation",
        "test_collection",
        "discussion",
        "diet_chart",
        "meal_delivery",
      ],
      dietary_preference: ["veg", "non_veg", "eggetarian"],
      fitness_goal: [
        "weight_loss",
        "maintenance",
        "muscle_gain",
        "general_health",
      ],
      plan_type: ["clinical", "ai_assisted"],
    },
  },
} as const
