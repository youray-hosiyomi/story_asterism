import { universeStorageApi } from "@/app/api/storage/universe.storage.api";
import { UIAvatar, UIAvatarProps } from "@/common/ui/avatar.ui";
import { Tables, TablesInsert } from "@supabase/database.type";
import { FC, useCallback } from "react";

interface UniverseImgProps extends UIAvatarProps {
  universe: Tables<"universes"> | TablesInsert<"universes">;
}

export const UniverseImg: FC<UniverseImgProps> = ({ universe, ...props }) => {
  const getSrc = useCallback(async (): Promise<string | undefined> => {
    const img = await universeStorageApi.downloadImageByUniverse(universe);
    return img?.url;
  }, [universe]);
  return <UIAvatar {...props} onErrorSrc="/assets/svg/user.svg" getSrc={getSrc} />;
};
