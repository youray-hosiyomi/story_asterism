import { useKeyActionEffect } from "@/common/utils/key-action.util";
import { TablesInsert } from "@supabase/database.type";
import { PenToolIcon } from "lucide-react";
import { FC } from "react";
import { UniverseImg } from "../img.component";
import LongText from "@/common/ui/long-text";

const Character_DetailHome: FC<{ character: TablesInsert<"characters">; startEdit: () => void }> = ({
  character,
  startEdit,
}) => {
  useKeyActionEffect({
    onCtrlE() {
      startEdit();
    },
  });
  return (
    <>
      <div className="space-y-2 py-2">
        <div className="flex items-start space-x-5 min-h-44">
          <UniverseImg
            universe_id={character.universe_id}
            image_key={character.image_key}
            className="w-40 mt-2 rounded-lg bg-base-100 ring ring-base-content ring-offset-base-100 ring-offset-2"
          />
          <div className="bg-base-200 min-h-40 w-full space-y-2 p-2">
            <div>
              <h3 className="text-xl font-bold">{character.name}</h3>
            </div>
            <div>
              <LongText className="text-sm">{character.detail}</LongText>
            </div>
          </div>
        </div>
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

export default Character_DetailHome;
