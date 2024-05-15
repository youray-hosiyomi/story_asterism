import { sceneApi } from "@/app/api/table/universe/scene.api";
import { listSceneUnionByEpisode } from "@/app/api/union/scene.union.api";
import { useQ } from "@/common/utils/api.util";

export type useSceneUnionsParams = {
  universe_id: string;
  episode_id: string;
};
export const useSceneUnions = (params: useSceneUnionsParams) =>
  useQ(sceneApi.tableName, params, ({ universe_id, episode_id }) => listSceneUnionByEpisode(universe_id, episode_id));
