import { universeStorageApi } from "@/app/api/storage/universe.storage.api";
import { UIAvatarProps, UILoadingAvatar } from "@/common/ui/avatar.ui";
import { Tables, TablesInsert } from "@supabase/database.type";
import { FC, useCallback, useMemo } from "react";

interface UniverseImgProps extends UIAvatarProps {
  universe?: Tables<"universes"> | TablesInsert<"universes">;
  universe_id?: string;
  image_key?: string | null;
}

export const UniverseImg: FC<UniverseImgProps> = ({
  universe,
  universe_id = universe?.id ?? "",
  image_key = universe?.image_key ?? "",
  ...props
}) => {
  const key = useMemo(() => {
    return universe_id + "_" + image_key;
  }, [image_key, universe_id]);
  const getSrc = useCallback(async (): Promise<string | null> => {
    if (!image_key) {
      return null;
    }
    const img = await universeStorageApi.downloadImageByUniverse(universe_id, image_key);
    return img?.url ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image_key, universe_id]);
  return <UILoadingAvatar {...props} onErrorSrc="/assets/svg/user.svg" getSrc={getSrc} getKey={key} />;
};
