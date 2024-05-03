import { FC } from "react";
import UIList from "@/common/ui/list.ui";
import { Tables } from "@supabase/database.type";
import { UniverseRouteLink } from "@/app/features/route-link.component";
import DataNotFound from "@/app/features/data-not-found.component";
import { useEpisodeContext } from "@/app/features/universes/episode/hooks";
import { UniversePageParam } from "@/app/config/page-link.config";
import { useParams } from "react-router-dom";

const Episode_Mini_VList: FC = () => {
  const { episode_id } = useParams<UniversePageParam>();
  const { episodes, isLoading } = useEpisodeContext();
  return (
    <UIList<Tables<"episodes">>
      list={episodes}
      isLoading={isLoading}
      emptyContent={<DataNotFound />}
      className="ring-1 ring-base-300"
      selectConfig={{
        data2id(data) {
          return data.id;
        },
        selectedId: episode_id,
      }}
    >
      {({ data: episode }) => {
        return (
          <UniverseRouteLink
            className="px-2 py-2 sm:px-3 overflow-hidden"
            path="/universes/:universe_id/episodes/:episode_id"
            universe_id={episode.universe_id}
            episode_id={episode.id}
          >
            <div className="flex min-w-0 gap-x-4 items-center">
              <div className="min-w-0 flex-auto items-center">
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {episode.title}
                </span>
                <span className="mt-0.5 flex text-xs leading-5 text-gray-500">
                  <span className="relative truncate whitespace-nowrap text-ellipsis">{episode.summary}</span>
                </span>
              </div>
            </div>
          </UniverseRouteLink>
        );
      }}
    </UIList>
  );
};

export default Episode_Mini_VList;
