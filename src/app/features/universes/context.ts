import { UniverseUnion } from "@/app/api/union/universe.union.api";
import { createContext } from "react";

interface UniverseContextProps {
  universeUnion: UniverseUnion | null;
  universeId: string;
  isLoading: boolean;
  refetch: () => void;
}

export const UniverseContext = createContext<UniverseContextProps>({
  universeUnion: null,
  universeId: "",
  isLoading: false,
  refetch() {},
});
