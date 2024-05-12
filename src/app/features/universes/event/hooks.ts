import { eventApi } from "@/app/api/table/universe/event.api";
import {
  listEventUnionByCharacter,
  listEventUnionByEpisode,
  listEventUnionByPeriod,
  upsertEventUnion,
} from "@/app/api/union/event.union.api";
import { useM, useQ } from "@/common/utils/api.util";

type UseEventUnionsProps = {
  universe_id: string;
} & (
  | { type: "character"; character_id: string }
  | { type: "episode"; episode_id: string }
  | { type: "period"; period_id: string }
);

export const useEventUnions = (props: UseEventUnionsProps) =>
  useQ(eventApi.tableName, props, async (props) => {
    if (props.type == "character") {
      return await listEventUnionByCharacter(props.universe_id, props.character_id);
    }
    if (props.type == "episode") {
      return await listEventUnionByEpisode(props.universe_id, props.episode_id);
    }
    if (props.type == "period") {
      return await listEventUnionByPeriod(props.universe_id, props.period_id);
    }
    return [];
  });

export const useUpsertEventUnion = () => useM(eventApi.tableName, upsertEventUnion);
