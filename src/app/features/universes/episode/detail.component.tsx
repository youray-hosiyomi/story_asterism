import { episodeApi } from "@/app/api/table/universe/episode.api";
import { UILoadingBox } from "@/common/ui/loading.ui";
import { FC } from "react";
import { UniverseRouteNavigate } from "../../route-navigate.component";
import Episode_Editor from "./editor.component";
import { useParams } from "react-router-dom";
import { UniversePageParam } from "@/app/config/page-link.config";
import { useUniverseUnion } from "../hooks";

const Episode_Detail: FC = () => {
  const { universe } = useUniverseUnion();
  const { episode_id } = useParams<UniversePageParam>();
  const { data: episode, isLoading } = episodeApi.query.useFind({
    id: episode_id ?? "",
    universe_id: universe.id,
  });
  if (isLoading) {
    return <UILoadingBox />;
  }
  if (!episode) {
    return <UniverseRouteNavigate path="/universes/:universe_id/episodes" universe_id={universe.id} />;
  }
  return (
    <>
      <Episode_Editor initReq={episode} />
    </>
  );
};

export default Episode_Detail;
