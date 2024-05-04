import { TablesInsert } from "@supabase/database.type";
import { universeApi } from "@/app/api/table/universe/universe.api";
import { useState, FC, useCallback } from "react";
import { useImageContext } from "@/app/features/image/hook";
import { universeStorageApi } from "@/app/api/storage/universe.storage.api";
import { UniverseImg } from "@/app/features/universes/img.component";
import UIFormControl from "@/common/ui/form-control.ui";
import { useKeyActionEffect } from "@/common/utils/key-action.util";
import { makeUUID } from "@/common/utils/uid.util";

interface UniverseEditorProps {
  initReq: TablesInsert<"universes">;
  onSave?: (id: string, req: TablesInsert<"universes">) => void;
}

const UniverseEditor: FC<UniverseEditorProps> = ({ initReq, onSave }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [req, setReq] = useState(initReq);
  const { select } = useImageContext();
  const upsert = universeApi.mutation.useUpsert();
  const onUpsert = useCallback(() => {
    const id = req.id ?? makeUUID();
    const upsertReq = { ...req, id };
    upsert.mutateAsync(upsertReq).then(() => {
      setImageUrl(undefined);
      if (onSave) onSave(id, upsertReq);
    });
  }, [req, upsert, onSave]);
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
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              select({
                api: universeStorageApi,
                folderPath: req.id,
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
              universe_id={req.id}
              image_key={req.image_key}
              src={imageUrl}
              className="w-40 rounded-lg bg-base-100 ring ring-base-content ring-offset-base-100 ring-offset-2"
            />
          </button>
        </div>
      )}
      <div>
        <UIFormControl labelText="ユニバース名">
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

export default UniverseEditor;
