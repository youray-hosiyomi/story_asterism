import { characterApi } from "@/app/api/table/universe/character.api";
import { UniversePageParam } from "@/app/config/page-link.config";
import { CharacterDetailContext } from "@/app/features/universes/character/context";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { Outlet, useParams } from "react-router-dom";
import Universe_Template from "../../template";
import Character_Mini_VList from "@/app/features/universes/character/mini-v-list.component";

const Universe_Characters_Detail_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { character_id } = useParams<UniversePageParam>();
  const {
    data: character,
    isLoading,
    refetch,
  } = characterApi.query.useFind({
    id: character_id ?? "",
    universe_id: universe.id,
  });
  return (
    <>
      <Universe_Template className="flex divide-x divide-base-300">
        <div className="flex-none w-52 max-md:hidden overflow-y-auto">
          <Character_Mini_VList />
        </div>
        <div className="flex-auto overflow-y-auto">
          <CharacterDetailContext.Provider value={{ character, isLoading, refetch }}>
            <Outlet />
          </CharacterDetailContext.Provider>
        </div>
      </Universe_Template>
    </>
  );
};

export default Universe_Characters_Detail_Layout;
