import { sceneApi } from "@/app/api/table/universe/scene.api";
import { upsertSceneUnion } from "@/app/api/union/scene.union.api";
import { useM } from "@/common/utils/api.util";

export const useUpsertSceneUnion = () => useM(sceneApi.tableName, upsertSceneUnion);
