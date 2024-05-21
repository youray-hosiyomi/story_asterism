import { Tables, TablesInsert } from "@supabase/database.type";
import { characterEventApi } from "../table/universe/character_event.api";
import { characterApi } from "../table/universe/character.api";
import { eventApi } from "../table/universe/event.api";
import { sceneApi } from "../table/universe/scene.api";
import { multiStock, singleStock } from "@/common/utils/stocker.util";
import { periodApi } from "../table/universe/period.api";
import { episodeApi } from "../table/universe/episode.api";
import { makeCompareFn } from "@/common/utils/array.util";
import { makeUUID } from "@/common/utils/uid.util";

export type EventUnion = {
  period: Tables<"periods">;
  event: Tables<"events">;
  characterUnions: EventCharacterUnion[];
  sceneUnions: EventSceneUnion[];
};

export type EventCharacterUnion = {
  relation: Tables<"character&event$relations">;
  character: Tables<"characters">;
};

export type EventSceneUnion = {
  scene: Tables<"scenes">;
  episode: Tables<"episodes">;
};

function makeEventUnions(
  events: Tables<"events">[],
  periods: Tables<"periods">[],
  characterEvents: Tables<"character&event$relations">[],
  scenes: Tables<"scenes">[],
  characters: Tables<"characters">[],
  episodes: Tables<"episodes">[],
): EventUnion[] {
  const periodStocker = singleStock<Tables<"periods">>((e) => e.id).setAll(periods);
  const characterStocker = singleStock<Tables<"characters">>((e) => e.id).setAll(characters);
  const episodeStocker = singleStock<Tables<"episodes">>((e) => e.id).setAll(episodes);
  const characterEventStocker = multiStock<Tables<"character&event$relations">>((e) => e.event_id).setAll(
    characterEvents,
  );
  const sceneStocker = multiStock<Tables<"scenes">>((e) => e.event_id ?? "").setAll(scenes);
  return events
    .map((event): EventUnion => {
      return {
        event,
        period: periodStocker.getUnsafe(event.period_id),
        characterUnions: characterEventStocker.get(event.id).map((relation) => {
          return {
            relation,
            character: characterStocker.getUnsafe(relation.character_id),
          };
        }),
        sceneUnions: sceneStocker.get(event.id).map((scene) => {
          return {
            scene,
            episode: episodeStocker.getUnsafe(scene.episode_id),
          };
        }),
      };
    })
    .sort(
      makeCompareFn([
        (union) => union.event.year,
        (union) => union.event.month,
        (union) => union.event.date,
        (union) => union.event.hour,
        (union) => union.event.minute,
      ]),
    );
}

export async function listEventUnionByCharacter(universe_id: string, character_id: string) {
  const character = await characterApi.find({ id: character_id, universe_id });
  if (!character) return [];
  const characterEvents = await characterEventApi.list({ universe_id, character_id });
  const events = await eventApi.list({ ids: characterEvents.map((r) => r.event_id), universe_id });
  const periods = await periodApi.list({ ids: events.map((ev) => ev.period_id), universe_id });
  const scenes = await sceneApi.list({ event_ids: events.map((e) => e.id), universe_id });
  const episodes = await episodeApi.list({ ids: scenes.map((ev) => ev.episode_id), universe_id });
  return makeEventUnions(events, periods, characterEvents, scenes, [character], episodes);
}

export async function listEventUnionByEpisode(universe_id: string, episode_id: string) {
  const episode = await episodeApi.find({ id: episode_id, universe_id });
  if (!episode) return [];
  const scenes = await sceneApi.list({ universe_id, episode_id });
  const events = await eventApi.list({
    ids: scenes.reduce((sum: string[], r) => (r.event_id ? sum.concat(r.event_id) : sum), []),
    universe_id,
  });
  const periods = await periodApi.list({ ids: events.map((ev) => ev.period_id), universe_id });
  const characterEvents = await characterEventApi.list({ event_ids: events.map((e) => e.id), universe_id });
  const characters = await characterApi.list({ ids: characterEvents.map((ev) => ev.character_id), universe_id });
  return makeEventUnions(events, periods, characterEvents, scenes, characters, [episode]);
}

export async function listEventUnionByPeriod(universe_id: string, period_id: string) {
  const period = await periodApi.find({ id: period_id, universe_id });
  if (!period) return [];
  const events = await eventApi.list({ universe_id, period_id });
  const scenes = await sceneApi.list({ event_ids: events.map((ev) => ev.id), universe_id });
  const characterEvents = await characterEventApi.list({ event_ids: events.map((ev) => ev.id), universe_id });
  const episodes = await episodeApi.list({ ids: scenes.map((ev) => ev.episode_id), universe_id });
  const characters = await characterApi.list({ ids: characterEvents.map((ev) => ev.character_id), universe_id });
  return makeEventUnions(events, [period], characterEvents, scenes, characters, episodes);
}

export type EventUnionReq = {
  period: TablesInsert<"periods">;
  event: TablesInsert<"events">;
  characterUnions: EventCharacterUnionReq[];
  episodeUnions: EventEpisodeUnionReq[];
};

export type EventCharacterUnionReq = {
  relation: TablesInsert<"character&event$relations">;
  character: TablesInsert<"characters">;
};

export type EventEpisodeUnionReq = {
  relation: TablesInsert<"scenes">;
  episode: TablesInsert<"episodes">;
};

export async function upsertEventUnion(union: EventUnionReq) {
  const period_id = union.period.id ?? makeUUID();
  const event_id = union.event.id ?? makeUUID();
  await periodApi.upsert({ ...union.period, id: period_id });
  await eventApi.upsert({ ...union.event, id: event_id, period_id });
  await characterEventApi.upsertMulti(
    union.characterUnions.map((u) => {
      return { ...u.relation, event_id };
    }),
  );
  await sceneApi.upsertMulti(
    union.episodeUnions.map((u) => {
      return { ...u.relation, event_id };
    }),
  );
}
