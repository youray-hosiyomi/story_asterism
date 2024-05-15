import { Tables, TablesInsert } from "@supabase/database.type";
import { FC, useCallback } from "react";
import { useSceneUnions } from "./hooks";
import { UILoadingContent } from "@/common/ui/loading.ui";
import { ArrowLeftIcon, PenToolIcon } from "lucide-react";
import { useKeyActionEffect } from "@/common/utils/key-action.util";
import { useConfirm } from "@/common/ui/confirm.ui";
import { sceneApi } from "@/app/api/table/universe/scene.api";
import Scene_Editor from "./editor.component";
import UILongText from "@/common/ui/long-text";
import { cn } from "@shadcn/lib/utils";

type Scene_ListProps = {
  episode: Tables<"episodes">;
  editing?: boolean;
  toggleEditing?: () => void;
};

const Scene_List: FC<Scene_ListProps> = ({ episode, editing, toggleEditing }) => {
  const { confirm } = useConfirm();
  const { data: sceneUnions, isLoading } = useSceneUnions({ episode_id: episode.id, universe_id: episode.universe_id });
  const edit = useCallback(
    (initReq: TablesInsert<"scenes"> = sceneApi.emptyReq(episode.universe_id, episode.id)) => {
      confirm({
        RenderContent: (props) => {
          return (
            <Scene_Editor
              initReq={initReq}
              onSave={() => {
                props.ok();
              }}
              onCancel={props.cancel}
            />
          );
        },
      });
    },
    [confirm, episode.id, episode.universe_id],
  );
  useKeyActionEffect({
    onCtrlE() {
      !editing && toggleEditing && toggleEditing();
    },
    onEscape() {
      editing && toggleEditing && toggleEditing();
    },
    onCtrlS() {
      editing && toggleEditing && toggleEditing();
    },
  });
  return (
    <UILoadingContent isLoading={isLoading} className="loading-lg">
      <div>
        <div className="space-y-3">
          {sceneUnions?.map((union) => {
            return (
              <div
                key={union.scene.id}
                className={cn("rounded-md p-3 space-y-1 border border-base-content", editing && "hover:shadow-lg")}
                onClick={() => {
                  editing && edit(union.scene);
                }}
              >
                <div className="font-semibold">{union.scene.name}</div>
                <UILongText className="text-sm">{union.scene.detail}</UILongText>
              </div>
            );
          })}
          {editing && (
            <div className="w-full text-center">
              <button
                className="btn btn-outline w-72"
                onClick={() => {
                  editing && edit();
                }}
              >
                <div>追加</div>
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            className="btn btn-circle"
            onClick={() => {
              toggleEditing && toggleEditing();
            }}
          >
            {editing ? <ArrowLeftIcon /> : <PenToolIcon />}
          </button>
        </div>
      </div>
    </UILoadingContent>
  );
};

export default Scene_List;
