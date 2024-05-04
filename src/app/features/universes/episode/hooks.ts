import { useContext } from "react";
import { EpisodeContext, EpisodeDetailContext } from "./context";

export const useEpisodeContext = () => useContext(EpisodeContext);
export const useEpisodeDetailContext = () => useContext(EpisodeDetailContext);
