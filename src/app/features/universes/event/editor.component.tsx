import { EventUnionReq } from "@/app/api/union/event.union.api";
import { FC, useCallback, useEffect, useState } from "react";
import { useUpsertEventUnion } from "./hooks";
import UIFormControl from "@/common/ui/form-control.ui";
import { Tables, TablesInsert } from "@supabase/database.type";
import { periodApi } from "@/app/api/table/universe/period.api";
import { useConfirm } from "@/common/ui/confirm.ui";
import Period_Editor from "../period/editor.component";
import Event_DatetimeInput from "./datetime-input.component";

const Event_Editor: FC<{ initReq: EventUnionReq; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const { confirm } = useConfirm();
  const [req, setReq] = useState<EventUnionReq>(initReq);
  const upsert = useUpsertEventUnion();
  const { data: periods, isLoading } = periodApi.query.useList({ universe_id: initReq.event.universe_id });
  // const isNew: boolean = useMemo(() => !req.event.id, [req]);
  const startEditPeriod = useCallback(
    (periodReq?: TablesInsert<"periods">) => {
      const req = periodReq ?? periodApi.emptyReq(initReq.event.universe_id);
      confirm({
        RenderContent: (props) => {
          return <Period_Editor initReq={req} onSave={props.ok} onCancel={props.cancel} />;
        },
      });
    },
    [confirm, initReq.event.universe_id],
  );
  const onChangePeriod = useCallback(
    (period: Tables<"periods"> | null | undefined) => {
      if (period) {
        setReq((prev) => {
          return {
            ...prev,
            event: {
              ...prev.event,
              period_id: period.id,
            },
            period,
          };
        });
      } else {
        setReq((prev) => {
          return {
            ...prev,
            event: {
              ...prev.event,
              period_id: "",
            },
            period: periodApi.emptyReq(initReq.event.universe_id),
          };
        });
      }
    },
    [initReq.event.universe_id],
  );
  useEffect(() => {
    if (!isLoading) {
      const period = periods?.at(0);
      onChangePeriod(period);
      if (!period) {
        startEditPeriod();
      }
    }
  }, [isLoading, onChangePeriod, periods, startEditPeriod]);
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
        <UIFormControl labelText="時間軸" className="space-y-2">
          <select
            className="select select-bordered"
            value={req.event.period_id}
            onChange={(ev) => {
              const period_id = ev.target.value;
              const period = periods?.find((period) => period.id == period_id);
              onChangePeriod(period);
              if (!period) {
                startEditPeriod();
              }
            }}
          >
            {periods?.map((period) => {
              return (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              );
            })}
            <option value="">-- 新規 --</option>
          </select>
        </UIFormControl>
        <UIFormControl labelText="日時">
          <Event_DatetimeInput
            event={req.event}
            period={req.period}
            onChange={(nextEvent) => {
              setReq({
                ...req,
                event: nextEvent,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="イベント名">
          <input
            className="input input-bordered"
            value={req.event.name}
            onChange={(ev) => {
              setReq({
                ...req,
                event: {
                  ...req.event,
                  name: ev.target.value,
                },
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="詳細">
          <textarea
            className="textarea textarea-bordered min-h-52"
            value={req.event.detail ?? ""}
            onChange={(ev) => {
              setReq({
                ...req,
                event: {
                  ...req.event,
                  detail: ev.target.value,
                },
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

export default Event_Editor;
