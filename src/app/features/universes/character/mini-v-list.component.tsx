import { FC } from "react";
import UIList from "@/common/ui/list.ui";
import { Tables } from "@supabase/database.type";
import { UniverseRouteLink } from "@/app/features/route-link.component";
import DataNotFound from "@/app/features/data-not-found.component";
import { useCharacterContext } from "@/app/features/universes/character/hooks";
import { UniverseImg } from "../img.component";
import { UniversePageParam } from "@/app/config/page-link.config";
import { useParams } from "react-router-dom";

const Character_Mini_VList: FC = () => {
  const { character_id } = useParams<UniversePageParam>();
  const { characters, isLoading } = useCharacterContext();
  return (
    <UIList<Tables<"characters">>
      list={characters}
      isLoading={isLoading}
      emptyContent={<DataNotFound />}
      className="ring-1 ring-base-300"
      selectConfig={{
        data2id(data) {
          return data.id;
        },
        selectedId: character_id,
      }}
    >
      {({ data: character }) => {
        return (
          <UniverseRouteLink
            className="px-2 py-2 sm:px-3 overflow-hidden"
            path="/universes/:universe_id/characters/:character_id"
            universe_id={character.universe_id}
            character_id={character.id}
          >
            <div className="flex min-w-0 gap-x-4 items-center">
              <UniverseImg
                className="w-8 h-8 outline outline-1 rounded-full"
                universe_id={character.universe_id}
                image_key={character.image_key}
              />
              <div className="min-w-0 flex-auto items-center">
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {character.name}
                </span>
                <span className="mt-0.5 flex text-xs leading-5 text-gray-500">
                  <span className="relative truncate whitespace-nowrap text-ellipsis">{character.detail}</span>
                </span>
              </div>
            </div>
          </UniverseRouteLink>
        );
      }}
    </UIList>
  );
};

export default Character_Mini_VList;
