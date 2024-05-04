import { useContext } from "react";
import { CharacterContext, CharacterDetailContext } from "./context";

export const useCharacterContext = () => useContext(CharacterContext);
export const useCharacterDetailContext = () => useContext(CharacterDetailContext);
