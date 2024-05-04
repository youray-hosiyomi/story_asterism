import { UILoadingBox } from "@/common/ui/loading.ui";
import { FC } from "react";
import { UniverseRouteNavigate } from "../../route-navigate.component";
import Character_Detail_Editor from "./detail-editor.component";
import { useUniverseUnion } from "../hooks";
import { useCharacterDetailContext } from "./hooks";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/common/utils/classname.util";
import { OptionItem } from "@/common/type/option-item.type";
import Character_DetailHome from "./detail-home.component";

type Mode = "home" | "editing" | "relations" | "events" | "relations_editing";
type UseModeReturns = {
  mode: Mode;
  onChangeMode: (mode: Mode) => void;
};

function useMode(): UseModeReturns {
  const [params, setParams] = useSearchParams();
  return {
    mode: (params.get("mode") ?? "home") as Mode,
    onChangeMode(mode) {
      setParams((prev) => {
        prev.set("mode", mode);
        return prev;
      });
    },
  };
}

const baseModeOpts: OptionItem<Mode>[] = [
  { value: "home", label: "詳細" },
  { value: "events", label: "イベント" },
  { value: "relations", label: "関係性" },
];

const Character_Detail: FC = () => {
  const { universe } = useUniverseUnion();
  const { character, isLoading } = useCharacterDetailContext();
  const { mode, onChangeMode } = useMode();
  if (isLoading) {
    return <UILoadingBox />;
  }
  if (!character) {
    return <UniverseRouteNavigate path="/universes/:universe_id/characters" universe_id={universe.id} />;
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
