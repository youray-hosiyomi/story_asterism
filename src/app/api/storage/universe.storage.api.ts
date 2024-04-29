import { StorageImage, StorageImageApi } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { Tables, TablesInsert } from "@supabase/database.type";

export class UniverseStorageApi extends StorageImageApi {
  extends: string = "jpeg";
  constructor() {
    super(supabase, "universes");
  }
  async downloadImageByUniverse(
    universe: Tables<"universes"> | TablesInsert<"universes">,
  ): Promise<StorageImage | null> {
    const fileName = this.fileNameByUniverse(universe);
    if (!fileName) return null;
    return await this.downloadImage(fileName, universe.id);
  }
  fileNameByUniverse(universe: Tables<"universes"> | TablesInsert<"universes">): string | null {
    if (!universe.image_key || universe.image_key == "") return null;
    return universe.image_key + "." + this.extends;
  }
  imageKeyByFile(file: File): string {
    return file.name.replace("." + this.extends, "");
  }
}

export const universeStorageApi: UniverseStorageApi = new UniverseStorageApi();
