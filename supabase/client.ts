import { Database } from "@supabase/database.type";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export type Supabase = SupabaseClient<Database>;
export const supabase = createClient<Database>(url, anonKey);
