import { FC, useState } from "react";
import UIFormControl from "@/common/ui/form-control.ui";
import { periodApi } from "@/app/api/table/universe/period.api";
import { TablesInsert } from "@supabase/database.type";
import UICheckbox from "@/common/ui/checkbox.ui";

const Period_Editor: FC<{ initReq: TablesInsert<"periods">; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const [req, setReq] = useState(initReq);
  const upsert = periodApi.mutation.useUpsert();
  // const isNew: boolean = useMemo(() => !req.event.id, [req]);
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
        <UIFormControl labelText="時間軸名">
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
        <UIFormControl labelText="詳細">
          <textarea
            className="textarea textarea-bordered"
            value={req.detail ?? ""}
            onChange={(ev) => {
              setReq({
                ...req,
                detail: ev.target.value,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="現実の時間軸か否か">
          <UICheckbox
            checked={req.is_real ?? false}
            onChange={(ev) => {
              setReq({
                ...req,
                is_real: ev.target.checked,
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

export default Period_Editor;
