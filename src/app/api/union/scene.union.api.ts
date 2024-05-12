import { makeCompareFn } from "@/common/utils/array.util";
import { multiStock, singleStock } from "@/common/utils/stocker.util";
import { Tables, TablesInsert } from "@supabase/database.type";
import { episodeApi } from "../table/universe/episode.api";
import { sceneApi } from "../table/universe/scene.api";
import { eventApi } from "../table/universe/event.api";
import { periodApi } from "../table/universe/period.api";
import { characterEventApi } from "../table/universe/character_event.api";
import { characterApi } from "../table/universe/character.api";
import { makeUUID } from "@/common/utils/uid.util";

export type SceneUnion = {
  scene: Tables<"scenes">;
  period: Tables<"periods">;
  event: Tables<"events">;
  characterUnions: SceneEventCharacterUnion[];
};

export type SceneEventCharacterUnion = {
  relation: Tables<"character&event$relations">;
  character: Tables<"characters">;
};

function makeSceneUnions(
  events: Tables<"events">[],
  periods: Tables<"periods">[],
  characterEvents: Tables<"character&event$relations">[],
  scenes: Tables<"scenes">[],
  characters: Tables<"characters">[],
): SceneUnion[] {
  const eventStocker = singleStock<Tables<"events">>((e) => e.id).setAll(events);
  const periodStocker = singleStock<Tables<"periods">>((e) => e.id).setAll(periods);
  const characterStocker = singleStock<Tables<"characters">>((e) => e.id).setAll(characters);
  const characterEventStocker = multiStock<Tables<"character&event$relations">>((e) => e.event_id).setAll(
    characterEvents,
  );
  return scenes
    .map((scene): SceneUnion => {
      const event = eventStocker.getUnsafe(scene.event_id);
      return {
        scene,
        event,
        period: periodStocker.getUnsafe(event.period_id),
        characterUnions: characterEventStocker.get(event.id).map((relation) => {
          return {
            relation,
            character: characterStocker.getUnsafe(relation.character_id),
          };
        }),
      };
    })
    .sort(makeCompareFn([(union) => union.scene.seq ?? 0]));
}

export async function listEventUnionByEpisode(universe_id: string, episode_id: string) {
  const episode = await episodeApi.find({ id: episode_id, universe_id });
  if (!episode) return [];
  const scenes = await sceneApi.list({ universe_id, episode_id });
  const events = await eventApi.list({ ids: scenes.map((r) => r.event_id), universe_id });
  const periods = await periodApi.list({ ids: events.map((ev) => ev.period_id), universe_id });
  const characterEvents = await characterEventApi.list({ event_ids: events.map((e) => e.id), universe_id });
  const characters = await characterApi.list({ ids: characterEvents.map((ev) => ev.character_id), universe_id });
  return makeSceneUnions(events, periods, characterEvents, scenes, characters);
}

export type SceneUnionReq = {
  scene: TablesInsert<"scenes">;
  period: TablesInsert<"periods">;
  event: TablesInsert<"events">;
  characterUnions: SceneEventCharacterUnionReq[];
};

export type SceneEventCharacterUnionReq = {
  relation: TablesInsert<"character&event$relations">;
  character: TablesInsert<"characters">;
};

export async function upsertSceneUnion(union: SceneUnionReq) {
  const period_id = union.period.id ?? makeUUID();
  const event_id = union.event.id ?? makeUUID();
  await periodApi.upsert({ ...union.period, id: period_id });
  await eventApi.upsert({ ...union.event, id: event_id, period_id });
  await sceneApi.upsert({ ...union.scene, event_id });
  await characterEventApi.upsertMulti(
    union.characterUnions.map((u) => {
      return { ...u.relation, event_id };
    }),
  );
}
