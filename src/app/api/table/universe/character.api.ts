import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Character_SearchParams = {
  universe_id: string;
};

class CharacterApi extends ApiHandler<"characters", "id" | "universe_id", Character_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "characters",
      primaryKeys: ["id", "universe_id"],
      uniqueKeys: ["id", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          return prev;
        },
      ],
    });
  }
  emptyReq(universe_id: string): TablesInsert<"characters"> {
    return {
      name: "",
      universe_id: universe_id,
    };
  }
}

export const characterApi: CharacterApi = new CharacterApi();
