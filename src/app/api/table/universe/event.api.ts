import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Event_SearchParams = {
  ids?: string[];
  period_id?: string;
  universe_id: string;
};

class EventApi extends ApiHandler<"events", "id" | "universe_id", Event_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "events",
      primaryKeys: ["id", "universe_id"],
      uniqueKeys: ["id", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          if (params.ids) {
            prev.in("id", params.ids);
          }
          if (params.period_id) {
            prev.eq("period_id", params.period_id);
          }
          return prev
            .order("year", { ascending: true })
            .order("month", { ascending: true })
            .order("date", { ascending: true })
            .order("hour", { ascending: true })
            .order("minute", { ascending: true });
        },
      ],
    });
  }
  emptyReq(universe_id: string, period_id: string = ""): TablesInsert<"events"> {
    return {
      name: "",
      universe_id,
      period_id,
    };
  }
  toDate(event: TablesInsert<"events">): Date {
    return new Date(event.year ?? 0, event.month ?? 0, event.date ?? 0, event.hour ?? 0, event.minute ?? 0);
  }
}

export const eventApi: EventApi = new EventApi();
