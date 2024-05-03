import { episodeApi } from "@/app/api/table/universe/episode.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { TablesInsert } from "@supabase/database.type";
import { FC, useMemo, useState } from "react";

const Episode_MiniEditor: FC<{ initReq: TablesInsert<"episodes">; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const [req, setReq] = useState(initReq);
  const upsert = episodeApi.mutation.useUpsert();
  const remove = episodeApi.mutation.useDelete();
  const isNew: boolean = useMemo(() => !req.id, [req]);
  function onRemove() {
    if (req.id)
      remove.mutateAsync({ id: req.id, universe_id: req.universe_id }).then(() => {
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
          {!isNew && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-error btn-sm"
                onClick={() => {
                  onRemove();
                }}
              >
                Delete
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
            Cancel
          </button>
          <button type="submit" className="btn btn-outline btn-success btn-sm">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default Episode_MiniEditor;
