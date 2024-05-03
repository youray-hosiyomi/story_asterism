import { StorageImage, StorageImageApi } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";

export class UniverseStorageApi extends StorageImageApi {
  extends: string = "jpeg";
  constructor() {
    super(supabase, "universes");
  }
  async downloadImageByUniverse(
    universe_id: string = "",
    image_key: string | null | undefined,
  ): Promise<StorageImage | null> {
    const fileName = this.fileNameByImageKey(image_key);
    if (!fileName) return null;
    return await this.downloadImage(fileName, universe_id);
  }
  fileNameByImageKey(image_key: string | null | undefined): string | null {
    if (!image_key || image_key == "") return null;
    return image_key + "." + this.extends;
  }
  imageKeyByFile(file: File): string {
    return file.name.replace("." + this.extends, "");
  }
}

export const universeStorageApi: UniverseStorageApi = new UniverseStorageApi();
