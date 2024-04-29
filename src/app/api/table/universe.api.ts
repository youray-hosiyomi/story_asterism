import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Universe_SearchParams = {
  isLatest?: boolean;
  limit?: number;
};

class UniverseApi extends ApiHandler<"universes", "id", Universe_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "universes",
      primaryKeys: ["id"],
      uniqueKeys: ["id"],
      handlers: [
        (prev, params) => {
          if (params.limit) {
            prev.limit(params.limit);
          }
          return prev;
        },
      ],
    });
  }
  emptyReq(userId: string): TablesInsert<"universes"> {
    return {
      name: "",
      owner_id: userId,
    };
  }
}

export const universeApi: UniverseApi = new UniverseApi();
