import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Period_Order_SearchParams = {
  universe_id: string;
};

class PeriodOrderApi extends ApiHandler<"period$orders", "universe_id", Period_Order_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "period$orders",
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
  emptyReq(universe_id: string): TablesInsert<"period$orders"> {
    return {
      universe_id: universe_id,
      period_id_list: [],
    };
  }
}

export const periodOrderApi: PeriodOrderApi = new PeriodOrderApi();
