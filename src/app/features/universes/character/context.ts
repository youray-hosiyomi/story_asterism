import { Tables, TablesInsert } from "@supabase/database.type";
import { createContext } from "react";

interface CharacterContextProps {
  characters?: Tables<"characters">[];
  isLoading: boolean;
  refetch: () => void;
  openMiniEditor: (initReq?: TablesInsert<"characters">) => void;
}

export const CharacterContext = createContext<CharacterContextProps>({
  isLoading: false,
  refetch() {},
  openMiniEditor(initReq) {
    initReq;
  },
});

export type CharacterDetail_Mode = "home" | "editing" | "relations" | "groups" | "events" | "relations_editing";

interface CharacterDetailContextProps {
  character: Tables<"characters"> | null | undefined;
  isLoading: boolean;
  refetch: () => void;
  mode: CharacterDetail_Mode;
  onChangeMode: (mode: CharacterDetail_Mode) => void;
}

export const CharacterDetailContext = createContext<CharacterDetailContextProps>({
  character: null,
  isLoading: false,
  refetch() {},
  mode: "home",
  onChangeMode(mode) {
    mode;
  },
});
