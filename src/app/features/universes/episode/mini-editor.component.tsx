import { episodeApi } from "@/app/api/table/universe/episode.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { makeUUID } from "@/common/utils/uid.util";
import { TablesInsert } from "@supabase/database.type";
import { FC, useState } from "react";

const Episode_MiniEditor: FC<{
  initReq: TablesInsert<"episodes">;
  onSave: (req: TablesInsert<"episodes">) => void;
  onCancel: () => void;
}> = ({ initReq, onSave, onCancel }) => {
  const [req, setReq] = useState(initReq);
  const upsert = episodeApi.mutation.useUpsert();
  return (
    <>
      <form
        className="space-y-3 mx-auto"
        onSubmit={(ev) => {
          ev.preventDefault();
          const newReq = {
            ...req,
            id: req.id ?? makeUUID(),
          };
          upsert.mutateAsync(newReq).then(() => {
            onSave(newReq);
          });
        }}
      >
        <div>
          <UIFormControl labelText="タイトル">
            <input
              className="input input-bordered"
              value={req.title}
              onChange={(ev) => {
                setReq({
                  ...req,
                  title: ev.target.value,
                });
              }}
            />
          </UIFormControl>
        </div>
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

export default Episode_MiniEditor;
