import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export class IdeaApi extends ApiHandler<"ideas", "id"> {
  constructor() {
    super(supabase, {
      tableName: "ideas",
      primaryKeys: ["id"],
      uniqueKeys: ["id"],
      handlers: [],
    });
  }
  emptyReq(): TablesInsert<"ideas"> {
    return {
      name: "",
    };
  }
}

export const ideaApi: IdeaApi = new IdeaApi();
