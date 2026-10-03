// Types générés depuis le schéma Supabase (projet Paletto).
// Pour les régénérer : npx supabase gen types typescript --project-id nqpzxfbmcymyqvovpjqe

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      conversations: {
        Row: {
          buyer_id: string;
          created_at: string;
          id: string;
          last_message_at: string;
          listing_id: string | null;
          seller_id: string;
        };
        Insert: {
          buyer_id: string;
          created_at?: string;
          id?: string;
          last_message_at?: string;
          listing_id?: string | null;
          seller_id: string;
        };
        Update: {
          buyer_id?: string;
          created_at?: string;
          id?: string;
          last_message_at?: string;
          listing_id?: string | null;
          seller_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          created_at: string;
          listing_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          listing_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          listing_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      listings: {
        Row: {
          city: string;
          condition: string;
          created_at: string;
          delivery_possible: boolean;
          department: string | null;
          description: string;
          id: string;
          images: string[];
          pallet_type: string;
          postal_code: string;
          price_cents: number;
          price_negotiable: boolean;
          quantity: number;
          search: unknown;
          seller_id: string;
          status: string;
          title: string;
          updated_at: string;
          views: number;
        };
        Insert: {
          city: string;
          condition: string;
          created_at?: string;
          delivery_possible?: boolean;
          department?: string | null;
          description: string;
          id?: string;
          images?: string[];
          pallet_type: string;
          postal_code: string;
          price_cents: number;
          price_negotiable?: boolean;
          quantity: number;
          search?: unknown;
          seller_id: string;
          status?: string;
          title: string;
          updated_at?: string;
          views?: number;
        };
        Update: {
          city?: string;
          condition?: string;
          created_at?: string;
          delivery_possible?: boolean;
          department?: string | null;
          description?: string;
          id?: string;
          images?: string[];
          pallet_type?: string;
          postal_code?: string;
          price_cents?: number;
          price_negotiable?: boolean;
          quantity?: number;
          search?: unknown;
          seller_id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          body: string;
          conversation_id: string;
          created_at: string;
          id: string;
          read_at: string | null;
          sender_id: string;
        };
        Insert: {
          body: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          sender_id: string;
        };
        Update: {
          body?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          bio: string | null;
          city: string | null;
          created_at: string;
          display_name: string;
          id: string;
        };
        Insert: {
          bio?: string | null;
          city?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
        };
        Update: {
          bio?: string | null;
          city?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          listing_id: string;
          reason: string;
          reporter_id: string | null;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          listing_id: string;
          reason: string;
          reporter_id?: string | null;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          listing_id?: string;
          reason?: string;
          reporter_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reports_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_listing_views: {
        Args: { p_listing_id: string };
        Returns: undefined;
      };
      mark_conversation_read: {
        Args: { p_conversation_id: string };
        Returns: undefined;
      };
      my_conversations: {
        Args: never;
        Returns: {
          id: string;
          is_seller: boolean;
          last_message: string;
          last_message_at: string;
          last_sender_id: string;
          listing_id: string;
          listing_image: string;
          listing_status: string;
          listing_title: string;
          other_user_id: string;
          other_user_name: string;
          unread_count: number;
        }[];
      };
      start_conversation: {
        Args: { p_body: string; p_listing_id: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
