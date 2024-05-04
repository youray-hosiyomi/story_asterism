import { FC } from "react";
import Episode_Editor from "./editor.component";
import { useEpisodeDetailContext } from "./hooks";
import { UILoadingBox } from "@/common/ui/loading.ui";
import { UniverseRouteNavigate } from "../../route-navigate.component";
import { useUniverseUnion } from "../hooks";

const Episode_Detail: FC = () => {
  const { universe } = useUniverseUnion();
  const { episode, isLoading } = useEpisodeDetailContext();
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
