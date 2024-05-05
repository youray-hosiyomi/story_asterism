import { episodeApi } from "@/app/api/table/universe/episode.api";
import { UniversePageParam } from "@/app/config/page-link.config";
import { EpisodeDetailContext, EpisodeDetail_Mode } from "@/app/features/universes/episode/context";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { Outlet, useParams, useSearchParams } from "react-router-dom";
import Universe_Template from "../../template";
import Episode_Mini_VList from "@/app/features/universes/episode/mini-v-list.component";
import { useEpisodeContext } from "@/app/features/universes/episode/hooks";
import { UniverseRouteNavigate } from "@/app/features/route-navigate.component";

const Universe_Episodes_Detail_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { openMiniEditor } = useEpisodeContext();
  const { episode_id } = useParams<UniversePageParam>();
  const [params, setParams] = useSearchParams();
  const {
    data: episode,
    isLoading,
    refetch,
  } = episodeApi.query.useFind({
    id: episode_id ?? "",
    universe_id: universe.id,
  });
  if (!isLoading && !episode) {
    return <UniverseRouteNavigate path="/universes/:universe_id/episodes" universe_id={universe.id} />;
  }
  return (
    <Universe_Template className="flex divide-x divide-base-300">
      <div className="flex-none w-52 max-md:hidden overflow-y-auto">
        <Episode_Mini_VList />
        <button
          type="button"
          className="w-full bg-base-200 hover:bg-base-300 text-center py-2"
          onClick={() => {
            openMiniEditor();
          }}
        >
          新規作成
        </button>
      </div>
      <div className="flex-auto overflow-y-auto">
        <EpisodeDetailContext.Provider
          value={{
            episode,
            isLoading,
            refetch,
            mode: (params.get("mode") ?? "home") as EpisodeDetail_Mode,
            onChangeMode(mode) {
              setParams((prev) => {
                prev.set("mode", mode);
                return prev;
              });
            },
          }}
        >
          <div className="p-2 md:p-3 animate-fadein">
            <Outlet />
          </div>
        </EpisodeDetailContext.Provider>
      </div>
    </Universe_Template>
  );
};

export default Universe_Episodes_Detail_Layout;
