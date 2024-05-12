import UILongText from "@/common/ui/long-text";
import { useKeyActionEffect } from "@/common/utils/key-action.util";
import { Tables } from "@supabase/database.type";
import { PenToolIcon } from "lucide-react";
import { FC } from "react";

const Episode_DetailSentence: FC<{ episode: Tables<"episodes">; startEdit: () => void }> = ({ episode, startEdit }) => {
  useKeyActionEffect({
    onCtrlE() {
      startEdit();
    },
  });
  return (
    <>
      <div>
        <UILongText>{episode.content}</UILongText>
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

export default Episode_DetailSentence;
