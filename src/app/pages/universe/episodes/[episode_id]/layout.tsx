import { episodeApi } from "@/app/api/table/universe/episode.api";
import { UniversePageParam } from "@/app/config/page-link.config";
import { EpisodeDetailContext } from "@/app/features/universes/episode/context";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { Outlet, useParams } from "react-router-dom";
import Universe_Template from "../../template";
import Episode_Mini_VList from "@/app/features/universes/episode/mini-v-list.component";

const Universe_Episodes_Detail_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { episode_id } = useParams<UniversePageParam>();
  const {
    data: episode,
    isLoading,
    refetch,
  } = episodeApi.query.useFind({
    id: episode_id ?? "",
    universe_id: universe.id,
  });
  return (
    <Universe_Template className="flex divide-x divide-base-300">
      <div className="flex-none w-52 max-md:hidden overflow-y-auto">
        <Episode_Mini_VList />
      </div>
      <div className="flex-auto overflow-y-auto">
        <EpisodeDetailContext.Provider value={{ episode, isLoading, refetch }}>
          <Outlet />
        </EpisodeDetailContext.Provider>
      </div>
    </Universe_Template>
  );
};

export default Universe_Episodes_Detail_Layout;
