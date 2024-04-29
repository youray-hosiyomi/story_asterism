import { TablesInsert } from "@supabase/database.type";
import { universeApi } from "@/app/api/table/universe.api";
import { useState, FC } from "react";
import { useImageContext } from "@/app/features/image/hook";
import { universeStorageApi } from "@/app/api/storage/universe.storage.api";
import { UniverseImg } from "@/app/features/universes/img.component";
import UIFormControl from "@/common/ui/form-control.ui";

interface UniverseEditorProps {
  initReq: TablesInsert<"universes">;
}

const UniverseEditor: FC<UniverseEditorProps> = ({ initReq }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [req, setReq] = useState(initReq);
  const { select } = useImageContext();
  const upsert = universeApi.mutation.useUpsert();
  function onUpsert() {
    upsert.mutateAsync(req);
  }
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
                folderPath: req.id,
                prevFileName: universeStorageApi.fileNameByUniverse(req) ?? undefined,
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
              universe={req}
              src={imageUrl}
              className="w-64 rounded-lg bg-base-100 ring ring-base-content ring-offset-base-100 ring-offset-2"
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
            className="textarea textarea-bordered"
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
      <div className="flex justify-end items-center">
        <button type="submit" className="btn btn-success">
          登録
        </button>
      </div>
    </form>
  );
};

export default UniverseEditor;
