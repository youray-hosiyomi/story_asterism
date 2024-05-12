import { episodeApi } from "@/app/api/table/universe/episode.api";
import { universePageLinkConfig } from "@/app/config/page-link.config";
import { EpisodeContext } from "@/app/features/universes/episode/context";
import Episode_MiniEditor from "@/app/features/universes/episode/mini-editor.component";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { useConfirm } from "@/common/ui/confirm.ui";
import { TablesInsert } from "@supabase/database.type";
import { Outlet, generatePath, useNavigate } from "react-router-dom";

const Universe_Episode_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { data: episodes, isLoading, refetch } = episodeApi.query.useList({ universe_id: universe.id });
  const { confirm } = useConfirm();
  const navigate = useNavigate();
  const openMiniEditor = (initReq: TablesInsert<"episodes"> = episodeApi.emptyReq(universe.id)) => {
    confirm({
      RenderContent: (props) => {
        return (
          <Episode_MiniEditor
            initReq={initReq}
            onSave={(newReq) => {
              if (newReq.id) {
                navigate(
                  generatePath(universePageLinkConfig["/universes/:universe_id/episodes/:episode_id"].path, {
                    universe_id: newReq.universe_id,
                    episode_id: newReq.id,
                    character_id: "",
                  }),
                );
              }

              props.ok();
            }}
            onCancel={props.cancel}
          />
        );
      },
    });
  };
  return (
    <>
      <EpisodeContext.Provider value={{ episodes, isLoading, refetch, openMiniEditor }}>
        <Outlet />
      </EpisodeContext.Provider>
    </>
  );
};

export default Universe_Episode_Layout;
