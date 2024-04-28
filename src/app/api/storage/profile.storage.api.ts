import { StorageImage, StorageImageApi } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { Profile } from "../table/profile.api";

export class ProfileStorageApi extends StorageImageApi {
  extends: string = "jpeg";
  constructor() {
    super(supabase, "profiles");
  }
  async downloadImageByProfile(profile: Profile["Row"]): Promise<StorageImage | null> {
    const fileName = this.fileNameByProfile(profile);
    if (!fileName) return null;
    return await this.downloadImage(fileName, profile.uid);
  }
  fileNameByProfile(profile: Profile["Row"]): string | null {
    if (!profile.avatar_key || profile.avatar_key == "") return null;
    return profile.avatar_key + "." + this.extends;
  }
  avatarKeyByFile(file: File): string {
    return file.name.replace("." + this.extends, "");
  }
}

export const profileStorageApi: ProfileStorageApi = new ProfileStorageApi();
