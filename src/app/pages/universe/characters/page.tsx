import { AuthPageFC } from "@/common/type/page.type";
import Universe_Template from "../template";
import UIList from "@/common/ui/list.ui";
import { Tables } from "@supabase/database.type";
import DataNotFound from "@/app/features/data-not-found.component";
import { PlusIcon } from "lucide-react";
import { useCharacterContext } from "@/app/features/universes/character/hooks";
import { UniverseRouteLink } from "@/app/features/route-link.component";
import { UniverseImg } from "@/app/features/universes/img.component";
import LongText from "@/common/ui/long-text";

const Universe_Characters_Page: AuthPageFC = () => {
  const { characters, isLoading, openMiniEditor } = useCharacterContext();
  const addCharacter = () => {
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
              addCharacter();
            }}
          >
            <PlusIcon />
          </button>
        </>
      }
    >
      <UIList<Tables<"characters">> list={characters} isLoading={isLoading} emptyContent={<DataNotFound />}>
        {({ data: character }) => {
          return (
            <UniverseRouteLink
              path="/universes/:universe_id/characters/:character_id"
              universe_id={character.universe_id}
              character_id={character.id}
              className="px-2 py-2 sm:px-3"
            >
              <div className="flex min-w-0 gap-x-4 items-center">
                <UniverseImg
                  className="w-10 h-10 outline outline-1 rounded-full"
                  universe_id={character.universe_id}
                  image_key={character.image_key}
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {character.name}
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    <LongText className="truncate line-clamp-2">{character.detail}</LongText>
                  </p>
                </div>
              </div>
            </UniverseRouteLink>
          );
        }}
      </UIList>
    </Universe_Template>
  );
};

export default Universe_Characters_Page;
