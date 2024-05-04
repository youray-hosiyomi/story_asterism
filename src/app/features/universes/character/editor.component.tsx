import { TablesInsert } from "@supabase/database.type";
import { FC, useCallback, useEffect, useState } from "react";
import { useImageContext } from "../../image/hook";
import { characterApi } from "@/app/api/table/universe/character.api";
import { universeStorageApi } from "@/app/api/storage/universe.storage.api";
import { UniverseImg } from "../img.component";
import UIFormControl from "@/common/ui/form-control.ui";
import { useKeyActionEffect } from "@/common/utils/key-action.util";

const Character_Editor: FC<{ initReq: TablesInsert<"characters"> }> = ({ initReq }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [req, setReq] = useState(initReq);
  const { select } = useImageContext();
  const upsert = characterApi.mutation.useUpsert();
  const onUpsert = useCallback(() => {
    upsert.mutateAsync(req).then(() => {
      setImageUrl(undefined);
    });
  }, [req, upsert]);
  useEffect(() => {
    setReq(initReq);
    setImageUrl(undefined);
  }, [initReq]);
  useKeyActionEffect({
    onCtrlS() {
      onUpsert();
    },
  });
  return (
    <form
      className="p-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        onUpsert();
      }}
    >
      {initReq.id && (
        <div>
          <button
            type="button"
            onClick={() => {
              select({
                api: universeStorageApi,
                folderPath: req.universe_id,
                prevFileName: universeStorageApi.fileNameByImageKey(req.image_key) ?? undefined,
                onSelect(image) {
                  const key = universeStorageApi.imageKeyByFile(image.file);
                  setImageUrl(image.url);
                  setReq({
                    ...req,
                    image_key: key,
                  });
                },
              });
            }}
          >
            <UniverseImg
              universe_id={req.universe_id}
              image_key={req.image_key}
              src={imageUrl}
              className="w-64 rounded-lg bg-base-100 ring ring-base-content ring-offset-base-100 ring-offset-2"
            />
          </button>
        </div>
      )}
      <div>
        <UIFormControl labelText="キャラクター名">
          <input
            type="text"
            className="input input-bordered"
            value={req.name ?? ""}
            onChange={(ev) => {
              const name = ev.target.value;
              setReq({
                ...req,
                name,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="詳細">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.detail ?? ""}
            onChange={(ev) => {
              const detail = ev.target.value;
              setReq({
                ...req,
                detail,
              });
            }}
          />
        </UIFormControl>
      </div>
      <div className="flex justify-end items-center sticky bottom-4">
        <button type="submit" className="btn btn-success">
          登録
        </button>
      </div>
    </form>
  );
};

export default Character_Editor;
