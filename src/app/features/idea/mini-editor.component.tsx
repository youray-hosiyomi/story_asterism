import { ideaApi } from "@/app/api/table/idea.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { TablesInsert } from "@supabase/database.type";
import { FC, useMemo, useState } from "react";

const Idea_MiniEditor: FC<{ initReq: TablesInsert<"ideas">; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const [req, setReq] = useState(initReq);
  const upsert = ideaApi.mutation.useUpsert();
  const remove = ideaApi.mutation.useDelete();
  const isNew: boolean = useMemo(() => !req.id, [req]);
  function onRemove() {
    if (req.id)
      remove.mutateAsync({ id: req.id }).then(() => {
        onSave();
      });
  }
  return (
    <>
      <form
        className="space-y-3 mx-auto"
        onSubmit={(ev) => {
          ev.preventDefault();
          upsert.mutateAsync(req).then(() => {
            onSave();
          });
        }}
      >
        <div>
          <UIFormControl labelText="アイデア名">
            <input
              className="input input-bordered"
              value={req.name}
              onChange={(ev) => {
                setReq({
                  ...req,
                  name: ev.target.value,
                });
              }}
            />
          </UIFormControl>
        </div>
        <div className="flex items-center justify-end space-x-2">
          {!isNew && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-error btn-sm"
                onClick={() => {
                  onRemove();
                }}
              >
                削除
              </button>
            </>
          )}
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

export default Idea_MiniEditor;
