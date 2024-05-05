import { AuthPageFC } from "@/common/type/page.type";
import { EpisodeDetail_Mode } from "@/app/features/universes/episode/context";
import { OptionItem } from "@/common/type/option-item.type";
import Episode_Detail_Editor from "@/app/features/universes/episode/detail-editor.component";
import { UILoadingBox } from "@/common/ui/loading.ui";
import { useEpisodeDetailContext } from "@/app/features/universes/episode/hooks";
import Episode_DetailHome from "@/app/features/universes/episode/detail-home.component";
import { cn } from "@/common/utils/classname.util";

const baseModeOpts: OptionItem<EpisodeDetail_Mode>[] = [
  { value: "home", label: "詳細" },
  { value: "events", label: "イベント" },
];

const Universe_Episodes_Detail_Page: AuthPageFC = () => {
  const { episode, isLoading, mode, onChangeMode } = useEpisodeDetailContext();
  if (!episode || isLoading) {
    return <UILoadingBox />;
  }
  if (mode == "editing") {
    return <Episode_Detail_Editor initReq={episode} goHome={() => onChangeMode("home")} />;
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
      {mode == "home" && <Episode_DetailHome episode={episode} startEdit={() => onChangeMode("editing")} />}
    </div>
  );
};

export default Universe_Episodes_Detail_Page;
