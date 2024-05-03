import { TablesInsert } from "@supabase/database.type";
import { FC, useEffect, useState } from "react";
import { episodeApi } from "@/app/api/table/universe/episode.api";
import UIFormControl from "@/common/ui/form-control.ui";

const Episode_Editor: FC<{ initReq: TablesInsert<"episodes"> }> = ({ initReq }) => {
  const [req, setReq] = useState(initReq);
  const upsert = episodeApi.mutation.useUpsert();
  function onUpsert() {
    upsert.mutateAsync(req);
  }
  useEffect(() => {
    setReq(initReq);
  }, [initReq]);
  return (
    <form
      className="p-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        onUpsert();
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
        <UIFormControl labelText="要点">
          <textarea
            className="textarea textarea-bordered"
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
      </div>
      <div className="flex justify-end items-center">
        <button type="submit" className="btn btn-success">
          登録
        </button>
      </div>
    </form>
  );
};

export default Episode_Editor;
