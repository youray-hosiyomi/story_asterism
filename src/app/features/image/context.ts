import { StorageImage, StorageImageApi } from "@/common/utils/api.util";
import { createContext } from "react";

export type ImageSelectConfig = {
  api: StorageImageApi;
  newFileName?: string;
  prevFileName?: string;
  folderPath?: string;
  onSelect: (image: StorageImage) => void;
};

interface ImageContextProps {
  select: (config: ImageSelectConfig) => void;
}

export const ImageContext = createContext<ImageContextProps>({
  select(config) {
    config;
  },
});
