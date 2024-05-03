import { Tables, TablesInsert } from "@supabase/database.type";
import { createContext } from "react";

interface EpisodeContextProps {
  episodes?: Tables<"episodes">[];
  isLoading: boolean;
  refetch: () => void;
  openMiniEditor: (initReq?: TablesInsert<"episodes">) => void;
}

export const EpisodeContext = createContext<EpisodeContextProps>({
  isLoading: false,
  refetch() {},
  openMiniEditor(initReq) {
    initReq;
  },
});
