import { FC, useState } from "react";
import UIFormControl from "@/common/ui/form-control.ui";
import { TablesInsert } from "@supabase/database.type";
import { sceneApi } from "@/app/api/table/universe/scene.api";
import { makeUUID } from "@/common/utils/uid.util";

const Scene_Editor: FC<{
  initReq: TablesInsert<"scenes">;
  upsertDisabled?: boolean;
  onSave: (req: TablesInsert<"scenes">) => void;
  onCancel: () => void;
}> = ({ initReq, onSave, onCancel, upsertDisabled }) => {
  const [req, setReq] = useState<TablesInsert<"scenes">>(initReq);
  const upsert = sceneApi.mutation.useUpsert();
  return (
    <>
      <form
        className="space-y-3 mx-auto"
        onSubmit={(ev) => {
          ev.preventDefault();
          const r = {
            ...req,
            id: req.id ?? makeUUID(),
          };
          if (!upsertDisabled) {
            upsert.mutateAsync(r).then(() => {
              onSave(r);
            });
          } else {
            onSave(r);
          }
        }}
      >
        <UIFormControl labelText="シーン名">
          <input
            className="input input-bordered"
            value={req.name ?? ""}
            onChange={(ev) => {
              setReq({
                ...req,
                name: ev.target.value,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="シーン詳細">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.detail ?? ""}
            onChange={(ev) => {
              setReq({
                ...req,
                detail: ev.target.value,
              });
            }}
          />
        </UIFormControl>
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              onCancel();
            }}
          >
            キャンセル
          </button>
          <button type="submit" className="btn btn-outline btn-success btn-sm">
            保存
          </button>
        </div>
      </form>
    </>
  );
};

export default Scene_Editor;
