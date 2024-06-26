import { AuthPageFC } from "@/common/type/page.type";
import Universe_Template from "../template";
import { episodeApi } from "@/app/api/table/universe/episode.api";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import UIList from "@/common/ui/list.ui";
import { Tables } from "@supabase/database.type";
import DataNotFound from "@/app/features/data-not-found.component";
import { PlusIcon } from "lucide-react";
import { UniverseRouteLink } from "@/app/features/route-link.component";
import UILongText from "@/common/ui/long-text";
import { useEpisodeContext } from "@/app/features/universes/episode/hooks";

const Universe_Episodes_Page: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { openMiniEditor } = useEpisodeContext();
  const { data: episodes, isLoading } = episodeApi.query.useList({ universe_id: universe.id });
  const addEpisode = () => {
    openMiniEditor();
  };
  return (
    <Universe_Template
      className="p-2 lg:p-3"
      subItems={
        <>
          <button
            type="button"
            className="btn btn-success btn-sm btn-square"
            onClick={() => {
              addEpisode();
            }}
          >
            <PlusIcon />
          </button>
        </>
      }
    >
      <UIList<Tables<"episodes">> list={episodes} isLoading={isLoading} emptyContent={<DataNotFound />}>
        {({ data: episode }) => {
          return (
            <UniverseRouteLink
              path="/universes/:universe_id/episodes/:episode_id"
              universe_id={episode.universe_id}
              episode_id={episode.id}
              className="px-2 py-2 sm:px-3"
            >
              <div className="flex min-w-0 gap-x-4 px-2 py-2 sm:px-3">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {episode.title}
                  </p>
                  <div className="mt-1 flex text-xs leading-5 text-gray-500">
                    <UILongText className="truncate line-clamp-2">{episode.summary}</UILongText>
                  </div>
                </div>
              </div>
            </UniverseRouteLink>
          );
        }}
      </UIList>
    </Universe_Template>
  );
};

export default Universe_Episodes_Page;
