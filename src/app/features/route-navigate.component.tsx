import { PageLinkConfig } from "@/common/type/page.type";
import { FC, useMemo } from "react";
import { Navigate, generatePath } from "react-router-dom";
import { UniversePageParam, UniversePagePath, universePageLinkConfig } from "../config/page-link.config";

export interface BaseRouteNavigateProps<Path extends string> {
  path: Path;
}

export interface RouteNavigateProps<Props extends object, Path extends string> extends BaseRouteNavigateProps<Path> {
  pageLinkConfig: PageLinkConfig<Props, Path>;
  replacePath?: (path: Path) => string;
}

function RouteNavigate<Props extends object = object, Path extends string = string>({
  path: outerPath,
  pageLinkConfig,
  replacePath,
}: RouteNavigateProps<Props, Path>) {
  const path = useMemo(() => {
    const link = pageLinkConfig[outerPath];
    const path = replacePath ? replacePath(link.path) : link.path;
    return path;
  }, [outerPath, pageLinkConfig, replacePath]);
  return <Navigate to={path} replace />;
}

export const UniverseRouteNavigate: FC<
  BaseRouteNavigateProps<UniversePagePath> & { [key in UniversePageParam]?: string }
> = ({ universe_id, character_id, episode_id, ...props }) => {
  function replacePath(path: UniversePagePath) {
    return generatePath(path, {
      universe_id: universe_id ?? null,
      character_id: character_id ?? null,
      episode_id: episode_id ?? null,
    });
  }
  return <RouteNavigate pageLinkConfig={universePageLinkConfig} {...props} replacePath={replacePath} />;
};

export default RouteNavigate;
