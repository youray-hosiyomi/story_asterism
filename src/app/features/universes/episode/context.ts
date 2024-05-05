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

export type EpisodeDetail_Mode = "home" | "editing" | "events" | "sentence" | "sentence-editing";

interface EpisodeDetailContextProps {
  episode: Tables<"episodes"> | null | undefined;
  isLoading: boolean;
  refetch: () => void;
  mode: EpisodeDetail_Mode;
  onChangeMode: (mode: EpisodeDetail_Mode) => void;
}

export const EpisodeDetailContext = createContext<EpisodeDetailContextProps>({
  episode: null,
  isLoading: false,
  refetch() {},
  mode: "home",
  onChangeMode(mode) {
    mode;
  },
});
