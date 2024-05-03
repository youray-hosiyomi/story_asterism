import { StorageImage } from "@/common/utils/api.util";
import { Tables } from "@supabase/database.type";
import { universeApi } from "../table/universe/universe.api";
import { universeStorageApi } from "../storage/universe.storage.api";

export type UniverseUnion = {
  universe: Tables<"universes">;
  image?: StorageImage;
};

export async function getUniverseUnion(universeId: string): Promise<UniverseUnion | null> {
  const universe = await universeApi.find({ id: universeId });
  if (!universe) return null;
  const image = await universeStorageApi.downloadImageByUniverse(universe.id, universe.image_key);
  return {
    universe,
    image: image ?? undefined,
  };
}
