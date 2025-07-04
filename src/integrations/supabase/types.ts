export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          dataset_id: string | null
          description: string | null
          id: string
          insight_type: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          dataset_id?: string | null
          description?: string | null
          id?: string
          insight_type: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          dataset_id?: string | null
          description?: string | null
          id?: string
          insight_type?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_queries: {
        Row: {
          created_at: string | null
          dataset_id: string | null
          execution_time_ms: number | null
          id: string
          query_text: string
          query_type: string | null
          results: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dataset_id?: string | null
          execution_time_ms?: number | null
          id?: string
          query_text: string
          query_type?: string | null
          results?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dataset_id?: string | null
          execution_time_ms?: number | null
          id?: string
          query_text?: string
          query_type?: string | null
          results?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_queries_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          layout: Json | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          layout?: Json | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          layout?: Json | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_records: {
        Row: {
          created_at: string | null
          data: Json
          dataset_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          dataset_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          dataset_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_records_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          columns_info: Json | null
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number | null
          id: string
          name: string
          row_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          columns_info?: Json | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          name: string
          row_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          columns_info?: Json | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          name?: string
          row_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          relevance_score: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          relevance_score?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          relevance_score?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      knowledge_edges: {
        Row: {
          created_at: string | null
          id: string
          properties: Json | null
          relationship_type: string
          source_node_id: string
          target_node_id: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          properties?: Json | null
          relationship_type: string
          source_node_id: string
          target_node_id: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          properties?: Json | null
          relationship_type?: string
          source_node_id?: string
          target_node_id?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "knowledge_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "knowledge_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_nodes: {
        Row: {
          created_at: string | null
          dataset_id: string | null
          entity_name: string
          entity_type: string
          id: string
          properties: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dataset_id?: string | null
          entity_name: string
          entity_type: string
          id?: string
          properties?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dataset_id?: string | null
          entity_name?: string
          entity_type?: string
          id?: string
          properties?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_nodes_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          last_used: string | null
          pattern_data: Json
          pattern_type: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_used?: string | null
          pattern_data?: Json
          pattern_type: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_used?: string | null
          pattern_data?: Json
          pattern_type?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      processing_pipelines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_run: string | null
          name: string
          pipeline_config: Json
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_run?: string | null
          name: string
          pipeline_config?: Json
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_run?: string | null
          name?: string
          pipeline_config?: Json
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_complete: boolean | null
          onboarding_step: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievements: string[] | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          viewed_achievements: string[] | null
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          viewed_achievements?: string[] | null
        }
        Update: {
          achievements?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          viewed_achievements?: string[] | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          comment: string | null
          context: Json | null
          created_at: string | null
          feedback_type: string
          id: string
          interaction_id: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          context?: Json | null
          created_at?: string | null
          feedback_type: string
          id?: string
          interaction_id?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          context?: Json | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          interaction_id?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "analyst" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "analyst", "viewer"],
    },
  },
} as const
