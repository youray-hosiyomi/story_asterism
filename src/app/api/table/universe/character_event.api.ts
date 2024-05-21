import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Character__And__Event___Relation_SearchParams = {
  universe_id: string;
  character_id?: string;
  event_ids?: string[];
};

class CharacterEventApi extends ApiHandler<
  "character&event$relations",
  "character_id" | "event_id" | "universe_id",
  Character__And__Event___Relation_SearchParams
> {
  constructor() {
    super(supabase, {
      tableName: "character&event$relations",
      primaryKeys: ["character_id", "event_id", "universe_id"],
      uniqueKeys: ["character_id", "event_id", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          if (params.character_id) {
            prev.eq("character_id", params.character_id);
          }
          if (params.event_ids) {
            prev.in("event_id", params.event_ids);
          }
          return prev;
        },
      ],
    });
  }
  emptyReq(universe_id: string, character_id: string, event_id: string): TablesInsert<"character&event$relations"> {
    return {
      character_id,
      event_id,
      universe_id: universe_id,
    };
  }
}

export const characterEventApi: CharacterEventApi = new CharacterEventApi();
