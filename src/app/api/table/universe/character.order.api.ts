import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Character_Order_SearchParams = {
  universe_id: string;
};

class CharacterOrderApi extends ApiHandler<"character$orders", "universe_id", Character_Order_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "character$orders",
      primaryKeys: ["universe_id"],
      uniqueKeys: ["universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          return prev;
        },
      ],
    });
  }
  emptyReq(universe_id: string): TablesInsert<"character$orders"> {
    return {
      universe_id: universe_id,
      character_id_list: [],
    };
  }
}

export const characterOrderApi: CharacterOrderApi = new CharacterOrderApi();
