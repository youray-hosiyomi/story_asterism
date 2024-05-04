import { characterApi } from "@/app/api/table/universe/character.api";
import { UniversePageParam } from "@/app/config/page-link.config";
import { CharacterDetailContext, CharacterDetail_Mode } from "@/app/features/universes/character/context";
import { useUniverseUnion } from "@/app/features/universes/hooks";
import { AuthPageFC } from "@/common/type/page.type";
import { Outlet, useParams, useSearchParams } from "react-router-dom";
import Universe_Template from "../../template";
import Character_Mini_VList from "@/app/features/universes/character/mini-v-list.component";
import { useCharacterContext } from "@/app/features/universes/character/hooks";
import { UniverseRouteNavigate } from "@/app/features/route-navigate.component";

const Universe_Characters_Detail_Layout: AuthPageFC = () => {
  const { universe } = useUniverseUnion();
  const { openMiniEditor } = useCharacterContext();
  const { character_id } = useParams<UniversePageParam>();
  const [params, setParams] = useSearchParams();
  const {
    data: character,
    isLoading,
    refetch,
  } = characterApi.query.useFind({
    id: character_id ?? "",
    universe_id: universe.id,
  });
  if (!isLoading && !character) {
    return <UniverseRouteNavigate path="/universes/:universe_id/characters" universe_id={universe.id} />;
  }
  return (
    <>
      <Universe_Template className="flex divide-x divide-base-300">
        <div className="flex-none w-52 max-md:hidden overflow-y-auto">
          <Character_Mini_VList />
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
          <CharacterDetailContext.Provider
            value={{
              character,
              isLoading,
              refetch,
              mode: (params.get("mode") ?? "home") as CharacterDetail_Mode,
              onChangeMode(mode) {
                setParams((prev) => {
                  prev.set("mode", mode);
                  return prev;
                });
              },
            }}
          >
            <Outlet />
          </CharacterDetailContext.Provider>
        </div>
      </Universe_Template>
    </>
  );
};

export default Universe_Characters_Detail_Layout;
