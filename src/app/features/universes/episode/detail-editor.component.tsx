import { TablesInsert } from "@supabase/database.type";
import { FC, useCallback, useEffect, useState } from "react";
import { episodeApi } from "@/app/api/table/universe/episode.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { useKeyActionEffect } from "@/common/utils/key-action.util";

const Episode_Detail_Editor: FC<{ initReq: TablesInsert<"episodes">; goHome: () => void }> = ({ initReq, goHome }) => {
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
        <UIFormControl labelText="">
          タイトル
          <input
            type="text"
            className="input input-bordered"
            value={req.title ?? ""}
            onChange={(ev) => {
              const title = ev.target.value;
              setReq({
                ...req,
                title,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="概要">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.summary ?? ""}
            onChange={(ev) => {
              const summary = ev.target.value;
              setReq({
                ...req,
                summary,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="目的">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.purpose ?? ""}
            onChange={(ev) => {
              const purpose = ev.target.value;
              setReq({
                ...req,
                purpose,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="起">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.part_1 ?? ""}
            onChange={(ev) => {
              const part_1 = ev.target.value;
              setReq({
                ...req,
                part_1,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="承">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.part_2 ?? ""}
            onChange={(ev) => {
              const part_2 = ev.target.value;
              setReq({
                ...req,
                part_2,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="転">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.part_3 ?? ""}
            onChange={(ev) => {
              const part_3 = ev.target.value;
              setReq({
                ...req,
                part_3,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="結">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.part_4 ?? ""}
            onChange={(ev) => {
              const part_4 = ev.target.value;
              setReq({
                ...req,
                part_4,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="魅力">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.charm ?? ""}
            onChange={(ev) => {
              const charm = ev.target.value;
              setReq({
                ...req,
                charm,
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

export default Episode_Detail_Editor;
