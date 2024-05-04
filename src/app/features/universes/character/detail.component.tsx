import { UILoadingBox } from "@/common/ui/loading.ui";
import { FC } from "react";
import { UniverseRouteNavigate } from "../../route-navigate.component";
import Character_Editor from "./editor.component";
import { useUniverseUnion } from "../hooks";
import { useCharacterDetailContext } from "./hooks";

const Character_Detail: FC = () => {
  const { universe } = useUniverseUnion();
  const { character, isLoading } = useCharacterDetailContext();
  if (isLoading) {
    return <UILoadingBox />;
  }
  if (!character) {
    return <UniverseRouteNavigate path="/universes/:universe_id/characters" universe_id={universe.id} />;
  }
  return (
    <>
      <Character_Editor initReq={character} />
    </>
  );
};

export default Character_Detail;
