import { characterApi } from "@/app/api/table/universe/character.api";
import { UILoadingBox } from "@/common/ui/loading.ui";
import { FC } from "react";
import { UniverseRouteNavigate } from "../../route-navigate.component";
import Character_Editor from "./editor.component";
import { useParams } from "react-router-dom";
import { UniversePageParam } from "@/app/config/page-link.config";
import { useUniverseUnion } from "../hooks";

const Character_Detail: FC = () => {
  const { universe } = useUniverseUnion();
  const { character_id } = useParams<UniversePageParam>();
  const { data: character, isLoading } = characterApi.query.useFind({
    id: character_id ?? "",
    universe_id: universe.id,
  });
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
