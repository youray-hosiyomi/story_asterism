import { useKeyActionEffect } from "@/common/utils/key-action.util";
import { Tables } from "@supabase/database.type";
import { PenToolIcon } from "lucide-react";
import { FC, useMemo } from "react";
import UILongText from "@/common/ui/long-text";
import UITimeline from "@/common/ui/timeline.ui";

type EpisodeTimeLineItem = {
  title: string;
  text?: string | null;
};

const Episode_DetailHome: FC<{ episode: Tables<"episodes">; startEdit: () => void }> = ({ episode, startEdit }) => {
  useKeyActionEffect({
    onCtrlE() {
      startEdit();
    },
  });
  const timelineItem = useMemo((): EpisodeTimeLineItem[] => {
    return [
      {
        title: "起",
        text: episode.part_1,
      },
      {
        title: "承",
        text: episode.part_2,
      },
      {
        title: "転",
        text: episode.part_3,
      },
      {
        title: "結",
        text: episode.part_4,
      },
    ];
  }, [episode]);
  return (
    <>
      <div className="space-y-2 py-2">
        <div className="flex max-md:flex-col items-start max-md:space-y-2 md:space-x-5 min-h-44">
          <div className="bg-base-200 min-h-40 w-full space-y-2 p-2">
            <div>
              <h3 className="text-xl font-bold">{episode.title}</h3>
            </div>
            <div>
              <UILongText className="text-sm">{episode.summary}</UILongText>
            </div>
          </div>
        </div>
        <UITimeline
          items={timelineItem.map((item) => {
            return {
              start: <div className="font-semibold">{item.title}</div>,
              end: item.text && (
                <div className="space-y-3">
                  <UILongText>{item.text}</UILongText>
                </div>
              ),
            };
          })}
        />
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          className="btn btn-circle"
          onClick={() => {
            startEdit();
          }}
        >
          <PenToolIcon />
        </button>
      </div>
    </>
  );
};

export default Episode_DetailHome;
