import { FC } from "react";
import Character_Detail_Editor from "./detail-editor.component";
import { useCharacterDetailContext } from "./hooks";
import { cn } from "@/common/utils/classname.util";
import { OptionItem } from "@/common/type/option-item.type";
import Character_DetailHome from "./detail-home.component";
import { CharacterDetail_Mode } from "./context";
import { UILoadingBox } from "@/common/ui/loading.ui";

const baseModeOpts: OptionItem<CharacterDetail_Mode>[] = [
  { value: "home", label: "詳細" },
  { value: "episodes", label: "エピソード" },
  { value: "events", label: "イベント" },
  { value: "relations", label: "関係性" },
];

const Character_Detail: FC = () => {
  const { character, isLoading, mode, onChangeMode } = useCharacterDetailContext();
  if (!character || isLoading) {
    return <UILoadingBox />;
  }
  if (mode == "editing") {
    return (
      <>
        <Character_Detail_Editor initReq={character} goHome={() => onChangeMode("home")} />
      </>
    );
  }
  return (
    <div className="space-y-2">
      <div role="tablist" className="tabs tabs-bordered">
        {baseModeOpts.map((opt) => {
          return (
            <a
              key={opt.value}
              role="tab"
              className={cn("tab", mode == opt.value ? "tab-active font-bold bg-base-200" : "")}
              onClick={(ev) => {
                ev.preventDefault();
                onChangeMode(opt.value);
              }}
            >
              {opt.label}
            </a>
          );
        })}
      </div>
      {mode == "home" && <Character_DetailHome character={character} startEdit={() => onChangeMode("editing")} />}
    </div>
  );
};

export default Character_Detail;
