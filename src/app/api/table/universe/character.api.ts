import { ApiHandler, PrimaryParams } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { Tables, TablesInsert } from "@supabase/database.type";
import { characterOrderApi } from "./character.order.api";
import { makeUUID } from "@/common/utils/uid.util";

export type Character_SearchParams = {
  ids?: string[];
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
          if (params.ids) {
            prev.in("id", params.ids);
          }
          return prev;
        },
      ],
    });
  }
  override async insert(req: TablesInsert<"characters">) {
    req = {
      ...req,
      id: req.id ?? makeUUID(),
    };
    const order = await characterOrderApi.find({ universe_id: req.universe_id });
    const orderReq = order ?? characterOrderApi.emptyReq(req.universe_id);
    await characterOrderApi.upsert({
      ...orderReq,
      character_id_list: orderReq.character_id_list.concat(req.id ? [req.id] : []),
    });
    return await super.insert(req);
  }
  override async upsert(req: TablesInsert<"characters">) {
    req = {
      ...req,
      id: req.id ?? makeUUID(),
    };
    const order = await characterOrderApi.find({ universe_id: req.universe_id });
    const orderReq = order ?? characterOrderApi.emptyReq(req.universe_id);
    await characterOrderApi.upsert({
      ...orderReq,
      character_id_list: orderReq.character_id_list.concat(req.id ? [req.id] : []),
    });
    return await super.upsert(req);
  }
  override async delete(primaryParams: PrimaryParams<"characters", "id" | "universe_id">) {
    const order = await characterOrderApi.find({ universe_id: primaryParams.universe_id });
    const orderReq = order ?? characterOrderApi.emptyReq(primaryParams.universe_id);
    await characterOrderApi.upsert({
      ...orderReq,
      character_id_list: orderReq.character_id_list.filter((id) => id !== primaryParams.id),
    });
    return await super.delete(primaryParams);
  }
  override async list(searchParams: Character_SearchParams): Promise<Tables<"characters">[]> {
    const order = await characterOrderApi.find({ universe_id: searchParams.universe_id });
    const ids: string[] = order?.character_id_list ?? [];
    const list = await super.list(searchParams);
    return list.sort((a, b) => {
      const aSeq = ids.indexOf(a.id);
      const bSeq = ids.indexOf(b.id);
      if (aSeq < bSeq) return -1;
      if (aSeq > bSeq) return 1;
      return 0;
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
