import { useContext } from "react";
import { EpisodeContext } from "./context";

export const useEpisodeContext = () => useContext(EpisodeContext);
