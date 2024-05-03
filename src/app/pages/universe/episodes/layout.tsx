import { episodeApi } from "@/app/api/table/universe/episode.api";
import { EpisodeContext } from "@/app/features/universes/episode/context";
import Episode_MiniEditor from "@/app/features/universes/episode/mini-editor.component";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { useConfirm } from "@/common/ui/confirm.ui";
import { TablesInsert } from "@supabase/database.type";
import { Outlet } from "react-router-dom";

const Universe_Episode_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { data: episodes, isLoading, refetch } = episodeApi.query.useList({ universe_id: universe.id });
  const { confirm } = useConfirm();
  const openMiniEditor = (initReq: TablesInsert<"episodes"> = episodeApi.emptyReq(universe.id)) => {
    confirm({
      RenderContent: (props) => {
        return <Episode_MiniEditor initReq={initReq} onSave={props.ok} onCancel={props.cancel} />;
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
