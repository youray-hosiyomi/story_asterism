import { DateUtil } from "@/common/utils/date.util";
import { TablesInsert } from "@supabase/database.type";
import { FC } from "react";

const Event_DatetimeInput: FC<{
  event: TablesInsert<"events">;
  period: TablesInsert<"periods">;
  onChange: (event: TablesInsert<"events">) => void;
}> = ({ event, period, onChange }) => {
  if (period.is_real) {
    return (
      <>
        <input
          type="datetime-local"
          className="input input-bordered"
          value={DateUtil.date2yyyymmddhhmm(
            new Date(event.year ?? 0, event.month ?? 0, event.date ?? 0, event.hour ?? 0, event.minute ?? 0),
          )}
          onChange={(ev) => {
            const date = DateUtil.toDate(ev.target.value);
            onChange({
              ...event,
              year: date.getFullYear(),
              month: date.getMonth(),
              date: date.getDate(),
              hour: date.getHours(),
              minute: date.getMinutes(),
            });
          }}
        />
      </>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="number"
          className="input input-bordered input-sm text-right w-1/4"
          value={event.year ?? 0}
          onChange={(ev) => {
            onChange({
              ...event,
              year: Number(ev.target.value),
            });
          }}
        />
        <span>年</span>
        <input
          type="number"
          className="input input-bordered input-sm text-right w-1/4"
          value={event.month ?? 0}
          onChange={(ev) => {
            onChange({
              ...event,
              month: Number(ev.target.value),
            });
          }}
        />
        <span>月</span>
        <input
          type="number"
          className="input input-bordered input-sm text-right w-1/4"
          value={event.date ?? 0}
          onChange={(ev) => {
            onChange({
              ...event,
              date: Number(ev.target.value),
            });
          }}
        />
        <span>日</span>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          className="input input-bordered input-sm text-right w-1/4"
          value={event.hour ?? 0}
          onChange={(ev) => {
            onChange({
              ...event,
              hour: Number(ev.target.value),
            });
          }}
        />
        <span>時</span>
        <input
          type="number"
          className="input input-bordered input-sm text-right w-1/4"
          value={event.minute ?? 0}
          onChange={(ev) => {
            onChange({
              ...event,
              minute: Number(ev.target.value),
            });
          }}
        />
        <span>分</span>
      </div>
    </div>
  );
};

export default Event_DatetimeInput;
