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
