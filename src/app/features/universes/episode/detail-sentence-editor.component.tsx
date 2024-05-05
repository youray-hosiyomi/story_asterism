import { episodeApi } from "@/app/api/table/universe/episode.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { useKeyActionEffect } from "@/common/utils/key-action.util";
import { TablesInsert } from "@supabase/database.type";
import { FC, useCallback, useEffect, useState } from "react";

const Episode_DetailSentenceEditor: FC<{ initReq: TablesInsert<"episodes">; goHome: () => void }> = ({
  initReq,
  goHome,
}) => {
  const [req, setReq] = useState(initReq);
  const upsert = episodeApi.mutation.useUpsert();
  const onUpsert = useCallback(
    (req: TablesInsert<"episodes">) => {
      upsert.mutateAsync(req).then(() => {
        goHome();
      });
    },
    [upsert, goHome],
  );
  const onCancel = useCallback(() => {
    goHome();
  }, [goHome]);
  useEffect(() => {
    setReq(initReq);
  }, [initReq]);
  useKeyActionEffect({
    onCtrlS() {
      onUpsert(req);
    },
    onEscape() {
      onCancel();
    },
  });
  return (
    <form
      className="p-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        onUpsert(req);
      }}
    >
      <div>
        <UIFormControl labelText="テキスト">
          <textarea
            className="textarea textarea-bordered min-h-[50vh]"
            value={req.content ?? ""}
            onChange={(ev) => {
              const content = ev.target.value;
              setReq({
                ...req,
                content,
              });
            }}
          />
        </UIFormControl>
      </div>
      <div className="flex justify-end items-center space-x-2 sticky bottom-4">
        <button
          type="button"
          className="btn"
          onClick={() => {
            onCancel();
          }}
        >
          キャンセル
        </button>
        <button type="submit" className="btn btn-success">
          登録
        </button>
      </div>
    </form>
  );
};

export default Episode_DetailSentenceEditor;
