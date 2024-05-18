import { UIConfirm_RenderContentProps, useConfirm } from "@/common/ui/confirm.ui";
import { FC, ReactNode, useMemo, useState } from "react";
import { ImageContext, ImageSelectConfig } from "./context";
import { PlusIcon } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/common/utils/image.util";
import { makeUUID } from "@/common/utils/uid.util";
import UIFormControl from "@/common/ui/form-control.ui";
import { UILoadingArea } from "@/common/ui/loading.ui";
import UserAvatar from "../user/avatar.component";
import { cn } from "@shadcn/lib/utils";
import { StorageImage } from "@/common/utils/api.util";
import { useQueryClient } from "@tanstack/react-query";

type ImageCropParams = {
  zoom: number;
  crop: { x: number; y: number };
  rotation: number;
};

const defaultImageCropParams: ImageCropParams = {
  zoom: 1,
  crop: { x: 0, y: 0 },
  rotation: 0,
};

const NewImageEditor: FC<UIConfirm_RenderContentProps & { config: ImageSelectConfig; file: File }> = ({
  ok,
  cancel,
  config,
  file,
}) => {
  const croppedImageUrl = useMemo<string>(() => {
    return URL.createObjectURL(file);
  }, [file]);
  const [params, setParams] = useState({ ...defaultImageCropParams });
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isPending, setIsPending] = useState(false);
  async function add(
    croppedUrl: string,
    croppedArea: Area | null,
    fileName: string = makeUUID(),
  ): Promise<StorageImage | null> {
    if (croppedArea) {
      const value = await getCroppedImg(croppedUrl, croppedArea);
      if (value) {
        const newFile = new File([value.blob], fileName + ".jpeg", { type: value.blob.type });
        await config.api.upload(newFile, config.folderPath);
        return {
          file: newFile,
          url: value.url,
        };
      }
    }
    return null;
  }
  function onAdd() {
    setIsPending(true);
    add(croppedImageUrl, croppedArea, config.newFileName)
      .then((fileName) => {
        if (fileName) {
          config.onSelect(fileName);
          ok();
        }
      })
      .finally(() => {
        setIsPending(false);
      });
  }
  return (
    <div>
      <div>
        <div className="bg-gray relative w-3/4 aspect-square p-0 mx-auto">
          <Cropper
            image={croppedImageUrl}
            crop={params.crop}
            zoom={params.zoom}
            rotation={params.rotation}
            aspect={1}
            onCropChange={(crop) => setParams({ ...params, crop })}
            onZoomChange={(zoom) => setParams({ ...params, zoom })}
            onRotationChange={(rotation) => setParams({ ...params, rotation })}
            onCropComplete={(_, croppedAreaPixels: Area) => {
              setCroppedArea(croppedAreaPixels);
            }}
          />
        </div>
        <div className="">
          <UIFormControl labelText={`Zoom: ${Math.round((params.zoom - 1) * 100 + 100)}%`}>
            <input
              className="range"
              type="range"
              value={((params.zoom - 1) / 2) * 100}
              min={0}
              max={100}
              onChange={(ev) => {
                setParams({
                  ...params,
                  zoom: (2 * Number(ev.target.value)) / 100 + 1,
                });
              }}
            />
          </UIFormControl>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => {
            cancel();
          }}
        >
          キャンセル
        </button>
        <button
          type="button"
          disabled={isPending}
          className="btn btn-outline btn-success btn-sm"
          onClick={() => {
            onAdd();
          }}
        >
          選択
        </button>
      </div>
    </div>
  );
};

const ImageSelector: FC<UIConfirm_RenderContentProps & { config: ImageSelectConfig }> = ({
  ok,
  cancel,
  confirm,
  config,
}) => {
  const [selectedFileName, setSelectedImage] = useState<string | null>(config.prevFileName ?? null);
  const queryClient = useQueryClient();
  const { data: images, isLoading } = config.api.useList(config.folderPath, { limit: 12 });
  function select() {
    const image = images?.find((image) => image.file.name == selectedFileName);
    if (image) {
      config.onSelect(image);
      ok();
    }
  }
  function add(file: File) {
    confirm({
      RenderContent: (props) => {
        return <NewImageEditor {...props} config={config} file={file} />;
      },
      onOk() {
        queryClient.invalidateQueries({
          queryKey: [config.api.queryKey],
          type: "active",
        });
        ok();
      },
    });
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div></div>
        <div>
          <label htmlFor="add-image" className="btn btn-success btn-sm">
            <PlusIcon className="" />
          </label>
          <input
            id="add-image"
            type="file"
            accept="image/*"
            multiple={false}
            hidden
            onChange={(ev) => {
              const file = ev.target.files?.item(0);
              ev.target.value = "";
              if (file) add(file);
            }}
          />
        </div>
      </div>
      <div>
        {isLoading ? (
          <UILoadingArea />
        ) : (
          <div className="grid grid-cols-3">
            {images?.map((image, index) => {
              const selected = selectedFileName == image.file.name;
              return (
                <div
                  key={index}
                  className={cn("m-1 p-1", selected ? "border-2 border-primary" : "")}
                  onClick={() => {
                    setSelectedImage(!selected ? image.file.name : null);
                  }}
                >
                  <UserAvatar src={image.url} className="w-full" />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => {
            cancel();
          }}
        >
          キャンセル
        </button>
        <button
          type="button"
          disabled={!selectedFileName}
          className="btn btn-outline btn-success btn-sm"
          onClick={() => {
            select();
          }}
        >
          選択
        </button>
      </div>
    </div>
  );
};

export const ImageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { confirm } = useConfirm();
  return (
    <ImageContext.Provider
      value={{
        select(config) {
          confirm({
            RenderContent: (props) => {
              return <ImageSelector {...props} config={config} />;
            },
          });
        },
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
