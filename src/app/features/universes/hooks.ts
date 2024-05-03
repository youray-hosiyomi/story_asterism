import { universeApi } from "@/app/api/table/universe/universe.api";
import { UniverseUnion, getUniverseUnion } from "@/app/api/union/universe.union.api";
import { useQ } from "@/common/utils/api.util";
import { useContext } from "react";
import { UniverseContext } from "./context";

export function useGetUniverseUnion(universeId: string) {
  return useQ(universeApi.tableName, universeId, getUniverseUnion);
}

export const useUniverseContext = () => useContext(UniverseContext);

export const useUniverseUnion = (): UniverseUnion => {
  const { universeUnion } = useUniverseContext();
  if (!universeUnion) {
    throw new Error("universe is empty");
  }
  return universeUnion;
};
