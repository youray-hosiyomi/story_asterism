import { AuthPageFC } from "@/common/type/page.type";
import { CharacterDetail_Mode } from "@/app/features/universes/character/context";
import { OptionItem } from "@/common/type/option-item.type";
import Character_Detail_Editor from "@/app/features/universes/character/detail-editor.component";
import { UILoadingBox } from "@/common/ui/loading.ui";
import { useCharacterDetailContext } from "@/app/features/universes/character/hooks";
import Character_DetailHome from "@/app/features/universes/character/detail-home.component";
import { cn } from "@/common/utils/classname.util";

const baseModeOpts: OptionItem<CharacterDetail_Mode>[] = [
  { value: "home", label: "詳細" },
  { value: "groups", label: "グループ" },
  { value: "events", label: "イベント" },
  { value: "relations", label: "関係性" },
];

const Universe_Characters_Detail_Page: AuthPageFC = () => {
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

export default Universe_Characters_Detail_Page;
