import { useContext } from "react";
import { CharacterContext, CharacterDetailContext } from "./context";
import { Tables } from "@supabase/database.type";

export const useCharacterContext = () => useContext(CharacterContext);
export const useCharacterDetailContext = () => useContext(CharacterDetailContext);

export const useCharacter = (): Tables<"characters"> => {
  const { character } = useCharacterDetailContext();
  if (!character) throw new Error("character is null");
  return character;
};
