import { EventUnion } from "@/app/api/union/event.union.api";
import { FC, useState } from "react";
import { useUniverseUnion } from "../hooks";
import { useEventUnions } from "./hooks";
import { Tables } from "@supabase/database.type";
import UIList from "@/common/ui/list.ui";

interface Event_SelectorProps {
  period: Tables<"periods">;
}

const Event_Selector: FC<Event_SelectorProps> = ({ period }) => {
  const { universe } = useUniverseUnion();
  const [selectedEvent, setSelectedEvent] = useState<EventUnion | null>(null);
  const { data: eventUnions, isLoading } = useEventUnions({
    type: "period",
    universe_id: universe.id,
    period_id: period.id,
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <div></div>
        <div></div>
      </div>
      <UIList<EventUnion>
        isLoading={isLoading}
        list={eventUnions}
        selectConfig={{
          data2id: (union) => union.event.id,
          selectedId: selectedEvent?.event.id,
        }}
      >
        {({ data }) => {
          return (
            <div
              className="w-full"
              onClick={() => {
                setSelectedEvent(data);
              }}
            >
              {data.event.name}
            </div>
          );
        }}
      </UIList>
    </div>
  );
};

export default Event_Selector;
