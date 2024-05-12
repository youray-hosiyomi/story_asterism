import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Period_SearchParams = {
  universe_id: string;
  ids?: string[];
};

class PeriodApi extends ApiHandler<"periods", "id" | "universe_id", Period_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "periods",
      primaryKeys: ["id", "universe_id"],
      uniqueKeys: ["id", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          if (params.ids) {
            prev.in("id", params.ids);
          }
          return prev.order("seq", { ascending: true });
        },
      ],
    });
  }
  emptyReq(universe_id: string): TablesInsert<"periods"> {
    return {
      name: "",
      universe_id,
    };
  }
}

export const periodApi: PeriodApi = new PeriodApi();
