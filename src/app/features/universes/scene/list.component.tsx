import { Tables, TablesInsert } from "@supabase/database.type";
import { FC, useCallback } from "react";
import { useSceneUnions } from "./hooks";
import { UILoadingContent } from "@/common/ui/loading.ui";
import { ArrowLeftIcon, PenToolIcon, TrashIcon } from "lucide-react";
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
  const { confirm, baseConfirm } = useConfirm();
  const { data: sceneUnions, isLoading } = useSceneUnions({ episode_id: episode.id, universe_id: episode.universe_id });
  const deleteScene = sceneApi.mutation.useDelete();
  const onEdit = useCallback(
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
  const onDelete = useCallback(
    (scene: Tables<"scenes">) => {
      baseConfirm({
        message: "本当に削除しますか?",
        themeColor: "error",
        okFunc: async () => {
          await deleteScene.mutateAsync({ id: scene.id, universe_id: scene.universe_id });
        },
      });
    },
    [baseConfirm, deleteScene],
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
                className={cn(
                  "rounded-md p-3 space-y-1 border flex items-center border-base-content group",
                  editing && "hover:shadow-lg",
                )}
              >
                <div className="flex-auto">
                  <div className="font-semibold">{union.scene.name}</div>
                  <UILongText className="text-sm">{union.scene.detail}</UILongText>
                </div>
                {editing && (
                  <div className="flex-none hidden group-hover:flex items-center space-x-2">
                    <button
                      className="btn btn-sm btn-circle btn-success btn-outline"
                      onClick={() => {
                        onEdit(union.scene);
                      }}
                    >
                      <PenToolIcon />
                    </button>
                    <button
                      className="btn btn-sm btn-circle btn-error btn-outline"
                      onClick={() => {
                        onDelete(union.scene);
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {editing && (
            <div className="w-full text-center">
              <button
                className="btn btn-outline w-72"
                onClick={() => {
                  editing && onEdit();
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
