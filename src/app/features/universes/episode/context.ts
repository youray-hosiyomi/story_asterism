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

interface EpisodeDetailContextProps {
  episode: Tables<"episodes"> | null | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export const EpisodeDetailContext = createContext<EpisodeDetailContextProps>({
  episode: null,
  isLoading: false,
  refetch() {},
});
