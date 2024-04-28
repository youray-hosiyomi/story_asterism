import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { Database } from "@supabase/database.type";

export type Profile = Database["public"]["Tables"]["profiles"];

export class ProfileApi extends ApiHandler<"profiles", "uid"> {
  constructor() {
    super(supabase, {
      tableName: "profiles",
      primaryKeys: ["uid"],
      uniqueKeys: ["uid"],
      handlers: [],
    });
  }
}

export const profileApi: ProfileApi = new ProfileApi();
