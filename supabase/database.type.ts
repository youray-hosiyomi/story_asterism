export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      "character&event$relations": {
        Row: {
          character_id: string;
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          event_id: string;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          character_id: string;
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          event_id: string;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          character_id?: string;
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          event_id?: string;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "character&event$relations_character_id_universe_id_fkey";
            columns: ["character_id", "universe_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id", "universe_id"];
          },
          {
            foreignKeyName: "character&event$relations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character&event$relations_event_id_universe_id_fkey";
            columns: ["event_id", "universe_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id", "universe_id"];
          },
          {
            foreignKeyName: "character&event$relations_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character&event$relations_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      character$orders: {
        Row: {
          character_id_list: string[];
          created_at: string | null;
          created_by: string | null;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          character_id_list: string[];
          created_at?: string | null;
          created_by?: string | null;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          character_id_list?: string[];
          created_at?: string | null;
          created_by?: string | null;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "character$orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character$orders_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: true;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character$orders_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      characters: {
        Row: {
          back_story: string | null;
          charm: string | null;
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          id: string;
          image_key: string | null;
          name: string;
          personality: string | null;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          back_story?: string | null;
          charm?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          image_key?: string | null;
          name: string;
          personality?: string | null;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          back_story?: string | null;
          charm?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          image_key?: string | null;
          name?: string;
          personality?: string | null;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "characters_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      episode$orders: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          episode_id_list: string[];
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          episode_id_list: string[];
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          episode_id_list?: string[];
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "episode$orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "episode$orders_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: true;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "episode$orders_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      episodes: {
        Row: {
          charm: string | null;
          content: string | null;
          created_at: string | null;
          created_by: string | null;
          id: string;
          part_1: string | null;
          part_2: string | null;
          part_3: string | null;
          part_4: string | null;
          purpose: string | null;
          summary: string | null;
          title: string;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          charm?: string | null;
          content?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          part_1?: string | null;
          part_2?: string | null;
          part_3?: string | null;
          part_4?: string | null;
          purpose?: string | null;
          summary?: string | null;
          title: string;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          charm?: string | null;
          content?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          part_1?: string | null;
          part_2?: string | null;
          part_3?: string | null;
          part_4?: string | null;
          purpose?: string | null;
          summary?: string | null;
          title?: string;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "episodes_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "episodes_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          date: number;
          detail: string | null;
          hour: number;
          id: string;
          minute: number;
          month: number;
          name: string;
          period_id: string;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          date?: number;
          detail?: string | null;
          hour?: number;
          id?: string;
          minute?: number;
          month?: number;
          name: string;
          period_id: string;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
          year?: number;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          date?: number;
          detail?: string | null;
          hour?: number;
          id?: string;
          minute?: number;
          month?: number;
          name?: string;
          period_id?: string;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_period_id_universe_id_fkey";
            columns: ["period_id", "universe_id"];
            isOneToOne: false;
            referencedRelation: "periods";
            referencedColumns: ["id", "universe_id"];
          },
          {
            foreignKeyName: "events_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      period$orders: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          period_id_list: string[];
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          period_id_list: string[];
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          period_id_list?: string[];
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "period$orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "period$orders_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: true;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "period$orders_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      periods: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          id: string;
          is_real: boolean | null;
          name: string;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          is_real?: boolean | null;
          name: string;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          is_real?: boolean | null;
          name?: string;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "periods_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "periods_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "periods_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_key: string | null;
          detail: string | null;
          uid: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_key?: string | null;
          detail?: string | null;
          uid: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_key?: string | null;
          detail?: string | null;
          uid?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_uid_fkey";
            columns: ["uid"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      scene$orders: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          episode_id: string;
          scene_id_list: string[];
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          episode_id: string;
          scene_id_list: string[];
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          episode_id?: string;
          scene_id_list?: string[];
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "scene$orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scene$orders_episode_id_universe_id_fkey";
            columns: ["episode_id", "universe_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id", "universe_id"];
          },
          {
            foreignKeyName: "scene$orders_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scene$orders_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      scenes: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          episode_id: string;
          event_id: string | null;
          id: string;
          name: string;
          universe_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          episode_id: string;
          event_id?: string | null;
          id?: string;
          name: string;
          universe_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          episode_id?: string;
          event_id?: string | null;
          id?: string;
          name?: string;
          universe_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "scenes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scenes_episode_id_universe_id_fkey";
            columns: ["episode_id", "universe_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id", "universe_id"];
          },
          {
            foreignKeyName: "scenes_event_id_universe_id_fkey";
            columns: ["event_id", "universe_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id", "universe_id"];
          },
          {
            foreignKeyName: "scenes_universe_id_fkey";
            columns: ["universe_id"];
            isOneToOne: false;
            referencedRelation: "universes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scenes_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      universes: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          detail: string | null;
          id: string;
          image_key: string | null;
          name: string;
          owner_id: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          image_key?: string | null;
          name: string;
          owner_id?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          detail?: string | null;
          id?: string;
          image_key?: string | null;
          name?: string;
          owner_id?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "universes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "universes_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "universes_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      auth_check_universe: {
        Args: {
          universe_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
